import React from 'react';
import { BrandLogo } from '../brand/BrandLogo';
import { RestaurantSettings, CartItem, formatBaisaToOmr } from '../../types/menu';
import {
  Globe,
  Phone,
  MessageCircle,
  ShoppingBag,
  Search,
  Lock,
} from 'lucide-react';

interface HeaderProps {
  settings: RestaurantSettings;
  lang: 'ar' | 'en';
  onToggleLang: () => void;
  onOpenSearch: () => void;
  cartItems: CartItem[];
  onOpenCart: () => void;
  onNavigateToAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  lang,
  onToggleLang,
  onOpenSearch,
  cartItems,
  onOpenCart,
  onNavigateToAdmin,
}) => {
  const isAr = lang === 'ar';
  const totalCartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalCartBaisa = cartItems.reduce((acc, curr) => {
    const unitPrice = curr.selectedVariant ? curr.selectedVariant.priceBaisa : curr.item.basePriceBaisa;
    return acc + unitPrice * curr.quantity;
  }, 0);

  return (
    <header className="sticky top-0 z-40 bg-[#FFF9EF]/95 backdrop-blur-md border-b border-[#E8D8B5] shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <BrandLogo size="md" />
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Button */}
            <button
              onClick={onOpenSearch}
              className="p-2 sm:px-3 sm:py-2 text-[#755947] hover:text-[#A1312E] hover:bg-[#E8D8B5]/40 rounded-full sm:rounded-lg flex items-center gap-1.5 transition text-sm font-medium"
              title={isAr ? 'بحث في قائمة الطعام' : 'Search Menu'}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
              <span className="hidden sm:inline">{isAr ? 'بحث' : 'Search'}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#C58D38]/50 text-[#755947] hover:text-[#A1312E] hover:border-[#A1312E] hover:bg-[#FFF9EF] rounded-full transition text-xs sm:text-sm font-bold shadow-2xs"
              title={isAr ? 'Switch to English' : 'التحويل إلى العربية'}
            >
              <Globe className="w-4 h-4 text-[#C58D38]" />
              <span>{isAr ? 'English' : 'عربي'}</span>
            </button>

            {/* WhatsApp Direct Contact Button */}
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-full transition flex items-center justify-center"
              title={isAr ? 'تواصل عبر واتساب' : 'Contact via WhatsApp'}
            >
              <MessageCircle className="w-5 h-5 fill-emerald-100" />
            </a>

            {/* Phone Call */}
            <a
              href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
              className="hidden md:flex p-2 text-[#755947] hover:text-[#A1312E] hover:bg-[#E8D8B5]/40 rounded-full transition items-center justify-center"
              title={isAr ? 'اتصال هاتفي' : 'Call restaurant'}
            >
              <Phone className="w-4 h-4" />
            </a>

            {/* Shopping Cart Button - ALWAYS VISIBLE */}
            <button
              onClick={onOpenCart}
              className={`relative flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-2xl transition shadow-sm text-xs sm:text-sm font-black cursor-pointer border ${
                totalCartCount > 0
                  ? 'bg-[#25D366] hover:bg-[#20ba5a] text-white border-white scale-102 ring-2 ring-emerald-300'
                  : 'bg-[#A1312E] hover:bg-[#862724] text-white border-red-300'
              }`}
              title={isAr ? 'عرض سلة الطلبات' : 'View Cart'}
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">
                {totalCartCount > 0
                  ? `${totalCartCount} وجبة • ${formatBaisaToOmr(totalCartBaisa, 'ar')}`
                  : (isAr ? 'سلة الطلبات' : 'Cart')}
              </span>
              <span className="sm:hidden font-bold">
                {isAr ? 'السلة' : 'Cart'}
              </span>
              {totalCartCount > 0 && (
                <span className="bg-[#C58D38] text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center border border-white">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Admin Portal Link - Always Visible */}
            <button
              onClick={onNavigateToAdmin}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#FFF9EF] hover:bg-[#392A23] hover:text-white text-[#A1312E] border-2 border-[#C58D38] rounded-xl transition text-xs font-black shadow-xs cursor-pointer"
              title={isAr ? 'الدخول للوحة تحكم الإدارة وتعديل الأسعار' : 'Admin CMS Portal'}
            >
              <Lock className="w-3.5 h-3.5 text-[#C58D38]" />
              <span className="font-extrabold">{isAr ? 'لوحة الإدارة' : 'Admin CMS'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
