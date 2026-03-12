import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  action?: { label: string; onClick: () => void };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: IconComp, title, subtitle, action }) => (
  <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center">
    <div className="w-20 h-20 rounded-3xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-6">
      <IconComp size={36} className="text-zinc-300 dark:text-zinc-600" aria-hidden />
    </div>
    <h3 className="text-xl font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">{title}</h3>
    <p className="text-sm text-zinc-400 dark:text-zinc-600 max-w-sm">{subtitle}</p>
    {action && (
      <button
        onClick={action.onClick}
        className="mt-6 bg-green-500 text-black px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-green-500/20"
      >
        {action.label}
      </button>
    )}
  </div>
);
