import React from 'react';
import { Crop } from '../../types';
import { formatPrice } from '../utils/helpers';

export const Ticker = ({ crops, onCropClick }: { crops: Crop[], onCropClick?: (crop: Crop) => void }) => {
  return (
    <div className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-900 h-11 flex items-center overflow-hidden whitespace-nowrap sticky top-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.3)] antialiased">
      <div className="ticker-mask w-full h-full flex items-center">
        <div
          className="animate-marquee flex px-4"
          style={{ '--ticker-duration': `${crops.length * 10}s` } as React.CSSProperties}
        >
          {[...crops, ...crops, ...crops, ...crops].map((crop, idx) => (
            <div
              key={`${crop.id}-${idx}`}
              className="flex items-center gap-3 font-mono text-sm cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800/80 rounded-xl px-3 py-1.5 transition-all mx-2 group"
              onClick={() => onCropClick?.(crop)}
            >
              <span className="text-zinc-500 font-extrabold uppercase group-hover:text-zinc-700 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition-colors">{crop.name}</span>
              <span className="font-bold text-zinc-900 dark:text-white tracking-tight">{formatPrice(crop.currentPrice)}</span>
              <span className={`text-[11px] px-1.5 py-0.5 rounded-md font-bold ${crop.change24h >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {crop.change24h >= 0 ? '▲' : '▼'} {Math.abs(crop.change24h)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
