import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

// Tiny className joiner — this codebase has no shadcn/lib alias or clsx.
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * TextShimmer — a light band that sweeps endlessly across the text.
 * The text is painted by a base gradient; a bright band (--base-gradient-color)
 * travels left-to-right over it (see shadcn/ui text-shimmer).
 */
export function TextShimmer({
  children,
  as: Component = 'p',
  className,
  duration = 2,
  spread = 2,
  // CSS background-image for the paint (non-moving) layer. Defaults to a flat
  // --base-color fill; pass the heading's original gradient here to keep its
  // colours and only add the sweeping highlight on top.
  baseGradient,
}) {
  const MotionComponent = motion.create(Component);

  const dynamicSpread = useMemo(() => {
    // children is normally a string; fall back to 0 for React nodes
    const len = typeof children === 'string' ? children.length : 0;
    return len * spread;
  }, [children, spread]);

  return (
    <MotionComponent
      className={cn(
        'relative inline-block bg-[length:250%_100%,auto] bg-clip-text',
        'text-transparent [--base-color:#a1a1aa] [--base-gradient-color:#000]',
        '[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))] [background-repeat:no-repeat,padding-box]',
        'dark:[--base-color:#71717a] dark:[--base-gradient-color:#ffffff] dark:[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))]',
        className
      )}
      initial={{ backgroundPosition: '100% center' }}
      animate={{ backgroundPosition: '0% center' }}
      transition={{
        repeat: Infinity,
        duration,
        ease: 'linear',
      }}
      style={{
        '--spread': `${dynamicSpread}px`,
        backgroundImage:
          'var(--bg), ' +
          (baseGradient || 'linear-gradient(var(--base-color), var(--base-color))'),
      }}
    >
      {children}
    </MotionComponent>
  );
}

export default TextShimmer;
