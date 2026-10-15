import React from 'react';
import { RestaurantSettings } from '../../types/menu';
import { MapPin, Phone, MessageCircle, Clock } from 'lucide-react';

interface HeroProps {
  settings: RestaurantSettings;
  lang: 'ar' | 'en';
}

export const Hero: React.FC<HeroProps> = ({ settings, lang }) => {
  const isAr = lang === 'ar';

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-[#F6ECD5] via-[#FFF9EF] to-[#FFF9EF] border-b border-[#E8D8B5] pt-6 pb-6 sm:py-8">
      {/* Decorative Mediterranean Wave Banner Background */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-linear-to-r from-[#437E9D] via-[#C58D38] to-[#A1312E]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Main Content */}
          <div className="text-center md:text-start flex-1 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8D8B5]/50 border border-[#C58D38]/30 text-[#755947] text-xs font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-[#A1312E] animate-pulse" />
              <span>
                {isAr
                  ? 'دارسيت، مسقط — قائمة طعام أصلية بأسعار مؤكدة'
                  : 'Darsait, Muscat — Authentic Menu with Verified OMR Pricing'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#392A23] tracking-tight leading-snug">
              <span className="text-[#A1312E]">
                {isAr ? settings.nameAr : settings.nameEn}
              </span>
              <span className="block text-lg sm:text-xl font-medium text-[#755947] mt-1">
                {isAr ? settings.heroTaglineAr : settings.heroTaglineEn}
              </span>
            </h1>

            {/* Restaurant Meta Badges */}
            <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-y-2 gap-x-4 text-xs sm:text-sm text-[#755947]">
              {/* Location */}
              <div className="flex items-center gap-1.5 bg-white/70 px-2.5 py-1 rounded-md border border-[#E8D8B5]">
                <MapPin className="w-3.5 h-3.5 text-[#A1312E] shrink-0" />
                <span className="truncate max-w-[240px] sm:max-w-none">
                  {isAr ? settings.addressAr : settings.addressEn}
                </span>
              </div>

              {/* Working Hours */}
              <div className="flex items-center gap-1.5 bg-white/70 px-2.5 py-1 rounded-md border border-[#E8D8B5]">
                <Clock className="w-3.5 h-3.5 text-[#C58D38] shrink-0" />
                <span>{isAr ? settings.openingHoursAr : settings.openingHoursEn}</span>
              </div>
            </div>
          </div>

          {/* Quick Contact Box on Desktop / Highlights */}
          <div className="flex flex-row md:flex-col gap-2 shrink-0 w-full sm:w-auto justify-center">
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition transform hover:-translate-y-0.5"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>{isAr ? 'واتساب 79348565' : 'WhatsApp 79348565'}</span>
            </a>

            <a
              href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
              className="flex items-center justify-center gap-2 bg-white hover:bg-[#FFF9EF] text-[#392A23] border border-[#C58D38]/50 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition"
            >
              <Phone className="w-4 h-4 text-[#A1312E]" />
              <span>{isAr ? 'اتصال 92347955' : 'Call 92347955'}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
