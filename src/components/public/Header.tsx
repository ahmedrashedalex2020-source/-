import React from 'react';
import { BrandLogo } from '../brand/BrandLogo';
import { RestaurantSettings, CartItem } from '../../types/menu';
import {
  Globe,
  Search,
  Lock,
  X,
  PhoneCall,
  Clock,
} from 'lucide-react';

interface HeaderProps {
  settings: RestaurantSettings;
  lang: 'ar' | 'en';
  onToggleLang: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  cartItems: CartItem[];
  onOpenCart: () => void;
  onNavigateToAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  lang,
  onToggleLang,
  searchQuery,
  onSearchChange,
  cartItems,
  onOpenCart,
  onNavigateToAdmin,
}) => {
  const isAr = lang === 'ar';
  const totalCartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#E8D8B5]/80 shadow-2xs transition-all">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5">
        {/* Top Row: Logo, Status, Lang, Admin Lock */}
        <div className="flex items-center justify-between gap-2">
          {/* Brand Logo & Name */}
          <div
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <BrandLogo size="sm" showSubtitle={false} />
            
            {/* Live Open Status Pill */}
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{isAr ? 'مفتوح الآن' : 'Open Now'}</span>
            </div>
          </div>

          {/* Controls: Language, Phone, Discreet Admin */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Direct Phone Call Quick Icon */}
            {settings.phone && (
              <a
                href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                className="w-8 h-8 flex items-center justify-center text-[#755947] hover:text-[#8B1E1E] hover:bg-[#F6ECD5]/50 rounded-full transition"
                title={isAr ? `اتصال: ${settings.phone}` : `Call: ${settings.phone}`}
                aria-label="Call"
              >
                <PhoneCall className="w-4 h-4 text-[#8B1E1E]" />
              </a>
            )}

            {/* Language Switcher */}
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#E8D8B5] bg-white text-[#5C3E2E] hover:border-[#8B1E1E] hover:text-[#8B1E1E] transition text-xs font-bold shadow-2xs cursor-pointer"
              title={isAr ? 'Switch to English' : 'التحويل للعربية'}
            >
              <Globe className="w-3.5 h-3.5 text-[#C58D38]" />
              <span>{isAr ? 'EN' : 'عربي'}</span>
            </button>

            {/* Subtle / Discreet Admin Portal Button (non-intrusive for customers) */}
            <button
              onClick={onNavigateToAdmin}
              className="w-8 h-8 flex items-center justify-center rounded-full text-stone-400 hover:text-[#8B1E1E] hover:bg-stone-100 transition border border-transparent hover:border-stone-200"
              title={isAr ? 'لوحة تحكم الإدارة (خاص بالإدارة)' : 'Admin Dashboard'}
              aria-label="Admin Login"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom Row: Streamlined Integrated Search Bar */}
        <div className="mt-2 relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute ltr:left-3 rtl:right-3 text-[#A8988B] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={isAr ? 'ابحث عن وجبة أو سندوتش (كبدة، سجق، شاورما...)' : 'Search sandwiches, platters, liver...'}
              className="w-full bg-[#FAF5EC] hover:bg-[#F5EFE4] focus:bg-white border border-[#E8D8B5] focus:border-[#8B1E1E] focus:ring-2 focus:ring-[#8B1E1E]/10 rounded-xl ltr:pl-9 ltr:pr-8 rtl:pr-9 rtl:pl-8 py-2 text-xs sm:text-sm font-semibold text-[#2C1810] placeholder-[#A8988B] outline-none transition shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute ltr:right-2.5 rtl:left-2.5 p-1 text-gray-400 hover:text-gray-600 rounded-full"
                title={isAr ? 'مسح البحث' : 'Clear search'}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
