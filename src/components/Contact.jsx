import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  useMotionValueEvent,
} from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiSend, FiShield, FiActivity, FiDownload } from 'react-icons/fi';
import LetsBuildRadialBloom from './LetsBuildRadialBloom';

/**
 * COMM_LINK — three-act cinematic contact bridge.
 *
 * Act 1: the Let's-Build bloom — its own full-viewport, opaque black section.
 * Act 2: the telephone film — a dedicated tall scroll track during which the
 *        86 crisp 1920×1080 frames play 1 → 86 over the pinned backdrop with
 *        NOTHING overlaying them, then the last frame holds.
 * Act 3: the COMM_LINK glass form + gold HUD — only now, after the clip has
 *        completed, do they fade in over the held final frame.
 */
const FRAME_COUNT = 86;
const frameUrl = (index) =>
  `/telephone-frames/telephone-${String(index + 1).padStart(3, '0')}.jpg?v=3`;
// Comm_Link mail API (see server/index.js). In dev, Vite proxies /api to the
// backend (vite.config.js) so this relative path just works. For a
// production deployment where the frontend and backend live on different
// origins, set VITE_CONTACT_API_URL to the backend's full URL at build time.
const CONTACT_API_URL = import.meta.env.VITE_CONTACT_API_URL || '/api/contact';
// A strict "cover" fit (scale = max(canvasW/1920, canvasH/1080)) fills the
// frame edge-to-edge, but on monitors wider/taller than the 1920x1080 source
// that scale exceeds 1 and magnifies the footage past its native resolution —
// reading as an over-zoomed, blurry image. Backing off ~10% trades a touch of
// letterboxing for a crisp, un-upscaled frame.
const ZOOM_OUT = 0.9;

/* ---- Pinned sequence rail ------------------------------------------------ */
// One continuous gold timeline, pinned to the page side, is scrubbed by the
// same scroll that drives the Let's-Build bloom burst and the telephone film,
// with milestone ticks where each act hands off: BLOOM → UPLINK FILM →
// COMM_LINK form.
const RAIL_ACTS = [
  { id: 'bloom', label: '01 · Tiles' },
  { id: 'film', label: '02 · Uplink' },
  { id: 'form', label: '03 · Comm_Link' },
];

