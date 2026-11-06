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
  SiRedis,
  SiNginx,
  SiPrometheus,
  SiGrafana,
  SiLinux,
  SiCplusplus,
  SiPython,
  SiEspressif,
  SiMqtt,
  SiScikitlearn,
  SiStreamlit,
} from "react-icons/si";
import {
  FiShield,
  FiGitBranch,
  FiMessageSquare,
  FiZap,
  FiHardDrive,
  FiCode,
  FiServer,
  FiCloud,
} from "react-icons/fi";
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
  "React 19": { icon: FaReact, color: "#61DAFB" },
  Redis: { icon: SiRedis, color: "#FF4438" },
  "REST APIs": { icon: FiServer, color: "#D4AF37" },
  AWS: { icon: FiCloud, color: "#FF9900" },
  Nginx: { icon: SiNginx, color: "#009639" },
  Prometheus: { icon: SiPrometheus, color: "#E6522C" },
  Grafana: { icon: SiGrafana, color: "#F46800" },
  Linux: { icon: SiLinux, color: "#FCC624" },
  "C++": { icon: SiCplusplus, color: "#00599C" },
  Python: { icon: SiPython, color: "#3776AB" },
  ESP32: { icon: SiEspressif, color: "#E7352C" },
  MQTT: { icon: SiMqtt, color: "#B07BB0" },
  "Scikit-learn": { icon: SiScikitlearn, color: "#F7931E" },
  Streamlit: { icon: SiStreamlit, color: "#FF4B4B" },
  "CI/CD": { icon: FiGitBranch, color: "#D4AF37" },
};
const DEFAULT_TECH = { icon: FiCode, color: "#D4AF37" };
const techLogo = (name) => TECH_LOGOS[name] || DEFAULT_TECH;

