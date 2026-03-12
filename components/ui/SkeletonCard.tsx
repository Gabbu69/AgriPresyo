import React from 'react';

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:rounded-[36px] p-4 sm:p-6 lg:p-8 shadow-lg ${className}`}
    aria-hidden
  >
    <div className="flex items-center gap-4 mb-6">
      <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl skeleton shrink-0" />
      <div className="flex-1 space-y-3">
        <div className="h-5 skeleton w-3/4" />
        <div className="h-3 skeleton w-1/2" />
      </div>
    </div>
    <div className="space-y-3">
      <div className="h-3 skeleton w-full" />
      <div className="h-3 skeleton w-5/6" />
      <div className="h-3 skeleton w-2/3" />
    </div>
    <div className="flex gap-3 mt-6">
      <div className="h-10 skeleton w-20 rounded-xl" />
      <div className="h-10 skeleton w-20 rounded-xl" />
    </div>
  </div>
);
