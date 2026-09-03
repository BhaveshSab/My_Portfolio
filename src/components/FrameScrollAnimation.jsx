import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

/**
 * "Welcome to my Portfolio" — the laptop cinematic.
 * A 450vh scroll track keeps a full-screen canvas pinned while scrolling
 * scrubs the 240-frame laptop-opening clip — gradual enough to still feel
 * cinematic, but short enough that About arrives noticeably sooner than the
 * original 600vh pacing.
 * The laptop video lives in src/assets/image2 (240 frames) — the person
 * footage in the hero (public/images, 63 frames) is separate and untouched.
 *
 * Reliability fixes vs. the original implementation:
 *  - opacity/blur are scrubbed imperatively from the section-scoped progress
 *    (framer-motion 12.38/13.x animates style-prop opacity/filter via WAAPI
 *    against whole-page scroll, which desynced the title from this section).
 *  - preload counts failures, resets safely, and never hangs the loader.
 */
const DEFAULT_FRAME_COUNT = 240;
const frameUrl = (index) =>
  new URL(
    `../assets/image2/ezgif-frame-${String(index + 1).padStart(3, "0")}.jpg`,
    import.meta.url
  ).href;

const FrameScrollAnimation = ({ frameCount = DEFAULT_FRAME_COUNT }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const canvasWrapRef = useRef(null);
  const headingRef = useRef(null);
  const images = useRef([]);
  const [loaded, setLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // 1. Scroll tracking, scoped to this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // 2. Smooth eased progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // 3. Progress → laptop frame index (hold the last frames at the end)
  const frameIndex = useTransform(smoothProgress, [0, 0.92], [0, frameCount - 1]);

  // 4. Anti-gravity 3D drift (transforms update inline, so framer is fine)
  const y = useTransform(smoothProgress, [0, 1], ["0%", "-10%"]);
  const rotateX = useTransform(smoothProgress, [0, 0.5, 1], [0, 15, 0]);
  const rotateY = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [0, -10, 10, 0]);
  const scale = useTransform(smoothProgress, [0, 0.8, 0.95], [1, 1.05, 1.2]);
  const z = useTransform(smoothProgress, [0, 1], [0, 100]);

  // 5. Final scene fade + blur (applied imperatively — see header note)
  const opacity = useTransform(smoothProgress, [0.85, 0.96], [1, 0]);
  const blur = useTransform(
    smoothProgress,
    [0.85, 0.96],
    ["blur(0px)", "blur(20px)"]
  );

  // 6. Heading — appears over the laptop as it opens, holds, then hands off
  const headingOpacity = useTransform(
    smoothProgress,
    [0.15, 0.3, 0.68, 0.82],
    [0, 1, 1, 0]
  );
  const headingY = useTransform(smoothProgress, [0.15, 0.3], [36, 0]);

  useEffect(() => {
    const sync = () => {
      if (canvasWrapRef.current) {
        canvasWrapRef.current.style.opacity = opacity.get().toFixed(4);
        canvasWrapRef.current.style.filter = blur.get();
      }
      if (headingRef.current) {
        headingRef.current.style.opacity = headingOpacity.get().toFixed(4);
        headingRef.current.style.transform = `translateY(${headingY.get().toFixed(2)}px)`;
      }
    };
    sync();
    const unsubs = [opacity, blur, headingOpacity, headingY].map((mv) =>
      mv.on("change", sync)
    );
    return () => unsubs.forEach((un) => un());
  }, [opacity, blur, headingOpacity, headingY]);

  // Preloading — robust, StrictMode-safe, never hangs on failures
  useEffect(() => {
    let cancelled = false;
    let loadedCount = 0;
    images.current = [];

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = frameUrl(i);
      const done = () => {
        if (cancelled) return;
        loadedCount++;
        setLoadingProgress(Math.floor((loadedCount / frameCount) * 100));
        if (loadedCount === frameCount) setLoaded(true);
      };
      img.onload = done;
      img.onerror = done;
      images.current.push(img);
    }

    return () => {
      cancelled = true;
    };
  }, [frameCount]);

  // Canvas rendering — redraw whenever the scrubbed frame changes
  useEffect(() => {
    if (!loaded) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const render = () => {
      const index = Math.max(
        0,
        Math.min(frameCount - 1, Math.round(frameIndex.get()))
      );
      const img = images.current[index];
      if (!img || !img.complete || img.naturalHeight === 0) return;

      const { clientWidth: cw, clientHeight: ch } = canvas;
      ctx.clearRect(0, 0, cw, ch);
      // Responsive cover fit — coordinates are in CSS-pixel space; the DPR
      // transform below maps them onto the higher-resolution backing store.
      const scaleFit = Math.max(cw / img.width, ch / img.height);
      const dw = img.width * scaleFit;
      const dh = img.height * scaleFit;
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    };

    const resizeCanvas = () => {
      // Previously `canvas.width = window.innerWidth` sized the backing store
      // in CSS pixels, treating 1 canvas pixel as 1 device pixel. On every
      // screen above 1x DPR (Retina Macs, most Windows laptops at 150-200%
      // scaling, phones) the browser then had to upscale that raster again to
      // fill the real pixel grid — this was the main source of the blur.
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      const cw = window.innerWidth;
      const ch = window.innerHeight;
      const bw = Math.max(1, Math.round(cw * dpr));
      const bh = Math.max(1, Math.round(ch * dpr));
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      render();
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    const unsubscribe = frameIndex.on("change", render);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      unsubscribe();
    };
  }, [loaded, frameIndex, frameCount]);

  return (
    <section
      ref={containerRef}
      aria-label="Welcome to my portfolio — laptop cinematic"
      className="relative h-[450vh] bg-black"
    >
      {/* Sticky full-screen viewport: canvas pinned while the track scrolls */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center perspective-2000">
        {/* Loading overlay */}
        {!loaded && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black">
            <div className="text-[#cbb59d] font-mono text-[10px] uppercase tracking-[0.5em] mb-4">
              Syncing Core Frames... {loadingProgress}%
            </div>
            <div className="w-1/4 h-[1px] bg-[#cbb59d]/10 overflow-hidden">
              <div
                className="h-full bg-[#cbb59d] transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* The laptop frames, drifting in 3D while they scrub */}
        <motion.div
          ref={canvasWrapRef}
          style={{
            y,
            rotateX,
            rotateY,
            scale,
            z,
            transformStyle: "preserve-3d",
          }}
          className="relative w-full h-full overflow-hidden will-change-transform"
        >
          <canvas ref={canvasRef} className="w-full h-full object-cover" />
        </motion.div>

        {/* Cinematic vignette */}
        <div className="absolute inset-0 pointer-events-none bg-radial-vignette opacity-40 z-10" />
        {/* Legibility scrim behind the heading */}
        <div className="absolute inset-0 pointer-events-none z-20 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0)_70%)]" />

        {/* Welcome title, centered over the laptop */}
        <div
          ref={headingRef}
          style={{ opacity: 0 }}
          className="absolute inset-x-0 top-[46%] -translate-y-1/2 z-30 flex flex-col items-center justify-center text-center pointer-events-none px-6"
        >
          <h3 className="text-[#E8DFD8] text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.95] drop-shadow-[0_4px_22px_rgba(0,0,0,0.9)]">
            Welcome to my <span className="text-[#cbb59d]">Portfolio</span>
          </h3>
          <p className="mt-5 md:mt-7 text-[#cbb59d] font-mono text-[10px] md:text-xs uppercase tracking-[0.6em] drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            Core System Interface
          </p>
        </div>
      </div>
    </section>
  );
};

export default FrameScrollAnimation;
