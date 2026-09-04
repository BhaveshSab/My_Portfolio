import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiBookOpen, FiCode, FiDownload, FiLayers } from 'react-icons/fi';

// Shared ease so every reveal in this section moves with the same rhythm.
const EASE = [0.22, 1, 0.36, 1];

// Per-letter reveal of the big heading — each glyph rises on its own beat so
// the title reads as an animated cascade the moment it scrolls into view.
const HEADING_TEXT = 'About Me.';

/**
 * In-view detector with a scroll fallback. IntersectionObserver is the fast
 * path, but embedded webviews / throttled tabs can starve it (the original
 * About reveal used explicit scroll listeners for exactly this reason), so a
 * cheap scroll+resize check guarantees the reveal always fires once the
 * element is genuinely on screen.
 */
function useInViewOnce() {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let done = false;
    let io = null;
    const reveal = () => {
      if (done) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // Trigger once the element has clearly entered the lower viewport
      // (top above 92% of the screen, bottom past 8%) — never at a 1px peek.
      if (r.top < vh * 0.92 && r.bottom > vh * 0.08) {
        done = true;
        setShown(true);
        if (io) io.disconnect();
        window.removeEventListener('scroll', reveal);
        window.removeEventListener('resize', reveal);
      }
    };
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) reveal();
        },
        { threshold: 0.08 }
      );
      io.observe(el);
    }
    window.addEventListener('scroll', reveal, { passive: true });
    window.addEventListener('resize', reveal);
    reveal(); // in case the element is already on screen
    return () => {
      if (io) io.disconnect();
      window.removeEventListener('scroll', reveal);
      window.removeEventListener('resize', reveal);
    };
  }, []);
  return [ref, shown];
}

/** Rising text/card wrapper — fades and slides up when it comes into view. */
function Rise({ as = 'div', delay = 0, y = 30, className, children, style }) {
  const [ref, shown] = useInViewOnce();
  const M = motion[as];
  return (
    <M
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={shown ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: EASE, delay }}
      className={className}
      style={style}
    >
      {children}
    </M>
  );
}

