import { useEffect, useRef, useState } from 'react';

/**
 * In-view detector with a scroll fallback. IntersectionObserver is the fast
 * path, but embedded webviews / throttled tabs can starve it, so a cheap
 * scroll+resize check guarantees the reveal always fires once the element is
 * genuinely on screen. Elements only animate once they've clearly entered the
 * viewport (top above 92% of the screen, bottom past 8%).
 */
export function useInViewOnce() {
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

export default useInViewOnce;