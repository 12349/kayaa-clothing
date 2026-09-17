import React from 'react';
import { Size, Product } from '../../types';
import { useCurrency } from '../../context/CurrencyContext';
import { Scissors, AlertCircle } from 'lucide-react';

interface SizeSelectorProps {
  product: Product;
  selectedSize: Size | 'made-to-measure' | null;
  onSelectSize: (size: Size | 'made-to-measure') => void;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  product,
  selectedSize,
  onSelectSize,
}) => {
  const { formatPrice } = useCurrency();
  const sizes: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="space-y-4">
      {/* Standard Sizes Heading */}
      <div className="flex items-center justify-between">
        <label className="text-xs uppercase tracking-wider font-semibold text-jamun dark:text-kora">
          1. Select Size or Tailored Cut
        </label>
        <span className="text-xs text-jamun/60 dark:text-kora/60">
          Tailored in small studio batches
        </span>
      </div>

      {/* Size Pill Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {sizes.map((size) => {
          const stock = product.sizeStock[size];
          const isNoneLeft = stock === 0;
          const isSelected = selectedSize === size;

          return (
            <button
              key={size}
              type="button"
              disabled={isNoneLeft}
              onClick={() => onSelectSize(size)}
              className={`relative flex flex-col items-center justify-center p-2.5 rounded border text-center transition-all min-h-[54px] ${
                isSelected
                  ? 'border-jamun dark:border-kora bg-jamun dark:bg-kora text-kora dark:text-jamun font-bold shadow-sm'
                  : isNoneLeft
                  ? 'border-chalk-border/50 bg-chalk-subtle/40 dark:bg-chalk-dark/30 text-jamun/30 dark:text-kora/30 cursor-not-allowed'
                  : 'border-chalk-border dark:border-chalk-dark bg-white dark:bg-jamun-surface text-jamun dark:text-kora hover:border-gulab'
              }`}
              aria-label={`${size} - ${isNoneLeft ? 'None left' : `${stock} in stock`}`}
            >
              <span className={`text-sm ${isNoneLeft ? 'line-through' : ''}`}>
                {size}
              </span>
              <span className="text-[10px] tracking-tight mt-0.5">
                {isNoneLeft ? (
                  <span className="text-rose-700 dark:text-rose-400 font-medium">none left</span>
                ) : stock <= 2 ? (
                  <span className="text-amber-700 dark:text-amber-400 font-medium">only {stock} left</span>
                ) : (
                  <span className="opacity-70">{stock} in stock</span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Made to Measure Option Button */}
      {product.madeToMeasure && (
        <div className="pt-2">
          <button
            type="button"
            onClick={() => onSelectSize('made-to-measure')}
            className={`w-full p-3.5 rounded border-2 transition-all flex items-center justify-between text-left ${
              selectedSize === 'made-to-measure'
                ? 'border-gulab bg-gulab/10 dark:bg-gulab/15'
                : 'border-dashed border-chalk-border dark:border-chalk-dark hover:border-gulab/70 bg-white/50 dark:bg-jamun-surface/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gulab/20 flex items-center justify-center text-gulab-dark dark:text-gulab-light flex-shrink-0">
                <Scissors className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-jamun dark:text-kora flex items-center gap-2">
                  <span>Cut to My Exact Measurements</span>
                  <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 bg-gulab text-white rounded font-medium">
                    Bespoke
                  </span>
                </div>
                <p className="text-xs text-jamun/70 dark:text-kora/70">
                  Custom blouse padding, waist-to-floor height, sleeve adjustments
                </p>
              </div>
            </div>

            <div className="text-right flex-shrink-0 pl-3">
              <span className="text-xs font-semibold text-jamun dark:text-kora block">
                +{formatPrice(product.madeToMeasurePremiumInr)}
              </span>
              <span className="text-[10px] text-jamun/60 dark:text-kora/60">
                {product.customLeadDays}d tailoring
              </span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
