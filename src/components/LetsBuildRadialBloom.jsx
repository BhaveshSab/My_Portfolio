import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  SiCplusplus,
  SiPython,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiDocker,
  SiGoogle,
} from 'react-icons/si';
import { FiCloud, FiAward, FiTerminal } from 'react-icons/fi';

/**
 * LET'S BUILD — a clean, self-contained showcase.
 *
 * Eight upright logo tiles sit on a ring that revolves slowly (labels always
 * readable — never rotated sideways), pausing the instant you hover a tile,
 * which lifts and glows it. The hub is a big two-line lockup: a static
 * "LET'S" over a rotating BUILD / CREATE / INNOVATE / SCALE / AUTOMATE word.
 *
 * The whole stage is measured and scaled so the ring + hub always fit the
 * viewport at any width: no clipping, no overlap, no scattered cards.
 */
const ROTATING_WORDS = ['BUILD', 'CREATE', 'INNOVATE', 'SCALE', 'AUTOMATE'];

const TILES = [
  {
    id: 'cpp',
    name: 'C++ / PYTHON',
    sub: 'Elite Top 5%',
    logos: [
      { Icon: SiCplusplus, name: 'C++', color: '#00599C' },
      { Icon: SiPython, name: 'Python', color: '#3776AB' },
    ],
  },
  {
    id: 'react',
    name: 'NEXT.JS / REACT',
    sub: 'Frontend Tech',
    logos: [
      { Icon: SiReact, name: 'React.js', color: '#61DAFB' },
      { Icon: SiNextdotjs, name: 'Next.js', color: '#E8DFD8' },
    ],
  },
  {
    id: 'node',
    name: 'NODE.JS / EXPRESS',
    sub: 'REST & WebSockets',
    logos: [
      { Icon: SiNodedotjs, name: 'Node.js', color: '#339933' },
      { Icon: SiExpress, name: 'Express.js', color: '#E8DFD8' },
    ],
  },
  {
    id: 'db',
    name: 'MONGODB / POSTGRES',
    sub: 'Prisma & SQL',
    logos: [
      { Icon: SiMongodb, name: 'MongoDB', color: '#47A248' },
      { Icon: SiPostgresql, name: 'PostgreSQL', color: '#699ECA' },
    ],
  },
  {
    id: 'cloud',
    name: 'AWS & DOCKER',
    sub: 'EC2 & SES',
    logos: [
      { Icon: FiCloud, name: 'AWS', color: '#FF9900' },
      { Icon: SiDocker, name: 'Docker', color: '#2496ED' },
    ],
  },
  {
    id: 'ai',
    name: 'GOOGLE ANTIGRAVITY',
    sub: 'Agentic AI',
    logos: [{ Icon: SiGoogle, name: 'Google', color: '#4285F4' }],
  },
  {
    id: 'sih',
    name: 'SIH HACKATHON',
    sub: 'Top Tier Team',
    logos: [{ Icon: FiAward, name: 'Achievement', color: '#D4AF37' }],
  },
  {
    id: 'dsa',
    name: 'DSA & OOPS',
    logos: [{ Icon: FiTerminal, name: 'DSA', color: '#E8DFD8' }],
  },
];

// ---- Stage geometry (unscaled 740-space; scaled as a unit to fit) ----
// The whole stage is transform-scaled to fit the viewport (~0.69 on a 768p
// laptop, lower on short panes), so every size here is in DESIGN space and
// gets multiplied by that scale on screen. Tile labels therefore counter-scale
// (see `labelScale` below) instead of using fixed design px, which is what
// made them illegible on anything shorter than a desktop monitor.
const STAGE = 740; // design size
const RADIUS = 268; // ring radius
// 158x130 is the largest tile that never collides with its neighbour while the
// ring spins: overlap appears as soon as the tile diagonal (204.6) exceeds the
// adjacent-centre chord 2*RADIUS*sin(pi/8) = 205.1. Don't grow these without
// growing RADIUS to match.
const TILE_W = 158;
const TILE_H = 130;
const SLOT_COUNT = TILES.length;
// Hub clear diameter: space between opposite tile inner edges
const HUB_CLEAR = 2 * (RADIUS - TILE_W / 2); // 378
const WORD_FONT = Math.min(58, HUB_CLEAR * 0.185); // fits 8-char words
// Shockwave burst ring diameter — matches the orbit guideline so the ripple
// reads as a pulse travelling along the ring where the tiles will land.
const SHOCK_RING = (RADIUS + TILE_W / 2 + 14) * 2; // 722 in design space

