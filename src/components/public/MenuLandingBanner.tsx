import React from 'react';
import { RestaurantSettings } from '../../types/menu';
import { BrandLogo } from '../brand/BrandLogo';
import {
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Sparkles,
  Flame,
  CheckCircle2,
  UtensilsCrossed,
  ShieldCheck,
} from 'lucide-react';

interface MenuLandingBannerProps {
  settings: RestaurantSettings;
  lang: 'ar' | 'en';
  onOpenWhatsApp: () => void;
}

export const MenuLandingBanner: React.FC<MenuLandingBannerProps> = ({
  settings,
  lang,
  onOpenWhatsApp,
}) => {
  const isAr = lang === 'ar';

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-[#FAF5EC] to-[#FFFDF9] border-b border-[#E8D8B5]/80 py-4 sm:py-6">
      {/* Decorative Warm Top Edge */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-linear-to-r from-[#8B1E1E] via-[#D97706] to-[#8B1E1E]" />

      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        {/* Main Restaurant Landing Card */}
        <div className="relative bg-white rounded-3xl border border-[#E8D8B5] p-4 sm:p-6 shadow-sm overflow-hidden">
          {/* Subtle Warm Background Pattern */}
          <div className="absolute top-0 end-0 w-64 h-64 bg-radial from-[#D97706]/10 via-transparent to-transparent -me-20 -mt-20 pointer-events-none rounded-full" />
          <div className="absolute bottom-0 start-0 w-48 h-48 bg-radial from-[#8B1E1E]/8 via-transparent to-transparent -ms-16 -mb-16 pointer-events-none rounded-full" />

          <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-start">
            {/* Restaurant Logo Badge */}
            <div className="shrink-0 p-2 sm:p-2.5 bg-linear-to-b from-[#FFFDF9] to-[#F7EDE1] rounded-2xl border border-[#E8D8B5] shadow-xs">
              <BrandLogo size="md" showSubtitle={false} />
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                {/* Live Open Badge */}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-black">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{isAr ? 'مفتوح الآن ويستقبل الطلبات' : 'Open Now'}</span>
                </span>

                {/* Verified OMR Badge */}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFF4DC] border border-[#D97706]/30 text-[#8B1E1E] text-[11px] font-black">
                  <Sparkles className="w-3 h-3 text-[#D97706] fill-[#D97706]" />
                  <span>{isAr ? 'أسعار رسمية بالريال العُماني' : 'Official OMR Prices'}</span>
                </span>
              </div>

              {/* Restaurant Name */}
              <h1 className="text-xl sm:text-2xl font-black text-[#2C1810] tracking-tight">
                {isAr ? settings.nameAr || 'مطعم كبدة إسكندراني' : settings.nameEn || 'Alexandrian Liver Restaurant'}
              </h1>

              {/* Tagline / Subtitle */}
              <p className="text-xs sm:text-sm text-[#755947] font-medium mt-1 leading-relaxed max-w-2xl">
                {isAr
                  ? settings.heroTaglineAr ||
                    'أصل الكبدة الإسكندراني والسجق البلدي بالتتبيلة السرية والعيش الطازة • متعة الطعم الإسكندراني الأصيل في سلطنة عُمان'
                  : settings.heroTaglineEn ||
                    'Authentic Alexandrian liver and fresh oriental sausage with secret herbs & hot bread in Oman'}
              </p>

              {/* Restaurant Meta Chips (Hours, Location) */}
              <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-[#5C3E2E]">
                {/* Hours */}
                <div className="flex items-center gap-1.5 bg-[#FAF5EC] px-2.5 py-1 rounded-xl border border-[#E8D8B5]">
                  <Clock className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
                  <span className="font-semibold">
                    {isAr
                      ? settings.openingHoursAr || 'يومياً: 10:00 ص - 2:00 ص'
                      : settings.openingHoursEn || 'Daily: 10:00 AM - 2:00 AM'}
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1.5 bg-[#FAF5EC] px-2.5 py-1 rounded-xl border border-[#E8D8B5]">
                  <MapPin className="w-3.5 h-3.5 text-[#8B1E1E] shrink-0" />
                  <span className="font-semibold truncate max-w-[200px] sm:max-w-none">
                    {isAr
                      ? settings.addressAr || 'دارسيت، مسقط، سلطنة عُمان'
                      : settings.addressEn || 'Darsait, Muscat, Oman'}
                  </span>
                </div>
              </div>

              {/* Quick Action Buttons on Landing Page */}
              <div className="mt-3.5 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                {/* Direct WhatsApp Call-to-action */}
                <button
                  type="button"
                  onClick={onOpenWhatsApp}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] active:scale-95 text-white text-xs sm:text-sm font-black shadow-xs transition cursor-pointer"
                  title={isAr ? 'طلب سريع عبر واتساب' : 'Quick WhatsApp Order'}
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>{isAr ? 'طلب سريع عبر واتساب' : 'Quick WhatsApp Order'}</span>
                </button>

                {/* Direct Phone Call */}
                {settings.phone && (
                  <a
                    href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FAF5EC] border border-[#E8D8B5] text-[#5C3E2E] hover:text-[#8B1E1E] text-xs sm:text-sm font-bold shadow-2xs transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#8B1E1E]" />
                    <span>{settings.phone}</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Quick Value Highlights Strip (Anti-slop, genuine food guarantees) */}
          <div className="mt-4 pt-3 border-t border-[#E8D8B5]/70 grid grid-cols-3 gap-2 text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 text-[11px] font-bold text-[#5C3E2E]">
              <Flame className="w-3.5 h-3.5 text-[#8B1E1E]" />
              <span>{isAr ? 'تحضير ساخن فوري' : 'Freshly Prepared'}</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 text-[11px] font-bold text-[#5C3E2E]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D97706]" />
              <span>{isAr ? 'كبدة ولحوم بلدي طازة' : '100% Fresh Meats'}</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 text-[11px] font-bold text-[#5C3E2E]">
              <UtensilsCrossed className="w-3.5 h-3.5 text-[#8B1E1E]" />
              <span>{isAr ? 'سفري ومحلي وتوصيل' : 'Dine-in & Delivery'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
