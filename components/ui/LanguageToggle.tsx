import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const isFil = i18n.language === 'fil';

  const toggle = useCallback(() => {
    i18n.changeLanguage(isFil ? 'en' : 'fil');
  }, [i18n, isFil]);

  return (
    <button
      onClick={toggle}
      className="relative flex items-center p-1 rounded-full bg-zinc-100/50 dark:bg-zinc-800/50 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-700/80 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50 active:scale-95 transition-all duration-300"
      aria-label={isFil ? 'Switch to English' : 'Lumipat sa Filipino'}
      title={isFil ? 'Switch to English' : 'Lumipat sa Filipino'}
    >
      {/* Neutral Sliding Pill Indicator */}
      <div 
        className={`absolute top-1 bottom-1 w-[44px] rounded-full bg-white dark:bg-zinc-600 shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          isFil ? 'translate-x-[44px]' : 'translate-x-0'
        }`}
      />
      
      {/* EN Text */}
      <div className={`relative z-10 w-[44px] py-1 flex items-center justify-center text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${
        !isFil ? 'text-green-500' : 'text-zinc-400 dark:text-zinc-500'
      }`}>
        EN
      </div>

      {/* FIL Text */}
      <div className={`relative z-10 w-[44px] py-1 flex items-center justify-center text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${
        isFil ? 'text-green-500' : 'text-zinc-400 dark:text-zinc-500'
      }`}>
        FIL
      </div>
    </button>
  );
};

export default LanguageToggle;
