import React, { useState, useEffect } from 'react';
import { BRAND_CONFIG, inToCm } from '../../config/brand';
import { Size } from '../../types';

export const MeasurementChart: React.FC = () => {
  const [unit, setUnit] = useState<'in' | 'cm'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kayaa_measure_unit');
      if (saved === 'cm' || saved === 'in') return saved;
    }
    return 'in';
  });

  const handleUnitChange = (newUnit: 'in' | 'cm') => {
    setUnit(newUnit);
    localStorage.setItem('kayaa_measure_unit', newUnit);
  };

  const sizes: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const val = (inches: number) => (unit === 'in' ? inches : inToCm(inches));

  return (
    <div className="bg-white dark:bg-jamun-surface border border-chalk-border dark:border-chalk-dark rounded-lg overflow-hidden shadow-atelier">
      {/* Unit switch bar */}
      <div className="p-4 bg-chalk-subtle dark:bg-chalk-dark border-b border-chalk-border dark:border-chalk-dark flex items-center justify-between">
        <div>
          <h3 className="font-display font-semibold text-base text-jamun dark:text-kora">
            Studio Standard Measurement Chart
          </h3>
          <p className="text-xs text-jamun/60 dark:text-kora/60">
            Standard cut measurements with 1.5&quot; internal tailoring margins
          </p>
        </div>

        <div className="inline-flex rounded border border-chalk-border dark:border-chalk-dark overflow-hidden text-xs">
          <button
            type="button"
            onClick={() => handleUnitChange('in')}
            className={`px-3 py-1 font-semibold transition-colors ${
              unit === 'in'
                ? 'bg-jamun text-kora'
                : 'bg-white dark:bg-jamun-surface text-jamun dark:text-kora hover:bg-chalk'
            }`}
          >
            Inches (&quot;)
          </button>
          <button
            type="button"
            onClick={() => handleUnitChange('cm')}
            className={`px-3 py-1 font-semibold transition-colors ${
              unit === 'cm'
                ? 'bg-jamun text-kora'
                : 'bg-white dark:bg-jamun-surface text-jamun dark:text-kora hover:bg-chalk'
            }`}
          >
            Centimetres (cm)
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-chalk/60 dark:bg-chalk-dark/80 text-jamun dark:text-kora border-b border-chalk-border dark:border-chalk-dark font-mono uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4 font-semibold">Size</th>
              <th className="py-3 px-4 font-semibold">Bust ({unit})</th>
              <th className="py-3 px-4 font-semibold">Waist ({unit})</th>
              <th className="py-3 px-4 font-semibold">Hips ({unit})</th>
              <th className="py-3 px-4 font-semibold">Shoulder ({unit})</th>
              <th className="py-3 px-4 font-semibold">Sleeve ({unit})</th>
              <th className="py-3 px-4 font-semibold">Garment Lgth ({unit})</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-chalk-border/50 dark:divide-chalk-dark text-jamun/90 dark:text-kora/90">
            {sizes.map((s) => {
              const row = BRAND_CONFIG.sizeChartInches[s];
              return (
                <tr key={s} className="hover:bg-chalk/30 dark:hover:bg-chalk-dark/30 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-jamun dark:text-kora text-sm bg-chalk-subtle/30 dark:bg-chalk-dark/30">
                    {s}
                  </td>
                  <td className="py-3 px-4 font-mono">{val(row.bust)}</td>
                  <td className="py-3 px-4 font-mono">{val(row.waist)}</td>
                  <td className="py-3 px-4 font-mono">{val(row.hips)}</td>
                  <td className="py-3 px-4 font-mono">{val(row.shoulder)}</td>
                  <td className="py-3 px-4 font-mono">{val(row.sleeveLength)}</td>
                  <td className="py-3 px-4 font-mono">{val(row.garmentLength)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-chalk-subtle/50 dark:bg-chalk-dark/40 border-t border-chalk-border/60 dark:border-chalk-dark text-[11px] text-jamun/70 dark:text-kora/70 flex items-center justify-between flex-wrap gap-2">
        <span>* All standard pieces are stitched with generous 1.5-inch side seam margins so you can easily alter them locally if your weight fluctuates.</span>
      </div>
    </div>
  );
};
