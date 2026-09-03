import React, { useEffect, useRef, useState } from 'react';
import { useScroll, useSpring, useTransform } from 'framer-motion';
import { FiArrowRight, FiDownload } from 'react-icons/fi';

/**
 * Person cinematic — 117 exported frames (1920×1080 upscaled export,
 * Gemini watermark removed), scrubbed by scroll.
 * One scrollYProgress drives the frames AND the copy, so nothing
 * ever plays on its own, jumps, or fights a second animation.
 *
 * Sequence while you scroll the 300vh track (the whole clip + copy finishes
 * in ~3 viewport heights of scrolling):
 *   0.00–0.60  brand + title (title always visible), then the three role
 *              lines stage in one by one
 *   0.58–0.72  quote + name (right side)
 *   0.72–0.82  CTAs + gold stamp (bottom)
 *   0.88–1.00  the whole hero dims, blurs and hands off to the next section
 *
 * NOTE: opacity/filter values are applied imperatively instead of through
 * framer's `style={{ opacity: motionValue }}` path. Scroll-linked
 * opacity/filter styles are animated via the Web Animations API, and on
 * framer-motion 12.38.x AND 13.2.x those animations scrub against WHOLE-PAGE
 * scroll instead of the tracked element's offset (verified empirically). The
 * `useScroll` MotionValue itself IS section-scoped (transforms update
 * correctly), so scrubbing opacity/filter from that MotionValue keeps every
 * property locked to the hero's own track.
 */
const FRAME_COUNT = 117;
// Clean upscaled clip (Downloads/ezgif-2673827a9709ae4d-jpg.zip) — 1920×1080
// with the Gemini watermark removed from the source, so the full frame is
// used with no corner masking.
const frameUrl = (index) =>
  `/hero-frames/ezgif-frame-${String(index + 1).padStart(3, '0')}.jpg?v=7`;

/**
 * Scroll windows (fraction of hero scroll progress 0..1).
 */
const REVEAL = {
  roleOne: [0.0, 0.2], // SOFTWARE ENGINEER
  roleTwo: [0.2, 0.4], // FULL STACK DEVELOPMENT
  roleThree: [0.4, 0.6], // AI ORCHESTRATION
  quote: [0.58, 0.66],
  name: [0.62, 0.72],
  buttons: [0.72, 0.82],
  stamp: [0.72, 0.82],
};

/**
 * Reveal wrapper — opacity + y scrubbed from the hero's own scroll progress.
 * Written imperatively so the reveal is locked to the section progress
 * (see the note at the top of this file).
 */