function SequenceRail({ rootRef, filmRef, contactRef }) {
  const [marks, setMarks] = useState(null);
  const [actIdx, setActIdx] = useState(0);
  const actIdxRef = useRef(0);
  const rootInView = useInView(rootRef, { amount: 0.03 });

  // Progress across the whole bridge, measured from the moment the bloom
  // first enters the viewport through the end of the form stage.
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ['start end', 'end end'],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  });

  // Measure the scroll fractions where each act hands off to the next
  // (film start, form start), relative to the bridge's full scroll span.
  useEffect(() => {
    let settle = 0;
    const measure = () => {
      const root = rootRef.current;
      const film = filmRef.current;
      const form = contactRef.current;
      if (!root || !film || !form) return;
      const r = root.getBoundingClientRect();
      const rootTop = r.top + window.scrollY;
      const rootH = Math.max(1, r.height);
      const vh = window.innerHeight || 1;
      const f = (el) => {
        const t = el.getBoundingClientRect().top + window.scrollY;
        return Math.max(0, Math.min(1, (t - rootTop + vh) / rootH));
      };
      setMarks({ filmStart: f(film), formStart: f(form) });
    };
    measure();
    settle = window.setTimeout(measure, 900); // re-measure after layout settles
    window.addEventListener('resize', measure);
    return () => {
      window.clearTimeout(settle);
      window.removeEventListener('resize', measure);
    };
  }, [rootRef, filmRef, contactRef]);

  // Which act the travelling head is inside right now (state only flips on
  // hand-offs, so re-renders are rare)
  useMotionValueEvent(progress, 'change', (v) => {
    if (!marks) return;
    const idx = v < marks.filmStart ? 0 : v < marks.formStart ? 1 : 2;
    if (idx !== actIdxRef.current) {
      actIdxRef.current = idx;
      setActIdx(idx);
    }
  });

  const headTop = useTransform(progress, (v) =>
    `${(Math.max(0, Math.min(1, v)) * 100).toFixed(2)}%`
  );

  if (!rootInView || !marks) return null;

  const stops = [
    { pct: 0.004, act: 0 },
    { pct: marks.filmStart, act: 1 },
    { pct: marks.formStart, act: 2 },
  ];
  const stopColor = (i) => {
    if (i < actIdx) return '#D4AF37';
    if (i === actIdx) return '#F4D98A';
    return 'rgba(184,151,107,0.45)';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      aria-hidden
      className="pointer-events-none fixed right-6 lg:right-9 top-1/2 -translate-y-1/2 z-[95] hidden lg:block"
    >
      <div className="flex items-stretch gap-4" style={{ height: '46vh' }}>
        {/* Milestone labels — lit when their act is reached */}
        <div className="relative w-[108px]">
          {stops.map(({ pct, act }, i) => (
            <div
              key={RAIL_ACTS[act].id}
              className="absolute right-0 w-full -translate-y-1/2 text-right"
              style={{ top: `${pct * 100}%` }}
            >
              <span
                className="inline-block font-mono text-[8px] uppercase leading-tight tracking-[0.24em] whitespace-nowrap"
                style={{
                  color: stopColor(i),
                  textShadow:
                    i === actIdx
                      ? '0 0 12px rgba(212,175,55,0.6)'
                      : '0 1px 4px rgba(0,0,0,0.9)',
                  transition: 'color 350ms ease',
                }}
              >
                {RAIL_ACTS[act].label}
              </span>
            </div>
          ))}
        </div>

        {/* The rail itself */}
        <div className="relative w-[3px] self-stretch bg-white/10">
          {/* Gold fill — scaleY driven by the same scroll progress that bursts
              the tiles and scrubs the telephone frames */}
          <motion.div
            className="absolute inset-0 w-full"
            style={{
              scaleY: progress,
              transformOrigin: 'top',
              background:
                'linear-gradient(to bottom, #F4D98A, #D4AF37 55%, rgba(212,175,55,0.35))',
              boxShadow: '0 0 14px rgba(212,175,55,0.45)',
            }}
          />
          {/* Milestone ticks */}
          {stops.map(({ pct }, i) => (
            <span
              key={i}
              className="absolute left-1/2 block h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rotate-45 border bg-black/80"
              style={{ top: `${pct * 100}%`, borderColor: stopColor(i) }}
            />
          ))}
          {/* Travelling head — glides down the rail with the scroll */}
          <motion.div className="absolute inset-x-0 flex justify-center" style={{ top: headTop }}>
            <span
              className="block h-[10px] w-[10px] -translate-y-1/2 rotate-45 bg-[#F4D98A]"
              style={{ boxShadow: '0 0 16px 3px rgba(212,175,55,0.75)' }}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

const Contact = () => {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const filmRef = useRef(null);
  const contactRef = useRef(null);
  const imagesRef = useRef([]);

  const [loaded, setLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // --- Scroll source: the clip plays 1 → 86 ONLY across the dedicated film
  // track that sits between the bloom and the form (offset 'end end' = the
  // track's bottom reaching the viewport bottom = the LAST frame). Once the
  // track is fully scrolled the progress clamps at 1, so the final frame
  // stays pinned underneath the arriving COMM_LINK form.
  const { scrollYProgress: filmProgress } = useScroll({
    target: filmRef,
    offset: ['start start', 'end end'],
  });
  const frame = useTransform(filmProgress, [0, 1], [0, FRAME_COUNT - 1]);

  // Film → still hand-off: across the last ~10% of the clip, the live canvas
  // crossfades out while a still of the final frame settles in — starting a
  // touch enlarged and soft, easing to a sharp, steady backdrop just as the
  // COMM_LINK form arrives (a settle, not a stop).
  const canvasOpacity = useTransform(filmProgress, [0.9, 1], [1, 0]);
  const stillOpacity = useTransform(filmProgress, [0.9, 1], [0, 1]);
  // Scaled by the same ZOOM_OUT as the canvas so the crossfade doesn't jump
  // in framing when the still hands off from the live-drawn frame.
  const stillScale = useTransform(
    filmProgress,
    [0.86, 1],
    [1.055 * ZOOM_OUT, ZOOM_OUT]
  );
  const stillBlur = useTransform(filmProgress, [0.9, 1], ['blur(10px)', 'blur(0px)']);

  // HUD chrome (corner brackets + status labels) stays hidden while the
  // Let's-Build bloom scrolls over the telephone; it fades in only once the
  // COMM_LINK form section starts arriving.
  const { scrollYProgress: hudProgress } = useScroll({
    target: contactRef,
    offset: ['start end', 'start 0.55'],
  });
  const hudOpacity = useTransform(hudProgress, [0, 1], [0, 1]);

  // Mood scrim opacity: a brief dip right as the film starts (the very first
  // frames arriving off the bloom transition can look soft/unsettled, and a
  // bare frame there reads as a blur glitch), fading out almost immediately
  // so the clip plays clean through the middle of the scroll, then rising
  // again — combined with hudOpacity — as the COMM_LINK form arrives.
  const introScrimOpacity = useTransform(filmProgress, [0, 0.035, 0.1], [0.55, 0.55, 0]);
  const scrimOpacity = useTransform(
    [introScrimOpacity, hudOpacity],
    ([intro, hud]) => Math.max(intro, hud)
  );

  // Preload every frame before painting
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
      img.onerror = done; // never hang on the loader
      imagesRef.current.push(img);
    }

    return () => {
      cancelled = true;
    };
  }, []);

  // Draw the scrubbed frame onto the canvas
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
      // Match the display's real pixel density (see Hero.jsx for the full
      // explanation) — capping at 1.5x forced a second, browser-side upscale
      // on any screen above that, which is what read as blur.
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

      ctx.clearRect(0, 0, cw, ch);
      // Cover fit, backed off by ZOOM_OUT so wide/tall viewports don't
      // upscale the 1920x1080 source past its native resolution (see the
      // ZOOM_OUT note above) — centered, with a slim letterbox instead of blur.
      const scale = Math.max(cw / img.width, ch / img.height) * ZOOM_OUT;
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

  const sendEmail = async (e) => {
    e.preventDefault();
    setIsSending(true);
    try {
      const res = await fetch(CONTACT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to send message.');
      }
      toast.success('TRANSMISSION_COMPLETE 🚀');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      toast.error(err.message || 'CONNECTION_FAILURE ❌');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div ref={wrapRef} className="relative bg-black text-[#E8DFD8] font-mono">
      {/* ============ STICKY BACKDROP: the telephone film (behind everything) ============ */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Cinematic frame (scrubbed by scroll only — no zoom parallax) */}
        <motion.div
          className="absolute inset-0"
          style={{ opacity: canvasOpacity }}
        >
          <canvas ref={canvasRef} className="h-full w-full object-cover" />
        </motion.div>

        {/* Still of the final frame — crossfades in as the clip ends, then
            breathes very slowly so the backdrop never reads as frozen */}
        <motion.div aria-hidden className="absolute inset-0" style={{ opacity: stillOpacity }}>
          <motion.div className="h-full w-full" style={{ scale: stillScale, filter: stillBlur }}>
            <div
              className="h-full w-full animate-settleZoom will-change-transform"
              style={{
                backgroundImage: `url(${frameUrl(FRAME_COUNT - 1)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </motion.div>
        </motion.div>

        {/* Mood scrim — briefly present as the clip's first frames settle in
            (masks the soft/transitional hand-off from the bloom section),
            fades out almost immediately so the clip plays clean through the
            rest of the scroll, then rises again as the COMM_LINK form
            arrives (see scrimOpacity above). */}
        <motion.div className="pointer-events-none absolute inset-0 bg-black/50" style={{ opacity: scrimOpacity }} />
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: scrimOpacity,
            background:
              'radial-gradient(ellipse 120% 100% at 50% 45%, transparent 32%, rgba(0,0,0,0.8) 100%)',
          }}
        />

        {/* Loading module */}
        {!loaded && (
          <div className="absolute inset-0 z-[40] flex flex-col items-center justify-center bg-black">
            <div className="text-[#E8DFD8]/70 font-mono text-xs uppercase tracking-[0.3em] mb-4">
              &gt; INITIALIZING_UPLINK {loadingProgress}%
            </div>
            <div className="w-64 h-[2px] bg-[#8C6D4F]/30 overflow-hidden">
              <div
                className="h-full bg-[#D4AF37] transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* HUD corner brackets + status (gold theme) — hidden during the bloom,
            fades in only as the COMM_LINK form section arrives */}
        <motion.div
          className="pointer-events-none absolute inset-0 p-8 md:p-12"
          style={{ opacity: hudOpacity }}
        >
          <div className="absolute top-6 left-6 md:top-10 md:left-10 w-16 h-16 md:w-24 md:h-24 border-t border-l border-[#D4AF37]/25" />
          <div className="absolute top-6 right-6 md:top-10 md:right-10 w-16 h-16 md:w-24 md:h-24 border-t border-r border-[#D4AF37]/25" />
          <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 w-16 h-16 md:w-24 md:h-24 border-b border-l border-[#D4AF37]/25" />
          <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 w-16 h-16 md:w-24 md:h-24 border-b border-r border-[#D4AF37]/25" />

          <div className="absolute top-10 left-10 md:left-14 flex items-center gap-2 text-[9px] tracking-[0.5em] uppercase text-[#cbb59d]">
            <FiShield className="text-[#D4AF37]/80" />
            <span>Uplink_Station :: 01</span>
          </div>
          <div className="absolute bottom-10 right-10 md:right-14 hidden lg:flex items-center gap-2 text-[9px] tracking-[0.5em] uppercase text-[#cbb59d]">
            <FiActivity className="text-[#D4AF37]/80 animate-pulse" />
            <span>Signal_Stable</span>
          </div>
        </motion.div>
      </div>

      {/* ============ LAYER 1: Let's-Build bloom (opaque, own section) ============ */}
      <div className="relative z-10 -mt-[100vh]">
        <LetsBuildRadialBloom />
      </div>

      {/* ============ LAYER 2: the telephone film — full clip plays here with
          no overlay. Track height is 320vh so the usable scrub distance (track
          − viewport) is ~220vh: the 86 frames play across ~2.2 screens — slow
          and calm — and the last frame lands exactly as the COMM_LINK form
          below reaches the viewport bottom ============ */}
      <div
        ref={filmRef}
        aria-hidden
        className="relative z-10 bg-transparent"
        style={{ height: '320vh' }}
      />

      {/* ============ LAYER 3: COMM_LINK form (right column, gold theme) —
          arrives only after the clip has completed, over the held final frame */}
      <div
        id="contactme"
        ref={contactRef}
        className="relative z-20 scroll-mt-24 bg-transparent"
      >
        <div className="min-h-screen flex items-center justify-end px-6 sm:px-10 md:px-16 lg:pr-[8%] py-24">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-xl text-left"
          >
            {/* Heading */}
            <div className="mb-10">
              <span className="text-[10px] font-mono tracking-[0.5em] uppercase text-[#D4AF37]">
                Protocol: Secure_Data
              </span>
              <h2 className="text-5xl sm:text-6xl md:text-7xl font-black text-[#E8DFD8] uppercase tracking-tighter mt-3 leading-none">
                Comm
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F4D98A] via-[#E4C15C] to-[#D4AF37] drop-shadow-[0_0_18px_rgba(212,175,55,0.35)]">
                  _Link
                </span>
              </h2>
              <div className="mt-5 flex items-center gap-3 text-[9px] font-mono tracking-[0.4em] uppercase text-[#cbb59d]">
                <span className="h-px w-10 bg-[#D4AF37]/40" />
                <span>Establish a secure line</span>
              </div>
            </div>

            {/* Glassmorphic form */}
            <form
              onSubmit={sendEmail}
              className="bg-black/40 backdrop-blur-xl border border-[#D4AF37]/20 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] p-8 sm:p-10 space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label
                    htmlFor="comm-name"
                    className="block text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-[#cbb59d]"
                  >
                    Ident_Signature
                  </label>
                  <input
                    id="comm-name"
                    name="name"
                    type="text"
                    placeholder="ENTER_NAME"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent border-b border-[#8C6D4F]/60 py-3 px-1 text-[#E8DFD8] text-sm outline-none focus:border-[#D4AF37] transition-colors placeholder:text-[#B8976B]/40"
                  />
                </div>
                <div className="space-y-3">
                  <label
                    htmlFor="comm-email"
                    className="block text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-[#cbb59d]"
                  >
                    Comm_Path_Addr
                  </label>
                  <input
                    id="comm-email"
                    name="email"
                    type="email"
                    placeholder="ENTER_EMAIL"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-b border-[#8C6D4F]/60 py-3 px-1 text-[#E8DFD8] text-sm outline-none focus:border-[#D4AF37] transition-colors placeholder:text-[#B8976B]/40"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label
                  htmlFor="comm-message"
                  className="block text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-[#cbb59d]"
                >
                  Data_Payload
                </label>
                <textarea
                  id="comm-message"
                  name="message"
                  placeholder="INPUT_TRANSMISSION..."
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-transparent border-b border-[#8C6D4F]/60 py-3 px-1 text-[#E8DFD8] text-sm outline-none focus:border-[#D4AF37] transition-colors min-h-[130px] resize-none placeholder:text-[#B8976B]/40"
                />
              </div>

              <div className="flex justify-end">
                <motion.button
                  whileHover={
                    isSending
                      ? undefined
                      : {
                          scale: 1.04,
                          boxShadow: '0 0 40px rgba(212, 175, 55, 0.45)',
                        }
                  }
                  whileTap={isSending ? undefined : { scale: 0.96 }}
                  type="submit"
                  disabled={isSending}
                  className={`group inline-flex items-center gap-3 text-black font-black text-xs uppercase tracking-[0.4em] px-12 py-4 rounded-md transition-all duration-300 ${
                    isSending
                      ? 'bg-[#8C6D4F] cursor-wait opacity-80'
                      : 'bg-[#D4AF37] hover:shadow-[0_0_40px_rgba(212,175,55,0.45)]'
                  }`}
                >
                  <span>{isSending ? 'Transmitting…' : 'Transmit'}</span>
                  <FiSend
                    className={`text-base transition-transform ${
                      isSending ? 'animate-pulse' : 'group-hover:translate-x-1'
                    }`}
                  />
                </motion.button>
              </div>
            </form>

            {/* Alternate channels — real click-to-email / click-to-call */}
            <div className="mt-7 flex flex-wrap items-center justify-start gap-x-6 gap-y-2 font-mono text-[10px] tracking-[0.2em] uppercase">
              <a
                href="mailto:bhavesh.sabnani2005@gmail.com"
                className="text-[#cbb59d] hover:text-[#D4AF37] transition-colors"
              >
                bhavesh.sabnani2005@gmail.com
              </a>
              <span className="hidden sm:inline text-white/20">|</span>
              <a
                href="tel:+919664320613"
                className="text-[#cbb59d] hover:text-[#D4AF37] transition-colors"
              >
                +91 96643 20613
              </a>
            </div>

            {/* Resume download — gold-bordered CTA under the form */}
            <motion.a
              href="/resume.pdf"
              download="Bhavesh_Sabnani_Resume.pdf"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="mt-8 inline-flex items-center gap-3 px-7 py-3.5 rounded-lg bg-transparent border-2 border-[#D4AF37]/80 text-[#D4AF37] font-mono text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-[#D4AF37] hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_34px_rgba(212,175,55,0.4)]"
            >
              <FiDownload className="text-sm" />
              Download Resume
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* Pinned sequence rail — bloom burst → telephone film → COMM_LINK */}
      <SequenceRail rootRef={wrapRef} filmRef={filmRef} contactRef={contactRef} />

      <ToastContainer
        position="bottom-right"
        toastClassName="bg-black border border-[#D4AF37]/30 text-[#E8DFD8] font-mono text-[9px] rounded-none backdrop-blur-xl"
        progressClassName="bg-[#D4AF37]"
      />
    </div>
  );
};

export default Contact;
