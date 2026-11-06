import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FiArrowUpRight } from 'react-icons/fi';

/**
 * EXPERIENCE & EDUCATION — scroll timeline with a sticky year rail.
 *
 * Layout follows the reference: a pinned left column ("My story", "Let's go
 * back in time.", the oversized year, the active date range and a 3-of-6
 * counter) beside a hairline rule carrying one block per role, newest first.
 * As the page scrolls the big year, the date range and the counter follow the
 * block currently crossing the reading line.
 *
 * Colours and type stay in this site's language — black canvas, #F3EDE2
 * headings, #CBB59D secondary, gold accent — rather than the reference's cream.
 * To flip the block to that light system, swap:
 *   bg-black            -> bg-[#e8e4e0]
 *   text-[#F3EDE2]      -> text-[#1a1818]
 *   text-[#CBB59D]      -> text-[#6f6966]
 *   border-[#CBB59D]/20 -> border-[#e5e7eb]
 *   bg-[#D4AF37]        -> bg-[#1a1818]
 */

const ITEMS = [
  {
    id: 'kagnus',
    year: '2026',
    date: 'OCT 2026 – NOV 2026',
    title: 'Full stack developer intern',
    org: 'Kagnus Engineering Network · Remote',
    points: [
      'Built VendorBridge, a procurement ERP covering RFQs, approvals, purchase orders and invoices, with 40+ REST endpoints and 4 role-based tiers.',
      'Made approvals race-safe with row locks and an append-only audit log, backed by 400+ automated tests.',
    ],
    links: [
      { label: 'VendorBridge repo', href: 'https://github.com/BhaveshSab/VendorBridge-kagnus' },
      { label: 'Live demo', href: 'https://vendor-bridge-kagnus.vercel.app' },
    ],
  },
  {
    id: 'redis',
    year: '2026',
    date: 'JUL 2026 – AUG 2026',
    title: 'Certified in Redis and agentic AI',
    org: 'Redis · Oracle',
    points: [
      'Redis Associate Developer, scored 92%.',
      'Oracle Agentic AI Certified Foundations Associate.',
    ],
  },
  {
    id: 'assetflow',
    year: '2026',
    date: 'JUL 2026 – NOV 2026',
    title: 'AssetFlow',
    org: 'Asset and resource management ERP · Self-hosted',
    points: [
      'Built a 13-screen React app on a NestJS backend with 79 REST endpoints and role-based access across 4 roles.',
      'Deployed it on AWS EC2 with Docker, Nginx, Prometheus and Grafana, with nightly encrypted backups to S3.',
    ],
    links: [
      { label: 'Source', href: 'https://github.com/BhaveshSab/assetflow' },
      { label: 'Live demo', href: 'https://odoohackathon-ujkn.vercel.app' },
    ],
  },
  {
    id: 'nptel',
    year: '2025',
    date: '2025',
    title: 'C++ Elite',
    org: 'NPTEL · IIT Kharagpur',
    points: [
      'Completed Programming in Modern C++ in the top 5% of 26,183.',
      'Built the data structures base behind 250+ LeetCode problems solved so far.',
    ],
  },
  {
    id: 'btech',
    year: '2024',
    date: 'AUG 2024 – NOW',
    title: 'B.Tech, Electrical Engineering',
    org: 'Punjab Engineering College (PEC), Chandigarh',
    points: [
      'Cleared JEE Mains at the 98.04 percentile among 1.6M+ candidates.',
      'GPA 7.69/10, graduating May 2028.',
    ],
  },
  {
    id: 'school',
    year: '2023',
    date: '2021 – 2023',
    title: 'Class XII',
    org: 'RBSE Board, Jaipur',
    points: ['Scored 87%, with 90% in PCM and English.', 'Class X in 2021: 92%.'],
  },
];

function TimelineItem({ item, index, isActive, registerRef }) {
  return (
    <motion.article
      ref={registerRef}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group relative pl-8 sm:pl-12"
    >
      {/* node on the rule */}
      <span
        aria-hidden
        className={`absolute left-0 top-[7px] h-[7px] w-[7px] transition-all duration-300 ${
          isActive
            ? 'scale-125 bg-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.9)]'
            : 'bg-[#D4AF37]/60 group-hover:scale-125 group-hover:bg-[#D4AF37]'
        }`}
      />

      <p className="font-mono text-[12px] uppercase tracking-widest text-[#CBB59D]">{item.date}</p>

      <h3 className="mt-2 text-[24px] font-semibold leading-tight tracking-tight text-[#F3EDE2] sm:text-[28px] md:text-[34px]">
        {item.title}
      </h3>

      <p className="mb-4 mt-1 font-mono text-[12px] uppercase tracking-widest text-[#CBB59D]">
        {item.org}
      </p>

      <ul className="max-w-2xl space-y-2">
        {item.points.map((point) => (
          <li key={point} className="flex gap-2.5 text-[16px] leading-relaxed text-[#CBB59D]">
            <span aria-hidden className="text-[#D4AF37]/70">
              –
            </span>
            <span>{point}</span>
          </li>
        ))}
      </ul>

      {item.links && (
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
          {item.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-[12px] font-medium uppercase tracking-widest text-[#F3EDE2] transition-opacity duration-300 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-4 focus-visible:ring-offset-black"
            >
              {link.label}
              <FiArrowUpRight aria-hidden />
            </a>
          ))}
        </div>
      )}
    </motion.article>
  );
}

