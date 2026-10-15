import React from 'react';
import { BrandLogo } from '../brand/BrandLogo';
import { RestaurantSettings } from '../../types/menu';
import { MapPin, Phone, MessageCircle, Clock, Lock } from 'lucide-react';

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
    <footer className="bg-[#2C1810] text-[#FFFDF9] border-t-2 border-[#D97706]/40 pt-8 pb-20 sm:pb-12 mt-12">
      <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
        {/* Logo */}
        <div className="flex justify-center">
          <BrandLogo size="sm" showSubtitle={true} className="[&_span]:text-[#FFFDF9]" />
        </div>

        {/* Quick meta info */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-[#E8D8B5]">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#C58D38]" />
            <span>{isAr ? settings.addressAr : settings.addressEn}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#C58D38]" />
            <span>{isAr ? settings.openingHoursAr : settings.openingHoursEn}</span>
          </div>
        </div>

        {/* WhatsApp & Phone Links */}
        <div className="flex items-center justify-center gap-3 pt-1">
          <a
            href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-600/30 transition"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>{settings.whatsapp}</span>
          </a>

          <a
            href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white border border-white/20 text-xs font-bold hover:bg-white/20 transition"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{settings.phone}</span>
          </a>
        </div>

        {/* Bottom subtle copyright & discreet admin access */}
        <div className="pt-5 border-t border-[#755947]/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#A8988B]">
          <p>© {new Date().getFullYear()} مطعم كبدة إسكندراني — جميع الأسعار بالريال العماني (ر.ع)</p>
          <button
            onClick={onNavigateToAdmin}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 text-[#D4B57E] hover:text-white border border-[#C58D38]/40 transition cursor-pointer font-bold text-xs shadow-xs"
            title={isAr ? 'الدخول للوحة التحكم والإدارة' : 'Admin Control Panel'}
          >
            <Lock className="w-3.5 h-3.5 text-[#00c853]" />
            <span>{isAr ? 'لوحة التحكم والإدارة' : 'Admin Control Panel'}</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
