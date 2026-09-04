import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TextShimmer } from './ui/text-shimmer';
import {
  FiBox,
  FiCloud,
  FiCode,
  FiCpu,
  FiDatabase,
  FiLayout,
  FiMonitor,
  FiPause,
  FiPlay,
  FiServer,
  FiZap,
} from 'react-icons/fi';
import {
  SiCplusplus,
  SiPython,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiRedux,
  SiFramer,
  SiShadcnui,
  SiNodedotjs,
  SiExpress,
  SiSocketdotio,
  SiRedis,
  SiJsonwebtokens,
  SiMongodb,
  SiPostgresql,
  SiPrisma,
  SiVercel,
  SiDocker,
  SiN8N,
  SiPostman,
  SiGit,
  SiGoogle,
} from 'react-icons/si';

const SECTION_CARDS = [
  {
    id: 'languages',
    code: '01 // DOMAIN',
    title: 'Languages & Core',
    tagline: 'Algorithmic Problem Solving & Type Safety',
    categoryIcon: FiCode,
    skills: ['C++', 'Python', 'JavaScript', 'TypeScript', 'DSA', 'OOPs'],
    metrics: '200+ LeetCode Solved | Elite NPTEL C++ (Top 5%)',
    description:
      'Expertise in low-level memory handling, algorithm design, asynchronous paradigms, and strict full-stack type safety.',
  },
  {
    id: 'frontend',
    code: '02 // CLIENT',
    title: 'Frontend Ecosystem',
    tagline: 'Reactive UI & Performant Web Apps',
    categoryIcon: FiLayout,
    skills: ['React.js', 'Next.js', 'Redux Toolkit', 'Tailwind CSS', 'Framer Motion', 'shadcn/ui'],
    metrics: 'SSR / SSG Architecture | Dynamic Layout Animations',
    description:
      'Building modular glassmorphic component systems, state management feeds, and fluid interactive animations.',
  },
  {
    id: 'backend',
    code: '03 // SERVER',
    title: 'Backend & Systems',
    tagline: 'Scalable Microservices & Real-Time APIs',
    categoryIcon: FiServer,
    skills: ['Node.js', 'Express.js', 'WebSockets', 'REST APIs', 'JWT Auth', 'Redis'],
    metrics: 'Concurrency Locking | Row-Level Transactional Safety',
    description:
      'Architecting RESTful endpoints, real-time bi-directional socket pipelines, and secure stateless token authentication.',
  },
  {
    id: 'database-cloud',
    code: '04 // INFRA',
    title: 'Database & Cloud',
    tagline: 'Relational Schemas & Container Deployments',
    categoryIcon: FiDatabase,
    skills: ['PostgreSQL', 'MongoDB', 'Prisma ORM', 'Advanced SQL', 'AWS (EC2/SES)', 'Docker'],
    metrics: '13-Table Relational Schema | Multi-Tenant RBAC',
    description:
      'ACID-compliant relational database modeling, NoSQL document indexing, Dockerized isolation, and AWS cloud compute.',
  },
  {
    id: 'ai-tools',
    code: '05 // AGENTIC',
    title: 'AI & Developer Tools',
    tagline: 'Automations & Multi-Model Workflows',
    categoryIcon: FiZap,
    skills: ['Google Antigravity', 'n8n Workflows', 'LLM Integration', 'Postman', 'Git & GitHub', 'Vercel'],
    metrics: 'Autonomous AI Agents | Self-Hosted Node Pipelines',
    description:
      'Leveraging agentic developer workflows, continuous integration pipelines, and custom AI execution environments.',
  },
];

// Brand logos for each skill chip (verified against installed react-icons)
const SKILL_ICONS = {
  'C++': SiCplusplus,
  Python: SiPython,
  JavaScript: SiJavascript,
  TypeScript: SiTypescript,
  DSA: FiCpu,
  OOPs: FiBox,
  'React.js': SiReact,
  'Next.js': SiNextdotjs,
  'Redux Toolkit': SiRedux,
  'Tailwind CSS': SiTailwindcss,
  'Framer Motion': SiFramer,
  'shadcn/ui': SiShadcnui,
  'Node.js': SiNodedotjs,
  'Express.js': SiExpress,
  WebSockets: SiSocketdotio,
  'REST APIs': FiServer,
  'JWT Auth': SiJsonwebtokens,
  Redis: SiRedis,
  PostgreSQL: SiPostgresql,
  MongoDB: SiMongodb,
  'Prisma ORM': SiPrisma,
  'Advanced SQL': FiDatabase,
  'AWS (EC2/SES)': FiCloud,
  Docker: SiDocker,
  'Google Antigravity': SiGoogle,
  'n8n Workflows': SiN8N,
  'LLM Integration': FiZap,
  Postman: SiPostman,
  'Git & GitHub': SiGit,
  Vercel: SiVercel,
};

