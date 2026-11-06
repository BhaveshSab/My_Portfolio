import React from 'react';

/**
 * Picks a number (with its unit and any trailing "+") out of a sentence:
 * 40+, 18-table, 294 kB, 14 s, 1400 W, 230 V, −60%, 10,000+, 300 req/min,
 * 26,183 participants, WCAG 2.1.
 */
const NUMBER_RE =
  /(\d[\d,]*(?:\.\d+)?(?:\s?(?:kB|MB|GB|ms|s|W|V|%|req\/min))?\+?)/g;

/**
 * Renders text with its measurable numbers set in gold, so the result in a
 * line is the first thing the eye lands on.
 */
export default function HighlightNumbers({ text, className = '' }) {
  const parts = String(text).split(NUMBER_RE);

  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <span
            key={index}
            className={`font-semibold tabular-nums text-[#F5D27A] ${className}`.trim()}
          >
            {part}
          </span>
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        )
      )}
    </>
  );
}
