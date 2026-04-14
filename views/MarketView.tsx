import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart3,
  Search,
  Calculator,
  ChevronUp,
  ChevronDown,
  Heart,
  ArrowUpDown,
  Zap,
  TrendingUp,
  TrendingDown,
  Clock,
  X,
  Minus
} from 'lucide-react';
import type { Crop } from '../types';
import { formatPrice, timeAgo } from '../lib/formatters';
import { CropIcon } from '../components/ui/CropIcon';
import { Sparkline } from '../components/ui/Sparkline';
import { EmptyState } from '../components/ui/EmptyState';
import { SkeletonCard } from '../components/ui/SkeletonCard';

export type SortBy = 'default' | 'price-asc' | 'price-desc' | 'demand' | 'trending';

interface AnalyticsData {
  topGainer: Crop | undefined;
}

interface MarketViewProps {
  crops: Crop[];
  filteredCrops: Crop[];
  favorites: string[];
  search: string;
  activeCategory: string;
  sortBy: SortBy;
  setSearch: (v: string) => void;
  setActiveCategory: (v: string) => void;
  setSortBy: (v: SortBy) => void;
  toggleFavorite: (id: string) => void;
  setSelectedCrop: (c: Crop | null) => void;
  addToBudget: (id: string) => void;
  budgetItems: { cropId: string }[];
  budgetLimit: number;
  analyticsData: AnalyticsData;
  getSeasonalStatus: (crop: Crop) => { inSeason: boolean; label: string };
  isInitialLoading: boolean;
}

