import React from 'react';
import { Link } from 'react-router-dom';
import FuturisticVinesBackground from '../components/ui/FuturisticVinesBackground';
import { Logo } from '../components/ui/Logo';
import { ArrowRight, Leaf, TrendingUp, ShieldCheck } from 'lucide-react';
import { LanguageToggle } from '../components/ui/LanguageToggle';

export const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-stone-50 dark:bg-black text-zinc-900 dark:text-white">
      <FuturisticVinesBackground interactive={true} />
      
      {/* Top Navigation */}
      <nav className="relative z-20 flex items-center justify-between p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
        <div className="flex items-center gap-3">
          <Logo size={40} className="text-green-500" />
          <h1 className="text-2xl font-black tracking-tighter">
            <span className="text-green-500">Agri</span>
            <span className="text-zinc-700 dark:text-white/80">Presyo</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <LanguageToggle />
          <Link 
            to="/login"
            className="hidden sm:flex items-center gap-2 bg-green-500 text-black px-6 py-2.5 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all"
          >
            Log In
          </Link>
        </div>
      </nav>

      {/* Main Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 sm:px-6 text-center mt-[-40px]">
        
        {/* Glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-96 bg-green-500/10 blur-[120px] rounded-full point-events-none"></div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/20 bg-green-500/5 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
          <span className="text-xs font-black uppercase tracking-widest text-green-600 dark:text-green-400">Live in SOCCSARGEN</span>
        </div>

        <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.1] mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          Know the Price <br className="hidden sm:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Before You Buy.</span>
        </h2>

        <p className="text-lg sm:text-xl text-zinc-500 max-w-2xl mx-auto mb-12 font-medium animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-150">
          Real-time agricultural commodity tracking for Philippine farmers, vendors, and consumers. Make smarter market decisions with transparent pricing.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
          <Link 
            to="/login"
            className="flex items-center justify-center gap-2 bg-green-500 text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all group"
          >
            Get Started
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </Link>
          <Link 
            to="/about"
            className="flex items-center justify-center gap-2 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-white dark:hover:bg-zinc-800 transition-all"
          >
            Learn More
          </Link>
        </div>

        {/* Feature Highlights using Glassmorphism */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-24 max-w-5xl mx-auto animate-in fade-in duration-1000 delay-500">
          <div className="glass-card p-6 rounded-3xl text-left border border-zinc-200 dark:border-zinc-800">
            <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center mb-4">
              <TrendingUp className="text-green-500" size={24} />
            </div>
            <h3 className="text-lg font-black mb-2">Real-Time Data</h3>
            <p className="text-sm text-zinc-500">Track dynamic price changes powered by actual vendor submissions and market data.</p>
          </div>
          <div className="glass-card p-6 rounded-3xl text-left border border-zinc-200 dark:border-zinc-800">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4">
              <ShieldCheck className="text-emerald-500" size={24} />
            </div>
            <h3 className="text-lg font-black mb-2">Transparent Pricing</h3>
            <p className="text-sm text-zinc-500">No more guessing. See daily averages and compare shop-specific deals before heading out.</p>
          </div>
          <div className="glass-card p-6 rounded-3xl text-left border border-zinc-200 dark:border-zinc-800">
            <div className="w-12 h-12 bg-lime-500/10 rounded-2xl flex items-center justify-center mb-4">
              <Leaf className="text-lime-500" size={24} />
            </div>
            <h3 className="text-lg font-black mb-2">Sustainable Farming</h3>
            <p className="text-sm text-zinc-500">Empower local farmers with predictive trend analysis and direct consumer access.</p>
          </div>
        </div>

      </main>

      {/* Simple Footer */}
      <footer className="relative z-20 border-t border-zinc-200 dark:border-zinc-900 bg-stone-50/50 dark:bg-black/50 backdrop-blur-md p-6 text-center">
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Built for the Philippine Agricultural Community</p>
      </footer>
    </div>
  );
};
