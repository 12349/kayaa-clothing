import React from 'react';
import { Link } from 'react-router-dom';
import { BRAND_CONFIG } from '../config/brand';
import { VerifiedContactPanel } from '../components/common/VerifiedContactPanel';
import { StitchBorder } from '../components/common/StitchBorder';
import { Scissors } from 'lucide-react';
import { InstagramIcon } from '../components/common/InstagramIcon';

export const About: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 pb-24">
      {/* Hero statement */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 garment-label text-xs">
          <Scissors className="w-3.5 h-3.5 text-gulab" />
          <span>ONE-WOMAN ATELIER · NEW DELHI</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-normal tracking-tight text-jamun dark:text-kora leading-tight">
          Crafting luxury from a home cutting table, one bespoke seam at a time.
        </h1>
        <p className="text-sm sm:text-base text-jamun/80 dark:text-kora/80 leading-relaxed">
          Kayaa Clothing began with a pair of shears, a single Singer pedal machine, and a refusal to compromise on natural handloom fibers.
        </p>
      </section>

      {/* Story Grid */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
        <div className="md:col-span-5 bg-chalk-subtle dark:bg-chalk-dark p-6 rounded-lg border-2 border-dashed border-chalk-border space-y-4 shadow-atelier">
          <span className="font-mono text-xs font-bold uppercase text-gulab">Atelier Ethos</span>
          <h2 className="font-display text-2xl font-bold text-jamun dark:text-kora">
            Why 85,000 women trust our studio
          </h2>
          <p className="text-xs text-jamun/80 dark:text-kora/80 leading-relaxed">
            In modern fashion, garments pass through ten anonymous hands across industrial production lines. At Kayaa, I inspect the silk yardage, draft your individual pattern on brown butcher paper, cut the kalis, and hand-stitch the gota trims myself.
          </p>
          <div className="pt-2 border-t border-chalk-border/60 text-xs font-mono text-jamun/70 dark:text-kora/70">
            Based in Chintamani Weaver Enclave, Shahpur Jat, New Delhi.
          </div>
        </div>

        <div className="md:col-span-7 space-y-4 text-xs sm:text-sm text-jamun/85 dark:text-kora/85 leading-relaxed">
          <p>
            When you purchase a lehenga or anarkali for a sister’s wedding or your child’s naming ceremony, the garment should honor that milestone. Mass-manufactured polyester blends look shiny under store spotlights, but breathe poorly and degrade within seasons.
          </p>
          <p>
            We travel directly to handloom weaving clusters — Chanderi in Madhya Pradesh for ethereal silk-cottons, Bagru in Rajasthan for mud-resist dabu prints, and Kotah for crisp summer doria. Every piece is cut with generous 1.5-inch hidden side allowances so your garment adapts with you over the years.
          </p>
          <div className="pt-2 flex items-center gap-4">
            <a
              href={BRAND_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-jamun dark:bg-kora text-kora dark:text-jamun rounded text-xs font-bold"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>Follow Daily Studio Workbench on IG</span>
            </a>
          </div>
        </div>
      </section>

      {/* Fabric Care Guidance */}
      <section className="bg-white dark:bg-jamun-surface p-8 rounded-lg border border-chalk-border dark:border-chalk-dark space-y-6 shadow-atelier">
        <h3 className="font-display text-xl font-bold text-jamun dark:text-kora">
          Caring for Natural Handloom Textiles
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-jamun/80 dark:text-kora/80">
          <div>
            <strong className="text-jamun dark:text-kora block mb-1 font-semibold">1. Muslin Wrap Storage</strong>
            Never enclose pure silk garments in plastic dry-cleaner bags. Natural proteins need airflow. We recommend wrapping your lehenga or anarkali in breathable unbleached cotton muslin.
          </div>

          <div>
            <strong className="text-jamun dark:text-kora block mb-1 font-semibold">2. Steam, Do Not Iron Directly</strong>
            For raw silks and metallic tissue weaves, always steam from the reverse side or place a damp cotton press cloth between the iron and the fabric to protect hand-applied gota edges.
          </div>

          <div>
            <strong className="text-jamun dark:text-kora block mb-1 font-semibold">3. Vegetable Dye Care</strong>
            Natural indigo, madder, and turmeric prints will bleed excess surface color during their initial washes. Dry clean or hand-wash in cold water with natural reetha (soapnut).
          </div>
        </div>
      </section>

      {/* Trust Panel */}
      <VerifiedContactPanel />
    </div>
  );
};
