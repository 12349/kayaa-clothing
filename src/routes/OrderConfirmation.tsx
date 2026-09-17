import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder, saveReview } from '../data/repository';
import { Order, OrderStatus } from '../types';
import { BRAND_CONFIG, getWhatsAppOrderLink } from '../config/brand';
import { useCurrency } from '../context/CurrencyContext';
import { VerifiedContactPanel } from '../components/common/VerifiedContactPanel';
import { FabricSwatchSvg } from '../components/common/FabricSwatchSvg';
import {
  CheckCircle2,
  Printer,
  FileText,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Clock,
  Scissors,
  Star,
  Sparkles,
  AlertCircle,
  Camera,
} from 'lucide-react';

export const OrderConfirmation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { formatPrice } = useCurrency();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // Review form states
  const [reviewRating, setReviewRating] = useState(5);
  const [fitVerdict, setFitVerdict] = useState<'too_tight' | 'perfect' | 'too_loose'>('perfect');
  const [fitAreaNotes, setFitAreaNotes] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!id) return;
    getOrder(id).then((ord) => {
      setOrder(ord);
      if (ord?.reviewSubmitted) setReviewSubmitted(true);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center animate-pulse">
        <div className="h-8 bg-chalk w-1/3 mx-auto rounded mb-4" />
        <div className="h-4 bg-chalk w-1/2 mx-auto rounded" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-display text-2xl text-jamun dark:text-kora">Order Not Found</h2>
        <p className="text-xs text-jamun/70 dark:text-kora/70">
          No official studio order matching ID &ldquo;{id}&rdquo; was found in our ledger.
        </p>
        <Link to="/verify" className="inline-block px-4 py-2 bg-jamun text-kora rounded text-xs">
          Go to Order Verification
        </Link>
      </div>
    );
  }

  const itemsSummary = order.items.map((i) => `${i.productName} (${i.size})`).join(', ');
  const whatsappUrl = getWhatsAppOrderLink(order.id, itemsSummary);

  const statusSteps: { key: OrderStatus; label: string }[] = [
    { key: 'payment_confirmed', label: 'Payment Confirmed' },
    { key: 'cutting', label: 'On Cutting Table' },
    { key: 'stitching', label: 'Hand-Stitching' },
    { key: 'finishing', label: 'Finishing & Gota' },
    { key: 'dispatched', label: 'Parcel Dispatched' },
    { key: 'delivered', label: 'Delivered' },
  ];

  const statusOrder: Record<OrderStatus, number> = {
    new: 0,
    payment_confirmed: 1,
    cutting: 2,
    stitching: 3,
    finishing: 4,
    dispatched: 5,
    delivered: 6,
  };

  const currentStepIndex = statusOrder[order.status];
  const isDelivered = order.status === 'delivered';

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order || order.items.length === 0) return;
    setSubmittingReview(true);

    const firstItem = order.items[0];

    try {
      await saveReview(firstItem.productId, {
        orderId: order.id,
        customerName: order.customer.fullName,
        sizeOrdered: firstItem.size === 'made-to-measure' ? 'Made-to-Measure Bespoke' : `Size ${firstItem.size}`,
        rating: reviewRating,
        fitVerdict,
        fitAreaNotes: fitAreaNotes.trim() || undefined,
        comment: reviewComment.trim(),
      });

      setReviewSubmitted(true);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-24">
      {/* Top Banner: Success & Canonical ID */}
      <div className="bg-white dark:bg-jamun-surface border-2 border-dashed border-panna p-6 sm:p-8 rounded-lg shadow-atelier space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-chalk-border/70 dark:border-chalk-dark pb-5">
          <div>
            <span className="inline-flex items-center gap-1.5 garment-label text-[10px] mb-2 bg-panna text-white border-panna">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>OFFICIAL ATELIER ORDER CONFIRMED</span>
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-jamun dark:text-kora">
              Thank You, {order.customer.fullName}
            </h1>
            <p className="text-xs text-jamun/70 dark:text-kora/70 mt-1">
              Your order has been recorded in Kayaa’s studio ledger and scheduled on the cutting calendar.
            </p>
          </div>

          <div className="bg-chalk-subtle dark:bg-chalk-dark p-3.5 rounded border border-chalk-border dark:border-chalk-dark text-right">
            <span className="text-[10px] text-jamun/60 dark:text-kora/60 block uppercase tracking-wider font-mono">
              Official Order ID
            </span>
            <span className="font-mono text-xl sm:text-2xl font-bold text-panna dark:text-panna-light tracking-wider">
              {order.id}
            </span>
          </div>
        </div>

        {/* WhatsApp Deep Link Pre-filled Action */}
        <div className="bg-panna-pale/30 dark:bg-panna/10 p-4 rounded border border-panna/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <span className="font-semibold text-jamun dark:text-kora flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-panna" />
              <span>One-Click WhatsApp Confirmation Link</span>
            </span>
            <p className="text-jamun/70 dark:text-kora/70">
              Message Kayaa directly with your order number and item summary pre-filled.
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-panna text-white rounded font-semibold text-xs hover:bg-panna-emerald transition-colors shadow-sm whitespace-nowrap"
          >
            <span>Open WhatsApp with Kayaa</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>

        {/* Action Buttons: Print Packing Slip / Worksheet */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            to={`/order/${order.id}/receipt`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-chalk-subtle dark:bg-chalk-dark border border-chalk-border dark:border-chalk-dark rounded text-xs font-semibold text-jamun dark:text-kora hover:bg-chalk"
          >
            <Printer className="w-3.5 h-3.5 text-gulab" />
            <span>Print Customer Receipt / Packing Slip</span>
          </Link>

          <Link
            to={`/order/${order.id}/worksheet`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-chalk-subtle dark:bg-chalk-dark border border-chalk-border dark:border-chalk-dark rounded text-xs font-semibold text-jamun dark:text-kora hover:bg-chalk"
          >
            <FileText className="w-3.5 h-3.5 text-gulab" />
            <span>View Studio Cutting Worksheet</span>
          </Link>
        </div>
      </div>

      {/* 2. Order Tracking Timeline Stepper */}
      <div className="bg-white dark:bg-jamun-surface border border-chalk-border dark:border-chalk-dark rounded-lg p-6 space-y-6 shadow-atelier">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-semibold text-base text-jamun dark:text-kora flex items-center gap-2">
            <Clock className="w-4 h-4 text-gulab" />
            <span>Studio Production & Dispatch Progress</span>
          </h2>
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-chalk dark:bg-chalk-dark text-jamun dark:text-kora uppercase">
            Status: {order.status.replace('_', ' ')}
          </span>
        </div>

        {/* Stepper track */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          {statusSteps.map((s, idx) => {
            const stepNum = statusOrder[s.key];
            const isCompleted = currentStepIndex >= stepNum;
            const isCurrent = currentStepIndex === stepNum;

            return (
              <div
                key={s.key}
                className={`p-3 rounded border text-center transition-all ${
                  isCurrent
                    ? 'border-panna bg-panna-pale/20 dark:bg-panna/10 text-panna dark:text-panna-light font-bold'
                    : isCompleted
                    ? 'border-chalk-border bg-chalk-subtle/50 text-jamun/80 dark:text-kora/80'
                    : 'border-chalk-border/40 text-jamun/30 dark:text-kora/30 bg-white/20'
                }`}
              >
                <span className="text-[10px] block font-mono">0{idx + 1}</span>
                <span className="text-xs leading-tight block mt-0.5">{s.label}</span>
              </div>
            );
          })}
        </div>

        {/* Promised Dates */}
        <div className="p-3 bg-chalk-subtle/70 dark:bg-chalk-dark/40 rounded text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-jamun/80 dark:text-kora/80">
          <div>
            <span>Promised Studio Dispatch: </span>
            <strong className="font-mono text-jamun dark:text-kora">
              {new Date(order.dispatchByDate).toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </strong>
          </div>
          <div>
            <span>Estimated Doorstep Delivery: </span>
            <strong className="font-mono text-panna dark:text-panna-light">
              {new Date(order.estimatedDeliveryDate).toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </strong>
          </div>
        </div>
      </div>

      {/* 3. Itemized Breakdown & Customer Tailoring Specs */}
      <div className="bg-white dark:bg-jamun-surface border border-chalk-border dark:border-chalk-dark rounded-lg p-6 space-y-5 shadow-atelier">
        <h2 className="font-display font-semibold text-base text-jamun dark:text-kora">
          Garment Specifications for This Order
        </h2>

        <div className="space-y-4 divide-y divide-chalk-border/60 dark:divide-chalk-dark">
          {order.items.map((item, idx) => (
            <div key={idx} className="pt-4 first:pt-0 flex flex-col sm:flex-row gap-4">
              <div className="w-20 h-24 rounded overflow-hidden bg-jamun flex-shrink-0">
                <FabricSwatchSvg art={item.art} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 space-y-1 text-xs">
                <div className="flex items-start justify-between">
                  <h3 className="font-display font-semibold text-sm text-jamun dark:text-kora">
                    {item.productName}
                  </h3>
                  <span className="font-mono font-bold text-sm text-jamun dark:text-kora">
                    {formatPrice(item.lineTotalInr)}
                  </span>
                </div>

                <p className="text-[11px] text-jamun/60 dark:text-kora/60">{item.fabric}</p>

                <div className="flex items-center gap-2 pt-1">
                  <span className="font-semibold text-jamun dark:text-kora">
                    {item.size === 'made-to-measure' ? 'Made-to-Measure Bespoke' : `Standard Size ${item.size}`}
                  </span>
                  <span className="text-jamun/50">· Qty: {item.quantity}</span>
                </div>

                {/* Print Measurements if M2M */}
                {item.measurements && (
                  <div className="mt-2 p-3 bg-chalk-subtle dark:bg-chalk-dark/60 rounded border border-chalk-border/70 text-[11px] grid grid-cols-2 sm:grid-cols-4 gap-2 text-jamun/80 dark:text-kora/80">
                    <div>Bust: <strong>{item.measurements.bust} {item.measurements.unit}</strong></div>
                    <div>Waist: <strong>{item.measurements.waist} {item.measurements.unit}</strong></div>
                    <div>Hips: <strong>{item.measurements.hips} {item.measurements.unit}</strong></div>
                    <div>Height: <strong>{item.measurements.height} {item.measurements.unit}</strong></div>
                    {item.measurements.blouseSleeveLength && (
                      <div>Sleeve: <strong>{item.measurements.blouseSleeveLength} {item.measurements.unit}</strong></div>
                    )}
                    {item.measurements.lehengaWaistToFloor && (
                      <div>Floor Lgth: <strong>{item.measurements.lehengaWaistToFloor} {item.measurements.unit}</strong></div>
                    )}
                    <div className="col-span-2 sm:col-span-4 text-[10px] text-jamun/60 flex gap-2">
                      {item.measurements.blousePadding && <span>• Padded Blouse</span>}
                      {item.measurements.fallAndPico && <span>• Fall & Pico</span>}
                      {item.measurements.petticoatNeeded && <span>• Inskirt</span>}
                    </div>
                  </div>
                )}

                {item.customNote && (
                  <p className="text-[11px] italic text-gulab-dark dark:text-gulab-light pt-1">
                    Customer note: &ldquo;{item.customNote}&rdquo;
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. POST-DELIVERY REVIEW UNLOCK FORM */}
      <div className="bg-white dark:bg-jamun-surface border border-chalk-border dark:border-chalk-dark rounded-lg p-6 space-y-4 shadow-atelier">
        <div className="flex items-center justify-between border-b border-chalk-border dark:border-chalk-dark pb-3">
          <h2 className="font-display font-semibold text-base text-jamun dark:text-kora flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500" />
            <span>Post-Delivery Fit Review</span>
          </h2>

          <span className="text-xs">
            {isDelivered ? (
              <span className="text-panna dark:text-panna-light font-semibold bg-panna-pale/30 px-2 py-0.5 rounded">
                Parcel Delivered · Feedback Unlocked
              </span>
            ) : (
              <span className="text-jamun/50 dark:text-kora/50 italic">
                Unlocks once parcel status is &ldquo;Delivered&rdquo;
              </span>
            )}
          </span>
        </div>

        {isDelivered ? (
          reviewSubmitted ? (
            <div className="p-4 bg-panna-pale/30 dark:bg-panna/10 border border-panna/30 rounded text-xs text-panna dark:text-panna-light space-y-1">
              <strong className="font-semibold block">Thank you for your fit feedback!</strong>
              <p>Your review will assist fellow shoppers on the product page and has been saved to your studio profile.</p>
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="space-y-4 pt-2 text-xs">
              <p className="text-jamun/80 dark:text-kora/80">
                How did your piece fit? Your feedback directly informs our tailor’s cutting adjustments for your next order.
              </p>

              {/* Star rating */}
              <div>
                <label className="block text-jamun dark:text-kora font-semibold mb-1">
                  Overall Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-amber-500 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-5 h-5 ${star <= reviewRating ? 'fill-current' : 'text-chalk-border'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Fit verdict toggle */}
              <div>
                <label className="block text-jamun dark:text-kora font-semibold mb-1">
                  Fit Verdict
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['too_tight', 'perfect', 'too_loose'] as const).map((verdict) => (
                    <button
                      key={verdict}
                      type="button"
                      onClick={() => setFitVerdict(verdict)}
                      className={`p-2 rounded border font-medium capitalize ${
                        fitVerdict === verdict
                          ? 'border-panna bg-panna text-white font-bold'
                          : 'border-chalk-border text-jamun dark:text-kora bg-chalk-subtle'
                      }`}
                    >
                      {verdict.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fit area notes (feeds back into customer profile if tight or loose!) */}
              <div>
                <label htmlFor="fit-area" className="block text-jamun dark:text-kora font-semibold mb-1">
                  Fit Details by Area (Chest, Armhole, Waist, Length)
                </label>
                <input
                  id="fit-area"
                  type="text"
                  placeholder="e.g. 'Chest fits beautifully, but sleeves were 0.5 inches longer than expected'"
                  value={fitAreaNotes}
                  onChange={(e) => setFitAreaNotes(e.target.value)}
                  className="w-full p-2 rounded border border-chalk-border dark:border-chalk-dark text-jamun dark:text-kora bg-white dark:bg-jamun-surface"
                />
              </div>

              <div>
                <label htmlFor="review-comment" className="block text-jamun dark:text-kora font-semibold mb-1">
                  Review Text & Experience
                </label>
                <textarea
                  id="review-comment"
                  rows={3}
                  required
                  placeholder="Share your thoughts on the fabric quality, stitching finish, and packaging..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full p-2 rounded border border-chalk-border dark:border-chalk-dark text-jamun dark:text-kora bg-white dark:bg-jamun-surface"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="px-5 py-2.5 bg-jamun dark:bg-kora text-kora dark:text-jamun rounded text-xs font-bold uppercase tracking-wider hover:bg-jamun-light"
              >
                {submittingReview ? 'Submitting...' : 'Publish Studio Review'}
              </button>
            </form>
          )
        ) : (
          <p className="text-xs text-jamun/60 dark:text-kora/60 italic">
            This order is currently undergoing tailoring. Once Kayaa completes finishing and delivery is marked complete, you will be invited to leave verified sizing feedback right here.
          </p>
        )}
      </div>

      {/* Verified Contact Panel */}
      <VerifiedContactPanel orderId={order.id} />
    </div>
  );
};
