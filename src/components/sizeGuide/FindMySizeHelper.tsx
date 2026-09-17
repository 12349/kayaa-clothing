import React, { useState } from 'react';
import { BRAND_CONFIG, inToCm } from '../../config/brand';
import { Size } from '../../types';
import { Sparkles, Scissors, Check, AlertTriangle } from 'lucide-react';

export const FindMySizeHelper: React.FC = () => {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  const [bust, setBust] = useState<string>('');
  const [waist, setWaist] = useState<string>('');
  const [hips, setHips] = useState<string>('');
  const [recommendation, setRecommendation] = useState<{
    bestSize?: Size;
    isBetween?: boolean;
    betweenSizes?: [Size, Size];
    recommendM2M: boolean;
    reason: string;
  } | null>(null);

  const calculateSize = (e: React.FormEvent) => {
    e.preventDefault();
    const bIn = unit === 'in' ? parseFloat(bust) : parseFloat(bust) / 2.54;
    const wIn = unit === 'in' ? parseFloat(waist) : parseFloat(waist) / 2.54;
    const hIn = unit === 'in' ? parseFloat(hips) : parseFloat(hips) / 2.54;

    if (!bIn || !wIn || !hIn) return;

    // Helper: find closest size for a given dimension
    const getDimensionSize = (val: number, dim: 'bust' | 'waist' | 'hips'): Size => {
      const sizes: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
      let closest: Size = 'M';
      let minDiff = 999;
      sizes.forEach((s) => {
        const diff = Math.abs(BRAND_CONFIG.sizeChartInches[s][dim] - val);
        if (diff < minDiff) {
          minDiff = diff;
          closest = s;
        }
      });
      return closest;
    };

    const bustSize = getDimensionSize(bIn, 'bust');
    const waistSize = getDimensionSize(wIn, 'waist');
    const hipSize = getDimensionSize(hIn, 'hips');

    const sizeOrder: Record<Size, number> = { XS: 0, S: 1, M: 2, L: 3, XL: 4, XXL: 5 };
    const sizes = [bustSize, waistSize, hipSize];
    const indices = sizes.map((s) => sizeOrder[s]);
    const maxDiff = Math.max(...indices) - Math.min(...indices);

    // If sizes across bust, waist, hips diverge by 2 or more sizes (e.g. S bust with L hips)
    if (maxDiff >= 2) {
      setRecommendation({
        recommendM2M: true,
        reason: `Your bust fits size ${bustSize}, but your hips align with size ${hipSize}. We strongly recommend our Made-to-Measure service so your blouse remains fitted without straining around the hips or waist.`,
      });
      return;
    }

    // Between sizes check
    const avgIndex = (indices[0] + indices[1] + indices[2]) / 3;
    const lower = Math.floor(avgIndex);
    const upper = Math.ceil(avgIndex);
    const sizeKeys: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    if (lower !== upper) {
      const s1 = sizeKeys[lower];
      const s2 = sizeKeys[upper];
      setRecommendation({
        isBetween: true,
        betweenSizes: [s1, s2],
        bestSize: s2, // Recommend larger size for tailoring leeway
        recommendM2M: false,
        reason: `You fall comfortably between ${s1} and ${s2}. We suggest ordering ${s2} — Kayaa stitches 1.5 inches of internal margin into every piece, making a micro-adjustment effortless.`,
      });
    } else {
      const matched = sizeKeys[lower];
      setRecommendation({
        bestSize: matched,
        recommendM2M: false,
        reason: `Your proportions align smoothly with our standard ${matched} studio pattern.`,
      });
    }
  };

  return (
    <div className="bg-chalk-subtle dark:bg-chalk-dark/70 border border-chalk-border dark:border-chalk-dark p-6 rounded-lg shadow-atelier">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="font-display font-semibold text-lg text-jamun dark:text-kora flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gulab" />
            <span>Find My Size Calculator</span>
          </h3>
          <p className="text-xs text-jamun/70 dark:text-kora/70">
            Enter your measurements to determine standard fit vs. custom atelier cut.
          </p>
        </div>

        {/* Unit toggle */}
        <div className="inline-flex rounded border border-chalk-border dark:border-chalk-dark overflow-hidden text-xs">
          <button
            type="button"
            onClick={() => setUnit('in')}
            className={`px-3 py-1 font-semibold ${
              unit === 'in' ? 'bg-jamun text-kora' : 'bg-white dark:bg-jamun-surface text-jamun dark:text-kora'
            }`}
          >
            Inches
          </button>
          <button
            type="button"
            onClick={() => setUnit('cm')}
            className={`px-3 py-1 font-semibold ${
              unit === 'cm' ? 'bg-jamun text-kora' : 'bg-white dark:bg-jamun-surface text-jamun dark:text-kora'
            }`}
          >
            CM
          </button>
        </div>
      </div>

      <form onSubmit={calculateSize} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div>
          <label htmlFor="calc-bust" className="block text-xs font-semibold text-jamun dark:text-kora mb-1">
            Bust ({unit})
          </label>
          <input
            id="calc-bust"
            type="number"
            step="0.5"
            required
            placeholder={unit === 'in' ? '35' : '89'}
            value={bust}
            onChange={(e) => setBust(e.target.value)}
            className="w-full p-2 text-sm rounded bg-white dark:bg-jamun-surface border border-chalk-border dark:border-chalk-dark text-jamun dark:text-kora"
          />
        </div>

        <div>
          <label htmlFor="calc-waist" className="block text-xs font-semibold text-jamun dark:text-kora mb-1">
            Waist ({unit})
          </label>
          <input
            id="calc-waist"
            type="number"
            step="0.5"
            required
            placeholder={unit === 'in' ? '29' : '74'}
            value={waist}
            onChange={(e) => setWaist(e.target.value)}
            className="w-full p-2 text-sm rounded bg-white dark:bg-jamun-surface border border-chalk-border dark:border-chalk-dark text-jamun dark:text-kora"
          />
        </div>

        <div>
          <label htmlFor="calc-hips" className="block text-xs font-semibold text-jamun dark:text-kora mb-1">
            Hips ({unit})
          </label>
          <input
            id="calc-hips"
            type="number"
            step="0.5"
            required
            placeholder={unit === 'in' ? '40' : '101'}
            value={hips}
            onChange={(e) => setHips(e.target.value)}
            className="w-full p-2 text-sm rounded bg-white dark:bg-jamun-surface border border-chalk-border dark:border-chalk-dark text-jamun dark:text-kora"
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-jamun dark:bg-kora text-kora dark:text-jamun rounded text-xs font-bold uppercase tracking-wider hover:bg-jamun-light dark:hover:bg-chalk transition-colors"
          >
            Calculate Recommendation
          </button>
        </div>
      </form>

      {/* Result Card */}
      {recommendation && (
        <div className="mt-5 p-4 rounded-lg bg-white dark:bg-jamun-surface border border-chalk-border dark:border-chalk-dark animate-in fade-in">
          {recommendation.recommendM2M ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gulab font-display font-semibold text-base">
                <Scissors className="w-4 h-4" />
                <span>Recommendation: Made-to-Measure Cut</span>
              </div>
              <p className="text-xs text-jamun/80 dark:text-kora/80 leading-relaxed">
                {recommendation.reason}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-panna font-display font-semibold text-base">
                <Check className="w-4 h-4" />
                <span>
                  Recommended Standard Size: <strong>{recommendation.bestSize}</strong>
                  {recommendation.isBetween && (
                    <span className="text-xs font-normal text-jamun/60 dark:text-kora/60 ml-2">
                      (Between {recommendation.betweenSizes?.[0]} and {recommendation.betweenSizes?.[1]})
                    </span>
                  )}
                </span>
              </div>
              <p className="text-xs text-jamun/80 dark:text-kora/80 leading-relaxed">
                {recommendation.reason}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
