import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../auth/ThemeContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="p-3 rounded-2xl bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:scale-110 active:scale-95 transition-all shadow-[0_10px_20px_rgba(0,0,0,0.05)] border border-zinc-200 dark:border-zinc-800"
      aria-label="Toggle Theme"
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
};