// ---- Burst entrance timing (seconds) ----
const BURST_DELAY = 0.28; // beat before the first tile launches
const BURST_STAGGER = 0.055; // gap between successive tile launches
const BURST_DUR = 0.6; // each tile's flight time

// easeOutBack: springy outward snap with a small overshoot past the ring
const easeOutBack = (x) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};
// easeInCubic: accelerating pull used when tiles retract into the pile
const easeInCubic = (x) => x * x * x;

export default function LetsBuildRadialBloom() {
  const sectionRef = useRef(null);
  const innerRefs = useRef([]);
  const angleRef = useRef(0);
  const burstStartRef = useRef(0);
  const collapseStartRef = useRef(0);
  const collapseFromRef = useRef([]);

  const [scale, setScale] = useState(() => (typeof window === 'undefined' ? 1 : 0.6));
  const [entered, setEntered] = useState(false);
  const [bursting, setBursting] = useState(false);
  const [shock, setShock] = useState(false);
  const [spinReady, setSpinReady] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [collapsing, setCollapsing] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [wordIndex, setWordIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // Scroll fallback for in-view detection: some embedded webviews / throttled
  // tabs starve IntersectionObserver (which framer's useInView relies on),
  // leaving the burst stuck at scale 0.35 forever. A cheap scroll+resize
  // check mirrors the section's on-screen state, so the burst fires and the
  // collapse-on-exit still works everywhere. When IO works normally this just
  // tracks the same state redundantly.
  const [scrollInView, setScrollInView] = useState(false);
  useEffect(() => {
    const check = () => {
      const el = sectionRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      setScrollInView(r.top < vh * 0.85 && r.bottom > vh * 0.15);
    };
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    check();
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, []);
  const ioInView = useInView(sectionRef, { amount: 0.25 });
  const isInView = ioInView || scrollInView;

  // The stage is transform-scaled to fit, so a fixed design-px label shrinks
  // with it — the 10px sub-labels rendered at ~8px on a 1366x768 laptop, which
  // is why the tile text was unreadable. Counter-scale the type so its
  // ON-SCREEN size holds up. The cap is deliberate: the tile box CANNOT grow
  // (see the TILE_W/TILE_H collision note above), so at full counter-scale the
  // label block plus the logo dock still has to fit 158x130 of design space —
  // budgeted for a 2-line name and a 2-line sub with room to spare.
  const labelScale = Math.min(1.15, 1 / scale);
  const logoBox = 44 - (labelScale - 1) * 85;
  const logoIcon = 24 - (labelScale - 1) * 46;
  // The hub sits in the ring's empty middle (HUB_CLEAR = 378 design px wide),
  // so its sub-labels can counter-scale much further than the tile labels
  // before they run out of room.
  const hubScale = Math.min(1.6, 1 / scale);

  // Responsive fit: stage side = min(740, viewport width - margin, viewport
  // height - chrome) — the whole ring scales down as one unit.
  useEffect(() => {
    const compute = () => {
      const s = Math.max(
        320,
        Math.min(STAGE, window.innerWidth - 24, window.innerHeight - 150)
      );
      setScale(s / STAGE);
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  // Phase machine — burst on first view AND on every return to the viewport;
  // when the section scrolls away (scroll-up), the tiles retract back into
  // the center pile so re-entering re-bursts from a clean stack.
  useEffect(() => {
    if (isInView && !entered) setEntered(true);
    if (reducedMotion) return;
    if (isInView) {
      if (collapsed && !collapsing) {
        burstStartRef.current = performance.now();
        setCollapsed(false);
        setBursting(true);
        setShock(true); // shockwave lifecycle effect handles its fade-out
      }
    } else if (!collapsed && !collapsing && (bursting || spinReady)) {
      // Freeze each tile where it is right now, then retract to the hub
      collapseStartRef.current = performance.now();
      collapseFromRef.current = TILES.map((tile, i) => {
        const el = innerRefs.current[i];
        if (!el) return { x: 0, y: 0 };
        const m = /(-?[\d.]+)px\s+(-?[\d.]+)px/.exec(el.style.translate || '');
        return m ? { x: +m[1], y: +m[2] } : { x: 0, y: 0 };
      });
      setCollapsing(true);
      setBursting(false);
      setSpinReady(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isInView,
    entered,
    reducedMotion,
    collapsed,
    collapsing,
    bursting,
    spinReady,
  ]);

  // Shockwave lifecycle: the two rings expand from the hub as the tiles
  // launch and unmount themselves ~1.75s later, before the last tile lands.
  useEffect(() => {
    if (!shock) return;
    const t = setTimeout(() => setShock(false), 1750);
    return () => clearTimeout(t);
  }, [shock]);

  // Place tiles on the ring (positions are written per-frame while spinning)
  const writePositions = (initial = false) => {
    const a = initial ? 0 : angleRef.current;
    TILES.forEach((tile, i) => {
      const el = innerRefs.current[i];
      if (!el) return;
      const slot = -Math.PI / 2 + (i / SLOT_COUNT) * 2 * Math.PI + a;
      const x = Math.cos(slot) * RADIUS;
      const y = Math.sin(slot) * RADIUS;
      el.style.translate = `${x.toFixed(2)}px ${y.toFixed(2)}px`;
    });
  };

  // Resting state on mount: reduced-motion users get the finished ring
  // immediately; everyone else starts perfectly stacked at the hub so the
  // entrance can burst outward from a single pile.
  useEffect(() => {
    if (reducedMotion) {
      writePositions(true);
    } else {
      TILES.forEach((tile, i) => {
        const el = innerRefs.current[i];
        if (el) el.style.translate = '0px 0px';
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  // Motion — timer-driven (16ms ≈ 60fps) so it keeps running even in
  // environments that throttle requestAnimationFrame. While `bursting` it
  // plays the staggered spring-out from the center pile; once the burst
  // lands it switches to the continuous gentle revolution (only while the
  // section is on screen); while `collapsing` it retracts every tile back
  // to the center pile so the entrance can replay on return.
  useEffect(() => {
    if (reducedMotion || hovered) return;
    if (!bursting && !spinReady && !collapsing) return;
    const id = setInterval(() => {
      if (document.hidden) return;
      if (collapsing) {
        const t = (performance.now() - collapseStartRef.current) / 1000;
        const D = 0.5;
        if (t >= D) {
          TILES.forEach((tile, i) => {
            const el = innerRefs.current[i];
            if (el) el.style.translate = '0px 0px';
          });
          setCollapsing(false);
          setCollapsed(true);
        } else {
          const e = easeInCubic(Math.min(1, t / D)); // 0 → 1 accelerating
          TILES.forEach((tile, i) => {
            const el = innerRefs.current[i];
            if (!el) return;
            const f = collapseFromRef.current[i] || { x: 0, y: 0 };
            el.style.translate = `${(f.x * (1 - e)).toFixed(2)}px ${
              (f.y * (1 - e)).toFixed(2)
            }px`;
          });
        }
        return;
      }
      if (bursting) {
        const t = (performance.now() - burstStartRef.current) / 1000;
        let allDone = true;
        TILES.forEach((tile, i) => {
          const el = innerRefs.current[i];
          if (!el) return;
          const local = Math.min(
            1,
            Math.max(0, (t - BURST_DELAY - i * BURST_STAGGER) / BURST_DUR)
          );
          if (local < 1) allDone = false;
          const e = easeOutBack(local);
          const slot = -Math.PI / 2 + (i / SLOT_COUNT) * 2 * Math.PI;
          const rr = RADIUS * e;
          el.style.translate = `${Math.cos(slot) * rr}px ${
            Math.sin(slot) * rr
          }px`;
        });
        if (allDone) {
          setBursting(false);
          setSpinReady(true);
        }
      } else if (isInView) {
        angleRef.current = (angleRef.current + 0.0035) % (Math.PI * 2);
        writePositions();
      }
    }, 16);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isInView,
    spinReady,
    bursting,
    collapsing,
    reducedMotion,
    hovered,
  ]);

  // Rewrite once when spinReady so positions are current after the pause
  useEffect(() => {
    if (spinReady) writePositions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinReady]);

  // Rotate the center word
  useEffect(() => {
    if (reducedMotion || !entered) return;
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 2600);
    return () => clearInterval(timer);
  }, [reducedMotion, entered]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen text-[#E8DFD8] flex flex-col items-center justify-center overflow-hidden px-4 py-6 select-none"
    >
      {/* Fully opaque black stage — the bloom is its own clean section; the
          telephone film only starts AFTER it, never behind it */}
      <div aria-hidden className="absolute inset-0 bg-[#000] pointer-events-none" />
      {/* Faint ambient gold bloom behind the ring */}
      <div className="absolute w-[620px] h-[620px] bg-[#D4AF37]/[0.05] rounded-full blur-[150px] pointer-events-none" />

      {/* Eyebrow */}
      <div className="relative z-10 text-center mb-5 md:mb-8">
        <span className="text-xs md:text-sm font-mono tracking-[0.45em] text-[#D4AF37] uppercase">
          05&nbsp;//&nbsp;Let&rsquo;s Build
        </span>
      </div>

      {/* ---- Stage: measured box holding the scaled ring + hub ---- */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: STAGE * scale, height: STAGE * scale }}
      >
        <div
          className="relative"
          style={{
            width: STAGE,
            height: STAGE,
            transform: `scale(${scale})`,
            transformOrigin: 'center',
          }}
        >
          {/* Shockwave — two gold rings pulse outward from the hub the instant
              the burst fires and dissolve before the last tile lands */}
          {shock && (
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2"
              style={{ width: 0, height: 0, zIndex: 8 }}
            >
              {/* Crisp leading hairline */}
              <motion.div
                initial={{ scale: 0.08, opacity: 0 }}
                animate={{ scale: [0.08, 1], opacity: [0, 0.9, 0] }}
                transition={{
                  duration: 1.25,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.04,
                }}
                className="absolute rounded-full border border-[#D4AF37]"
                style={{
                  width: SHOCK_RING,
                  height: SHOCK_RING,
                  left: -SHOCK_RING / 2,
                  top: -SHOCK_RING / 2,
                  boxShadow:
                    '0 0 26px rgba(212,175,55,0.45), inset 0 0 20px rgba(212,175,55,0.18)',
                }}
              />
              {/* Soft echo ring travelling slightly behind */}
              <motion.div
                initial={{ scale: 0.1, opacity: 0 }}
                animate={{ scale: [0.1, 1.09], opacity: [0, 0.4, 0] }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.1 }}
                className="absolute rounded-full border border-[#D4AF37]/50"
                style={{
                  width: SHOCK_RING,
                  height: SHOCK_RING,
                  left: -SHOCK_RING / 2,
                  top: -SHOCK_RING / 2,
                }}
              />
            </div>
          )}

          {/* Ring guideline — materializes as the burst lands */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={entered ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.55 }}
            className="absolute rounded-full border border-[#D4AF37]/15 pointer-events-none"
            style={{
              width: (RADIUS + TILE_W / 2 + 14) * 2,
              height: (RADIUS + TILE_W / 2 + 14) * 2,
              left: '50%',
              top: '50%',
              marginLeft: -(RADIUS + TILE_W / 2 + 14),
              marginTop: -(RADIUS + TILE_W / 2 + 14),
            }}
          />

          {/* Ring tiles — upright always */}
          {TILES.map((tile, i) => {
            const isHovered = hovered === tile.id;
            const dimmed = hovered && !isHovered;
            return (
              <div
                key={tile.id}
                className="absolute"
                style={{
                  left: '50%',
                  top: '50%',
                  marginLeft: -TILE_W / 2,
                  marginTop: -TILE_H / 2,
                  zIndex: isHovered ? 60 : 10,
                }}
              >
                {/* Entrance: the pile fades in first, then each tile scale-pops
                    the moment its burst launches (positions fly outward on the
                    movement layer below) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.35 }}
                  animate={entered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.35 }}
                  transition={{
                    opacity: { duration: 0.35, ease: 'easeOut', delay: 0.08 },
                    scale: {
                      type: 'spring',
                      stiffness: 260,
                      damping: 19,
                      delay: entered ? 0.32 + i * 0.055 : 0,
                    },
                  }}
                  className="cursor-pointer"
                  onMouseEnter={() => setHovered(tile.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Movement layer — translate is written per-frame here and
                      React NEVER re-renders this node, so word/hover re-renders
                      can't reset the ring positions */}
                  <div
                    ref={(el) => (innerRefs.current[i] = el)}
                    aria-label={tile.name}
                    style={{ width: 0, height: 0, overflow: 'visible' }}
                  >
                    <div
                      className="flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-[#0b0a08]/95 backdrop-blur-xl border px-2 py-2"
                      style={{
                        width: TILE_W,
                        height: TILE_H,
                        scale: isHovered ? 1.16 : 1,
                        opacity: dimmed ? 0.55 : 1,
                        borderColor: isHovered
                          ? 'rgba(212,175,55,0.95)'
                          : 'rgba(212,175,55,0.28)',
                        boxShadow: isHovered
                          ? '0 0 34px rgba(212,175,55,0.45), inset 0 0 26px rgba(212,175,55,0.07)'
                          : '0 14px 30px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.05)',
                        transition:
                          'scale 280ms cubic-bezier(.22,1,.36,1), opacity 300ms ease, border-color 280ms ease, box-shadow 280ms ease',
                      }}
                    >
                      {/* Brand logo dock — shrinks as the labels counter-scale up
                          so the taller text block still fits the fixed tile box */}
                      <div className="flex items-center justify-center gap-1.5">
                        {tile.logos.map(({ Icon, name, color }) => (
                          <span
                            key={name}
                            className="rounded-lg bg-gradient-to-b from-[#161310] to-black border border-[#605448]/40 flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                            style={{ width: logoBox, height: logoBox }}
                          >
                            <Icon size={logoIcon} style={{ color }} />
                          </span>
                        ))}
                      </div>
                      <span
                        className="font-extrabold uppercase text-center"
                        style={{
                          fontSize: 14.5 * labelScale,
                          lineHeight: 1.15,
                          letterSpacing: '0.01em',
                          color: isHovered ? '#F2D06B' : '#F5F0E9',
                          textShadow: '0 1px 3px rgba(0,0,0,0.9)',
                        }}
                      >
                        {tile.name}
                      </span>
                      {tile.sub && (
                        <span
                          className="font-mono font-medium text-[#DCBC80] uppercase text-center"
                          style={{
                            fontSize: 11 * labelScale,
                            lineHeight: 1.2,
                            letterSpacing: '0.05em',
                          }}
                        >
                          {tile.sub}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}

          {/* Hub lockup — floats above the ring, never rotates */}
          <div className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={entered ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
              className="flex flex-col items-center"
            >
              <span
                className="font-bold tracking-[0.08em] text-[#F0E9E1] uppercase"
                style={{
                  fontSize: WORD_FONT * 0.72,
                  textShadow: '0 2px 10px rgba(0,0,0,0.9)',
                }}
              >
                Let&rsquo;s
              </span>
              <div
                className="overflow-hidden leading-none"
                style={{ height: WORD_FONT * 1.12 }}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={wordIndex}
                    initial={{ y: WORD_FONT * 0.55, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -WORD_FONT * 0.55, opacity: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="block font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F6E3B4] to-[#E1B948]"
                    style={{
                      fontSize: WORD_FONT,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: 'drop-shadow(0 0 22px rgba(212,175,55,0.45))',
                    }}
                  >
                    {ROTATING_WORDS[wordIndex]}.
                  </motion.span>
                </AnimatePresence>
              </div>
              <span
                className="font-mono font-medium text-[#E4CFA8] uppercase mt-3.5"
                style={{
                  fontSize: 13 * hubScale,
                  letterSpacing: '0.34em',
                  textShadow: '0 1px 4px rgba(0,0,0,0.9)',
                }}
              >
                Skill Ecosystem
              </span>
              <span
                className="font-mono text-[#C6A575] uppercase mt-2"
                style={{ fontSize: 11 * hubScale, letterSpacing: '0.22em' }}
              >
                Hover a tile to pause
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
