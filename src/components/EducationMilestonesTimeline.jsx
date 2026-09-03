import React from 'react';
import { motion } from 'framer-motion';

// Education & milestone timeline data (verified resume details)
const MILESTONES = [
  {
    id: 'oracle-hackerrank',
    date: 'JULY 2026',
    title: 'Oracle & HackerRank Certified',
    company: 'Oracle & HackerRank',
    description:
      'Earned the Oracle Agentic AI Certified Foundations Associate certification and HackerRank SQL (Advanced) certification.',
  },
  {
    id: 'nptel-cpp',
    date: 'JULY 2026',
    title: 'Elite C++ Topper (Top 5%)',
    company: 'NPTEL & IIT',
    description:
      'Completed the 12-week Programming in Modern C++ course, recognized as an Elite Topper in the Top 5% out of 26,183 candidates.',
  },
  {
    id: 'sih-ignite',
    date: 'HACKATHON & VENTURE',
    title: 'SIH Top Tier & Ignite India',
    company: 'Smart India Hackathon & Wadhwani Foundation',
    description:
      'Selected for the SIH College Internal Round, ranking in the top tier out of 100+ competing teams. Certified Practice Venture under Ignite India for entrepreneurial excellence.',
  },
  {
    id: 'btech',
    date: 'AUG 2024 - MAY 2028',
    title: 'B.Tech Electrical Engineering',
    company: 'Punjab Engineering College (PEC), Chandigarh',
    description:
      'Pursuing B.Tech with a 7.69/10 GPA. Secured admission with a JEE Mains 98.04 Percentile (out of 1.6M+ candidates).',
  },
  {
    id: 'class-xii',
    date: '2022 - 2023',
    title: 'Class XII (Senior Secondary)',
    company: 'Jai Durga Senior Sec School, Jaipur',
    description:
      'Completed RBSE Class 12th Board examinations with an 87% overall aggregate and 90% in PCME (Physics, Chemistry, Math, English).',
  },
  {
    id: 'class-x',
    date: '2020 - 2021',
    title: 'Class X (Secondary)',
    company: 'RBSE Board, Jaipur',
    description:
      'Completed RBSE Class 10th Secondary Board examinations with a 92% overall aggregate.',
  },
];

export default function EducationMilestonesTimeline() {
  return (
    <section
      id="experience"
      className="relative w-full bg-black text-[#E8DFD8] py-24 md:py-32 px-6 md:px-16 overflow-hidden select-none scroll-mt-24 font-sans tracking-wide"
    >
      {/* Ambient golden glows */}
      <div className="absolute -top-48 -left-40 w-[620px] h-[620px] bg-[#D4AF37]/[0.05] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 -right-24 w-[480px] h-[640px] bg-[#D4AF37]/[0.03] rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[420px] h-[300px] bg-[#D4AF37]/[0.03] rounded-full blur-[140px] pointer-events-none" />
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-16 md:mb-24"
        >
          <div className="flex items-center gap-4 mb-5">
            <span className="text-[#D4AF37] font-mono text-xs md:text-sm tracking-[0.4em] uppercase">
              04 / MILESTONES
            </span>
            <div className="h-[1px] w-14 bg-[#D4AF37]/50" />
          </div>
          <h2 className="text-[38px] sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase leading-[1.02] tracking-tighter">
            <span className="text-[#F3EEE7] drop-shadow-[0_0_18px_rgba(243,238,231,0.25)]">
              Education &amp;
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-[#F8E7B0] via-[#E8C68A] to-[#B8860B] drop-shadow-[0_0_24px_rgba(212,175,55,0.35)]">
              Achievements.
            </span>
          </h2>
          <p className="text-[#C4A472] text-[15px] md:text-[17px] mt-5 max-w-2xl font-light leading-relaxed">
            Certifications, competitive achievements, and the academic journey that shaped my
            engineering fundamentals.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Glowing line — draws itself down as the section scrolls into view */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            whileInView={{ height: '100%', opacity: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
            className="absolute left-[5px] md:left-[209px] lg:left-[237px] top-0 w-[2px] origin-top bg-gradient-to-b from-[#F2D06B] via-[#D4AF37]/70 to-transparent shadow-[0_0_14px_rgba(212,175,55,0.6)] rounded-full"
          />
          {/* Soft wider halo behind the core line */}
          <div className="absolute left-[3px] md:left-[207px] lg:left-[235px] top-0 bottom-0 w-[6px] bg-[#D4AF37]/[0.06] blur-[3px] rounded-full pointer-events-none" />

          <div className="flex flex-col gap-14 md:gap-16">
            {MILESTONES.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 34 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-70px' }}
                transition={{ duration: 0.6, delay: (index % 3) * 0.08 }}
                className="relative pl-11 md:pl-0 md:flex md:items-start group"
              >
                {/* Date (left of the line on desktop, above title on mobile) —
                    the gutter is sized to the longest labels ("AUG 2024 - MAY 2028",
                    "HACKATHON & VENTURE") so they stay on one line at the larger size */}
                <div className="md:w-[208px] lg:w-[236px] md:shrink-0 md:text-right md:pr-7 lg:pr-8 mb-2 md:mb-0 md:pt-px">
                  <span className="inline-block font-mono text-[12px] lg:text-[13px] font-medium tracking-[0.12em] uppercase text-[#D8B678] group-hover:text-[#F2D06B] transition-colors duration-300">
                    {item.date}
                  </span>
                </div>

                {/* Hollow node on the line */}
                <div className="absolute left-[0px] md:left-[203px] lg:left-[231px] top-[6px] w-[13px] h-[13px] rounded-full border-2 border-[#D4AF37] bg-black z-10 transition-all duration-300 group-hover:bg-[#D4AF37] group-hover:shadow-[0_0_14px_rgba(212,175,55,0.95)]">
                  <span className="absolute inset-[3px] rounded-full bg-[#D4AF37]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content (right of the line) — clear of the node & line */}
                <div className="flex-1 md:pl-9 lg:pl-11">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-black uppercase text-[#E8DFD8] tracking-tight leading-snug group-hover:text-white transition-colors duration-300">
                    {item.title}
                  </h3>
                  <h4 className="mt-1 font-mono text-[11px] md:text-[12px] tracking-[0.28em] uppercase text-[#D4AF37]/90 group-hover:text-[#D4AF37] transition-colors duration-300">
                    {item.company}
                  </h4>
                  <p className="mt-3 text-[15px] md:text-base lg:text-[17px] leading-relaxed font-normal text-[#CDB496] group-hover:text-[#DCC7AB] transition-colors duration-300 max-w-2xl">
                    {item.description}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
