import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { createOrder } from '../data/repository';
import { BRAND_CONFIG } from '../config/brand';
import { ShippingAddress, PaymentMethod } from '../types';
import { VerifiedContactPanel } from '../components/common/VerifiedContactPanel';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Truck,
  AlertCircle,
  Clock,
  Sparkles,
  Lock,
} from 'lucide-react';

export const Checkout: React.FC = () => {
  const { items, subtotalInr, m2mSurchargeTotalInr, clearCart } = useCart();
  const { formatPrice, currency, isForeignCurrency } = useCurrency();
  const navigate = useNavigate();

  // Shipping Address Form State
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: '',
    phone: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  // Questions at order time
  const [occasion, setOccasion] = useState('');
  const [neededByDate, setNeededByDate] = useState('');
  const [fitConcerns, setFitConcerns] = useState('');
  const [referralSource, setReferralSource] = useState<'instagram_post' | 'instagram_dm' | 'friend_family' | 'google' | 'other'>('instagram_post');
  const [referralDetails, setReferralDetails] = useState('');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Determine shipping zone config
  const isIndia = address.country === 'India' || !address.country;
  let zoneKey: keyof typeof BRAND_CONFIG.shippingZones = 'IN';
  if (address.country === 'United States') zoneKey = 'US';
  else if (address.country === 'United Kingdom') zoneKey = 'GB';
  else if (address.country === 'United Arab Emirates') zoneKey = 'AE';
  else if (address.country === 'Canada') zoneKey = 'CA';
  else if (address.country === 'Australia') zoneKey = 'AU';
  else if (!isIndia) zoneKey = 'ROW';

  const zone = BRAND_CONFIG.shippingZones[zoneKey];
  const shippingCostInr = zone.costInr;

  // COD restrictions: India only AND disabled if M2M order > threshold (₹4,000)
  const isM2mOverThreshold = m2mSurchargeTotalInr > 0 && (subtotalInr + m2mSurchargeTotalInr) > BRAND_CONFIG.shippingZones.IN.maxCodM2mThresholdInr;
  const isCodAllowed = isIndia && !isM2mOverThreshold;

  // Adjust payment method if COD was selected but becomes disallowed
  if (!isCodAllowed && paymentMethod === 'cod') {
    setPaymentMethod(isIndia ? 'upi' : 'card');
  }

  // Calculate totals
  const gstInr = Math.round((subtotalInr + m2mSurchargeTotalInr) * 0.05); // 5% apparel GST placeholder
  const grandTotalInr = subtotalInr + m2mSurchargeTotalInr + shippingCostInr + gstInr;

  // Calculate delivery & dispatch dates
  const maxCustomLeadDays = items.reduce(
    (max, it) => (it.size === 'made-to-measure' ? Math.max(max, 14) : Math.max(max, 3)),
    3
  );
  const today = new Date();
  const dispatchDate = new Date(today);
  dispatchDate.setDate(today.getDate() + maxCustomLeadDays);

  const deliveryDate = new Date(dispatchDate);
  deliveryDate.setDate(dispatchDate.getDate() + zone.transitMaxDays);

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-display text-2xl text-jamun dark:text-kora">No Items to Checkout</h2>
        <p className="text-xs text-jamun/70 dark:text-kora/70">
          Your studio bag has no pending garments.
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

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!address.fullName || !address.phone || !address.email || !address.addressLine1 || !address.city || !address.postalCode) {
      setErrorMsg('Please complete all required shipping fields so Kayaa can dispatch your parcel accurately.');
      return;
    }

    setIsSubmitting(true);

    try {
      const order = await createOrder({
        status: 'payment_confirmed',
        items,
        customer: address,
        occasion: occasion || undefined,
        neededByDate: neededByDate || undefined,
        fitConcerns: fitConcerns || undefined,
        referralSource,
        referralDetails: referralDetails || undefined,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'cod_pending' : 'paid',
        subtotalInr,
        m2mSurchargeTotalInr,
        shippingInr: shippingCostInr,
        gstPlaceholderInr: gstInr,
        grandTotalInr,
        paidAmountInr: paymentMethod === 'cod' ? 0 : grandTotalInr,
        dispatchByDate: dispatchDate.toISOString(),
        estimatedDeliveryDate: deliveryDate.toISOString(),
      });

      clearCart();
      navigate(`/order/${order.id}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error processing your order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-24">
      {/* Header */}
      <div className="border-b border-chalk-border dark:border-chalk-dark pb-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 garment-label text-[10px] mb-2">
            <Lock className="w-3 h-3 text-panna" />
            <span>DIRECT STUDIO GUEST CHECKOUT</span>
          </div>
          <h1 className="font-display text-3xl font-semibold text-jamun dark:text-kora">
            Complete Your Atelier Order
          </h1>
        </div>
        <div className="text-xs text-jamun/60 dark:text-kora/60 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-panna" />
          <span>Encrypted Official Channel</span>
        </div>
      </div>

      {/* Simulated Prototype Banner */}
      <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 rounded text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 flex-shrink-0 text-amber-600" />
          <span>
            <strong>Pitch Prototype Demo:</strong> No real bank charges or credit card debits will occur. Placing this order will issue a real tracking slip and decrement studio stock in the demo ledger.
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Guest Address & Order Questionnaire */}
        <div className="lg:col-span-7 space-y-8">
          {/* 1. Contact & Shipping Address */}
          <div className="bg-white dark:bg-jamun-surface border border-chalk-border dark:border-chalk-dark rounded-lg p-6 space-y-4 shadow-atelier">
            <h2 className="font-display font-semibold text-base text-jamun dark:text-kora flex items-center gap-2">
              <Truck className="w-4 h-4 text-gulab" />
              <span>1. Contact & Parcel Delivery Address</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="full-name" className="block text-xs font-semibold text-jamun dark:text-kora mb-1">
                  Full Name *
                </label>
                <input
                  id="full-name"
                  type="text"
                  required
                  placeholder="e.g. Diya Sengupta"
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  className="w-full p-2.5 text-xs rounded border border-chalk-border dark:border-chalk-dark text-jamun dark:text-kora bg-chalk-subtle/50 dark:bg-chalk-dark/40 focus:ring-1 focus:ring-gulab"
                />
              </div>

              <div>
                <label htmlFor="whatsapp-phone" className="block text-xs font-semibold text-jamun dark:text-kora mb-1">
                  WhatsApp Number (with country code) *
                </label>
                <input
                  id="whatsapp-phone"
                  type="tel"
                  required
                  placeholder="e.g. +91 98200 12345 or +44 7700 900123"
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  className="w-full p-2.5 text-xs rounded border border-chalk-border dark:border-chalk-dark text-jamun dark:text-kora bg-chalk-subtle/50 dark:bg-chalk-dark/40 focus:ring-1 focus:ring-gulab"
                />
                <span className="text-[10px] text-jamun/60 dark:text-kora/60 mt-0.5 block">
                  Used for official dispatch tracking and tailor fit questions.
                </span>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="email-address" className="block text-xs font-semibold text-jamun dark:text-kora mb-1">
                  Email Address *
                </label>
                <input
                  id="email-address"
                  type="email"
                  required
                  placeholder="e.g. diya.sengupta@example.com"
                  value={address.email}
                  onChange={(e) => setAddress({ ...address, email: e.target.value })}
                  className="w-full p-2.5 text-xs rounded border border-chalk-border dark:border-chalk-dark text-jamun dark:text-kora bg-chalk-subtle/50 dark:bg-chalk-dark/40 focus:ring-1 focus:ring-gulab"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="address-1" className="block text-xs font-semibold text-jamun dark:text-kora mb-1">
                  Street Address & Flat / House No. *
                </label>
                <input
                  id="address-1"
                  type="text"
                  required
                  placeholder="e.g. Flat 4B, Gulmohar Apartments, 12th Cross Road"
                  value={address.addressLine1}
                  onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                  className="w-full p-2.5 text-xs rounded border border-chalk-border dark:border-chalk-dark text-jamun dark:text-kora bg-chalk-subtle/50 dark:bg-chalk-dark/40 focus:ring-1 focus:ring-gulab"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-xs font-semibold text-jamun dark:text-kora mb-1">
                  City *
                </label>
                <input
                  id="city"
                  type="text"
                  required
                  placeholder="e.g. Mumbai or London"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full p-2.5 text-xs rounded border border-chalk-border dark:border-chalk-dark text-jamun dark:text-kora bg-chalk-subtle/50 dark:bg-chalk-dark/40"
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-xs font-semibold text-jamun dark:text-kora mb-1">
                  State / Province
                </label>
                <input
                  id="state"
                  type="text"
                  placeholder="e.g. Maharashtra or Greater London"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className="w-full p-2.5 text-xs rounded border border-chalk-border dark:border-chalk-dark text-jamun dark:text-kora bg-chalk-subtle/50 dark:bg-chalk-dark/40"
                />
              </div>

              <div>
                <label htmlFor="postal-code" className="block text-xs font-semibold text-jamun dark:text-kora mb-1">
                  PIN / Postcode *
                </label>
                <input
                  id="postal-code"
                  type="text"
                  required
                  placeholder="e.g. 400050 or W1U 4QY"
                  value={address.postalCode}
                  onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                  className="w-full p-2.5 text-xs rounded border border-chalk-border dark:border-chalk-dark text-jamun dark:text-kora bg-chalk-subtle/50 dark:bg-chalk-dark/40 font-mono"
                />
              </div>

              <div>
                <label htmlFor="country" className="block text-xs font-semibold text-jamun dark:text-kora mb-1">
                  Country *
                </label>
                <select
                  id="country"
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                  className="w-full p-2.5 text-xs rounded border border-chalk-border dark:border-chalk-dark text-jamun dark:text-kora bg-white dark:bg-jamun-surface font-medium"
                >
                  <option value="India">India (Complimentary Domestic Express)</option>
                  <option value="United Arab Emirates">United Arab Emirates (AED)</option>
                  <option value="United States">United States (USD)</option>
                  <option value="United Kingdom">United Kingdom (GBP)</option>
                  <option value="Canada">Canada (CAD)</option>
                  <option value="Australia">Australia (AUD)</option>
                  <option value="Other">Other International Destination</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. Order Context & Event Questionnaire */}
          <div className="bg-white dark:bg-jamun-surface border border-chalk-border dark:border-chalk-dark rounded-lg p-6 space-y-4 shadow-atelier">
            <h2 className="font-display font-semibold text-base text-jamun dark:text-kora flex items-center gap-2">
              <Clock className="w-4 h-4 text-gulab" />
              <span>2. Event Date & Tailor Context (Optional)</span>
            </h2>
            <p className="text-xs text-jamun/70 dark:text-kora/70">
              Kayaa reviews every order before cutting. Tell her if you are balancing event dates or fit concerns.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="event-occasion" className="block text-xs text-jamun/80 dark:text-kora/80 mb-1 font-medium">
                  What is the occasion?
                </label>
                <input
                  id="event-occasion"
                  type="text"
                  placeholder="e.g. Sangeet, Diwali Puja, Brother’s Wedding"
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full p-2 text-xs rounded border border-chalk-border dark:border-chalk-dark text-jamun dark:text-kora bg-chalk-subtle/50 dark:bg-chalk-dark/40"
                />
              </div>

              <div>
                <label htmlFor="needed-date" className="block text-xs text-jamun/80 dark:text-kora/80 mb-1 font-medium">
                  Date you need this by
                </label>
                <input
                  id="needed-date"
                  type="date"
                  value={neededByDate}
                  onChange={(e) => setNeededByDate(e.target.value)}
                  className="w-full p-2 text-xs rounded border border-chalk-border dark:border-chalk-dark text-jamun dark:text-kora bg-chalk-subtle/50 dark:bg-chalk-dark/40"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="fit-concerns" className="block text-xs text-jamun/80 dark:text-kora/80 mb-1 font-medium">
                  Any fit concerns from past Indian wear?
                </label>
                <textarea
                  id="fit-concerns"
                  rows={2}
                  placeholder="e.g. 'Blouse armholes are usually too tight on me' or 'I need high-neck coverage'"
                  value={fitConcerns}
                  onChange={(e) => setFitConcerns(e.target.value)}
                  className="w-full p-2 text-xs rounded border border-chalk-border dark:border-chalk-dark text-jamun dark:text-kora bg-chalk-subtle/50 dark:bg-chalk-dark/40"
                />
              </div>

              {/* Attribution: How did you find us */}
              <div className="sm:col-span-2 pt-2 border-t border-chalk-border/50">
                <label htmlFor="referral" className="block text-xs text-jamun/80 dark:text-kora/80 mb-1 font-medium">
                  How did you find Kayaa Clothing?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <select
                    id="referral"
                    value={referralSource}
                    onChange={(e) => setReferralSource(e.target.value as any)}
                    className="p-2 text-xs rounded border border-chalk-border dark:border-chalk-dark text-jamun dark:text-kora bg-white dark:bg-jamun-surface"
                  >
                    <option value="instagram_post">Instagram Reel / Post</option>
                    <option value="instagram_dm">Direct WhatsApp / Instagram DM</option>
                    <option value="friend_family">Friend or Family Recommendation</option>
                    <option value="google">Google Search</option>
                    <option value="other">Other</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Specific reel or post topic (optional)"
                    value={referralDetails}
                    onChange={(e) => setReferralDetails(e.target.value)}
                    className="p-2 text-xs rounded border border-chalk-border dark:border-chalk-dark text-jamun dark:text-kora bg-chalk-subtle/50 dark:bg-chalk-dark/40"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Payment Method Simulation */}
          <div className="bg-white dark:bg-jamun-surface border border-chalk-border dark:border-chalk-dark rounded-lg p-6 space-y-4 shadow-atelier">
            <h2 className="font-display font-semibold text-base text-jamun dark:text-kora flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gulab" />
              <span>3. Payment Selection (Simulated)</span>
            </h2>

            <div className="space-y-3">
              {/* UPI Option (Prominent for India) */}
              {isIndia && (
                <label
                  className={`flex items-start gap-3 p-3.5 rounded border-2 cursor-pointer transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-panna bg-panna-pale/20 dark:bg-panna/10 shadow-sm'
                      : 'border-chalk-border dark:border-chalk-dark hover:border-chalk'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="mt-1 text-panna focus:ring-panna"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-jamun dark:text-kora flex items-center gap-1.5">
                        <QrCode className="w-4 h-4 text-panna" />
                        <span>Instant UPI (GPay, PhonePe, Paytm, BHIM)</span>
                      </span>
                      <span className="text-[10px] uppercase tracking-wider font-bold bg-panna text-white px-2 py-0.5 rounded">
                        Recommended (60%+ of Orders)
                      </span>
                    </div>
                    <p className="text-xs text-jamun/70 dark:text-kora/70 mt-1">
                      Instantly issues your verified Order ID. You will receive an official QR mockup on the confirmation page.
                    </p>
                  </div>
                </label>
              )}

              {/* Card Option */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded border-2 cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'border-jamun dark:border-kora bg-chalk/30 dark:bg-chalk-dark/30 shadow-sm'
                    : 'border-chalk-border dark:border-chalk-dark hover:border-chalk'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="mt-1 text-jamun focus:ring-jamun"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-jamun dark:text-kora flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4" />
                      <span>Credit or Debit Card (Visa, Mastercard, Amex)</span>
                    </span>
                    <span className="text-xs font-mono text-jamun/50 dark:text-kora/50">3D Secure</span>
                  </div>
                  <p className="text-xs text-jamun/70 dark:text-kora/70 mt-1">
                    Global payment processing simulated without real debits.
                  </p>
                </div>
              </label>

              {/* Cash On Delivery (COD) Option */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded border-2 transition-all ${
                  !isCodAllowed
                    ? 'border-chalk-border/50 bg-chalk-subtle/30 opacity-60 cursor-not-allowed'
                    : paymentMethod === 'cod'
                    ? 'border-jamun dark:border-kora bg-chalk/30 dark:bg-chalk-dark/30 shadow-sm cursor-pointer'
                    : 'border-chalk-border dark:border-chalk-dark hover:border-chalk cursor-pointer'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  disabled={!isCodAllowed}
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1 text-jamun focus:ring-jamun"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-jamun dark:text-kora">
                      Cash on Delivery (COD)
                    </span>
                    {!isIndia ? (
                      <span className="text-[10px] text-rose-700 dark:text-rose-400 font-semibold">
                        India Only
                      </span>
                    ) : isM2mOverThreshold ? (
                      <span className="text-[10px] text-rose-700 dark:text-rose-400 font-semibold">
                        Unavailable for M2M &gt; ₹4,000
                      </span>
                    ) : (
                      <span className="text-xs text-jamun/50">Pay upon delivery</span>
                    )}
                  </div>
                  <p className="text-xs text-jamun/70 dark:text-kora/70 mt-1">
                    {!isIndia
                      ? 'Overseas parcels are dispatched via prepaid international courier.'
                      : isM2mOverThreshold
                      ? 'Because Made-to-Measure garments are individually cut to your body measurements, they cannot be restocked if rejected at delivery. Prepaid advance confirmation is required.'
                      : 'Pay cash to the courier agent when your parcel arrives in India.'}
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Confirmation CTA */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-chalk-subtle dark:bg-chalk-dark/60 border border-chalk-border dark:border-chalk-dark rounded-lg p-6 space-y-5 shadow-atelier">
            <h2 className="font-display font-semibold text-lg text-jamun dark:text-kora border-b border-chalk-border dark:border-chalk-dark pb-3">
              Order Specification
            </h2>

            {/* Item list mini */}
            <div className="space-y-3 divide-y divide-chalk-border/50 dark:divide-chalk-dark max-h-64 overflow-y-auto pr-1">
              {items.map((it, idx) => (
                <div key={idx} className="pt-2 first:pt-0 flex items-start justify-between gap-2 text-xs">
                  <div>
                    <strong className="text-jamun dark:text-kora block">{it.productName}</strong>
                    <span className="text-[11px] text-jamun/70 dark:text-kora/70">
                      {it.size === 'made-to-measure' ? 'Made-to-Measure' : `Size ${it.size}`} × {it.quantity}
                    </span>
                  </div>
                  <span className="font-mono font-semibold text-jamun dark:text-kora">
                    {formatPrice(it.lineTotalInr)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-3 border-t border-chalk-border dark:border-chalk-dark space-y-2 text-xs text-jamun/80 dark:text-kora/80">
              <div className="flex items-center justify-between">
                <span>Garment Subtotal</span>
                <span className="font-mono">{formatPrice(subtotalInr)}</span>
              </div>

              {m2mSurchargeTotalInr > 0 && (
                <div className="flex items-center justify-between text-gulab-dark dark:text-gulab-light">
                  <span>Custom Cut Surcharge</span>
                  <span className="font-mono">+{formatPrice(m2mSurchargeTotalInr)}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span>Shipping ({zone.name})</span>
                <span className="font-mono">
                  {shippingCostInr === 0 ? 'FREE (Domestic)' : `+${formatPrice(shippingCostInr)}`}
                </span>
              </div>

              <div className="flex items-center justify-between text-jamun/60 dark:text-kora/60">
                <span>Estimated GST (5% placeholder)</span>
                <span className="font-mono">+{formatPrice(gstInr)}</span>
              </div>

              {/* Grand Total */}
              <div className="pt-3 border-t border-chalk-border dark:border-chalk-dark flex items-baseline justify-between">
                <span className="font-display font-semibold text-base text-jamun dark:text-kora">
                  Amount Due
                </span>
                <div className="text-right">
                  <span className="font-display font-bold text-2xl text-jamun dark:text-kora">
                    {formatPrice(grandTotalInr)}
                  </span>
                  {isForeignCurrency && (
                    <span className="text-[10px] text-jamun/60 dark:text-kora/60 block">
                      (Billed as ₹{grandTotalInr.toLocaleString('en-IN')} INR at card issuer rate)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Dispatch & Delivery timeline badge */}
            <div className="p-3 rounded bg-white dark:bg-jamun-surface border border-chalk-border dark:border-chalk-dark text-xs space-y-1">
              <div className="flex items-center justify-between text-jamun dark:text-kora font-medium">
                <span>Promised Dispatch By:</span>
                <strong className="font-mono">
                  {dispatchDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                </strong>
              </div>
              <div className="flex items-center justify-between text-jamun/70 dark:text-kora/70">
                <span>Expected Doorstep Arrival:</span>
                <span className="font-medium text-panna dark:text-panna-light">
                  {deliveryDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded border border-rose-200">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-4 bg-jamun dark:bg-kora text-kora dark:text-jamun rounded text-xs uppercase tracking-widest font-bold hover:bg-jamun-light dark:hover:bg-chalk transition-all shadow-atelier disabled:opacity-50"
            >
              {isSubmitting ? 'Issuing Official Studio Order...' : `Confirm & Place Order — ${formatPrice(grandTotalInr)}`}
            </button>

            <div className="text-[11px] text-jamun/60 dark:text-kora/60 text-center">
              An official order number (KY-YYMM-XXXX) will be generated and verified against our studio ledger.
            </div>
          </div>

          <VerifiedContactPanel compact />
        </div>
      </form>
    </div>
  );
};
