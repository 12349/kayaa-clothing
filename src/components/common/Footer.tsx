import React from 'react';
import { Link } from 'react-router-dom';
import { BRAND_CONFIG } from '../../config/brand';
import { ShieldCheck, MessageCircle, Scissors, Sparkles } from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-jamun text-kora pt-16 pb-12 border-t-2 border-gulab/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Atelier Mission */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-display text-3xl font-bold tracking-tight text-kora">
                KAYAA
              </span>
              <p className="text-[10px] uppercase tracking-[0.25em] text-gulab-light font-semibold">
                One-Woman Home Studio
              </p>
            </Link>
            <p className="text-xs text-kora-silk/80 leading-relaxed">
              Every garment is patterned, cut, and stitched by Kayaa in our New Delhi studio. No factories, no deadstock — only small batch artisan textiles and individual bespoke cuts.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={BRAND_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-kora hover:text-gulab-light transition-colors py-1 px-2.5 rounded bg-white/5 border border-white/10"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>{BRAND_CONFIG.instagramHandle}</span>
              </a>
            </div>
          </div>

          {/* Col 2: The Trust & Canonical Contact */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-panna-light flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Official Channels</span>
            </h4>
            <div className="text-xs space-y-2 text-kora-silk/80">
              <p>
                <strong className="text-kora block mb-0.5">WhatsApp Only:</strong>
                <span className="font-mono text-panna-light font-bold text-sm">
                  {BRAND_CONFIG.officialWhatsAppNumber}
                </span>
              </p>
              <p className="text-[11px] text-kora-silk/60">
                Never accept payment requests from comments or unverified handles.
              </p>
              <Link
                to="/verify"
                className="inline-block text-xs text-kora underline hover:text-panna-light font-medium pt-1"
              >
                Verify Your Order ID →
              </Link>
            </div>
          </div>

          {/* Col 3: Studio & Measurement Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-gulab-light flex items-center gap-1.5">
              <Scissors className="w-4 h-4" />
              <span>Atelier Guidance</span>
            </h4>
            <ul className="text-xs space-y-2 text-kora-silk/80">
              <li>
                <Link to="/size-guide" className="hover:text-kora transition-colors">
                  Size Chart & How to Measure
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-kora transition-colors">
                  Studio Craft & Fabric Care
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-kora transition-colors">
                  All Current Studio Pieces
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-kora transition-colors text-kora-silk/40">
                  Studio Owner Login (PIN)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Studio Address & Registry */}
          <div className="space-y-3 text-xs text-kora-silk/80">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-kora">
              Studio Registry
            </h4>
            <p className="leading-relaxed">
              {BRAND_CONFIG.studioAddress}
            </p>
            <p className="text-[11px] text-kora-silk/60">
              GSTIN Placeholder: <span className="font-mono text-kora">{BRAND_CONFIG.gstinPlaceholder}</span>
            </p>
            <p className="text-[11px] text-kora-silk/60">
              Dispatches worldwide via DHL & India Post Express with real-time tracking.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-kora-silk/60">
          <p>© {new Date().getFullYear()} Kayaa Clothing. All bespoke designs crafted by hand.</p>
          <div className="flex items-center gap-4">
            <span>Prototype Demo (Simulated Checkout)</span>
            <span>·</span>
            <Link to="/verify" className="hover:text-kora">
              Anti-Impersonation Registry
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
