import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

/**
 * SectionSeam — a thin animated gold hairline that separates major black
 * sections (About / Skills / Projects / Experience) so hard black-to-black
 * cuts read as deliberate transitions.
 *
 * As it scrolls into view the line draws itself outward from the center,
 * then a soft gold shimmer sweeps along it continuously.
 */
const SectionSeam = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <div
      ref={ref}
      aria-hidden
      className="relative w-full bg-black flex items-center justify-center -my-3 md:-my-4 overflow-visible select-none pointer-events-none"
    >
      {/* Soft halo behind the whole seam */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scaleX: 0.6 }}
          animate={inView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 1.1, ease: EASE }}
          className="w-full h-px bg-[radial-gradient(ellipse_60%_100%_at_50%_50%,rgba(212,175,55,0.14),transparent_70%)]"
        />
      </div>

      {/* The hairline — draws outward from the center */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.3, ease: EASE, delay: 0.05 }}
        className="relative w-full max-w-5xl h-px origin-center"
      >
        {/* Base line with gold gradient core, faded at both ends */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#cbb59d]/35 to-transparent" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/55 to-transparent" />

        {/* Ambient gold glow at the ends, fading in with the line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.4, delay: 0.5 }}
          className="absolute -left-24 top-1/2 -translate-y-1/2 w-48 h-6 bg-[radial-gradient(ellipse_50%_100%_at_50%_50%,rgba(212,175,55,0.10),transparent_70%)]"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.4, delay: 0.5 }}
          className="absolute -right-24 top-1/2 -translate-y-1/2 w-48 h-6 bg-[radial-gradient(ellipse_50%_100%_at_50%_50%,rgba(212,175,55,0.10),transparent_70%)]"
        />

        {/* Travelling shimmer — sweeps the seam left→right forever */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="absolute inset-0 overflow-hidden"
        >
          <motion.div
            animate={inView ? { x: ["-120%", "120%"] } : {}}
            transition={{ duration: 3.2, repeat: Infinity, ease: "linear", repeatDelay: 1.2 }}
            className="absolute top-1/2 -translate-y-1/2 w-1/4 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/90 to-transparent shadow-[0_0_12px_rgba(212,175,55,0.65)]"
          />
        </motion.div>

        {/* Soft gold under-glow — breathes subtly */}
        <motion.div
          animate={inView ? { opacity: [0.5, 0.9, 0.5] } : {}}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full pointer-events-none"
          style={{ boxShadow: "0 0 26px 6px rgba(212,175,55,0.18)" }}
        />

        {/* Center node — tiny gold diamond that pulses softly */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.span
            initial={{ opacity: 0, scale: 0.4, rotate: 45 }}
            animate={inView ? { opacity: 1, scale: 1, rotate: 45 } : {}}
            transition={{ duration: 0.7, ease: EASE, delay: 0.85 }}
            className="block w-[7px] h-[7px] bg-[#D4AF37]"
            style={{ boxShadow: "0 0 10px rgba(212,175,55,0.9), 0 0 22px rgba(212,175,55,0.45)" }}
          />
          <motion.span
            animate={inView ? { opacity: [0.5, 1, 0.5], scale: [0.9, 1.35, 0.9] } : {}}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[18px] h-[18px] border border-[#D4AF37]/25 -rotate-45"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default SectionSeam;
