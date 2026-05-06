import React, { useRef } from 'react';

export const Logo = ({ size = 100, className = "", onUnlock }: { size?: number, className?: string, onUnlock?: () => void }) => {
  const clicksRef = useRef(0);
  const resetTimerRef = useRef<number | null>(null);

  const handleClick = () => {
    clicksRef.current += 1;

    if (resetTimerRef.current) {
      window.clearTimeout(resetTimerRef.current);
    }

    if (clicksRef.current >= 5) {
      clicksRef.current = 0;
      onUnlock?.();
      return;
    }

    resetTimerRef.current = window.setTimeout(() => {
      clicksRef.current = 0;
    }, 2000);
  };

  return (
    <img
      src="/AgriPresyo_logoFinal.webp"
      alt="AgriPresyo"
      style={{ width: size, height: size }}
      className={`object-contain rounded-2xl ${className} cursor-pointer active:scale-95 transition-transform`}
      decoding="async"
      onClick={handleClick}
    />
  );
};
