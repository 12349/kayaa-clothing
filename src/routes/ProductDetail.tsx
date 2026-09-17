import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductBySlug, listReviews } from '../data/repository';
import { Product, Size, MeasurementProfile, Review } from '../types';
import { FabricSwatchSvg } from '../components/common/FabricSwatchSvg';
import { SizeSelector } from '../components/product/SizeSelector';
import { MeasurementForm } from '../components/product/MeasurementForm';
import { DeliveryEstimate } from '../components/product/DeliveryEstimate';
import { VerifiedContactPanel } from '../components/common/VerifiedContactPanel';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { BRAND_CONFIG, getWhatsAppInquiryLink } from '../config/brand';
import {
  Scissors,
  ShieldCheck,
  Star,
  CheckCircle2,
  Clock,
  Sparkles,
  ShoppingBag,
  ArrowLeft,
  MessageCircle,
  AlertCircle,
} from 'lucide-react';

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Selection states
  const [selectedSize, setSelectedSize] = useState<Size | 'made-to-measure' | null>(null);
  const [measurements, setMeasurements] = useState<MeasurementProfile>({
    unit: 'in',
    bust: 36,
    waist: 30,
    hips: 40,
    height: 65,
    blousePadding: true,
    fallAndPico: true,
    petticoatNeeded: false,
  });
  const [customNote, setCustomNote] = useState('');
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [emailNotify, setEmailNotify] = useState('');
  const [notifySuccess, setNotifySuccess] = useState(false);
  const [activeMedia, setActiveMedia] = useState<number | 'swatch'>(0);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getProductBySlug(slug).then((prod) => {
      setProduct(prod);
      if (prod) {
        // Auto-select first in-stock standard size, or M2M if none
        const availableSizes = (['XS', 'S', 'M', 'L', 'XL', 'XXL'] as Size[]).filter(
          (s) => prod.sizeStock[s] > 0
        );
        if (availableSizes.length > 0) {
          setSelectedSize(availableSizes[0]);
        } else if (prod.madeToMeasure) {
          setSelectedSize('made-to-measure');
        }

        listReviews(prod.id).then(setReviews);
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-pulse">
          <div className="lg:col-span-6 aspect-[4/5] bg-chalk rounded" />
          <div className="lg:col-span-6 space-y-4">
            <div className="h-8 bg-chalk w-3/4 rounded" />
            <div className="h-6 bg-chalk w-1/4 rounded" />
            <div className="h-24 bg-chalk rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-display text-2xl text-jamun dark:text-kora">Piece Not Found</h2>
        <p className="text-xs text-jamun/70 dark:text-kora/70">
          This atelier design might be archived or currently resting in the sketchbook.
        </p>
        <Link
          to="/shop"
          className="inline-block px-5 py-2.5 bg-jamun text-kora rounded text-xs font-semibold"
        >
          Return to Catalogue
        </Link>
      </div>
    );
  }

  const stockValues = Object.values(product.sizeStock);
  const totalStock = stockValues.reduce((a, b) => a + b, 0);
  const isAllSizesSoldOut = totalStock === 0;

  const isMadeToMeasureSelected = selectedSize === 'made-to-measure';
  const effectivePrice = product.salePriceInr || product.priceInr;
  const surcharge = isMadeToMeasureSelected ? product.madeToMeasurePremiumInr : 0;
  const totalPrice = effectivePrice + surcharge;

  const handleAddToCart = () => {
    if (!selectedSize) return;

    addToCart({
      productId: product.id,
      productName: product.name,
      slug: product.slug,
      fabric: product.fabric,
      art: product.art,
      size: selectedSize,
      measurements: isMadeToMeasureSelected ? measurements : undefined,
      customNote: customNote.trim() || undefined,
      quantity: 1,
      unitPriceInr: effectivePrice,
      m2mSurchargeInr: surcharge,
      lineTotalInr: totalPrice,
    });

    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailNotify) return;
    setNotifySuccess(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 pb-24">
      {/* Back breadcrumb */}
      <div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-xs text-jamun/70 dark:text-kora/70 hover:text-jamun dark:hover:text-kora font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Pieces</span>
        </Link>
      </div>

      {/* BOLD ATELIER WORKBENCH GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* LEFT CANVAS: Interactive Procedural Fabric Swatch & Garment Anatomy */}
        <div className="lg:col-span-6 space-y-6">
          <div className="relative aspect-[4/5] rounded-lg overflow-hidden border-2 border-dashed border-chalk-border dark:border-chalk-dark bg-jamun shadow-atelier-lift">
            {typeof activeMedia === 'number' && product.images && product.images[activeMedia] ? (
              <img
                src={product.images[activeMedia]}
                alt={`${product.name} view ${activeMedia + 1}`}
                className="w-full h-full object-cover animate-in fade-in duration-300"
              />
            ) : (
              <FabricSwatchSvg
                art={product.art}
                showMotifLabel
                className="w-full h-full object-cover"
              />
            )}

            {/* In-fabric Atelier Badge */}
            <div className="absolute top-4 left-4 garment-label text-xs shadow-md">
              <span>{product.colourName}</span>
            </div>

            {/* Direct Studio WhatsApp inquiry floating trigger */}
            <a
              href={getWhatsAppInquiryLink(product.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 right-4 inline-flex items-center gap-2 px-3 py-1.5 rounded bg-white/90 dark:bg-jamun/90 backdrop-blur-md text-jamun dark:text-kora text-xs font-semibold hover:bg-white shadow-sm border border-chalk-border transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-panna" />
              <span>Ask Kayaa about this piece</span>
            </a>
          </div>

          {/* Thumbnail Gallery & Switcher */}
          {product.images && product.images.length > 0 && (
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
              {product.images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveMedia(idx)}
                  className={`relative w-16 h-20 rounded overflow-hidden border-2 flex-shrink-0 transition-all ${
                    activeMedia === idx
                      ? 'border-gulab shadow-md scale-105'
                      : 'border-chalk-border opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`View photo ${idx + 1}`}
                >
                  <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}

              {/* Swatch Switcher Button */}
              <button
                type="button"
                onClick={() => setActiveMedia('swatch')}
                className={`relative w-16 h-20 rounded overflow-hidden border-2 flex-shrink-0 transition-all flex flex-col items-center justify-center p-1 text-[9px] font-mono text-center ${
                  activeMedia === 'swatch'
                    ? 'border-gulab shadow-md scale-105 bg-chalk'
                    : 'border-chalk-border opacity-70 hover:opacity-100 bg-chalk-subtle'
                }`}
                aria-label="View Handloom Fabric Weave Swatch"
              >
                <FabricSwatchSvg art={product.art} className="w-full h-10 mb-1 rounded" />
                <span className="leading-tight font-bold">WEAVE SWATCH</span>
              </button>
            </div>
          )}

          {/* Fabric Provenance & Craft Story Card */}
          <div className="p-5 bg-chalk-subtle dark:bg-chalk-dark/50 border border-chalk-border dark:border-chalk-dark rounded-lg space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-jamun dark:text-kora uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-gulab" />
              <span>Fabric & Technique Provenance</span>
            </div>
            <p className="text-xs text-jamun/80 dark:text-kora/80 leading-relaxed">
              {product.story}
            </p>
            <div className="pt-2 border-t border-chalk-border/50 dark:border-chalk-dark grid grid-cols-2 gap-3 text-[11px]">
              <div>
                <span className="text-jamun/60 dark:text-kora/60 block">Weave & Fiber:</span>
                <span className="font-semibold text-jamun dark:text-kora">{product.fabric}</span>
              </div>
              <div>
                <span className="text-jamun/60 dark:text-kora/60 block">Atelier Care:</span>
                <span className="font-semibold text-jamun dark:text-kora">{product.care}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT DETAILS: Interactive Customizer, Stock Calculator & Size Selection */}
        <div className="lg:col-span-6 space-y-7">
          {/* Title & Pricing Header */}
          <div className="border-b border-chalk-border dark:border-chalk-dark pb-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gulab uppercase tracking-widest">
                {product.category.replace('-', ' ')} · Studio Batch
              </span>

              {/* Scarcity badge */}
              {totalStock <= 3 && totalStock > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-900/10 dark:bg-amber-400/10 text-amber-800 dark:text-amber-300 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Only {totalStock} pieces left in studio
                </span>
              )}
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold text-jamun dark:text-kora leading-tight">
              {product.name}
            </h1>

            <p className="text-xs text-jamun/75 dark:text-kora/75 leading-relaxed">
              {product.description}
            </p>

            {/* Price display with Made to Measure breakdown */}
            <div className="pt-2 flex items-baseline gap-3">
              {product.salePriceInr ? (
                <>
                  <span className="text-base line-through text-jamun/40 dark:text-kora/40 font-mono">
                    {formatPrice(product.priceInr + surcharge)}
                  </span>
                  <span className="font-display text-2xl font-bold text-gulab-dark dark:text-gulab">
                    {formatPrice(totalPrice)}
                  </span>
                </>
              ) : (
                <span className="font-display text-2xl font-bold text-jamun dark:text-kora">
                  {formatPrice(totalPrice)}
                </span>
              )}

              {isMadeToMeasureSelected && (
                <span className="text-[11px] text-gulab-dark dark:text-gulab font-medium">
                  (includes +{formatPrice(product.madeToMeasurePremiumInr)} custom cut surcharge)
                </span>
              )}
            </div>
          </div>

          {/* Sold Out Completely Logic */}
          {isAllSizesSoldOut && !product.madeToMeasure ? (
            <div className="p-5 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 rounded-lg space-y-3">
              <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-semibold text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Currently Sold Out Across All Sizes</span>
              </div>
              <p className="text-xs text-rose-700 dark:text-rose-400">
                Kayaa weaves small runs. Enter your email below to be notified if a bolt of this silk is sourced again.
              </p>
              {notifySuccess ? (
                <div className="text-xs text-panna font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>You are on the atelier waitlist. We will notify you first.</span>
                </div>
              ) : (
                <form onSubmit={handleNotifySubmit} className="flex gap-2 pt-1">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={emailNotify}
                    onChange={(e) => setEmailNotify(e.target.value)}
                    className="flex-1 p-2 text-xs rounded border border-chalk-border dark:border-chalk-dark text-jamun dark:text-kora bg-white dark:bg-jamun-surface"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-jamun text-kora rounded text-xs font-semibold hover:bg-jamun-light"
                  >
                    Notify Me
                  </button>
                </form>
              )}
            </div>
          ) : (
            <>
              {/* Size Selector */}
              <SizeSelector
                product={product}
                selectedSize={selectedSize}
                onSelectSize={(s) => setSelectedSize(s)}
              />

              {/* Inline Made to Measure Form (only shown if M2M selected) */}
              {isMadeToMeasureSelected && (
                <MeasurementForm
                  category={product.category}
                  measurements={measurements}
                  onChange={setMeasurements}
                  customNote={customNote}
                  onCustomNoteChange={setCustomNote}
                />
              )}

              {/* Delivery Date Calculator (Real Dates, Shipping Zones) */}
              <DeliveryEstimate
                isMadeToMeasure={isMadeToMeasureSelected}
                readyLeadDays={product.readyLeadDays}
                customLeadDays={product.customLeadDays}
                capacityPerWeek={product.capacityPerWeek}
              />

              {/* Add to Bag CTA */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!selectedSize}
                  className="w-full py-4 px-6 bg-jamun dark:bg-kora text-kora dark:text-jamun rounded text-xs uppercase tracking-widest font-bold hover:bg-jamun-light dark:hover:bg-chalk transition-all shadow-atelier flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {isMadeToMeasureSelected
                      ? `Add Made-to-Measure Piece to Bag — ${formatPrice(totalPrice)}`
                      : `Add Size ${selectedSize} to Bag — ${formatPrice(totalPrice)}`}
                  </span>
                </button>

                {addedSuccess && (
                  <div className="p-3 bg-panna-pale/40 dark:bg-panna/20 border border-panna/30 rounded flex items-center justify-between text-xs text-panna dark:text-panna-light animate-in fade-in">
                    <span className="flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      Piece added to your studio bag!
                    </span>
                    <Link to="/bag" className="underline font-bold hover:text-jamun">
                      View Bag & Checkout →
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Canonical Verified Contact Notice for this product */}
          <VerifiedContactPanel compact productName={product.name} />
        </div>
      </div>

      {/* REVIEWS SECTION: Showing Size Ordered & Fit Verdict */}
      <section className="pt-10 border-t border-chalk-border dark:border-chalk-dark">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-6 gap-2">
          <div>
            <h3 className="font-display text-xl font-semibold text-jamun dark:text-kora">
              Customer Fit & Atelier Feedback
            </h3>
            <p className="text-xs text-jamun/70 dark:text-kora/70">
              Verified buyers report their ordered size and fit verdict
            </p>
          </div>
          <span className="text-xs font-mono text-jamun/60 dark:text-kora/60">
            {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
          </span>
        </div>

        {reviews.length === 0 ? (
          <div className="p-8 text-center bg-chalk-subtle dark:bg-chalk-dark/30 rounded border border-dashed border-chalk-border text-xs text-jamun/70 dark:text-kora/70">
            No reviews published yet for this piece. Order and be the first to share your fit review upon parcel delivery!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white dark:bg-jamun-surface border border-chalk-border dark:border-chalk-dark p-5 rounded-lg space-y-3 shadow-atelier"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-display font-semibold text-sm text-jamun dark:text-kora">
                      {rev.customerName}
                    </h4>
                    <span className="text-[11px] font-mono text-gulab font-semibold">
                      Ordered: {rev.sizeOrdered}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                {/* Fit Badge */}
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-panna-pale/30 dark:bg-panna/20 text-panna dark:text-panna-light text-[11px] font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>
                    Fit Verdict: {rev.fitVerdict === 'perfect' ? 'Perfect Tailored Fit' : rev.fitVerdict}
                  </span>
                </div>

                <p className="text-xs text-jamun/80 dark:text-kora/80 leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </p>

                {rev.fitAreaNotes && (
                  <p className="text-[11px] text-jamun/60 dark:text-kora/60 bg-chalk-subtle dark:bg-chalk-dark/40 p-2 rounded italic">
                    Fit Note: {rev.fitAreaNotes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
