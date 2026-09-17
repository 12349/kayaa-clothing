import React, { useState } from 'react';

export const HowToMeasureSvg: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      step: 1,
      name: 'Bust',
      instruction:
        'Wrap the measuring tape comfortably around the fullest part of your chest. Keep the tape parallel to the floor, breathing normally. Do not pull the tape tight.',
      coord: { x: 160, y: 140 },
    },
    {
      step: 2,
      name: 'Waist',
      instruction:
        'Find your natural waist by bending gently to one side — it is the narrowest point above your navel. Measure snugly but allow one finger between tape and body.',
      coord: { x: 160, y: 195 },
    },
    {
      step: 3,
      name: 'Hips',
      instruction:
        'Stand with feet together. Wrap the tape around the widest part of your hips and buttocks, keeping the tape level all the way around.',
      coord: { x: 160, y: 250 },
    },
    {
      step: 4,
      name: 'Shoulder Span',
      instruction:
        'Measure from the outer bone of one shoulder, straight across the curve of your neck, to the outer bone of the opposite shoulder.',
      coord: { x: 160, y: 105 },
    },
    {
      step: 5,
      name: 'Sleeve Length',
      instruction:
        'Starting at the shoulder bone, run the tape down along the outer arm to your desired end point (elbow for 14", full wrist for 22").',
      coord: { x: 235, y: 170 },
    },
    {
      step: 6,
      name: 'Garment / Skirt Length',
      instruction:
        'For kurtas: measure from the high point of shoulder straight down to mid-calf. For lehengas: measure from the tie-cord waist directly to the floor wearing your exact event heels.',
      coord: { x: 160, y: 340 },
    },
  ];

  return (
    <div className="bg-white dark:bg-jamun-surface border border-chalk-border dark:border-chalk-dark rounded-lg p-6 shadow-atelier">
      <div className="mb-6">
        <h3 className="font-display font-semibold text-lg text-jamun dark:text-kora">
          How to Measure: The 6-Point Atelier Sequence
        </h3>
        <p className="text-xs text-jamun/70 dark:text-kora/70">
          Click any numbered step or point on the mannequin to view tailor guidance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Interactive Tailor's Dress Form SVG */}
        <div className="lg:col-span-5 flex justify-center bg-chalk-subtle/50 dark:bg-chalk-dark/40 p-4 rounded-lg border border-chalk-border/60 dark:border-chalk-dark">
          <svg
            viewBox="0 0 320 440"
            className="w-64 h-auto select-none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Mannequin dress form showing 6 measurement points"
          >
            {/* Mannequin stand & base */}
            <line x1="160" y1="380" x2="160" y2="425" stroke="#C87A74" strokeWidth="3" />
            <path d="M120 430 Q160 420 200 430" fill="none" stroke="#231628" strokeWidth="4" />

            {/* Mannequin neck & finial */}
            <ellipse cx="160" cy="55" rx="10" ry="14" fill="#EDE5D8" stroke="#231628" strokeWidth="1.5" />
            <path d="M150 70 L170 70 L168 85 L152 85 Z" fill="#EDE5D8" stroke="#231628" strokeWidth="1.5" />

            {/* Dress Form Torso / Silhouette */}
            <path
              d="M148 85 
                 C130 90, 105 105, 95 125
                 C85 145, 90 165, 105 180
                 C115 190, 118 200, 116 210
                 C112 225, 100 245, 96 270
                 C92 295, 105 330, 120 370
                 L200 370
                 C215 330, 228 295, 224 270
                 C220 245, 208 225, 204 210
                 C202 200, 205 190, 215 180
                 C230 165, 235 145, 225 125
                 C215 105, 190 90, 172 85
                 Z"
              fill="#FBF8F4"
              stroke="#231628"
              strokeWidth="2"
            />

            {/* Atelier princess seam guides */}
            <path d="M135 95 Q145 190 140 370" fill="none" stroke="#E2D7C7" strokeWidth="1" strokeDasharray="3 3" />
            <path d="M185 95 Q175 190 180 370" fill="none" stroke="#E2D7C7" strokeWidth="1" strokeDasharray="3 3" />

            {/* Measurement Tape Lines */}
            {/* 4. Shoulder span line */}
            <line
              x1="98"
              y1="105"
              x2="222"
              y2="105"
              stroke={activeStep === 4 ? '#C87A74' : '#B8A89A'}
              strokeWidth={activeStep === 4 ? 2.5 : 1.5}
              strokeDasharray="4 2"
            />

            {/* 1. Bust tape line */}
            <ellipse
              cx="160"
              cy="140"
              rx="62"
              ry="16"
              fill="none"
              stroke={activeStep === 1 ? '#C87A74' : '#B8A89A'}
              strokeWidth={activeStep === 1 ? 2.5 : 1.5}
              strokeDasharray="4 2"
            />

            {/* 2. Waist tape line */}
            <ellipse
              cx="160"
              cy="195"
              rx="46"
              ry="12"
              fill="none"
              stroke={activeStep === 2 ? '#C87A74' : '#B8A89A'}
              strokeWidth={activeStep === 2 ? 2.5 : 1.5}
              strokeDasharray="4 2"
            />

            {/* 3. Hip tape line */}
            <ellipse
              cx="160"
              cy="250"
              rx="64"
              ry="16"
              fill="none"
              stroke={activeStep === 3 ? '#C87A74' : '#B8A89A'}
              strokeWidth={activeStep === 3 ? 2.5 : 1.5}
              strokeDasharray="4 2"
            />

            {/* 5. Sleeve line (outer arm) */}
            <path
              d="M225 110 C240 140 245 190 235 230"
              fill="none"
              stroke={activeStep === 5 ? '#C87A74' : '#B8A89A'}
              strokeWidth={activeStep === 5 ? 2.5 : 1.5}
              strokeDasharray="4 2"
            />

            {/* 6. Vertical Garment Length guide */}
            <line
              x1="160"
              y1="85"
              x2="160"
              y2="370"
              stroke={activeStep === 6 ? '#C87A74' : '#B8A89A'}
              strokeWidth={activeStep === 6 ? 2.5 : 1.5}
              strokeDasharray="4 2"
            />

            {/* Numbered Interactive Point Badges */}
            {steps.map((s) => {
              const isActive = activeStep === s.step;
              return (
                <g
                  key={s.step}
                  className="cursor-pointer transition-transform"
                  onClick={() => setActiveStep(s.step)}
                >
                  <circle
                    cx={s.coord.x}
                    cy={s.coord.y}
                    r={isActive ? 13 : 11}
                    fill={isActive ? '#C87A74' : '#231628'}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                  <text
                    x={s.coord.x}
                    y={s.coord.y + 4}
                    fill="#FFFFFF"
                    fontSize={isActive ? '11' : '10'}
                    fontWeight="bold"
                    textAnchor="middle"
                    fontFamily="'Albert Sans', sans-serif"
                  >
                    {s.step}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right: Numbered 6-Step Sequence */}
        <div className="lg:col-span-7 space-y-2.5">
          {steps.map((s) => {
            const isActive = activeStep === s.step;
            return (
              <div
                key={s.step}
                onClick={() => setActiveStep(s.step)}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  isActive
                    ? 'border-gulab bg-gulab/10 dark:bg-gulab/20 shadow-sm'
                    : 'border-chalk-border/70 dark:border-chalk-dark hover:bg-chalk-subtle/50 dark:hover:bg-chalk-dark/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isActive
                        ? 'bg-gulab text-white'
                        : 'bg-chalk text-jamun dark:bg-chalk-dark dark:text-kora'
                    }`}
                  >
                    {s.step}
                  </span>
                  <h4 className="font-display font-semibold text-sm text-jamun dark:text-kora">
                    {s.step}. {s.name}
                  </h4>
                </div>
                {isActive && (
                  <p className="text-xs text-jamun/80 dark:text-kora/80 mt-2 pl-9 leading-relaxed">
                    {s.instruction}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
