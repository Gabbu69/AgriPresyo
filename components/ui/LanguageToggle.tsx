import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const isFil = i18n.language === 'fil';

  const toggle = () => {
    i18n.changeLanguage(isFil ? 'en' : 'fil');
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:scale-105 active:scale-95 transition-all shadow-[0_10px_20px_rgba(0,0,0,0.05)] group"
      aria-label={isFil ? 'Switch to English' : 'Lumipat sa Filipino'}
      title={isFil ? 'Switch to English' : 'Lumipat sa Filipino'}
    >
      <Globe size={14} className="hidden sm:block text-zinc-400 group-hover:text-green-500 transition-colors" />
      <div className="flex items-center rounded-lg overflow-hidden text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
        <span
          className={`px-1 sm:px-1.5 py-0.5 transition-all duration-300 ${
            !isFil
              ? 'text-green-500'
              : 'text-zinc-400'
          }`}
        >
          EN
        </span>
        <span className="text-zinc-300 dark:text-zinc-600">|</span>
        <span
          className={`px-1 sm:px-1.5 py-0.5 transition-all duration-300 flex items-center gap-1 ${
            isFil
              ? 'text-green-500'
              : 'text-zinc-400'
          }`}
        >
          FIL
          {isFil && <span className="text-[9px]">🇵🇭</span>}
        </span>
      </div>
    </button>
  );
};

export default LanguageToggle;
