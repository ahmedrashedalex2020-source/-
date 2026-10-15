import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
}) => {
  const dimensions = {
    sm: { height: '36px', iconSize: 32, textSize: 'text-base', subSize: 'text-[9px]' },
    md: { height: '48px', iconSize: 44, textSize: 'text-xl', subSize: 'text-[11px]' },
    lg: { height: '64px', iconSize: 60, textSize: 'text-2xl', subSize: 'text-xs' },
    xl: { height: '80px', iconSize: 76, textSize: 'text-3xl', subSize: 'text-sm' },
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Authentic Alexandria Maritime Emblem with stylized Liver / Pan & Wave */}
      <div className="relative flex-shrink-0 flex items-center justify-center">
        <svg
          width={dimensions.iconSize}
          height={dimensions.iconSize}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm transition-transform duration-300 hover:scale-105"
        >
          {/* Antique parchment seal circle */}
          <circle cx="50" cy="50" r="48" fill="#FFF9EF" stroke="#C58D38" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="44" fill="#FBF5E8" stroke="#A1312E" strokeWidth="1" strokeDasharray="3 2" />

          {/* Mediterranean Alexandria Blue Wave Motif */}
          <path
            d="M18 56C24 50 30 52 36 57C42 62 48 62 54 57C60 52 66 51 72 56C78 61 82 58 84 55"
            stroke="#437E9D"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M20 63C26 58 32 59 38 64C44 69 50 68 56 64C62 59 68 59 74 63C80 67 82 65 84 63"
            stroke="#437E9D"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.7"
          />

          {/* Sizzling Alexandrian Pan / Flame & Skillet motif in Heritage Red */}
          <ellipse cx="50" cy="40" rx="26" ry="14" fill="#A1312E" />
          <ellipse cx="50" cy="38" rx="23" ry="11" fill="#755947" />

          {/* Golden Garnish / Spices & Grill Mark */}
          <path
            d="M34 38Q42 34 50 38Q58 42 66 38"
            stroke="#C58D38"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="42" cy="36" r="1.5" fill="#FFF9EF" />
          <circle cx="58" cy="36" r="1.5" fill="#FFF9EF" />

          {/* Golden Alexandria Star Accent */}
          <polygon
            points="50,14 52,20 58,21 53,25 55,31 50,27 45,31 47,25 42,21 48,20"
            fill="#C58D38"
          />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col leading-tight">
        <span className={`font-extrabold tracking-wide text-[#A1312E] ${dimensions.textSize} font-['Cairo']`}>
          كبدة إسكندراني
        </span>
        {showSubtitle && (
          <span className={`font-bold tracking-widest text-[#755947] uppercase ${dimensions.subSize} font-['Inter']`}>
            ALEXANDRIAN LIVER
          </span>
        )}
      </div>
    </div>
  );
};