export default function EducationMilestonesTimeline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef([]);
  const prefersReducedMotion = useReducedMotion();

  // The block whose top has most recently crossed the reading line wins.
  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.42;
      let next = 0;
      itemRefs.current.forEach((node, index) => {
        if (!node) return;
        if (node.getBoundingClientRect().top <= line) next = index;
      });
      setActiveIndex((current) => (current === next ? current : next));
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const active = ITEMS[activeIndex] ?? ITEMS[0];
  const counter = `${String(activeIndex + 1).padStart(2, '0')} / ${String(ITEMS.length).padStart(2, '0')}`;
  const progress = ((activeIndex + 1) / ITEMS.length) * 100;

  return (
    <section
      id="experience"
      className="relative w-full bg-black px-6 py-24 font-sans text-[#E8DFD8] scroll-mt-28 md:px-16 md:py-32"
    >
      {/* ambient gold — clipped on its own layer so the sticky rail still works */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-48 h-[620px] w-[620px] rounded-full bg-[#D4AF37]/[0.05] blur-[150px]" />
        <div className="absolute -right-24 top-1/3 h-[640px] w-[480px] rounded-full bg-[#D4AF37]/[0.03] blur-[170px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px]">
        {/* ---------- header ---------- */}
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-10 max-w-3xl md:mb-14"
        >
          <p className="mb-4 font-mono text-[12px] uppercase tracking-widest text-[#CBB59D]">
            04 / Experience &amp; Education
          </p>

          <h2 className="max-w-[13ch] text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[0.95] tracking-[-1.5px] text-[#F3EDE2] [text-wrap:balance]">
            <span className="block">EXPERIENCE</span>
            <span className="block">
              &amp; EDUCATION<span className="text-[#D4AF37]">.</span>
            </span>
          </h2>

          <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-[#CBB59D] md:text-[17px]">
            Where I have worked, what I have shipped, and the foundation underneath it.
          </p>
        </motion.header>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-20 xl:gap-24">
          {/* ---------- pinned year rail ---------- */}
          <div className="lg:sticky lg:top-24 lg:flex lg:h-[calc(100vh-9rem)] lg:flex-col lg:justify-center lg:self-start">
            <p className="mb-4 flex items-center gap-2.5 font-mono text-[12px] uppercase tracking-widest text-[#CBB59D]">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
              My story
            </p>

            <h3 className="text-[clamp(1.6rem,2.6vw,2.35rem)] font-bold leading-tight tracking-[-1px] text-[#F3EDE2]">
              Let&rsquo;s go back in time.
            </h3>

            {/* big year — swaps as the active block changes */}
            <div className="mt-2 overflow-hidden">
              <motion.span
                key={`${active.id}-${active.year}`}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="block text-[clamp(5.5rem,14vw,11rem)] font-bold leading-[0.82] tracking-[-0.06em] text-[#F3EDE2]"
              >
                {active.year}
              </motion.span>
            </div>

            <p className="mt-8 font-mono text-[12px] uppercase tracking-[0.2em] text-[#CBB59D]">
              {active.date}
            </p>

            <div className="mt-4 flex items-center gap-4">
              <span className="font-mono text-[11px] tabular-nums tracking-[0.2em] text-[#CBB59D]">
                {counter}
              </span>
              <span aria-hidden className="block h-px w-24 bg-[#CBB59D]/25">
                <span
                  className="block h-px bg-[#D4AF37] transition-[width] duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </span>
            </div>
          </div>

          {/* ---------- timeline ---------- */}
          <div className="relative">
            {/* 1px rule; sits closer to the edge on small screens */}
            <div
              aria-hidden
              className="absolute bottom-0 left-[3px] top-2 w-px bg-gradient-to-b from-[#CBB59D]/40 via-[#CBB59D]/20 to-transparent"
            />

            <div className="flex flex-col gap-14 md:gap-20">
              {ITEMS.map((item, index) => (
                <TimelineItem
                  key={item.id}
                  item={item}
                  index={index}
                  isActive={index === activeIndex}
                  registerRef={(node) => {
                    itemRefs.current[index] = node;
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