function Reveal({ progress, range, className, children, y = 30 }) {
  const ref = useRef(null);
  const opacity = useTransform(progress, range, [0, 1]);
  const translateY = useTransform(progress, range, [y, 0]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const apply = () => {
      el.style.opacity = opacity.get().toFixed(4);
      el.style.transform = `translateY(${translateY.get().toFixed(2)}px)`;
    };
    apply();
    const un1 = opacity.on('change', apply);
    const un2 = translateY.on('change', apply);
    return () => {
      un1();
      un2();
    };
  }, [opacity, translateY]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export default function Hero() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const bgWrapRef = useRef(null);
  const canvasFadeRef = useRef(null);
  const brandRef = useRef(null);
  const titleRef = useRef(null);
  const uiRef = useRef(null);
  const hintRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // --- ONE scroll source of truth for the whole section ---
  const { scrollYProgress: rawProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  // Smooth the raw progress with a spring so the scrubbed frames glide but
  // track the wheel closely on the short 3-screen track (snappier than the
  // old 560vh pacing).
  const scrollYProgress = useSpring(rawProgress, {
    stiffness: 150,
    damping: 32,
    mass: 0.55,
    restDelta: 0.0005,
  });

  // --- Background sync: scrub the frames + breathe the scene ---
  const frame = useTransform(scrollYProgress, [0, 0.92], [0, FRAME_COUNT - 1]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const bgBrightness = useTransform(scrollYProgress, [0.5, 1], [1, 0.4]);
  const canvasBlur = useTransform(
    scrollYProgress,
    [0.9, 1],
    ['blur(0px)', 'blur(14px)']
  );

  // --- Copy staging ---
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -24]);
  const brandY = useTransform(scrollYProgress, [0, 1], [0, -12]);
  const uiOpacity = useTransform(scrollYProgress, [0.88, 1], [1, 0]);
  const canvasOpacity = useTransform(scrollYProgress, [0.92, 1], [1, 0]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.1], [0.6, 0]);

  // Apply every opacity / filter / extra transform from the MotionValues so
  // they all follow the hero's section progress (not the page's).
  useEffect(() => {
    const sync = () => {
      if (bgWrapRef.current) {
        bgWrapRef.current.style.transform = `scale(${bgScale.get().toFixed(4)})`;
        bgWrapRef.current.style.filter = `brightness(${bgBrightness.get().toFixed(4)})`;
      }
      if (canvasFadeRef.current) {
        canvasFadeRef.current.style.opacity = canvasOpacity.get().toFixed(3);
        canvasFadeRef.current.style.filter = canvasBlur.get();
      }
      if (brandRef.current) brandRef.current.style.transform = `translateY(${brandY.get().toFixed(2)}px)`;
      if (titleRef.current) titleRef.current.style.transform = `translateY(${titleY.get().toFixed(2)}px)`;
      if (uiRef.current) uiRef.current.style.opacity = uiOpacity.get().toFixed(3);
      if (hintRef.current) hintRef.current.style.opacity = hintOpacity.get().toFixed(3);
    };
    sync();
    const mvs = [
      bgScale,
      bgBrightness,
      canvasOpacity,
      canvasBlur,
      brandY,
      titleY,
      uiOpacity,
      hintOpacity,
    ];
    const unsubs = mvs.map((mv) => mv.on('change', sync));
    return () => unsubs.forEach((un) => un());
  }, [
    bgScale,
    bgBrightness,
    canvasOpacity,
    canvasBlur,
    brandY,
    titleY,
    uiOpacity,
    hintOpacity,
  ]);

  // Preload every frame before painting anything
  useEffect(() => {
    let cancelled = false;
    let loadedCount = 0;
    imagesRef.current = [];

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = frameUrl(i);
      const done = () => {
        if (cancelled) return;
        loadedCount++;
        setLoadingProgress(Math.floor((loadedCount / FRAME_COUNT) * 100));
        if (loadedCount === FRAME_COUNT) setLoaded(true);
      };
      img.onload = done;
      img.onerror = done; // count failures too — never hang on the loader
      imagesRef.current.push(img);
    }

    return () => {
      cancelled = true;
    };
  }, []);

  // Draw frames onto the canvas whenever the scroll-driven frame changes
  useEffect(() => {
    if (!loaded) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const render = () => {
      if (!canvasRef.current || !imagesRef.current.length) return;
      const index = Math.max(
        0,
        Math.min(FRAME_COUNT - 1, Math.round(frame.get()))
      );
      const img = imagesRef.current[index];
      if (!img || !img.complete || img.naturalHeight === 0) return;

      const { clientWidth: cw, clientHeight: ch } = canvasRef.current;
      // Size the backing store to the display's REAL pixel density. The old
      // 1.5x cap meant any screen above that (Retina Macs = 2x, most Windows
      // laptops at 150-200% scaling, phones at 2-3x) forced the browser to
      // upscale this already-lower-res canvas a SECOND time to fill the
      // physical screen — a double blur. Capped at 3x only as a sane ceiling
      // against pathological values, not to save resolution.
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      const bw = Math.max(1, Math.round(cw * dpr));
      const bh = Math.max(1, Math.round(ch * dpr));
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      // No filter chain — the 1920x1080 export is already clean, and a
      // contrast/saturation lift here softened fine detail. Keep the frame a
      // plain, unfiltered draw so it reads crisp instead of processed.

      ctx.clearRect(0, 0, cw, ch);
      // Exact cover fit — no extra push-in zoom. The clip is a clean
      // 1920×1080 upscaled export with the Gemini watermark already removed,
      // so the whole frame is used; any extra ZOOM factor here only magnifies
      // the source past its native resolution for no visual benefit.
      const scale = Math.max(cw / img.width, ch / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      const x = (cw - dw) / 2;
      const y = (ch - dh) / 2;
      ctx.drawImage(img, x, y, dw, dh);
    };

    const onResize = () => render();
    render();

    const unsubscribe = frame.on('change', render);
    window.addEventListener('resize', onResize);
    return () => {
      unsubscribe();
      window.removeEventListener('resize', onResize);
    };
  }, [loaded, frame]);

  return (
    <section
      ref={sectionRef}
      data-hero
      id="hero"
      aria-label="Hero — Engineering scalable systems & agentic AI"
      className="relative h-[300vh] bg-black font-sans tracking-wide"
    >
      {/* Sticky viewport: the content is pinned while you scroll the 300vh
          track — the full 117-frame clip + all copy now complete in ~3
          viewport heights of scrolling, with a light spring smoothing the
          scrub so the frames still glide rather than snap. */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Loading state (frames are decoding) */}
        {!loaded && (
          <div className="absolute inset-0 z-[70] flex flex-col items-center justify-center bg-black">
            <div className="text-[#E8DFD8]/70 font-mono text-xs uppercase tracking-[0.3em] mb-4">
              &gt; INITIALIZING_CORE_SYSTEM
            </div>
            <div className="w-64 h-[1px] bg-[#cbb59d]/10 overflow-hidden">
              <div
                className="h-full bg-[#cbb59d] transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* --- AMBIENT BACKGROUND (z-0) --- */}
        <div
          className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* --- PERSON FRAME ANIMATION (z-10), scrubbed by scroll --- */}
        <div
          ref={bgWrapRef}
          className="absolute inset-0 z-10 will-change-transform"
          style={{ transform: 'scale(1)', filter: 'brightness(1)' }}
        >
          <div
            ref={canvasFadeRef}
            className="absolute inset-0 will-change-[opacity,filter]"
            style={{ opacity: 1 }}
          >
            <canvas ref={canvasRef} className="h-full w-full object-cover" />
          </div>
        </div>

        {/* Cinematic vignette — pulls the eye to the subject, tightens the edges */}
        <div
          className="absolute inset-0 z-[15] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 125% 95% at 50% 40%, transparent 42%, rgba(0,0,0,0.65) 100%)',
          }}
        />

        {/* Legibility scrim — darkens behind the copy so text always pops */}
        <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-black/85 via-black/45 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 z-20 h-48 pointer-events-none bg-gradient-to-t from-black/70 to-transparent" />

        {/* Right-edge melt — the frame's right boundary dissolves into the
            black canvas instead of stopping on a hard edge */}
        <div
          className="absolute inset-y-0 right-0 z-20 w-[14vw] pointer-events-none hidden lg:block"
          style={{
            background:
              'linear-gradient(to left, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.18) 45%, transparent 100%)',
          }}
        />

        {/* Right-column scrim — the quote/name sit over the side of the frame
            that the left-to-right scrim above deliberately leaves untouched.
            Kept light (the edge vignette already contributes) so it gives the
            copy something to read against without banding the frame edge. */}
        <div
          className="absolute inset-y-0 right-0 z-20 w-[38%] md:w-[30%] pointer-events-none"
          style={{
            background:
              'linear-gradient(to left, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)',
          }}
        />

        {/* --- TEXT OVERLAY (z-50, strictly above the canvas) --- */}
        <div
          ref={uiRef}
          className="portfolio-ui absolute inset-0 z-50 px-8 md:px-[6%] lg:px-[7%] pointer-events-none"
          style={{ opacity: 1 }}
        >
          {/* LEFT — branding + title (always visible, high contrast) */}
          <div className="absolute left-8 md:left-[6%] lg:left-[7%] top-1/2 -translate-y-1/2 max-w-[60vw] md:max-w-[50%] lg:max-w-[52%]">
            <div ref={brandRef} className="mb-6 will-change-transform">
              <p
                className="text-[#F0E9E1] text-base md:text-xl tracking-[0.3em] uppercase"
                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.95), 0 2px 14px rgba(0,0,0,0.8)' }}
              >
                Bhavesh Sabnani.
              </p>
            </div>

            <div ref={titleRef} className="will-change-transform">
              <h1
                className="text-4xl sm:text-5xl md:text-7xl lg:text-7xl xl:text-[clamp(4.5rem,5vw,6.5rem)] font-black tracking-tight leading-[0.98] uppercase bg-clip-text text-transparent bg-gradient-to-r from-[#D4AF37] to-[#E8DFD8] drop-shadow-[0_4px_18px_rgba(0,0,0,0.85)]"
                style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                Engineering
                <br />
                Scalable Systems
                <br />
                &amp; Agentic AI
              </h1>
              <p
                className="mt-5 md:mt-6 text-base md:text-lg lg:text-xl text-[#F0E9E1] max-w-xl lg:max-w-2xl leading-relaxed"
                style={{
                  textShadow:
                    '0 1px 2px rgba(0,0,0,0.95), 0 2px 16px rgba(0,0,0,0.85)',
                }}
              >
                <span className="font-semibold text-[#F7F2EB]">Full-Stack Engineer</span>{' '}
                shipping high-concurrency{' '}
                <span className="font-medium text-[#E9C767]">Node.js &amp; NestJS</span>{' '}
                backends, fluid{' '}
                <span className="font-medium text-[#E9C767]">React &amp; Next.js</span>{' '}
                interfaces, and autonomous{' '}
                <span className="font-medium text-[#E9C767]">LLM orchestration</span>{' '}
                pipelines &mdash; secure, real-time systems built to scale.
              </p>
            </div>

            {/* Sequential role lines, staged one scroll window at a time */}
            <div className="mt-8 md:mt-10 flex flex-wrap gap-x-8 gap-y-4">
              <Reveal progress={scrollYProgress} range={REVEAL.roleOne} y={40}>
                <span
                  className="inline-flex items-center gap-2.5 text-[#F0E9E1] font-mono text-sm md:text-base lg:text-lg font-medium uppercase tracking-[0.28em]"
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.95), 0 2px 14px rgba(0,0,0,0.85)' }}
                >
                  <span className="h-2 w-2 bg-[#D4AF37]" />
                  Software Engineer
                </span>
              </Reveal>
              <Reveal progress={scrollYProgress} range={REVEAL.roleTwo} y={40}>
                <span
                  className="inline-flex items-center gap-2.5 text-[#F0E9E1] font-mono text-sm md:text-base lg:text-lg font-medium uppercase tracking-[0.28em]"
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.95), 0 2px 14px rgba(0,0,0,0.85)' }}
                >
                  <span className="h-2 w-2 bg-[#D4AF37]" />
                  Full Stack Development
                </span>
              </Reveal>
              <Reveal progress={scrollYProgress} range={REVEAL.roleThree} y={40}>
                <span
                  className="inline-flex items-center gap-2.5 text-[#F0E9E1] font-mono text-sm md:text-base lg:text-lg font-medium uppercase tracking-[0.28em]"
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.95), 0 2px 14px rgba(0,0,0,0.85)' }}
                >
                  <span className="h-2 w-2 bg-[#D4AF37]" />
                  AI Orchestration
                </span>
              </Reveal>
            </div>
          </div>

          {/* RIGHT — quote + name */}
          <div className="absolute right-8 md:right-[6%] lg:right-[7%] top-1/2 -translate-y-1/2 max-w-[32vw] md:max-w-[26%] text-right">
            <Reveal progress={scrollYProgress} range={REVEAL.quote} y={26}>
              <p
                className="text-[#F0E9E1] text-lg md:text-xl lg:text-2xl italic leading-relaxed tracking-wide"
                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.95), 0 2px 16px rgba(0,0,0,0.9)' }}
              >
                &ldquo;Code is my craft. Impact is my goal.&rdquo;
              </p>
            </Reveal>
            <Reveal
              progress={scrollYProgress}
              range={REVEAL.name}
              className="mt-4 flex items-center justify-end gap-2"
              y={22}
            >
              <span
                className="text-[#E9C767] font-mono text-lg md:text-xl"
                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.95)' }}
              >
                &lt; /&gt;
              </span>
              <span
                className="text-[#F0E9E1] text-lg md:text-xl font-medium tracking-wide"
                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.95), 0 2px 14px rgba(0,0,0,0.85)' }}
              >
                Bhavesh
              </span>
            </Reveal>
          </div>

          {/* BOTTOM LEFT — CTAs */}
          <div className="absolute left-8 md:left-[6%] lg:left-[7%] bottom-10 md:bottom-14 flex flex-wrap gap-5 pointer-events-auto">
            <Reveal progress={scrollYProgress} range={REVEAL.buttons} y={24}>
              <a
                href="#projects"
                className="group inline-flex items-center gap-3 px-10 py-4 border border-[#E8DFD8]/40 bg-black/30 text-[#E8DFD8] font-mono text-sm md:text-base uppercase tracking-[0.22em] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300 rounded-sm backdrop-blur-md"
              >
                Explore My Work
                <FiArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </a>
            </Reveal>
            <Reveal progress={scrollYProgress} range={REVEAL.buttons} y={24}>
              <a
                href="/resume.pdf"
                className="group inline-flex items-center gap-3 px-10 py-4 border border-[#E8DFD8]/40 bg-black/30 text-[#E8DFD8] font-mono text-sm md:text-base uppercase tracking-[0.22em] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300 rounded-sm backdrop-blur-md"
              >
                Download Resume
                <FiDownload size={18} className="transition-transform group-hover:translate-y-0.5" />
              </a>
            </Reveal>
          </div>

          {/* BOTTOM RIGHT — gold code stamp */}
          <div className="absolute right-8 md:right-[6%] lg:right-[7%] bottom-10 md:bottom-14 text-[#D4AF37]">
            <Reveal progress={scrollYProgress} range={REVEAL.stamp} y={22}>
              <span className="font-mono text-4xl md:text-5xl">&lt; /&gt;</span>
            </Reveal>
          </div>
        </div>

        {/* Scroll hint — fades away once the sequence starts */}
        <div
          ref={hintRef}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 z-50 text-[#E8DFD8]/70 font-mono text-[11px] uppercase tracking-[0.4em] pointer-events-none"
          style={{ opacity: 0.6 }}
        >
          Scroll
        </div>
      </div>
    </section>
  );
}
