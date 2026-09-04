import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaReact, FaNodeJs, FaDocker, FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import {
  SiNestjs,
  SiTypescript,
  SiPostgresql,
  SiPrisma,
  SiTailwindcss,
  SiExpress,
  SiMongodb,
  SiRedux,
  SiFramer,
} from "react-icons/si";
import { FiShield, FiGitBranch, FiMessageSquare, FiZap, FiHardDrive, FiCode } from "react-icons/fi";
import { TextShimmer } from "./ui/text-shimmer";

const EASE = [0.22, 1, 0.36, 1];

/* Brand logos for the tech-stack pills — each tech maps to its own colored logo. */
const TECH_LOGOS = {
  NestJS: { icon: SiNestjs, color: "#E0234E" },
  TypeScript: { icon: SiTypescript, color: "#3178C6" },
  PostgreSQL: { icon: SiPostgresql, color: "#699ECA" },
  "Prisma ORM": { icon: SiPrisma, color: "#5A67D8" },
  JWT: { icon: FiShield, color: "#D4AF37" },
  React: { icon: FaReact, color: "#61DAFB" },
  "Tailwind CSS": { icon: SiTailwindcss, color: "#38BDF8" },
  "Node.js": { icon: FaNodeJs, color: "#83CD29" },
  "Express.js": { icon: SiExpress, color: "#E8DFD8" },
  MongoDB: { icon: SiMongodb, color: "#47A248" },
  "Redux Toolkit": { icon: SiRedux, color: "#764ABC" },
  "Framer Motion": { icon: SiFramer, color: "#B84FF5" },
  Docker: { icon: FaDocker, color: "#2496ED" },
  Webhooks: { icon: FiZap, color: "#D4AF37" },
  "Telegram API": { icon: FaTelegramPlane, color: "#26A5E4" },
  "WhatsApp API": { icon: FaWhatsapp, color: "#25D366" },
  "LLM Integration": { icon: FiMessageSquare, color: "#B8976B" },
};
const DEFAULT_TECH = { icon: FiCode, color: "#D4AF37" };
const techLogo = (name) => TECH_LOGOS[name] || DEFAULT_TECH;

/* Render a logo pill for one technology. */
function TechPill({ name, show, delay }) {
  const { icon: Logo, color } = techLogo(name);
  return (
    <motion.span
      initial={{ opacity: 0, y: 12, scale: 0.9 }}
      animate={show ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.45, ease: EASE, delay }}
      whileHover={{ y: -3 }}
      className="inline-flex items-center gap-2 text-[13px] sm:text-sm font-mono text-[#E8DFD8] bg-black/50 border border-[#605448]/60 rounded-lg px-3.5 py-2 transition-colors duration-200 hover:border-[#D4AF37]/80 hover:bg-black/70 hover:shadow-[0_0_16px_rgba(212,175,55,0.25)]"
    >
      <Logo className="shrink-0" style={{ color, fontSize: "1.45em" }} aria-hidden />
      {name}
    </motion.span>
  );
}

