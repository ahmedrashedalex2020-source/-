import React, { useRef, useEffect } from 'react';
import { BrandLogo } from '../brand/BrandLogo';
import { RestaurantSettings, Category, CartItem } from '../../types/menu';
import {
  Search,
  ShoppingCart,
  Globe,
  Lock,
  X,
  MapPin,
  Clock,
  Phone,
} from 'lucide-react';

interface EasyOrderHeaderProps {
  settings: RestaurantSettings;
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  itemCountsByCategory: Record<string, number>;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  cartItems: CartItem[];
  onOpenCart: () => void;
  lang: 'ar' | 'en';
  onToggleLang: () => void;
  onNavigateToAdmin: () => void;
}

export const EasyOrderHeader: React.FC<EasyOrderHeaderProps> = ({
  settings,
  categories,
  selectedCategoryId,
  onSelectCategory,
  itemCountsByCategory,
  searchQuery,
  onSearchChange,
  cartItems,
  onOpenCart,
  lang,
  onToggleLang,
  onNavigateToAdmin,
}) => {
  const isAr = lang === 'ar';
  const totalCartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
  const categoriesScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the active category into view
  useEffect(() => {
    if (!categoriesScrollRef.current) return;
    const activeEl = categoriesScrollRef.current.querySelector(
      `[data-cat-nav="${selectedCategoryId}"]`
    ) as HTMLElement;
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [selectedCategoryId]);

  const publishedCategories = categories.filter((c) => c.isPublished);
  const totalPublishedItems = Object.values(itemCountsByCategory).reduce((a, b) => a + b, 0);

  return (
    <header className="w-full select-none z-40 sticky top-0 shadow-md">
      {/* 1. Top Announcement Bar (#c8102e) */}
      <div className="bg-[#c8102e] text-white text-[11px] sm:text-xs py-1.5 px-3 sm:px-6 flex items-center justify-between border-b border-black/10">
        {/* Subtle Admin Icon on one side */}
        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToAdmin}
            className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition"
            title={isAr ? 'لوحة تحكم الإدارة' : 'Admin Portal'}
            aria-label="Admin"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onToggleLang}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-[10px] sm:text-xs font-bold transition"
            title={isAr ? 'Switch to English' : 'التحويل للعربية'}
          >
            <Globe className="w-3 h-3" />
            <span>{isAr ? 'English' : 'عربي'}</span>
          </button>
        </div>

        {/* Center: Welcome message, branches & operating hours */}
        <div className="flex-1 text-center font-bold truncate px-2 text-white/95">
          <span>
            {isAr
              ? `أهلاً بكم في مطعم كبدة إسكندراني 🇪🇬 🇴🇲 • ${settings.addressAr ? settings.addressAr.split('،')[0] : 'فرع دارسيت مسقط'} • ${settings.openingHoursAr || 'يومياً من 7:00 ص حتى 1:00 ص'}`
              : `Welcome to Alexandrian Liver Restaurant • Darsait Branch • ${settings.openingHoursEn || 'Daily: 7:00 AM - 1:00 AM'}`}
          </span>
        </div>

        {/* Contact Hotline / Phone */}
        <div className="hidden sm:flex items-center gap-1.5 font-bold">
          <Phone className="w-3 h-3 text-amber-300" />
          <a
            href={`tel:${(settings.phone || '92347955').replace(/[^0-9+]/g, '')}`}
            className="hover:underline text-amber-200"
          >
            {settings.phone || '+968 92347955'}
          </a>
        </div>
      </div>

      {/* 2. Main Red Header (#d31414) */}
      <div className="bg-[#d31414] text-white px-3 sm:px-6 py-2.5 sm:py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
          {/* Logo on Right (RTL) */}
          <div
            className="flex items-center gap-2.5 cursor-pointer shrink-0"
            onClick={() => {
              onSelectCategory('all');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white p-1 shadow-sm flex items-center justify-center shrink-0">
              <BrandLogo size="sm" showSubtitle={false} className="scale-90" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white leading-tight font-['Cairo']">
                {isAr ? settings.nameAr || 'كبدة إسكندراني' : settings.nameEn || 'Alexandrian Liver'}
              </span>
              <span className="text-[10px] text-amber-200 font-semibold uppercase tracking-wider">
                {isAr ? 'طعم إسكندراني أصيل 🇪🇬' : 'Authentic Egyptian Flavor'}
              </span>
            </div>
          </div>

          {/* Center Search Bar: Large, Pill-shaped with White Background */}
          <div className="flex-1 max-w-xl relative">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={
                  isAr
                    ? 'ابحث عن صنفك المفضّل... (كبدة، سجق، مشاوي، شاورما)'
                    : 'Search menu... (Liver, sausage, grills, shawarma)'
                }
                className="w-full bg-white text-gray-900 placeholder-gray-400 font-semibold text-xs sm:text-sm rounded-full py-2 sm:py-2.5 ltr:pl-4 ltr:pr-10 rtl:pr-4 rtl:pl-10 shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-300 transition"
              />
              {searchQuery ? (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute ltr:right-3 rtl:left-3 p-1 rounded-full text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <div className="absolute ltr:right-3 rtl:left-3 w-7 h-7 rounded-full bg-[#d31414] text-white flex items-center justify-center shadow-xs pointer-events-none">
                  <Search className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          </div>

          {/* Cart Icon inside White Circle on Left */}
          <div className="shrink-0">
            <button
              onClick={onOpenCart}
              className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-[#d31414] hover:bg-amber-50 active:scale-95 shadow-md flex items-center justify-center cursor-pointer transition"
              aria-label="View Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 w-5 h-5 rounded-full bg-[#c8102e] text-white text-[11px] font-black border-2 border-white flex items-center justify-center animate-bounce">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Sticky Categories Navbar (White background) */}
      <nav className="bg-white border-b border-gray-200 py-1.5 px-3 sm:px-6 shadow-2xs">
        <div className="max-w-6xl mx-auto">
          <div
            ref={categoriesScrollRef}
            className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* All Category Pill */}
            <button
              data-cat-nav="all"
              onClick={() => onSelectCategory('all')}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-extrabold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                selectedCategoryId === 'all'
                  ? 'bg-[#d31414] text-white shadow-sm ring-2 ring-[#d31414]/20 scale-102'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{isAr ? 'الكل' : 'All'}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  selectedCategoryId === 'all'
                    ? 'bg-white/20 text-white'
                    : 'bg-white text-gray-600'
                }`}
              >
                {totalPublishedItems}
              </span>
            </button>

            {publishedCategories.map((category) => {
              const isSelected = selectedCategoryId === category.id;
              const count = itemCountsByCategory[category.id] || 0;

              return (
                <button
                  key={category.id}
                  data-cat-nav={category.id}
                  onClick={() => onSelectCategory(category.id)}
                  className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-extrabold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#d31414] text-white shadow-sm ring-2 ring-[#d31414]/20 scale-102'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{isAr ? category.nameAr : category.nameEn}</span>
                  {count > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-white text-gray-600'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
};
