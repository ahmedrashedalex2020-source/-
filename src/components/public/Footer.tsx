import React from 'react';
import { BrandLogo } from '../brand/BrandLogo';
import { RestaurantSettings } from '../../types/menu';
import { MapPin, Phone, MessageCircle, Clock, ShieldCheck } from 'lucide-react';

interface FooterProps {
  settings: RestaurantSettings;
  lang: 'ar' | 'en';
  onNavigateToAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  lang,
  onNavigateToAdmin,
}) => {
  const isAr = lang === 'ar';

  return (
    <footer className="bg-[#392A23] text-[#FFF9EF] border-t-4 border-[#C58D38] pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-[#755947]/60">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="bg-white/10 p-3 rounded-2xl inline-block">
              <BrandLogo size="md" showSubtitle={true} className="[&_span]:text-[#FFF9EF]" />
            </div>
            <p className="text-xs sm:text-sm text-[#E8D8B5] leading-relaxed max-w-sm">
              {isAr
                ? 'مطعم كبدة إسكندراني يقدم أشهى السندوتشات المصرية الأصيلة والشاورما والمشاوي الطازجة والعيوش والمأكولات البحرية بأعلى معايير الجودة في مسقط.'
                : 'Alexandrian Liver Restaurant brings authentic Egyptian Alexandrian sandwiches, savory shawarma, fresh charcoal grills, rice dishes, and seafood in Muscat.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-[#C58D38]">
              <ShieldCheck className="w-4 h-4" />
              <span>
                {isAr
                  ? 'أسعار موثقة رسميًا بالريال العماني (ر.ع)'
                  : 'Official Verified Pricing in OMR'}
              </span>
            </div>
          </div>

          {/* Location & Operating Hours */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-[#C58D38] uppercase tracking-wider">
              {isAr ? 'الموقع وأوقات العمل' : 'Location & Hours'}
            </h4>
            <div className="flex items-start gap-2.5 text-xs sm:text-sm text-[#E8D8B5]">
              <MapPin className="w-4 h-4 text-[#A1312E] mt-0.5 shrink-0" />
              <span>{isAr ? settings.addressAr : settings.addressEn}</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs sm:text-sm text-[#E8D8B5]">
              <Clock className="w-4 h-4 text-[#C58D38] mt-0.5 shrink-0" />
              <span>{isAr ? settings.openingHoursAr : settings.openingHoursEn}</span>
            </div>
          </div>

          {/* Contact Numbers */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-[#C58D38] uppercase tracking-wider">
              {isAr ? 'الاتصال والطلبات' : 'Direct Contacts'}
            </h4>
            <div className="space-y-2">
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-xs sm:text-sm text-[#E8D8B5] hover:text-[#25D366] transition group"
              >
                <div className="p-1.5 rounded-lg bg-emerald-950/60 text-[#25D366] group-hover:bg-emerald-900">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span>{settings.whatsapp} (WhatsApp)</span>
              </a>

              <a
                href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                className="flex items-center gap-2.5 text-xs sm:text-sm text-[#E8D8B5] hover:text-white transition group"
              >
                <div className="p-1.5 rounded-lg bg-white/10 text-[#FFF9EF] group-hover:bg-white/20">
                  <Phone className="w-4 h-4" />
                </div>
                <span>{settings.phone} (Direct Call)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E8D8B5]/70">
          <p>
            © {new Date().getFullYear()} {isAr ? settings.nameAr : settings.nameEn} — Daris, Muscat, Sultanate of Oman.
          </p>

          <button
            onClick={onNavigateToAdmin}
            className="text-xs text-[#C58D38] hover:text-white hover:underline transition font-semibold"
          >
            {isAr ? 'لوحة تحكم إدارة المطعم (Admin CMS)' : 'Restaurant CMS Dashboard'}
          </button>
        </div>
      </div>
    </footer>
  );
};
