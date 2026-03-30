import React, { useState, useEffect, useRef } from 'react';

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

// Animated counter component — counts up from 0 to target
export const AnimatedCounter = ({ value, prefix = '', suffix = '', duration = 1200 }: AnimatedCounterProps) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number>(0);

  useEffect(() => {
    const start = ref.current;
    const diff = value - start;
    if (diff === 0) return;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = start + diff * eased;
      setDisplay(current);
      ref.current = current;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value, duration]);

  const formatted = Number.isInteger(value) ? Math.round(display).toLocaleString() : display.toFixed(2);
  return <span>{prefix}{formatted}{suffix}</span>;
};

export default AnimatedCounter;