const PROJECTS = [
  {
    id: "assetflow",
    category: "01 // FULL-STACK / ERP",
    title: "AssetFlow ERP",
    tagline: "Enterprise Asset & Resource Management System",
    description:
      "Engineered the full backend of an asset-tracking ERP — 10 feature modules and 60+ REST endpoints in NestJS/TypeScript over a 13-table PostgreSQL schema (Prisma), with JWT role-based access control across 4 roles. Concurrency-safe transactional row-level locking prevents double-allocation under simultaneous requests, verified by a 50+ check end-to-end suite at 100% pass rate.",
    techStack: ["NestJS", "TypeScript", "PostgreSQL", "Prisma ORM", "JWT", "React", "Tailwind CSS"],
    metrics: [
      { label: "REST Architecture", value: "60+ Endpoints" },
      { label: "Database Schema", value: "13 Tables" },
      { label: "E2E Test Suite", value: "100% (50+ Checks)" },
      { label: "Concurrency Control", value: "Row-Level Locking" },
    ],
    githubUrl: "https://github.com/BhaveshSab/odoohackathon",
    liveUrl: "https://odoohackathon-ujkn.vercel.app/signin",
  },
  {
    id: "instadev",
    category: "02 // FULL-STACK / NETWORKING",
    title: "InstaDev Platform",
    tagline: "Collaborative Developer Matchmaking Network",
    description:
      "Developed a full-stack developer matchmaking platform on the MERN stack that securely connects software engineers based on technical compatibility. Orchestrated a dynamic card-swiping feed with Redux Toolkit for centralized state management and secure cross-domain JWT authentication cookies, wrapped in glassmorphic UI layers with fluid Framer Motion transitions.",
    techStack: ["React", "Node.js", "Express.js", "MongoDB", "Redux Toolkit", "Tailwind CSS", "Framer Motion"],
    metrics: [
      { label: "State Management", value: "Centralized Redux" },
      { label: "Security Model", value: "Cross-Domain JWT" },
      { label: "UI Architecture", value: "Glassmorphic Theme" },
      { label: "Page Motion", value: "Framer Motion Wrappers" },
    ],
    githubUrl: "https://github.com/BhaveshSab/instadev-web",
    liveUrl: "https://devtinder-web-975w.vercel.app/login",
  },
  {
    id: "openclaw",
    category: "03 // AI ORCHESTRATION / AGENTS",
    title: "OpenClaw Autonomous AI",
    tagline: "Multi-Model Agent & Workflow Automation Engine",
    description:
      "Built a self-hosted, autonomous AI assistant on the OpenClaw framework, integrating multi-model LLM pipelines to automate complex digital workflows and tool-calling via natural language commands. Telegram and WhatsApp gateways trigger it remotely, containerized in Docker for isolated script execution that safeguards private API keys.",
    techStack: ["TypeScript", "Node.js", "LLM Integration", "Webhooks", "Docker", "Telegram API", "WhatsApp API"],
    metrics: [
      { label: "Workflow Engine", value: "Autonomous LLM Pipelines" },
      { label: "Remote Triggers", value: "Telegram & WhatsApp" },
      { label: "Deployment", value: "Docker Containerized" },
      { label: "Security", value: "Isolated Script Execution" },
    ],
    githubUrl: "https://github.com/BhaveshSab/OpenClaw",
  },
];

/* ------------------------------------------------------------------ */
/* Text animation helpers — driven by a `show` prop so reveals always  */
/* fire (scroll-checked), never gated behind a possibly-stalled        */
/* IntersectionObserver.                                               */
/* ------------------------------------------------------------------ */

/** Masked word-by-word rise — each word slides up from beneath a clip. */
function WordReveal({ text, className, start = 0, step = 0.08, show }) {
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden pb-[0.16em] -mb-[0.16em] align-bottom"
          aria-hidden
        >
          <motion.span
            className="inline-block"
            initial={{ y: "120%", opacity: 0 }}
            animate={show ? { y: "0%", opacity: 1 } : {}}
            transition={{
              duration: 0.6,
              ease: EASE,
              delay: start + i * step,
            }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </span>
  );
}

/** Character-by-character fade — used on the mono category/counter lines. */
function CharReveal({ text, className, start = 0, step = 0.03, show }) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block"
          initial={{ opacity: 0, y: 6 }}
          animate={show ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.28,
            ease: "easeOut",
            delay: start + i * step,
          }}
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </span>
  );
}

