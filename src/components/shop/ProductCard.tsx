import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { FabricSwatchSvg } from '../common/FabricSwatchSvg';
import { useCurrency } from '../../context/CurrencyContext';
import { Scissors, Clock, Sparkles } from 'lucide-react';

import { getAssetUrl } from '../../utils/assets';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { formatPrice } = useCurrency();

  // Stock calculations
  const stockValues = Object.values(product.sizeStock);
  const totalStock = stockValues.reduce((sum, count) => sum + count, 0);
  const isCompletelySoldOut = totalStock === 0;

  return (
    <article className="group flex flex-col bg-chalk-subtle dark:bg-chalk-dark border border-chalk-border dark:border-chalk-dark rounded overflow-hidden transition-shadow hover:shadow-atelier-lift">
      {/* Visual Canvas: Fabric Swatch */}
      <Link
        to={`/product/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden bg-jamun"
        aria-label={`View details of ${product.name}`}
      >
        {product.images && product.images.length > 0 ? (
          <div className="relative w-full h-full">
            <img
              src={getAssetUrl(product.images[0])}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-500 ${
                product.images.length > 1 ? 'group-hover:opacity-0' : 'group-hover:scale-105'
              }`}
              loading="lazy"
            />
            {product.images.length > 1 && (
              <img
                src={getAssetUrl(product.images[1])}
                alt={`${product.name} secondary angle`}
                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105"
                loading="lazy"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-jamun/60 via-transparent to-transparent opacity-60" />
          </div>
        ) : (
          <FabricSwatchSvg
            art={product.art}
            className="w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          {/* Honest Scarcity or Stock State */}
          {isCompletelySoldOut ? (
            product.madeToMeasure ? (
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-jamun/90 text-kora border border-gulab/40 flex items-center gap-1">
                <Scissors className="w-3 h-3 text-gulab-light" />
                <span>Made to order · ready in {product.customLeadDays}d</span>
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-900/90 text-white">
                Sold Out
              </span>
            )
          ) : totalStock <= 3 ? (
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-900/90 text-amber-100 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>Only {totalStock} left in studio</span>
            </span>
          ) : product.madeToMeasure ? (
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-kora/90 dark:bg-jamun/90 text-jamun dark:text-kora border border-chalk-border flex items-center gap-1">
              <Scissors className="w-2.5 h-2.5 text-gulab" />
              <span>Custom cut available</span>
            </span>
          ) : (
            <span />
          )}

          {/* Sale badge */}
          {product.salePriceInr && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gulab text-white uppercase tracking-wider">
              Special Cut
            </span>
          )}
        </div>

        {/* Bottom Swatch Info */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-kora/90 bg-jamun/75 backdrop-blur-sm px-2.5 py-1 rounded">
          <span className="truncate">{product.colourName}</span>
          <span className="font-mono text-[10px] opacity-80">{product.art.motif.toUpperCase()}</span>
        </div>
      </Link>

      {/* Details Container */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Fabric hint */}
          <div className="flex items-center justify-between text-[11px] text-jamun/60 dark:text-kora/60 mb-1">
            <span className="uppercase tracking-wider font-semibold">
              {product.category.replace('-', ' ')}
            </span>
            <span className="text-[10px]">
              Ready in {product.readyLeadDays}d
            </span>
          </div>

          <h3 className="font-display text-base font-semibold text-jamun dark:text-kora leading-snug line-clamp-1 group-hover:text-gulab-dark dark:group-hover:text-gulab transition-colors">
            <Link to={`/product/${product.slug}`}>{product.name}</Link>
          </h3>

          <p className="text-xs text-jamun/70 dark:text-kora/70 line-clamp-2 mt-1 leading-relaxed">
            {product.story}
          </p>
        </div>

        {/* Sizes availability line */}
        <div className="pt-2 border-t border-chalk-border/60 dark:border-chalk-dark flex items-center justify-between">
          <div className="flex items-center gap-1 text-[10px] font-mono">
            {(['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const).map((sz) => {
              const count = product.sizeStock[sz];
              const isAvailable = count > 0;
              return (
                <span
                  key={sz}
                  className={`px-1 py-0.5 rounded ${
                    isAvailable
                      ? 'text-jamun dark:text-kora font-semibold bg-chalk dark:bg-jamun-surface'
                      : 'text-jamun/30 dark:text-kora/30 line-through'
                  }`}
                  title={`${sz}: ${isAvailable ? `${count} available` : 'none left'}`}
                >
                  {sz}
                </span>
              );
            })}
          </div>

          {/* Pricing */}
          <div className="text-right">
            {product.salePriceInr ? (
              <div className="flex items-baseline gap-1.5 justify-end">
                <span className="text-xs line-through text-jamun/40 dark:text-kora/40 font-mono">
                  {formatPrice(product.priceInr)}
                </span>
                <span className="font-display font-semibold text-sm text-gulab-dark dark:text-gulab">
                  {formatPrice(product.salePriceInr)}
                </span>
              </div>
            ) : (
              <span className="font-display font-semibold text-sm text-jamun dark:text-kora">
                {formatPrice(product.priceInr)}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
