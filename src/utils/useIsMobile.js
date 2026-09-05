import { useEffect, useState } from 'react';

/**
 * True when the viewport is phone-sized (below 768px by default).
 * Evaluated synchronously on first render so the desktop build never
 * mounts-and-unmounts on phones — the mobile variant is chosen from the
 * very first paint.
 */
export function useIsMobile(breakpoint = '(max-width: 767px)') {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(breakpoint).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(breakpoint);
    const apply = (e) => setIsMobile(e.matches);
    // Some older WebViews only support addListener
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', apply);
    } else {
      mq.addListener(apply);
    }
    apply(mq);
    return () => {
      if (typeof mq.removeEventListener === 'function') {
        mq.removeEventListener('change', apply);
      } else {
        mq.removeListener(apply);
      }
    };
  }, [breakpoint]);

  return isMobile;
}

export default useIsMobile;