const Portfolio = () => {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);
  const [headerLive, setHeaderLive] = useState(false);
  const [shown, setShown] = useState(PROJECTS.map(() => false));

  // Robust reveal driver: fires as soon as the header / each sticky card
  // scrolls into the viewport. Uses IntersectionObserver when available PLUS
  // a scroll-position fallback so content can never stay hidden.
  useEffect(() => {
    const sec = sectionRef.current;
    if (!sec) return;
    let done = false;
    const cards = () => cardRefs.current;

    const check = () => {
      if (done) return;
      const vh = window.innerHeight || 1;
      const secTop = sec.getBoundingClientRect().top;
      if (secTop < vh * 1.0 && !headerLive) setHeaderLive(true);
      setShown((prev) => {
        let changed = false;
        const next = prev.slice();
        cardRefs.current.forEach((el, i) => {
          if (next[i] || !el) return;
          const r = el.getBoundingClientRect();
          if (r.top < vh * 1.02 && r.bottom > 0) {
            next[i] = true;
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    };

    // Instant fire if the section is already on screen at mount
    const instant = () => {
      const vh = window.innerHeight || 1;
      const r = sec.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) {
        done = true;
        setHeaderLive(true);
        setShown(PROJECTS.map(() => true));
        if (io) io.disconnect();
        window.removeEventListener("scroll", onScroll);
      }
    };

    const onScroll = () => {
      // Cheap early exit until the section is anywhere near the viewport
      const r = sec.getBoundingClientRect();
      if (r.top > (window.innerHeight || 1) * 1.6 || r.bottom < 0) return;
      check();
    };

    let io = null;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) check();
        },
        { threshold: 0.01 }
      );
      io.observe(sec);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    instant();
    return () => {
      if (io) io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="bg-black pt-16 pb-20 px-4 sm:px-8 md:px-16 selection:bg-[#D4AF37]/30 selection:text-white"
    >
      {/* Section Header — staged reveal with a line that draws itself */}
      <div className="max-w-6xl mx-auto mb-10">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={headerLive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex items-center gap-3 mb-3"
        >
          <span className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase">
            03 / FEATURED WORK
          </span>
          <motion.span
            initial={{ scaleX: 0 }}
            animate={headerLive ? { scaleX: 1 } : {}}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.25 }}
            className="h-[1px] w-14 origin-left bg-gradient-to-r from-[#D4AF37]/80 to-[#D4AF37]/10"
          />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          animate={headerLive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE, delay: 0.08 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight uppercase"
        >
          <TextShimmer
            className="[--base-gradient-color:#FFF6E0]"
            baseGradient="linear-gradient(to right, #ffffff 0%, #ffffff 34%, #E8DFD8 46%, #cbb59d 72%, #D4AF37 100%)"
          >
            Project Portfolio.
          </TextShimmer>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={headerLive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE, delay: 0.18 }}
          className="text-sm sm:text-base text-[#B8976B] mt-3 max-w-2xl leading-relaxed"
        >
          Production-grade systems, full-stack microservices, and AI orchestration platforms built with high
          performance and type safety.
        </motion.p>
      </div>

      {/* Sticky Stacking Container */}
      <div className="max-w-6xl mx-auto relative flex flex-col gap-12 pb-20">
        {PROJECTS.map((project, index) => {
          // Each card pins below the previous one while the stack scrolls
          const stickyTopOffset = 100 + index * 32;
          const show = shown[index];

          return (
            <div
              key={project.id}
              ref={(el) => (cardRefs.current[index] = el)}
              className="sticky transition-all duration-300"
              style={{ top: `${stickyTopOffset}px`, zIndex: 10 + index }}
            >
              <motion.div
                initial={{ opacity: 0, y: 46 }}
                animate={show ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: EASE }}
                whileHover={{ y: -8 }}
                className="group relative w-full bg-[#0d0d0d]/95 backdrop-blur-xl border border-[#8C6D4F]/40 rounded-2xl p-6 sm:p-10 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-[border-color,box-shadow,background-color] duration-500 hover:border-[#D4AF37]/70 hover:bg-[#101010]/95 hover:shadow-[0_30px_80px_rgba(0,0,0,0.85),0_0_50px_rgba(212,175,55,0.15)]"
              >
                {/* Gold sheen that sweeps across the card on hover */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl" aria-hidden>
                  <div className="absolute inset-y-0 -left-[35%] w-[35%] -skew-x-12 bg-gradient-to-r from-transparent via-[#D4AF37]/[0.12] to-transparent -translate-x-full opacity-0 transition-all duration-700 ease-out group-hover:translate-x-[400%] group-hover:opacity-100" />
                </div>
                {/* 12-Column Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                  {/* Left Column (7/12): Title, Description, Tech Pills */}
                  <div className="lg:col-span-7 flex flex-col justify-between h-full">
                    {/* Category, title, tagline & description — cascade in */}
                    <motion.div
                      initial={{ opacity: 0, y: 34 }}
                      animate={show ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.55, ease: EASE, delay: 0.12 }}
                    >
                      {/* Category Tag — typewriter-style character reveal */}
                      <div className="flex items-center justify-between mb-3">
                        <CharReveal
                          text={project.category}
                          start={0.2}
                          step={0.03}
                          show={show}
                          className="text-xs font-mono text-[#D4AF37] tracking-widest uppercase"
                        />
                        <CharReveal
                          text={`0${index + 1} / 0${PROJECTS.length}`}
                          start={0.06}
                          step={0.05}
                          show={show}
                          className="text-xs font-mono text-[#B8976B]"
                        />
                      </div>

                      {/* Title — masked word-by-word rise */}
                      <h3 className="text-2xl sm:text-4xl font-bold text-white tracking-tight transition-colors duration-200 group-hover:text-[#cbb59d]">
                        <WordReveal text={project.title} start={0.3} step={0.09} show={show} />
                      </h3>
                      <p className="text-sm sm:text-base font-mono text-[#cbb59d] mt-2 mb-5">
                        {project.tagline}
                      </p>

                      {/* Description */}
                      <p className="text-[15px] sm:text-[17px] text-[#E8DFD8]/95 leading-[1.7] font-light mb-7">
                        {project.description}
                      </p>
                    </motion.div>

                    {/* Tech Stack Ghost Badges — rise after the text block */}
                    <motion.div
                      initial={{ opacity: 0, y: 26 }}
                      animate={show ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.55, ease: EASE, delay: 0.28 }}
                    >
                      <span className="text-[11px] font-mono uppercase tracking-widest text-[#B8976B] block mb-3">
                        Technologies & Frameworks
                      </span>
                      <div className="flex flex-wrap gap-2.5">
                        {project.techStack.map((tech, ti) => (
                          <TechPill key={tech} name={tech} show={show} delay={0.34 + ti * 0.05} />
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  {/* Right Column (5/12): Metrics Panel & CTAs */}
                  <motion.div
                    initial={{ opacity: 0, y: 34 }}
                    animate={show ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.55, ease: EASE, delay: 0.2 }}
                    className="lg:col-span-5 flex flex-col justify-between h-full border-t lg:border-t-0 lg:border-l border-[#605448]/30 pt-6 lg:pt-0 lg:pl-8"
                  >
                    {/* Architecture Metrics Table */}
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-widest text-[#D4AF37] block mb-3">
                        Key Architecture Highlights
                      </span>
                      <div className="grid grid-cols-1 gap-3">
                        {project.metrics.map((metric, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: 24 }}
                            animate={show ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.5, ease: EASE, delay: 0.3 + idx * 0.08 }}
                            className="bg-black/60 border border-[#605448]/30 rounded-lg p-3.5 flex items-center justify-between gap-4 transition-colors duration-300 hover:border-[#D4AF37]/50"
                          >
                            <span className="text-[13px] text-[#cbb59d] font-mono">{metric.label}</span>
                            <span className="text-[13px] font-bold text-white font-mono text-right">{metric.value}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Action Links — last beat of the cascade */}
                    <motion.div
                      initial={{ opacity: 0, y: 22 }}
                      animate={show ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, ease: EASE, delay: 0.55 }}
                      className="flex items-center gap-4 mt-8"
                    >
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-center py-3 px-4 rounded-xl bg-transparent border border-[#D4AF37]/60 text-[#D4AF37] text-[13px] font-mono font-semibold uppercase tracking-wider hover:bg-[#D4AF37] hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                        >
                          Source Code ↗
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-center py-3 px-4 rounded-xl bg-[#D4AF37] text-black text-[13px] font-mono font-bold uppercase tracking-wider hover:bg-white transition-all duration-300 shadow-[0_0_18px_rgba(212,175,55,0.25)]"
                        >
                          Live Preview ➔
                        </a>
                      )}
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Portfolio;
