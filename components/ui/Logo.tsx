import React, { useState } from 'react';

export const Logo = ({ size = 100, className = "", onUnlock }: { size?: number, className?: string, onUnlock?: () => void }) => {
  const [clicks, setClicks] = useState(0);

  const handleClick = () => {
    setClicks(prev => {
      const next = prev + 1;
      if (next === 5) {
        onUnlock?.();
        return 0;
      }
      return next;
    });

    // Reset clicks if not continued quickly
    setTimeout(() => setClicks(0), 2000);
  };

  return (
    <img
      src="/AgriPresyo_logoFinal.png"
      alt="AgriPresyo"
      style={{ width: size, height: size }}
      className={`object-contain rounded-2xl ${className} cursor-pointer active:scale-95 transition-transform`}
      onClick={handleClick}
    />
  );
};
