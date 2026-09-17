import React from 'react';

interface StitchBorderProps {
  color?: 'default' | 'thread' | 'trust';
  className?: string;
  vertical?: boolean;
}

export const StitchBorder: React.FC<StitchBorderProps> = ({
  color = 'default',
  className = '',
  vertical = false,
}) => {
  const colorMap = {
    default: 'var(--color-border)',
    thread: 'var(--color-thread)',
    trust: 'var(--color-trust)',
  };

  const strokeColor = colorMap[color];

  if (vertical) {
    return (
      <div
        className={`w-px h-full ${className}`}
        style={{
          backgroundImage: `repeating-linear-gradient(to bottom, ${strokeColor} 0, ${strokeColor} 4px, transparent 4px, transparent 8px)`,
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className={`w-full h-[1.5px] ${className}`}
      style={{
        backgroundImage: `repeating-linear-gradient(to right, ${strokeColor} 0, ${strokeColor} 5px, transparent 5px, transparent 10px)`,
      }}
      aria-hidden="true"
    />
  );
};