export default function About() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const portraitRef = useRef(null);
  const headingRef = useRef(null);
  const [connector, setConnector] = useState(null);

  // Reveal triggers: portrait + header block each fire once truly visible.
  const [portraitBox, portraitShown] = useInViewOnce();
  const [headerBox, headerShown] = useInViewOnce();

  // Diagonal gold accent connecting the portrait frame to the ABOUT ME.
  // heading (desktop only)
  useEffect(() => {
    const section = sectionRef.current;
    const portrait = portraitRef.current;
    const heading = headingRef.current;
    if (!section || !portrait || !heading) return;
    const img = portrait.querySelector('img');
    const update = () => {
      if (window.innerWidth < 1024) {
        setConnector(null);
        return;
      }
      const sr = section.getBoundingClientRect();
      const pr = portrait.getBoundingClientRect();
      const hr = heading.getBoundingClientRect();
      // Start just outside the top-right corner bracket, in the gap before the outer double-frame
      const x1 = pr.right - sr.left + 16;
      const y1 = pr.top - sr.top + 12;
      // End in the pane padding, just left of the heading's vertical center
      const x2 = hr.left - sr.left - 20;
      const y2 = hr.top - sr.top + hr.height / 2;
      const dx = x2 - x1;
      const dy = y2 - y1;
      setConnector({ x1, y1, x2, y2, length: Math.hypot(dx, dy), angle: Math.atan2(dy, dx) });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(section);
    window.addEventListener('resize', update);
    window.addEventListener('load', update);
    if (img) img.addEventListener('load', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
      window.removeEventListener('load', update);
      if (img) img.removeEventListener('load', update);
    };
  }, []);

  // Once the entrance plays (fonts/layout settle ~1.5s after mount) re-measure
  // the diagonal connector so it snaps onto the portrait corner and heading.
  useEffect(() => {
    const t = setTimeout(() => window.dispatchEvent(new Event('resize')), 1500);
    return () => clearTimeout(t);
  }, []);

  // Subtle parallax drift for the portrait card as the page scrolls past it
  useEffect(() => {
    const el = portraitRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const centerY = rect.top + rect.height / 2;
      // +1 when the card is above viewport center, -1 below; card lags behind the scroll
      const norm = Math.max(-0.7, Math.min(0.7, (vh / 2 - centerY) / vh));
      el.style.transform = `translate3d(0, ${(norm * 26).toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const Aboutdata = [
    {
      icon: <FiCode size={28} />,
      title: 'Languages',
      desc: 'C++, Python, JavaScript, TypeScript',
    },
    {
      icon: <FiBookOpen size={28} />,
      title: 'Education',
      desc: 'B.Tech Electrical Engg. — PEC, Chandigarh · GPA 7.69/10',
    },
    {
      icon: <FiLayers size={28} />,
      title: 'Projects',
      desc: 'AssetFlow ERP · InstaDev · OpenClaw AI platform',
    },
    {
      icon: <FiAward size={28} />,
      title: 'Achievements',
      desc: 'SIH internal round · Oracle Agentic AI certified · C++ Elite Topper (Top 5% of 26k+)',
    },
  ];

  return (
    <div
      id="about"
      ref={sectionRef}
      className="snap-stop relative w-full min-h-screen bg-black overflow-hidden flex items-center justify-center font-sans tracking-wide py-20 px-6 md:px-12"
    >
      {/* --- BG EFFECTS --- */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />
      <div
        className="absolute inset-0 z-[15] pointer-events-none"
        style={{ background: 'radial-gradient(circle at 30% 50%, transparent 20%, rgba(0,0,0,0.9) 100%)' }}
      />

      {/* --- CONTENT (each element reveals the moment it scrolls into view:
          portrait, header, bio, stat cards and CTA rise on their own beat) --- */}
      <div
        ref={contentRef}
        className="relative z-[50] w-full lg:w-[92%] flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16"
      >
        {/* --- PORTRAIT CARD (larger, gold corner brackets, double-frame look) --- */}
        <div
          ref={portraitRef}
          className="relative w-72 sm:w-80 md:w-96 lg:w-[440px] xl:w-[540px] shrink-0 aspect-[3/4] will-change-transform"
        >
          {/* Entrance — portrait tilts upright and rises in as it scrolls into
              view (outer div is owned by the scroll parallax; this inner
              layer animates) */}
          <motion.div
            ref={portraitBox}
            initial={{ opacity: 0, y: 64, rotate: -2.5, scale: 0.96 }}
            animate={portraitShown ? { opacity: 1, y: 0, rotate: 0, scale: 1 } : {}}
            transition={{ duration: 0.9, ease: EASE, delay: 0.05 }}
            className="relative h-full w-full"
          >
            {/* outer double-frame — dimmer gold, offset beyond the corner brackets */}
            <div className="absolute -inset-5 border-[1.5px] border-[#D4AF37]/25" />
            {/* corner brackets — slow breathing glow, phase-shifted so they pulse independently */}
            <div
              className="absolute -top-3 -left-3 w-11 h-11 border-t-2 border-l-2 border-[#D4AF37] animate-bracketBreath"
              style={{ animationDelay: '-0.4s' }}
            />
            <div
              className="absolute -top-3 -right-3 w-11 h-11 border-t-2 border-r-2 border-[#D4AF37] animate-bracketBreath"
              style={{ animationDelay: '-1.6s' }}
            />
            <div
              className="absolute -bottom-3 -left-3 w-11 h-11 border-b-2 border-l-2 border-[#D4AF37] animate-bracketBreath"
              style={{ animationDelay: '-3.1s' }}
            />
            <div
              className="absolute -bottom-3 -right-3 w-11 h-11 border-b-2 border-r-2 border-[#D4AF37] animate-bracketBreath"
              style={{ animationDelay: '-2.2s' }}
            />
            {/* subtle full border */}
            <div className="absolute inset-0 border border-[#D4AF37]/20" />
            {/* photo */}
            <img
              src="/images/bhavesh-portrait.png"
              alt="Bhavesh Sabnani — Software Engineer"
              className="w-full h-full object-cover object-top"
            />
            {/* caption — like the reference's signature watermark */}
            <div className="absolute bottom-3 right-3 font-mono text-[11px] md:text-xs uppercase tracking-[0.25em] text-[#D4AF37] bg-black/45 px-3 py-1.5 rounded-sm">
              Bhavesh Sabnani
            </div>
          </motion.div>
        </div>

        {/* Main Content Pane */}
        <div className="w-full lg:w-[56%] flex flex-col space-y-10 pointer-events-auto bg-black/40 backdrop-blur-sm p-8 md:p-12 border border-[#8C6D4F]/5 rounded-2xl">
          {/* Header — label, per-letter heading, self-drawing underline */}
          <motion.div
            ref={headerBox}
            initial={{ opacity: 0, y: 24 }}
            animate={headerShown ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
            className="space-y-3"
          >
            <p className="text-[#cbb59d] font-mono text-[10px] md:text-xs uppercase tracking-[0.5em]">
              System Info
            </p>

            <motion.h2
              ref={headingRef}
              aria-label="About Me."
              className="text-3xl md:text-4xl lg:text-6xl font-black text-[#E8DFD8] tracking-tighter uppercase"
            >
              {HEADING_TEXT.split('').map((ch, i) => (
                <motion.span
                  key={i}
                  aria-hidden
                  initial={{ opacity: 0, y: 30, rotate: 6 }}
                  animate={headerShown ? { opacity: 1, y: 0, rotate: 0 } : {}}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.1 + i * 0.045 }}
                  className={`inline-block ${ch === '.' ? 'text-[#cbb59d]' : ''}`}
                >
                  {ch === ' ' ? '\u00A0' : ch}
                </motion.span>
              ))}
            </motion.h2>

            {/* gold underline that draws itself under the title */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={headerShown ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
              className="h-[3px] w-16 origin-left bg-gradient-to-r from-[#D4AF37] to-transparent"
            />
          </motion.div>

          {/* Bio Paragraphs — each rises as it scrolls in */}
          <Rise as="p" delay={0.05} className="text-[#E8DFD8] text-sm md:text-base lg:text-lg xl:text-xl leading-relaxed max-w-2xl">
            I'm a results-driven <span className="text-[#D4AF37] font-semibold">Software Engineer</span>{' '}
            who{' '}
            <span className="text-[#D4AF37] font-semibold">
              engineers scalable systems and agentic AI
            </span>{' '}
            — spanning high-concurrency backends, modern full-stack interfaces, and autonomous LLM
            orchestration. I build secure, high-performance web systems with{' '}
            <span className="text-[#cbb59d] font-medium">Next.js</span>,{' '}
            <span className="text-[#cbb59d] font-medium">Express.js</span>,{' '}
            <span className="text-[#cbb59d] font-medium">WebSockets</span>, and{' '}
            <span className="text-[#cbb59d] font-medium">AWS</span> cloud-native architecture, and I
            architect privacy-first B2B systems that balance absolute user privacy with real-time
            alerting.
          </Rise>
          <Rise as="p" delay={0.1} className="text-[#E8DFD8] text-sm md:text-base lg:text-lg xl:text-xl leading-relaxed max-w-2xl">
            Strong DSA and OOPs fundamentals —{' '}
            <span className="text-[#D4AF37] font-semibold">200+ LeetCode problems solved</span> — keep
            my code clean and highly optimized. Currently pursuing my B.Tech in Electrical Engineering
            at Punjab Engineering College, Chandigarh (GPA 7.69/10), with a JEE Mains score in the 98.04
            percentile.
          </Rise>

          {/* Cards Grid — each card springs up the moment it scrolls in */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Aboutdata.map((item, idx) => (
              <Rise
                key={item.title}
                delay={0.08}
                y={40}
                className="group p-7 bg-[#cbb59d]/5 border border-[#8C6D4F]/10 hover:border-[#cbb59d]/40 hover:-translate-y-1.5 hover:bg-[#cbb59d]/[0.08] hover:shadow-[0_14px_36px_rgba(0,0,0,0.5),0_0_22px_rgba(203,181,157,0.08)] transition-all duration-300 rounded-xl"
              >
                <div className="text-[#cbb59d] mb-4 opacity-80 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110 group-hover:text-[#D4AF37]">
                  {item.icon}
                </div>
                <h4 className="text-[#E8DFD8] text-sm md:text-base font-bold uppercase tracking-widest mb-2">
                  {item.title}
                </h4>
                <p className="text-[#C0A68A] text-xs md:text-sm leading-relaxed">{item.desc}</p>
              </Rise>
            ))}
          </div>

          {/* CTA */}
          <Rise delay={0.05} className="pt-6">
            <a
              href="/resume.pdf"
              className="group relative inline-flex items-center gap-3.5 overflow-hidden px-10 py-4 rounded-md border-2 border-[#D4AF37]/80 bg-black/40 text-[#D4AF37] font-mono text-xs md:text-sm font-bold uppercase tracking-[0.3em] backdrop-blur-sm transition-all duration-300 hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] shadow-[0_0_24px_rgba(212,175,55,0.12)] hover:shadow-[0_0_44px_rgba(212,175,55,0.45)]"
            >
              {/* gold sheen sweep on hover, matching the site's CTAs */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-[200%] transition-transform duration-700 ease-out group-hover:translate-x-[500%]"
              />
              <span>Download Resume</span>
              <FiDownload
                size={18}
                className="transition-transform duration-300 group-hover:translate-y-0.5"
              />
            </a>
          </Rise>
        </div>
      </div>

      {/* Diagonal gold accent line — portrait frame → ABOUT ME. heading (desktop only) */}
      {connector && (
        <div className="hidden lg:block absolute z-[45] pointer-events-none" aria-hidden="true">
          {/* start dot at the portrait corner */}
          <div
            className="absolute w-2 h-2 rounded-full bg-[#D4AF37]/70 shadow-[0_0_8px_rgba(212,175,55,0.6)]"
            style={{ left: connector.x1 - 4, top: connector.y1 - 4 }}
          />
          {/* diagonal line */}
          <div
            className="absolute h-[1.5px] bg-gradient-to-r from-[#D4AF37]/70 via-[#D4AF37]/35 to-transparent"
            style={{
              left: connector.x1,
              top: connector.y1 - 0.75,
              width: connector.length,
              transform: `rotate(${connector.angle}rad)`,
              transformOrigin: '0 50%',
            }}
          />
          {/* diamond endpoint beside the heading */}
          <div
            className="absolute w-[9px] h-[9px] rotate-45 border border-[#D4AF37]/80 bg-[#D4AF37]/15"
            style={{ left: connector.x2 - 4.5, top: connector.y2 - 4.5 }}
          />
        </div>
      )}
    </div>
  );
}