// Official brand colors for each skill logo (dark-brand marks fall back to a light tone on the black surface)
const BRAND_COLORS = {
  'C++': '#00599C',
  Python: '#3776AB',
  JavaScript: '#F7DF1E',
  TypeScript: '#3178C6',
  'React.js': '#61DAFB',
  'Next.js': '#E8DFD8',
  'Redux Toolkit': '#764ABC',
  'Tailwind CSS': '#06B6D4',
  'Framer Motion': '#0055FF',
  'shadcn/ui': '#E8DFD8',
  'Node.js': '#339933',
  'Express.js': '#E8DFD8',
  WebSockets: '#E8DFD8',
  'JWT Auth': '#E8DFD8',
  Redis: '#FF4438',
  PostgreSQL: '#4169E1',
  MongoDB: '#47A248',
  'Prisma ORM': '#E8DFD8',
  'AWS (EC2/SES)': '#FF9900',
  Docker: '#2496ED',
  'Google Antigravity': '#4285F4',
  'n8n Workflows': '#EA4B71',
  Postman: '#FF6C37',
  'Git & GitHub': '#F05032',
  Vercel: '#E8DFD8',
};

// Dock orchestration variants — tiles stagger upward from below the dock
const dockContainerVariants = {
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};

const dockTileVariants = {
  hidden: { opacity: 0, y: 34 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 22 },
  },
};

