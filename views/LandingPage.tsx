import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FuturisticVinesBackground from '../components/ui/FuturisticVinesBackground';
import { Logo } from '../components/ui/Logo';
import { ArrowRight, Leaf, TrendingUp, ShieldCheck, Loader2 } from 'lucide-react';
import { LanguageToggle } from '../components/ui/LanguageToggle';

export const LandingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);
  const [isNavigatingLogin, setIsNavigatingLogin] = useState(false);

  const handleGetStartedClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsNavigating(true);
    setTimeout(() => {
      navigate('/login');
    }, 600);
  };

  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsNavigatingLogin(true);
    setTimeout(() => {
      navigate('/login');
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-stone-50 dark:bg-black text-zinc-900 dark:text-white">
      <FuturisticVinesBackground interactive={true} />

      {/* Top Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-3 py-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
          <div className="sm:hidden flex items-center shrink-0">
            <Logo size={28} className="text-green-500" />
          </div>
          <div className="hidden sm:flex items-center shrink-0">
            <Logo size={40} className="text-green-500" />
          </div>
          <h1 className="text-base sm:text-2xl font-black tracking-tighter hidden min-[360px]:block truncate">
            <span className="text-green-500">Agri</span>
            <span className="text-zinc-700 dark:text-white/80">Presyo</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <LanguageToggle />
          <button
            onClick={handleLoginClick}
            disabled={isNavigatingLogin}
            className={`flex items-center justify-center gap-2 text-black w-[80px] sm:w-[140px] h-[32px] sm:h-[36px] rounded-full font-black uppercase tracking-widest text-[9px] sm:text-xs transition-all duration-300 shrink-0
              ${!isNavigatingLogin ? 'bg-green-500 hover:scale-105 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] active:scale-95' : 'bg-green-600 scale-95 opacity-90 shadow-inner'}
            `}
          >
            {isNavigatingLogin ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              t('landing.logIn')
            )}
          </button>
        </div>
      </nav>

      {/* Main Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-5 sm:px-6 text-center mt-[-20px] sm:mt-[-40px]">

        {/* Glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-96 bg-green-500/10 blur-[60px] rounded-full pointer-events-none"></div>

        <h2 className="text-4xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.1] mb-4 sm:mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {t('landing.heroTitle1')} <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">{t('landing.heroTitle2')}</span>
        </h2>

        <p className="text-base sm:text-xl text-zinc-500 max-w-2xl mx-auto mb-8 sm:mb-12 font-medium animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-150 px-2">
          {t('landing.heroSubtitle')}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 px-1">
          <button
            onClick={handleGetStartedClick}
            disabled={isNavigating}
            className={`relative overflow-hidden flex items-center justify-center text-black font-black uppercase tracking-widest transition-all duration-300 group
              w-full sm:w-[240px] h-[56px] rounded-2xl bg-green-500
              ${!isNavigating ? 'hover:scale-105 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] active:scale-95' : 'opacity-90 scale-95 shadow-inner'}
            `}
          >
            {/* Text & Icon Container */}
            <span className={`absolute flex items-center gap-2 whitespace-nowrap transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isNavigating ? '-translate-y-10 opacity-0' : 'translate-y-0 opacity-100'
            }`}>
              {t('landing.getStarted')}
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </span>
            
            {/* Theme-aligned Logo Animation */}
            <div className={`absolute flex items-center gap-2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isNavigating ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <Logo size={24} className="animate-pulse drop-shadow-md" />
              <span>{t('common.loading')}</span>
            </div>
          </button>
          <Link
            to="/about"
            className="flex items-center justify-center gap-2 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 w-full sm:w-[240px] py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-white dark:hover:bg-zinc-800 transition-all"
          >
            {t('landing.learnMore')}
          </Link>
        </div>

        {/* Feature Highlights using Glassmorphism */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-16 sm:mt-24 max-w-5xl mx-auto animate-in fade-in duration-1000 delay-500 w-full">
          <div className="glass-card p-5 sm:p-6 rounded-2xl sm:rounded-3xl text-left border border-zinc-200 dark:border-zinc-800">
            <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center mb-4">
              <TrendingUp className="text-green-500" size={24} />
            </div>
            <h3 className="text-lg font-black mb-2">{t('landing.featureRealTimeTitle')}</h3>
            <p className="text-sm text-zinc-500">{t('landing.featureRealTimeDesc')}</p>
          </div>
          <div className="glass-card p-5 sm:p-6 rounded-2xl sm:rounded-3xl text-left border border-zinc-200 dark:border-zinc-800">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4">
              <ShieldCheck className="text-emerald-500" size={24} />
            </div>
            <h3 className="text-lg font-black mb-2">{t('landing.featureTransparentTitle')}</h3>
            <p className="text-sm text-zinc-500">{t('landing.featureTransparentDesc')}</p>
          </div>
          <div className="glass-card p-5 sm:p-6 rounded-2xl sm:rounded-3xl text-left border border-zinc-200 dark:border-zinc-800">
            <div className="w-12 h-12 bg-lime-500/10 rounded-2xl flex items-center justify-center mb-4">
              <Leaf className="text-lime-500" size={24} />
            </div>
            <h3 className="text-lg font-black mb-2">{t('landing.featureSustainableTitle')}</h3>
            <p className="text-sm text-zinc-500">{t('landing.featureSustainableDesc')}</p>
          </div>
        </div>

      </main>

      {/* Simple Footer */}
      <footer className="relative z-20 border-t border-zinc-200 dark:border-zinc-900 bg-stone-50/50 dark:bg-black/50 backdrop-blur-md px-4 py-5 sm:p-6 text-center">
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{t('footer.builtFor')}</p>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">
          Contact us: <a href="mailto:agripresyo@gmail.com" className="hover:text-green-500 transition-colors lowercase">agripresyo@gmail.com</a>
        </p>
      </footer>
    </div>
  );
};
