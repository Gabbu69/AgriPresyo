import React, { useState, useEffect } from 'react';

/**
 * AgriPresyo Fast Loader
 * A sleek, minimal loader that only appears after a short delay
 * to avoid flashing on fast connections.
 */
export const AgriLoader = ({ message = 'Loading...', delayMs = 300 }: { message?: string, delayMs?: number }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs]);

  if (!show) return null;

  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24 animate-in fade-in duration-300 select-none">
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
        {/* Sleek rotating ring - fast and minimal */}
        <div className="absolute inset-0 rounded-full border-[3px] border-zinc-200 dark:border-zinc-800" />
        <div className="absolute inset-0 rounded-full border-[3px] border-green-500 border-t-transparent animate-spin" />
        
        {/* Inner Logo */}
        <div className="absolute inset-2 flex items-center justify-center bg-stone-50/50 dark:bg-black/50 rounded-full backdrop-blur-sm">
          <img
            src="/AgriPresyo_logoFinal.webp"
            alt="Loading"
            className="w-8 h-8 sm:w-10 sm:h-10 object-contain animate-pulse"
            decoding="async"
          />
        </div>
      </div>
      
      {/* Loading text - elegant and discreet */}
      <p className="mt-6 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
        {message}
      </p>
    </div>
  );
};
