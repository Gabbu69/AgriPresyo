import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, Package, Plus, Minus, Trash2, Download } from 'lucide-react';
import type { Crop } from '../types';
import type { BudgetListItem } from '../types';
import { formatPrice } from '../lib/formatters';
import { CropIcon } from '../components/ui/CropIcon';

interface BudgetCalculatorViewProps {
  crops: Crop[];
  budgetItems: BudgetListItem[];
  budgetLimit: number;
  setBudgetLimit: (v: number) => void;
  toggleBudgetUnit: (cropId: string) => void;
  updateBudgetQty: (cropId: string, qty: number) => void;
  removeFromBudget: (cropId: string) => void;
  budgetStats: { totalCost: number; totalWeight: number };
}

export const BudgetCalculatorView: React.FC<BudgetCalculatorViewProps> = ({
  crops,
  budgetItems,
  budgetLimit,
  setBudgetLimit,
  toggleBudgetUnit,
  updateBudgetQty,
  removeFromBudget,
  budgetStats,
}) => {
  const { t } = useTranslation();
  const tc = (crop: { id: string; name: string }) => t(`crops.${crop.id}`, crop.name);

  const handleDownloadCSV = () => {
    if (budgetItems.length === 0) return;

    const headers = ['Crop,Category,Quantity,Unit,Weight (kg),Unit Price (php),Total Price (php)'];
    const rows = budgetItems.map((item) => {
      const crop = crops.find(c => c.id === item.cropId);
      if (!crop) return '';
      const weight = item.unit === 'kg' ? item.quantity : item.quantity * crop.weightPerUnit;
      const totalPrice = weight * crop.currentPrice;
      const cropName = t(`crops.${crop.id}`, crop.name).replace(/,/g, '');
      const category = t(`categories.${crop.category.toLowerCase()}`).replace(/,/g, '');

      return `${cropName},${category},${item.quantity},${item.unit},${weight.toFixed(2)},${crop.currentPrice},${totalPrice.toFixed(2)}`;
    });

    const csvContent = headers.concat(rows.filter(Boolean)).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `market-list-${new Date().toISOString().split('T')[0]}.csv`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
  <section
    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl sm:rounded-[40px] p-4 sm:p-6 lg:p-10 shadow-2xl relative overflow-hidden mt-8 sm:mt-12 mb-16 sm:mb-20"
    aria-label="Budget calculator"
  >
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400/50 to-transparent" />
    <div className="flex flex-col md:flex-row md:items-start lg:items-center justify-between gap-4 sm:gap-8 mb-6 sm:mb-10">
      <div>
        <div className="flex items-center gap-4 mb-2">
          <div className="bg-green-400 p-2 rounded-xl">
            <Calculator className="text-black" size={28} aria-hidden />
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-zinc-900 dark:text-white">{t('sections.smartAssetProjection')}</h2>
        </div>
        <p className="text-zinc-500 dark:text-zinc-400 font-medium">{t('sections.autoCalculating')}</p>
      </div>
      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 w-full sm:w-auto flex-wrap justify-end">
        {budgetItems.length > 0 && (
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 px-4 py-3 sm:py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl sm:rounded-3xl font-black text-[10px] sm:text-xs uppercase tracking-widest transition-colors shadow-lg shadow-emerald-500/20"
          >
            <Download size={16} />
            Download CSV
          </button>
        )}
        <div className="flex items-center gap-3 sm:gap-4 bg-zinc-50 dark:bg-zinc-800/50 p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-zinc-200 dark:border-zinc-700 shadow-inner w-full sm:w-auto">
          <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">{t('sections.liquidity')}</span>
          <input
            type="number"
            className="bg-transparent w-32 text-right font-mono text-2xl font-bold focus:outline-none text-green-600"
            value={budgetLimit}
            onChange={(e) => setBudgetLimit(Number(e.target.value))}
            aria-label="Budget limit in pesos"
            min={0}
          />
          <span className="text-sm font-black text-zinc-400 font-mono">₱</span>
        </div>
      </div>
    </div>

    {budgetItems.length === 0 ? (
      <div className="text-center py-12 sm:py-20 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl sm:rounded-[32px] bg-zinc-50 dark:bg-zinc-900/50">
        <Package className="mx-auto text-zinc-400 dark:text-zinc-600 mb-6" size={64} aria-hidden />
        <p className="text-zinc-400 dark:text-zinc-500 text-xl font-black uppercase tracking-tighter">
          {t('sections.noActiveTrades')}
        </p>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-2">
          {t('sections.selectProduce')}
        </p>
      </div>
    ) : (
      <div className="space-y-6">
        <div className="grid gap-4">
          {budgetItems.map((item) => {
            const crop = crops.find((c) => c.id === item.cropId)!;
            const weight =
              item.unit === 'kg' ? item.quantity : item.quantity * crop.weightPerUnit;
            const displayQty = item.unit === 'kg' ? `${item.quantity}kg` : `${item.quantity} units`;
            const stepVal = item.unit === 'kg' ? 0.1 : 1;
            const minVal = item.unit === 'kg' ? 0.1 : 1;
            return (
              <div
                key={item.cropId}
                className="flex flex-col sm:flex-row sm:items-center justify-between bg-zinc-50 dark:bg-zinc-800 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-zinc-200 dark:border-zinc-700 transition-colors group gap-4"
              >
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="group-hover:scale-110 transition-transform">
                    <CropIcon crop={crop} size="md" />
                  </div>
                  <div>
                    <h4 className="font-black text-base sm:text-xl text-zinc-900 dark:text-white">
                      {tc(crop)}
                    </h4>
                    <div className="flex gap-3 text-xs font-mono font-bold text-zinc-500 uppercase tracking-tight">
                      <span>{displayQty}</span>
                      <span>≈ {weight.toFixed(2)}kg</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-8 flex-wrap sm:flex-nowrap">
                  <button
                    onClick={() => toggleBudgetUnit(item.cropId)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all shadow-sm ${
                      item.unit === 'kg'
                        ? 'bg-blue-500/10 text-blue-500 border-blue-500/30'
                        : 'bg-green-500/10 text-green-500 border-green-500/30'
                    }`}
                  >
                    {item.unit === 'qty' ? 'QTY' : 'KG'}
                  </button>
                  <div className="flex items-center gap-2 sm:gap-3 bg-white dark:bg-zinc-900 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
                    <button
                      onClick={() =>
                        updateBudgetQty(
                          item.cropId,
                          item.unit === 'kg'
                            ? Number((item.quantity - stepVal).toFixed(2))
                            : item.quantity - 1
                        )
                      }
                      className="p-1.5 sm:p-2 text-zinc-400 dark:text-zinc-500 hover:bg-red-500/10 hover:text-red-500 transition-all rounded-lg"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      step={item.unit === 'kg' ? '0.1' : '1'}
                      min="0"
                      className="w-16 sm:w-20 text-center text-sm sm:text-lg font-black font-mono text-zinc-900 dark:text-white bg-transparent outline-none focus:bg-zinc-100 dark:focus:bg-zinc-800 p-1 focus:ring-2 focus:ring-green-400/50 rounded-lg transition-all appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      style={{ MozAppearance: 'textfield' }}
                      value={item.quantity || ''}
                      onChange={(e) => {
                        if (e.target.value === '') {
                          updateBudgetQty(item.cropId, 0);
                        } else {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val) && val >= 0) {
                            updateBudgetQty(item.cropId, item.unit === 'kg' ? Number(val.toFixed(2)) : Math.floor(val));
                          }
                        }
                      }}
                      onBlur={(e) => {
                         if (!item.quantity || item.quantity <= 0) {
                             updateBudgetQty(item.cropId, item.unit === 'kg' ? 0.1 : 1);
                         }
                      }}
                    />
                    <button
                      onClick={() =>
                        updateBudgetQty(
                          item.cropId,
                          item.unit === 'kg'
                            ? Number((item.quantity + stepVal).toFixed(2))
                            : item.quantity + 1
                        )
                      }
                      className="p-1.5 sm:p-2 text-zinc-400 dark:text-zinc-500 hover:bg-green-400/10 hover:text-green-500 transition-all rounded-lg"
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="text-right flex-1 sm:w-32 sm:flex-none">
                    <p className="font-mono text-lg sm:text-2xl font-bold text-zinc-900 dark:text-white">
                      {formatPrice(weight * crop.currentPrice)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromBudget(item.cropId)}
                    className="text-zinc-400 dark:text-zinc-500 hover:text-red-500 transition-all p-2 sm:p-3"
                    aria-label="Remove from budget"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-[32px] border border-zinc-200 dark:border-zinc-700 mt-6 sm:mt-10 shadow-inner">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-10">
            <div className="text-center md:text-left flex-1">
              <p className="text-xs text-zinc-400 uppercase font-black tracking-widest mb-2">
                {t('sections.totalProjected')}
              </p>
              <div className="flex items-baseline gap-4">
                <span className="text-lg sm:text-2xl font-black text-zinc-400 font-mono">
                  {budgetStats.totalWeight.toFixed(2)}kg
                </span>
                <span className="text-3xl sm:text-4xl lg:text-6xl font-black font-mono text-zinc-900 dark:text-white tracking-tighter">
                  {formatPrice(budgetStats.totalCost)}
                </span>
              </div>
            </div>
            <div className="w-full max-w-lg bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="flex justify-between text-xs font-black uppercase mb-3">
                <span className="text-zinc-400">{t('sections.liquidityUsed')}</span>
                <span
                  className={
                    budgetStats.totalCost > budgetLimit ? 'text-red-500' : 'text-green-500'
                  }
                >
                  {Math.round((budgetStats.totalCost / budgetLimit) * 100)}%
                </span>
              </div>
              <div className="h-6 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden p-1 shadow-inner">
                <div
                  className={`h-full transition-all duration-1000 rounded-full ${
                    budgetStats.totalCost > budgetLimit
                      ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                      : 'bg-green-400 shadow-[0_0_20px_rgba(74,222,128,0.5)]'
                  }`}
                  style={{
                    width: `${Math.min(100, (budgetStats.totalCost / budgetLimit) * 100)}%`,
                  }}
                />
              </div>
              {budgetStats.totalCost > budgetLimit && (
                <p className="text-[10px] text-red-500 font-black uppercase mt-3 animate-pulse text-center">
                  {t('sections.overBudgetWarning')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    )}
  </section>
  );
};