// Large brand-logo dock row (icons + brand colors, with a warm gold fallback).
// Pass a numeric `replayKey` that changes whenever the dock should replay its
// staggered rise; `animateIn` controls whether the replay animates or snaps.
function SkillDock({ skills, className = '', replayKey, animateIn = true }) {
  const hasReplay = typeof replayKey === 'number';
  return (
    <div
      className={`inline-flex items-center p-2 rounded-xl border border-[#605448]/25 bg-gradient-to-b from-white/[0.07] to-white/[0.02] backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_3px_10px_rgba(0,0,0,0.55),0_2px_6px_rgba(0,0,0,0.45)] ${className}`}
    >
      <motion.div
        key={hasReplay ? replayKey : 'static'}
        className="flex items-center gap-1"
        initial={animateIn ? 'hidden' : false}
        animate="show"
        variants={dockContainerVariants}
      >
        {skills.map((skill) => {
          const SkillIcon = SKILL_ICONS[skill];
          return (
            <motion.div
              key={skill}
              title={skill}
              role="img"
              aria-label={skill}
              variants={dockTileVariants}
              whileHover={{ scale: 1.1, y: -4, borderColor: 'rgba(212,175,55,0.6)' }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="w-9 h-9 rounded-lg bg-gradient-to-b from-black/40 to-black/80 border border-white/[0.09] flex items-center justify-center cursor-help shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] hover:from-[#181307] hover:to-black"
            >
              {SkillIcon && <SkillIcon size={19} style={{ color: BRAND_COLORS[skill] || '#cbb59d' }} />}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

// Orbit stage design size (before responsive scaling)
const BASE_W = 1240; // 2 * RADIUS_X + card width
const BASE_H = 780; // 2 * RADIUS_Y + card height
const RADIUS_X = 460;
const RADIUS_Y = 180;
const CARD_W = 320; // w-80
const CARD_H = 420; // h-[420px]

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function TechStackOrbit() {
  const [rotation, setRotation] = useState(0);
  const [isPaused, setIsPaused] = useState(prefersReducedMotion);
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [scale, setScale] = useState(1);
  const stageRef = useRef(null);
  // Timer-driven rotation (mirrors LetsBuildRadialBloom's motion loop): a
  // setInterval keeps advancing the orbit even where browsers throttle
  // requestAnimationFrame (background tabs, heavy pages, embedded webviews).
  // The step is derived from real elapsed time, so the angular velocity stays
  // constant whether ticks fire every 16ms or coalesce after a stall.
  const rotationRef = useRef(0);
  const lastTickRef = useRef(0);
  const RAD_PER_MS = 0.00012; // 0.12 rad/s — matches the old ~0.002 rad/frame @ 60fps

  // Smooth continuous rotation loop (linear easing — constant-rate motion).
  // Keeps revolving at all times EXCEPT while the cursor is resting on a card
  // (hoveredId set), a modal is open, or the user paused it manually.
  useEffect(() => {
    lastTickRef.current = performance.now();
    const tick = () => {
      if (!isPaused && !hoveredId && !selectedCategory) {
        const now = performance.now();
        const dt = Math.max(0, Math.min(now - lastTickRef.current, 250));
        lastTickRef.current = now;
        rotationRef.current =
          (rotationRef.current + dt * RAD_PER_MS) % (2 * Math.PI);
        setRotation(rotationRef.current);
      } else {
        // While gated, keep the clock current so resuming never jumps.
        lastTickRef.current = performance.now();
      }
    };
    const intervalId = setInterval(tick, 16);
    return () => clearInterval(intervalId);
  }, [isPaused, hoveredId, selectedCategory]);

  // Responsive scaling so the full orbit fits any viewport
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => setScale(Math.min(1, el.clientWidth / BASE_W));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  // Close modal on Escape
  useEffect(() => {
    if (!selectedCategory) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setSelectedCategory(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedCategory]);

  // The card closest to the viewer (front of the elliptical orbit) is the "active" category
  const totalCards = SECTION_CARDS.length;
  const angleStep = (2 * Math.PI) / totalCards;
  let frontIndex = 0;
  let maxSin = -Infinity;
  SECTION_CARDS.forEach((_, i) => {
    const s = Math.sin(angleStep * i + rotation);
    if (s > maxSin) {
      maxSin = s;
      frontIndex = i;
    }
  });

  // Bump the epoch whenever leadership changes so the new front card's dock
  // replays its staggered rise (remounting the dock for every card, snapping
  // non-leading docks to visible without animation)
  const [frontEpoch, setFrontEpoch] = useState(0);
  const prevFrontIndex = useRef(frontIndex);
  useEffect(() => {
    if (prevFrontIndex.current !== frontIndex) {
      prevFrontIndex.current = frontIndex;
      setFrontEpoch((e) => e + 1);
    }
  }, [frontIndex]);

  return (
    <section
      id="skills"
      className="relative w-full min-h-screen bg-black text-[#E8DFD8] flex flex-col items-center justify-center overflow-hidden py-20 px-6 md:px-12 font-sans tracking-wide select-none scroll-mt-24"
    >
      {/* Ambient Center Glow */}
      <div className="absolute z-0 w-[650px] h-[650px] bg-[#D4AF37]/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Header — staggered rise as the orbit section arrives */}
      <div className="relative z-10 text-center mb-10 md:mb-12">
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-[#cbb59d] font-mono text-xs md:text-sm uppercase tracking-[0.5em] mb-3"
        >
          DOMAINS &amp; CORE COMPETENCIES
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase"
        >
          <TextShimmer
            className="[--base-gradient-color:#FFFDF4]"
            baseGradient="linear-gradient(to right, #FFF2C9 0%, #F5D684 30%, #ECC45E 58%, #DFB149 80%, #CE9B37 100%)"
          >
            Technical Capabilities
          </TextShimmer>
          <span className="text-[#F2CD6F]">.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
          className="text-[#C0A68A] text-sm md:text-base mt-4 max-w-xl mx-auto"
        >
          Engineering scalable systems &amp; agentic AI — high-concurrency backends, modern frontends, and autonomous LLM orchestration. Click any category for detailed metrics.
        </motion.p>
      </div>

      {/* Orbit Canvas Container */}
      <div
        ref={stageRef}
        className="relative w-full max-w-[1280px] h-[580px] md:h-[810px] z-10"
        onMouseLeave={() => setHoveredId(null)}
      >
        {/* Stage reveal + scaled stage */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <div
            className="absolute left-1/2 top-1/2"
            style={{ width: BASE_W, height: BASE_H, transform: 'translate(-50%, -50%)' }}
          >
            <div className="w-full h-full" style={{ transform: `scale(${scale})` }}>
              {/* Orbit Ring Guideline */}
              <div
                className="absolute rounded-full border border-[#605448]/25 pointer-events-none"
                style={{
                  width: RADIUS_X * 2,
                  height: RADIUS_Y * 2,
                  left: '50%',
                  top: '50%',
                  marginLeft: -RADIUS_X,
                  marginTop: -RADIUS_Y,
                }}
              />

              {/* Center Pivot Node — solid surface above the orbit so card
                  text never shows through it */}
              <div className="absolute left-1/2 top-1/2 z-[400] w-32 h-32 -ml-16 -mt-16 rounded-full bg-[#0a0804] border border-[#D4AF37]/40 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.15)] animate-pulseShadow">
                <span className="text-[#D4AF37] text-[10px] font-mono tracking-widest uppercase">ENGINEER</span>
                <span className="text-[#E8DFD8] font-bold text-lg tracking-wide">BHAVESH</span>
                <span className="text-[9px] text-[#D9BE8E] tracking-wide text-center leading-tight px-1">SCALABLE SYSTEMS &amp; AGENTIC AI</span>
              </div>

              {/* Orbiting Section Cards */}
              {SECTION_CARDS.map((category, index) => {
                const totalCards = SECTION_CARDS.length;
                const angleStep = (2 * Math.PI) / totalCards;
                const currentAngle = angleStep * index + rotation;

                // Parametric orbital placement
                const x = Math.cos(currentAngle) * RADIUS_X;
                const y = Math.sin(currentAngle) * RADIUS_Y;

                // 3D Depth Mechanics
                const sinValue = Math.sin(currentAngle);
                const depthScale = 0.82 + 0.28 * ((sinValue + 1) / 2);
                const depthOpacity = 0.45 + 0.55 * depthScale;
                const zIndex = Math.round((sinValue + 1) * 100);

                const isHovered = hoveredId === category.id;
                // Front-of-orbit marker: glows until the user engages another card
                const isLeading = index === frontIndex;
                const isFrontGlow = isLeading && !hoveredId;
                const CategoryIcon = category.categoryIcon;

                // Comet trail: direction opposite to the direction of travel along the ellipse
                const travelAngle = Math.atan2(
                  -RADIUS_Y * Math.cos(currentAngle),
                  RADIUS_X * Math.sin(currentAngle)
                );
                const trailOpacity = isHovered
                  ? Math.min(1, 0.3 + 0.5 * depthScale + 0.25)
                  : 0.3 + 0.5 * depthScale;

                return (
                  <motion.div
                    key={category.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`Open ${category.title} details`}
                    className="absolute cursor-pointer"
                    style={{
                      left: '50%',
                      top: '50%',
                      marginLeft: -CARD_W / 2,
                      marginTop: -CARD_H / 2,
                      x,
                      y,
                      scale: isHovered ? 1.12 : depthScale,
                      opacity: depthOpacity,
                      zIndex: isHovered ? 999 : zIndex,
                    }}
                    onClick={() => setSelectedCategory(category)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedCategory(category);
                      }
                    }}
                    onMouseEnter={() => setHoveredId(category.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onFocus={() => setHoveredId(category.id)}
                    onBlur={() => setHoveredId(null)}
                    whileTap={{ scale: 0.97 }}
                    transition={{
                      scale: { type: 'spring', stiffness: 260, damping: 22 },
                      x: { duration: 0 },
                      y: { duration: 0 },
                      opacity: { duration: 0 },
                    }}
                  >
                    {/* Glowing gold comet trail (behind the card, pointing opposite to motion) */}
                    <div
                      className="pointer-events-none absolute"
                      style={{
                        left: '50%',
                        top: '50%',
                        width: 220,
                        height: 14,
                        marginLeft: -220,
                        marginTop: -7,
                        transformOrigin: '100% 50%',
                        transform: `rotate(${travelAngle}rad)`,
                        opacity: trailOpacity * 0.55,
                      }}
                    >
                      <div
                        className="w-full h-full rounded-full"
                        style={{
                          background: 'linear-gradient(to left, rgba(212,175,55,0.55), rgba(212,175,55,0))',
                          filter: 'blur(3px)',
                        }}
                      />
                    </div>
                    <div
                      className="pointer-events-none absolute"
                      style={{
                        left: '50%',
                        top: '50%',
                        width: 200,
                        height: 3,
                        marginLeft: -200,
                        marginTop: -1.5,
                        transformOrigin: '100% 50%',
                        transform: `rotate(${travelAngle}rad)`,
                        opacity: trailOpacity,
                      }}
                    >
                      <div
                        className="w-full h-full rounded-full"
                        style={{
                          background: 'linear-gradient(to left, rgba(212,175,55,0.95), rgba(212,175,55,0))',
                        }}
                      />
                    </div>

                    <div
                      className={`group relative w-80 h-[420px] rounded-2xl transition-all duration-300 ${
                        isHovered
                          ? '-translate-y-1.5 shadow-[0_0_45px_rgba(212,175,55,0.30)]'
                          : 'shadow-2xl'
                      }`}
                    >
                      {/* Resting gold gradient ring (masked to a 1.5px border, follows the radius) */}
                      <div
                        className="absolute inset-0 rounded-2xl pointer-events-none"
                        style={{
                          padding: '1.5px',
                          background:
                            'linear-gradient(135deg, rgba(212,175,55,0.55), rgba(96,84,72,0.18) 32%, rgba(203,181,157,0.28) 58%, rgba(212,175,55,0.45))',
                          WebkitMask:
                            'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                          WebkitMaskComposite: 'xor',
                          maskComposite: 'exclude',
                        }}
                      />
                      {/* Bright gold gradient ring — cross-fades in on hover */}
                      <div
                        className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
                        style={{
                          padding: '1.5px',
                          opacity: isHovered ? 1 : isLeading ? 0.45 : 0,
                          background:
                            'linear-gradient(135deg, #F2D06B, rgba(212,175,55,0.3) 30%, rgba(245,214,123,0.9) 58%, #D4AF37)',
                          WebkitMask:
                            'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                          WebkitMaskComposite: 'xor',
                          maskComposite: 'exclude',
                        }}
                      />
                      {/* Card surface — fully opaque so text from the cards
                          orbiting behind can never bleed through the surface */}
                      <div
                        className={`relative w-full h-full rounded-[14px] p-7 flex flex-col overflow-hidden transition-colors duration-700 ${
                          isFrontGlow ? 'bg-[#140e06]' : 'bg-[#0d0a05]'
                        }`}
                      >
                        {/* Inner gold glow for the front card */}
                        <div
                          className="absolute inset-0 rounded-[14px] pointer-events-none transition-opacity duration-700"
                          style={{
                            opacity: isFrontGlow ? 1 : 0,
                            background:
                              'radial-gradient(130% 90% at 50% 0%, rgba(212,175,55,0.16), rgba(212,175,55,0.04) 45%, transparent 72%)',
                            boxShadow: 'inset 0 0 70px rgba(212,175,55,0.10)',
                          }}
                        />
                      {/* Soft category watermark */}
                      <div className="absolute -right-8 -bottom-10 text-[170px] leading-none text-[#cbb59d]/[0.05] pointer-events-none">
                        <CategoryIcon />
                      </div>

                      {/* Scan-line sweep on hover */}
                      <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-[#cbb59d]/10 to-transparent transition-transform duration-700 ease-out -translate-x-[200%] group-hover:translate-x-[700%]" />

                      {/* Top Bar */}
                      <div className="relative">
                        <div className="flex items-center justify-between mb-3">
                          <span className="flex items-center gap-2 text-[10px] font-mono text-[#D4AF37] tracking-wider uppercase">
                            <CategoryIcon
                              size={16}
                              className="transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6"
                            />
                            {category.code}
                          </span>
                          {isLeading ? (
                            <span className="inline-flex items-center gap-1.5 text-[8px] font-mono uppercase tracking-[0.2em] text-[#D4AF37] border border-[#D4AF37]/40 rounded-full px-2 py-0.5 bg-[#D4AF37]/10">
                              <span className="w-1 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                              Active
                            </span>
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-[#D4AF37]/60 animate-pulse" />
                          )}
                        </div>
                        <h3 className="text-2xl font-bold text-[#E8DFD8] tracking-wide transition-colors duration-300 group-hover:text-white">
                          {category.title}
                        </h3>
                        <span className="mt-2.5 block h-[2px] w-full origin-left scale-x-[0.25] bg-gradient-to-r from-[#D4AF37] to-[#cbb59d]/40 transition-transform duration-500 group-hover:scale-x-100" />
                        <p className="text-[13px] text-[#D4B88A] leading-snug mt-2.5">{category.tagline}</p>

                        {/* Large brand-logo dock — replays its rise when this card reaches the front */}
                        <SkillDock
                          skills={category.skills}
                          className="mt-3"
                          replayKey={frontEpoch}
                          animateIn={isLeading}
                        />
                      </div>

                      {/* Skills Badges Grid */}
                      <div className="relative mt-3 flex-1">
                        <div className="text-[10px] font-mono text-[#B8976B] uppercase mb-2">Included Skills</div>
                        <div className="flex flex-wrap gap-2">
                          {category.skills.map((skill, i) => {
                            const SkillIcon = SKILL_ICONS[skill];
                            return (
                              <span
                                key={skill}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111111] border border-[#605448]/40 text-[#E8DFD8] text-[13px] font-medium hover:border-[#D4AF37]/60 transition-all duration-300 group-hover:-translate-y-0.5"
                                style={{ transitionDelay: `${i * 30}ms` }}
                              >
                                {SkillIcon && (
                                  <SkillIcon size={15} style={{ color: BRAND_COLORS[skill] }} className="shrink-0" />
                                )}
                                {skill}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {/* Footer Metric */}
                      <div className="relative pt-2.5 border-t border-[#605448]/30 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#D4AF37] truncate max-w-[240px]">
                          {category.metrics}
                        </span>
                        <span
                          className={`text-sm transition-all duration-300 group-hover:translate-x-1 ${
                            isHovered ? 'text-[#E8DFD8]' : 'text-[#B8976B]'
                          }`}
                        >
                          ➔
                        </span>
                      </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Rotation Control (outside hover area) */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-30">
          <button
            onClick={() => setIsPaused((p) => !p)}
            aria-label={isPaused ? 'Resume orbit rotation' : 'Pause orbit rotation'}
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/70 border border-[#605448]/50 text-[#B8976B] hover:text-[#E8DFD8] hover:border-[#cbb59d]/60 transition-all duration-300 text-[10px] font-mono uppercase tracking-[0.3em]"
          >
            {isPaused ? <FiPlay size={12} /> : <FiPause size={12} />}
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        </div>
      </div>

      {/* Detail Modal on Click */}
      <AnimatePresence>
        {selectedCategory && (
          <div
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedCategory(null)}
          >
            <motion.div
              key="modal"
              variants={{
                enter: {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: { type: 'spring', stiffness: 300, damping: 26 },
                },
                exit: {
                  opacity: 0,
                  scale: 0.92,
                  y: 16,
                  transition: { duration: 0.18, ease: 'easeIn' },
                },
              }}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate="enter"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-black border border-[#D4AF37]/60 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(212,175,55,0.2)] text-[#E8DFD8]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedCategory(null)}
                className="absolute top-4 right-4 text-[#B8976B] hover:text-[#E8DFD8] text-xl font-mono p-2 transition-colors"
                aria-label="Close details"
              >
                ✕
              </button>

              <span className="text-xs font-mono text-[#D4AF37] uppercase">{selectedCategory.code}</span>
              <h3 className="text-2xl font-bold text-[#E8DFD8] mt-1">{selectedCategory.title}</h3>
              <p className="text-xs text-[#B8976B] mt-1">{selectedCategory.tagline}</p>

              <SkillDock skills={selectedCategory.skills} className="my-5" />

              <div className="my-6">
                <h4 className="text-xs font-mono text-[#B8976B] uppercase mb-2">Overview</h4>
                <p className="text-sm text-[#E8DFD8] leading-relaxed">{selectedCategory.description}</p>
              </div>

              <div className="my-6">
                <h4 className="text-xs font-mono text-[#B8976B] uppercase mb-2">Core Stack &amp; Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCategory.skills.map((skill, i) => {
                    const SkillIcon = SKILL_ICONS[skill];
                    return (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.06 + i * 0.04, duration: 0.25 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111111] border border-[#D4AF37]/40 text-[#E8DFD8] text-xs font-medium"
                      >
                        {SkillIcon && (
                          <SkillIcon size={14} style={{ color: BRAND_COLORS[skill] }} className="shrink-0" />
                        )}
                        {skill}
                      </motion.span>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#111111] border border-[#605448]/40">
                <span className="text-[10px] font-mono text-[#B8976B] uppercase block mb-1">
                  Key Performance Metric
                </span>
                <span className="text-sm font-semibold text-[#D4AF37]">{selectedCategory.metrics}</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}