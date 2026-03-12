import React from 'react';
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
  const favoriteCrops = crops.filter((c) => favorites.includes(c.id));

  return (
    <div className="space-y-6 sm:space-y-8 pb-32 lg:pb-12 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" aria-hidden />
            <input
              type="search"
              placeholder="Search markets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-3 sm:py-4 pl-12 pr-4 sm:pr-6 focus:outline-none focus:ring-2 focus:ring-green-400/50 text-zinc-900 dark:text-white transition-all text-sm sm:text-lg shadow-xl"
              aria-label="Search commodities"
            />
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3 pb-2">
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
                {cat === 'All' ? 'All' : `${cat}s`}
              </button>
            ))}
            <div className="flex items-center gap-1 bg-zinc-100/80 dark:bg-zinc-800/80 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-inner overflow-x-auto scrollbar-hide ml-auto">
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
            <span className="text-green-400 font-bold text-xs uppercase tracking-widest">Market Top Gainer</span>
          </div>
          <div className="mt-4 relative z-10">
            <h4 className="text-xl sm:text-3xl font-black text-zinc-900 dark:text-white">
              {analyticsData.topGainer?.name || 'Loading...'}
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
            My Watchlist
            <span className="text-sm font-mono text-zinc-500 ml-2">{favoriteCrops.length} items</span>
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
                  <div>
                    <p className="font-bold text-zinc-900 dark:text-white text-sm">{crop.name}</p>
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
          Terminal Intelligence
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isInitialLoading ? (
            [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
          ) : filteredCrops.length === 0 ? (
            <div className="col-span-full">
              <EmptyState
                icon={Search}
                title="No Markets Found"
                subtitle="We couldn't find any commodities matching your current filters."
                action={{
                  label: 'Clear Filters',
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
                  className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-all group relative overflow-hidden shadow-lg hover:shadow-green-400/5 card-tilt stagger-item stagger-${Math.min((filteredCrops.indexOf(crop) % 6) + 1, 6)}`}
                  onClick={() => setSelectedCrop(crop)}
                >
                  <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
                    <span
                      className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-lg ${
                        season.inSeason ? 'bg-green-400/10 text-green-600' : 'bg-red-400/10 text-red-600'
                      }`}
                    >
                      {season.inSeason ? '🟢' : '🔴'} {season.label}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(crop.id);
                      }}
                      className={`p-1.5 rounded-lg transition-all ${
                        isFav ? 'text-red-500 bg-red-500/10' : 'text-zinc-400 hover:text-red-500 hover:bg-red-500/10'
                      }`}
                      aria-label={isFav ? 'Remove from watchlist' : 'Add to watchlist'}
                    >
                      <Heart size={14} fill={isFav ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  <div className="flex justify-between items-start relative z-10 mt-2">
                    <div className="flex items-center gap-4">
                      <div className="group-hover:scale-110 transition-transform">
                        <CropIcon crop={crop} size="lg" />
                      </div>
                      <div>
                        <h3 className="font-black text-zinc-900 dark:text-white text-lg leading-tight">{crop.name}</h3>
                        <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">{crop.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-xl font-bold text-zinc-900 dark:text-white">
                        {formatPrice(crop.currentPrice)}
                      </p>
                      <div
                        className={`flex items-center justify-end text-xs font-bold ${
                          crop.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}
                      >
                        {crop.change24h >= 0 ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        {Math.abs(crop.change24h)}%
                      </div>
                      {crop.lastUpdated && (
                        <p className="text-[9px] text-zinc-400 dark:text-zinc-600 font-mono mt-1 flex items-center justify-end gap-1">
                          <Clock size={9} aria-hidden /> {timeAgo(crop.lastUpdated)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-8 flex items-end justify-between relative z-10">
                    <Sparkline
                      data={crop.history}
                      color={crop.change24h >= 0 ? '#4ade80' : '#ef4444'}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToBudget(crop.id);
                      }}
                      className="bg-zinc-100 dark:bg-zinc-800 hover:bg-green-500 dark:hover:bg-green-500 hover:text-black p-4 rounded-2xl text-zinc-400 dark:text-zinc-500 hover:text-black dark:hover:text-black transition-all shadow-xl active:scale-90 border border-zinc-200 dark:border-zinc-700"
                      aria-label="Add to budget"
                    >
                      <Calculator size={22} />
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
                <h3 className="text-xl font-black uppercase tracking-tighter text-zinc-900">Suggested Basket</h3>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                  Best Value Picks Within ₱{budgetLimit}
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
                    <div className="flex items-center gap-3 mb-2">
                      <div className="group-hover:scale-110 transition-transform">
                        <CropIcon crop={crop} size="sm" />
                      </div>
                      <p className="font-bold text-zinc-900 dark:text-white text-sm">{crop.name}</p>
                    </div>
                    <p className="font-mono text-green-500 font-bold text-lg">{formatPrice(crop.currentPrice)}</p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">Click to add to budget</p>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
