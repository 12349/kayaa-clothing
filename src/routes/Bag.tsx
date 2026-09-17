import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { FabricSwatchSvg } from '../components/common/FabricSwatchSvg';
import { VerifiedContactPanel } from '../components/common/VerifiedContactPanel';
import { Trash2, Scissors, ArrowRight, ShieldCheck, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react';

export const Bag: React.FC = () => {
  const { items, removeFromCart, updateQuantity, subtotalInr, m2mSurchargeTotalInr, itemCount } = useCart();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  const [expandedM2M, setExpandedM2M] = useState<Record<number, boolean>>({});

  const toggleM2MDetails = (idx: number) => {
    setExpandedM2M((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const grandTotalInr = subtotalInr + m2mSurchargeTotalInr;

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-chalk dark:bg-chalk-dark flex items-center justify-center mx-auto text-jamun/50 dark:text-kora/50">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-jamun dark:text-kora">
          Your Studio Bag is Empty
        </h1>
        <p className="text-xs sm:text-sm text-jamun/70 dark:text-kora/70 max-w-md mx-auto">
          No pieces currently drafted for your parcel. Explore our current limited run of handloom silhouettes.
        </p>
        <Link
          to="/shop"
          className="inline-block px-6 py-3 bg-jamun dark:bg-kora text-kora dark:text-jamun rounded text-xs uppercase tracking-widest font-bold hover:bg-jamun-light dark:hover:bg-chalk transition-all"
        >
          Explore Catalogue Pieces
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-24">
      {/* Title */}
      <div className="border-b border-chalk-border dark:border-chalk-dark pb-4">
        <h1 className="font-display text-3xl font-semibold text-jamun dark:text-kora">
          Your Studio Bag ({itemCount} {itemCount === 1 ? 'Piece' : 'Pieces'})
        </h1>
        <p className="text-xs text-jamun/60 dark:text-kora/60 mt-1">
          Review your standard sizes and custom measurement specifications before guest checkout.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Item list */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item, idx) => {
            const isM2M = item.size === 'made-to-measure';
            const isExpanded = !!expandedM2M[idx];

            return (
              <div
                key={idx}
                className="bg-white dark:bg-jamun-surface border border-chalk-border dark:border-chalk-dark rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row gap-5 shadow-atelier"
              >
                {/* Fabric Swatch Thumbnail */}
                <Link
                  to={`/product/${item.slug}`}
                  className="w-24 h-28 sm:w-28 sm:h-32 flex-shrink-0 rounded overflow-hidden bg-jamun relative"
                >
                  <FabricSwatchSvg art={item.art} className="w-full h-full object-cover" />
                </Link>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display font-semibold text-base text-jamun dark:text-kora leading-snug">
                        <Link to={`/product/${item.slug}`} className="hover:text-gulab">
                          {item.productName}
                        </Link>
                      </h3>

                      <button
                        type="button"
                        onClick={() => removeFromCart(idx)}
                        className="text-jamun/40 dark:text-kora/40 hover:text-rose-600 p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-[11px] text-jamun/60 dark:text-kora/60 font-medium">
                      {item.fabric}
                    </p>

                    {/* Size & Cut badge */}
                    <div className="pt-2 flex flex-wrap items-center gap-2">
                      {isM2M ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-gulab/15 text-gulab-dark dark:text-gulab-light border border-gulab/30">
                          <Scissors className="w-3 h-3" />
                          <span>Made to Measure Cut (+{formatPrice(item.m2mSurchargeInr)})</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-chalk dark:bg-chalk-dark text-jamun dark:text-kora">
                          Standard Size {item.size}
                        </span>
                      )}

                      {/* Custom note indicator */}
                      {item.customNote && (
                        <span className="text-[11px] italic text-jamun/70 dark:text-kora/70 bg-chalk-subtle dark:bg-chalk-dark/40 px-2 py-0.5 rounded">
                          &ldquo;{item.customNote}&rdquo;
                        </span>
                      )}
                    </div>

                    {/* Made to Measure Specs Drawer */}
                    {isM2M && item.measurements && (
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => toggleM2MDetails(idx)}
                          className="text-xs text-gulab underline flex items-center gap-1 font-medium"
                        >
                          <span>{isExpanded ? 'Hide' : 'Review'} submitted measurements</span>
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>

                        {isExpanded && (
                          <div className="mt-2 p-3 bg-chalk-subtle dark:bg-chalk-dark/60 rounded border border-chalk-border/80 dark:border-chalk-dark text-[11px] grid grid-cols-2 sm:grid-cols-3 gap-2 text-jamun/80 dark:text-kora/80">
                            <div>
                              <span className="text-jamun/50 dark:text-kora/50 block">Bust:</span>
                              <strong>{item.measurements.bust} {item.measurements.unit}</strong>
                            </div>
                            <div>
                              <span className="text-jamun/50 dark:text-kora/50 block">Waist:</span>
                              <strong>{item.measurements.waist} {item.measurements.unit}</strong>
                            </div>
                            <div>
                              <span className="text-jamun/50 dark:text-kora/50 block">Hips:</span>
                              <strong>{item.measurements.hips} {item.measurements.unit}</strong>
                            </div>
                            <div>
                              <span className="text-jamun/50 dark:text-kora/50 block">Height:</span>
                              <strong>{item.measurements.height} {item.measurements.unit}</strong>
                            </div>
                            {item.measurements.blouseSleeveLength && (
                              <div>
                                <span className="text-jamun/50 dark:text-kora/50 block">Sleeve:</span>
                                <strong>{item.measurements.blouseSleeveLength} {item.measurements.unit}</strong>
                              </div>
                            )}
                            {item.measurements.lehengaWaistToFloor && (
                              <div>
                                <span className="text-jamun/50 dark:text-kora/50 block">Floor Lgth:</span>
                                <strong>{item.measurements.lehengaWaistToFloor} {item.measurements.unit}</strong>
                              </div>
                            )}
                            <div className="col-span-2 sm:col-span-3 pt-1 border-t border-chalk-border/40 flex flex-wrap gap-2 text-[10px]">
                              {item.measurements.blousePadding && <span className="bg-white dark:bg-jamun px-1.5 py-0.5 rounded">Padded Blouse</span>}
                              {item.measurements.fallAndPico && <span className="bg-white dark:bg-jamun px-1.5 py-0.5 rounded">Fall & Pico</span>}
                              {item.measurements.petticoatNeeded && <span className="bg-white dark:bg-jamun px-1.5 py-0.5 rounded">Inskirt included</span>}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Quantity & Line Total */}
                  <div className="pt-3 border-t border-chalk-border/50 dark:border-chalk-dark flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-jamun/60 dark:text-kora/60">Qty:</span>
                      <div className="inline-flex items-center border border-chalk-border dark:border-chalk-dark rounded bg-chalk-subtle dark:bg-chalk-dark">
                        <button
                          type="button"
                          onClick={() => updateQuantity(idx, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs hover:bg-chalk"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-2 font-mono font-bold text-xs">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(idx, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs hover:bg-chalk"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-display font-bold text-sm text-jamun dark:text-kora">
                        {formatPrice(item.lineTotalInr)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Order Summary Card */}
        <div className="lg:col-span-4 bg-chalk-subtle dark:bg-chalk-dark/60 border border-chalk-border dark:border-chalk-dark rounded-lg p-6 space-y-6 shadow-atelier">
          <h2 className="font-display font-semibold text-lg text-jamun dark:text-kora border-b border-chalk-border dark:border-chalk-dark pb-3">
            Atelier Order Summary
          </h2>

          <div className="space-y-3 text-xs text-jamun/80 dark:text-kora/80">
            <div className="flex items-center justify-between">
              <span>Pieces Subtotal ({itemCount})</span>
              <span className="font-mono">{formatPrice(subtotalInr)}</span>
            </div>

            {m2mSurchargeTotalInr > 0 && (
              <div className="flex items-center justify-between text-gulab-dark dark:text-gulab-light">
                <span>Made to Measure Surcharges</span>
                <span className="font-mono">+{formatPrice(m2mSurchargeTotalInr)}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span>Estimated Shipping</span>
              <span className="text-panna dark:text-panna-light font-medium">Calculated at Checkout</span>
            </div>

            <div className="pt-3 border-t border-chalk-border dark:border-chalk-dark flex items-baseline justify-between">
              <span className="font-display font-semibold text-base text-jamun dark:text-kora">
                Grand Total
              </span>
              <span className="font-display font-bold text-xl text-jamun dark:text-kora">
                {formatPrice(grandTotalInr)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 px-4 bg-jamun dark:bg-kora text-kora dark:text-jamun rounded text-xs uppercase tracking-widest font-bold hover:bg-jamun-light dark:hover:bg-chalk transition-all shadow-atelier flex items-center justify-center gap-2"
          >
            <span>Proceed to Guest Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-[11px] text-jamun/60 dark:text-kora/60 space-y-1.5 pt-2 border-t border-chalk-border/50">
            <p className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-panna" />
              <span>Guest checkout: No account or password creation required.</span>
            </p>
            <p className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gulab" />
              <span>Official order ID generated instantly with WhatsApp tracking.</span>
            </p>
          </div>
        </div>
      </div>

      {/* Trust Panel */}
      <VerifiedContactPanel compact />
    </div>
  );
};
