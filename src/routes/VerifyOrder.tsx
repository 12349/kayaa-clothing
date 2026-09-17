import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { verifyOrder } from '../data/repository';
import { Order } from '../types';
import { BRAND_CONFIG } from '../config/brand';
import { VerifiedContactPanel } from '../components/common/VerifiedContactPanel';
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';

export const VerifyOrder: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('id') || '';
  const [orderIdInput, setOrderIdInput] = useState(initialQuery);
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<{
    attempted: boolean;
    valid: boolean;
    order?: Order;
    message: string;
  } | null>(null);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = orderIdInput.trim();
    if (!query) return;

    setIsVerifying(true);
    const res = await verifyOrder(query);
    setResult({
      attempted: true,
      valid: res.valid,
      order: res.order,
      message: res.message,
    });
    setIsVerifying(false);

    setSearchParams({ id: query });
  };

  // Auto-verify if ID provided in URL
  React.useEffect(() => {
    if (initialQuery) {
      verifyOrder(initialQuery).then((res) => {
        setResult({
          attempted: true,
          valid: res.valid,
          order: res.order,
          message: res.message,
        });
      });
    }
  }, [initialQuery]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-24">
      {/* Header */}
      <div className="border-b border-chalk-border dark:border-chalk-dark pb-6 text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 garment-label text-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-panna" />
          <span>CANONICAL ORDER AUTHENTICITY REGISTRY</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-jamun dark:text-kora">
          Verify an Order or Reference Code
        </h1>
        <p className="text-xs sm:text-sm text-jamun/75 dark:text-kora/75 leading-relaxed">
          Fraudsters frequently reply to comments on Kayaa’s Instagram posts with fake WhatsApp numbers. Before transferring money, verify the legitimacy of your order ID here.
        </p>
      </div>

      {/* Lookup Card */}
      <div className="bg-white dark:bg-jamun-surface border-2 border-chalk-border dark:border-chalk-dark rounded-lg p-6 sm:p-8 shadow-atelier space-y-6">
        <form onSubmit={handleVerify} className="space-y-4">
          <label htmlFor="verify-id-input" className="block text-xs font-semibold uppercase tracking-wider text-jamun dark:text-kora">
            Enter Kayaa Order ID (e.g. KY-2609-0042)
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-jamun/40 dark:text-kora/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="verify-id-input"
                type="text"
                required
                placeholder="KY-2609-XXXX"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value.toUpperCase())}
                className="w-full pl-10 pr-4 py-3 text-sm rounded bg-chalk-subtle dark:bg-chalk-dark border border-chalk-border dark:border-chalk-dark text-jamun dark:text-kora font-mono uppercase font-semibold focus:ring-1 focus:ring-panna"
              />
            </div>
            <button
              type="submit"
              disabled={isVerifying}
              className="py-3 px-6 bg-panna hover:bg-panna-emerald text-white rounded text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
            >
              {isVerifying ? 'Checking...' : 'Verify Authenticity'}
            </button>
          </div>
        </form>

        {/* Verification Result Display */}
        {result && result.attempted && (
          <div className="animate-in fade-in pt-4 border-t border-chalk-border/70 dark:border-chalk-dark">
            {result.valid && result.order ? (
              /* VALID OFFICIAL ORDER */
              <div className="bg-panna-pale/30 dark:bg-panna/10 border-2 border-panna/50 p-6 rounded-lg space-y-4">
                <div className="flex items-center gap-3 text-panna dark:text-panna-light">
                  <div className="w-10 h-10 rounded-full bg-panna text-white flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-lg text-jamun dark:text-kora">
                      Authentic Studio Order Verified
                    </h2>
                    <span className="text-xs font-mono font-semibold">
                      Registered to: {result.order.customer.fullName}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-jamun/80 dark:text-kora/80 leading-relaxed">
                  {result.message}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-white/70 dark:bg-jamun-surface/70 p-4 rounded border border-panna/20">
                  <div>
                    <span className="text-jamun/60 dark:text-kora/60 block text-[10px]">Order Date:</span>
                    <strong>{new Date(result.order.createdAt).toLocaleDateString()}</strong>
                  </div>
                  <div>
                    <span className="text-jamun/60 dark:text-kora/60 block text-[10px]">Production Status:</span>
                    <strong className="capitalize font-mono text-panna">
                      {result.order.status.replace('_', ' ')}
                    </strong>
                  </div>
                  <div>
                    <span className="text-jamun/60 dark:text-kora/60 block text-[10px]">Promised Dispatch:</span>
                    <strong>{new Date(result.order.dispatchByDate).toLocaleDateString()}</strong>
                  </div>
                  <div>
                    <span className="text-jamun/60 dark:text-kora/60 block text-[10px]">Payment Recorded:</span>
                    <strong className="capitalize">{result.order.paymentStatus.replace('_', ' ')}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <Link
                    to={`/order/${result.order.id}`}
                    className="text-xs font-semibold text-panna underline hover:text-panna-emerald"
                  >
                    View Public Order Tracking & Stepper →
                  </Link>
                </div>
              </div>
            ) : (
              /* FRAUD WARNING ALERT */
              <div className="bg-rose-50 dark:bg-rose-950/30 border-2 border-rose-500/60 p-6 rounded-lg space-y-4">
                <div className="flex items-start gap-3 text-rose-800 dark:text-rose-300">
                  <div className="w-10 h-10 rounded-full bg-rose-700 text-white flex items-center justify-center flex-shrink-0">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-lg">
                      Warning: Unverified or Fraudulent Reference Code
                    </h2>
                    <p className="text-xs mt-1 leading-relaxed text-rose-900 dark:text-rose-200">
                      {result.message}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white/80 dark:bg-jamun/80 rounded border border-rose-200 dark:border-rose-900 text-xs space-y-2 text-jamun dark:text-kora">
                  <div className="font-semibold text-rose-800 dark:text-rose-400">
                    How to protect yourself:
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-jamun/80 dark:text-kora/80">
                    <li>Kayaa’s only official phone number is <strong>{BRAND_CONFIG.officialWhatsAppNumber}</strong>.</li>
                    <li>Kayaa will never ask for advance UPI payments from random numbers left in Instagram comments.</li>
                    <li>Only place orders directly through this site to receive an authentic tracking slip.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Canonical Contact Reassurance */}
      <VerifiedContactPanel />
    </div>
  );
};
