import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  lightMode?: boolean; // if placed on dark background
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  lightMode = false,
}) => {
  const config = {
    sm: { scale: 0.85, titleSize: 'text-lg', subSize: 'text-[9px]', waveW: 80, waveH: 34 },
    md: { scale: 1.0, titleSize: 'text-2xl', subSize: 'text-[11px]', waveW: 105, waveH: 42 },
    lg: { scale: 1.3, titleSize: 'text-3xl', subSize: 'text-xs', waveW: 135, waveH: 52 },
    xl: { scale: 1.6, titleSize: 'text-4xl', subSize: 'text-sm', waveW: 165, waveH: 64 },
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3.5 select-none ${className}`}>
      {/* Exact Visual Identity from the Official Paper Menu:
          1. "كبدة" in Warm Golden Ochre (#EEA323) with 3D drop shadow
          2. "إسكندراني" in Heritage Alexandrian Crimson (#B81D22)
          3. Alexandria Maritime Sea Waves (Cyan & Deep Blue & Crimson) with water droplets
          4. "ALEXANDRIAN LIVER" in distressed antique bronze
      */}
      <div className="relative flex flex-col items-center">
        {/* Artistic Calligraphic Logo Emblem */}
        <div className="relative flex items-center justify-center">
          <svg
            width={config.waveW}
            height={config.waveH}
            viewBox="0 0 110 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-sm filter transition-transform duration-300 hover:scale-105"
          >
            {/* Background Alexandria Coastline Waves */}
            {/* Wave 1: Cyan / Mediterranean Sea */}
            <path
              d="M4 32C18 24 30 36 46 28C60 21 72 32 88 25C96 21 102 24 106 28"
              stroke="#53A3CA"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Wave 2: Deep Alexandria Navy Blue */}
            <path
              d="M8 37C22 30 34 41 50 33C64 26 76 37 92 30C99 27 104 29 108 33"
              stroke="#246A92"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Wave 3: Crimson Red underline ribbon */}
            <path
              d="M12 41C26 35 38 43 54 37C68 31 80 40 94 34"
              stroke="#B81D22"
              strokeWidth="2.2"
              strokeLinecap="round"
            />

            {/* Maritime water droplets / pearls (seen on paper menu) */}
            <circle cx="100" cy="18" r="2.2" fill="#53A3CA" />
            <circle cx="105" cy="22" r="1.5" fill="#246A92" />
            <circle cx="95" cy="14" r="1.2" fill="#EEA323" />

            {/* Stylized Arabic Calligraphy Overlay in Vector Paths */}
            {/* "كبدة" top word in Ochre Gold with 3D outline */}
            <g id="kebda-art">
              {/* Drop shadow / 3D extrusion */}
              <text
                x="56"
                y="18"
                textAnchor="middle"
                fontSize="17"
                fontWeight="900"
                fontFamily="'Cairo', sans-serif"
                fill="#4E2304"
                letterSpacing="1px"
              >
                كَبِدَة
              </text>
              {/* Top Ochre fill */}
              <text
                x="55"
                y="17"
                textAnchor="middle"
                fontSize="17"
                fontWeight="900"
                fontFamily="'Cairo', sans-serif"
                fill="#EEA323"
                stroke="#5A2904"
                strokeWidth="0.6"
                letterSpacing="1px"
              >
                كَبِدَة
              </text>
            </g>

            {/* "إسكندراني" lower sweeping word in Crimson Red */}
            <g id="eskandarani-art">
              {/* Drop shadow / 3D extrusion */}
              <text
                x="56"
                y="34"
                textAnchor="middle"
                fontSize="18"
                fontWeight="900"
                fontFamily="'Cairo', sans-serif"
                fill="#420608"
                letterSpacing="1.5px"
              >
                إسكندراني
              </text>
              {/* Crimson Red fill */}
              <text
                x="55"
                y="33"
                textAnchor="middle"
                fontSize="18"
                fontWeight="900"
                fontFamily="'Cairo', sans-serif"
                fill="#B81D22"
                stroke="#FFEBC4"
                strokeWidth="0.5"
                letterSpacing="1.5px"
              >
                إسكندراني
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* English Branding matching paper menu: "ALEXANDRIAN LIVER" */}
      {showSubtitle && (
        <div className="flex flex-col leading-tight justify-center">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black tracking-wider uppercase font-['Cairo'] ${
                lightMode ? 'text-[#FAF3DE]' : 'text-[#2B160C]'
              } ${config.titleSize}`}
              style={{
                textShadow: lightMode
                  ? '0 1px 2px rgba(0,0,0,0.5)'
                  : '0 1px 1px rgba(255,255,255,0.7)',
              }}
            >
              <span className="text-[#EEA323]">كبدة </span>
              <span className="text-[#B81D22]">إسكندراني</span>
            </span>
          </div>
          <span
            className={`font-black tracking-[0.22em] uppercase font-['Inter'] ${
              lightMode ? 'text-[#D4B583]' : 'text-[#5A3821]'
            } ${config.subSize}`}
          >
            ALEXANDRIAN LIVER
          </span>
        </div>
      )}
    </div>
  );
};