export const MarketView: React.FC<MarketViewProps> = ({
  crops,
  filteredCrops,
  favorites,
  search,
  activeCategory,
  sortBy,
  setSearch,
  setActiveCategory,
  setSortBy,
  toggleFavorite,
  setSelectedCrop,
  addToBudget,
  budgetItems,
  budgetLimit,
  analyticsData,
  getSeasonalStatus,
  isInitialLoading,
}) => {
  const { t } = useTranslation();
  const tc = (crop: { id: string; name: string }) => t(`crops.${crop.id}`, crop.name);
  const favoriteCrops = crops.filter((c) => favorites.includes(c.id));

  return (
    <div className="space-y-4 sm:space-y-8 pb-28 lg:pb-12 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-zinc-400 group-focus-within:text-green-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder={t('actions.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-3 sm:py-4 pl-12 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500/50 text-zinc-900 dark:text-white transition-all text-sm sm:text-lg shadow-xl hover:border-zinc-300 dark:hover:border-zinc-800 placeholder:text-zinc-400"
              aria-label="Search crops"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-400 hover:bg-green-500/15 hover:text-green-500 hover:border-green-500/30 active:scale-90 transition-all"
                aria-label="Clear search"
              >
                <X size={15} strokeWidth={2.5} />
              </button>
            )}
          </div>
          
          <div className="flex flex-col gap-3 pb-2 w-full mt-2">
            {/* Category Row */}
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-1 scroll-smooth w-full">
              {['All', 'Fruit', 'Vegetable', 'Spice', 'Root'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 whitespace-nowrap px-4 sm:px-6 py-2.5 sm:py-3 rounded-[14px] border text-xs sm:text-sm font-bold transition-all active:scale-95 ${
                    activeCategory === cat
                      ? 'bg-green-400 border-green-400 text-black shadow-[0_0_20px_rgba(74,222,128,0.2)]'
                      : 'bg-zinc-100 dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700/80 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-700 hover:text-zinc-800 dark:hover:text-white'
                  }`}
                >
                  {cat === 'All' ? t('categories.all') : t(`categories.${cat.toLowerCase()}`)}
                </button>
              ))}
            </div>
            
            {/* Sort Bar (Full Width Segmented Control) */}
            <div className="flex items-center gap-1 w-full bg-zinc-100/80 dark:bg-zinc-800/60 p-1.5 rounded-[16px] border border-zinc-200 dark:border-zinc-700/80 shadow-inner overflow-x-auto scrollbar-hide">
              {[
                { key: 'default' as const, label: 'Default', icon: <ArrowUpDown size={12} /> },
                { key: 'price-asc' as const, label: 'Cheapest', icon: <ChevronUp size={12} /> },
                { key: 'price-desc' as const, label: 'Priciest', icon: <ChevronDown size={12} /> },
                { key: 'demand' as const, label: 'High Demand', icon: <Zap size={12} /> },
                { key: 'trending' as const, label: 'Top Gainer', icon: <TrendingUp size={12} /> },
              ].map((s) => (
                <button
                  key={s.key}
                  onClick={() => setSortBy(s.key)}
                  className={`flex items-center justify-center flex-1 shrink-0 gap-1.5 px-3 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    sortBy === s.key
                      ? 'bg-white dark:bg-zinc-700 text-green-500 dark:text-green-400 shadow-sm border border-zinc-200/50 dark:border-zinc-600'
                      : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-white hover:bg-white/50 dark:hover:bg-zinc-700/50'
                  }`}
                >
                  {s.icon}
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div
          className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-6 flex flex-col justify-between shadow-xl relative overflow-hidden group cursor-pointer hover:border-green-400/30 transition-all glass-card card-tilt"
          onClick={() => analyticsData.topGainer && setSelectedCrop(analyticsData.topGainer)}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
            <Zap size={120} className="text-green-500" />
          </div>
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${analyticsData.topGainer?.change7d && analyticsData.topGainer.change7d < 0 ? 'bg-red-400/10 border-red-400/20' : analyticsData.topGainer?.change7d === 0 ? 'bg-zinc-400/10 border-zinc-400/20' : 'bg-green-400/10 border-green-400/20'}`}>
              {analyticsData.topGainer?.change7d && analyticsData.topGainer.change7d < 0 ? <TrendingDown className="text-red-500" size={20} /> : analyticsData.topGainer?.change7d === 0 ? <Minus className="text-zinc-500" size={20} /> : <TrendingUp className="text-green-500" size={20} />}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{t('sections.topGainer')}</p>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight leading-none mt-0.5">{t('sections.todaysHighlight')}</h3>
            </div>
          </div>
          {analyticsData.topGainer ? (
            <div className="flex items-end justify-between">
              <div className="flex items-center gap-4">
                <CropIcon crop={analyticsData.topGainer} size="lg" />
                <div>
                  <h4 className="font-black text-zinc-900 dark:text-white text-lg">{tc(analyticsData.topGainer)}</h4>
                  <div className="flex items-center gap-2">
                    <span className={`font-black text-sm ${analyticsData.topGainer.change7d > 0 ? 'text-green-500' : analyticsData.topGainer.change7d < 0 ? 'text-red-500' : 'text-zinc-500'}`}>
                      {analyticsData.topGainer.change7d > 0 ? '+' : ''}{analyticsData.topGainer.change7d}%
                    </span>
                    <span className="text-zinc-500 dark:text-zinc-600 font-mono text-xs">7D</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-zinc-900 dark:text-white font-mono tracking-tighter">
                  {formatPrice(analyticsData.topGainer.currentPrice)}
                </p>
                <div className={`flex items-center gap-1 justify-end ${analyticsData.topGainer.change7d > 0 ? 'text-green-500' : analyticsData.topGainer.change7d < 0 ? 'text-red-500' : 'text-zinc-500'}`}>
                  {analyticsData.topGainer.change7d > 0 ? <ChevronUp size={14} strokeWidth={3} /> : analyticsData.topGainer.change7d < 0 ? <ChevronDown size={14} strokeWidth={3} /> : <Minus size={14} strokeWidth={3} />}
                  <span className="text-[10px] font-black">{formatPrice(Math.abs(analyticsData.topGainer.currentPrice * (analyticsData.topGainer.change7d / 100)))}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-2">
              <div className="h-12 bg-zinc-100 dark:bg-zinc-800 rounded-xl animate-pulse" />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
        {isInitialLoading ? (
          [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
        ) : filteredCrops.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              icon={Search}
              title={t('common.noResults')}
              subtitle={t('common.noResultsSubtitle')}
            />
          </div>
        ) : (
          filteredCrops.map((crop) => (
            <div
              key={crop.id}
              className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:rounded-[32px] overflow-hidden hover:border-green-400/50 hover:shadow-2xl hover:shadow-green-500/10 transition-all cursor-pointer relative flex flex-col h-full"
              onClick={() => setSelectedCrop(crop)}
            >
              <div className="p-4 sm:p-6 lg:p-8 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4 sm:mb-6">
                  <div className="flex items-center gap-4">
                    <div className="group-hover:scale-110 transition-transform duration-500">
                      <CropIcon crop={crop} size="lg" />
                    </div>
                    <div>
                      <h4 className="font-black text-zinc-900 dark:text-white text-lg sm:text-xl tracking-tight leading-snug">
                        {tc(crop)}
                      </h4>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-lg border border-zinc-200 dark:border-zinc-700">
                          {t(`categories.${crop.category.toLowerCase()}`)}
                        </span>
                        {getSeasonalStatus(crop).inSeason && (
                          <div className="flex items-center gap-1.5">
                            <Clock size={12} className="text-orange-400" />
                            <span className="text-[9px] font-bold text-orange-400 uppercase tracking-widest">In Season</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(crop.id);
                    }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      favorites.includes(crop.id)
                        ? 'bg-red-500/10 text-red-500'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:text-red-400'
                    }`}
                  >
                    <Heart size={20} fill={favorites.includes(crop.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>

                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-2xl sm:text-4xl font-black text-zinc-900 dark:text-white font-mono tracking-tighter">
                    {formatPrice(crop.currentPrice)}
                  </span>
                  <span className="text-zinc-400 dark:text-zinc-600 font-bold text-xs">/ kg</span>
                </div>

                <div className="flex items-center gap-2 mb-5 sm:mb-8">
                  <div className={`flex items-center gap-1 font-mono font-black text-xs px-2 py-0.5 rounded-full ${
                    crop.change7d > 0 ? 'bg-green-500/10 text-green-500' : crop.change7d < 0 ? 'bg-red-500/10 text-red-500' : 'bg-zinc-500/10 text-zinc-500'
                  }`}>
                    {crop.change7d > 0 ? <ChevronUp size={14} strokeWidth={3} /> : crop.change7d < 0 ? <ChevronDown size={14} strokeWidth={3} /> : <Minus size={14} strokeWidth={3} />}
                    <span>{Math.abs(crop.change7d)}%</span>
                  </div>
                  <span className="text-zinc-400 dark:text-zinc-600 font-bold text-[10px] uppercase tracking-widest">{t('sections.last7Days')}</span>
                </div>

                <div className="mt-auto pt-6 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <Sparkline data={crop.history} color={crop.change7d > 0 ? '#22c55e' : crop.change7d < 0 ? '#ef4444' : '#a1a1aa'} />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToBudget(crop.id);
                      }}
                      className="w-12 h-12 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-zinc-900/10 dark:shadow-white/5"
                      title={t('actions.addToBudget')}
                    >
                      <Calculator size={20} />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
};
