import React from 'react';
import { MeasurementChart } from '../components/sizeGuide/MeasurementChart';
import { HowToMeasureSvg } from '../components/sizeGuide/HowToMeasureSvg';
import { FindMySizeHelper } from '../components/sizeGuide/FindMySizeHelper';
import { VerifiedContactPanel } from '../components/common/VerifiedContactPanel';
import { StitchBorder } from '../components/common/StitchBorder';
import { Scissors, CheckCircle, ShieldCheck, Ruler } from 'lucide-react';

export const SizeGuidePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 pb-24">
      {/* Header */}
      <div className="border-b border-chalk-border dark:border-chalk-dark pb-6">
        <div className="inline-flex items-center gap-2 garment-label text-[10px] mb-2">
          <Scissors className="w-3 h-3 text-gulab" />
          <span>STUDIO SIZING & MEASUREMENT SPECIFICATION</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-jamun dark:text-kora">
          The Kayaa Fit System
        </h1>
        <p className="text-sm text-jamun/70 dark:text-kora/70 max-w-2xl mt-1 leading-relaxed">
          Indian garments demand an exacting balance between ease of movement and sculptural drape. Compare standard sizes or use our 6-point guide for Made-to-Measure pieces.
        </p>
      </div>

      {/* 1. Find My Size Helper (Interactive calculator) */}
      <section>
        <FindMySizeHelper />
      </section>

      {/* 2. Interactive How To Measure 6-Step Guide */}
      <section>
        <HowToMeasureSvg />
      </section>

      {/* 3. Full Standard Measurement Chart */}
      <section>
        <MeasurementChart />
      </section>

      {/* Atelier Reassurance & Margins */}
      <section className="p-6 bg-chalk-subtle dark:bg-chalk-dark/40 border border-chalk-border dark:border-chalk-dark rounded-lg">
        <h3 className="font-display font-semibold text-base text-jamun dark:text-kora mb-3 flex items-center gap-2">
          <Ruler className="w-4 h-4 text-gulab" />
          <span>The Atelier Tailoring Guarantee</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-jamun/80 dark:text-kora/80">
          <div>
            <strong className="block text-jamun dark:text-kora mb-1 font-semibold">
              1.5-Inch Internal Margins
            </strong>
            Every blouse and kurta is cut with generous hidden side allowances. If your measurements shift slightly over time, any local tailor can open or take in the seams in minutes.
          </div>
          <div>
            <strong className="block text-jamun dark:text-kora mb-1 font-semibold">
              Pre-Shrunk Handloom Linings
            </strong>
            All mulmul and cotton linings are thoroughly cold-water washed in our studio before cutting, so your garment will never pull or shrink after its first cleaning.
          </div>
          <div>
            <strong className="block text-jamun dark:text-kora mb-1 font-semibold">
              Saved Profiles for Returning Clients
            </strong>
            Once you submit your measurements, your pattern specs are preserved in our ledger. Simply select your profile on future orders without re-measuring.
          </div>
        </div>
      </section>

      {/* Trust reassurance */}
      <VerifiedContactPanel compact />
    </div>
  );
};
