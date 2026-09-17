import React from 'react';
import { Link } from 'react-router-dom';
import { BRAND_CONFIG, getWhatsAppInquiryLink } from '../../config/brand';
import { ShieldCheck, MessageCircle, AlertTriangle, ExternalLink } from 'lucide-react';

interface VerifiedContactPanelProps {
  compact?: boolean;
  productName?: string;
  orderId?: string;
}

export const VerifiedContactPanel: React.FC<VerifiedContactPanelProps> = ({
  compact = false,
  productName,
  orderId,
}) => {
  const whatsappUrl = orderId
    ? `https://wa.me/${BRAND_CONFIG.officialWhatsAppDigits}?text=${encodeURIComponent(
        `Hello Kayaa, I am inquiring about my official order ${orderId}.`
      )}`
    : getWhatsAppInquiryLink(productName);

  if (compact) {
    return (
      <div className="bg-panna-pale/25 dark:bg-panna/10 border border-panna/30 rounded p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 text-panna dark:text-panna-light font-medium">
          <ShieldCheck className="w-4 h-4 flex-shrink-0" />
          <span>
            Official Studio Channel:{' '}
            <strong className="font-mono text-sm tracking-wide text-jamun dark:text-kora">
              {BRAND_CONFIG.officialWhatsAppNumber}
            </strong>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/verify"
            className="text-jamun dark:text-kora underline hover:text-panna transition-colors font-medium"
          >
            Verify Order ID
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-panna text-white rounded text-xs hover:bg-panna-emerald transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Chat Directly</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <section
      aria-labelledby="verified-channel-heading"
      className="my-8 relative overflow-hidden bg-chalk-subtle dark:bg-chalk-dark/60 border-2 border-dashed border-panna/40 p-6 md:p-8 rounded-lg"
    >
      {/* Selvedge thread marker along top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-panna via-panna-light to-panna" />

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-panna text-white text-xs font-medium tracking-wide mb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>CANONICAL ATELIER CHANNEL</span>
          </div>

          <h3
            id="verified-channel-heading"
            className="font-display text-xl md:text-2xl text-jamun dark:text-kora mb-2 font-medium"
          >
            Protecting You from Instagram Impersonators
          </h3>

          <p className="text-sm text-jamun/80 dark:text-kora/80 leading-relaxed mb-4">
            &ldquo;{BRAND_CONFIG.antiFraudStatement}&rdquo;
          </p>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-jamun-light dark:text-kora-silk/70">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-panna" />
              Real orders generate an encrypted order slip
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-panna" />
              Check any reference code at <strong className="font-mono text-jamun dark:text-kora">/verify</strong>
            </span>
          </div>
        </div>

        {/* Right Action Callout */}
        <div className="flex-shrink-0 flex flex-col items-start md:items-end justify-center bg-white/70 dark:bg-jamun-surface/70 p-5 rounded border border-panna/20 min-w-[240px]">
          <div className="text-[11px] text-jamun/60 dark:text-kora/60 uppercase tracking-wider mb-1">
            Our Only WhatsApp Number
          </div>
          <div className="font-mono font-bold text-lg md:text-xl text-panna dark:text-panna-light mb-3">
            {BRAND_CONFIG.officialWhatsAppNumber}
          </div>

          <div className="w-full flex flex-col gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-panna text-white rounded text-sm font-medium hover:bg-panna-emerald transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Message Kayaa</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>

            <Link
              to="/verify"
              className="w-full text-center text-xs py-1.5 text-jamun dark:text-kora hover:underline"
            >
              Have a code? Verify Order Legitimacy
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
