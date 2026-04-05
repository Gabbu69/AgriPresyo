import React from 'react';
import { Link } from 'react-router-dom';
import FuturisticVinesBackground from '../components/ui/FuturisticVinesBackground';
import { Logo } from '../components/ui/Logo';
import { ArrowLeft, Database, Users, Globe, Lock, Code, BarChart, Server } from 'lucide-react';
import { LanguageToggle } from '../components/ui/LanguageToggle';

export const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-stone-50 dark:bg-black text-zinc-900 dark:text-white">
      <FuturisticVinesBackground interactive={true} />
      
      {/* Top Navigation */}
      <nav className="relative z-20 flex items-center justify-between p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
        <Link to="/" className="flex items-center gap-3 group">
          <Logo size={40} className="text-green-500 group-hover:scale-105 transition-transform" />
          <h1 className="text-2xl font-black tracking-tighter">
            <span className="text-green-500">Agri</span>
            <span className="text-zinc-700 dark:text-white/80">Presyo</span>
          </h1>
        </Link>
        <div className="flex items-center gap-4">
          <LanguageToggle />
          <Link 
            to="/login"
            className="hidden sm:flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-6 py-2.5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
          >
            Log In
          </Link>
        </div>
      </nav>

      {/* Main Content Sections */}
      <main className="flex-1 relative z-10 px-4 sm:px-6 max-w-4xl mx-auto w-full pt-12 pb-24">
        
        {/* Glow effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/5 blur-[120px] rounded-full pointer-events-none"></div>

        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-green-500 transition-all font-black uppercase tracking-widest text-xs mb-12 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <h2 className="text-4xl sm:text-6xl font-black tracking-tighter leading-[1.1] mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          Trust Starts <br className="hidden sm:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">With Transparency.</span>
        </h2>

        <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mb-16 font-medium animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
          We believe that a fair market requires honest, accessible data. Here's exactly where AgriPresyo gets its pricing information to ensure you always have the real numbers.
        </p>

        {/* Core Value Proposition & Data Sources */}
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          
          <section className="glass-card p-6 sm:p-10 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row gap-8">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center shrink-0">
              <Globe className="text-blue-500" size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black mb-3">1. HDX Humanitarian API</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                Our foundation utilizes real-time indices pulled straight from the Humanitarian Data Exchange (HDX). 
                Specifically, we query vetted food price data for the SOCCSARGEN (Region 12) area to ensure baseline figures accurately reflect macro-economic movements.
              </p>
              <div className="inline-block bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full">
                Verified Global Source
              </div>
            </div>
          </section>

          <section className="glass-card p-6 sm:p-10 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row gap-8">
            <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center shrink-0">
              <Server className="text-green-500" size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black mb-3">2. Live Vercel Architecture</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                To guarantee speed and reliability, data is processed through custom Vercel Serverless APIs. 
                Prices aren't hardcoded manually; they are fetched, sanitized, and updated dynamically every time you load the dashboard.
              </p>
              <div className="inline-block bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full">
                Real-Time Up-Time
              </div>
            </div>
          </section>

          <section className="glass-card p-6 sm:p-10 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row gap-8">
            <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center shrink-0">
              <Users className="text-amber-500" size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black mb-3">3. Verified Local Vendors</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                The most important data comes from the ground. Local farmers and registered vendors directly input their daily inventory and prices. 
                Our community-driven approach ensures you see accurate micro-market variations that regional averages might miss.
              </p>
              <div className="inline-block bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full">
                Community Sourced
              </div>
            </div>
          </section>
        </div>

        {/* Security & Promise Block */}
        <div className="mt-20 p-8 sm:p-12 bg-zinc-900 border border-zinc-800 rounded-3xl text-center text-white relative overflow-hidden animate-in fade-in duration-700 delay-500">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 blur-[80px] rounded-full pointer-events-none"></div>
          
          <Lock className="w-12 h-12 text-green-400 mx-auto mb-6" />
          <h3 className="text-3xl font-black mb-4">Our Promise</h3>
          <p className="text-zinc-400 max-w-xl mx-auto mb-8 font-medium">
            AgriPresyo is built strictly for the Philippine agricultural sector. Your data is encrypted, vendor identities are verified through strict administrative review, and crop pricing remains a transparent, decentralized effort.
          </p>
          
          <Link 
            to="/login"
            className="inline-flex items-center justify-center gap-2 bg-green-500 text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all"
          >
            Join the Network
          </Link>
        </div>

      </main>

      <footer className="relative z-20 border-t border-zinc-200 dark:border-zinc-900 bg-stone-50/50 dark:bg-black/50 backdrop-blur-md p-6 text-center">
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Real-Time Data • Transparent Pricing • Sustainable Farming</p>
      </footer>
    </div>
  );
};