/* Product screenshot when the file exists, data flow when it does not. */
function ProjectVisual({ project }) {
  const [failed, setFailed] = React.useState(false);

  if (!project.image || failed) return <ArchDiagram flow={project.flow} />;

  return (
    <a
      href={project.liveUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group/shot block overflow-hidden rounded-xl border border-[#605448]/30 bg-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
    >
      <img
        src={project.image}
        alt={project.imageAlt}
        loading="lazy"
        onError={() => setFailed(true)}
        className="h-[180px] w-full object-cover object-top transition-transform duration-500 group-hover/shot:scale-[1.02]"
      />
    </a>
  );
}

/* Compact data-flow strip used on cards that have no product screenshot. */
function ArchDiagram({ flow = [] }) {
  return (
    <div className="rounded-xl border border-[#605448]/30 bg-black/40 p-4">
      <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.2em] text-[#CBB59D]">
        Data flow
      </span>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
        {flow.map((node, i) => (
          <React.Fragment key={node}>
            <span className="rounded-md border border-[#D4AF37]/30 bg-[#D4AF37]/[0.06] px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[#E8DFD8]">
              {node}
            </span>
            {i < flow.length - 1 && (
              <span aria-hidden className="font-mono text-[13px] text-[#D4AF37]">
                →
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/* Render a logo pill for one technology. */
function TechPill({ name, show, delay }) {
  const { icon: Logo, color } = techLogo(name);
  return (
    <motion.span
      initial={{ opacity: 0, y: 12, scale: 0.9 }}
      animate={show ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.45, ease: EASE, delay }}
      whileHover={{ y: -3 }}
      className="inline-flex w-full items-center justify-center gap-1.5 text-[11px] sm:text-[12px] font-mono text-[#EDE4D6] bg-black/50 border border-[#605448]/60 rounded-lg px-2.5 py-1.5 text-center transition-colors duration-200 hover:border-[#D4AF37]/80 hover:bg-black/70 hover:shadow-[0_0_16px_rgba(212,175,55,0.25)]"
    >
      <Logo className="shrink-0" style={{ color, fontSize: "1.45em" }} aria-hidden />
      {name}
    </motion.span>
  );
}

const PROJECTS = [
  {
    id: "vendorbridge",
    category: "01 // FULL-STACK / PROCUREMENT ERP",
    title: "VendorBridge ERP",
    tagline: "Procurement Platform — Kagnus Engineering Network",
    highlights: [
      "RFQ to purchase order end to end, with every permission resolved on the server rather than trusted from the UI.",
      "Approvals are race-safe: row locks and conditional updates stop two approvers acting on the same quote at once, and append-only audit triggers reject late bids.",
      "Money is stored as integer minor units and rounded once at the boundary, so ledger totals reconcile with no drift.",
    ],
    techStack: ["React 19", "TypeScript", "Node.js", "PostgreSQL", "Prisma ORM", "JWT", "Redis", "REST APIs"],
    flow: ["React 19", "REST API", "PostgreSQL", "Redis"],
    image: "/images/vendorbridge-dashboard.png",
    imageAlt: "VendorBridge dashboard: active RFQs, pending approvals, purchase order value and the vendor register",
    metrics: [
      { label: "REST Endpoints", value: "40+" },
      { label: "Database Schema", value: "18 Tables" },
      { label: "Role Tiers", value: "4" },
      { label: "Automated Checks", value: "400+" },
    ],
    githubUrl: "https://github.com/BhaveshSab/VendorBridge-kagnus",
    liveUrl: "https://vendor-bridge-kagnus.vercel.app",
  },
  {
    id: "assetflow",
    category: "02 // FULL-STACK / ASSET ERP",
    title: "AssetFlow ERP",
    tagline: "Asset & Resource Management Platform",
    highlights: [
      "Three role dashboards with eight chart types, built so permissions are re-read from the API on every load instead of cached in the client.",
      "Route-level code splitting and charts loaded on demand keep the first load light while the shell paints immediately.",
      "Keyboard order, focus handling and contrast were audited against WCAG 2.1 AA across every screen.",
    ],
    techStack: ["React", "TypeScript", "NestJS", "PostgreSQL", "Prisma ORM", "Redis", "JWT", "Tailwind CSS"],
    flow: ["React", "NestJS API", "PostgreSQL", "Redis"],
    image: "/images/assetflow-dashboard.png",
    imageAlt: "AssetFlow employee dashboard: allocated assets, active bookings, upcoming returns and quick actions",
    metrics: [
      { label: "REST Endpoints", value: "79" },
      { label: "First Load JS", value: "120 kB (−60%)" },
      { label: "Automated Checks", value: "238" },
      { label: "Accessibility", value: "WCAG 2.1 AA" },
    ],
    githubUrl: "https://github.com/BhaveshSab/assetflow",
    liveUrl: "https://odoohackathon-ujkn.vercel.app",
  },
  {
    id: "assetflow-infra",
    category: "03 // DEVOPS / SELF-HOSTED",
    title: "AssetFlow Infrastructure",
    tagline: "Production Deployment & Observability",
    highlights: [
      "One EC2 host running Docker Compose behind Nginx and Let’s Encrypt TLS, with nightly encrypted S3 backups and a rehearsed restore.",
      "Prometheus scrapes the app, the database and the host; alert rules route through Alertmanager into Telegram, and every log line carries a request ID.",
      "Caught a rate limiter keyed on IP that shared one office’s budget and re-keyed it to the authenticated user; CI rolls back failed releases.",
    ],
    techStack: ["AWS", "Docker", "Nginx", "Prometheus", "Grafana", "Linux", "CI/CD"],
    flow: ["Nginx", "Docker", "App", "Prometheus"],
    metrics: [
      { label: "Services Orchestrated", value: "10" },
      { label: "Alert Rules", value: "11" },
      { label: "Restore Drill", value: "14 s from S3" },
      { label: "Modelled Cost", value: "$12.04 / month" },
    ],
    liveUrl: "https://13.55.90.25/",
    githubUrl: "https://github.com/BhaveshSab/assetflow",
  },
  {
    id: "instadev",
    category: "04 // FULL-STACK / NETWORKING",
    title: "InstaDev Platform",
    tagline: "Collaborative Developer Matchmaking Network",
    highlights: [
      "A card-swiping developer feed that keeps viewport state in Redux, so a swipe never loses the filter the user just set.",
      "Cross-domain auth cookies keep the client and API on separate hosts without exposing tokens to page scripts.",
    ],
    techStack: ["React", "Node.js", "Express.js", "MongoDB", "Redux Toolkit", "Tailwind CSS", "Framer Motion"],
    flow: ["React", "Express API", "MongoDB", "JWT"],
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
    id: "smart-grid",
    category: "05 // IOT / ML TELEMETRY",
    title: "Smart Grid Node",
    tagline: "ESP32 Load-Shedding & Cloud Anomaly Detection",
    highlights: [
      "An ESP32 node reads the PZEM-004T meter and publishes AC telemetry to a HiveMQ broker over MQTT.",
      "A C++ state machine sheds relay load when the ceiling is crossed, after a countdown the room can hear.",
      "An Isolation Forest flags abnormal appliance stacking in Python, with a Streamlit dashboard for live readings.",
    ],
    techStack: ["C++", "Python", "ESP32", "MQTT", "Scikit-learn", "Streamlit"],
    flow: ["ESP32", "MQTT", "Python", "Streamlit"],
    metrics: [
      { label: "Telemetry", value: "230 V AC / MQTT" },
      { label: "Load Ceiling", value: "1400 W" },
      { label: "Warning Window", value: "10 s soft" },
      { label: "Anomaly Model", value: "Isolation Forest" },
    ],
  },
  {
    id: "openclaw",
    category: "06 // AI ORCHESTRATION / AGENTS",
    title: "OpenClaw Autonomous AI",
    tagline: "Multi-Model Agent & Workflow Automation Engine",
    highlights: [
      "A self-hosted assistant that chains several models and calls tools from natural language instead of a fixed command list.",
      "Chat gateways trigger workflows remotely, and every script runs in its own container so API keys stay out of reach.",
    ],
    techStack: ["TypeScript", "Node.js", "LLM Integration", "Webhooks", "Docker", "Telegram API", "WhatsApp API"],
    flow: ["Chat gateways", "Agent", "LLM APIs", "Docker"],
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

  const scrollToCard = (target) => {
    const el = cardRefs.current[target];
    if (!el) return;
    const offset = 100 + target * 32;
    const top = el.getBoundingClientRect().top + window.scrollY - offset + 1;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="bg-black pt-16 pb-20 px-4 sm:px-8 md:px-16 selection:bg-[#D4AF37]/30 selection:text-white"
    >
      {/* Section Header — staged reveal with a line that draws itself */}
      <div className="max-w-[1440px] mx-auto mb-10">
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
          Procurement and asset-management ERPs, self-hosted infrastructure, and IoT telemetry pipelines —
          built for concurrency, accessibility, and type safety.
        </motion.p>
      </div>

      {/* Sticky Stacking Container */}
      <div className="max-w-[1440px] mx-auto relative flex flex-col gap-12 pb-20">
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
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => scrollToCard(index - 1)}
                            disabled={index === 0}
                            aria-label="Previous project"
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-[#605448]/50 font-mono text-[13px] text-[#CBB59D] transition-colors duration-200 hover:border-[#D4AF37]/70 hover:text-[#F3EDE2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-30"
                          >
                            ←
                          </button>
                          <CharReveal
                            text={`0${index + 1} / 0${PROJECTS.length}`}
                            start={0.06}
                            step={0.05}
                            show={show}
                            className="text-xs font-mono tabular-nums text-[#CBB59D]"
                          />
                          <button
                            type="button"
                            onClick={() => scrollToCard(index + 1)}
                            disabled={index === PROJECTS.length - 1}
                            aria-label="Next project"
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-[#605448]/50 font-mono text-[13px] text-[#CBB59D] transition-colors duration-200 hover:border-[#D4AF37]/70 hover:text-[#F3EDE2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-30"
                          >
                            →
                          </button>
                        </div>
                      </div>

                      {/* Title — masked word-by-word rise */}
                      <h3 className="text-2xl sm:text-4xl font-bold text-white tracking-tight transition-colors duration-200 group-hover:text-[#cbb59d]">
                        <WordReveal text={project.title} start={0.3} step={0.09} show={show} />
                      </h3>
                      <p className="text-sm sm:text-base font-mono text-[#cbb59d] mt-2 mb-5">
                        {project.tagline}
                      </p>

                      {/* Highlights — main points only */}
                      <ul className="mb-7 max-w-[52ch] space-y-3">
                        {project.highlights.map((point) => (
                          <li
                            key={point}
                            className="flex gap-3 text-[15px] sm:text-[16px] font-normal leading-[1.65] text-[#F1E9DE]"
                          >
                            <span
                              aria-hidden
                              className="mt-[9px] h-[5px] w-[5px] shrink-0 rounded-full bg-[#D4AF37]"
                            />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>

                    {/* Tech Stack Ghost Badges — rise after the text block */}
                    <motion.div
                      initial={{ opacity: 0, y: 26 }}
                      animate={show ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.55, ease: EASE, delay: 0.28 }}
                    >
                      <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#D8C9B4] block mb-3">
                        Technologies & Frameworks
                      </span>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
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
                    {/* Metrics — value first, label underneath, 2 × 2 */}
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#D4AF37] block mb-3">
                        Key Architecture Highlights
                      </span>
                      <div className="grid grid-cols-2 gap-2.5">
                        {project.metrics.map((metric, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 16 }}
                            animate={show ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, ease: EASE, delay: 0.3 + idx * 0.08 }}
                            className="bg-black/60 border border-[#605448]/30 rounded-lg p-3.5 transition-colors duration-300 hover:border-[#D4AF37]/50"
                          >
                            <div className="font-mono text-[19px] sm:text-[22px] font-bold leading-[1.1] tracking-tight text-[#F5D27A]">
                              {metric.value}
                            </div>
                            <div className="mt-1.5 font-mono text-[10px] uppercase leading-snug tracking-[0.12em] text-[#CBB59D]">
                              {metric.label}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Visual — product screenshot when one exists, else the data flow */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={show ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, ease: EASE, delay: 0.44 }}
                      className="mt-6"
                    >
                      <ProjectVisual project={project} />
                    </motion.div>

                    {/* Action Links — last beat of the cascade */}
                    <motion.div
                      initial={{ opacity: 0, y: 22 }}
                      animate={show ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, ease: EASE, delay: 0.55 }}
                      className="flex items-center gap-4 mt-6"
                    >
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-center py-3 px-4 rounded-xl bg-transparent border border-[#D4AF37]/60 text-[#D4AF37] text-[13px] font-mono font-semibold uppercase tracking-wider hover:bg-[#D4AF37] hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_26px_rgba(212,175,55,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                        >
                          Source Code ↗
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-center py-3 px-4 rounded-xl bg-[#D4AF37] text-black text-[13px] font-mono font-bold uppercase tracking-wider hover:bg-white transition-all duration-300 shadow-[0_0_18px_rgba(212,175,55,0.25)] hover:shadow-[0_0_30px_rgba(212,175,55,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5D27A] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
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
