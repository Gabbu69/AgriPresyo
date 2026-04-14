import React from 'react';

/**
 * AgriPresyo Themed Loading Screen
 * A unique agricultural-themed loader with growing sprout animation,
 * floating leaf particles, and pulsing root system.
 */
export const AgriLoader = ({ message = 'Loading...' }: { message?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24 select-none">
      {/* Main loader container */}
      <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center">
        {/* Outer pulsing ring */}
        <div className="absolute inset-0 rounded-full border-2 border-green-500/20 agri-loader-ring" />
        <div className="absolute inset-2 rounded-full border border-green-400/10 agri-loader-ring-delayed" />

        {/* Floating leaf particles */}
        <div className="absolute inset-0">
          <div className="agri-leaf-particle agri-leaf-1">🌿</div>
          <div className="agri-leaf-particle agri-leaf-2">🍃</div>
          <div className="agri-leaf-particle agri-leaf-3">🌱</div>
          <div className="agri-leaf-particle agri-leaf-4">☘️</div>
        </div>

        {/* Center logo area */}
        <div className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-600/10 border border-green-500/30 flex items-center justify-center agri-loader-breathe shadow-[0_0_40px_rgba(34,197,94,0.15)]">
          <img
            src="/AgriPresyo_logoFinal.webp"
            alt="Loading"
            className="w-12 h-12 sm:w-14 sm:h-14 object-contain rounded-xl agri-loader-bounce"
            decoding="async"
          />
        </div>
      </div>

      {/* Growing root line */}
      <div className="w-24 sm:w-32 h-1 mt-6 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
        <div className="h-full rounded-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-400 agri-loader-progress" />
      </div>

      {/* Loading text */}
      <p className="mt-4 text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-500 agri-loader-text-pulse">
        {message}
      </p>
    </div>
  );
};
