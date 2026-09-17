import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listProducts } from '../data/repository';
import { Product } from '../types';
import { ProductCard } from '../components/shop/ProductCard';
import { VerifiedContactPanel } from '../components/common/VerifiedContactPanel';
import { StitchBorder } from '../components/common/StitchBorder';
import { BRAND_CONFIG } from '../config/brand';
import { Scissors, ShieldCheck, Sparkles, Clock, Heart, ArrowRight } from 'lucide-react';

export const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listProducts().then((products) => {
      // Pick 4 standout pieces representing different techniques
      setFeaturedProducts(products.slice(0, 4));
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-16 pb-20">
      {/* 1. QUIET, EDITORIAL HERO (Restrained boldness, material craft focus) */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-chalk-border/70 dark:border-chalk-dark bg-kora-silk/40 dark:bg-chalk-dark/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Brand Declaration */}
            <div className="lg:col-span-7 space-y-6">
              {/* Garment Atelier Label */}
              <div className="inline-flex items-center gap-2 garment-label">
                <Scissors className="w-3.5 h-3.5 text-gulab" />
                <span>NEW DELHI HOME STUDIO · BESPOKE & SMALL BATCH</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-jamun dark:text-kora leading-[1.12]">
                One tailor. <br />
                Every stitch hand-cut <br />
                <span className="italic font-light text-gulab-dark dark:text-gulab-light">
                  to your measurements.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-jamun/80 dark:text-kora/80 max-w-xl leading-relaxed font-normal">
                Kayaa Clothing is a one-woman Indian womenswear atelier. From 24-kali anarkalis to wedding lehengas, every piece is drafted on the cutting table and tailored in limited batches from pure handloom silks.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/shop"
                  className="px-6 py-3.5 bg-jamun dark:bg-kora text-kora dark:text-jamun rounded text-xs uppercase tracking-widest font-bold hover:bg-jamun-light dark:hover:bg-chalk transition-all shadow-atelier"
                >
                  Explore Current Pieces
                </Link>
                <Link
                  to="/size-guide"
                  className="px-5 py-3.5 border border-jamun/30 dark:border-kora/30 rounded text-xs uppercase tracking-widest font-semibold hover:bg-chalk dark:hover:bg-jamun-surface text-jamun dark:text-kora transition-colors"
                >
                  Made-to-Measure Guide
                </Link>
              </div>

              {/* Atelier Trust signals */}
              <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-jamun/70 dark:text-kora/70 border-t border-chalk-border/60 dark:border-chalk-dark">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-panna" />
                  1.5&quot; In-seam Tailoring Margins
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-panna" />
                  Exact Delivery Dates Before Checkout
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-panna" />
                  Direct Studio WhatsApp
                </span>
              </div>
            </div>

            {/* Right: Atelier Studio Ethos Card */}
            <div className="lg:col-span-5">
              <div className="relative p-6 sm:p-8 bg-white dark:bg-jamun-surface border-2 border-dashed border-chalk-border dark:border-chalk-dark rounded-lg shadow-atelier">
                {/* Tailor's chalk note style */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-chalk-border/50 pb-3">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-jamun/60 dark:text-kora/60">
                      Studio Ledger #85K
                    </span>
                    <span className="text-[11px] font-medium text-panna dark:text-panna-light bg-panna-pale/40 dark:bg-panna/20 px-2 py-0.5 rounded">
                      Direct WhatsApp Verified
                    </span>
                  </div>

                  <blockquote className="font-display italic text-lg sm:text-xl text-jamun dark:text-kora leading-snug">
                    &ldquo;I do not mass-produce garments in anonymous factories. When you order from Kayaa, you are directly supporting handloom weavers across Bagru, Chanderi, and Kotah.&rdquo;
                  </blockquote>

                  <div className="pt-2 text-xs text-jamun/70 dark:text-kora/70 space-y-1">
                    <p className="font-semibold text-jamun dark:text-kora">
                      — Kayaa Sharma, Founder & Cutter
                    </p>
                    <p>85,000 community members on Instagram</p>
                  </div>

                  {/* Micro anti-impersonation notice */}
                  <div className="pt-3 border-t border-chalk-border/50 flex items-center justify-between text-[11px]">
                    <span className="text-jamun/60 dark:text-kora/60">Official orders issued at:</span>
                    <Link to="/verify" className="font-mono font-bold text-panna underline">
                      kayaaclothing.com/verify
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE TRUST LAYER: Canonical Anti-Impersonation Panel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <VerifiedContactPanel />
      </div>

      {/* 3. FEATURED STUDIO PIECES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-widest font-semibold text-gulab mb-1">
              Current Workbench Cuts
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-jamun dark:text-kora">
              Freshly Drafted in Studio
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs uppercase tracking-wider font-bold text-jamun dark:text-kora hover:text-gulab underline"
          >
            View all collection pieces
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[4/5] bg-chalk animate-pulse rounded" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* 4. THE ATELIER THREE-PILLAR PROMISE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StitchBorder color="thread" className="mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-chalk-subtle dark:bg-chalk-dark/40 p-6 rounded-lg border border-chalk-border/60 dark:border-chalk-dark space-y-3">
            <div className="w-9 h-9 rounded-full bg-jamun dark:bg-chalk text-kora dark:text-jamun flex items-center justify-center font-display font-bold">
              1
            </div>
            <h3 className="font-display text-lg font-semibold text-jamun dark:text-kora">
              Cut to Your Proportions
            </h3>
            <p className="text-xs text-jamun/80 dark:text-kora/80 leading-relaxed">
              Standard sizes often fail Indian silhouettes. Choose Made-to-Measure to provide your exact blouse sleeve length, lehenga waist-to-floor drop, and cup padding preferences.
            </p>
          </div>

          <div className="bg-chalk-subtle dark:bg-chalk-dark/40 p-6 rounded-lg border border-chalk-border/60 dark:border-chalk-dark space-y-3">
            <div className="w-9 h-9 rounded-full bg-jamun dark:bg-chalk text-kora dark:text-jamun flex items-center justify-center font-display font-bold">
              2
            </div>
            <h3 className="font-display text-lg font-semibold text-jamun dark:text-kora">
              Pure Handloom & Vegetable Dyes
            </h3>
            <p className="text-xs text-jamun/80 dark:text-kora/80 leading-relaxed">
              We work exclusively with unbleached kora silks, Ambar Charkha khadi, Bagru dabu prints, and certified Chanderi clusters. No synthetic polyesters or printed nylon blends.
            </p>
          </div>

          <div className="bg-chalk-subtle dark:bg-chalk-dark/40 p-6 rounded-lg border border-chalk-border/60 dark:border-chalk-dark space-y-3">
            <div className="w-9 h-9 rounded-full bg-panna text-white flex items-center justify-center font-display font-bold">
              3
            </div>
            <h3 className="font-display text-lg font-semibold text-jamun dark:text-kora">
              Honest Dispatch Dates
            </h3>
            <p className="text-xs text-jamun/80 dark:text-kora/80 leading-relaxed">
              Buying for a wedding or puja? We calculate guaranteed transit times for India (2–4 days) and overseas diaspora destinations before you confirm, with real-time WhatsApp updates.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
