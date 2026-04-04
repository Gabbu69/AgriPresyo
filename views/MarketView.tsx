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
  Clock
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
    <div className="space-y-6 sm:space-y-8 pb-32 lg:pb-12 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" aria-hidden />
            <input
              type="search"
              placeholder={t('actions.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-3 sm:py-4 pl-12 pr-4 sm:pr-6 focus:outline-none focus:ring-2 focus:ring-green-400/50 text-zinc-900 dark:text-white transition-all text-sm sm:text-lg shadow-xl"
              aria-label="Search crops"
            />
          </div>
          <div className="flex items-center justify-between gap-3 pb-2 overflow-x-auto scrollbar-hide w-full">
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {['All', 'Fruit', 'Vegetable', 'Spice', 'Root'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border text-xs sm:text-sm font-bold transition-all ${
                    activeCategory === cat
                      ? 'bg-green-400 border-green-400 text-black shadow-lg shadow-green-400/20'
                      : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-white'
                  }`}
                >
                  {cat === 'All' ? t('categories.all') : t(`categories.${cat.toLowerCase()}`)}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 bg-zinc-100/80 dark:bg-zinc-800/80 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-inner shrink-0 ml-auto">
              {[
                { key: 'default' as const, label: 'All', icon: <ArrowUpDown size={12} /> },
                { key: 'price-asc' as const, label: '₱↑', icon: <ChevronUp size={12} /> },
                { key: 'price-desc' as const, label: '₱↓', icon: <ChevronDown size={12} /> },
                { key: 'demand' as const, label: 'Hot', icon: <Zap size={12} /> },
                { key: 'trending' as const, label: 'Top', icon: <TrendingUp size={12} /> },
              ].map((s) => (
                <button
                  key={s.key}
                  onClick={() => setSortBy(s.key)}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-[10px] sm:text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                    sortBy === s.key
                      ? 'bg-green-400 text-black shadow-md'
                      : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60'
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
            <TrendingUp size={80} className="text-green-400" aria-hidden />
          </div>
          <div className="flex justify-between items-start relative z-10">
            <span className="text-green-400 font-bold text-xs uppercase tracking-widest">{t('sections.topGainer')}</span>
          </div>
          <div className="mt-4 relative z-10">
            <h4 className="text-xl sm:text-3xl font-black text-zinc-900 dark:text-white">
              {analyticsData.topGainer ? tc(analyticsData.topGainer) : t('common.loading')}
            </h4>
            <div className="flex items-center gap-2">
              {analyticsData.topGainer && <CropIcon crop={analyticsData.topGainer} size="lg" />}
              <p className="text-green-400 font-mono font-bold text-xl">
                +{analyticsData.topGainer?.change24h}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {favoriteCrops.length > 0 && (
        <section aria-label="Watchlist">
          <h2 className="text-xl font-black flex items-center gap-2 uppercase tracking-tighter text-zinc-900 dark:text-white">
            <Heart className="text-red-400" size={20} fill="currentColor" aria-hidden />
            {t('sections.myWatchlist')}
            <span className="text-sm font-mono text-zinc-500 ml-2">{favoriteCrops.length} {t('sections.items')}</span>
          </h2>
          <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide scroll-snap-x">
            {favoriteCrops.map((crop) => (
              <div
                key={`fav-${crop.id}`}
                className="min-w-[160px] sm:min-w-[200px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 sm:p-4 cursor-pointer hover:shadow-green-400/10 transition-all shadow-lg flex-shrink-0"
                onClick={() => setSelectedCrop(crop)}
              >
                <div className="flex items-center gap-3 mb-2">
                  <CropIcon crop={crop} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-zinc-900 dark:text-white text-sm truncate">{tc(crop)}</p>
                    <p className="font-mono text-green-500 font-bold text-sm">{formatPrice(crop.currentPrice)}</p>
                  </div>
                </div>
                <div
                  className={`text-xs font-bold flex items-center gap-1 ${
                    crop.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {crop.change24h >= 0 ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  {Math.abs(crop.change24h)}%
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section aria-label="Commodity listings">
        <h2 className="text-xl font-black flex items-center gap-2 uppercase tracking-tighter text-zinc-900 dark:text-white">
          <BarChart3 className="text-green-400" size={20} aria-hidden />
          {t('sections.priceInsights')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isInitialLoading ? (
            [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
          ) : filteredCrops.length === 0 ? (
            <div className="col-span-full">
              <EmptyState
                icon={Search}
                title={t('common.noResults')}
                subtitle={t('common.noResultsSubtitle')}
                action={{
                  label: t('actions.clearFilters'),
                  onClick: () => {
                    setSearch('');
                    setActiveCategory('All');
                  },
                }}
              />
            </div>
          ) : (
            filteredCrops.map((crop) => {
              const season = getSeasonalStatus(crop);
              const isFav = favorites.includes(crop.id);
              return (
                <article
                  key={crop.id}
                  className={`bg-[#18181b] border border-white/5 rounded-[28px] p-5 hover:bg-[#1f1f22] cursor-pointer transition-colors group relative flex flex-col justify-between min-h-[160px] shadow-2xl stagger-item stagger-${Math.min((filteredCrops.indexOf(crop) % 6) + 1, 6)}`}
                  onClick={() => setSelectedCrop(crop)}
                >
                  <div className="flex justify-between items-start w-full relative z-10 gap-2">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <div className="shrink-0 drop-shadow-2xl">
                        <CropIcon crop={crop} size="lg" />
                      </div>
                      <div className="flex flex-col justify-center flex-1 min-w-0">
                        <h3 className="font-bold text-white text-[16px] sm:text-[18px] leading-tight tracking-tight line-clamp-2">
                          {tc(crop)}
                        </h3>
                        <p className="text-[10px] sm:text-[11px] text-zinc-500 font-mono font-bold uppercase tracking-widest mt-1 truncate">
                          {crop.category}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0 gap-1 mt-0.5">
                       <div className="flex items-center gap-2 sm:gap-3">
                          <span className={`flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 ${season.inSeason ? 'bg-[#0f2e1e]' : 'bg-red-950/50'} rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-wider`}>
                             <div className={`w-1.5 h-1.5 rounded-full ${season.inSeason ? 'bg-[#34d399]' : 'bg-red-500'}`} style={season.inSeason ? { boxShadow: '0 0 8px rgba(52,211,153,0.6)' } : {}}/>
                             <span className={season.inSeason ? 'text-[#34d399]' : 'text-red-400'}>
                                {season.inSeason ? t('sections.inSeason') : t('sections.offSeason')}
                             </span>
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(crop.id);
                            }}
                            className="text-zinc-500 hover:text-white transition-colors"
                            aria-label={isFav ? 'Remove from watchlist' : 'Add to watchlist'}
                          >
                            <Heart size={18} fill={isFav ? 'currentColor' : 'none'} className={isFav ? "text-white" : ""} />
                          </button>
                       </div>
                       
                       <div className="flex flex-col items-end mt-2 pr-1">
                          <div className="flex items-start">
                             <span className="text-zinc-400 text-xs sm:text-sm font-bold mt-1 sm:mt-1.5 mr-0.5 font-mono">₱</span>
                             <span className="font-black text-white text-[20px] sm:text-[25px] leading-none tracking-tight">
                                {formatPrice(crop.currentPrice).replace('₱', '').trim()}
                             </span>
                          </div>
                          <div className={`flex items-center gap-0.5 text-[11px] sm:text-[13px] font-bold mt-1 sm:mt-1.5 ${crop.change24h >= 0 ? 'text-[#34d399]' : 'text-red-500'}`}>
                             {crop.change24h >= 0 ? <ChevronUp size={14} strokeWidth={3} className="sm:w-4 sm:h-4 w-3.5 h-3.5" /> : <ChevronDown size={14} strokeWidth={3} className="sm:w-4 sm:h-4 w-3.5 h-3.5" />}
                             <span>{Math.abs(crop.change24h)}%</span>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="flex items-end justify-between mt-6 relative z-10 w-full pl-1">
                    <div className="opacity-90">
                      <Sparkline
                        data={crop.history}
                        color={crop.change24h >= 0 ? '#34d399' : '#ef4444'}
                      />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToBudget(crop.id);
                      }}
                      className="w-12 h-12 flex items-center justify-center rounded-[18px] border border-white/5 bg-white-[0.02] hover:bg-white/10 transition-colors text-zinc-500 hover:text-zinc-300 group-hover:border-white/10 bg-[#242427]"
                      aria-label="Add to budget"
                    >
                      <Calculator size={20} strokeWidth={2} />
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>

      {budgetItems.length === 0 && (
        <section aria-label="Suggested basket">
          <div className="bg-white dark:bg-zinc-900 p-4 sm:p-6 lg:p-8 rounded-3xl sm:rounded-[40px] border border-zinc-200 dark:border-zinc-800 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-2xl bg-green-500/10 border border-green-500/20">
                <Calculator className="text-green-500" size={24} aria-hidden />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tighter text-zinc-900">{t('sections.suggestedBasket')}</h3>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                  {t('sections.bestValuePicks')} ₱{budgetLimit}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[...crops]
                .sort((a, b) => a.currentPrice - b.currentPrice)
                .slice(0, 4)
                .map((crop) => (
                  <div
                    key={`suggest-${crop.id}`}
                    className="bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:border-green-400/30 transition-colors cursor-pointer group"
                    onClick={() => addToBudget(crop.id)}
                  >
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                      <div className="group-hover:scale-110 transition-transform shrink-0">
                        <CropIcon crop={crop} size="sm" />
                      </div>
                      <p className="font-bold text-zinc-900 dark:text-white text-xs sm:text-sm flex-1 min-w-0 truncate">{tc(crop)}</p>
                    </div>
                    <p className="font-mono text-green-500 font-bold text-lg">{formatPrice(crop.currentPrice)}</p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">{t('sections.clickToAdd')}</p>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
