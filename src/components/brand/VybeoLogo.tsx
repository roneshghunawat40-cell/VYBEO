import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const VybeoLogo: React.FC<LogoProps> = ({
  className = '',
  size = 32,
  showText = true,
}) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transform transition-transform hover:scale-105 duration-200 shrink-0"
        aria-label="VYBEO Logo"
      >
        <defs>
          <linearGradient id="vybeo-red-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF1E46" />
            <stop offset="100%" stopColor="#99001A" />
          </linearGradient>
          <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#FF003F" floodOpacity="0.45" />
          </filter>
        </defs>
        {/* Isometric Rounded Rhombus Dynamic Hull */}
        <rect
          x="10"
          y="10"
          width="80"
          height="80"
          rx="24"
          fill="url(#vybeo-red-grad)"
          filter="url(#neon-glow)"
        />
        {/* Playhead Geometry with Forward Wavefront Notch */}
        <path
          d="M40 32L72 50L40 68V32Z"
          fill="#FFFFFF"
          strokeLinejoin="round"
        />
        {/* Signal Broadcast Crest */}
        <circle cx="72" cy="28" r="4.5" fill="#FFFFFF" />
      </svg>
      {showText && (
        <span className="font-extrabold tracking-wider text-xl sm:text-2xl bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent font-brand">
          VYBEO
        </span>
      )}
    </div>
  );
};
