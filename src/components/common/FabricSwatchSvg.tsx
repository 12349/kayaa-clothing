import React from 'react';
import { ProductArt } from '../../types';

interface FabricSwatchSvgProps {
  art: ProductArt;
  className?: string;
  showMotifLabel?: boolean;
}

export const FabricSwatchSvg: React.FC<FabricSwatchSvgProps> = ({
  art,
  className = 'w-full h-full',
  showMotifLabel = false,
}) => {
  const { h1, h2, motif } = art;
  const patternId = `pattern-${motif}-${h1.replace('#', '')}-${h2.replace('#', '')}`;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <svg
        className="w-full h-full object-cover select-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 400 480"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label={`${motif} handloom fabric motif in ${h1} and ${h2}`}
      >
        <defs>
          {/* Subtle slub weave texture */}
          <pattern id="slub-grain" width="16" height="16" patternUnits="userSpaceOnUse">
            <line x1="0" y1="4" x2="16" y2="4" stroke="rgba(255,255,255,0.04)" strokeWidth="0.7" />
            <line x1="0" y1="12" x2="16" y2="12" stroke="rgba(0,0,0,0.06)" strokeWidth="0.7" />
            <line x1="4" y1="0" x2="4" y2="16" stroke="rgba(255,255,255,0.03)" strokeWidth="0.7" />
            <line x1="12" y1="0" x2="12" y2="16" stroke="rgba(0,0,0,0.04)" strokeWidth="0.7" />
          </pattern>

          {/* MOTIF 1: BUTI (Scattered Floral Almond / Mango Motif) */}
          {motif === 'buti' && (
            <pattern id={patternId} width="80" height="96" patternUnits="userSpaceOnUse">
              {/* Center Buti */}
              <g transform="translate(40, 48) scale(0.9)">
                {/* Petal leaf cluster */}
                <path
                  d="M0,-24 C8,-16 14,-6 12,6 C10,16 0,22 0,24 C0,22 -10,16 -12,6 C-14,-6 -8,-16 0,-24 Z"
                  fill={h2}
                  opacity="0.9"
                />
                <circle cx="0" cy="0" r="3.5" fill={h1} />
                <circle cx="-5" cy="-8" r="1.5" fill={h2} opacity="0.7" />
                <circle cx="5" cy="-8" r="1.5" fill={h2} opacity="0.7" />
                <circle cx="0" cy="-14" r="1.5" fill={h2} opacity="0.7" />
              </g>
              {/* Corner Staggered Mini-Butis */}
              <g transform="translate(0, 0) scale(0.6)">
                <path
                  d="M0,-20 C6,-13 11,-5 9,5 C7,13 0,18 0,20 C0,18 -7,13 -9,5 C-11,-5 -6,-13 0,-20 Z"
                  fill={h2}
                  opacity="0.8"
                />
              </g>
              <g transform="translate(80, 0) scale(0.6)">
                <path
                  d="M0,-20 C6,-13 11,-5 9,5 C7,13 0,18 0,20 C0,18 -7,13 -9,5 C-11,-5 -6,-13 0,-20 Z"
                  fill={h2}
                  opacity="0.8"
                />
              </g>
              <g transform="translate(0, 96) scale(0.6)">
                <path
                  d="M0,-20 C6,-13 11,-5 9,5 C7,13 0,18 0,20 C0,18 -7,13 -9,5 C-11,-5 -6,-13 0,-20 Z"
                  fill={h2}
                  opacity="0.8"
                />
              </g>
              <g transform="translate(80, 96) scale(0.6)">
                <path
                  d="M0,-20 C6,-13 11,-5 9,5 C7,13 0,18 0,20 C0,18 -7,13 -9,5 C-11,-5 -6,-13 0,-20 Z"
                  fill={h2}
                  opacity="0.8"
                />
              </g>
            </pattern>
          )}

          {/* MOTIF 2: JAAL (Interlocking Diamond Lattice Vines) */}
          {motif === 'jaal' && (
            <pattern id={patternId} width="64" height="64" patternUnits="userSpaceOnUse">
              {/* Diamond lattice lines */}
              <path
                d="M32 0 L64 32 L32 64 L0 32 Z"
                fill="none"
                stroke={h2}
                strokeWidth="1.8"
                strokeOpacity="0.7"
              />
              <path
                d="M32 6 L58 32 L32 58 L6 32 Z"
                fill="none"
                stroke={h2}
                strokeWidth="0.8"
                strokeOpacity="0.4"
              />
              {/* Rosette center */}
              <circle cx="32" cy="32" r="3.5" fill={h2} opacity="0.9" />
              <circle cx="32" cy="0" r="2.5" fill={h2} opacity="0.8" />
              <circle cx="32" cy="64" r="2.5" fill={h2} opacity="0.8" />
              <circle cx="0" cy="32" r="2.5" fill={h2} opacity="0.8" />
              <circle cx="64" cy="32" r="2.5" fill={h2} opacity="0.8" />
            </pattern>
          )}

          {/* MOTIF 3: BANDHANI (Traditional Clustered Tie-Dye Dots) */}
          {motif === 'bandhani' && (
            <pattern id={patternId} width="48" height="48" patternUnits="userSpaceOnUse">
              {/* Center 5-dot cluster */}
              <circle cx="24" cy="24" r="3.8" fill={h2} opacity="0.9" />
              <circle cx="24" cy="24" r="1.5" fill={h1} />
              <circle cx="16" cy="24" r="2.4" fill={h2} opacity="0.8" />
              <circle cx="32" cy="24" r="2.4" fill={h2} opacity="0.8" />
              <circle cx="24" cy="16" r="2.4" fill={h2} opacity="0.8" />
              <circle cx="24" cy="32" r="2.4" fill={h2} opacity="0.8" />
              {/* Corner dots */}
              <circle cx="0" cy="0" r="2.8" fill={h2} opacity="0.85" />
              <circle cx="48" cy="0" r="2.8" fill={h2} opacity="0.85" />
              <circle cx="0" cy="48" r="2.8" fill={h2} opacity="0.85" />
              <circle cx="48" cy="48" r="2.8" fill={h2} opacity="0.85" />
            </pattern>
          )}

          {/* MOTIF 4: LEHERIYA (Diagonal Ripple Waves) */}
          {motif === 'leheriya' && (
            <pattern
              id={patternId}
              width="60"
              height="60"
              patternTransform="rotate(45 0 0)"
              patternUnits="userSpaceOnUse"
            >
              <line x1="0" y1="10" x2="60" y2="10" stroke={h2} strokeWidth="3" opacity="0.85" />
              <line x1="0" y1="20" x2="60" y2="20" stroke={h2} strokeWidth="1" opacity="0.5" />
              <line x1="0" y1="40" x2="60" y2="40" stroke={h2} strokeWidth="4" opacity="0.9" />
              <line x1="0" y1="50" x2="60" y2="50" stroke={h2} strokeWidth="1.5" opacity="0.6" />
            </pattern>
          )}

          {/* MOTIF 5: STRIPE (Tailor's Fine Zari Warp Lines) */}
          {motif === 'stripe' && (
            <pattern id={patternId} width="32" height="32" patternUnits="userSpaceOnUse">
              <line x1="8" y1="0" x2="8" y2="32" stroke={h2} strokeWidth="1.8" opacity="0.85" />
              <line x1="12" y1="0" x2="12" y2="32" stroke={h2} strokeWidth="0.8" opacity="0.5" />
              <line x1="24" y1="0" x2="24" y2="32" stroke={h2} strokeWidth="2.2" opacity="0.9" />
            </pattern>
          )}
        </defs>

        {/* Base handloom ground color */}
        <rect width="100%" height="100%" fill={h1} />

        {/* Procedural motif repetition */}
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />

        {/* Organic loom slub texture overlay */}
        <rect width="100%" height="100%" fill="url(#slub-grain)" opacity="0.6" />

        {/* Subtle studio spotlight / vignette */}
        <radialGradient id="vignette" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="transparent" stopOpacity="0" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.32)" />
        </radialGradient>
        <rect width="100%" height="100%" fill="url(#vignette)" />

        {/* Tailor's selvedge edge mark at bottom right */}
        <g transform="translate(330, 440)">
          <rect x="-10" y="-14" width="72" height="24" fill="rgba(35, 22, 40, 0.75)" rx="2" />
          <text
            x="26"
            y="2"
            fill="#FBF8F4"
            fontSize="9"
            fontFamily="'Albert Sans', sans-serif"
            fontWeight="600"
            textAnchor="middle"
            letterSpacing="1"
          >
            HANDLOOM
          </text>
        </g>
      </svg>

      {showMotifLabel && (
        <span className="absolute bottom-2 left-2 garment-label text-[10px] py-0.5 px-2 bg-kora/95 text-jamun dark:bg-jamun/95 dark:text-kora">
          {motif.toUpperCase()} MOTIF
        </span>
      )}
    </div>
  );
};
