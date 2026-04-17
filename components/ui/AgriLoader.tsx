import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * AgriPresyo Minimalist Loading Screen
 */
export const AgriLoader = ({ message = 'Loading...' }: { message?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24 select-none">
      <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-green-500 animate-spin" />
      <p className="mt-4 text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-500">
        {message}
      </p>
    </div>
  );
};
