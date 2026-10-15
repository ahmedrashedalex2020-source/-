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
  Phone,
  MessageCircle,
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
      {/* 1. Top Announcement Bar - Weathered Antique Espresso (#261309) with Gold Border */}
      <div className="bg-[#261309] text-[#F5E8CB] text-[11px] sm:text-xs py-1.5 px-3 sm:px-6 flex items-center justify-between border-b-2 border-[#C89D4B]">
        {/* Language Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleLang}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-[#F5E8CB] text-[10px] sm:text-xs font-bold transition border border-[#C89D4B]/40 cursor-pointer"
            title={isAr ? 'Switch to English' : 'التحويل للعربية'}
          >
            <Globe className="w-3 h-3 text-[#EEA323]" />
            <span>{isAr ? 'English' : 'عربي'}</span>
          </button>
        </div>

        {/* Center: Exact location & info from the paper menu */}
        <div className="flex-1 text-center font-bold truncate px-2 text-[#FAF1DC]">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#B81D22] shrink-0" />
            <span>
              {isAr
                ? 'دارسيت أمام بلدية مسقط وقريب من لولو هايبر ماركت'
                : 'Darsait in front of Muscat Municipality & close to Lulu Hypermarket'}
            </span>
          </span>
        </div>

        {/* Contact Badges matching paper menu: WhatsApp (79348565) & Phone (92347955) */}
        <div className="hidden sm:flex items-center gap-3 font-bold text-xs">
          <a
            href="https://wa.me/96879348565"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-mono"
            title="WhatsApp Order"
          >
            <div className="w-4 h-4 rounded-full bg-emerald-500 text-black flex items-center justify-center">
              <MessageCircle className="w-2.5 h-2.5 fill-black" />
            </div>
            <span>79348565</span>
          </a>

          <a
            href="tel:+96892347955"
            className="inline-flex items-center gap-1 text-[#EEA323] hover:text-amber-200 font-mono"
            title="Call"
          >
            <Phone className="w-3.5 h-3.5 text-[#EEA323]" />
            <span>92347955</span>
          </a>
        </div>
      </div>

      {/* 2. Main Header - Aged Golden Parchment (#F8EFD8) with Authentic Paper Menu Logo */}
      <div className="bg-[#F8EFD8] border-b-2 border-[#C89D4B] px-3 sm:px-6 py-2.5 sm:py-3 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
          {/* Logo on Right (RTL) - Matches Paper Menu */}
          <div
            className="flex items-center gap-2 cursor-pointer shrink-0"
            onClick={() => {
              onSelectCategory('all');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <BrandLogo size="md" showSubtitle={true} />
          </div>

          {/* Center Search Bar: Ivory Parchment with Gold Border */}
          <div className="flex-1 max-w-lg relative">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={
                  isAr
                    ? 'ابحث عن وجبتك المفضلة... (كبدة إسكندراني، شاورما، مشاوي، فطائر)'
                    : 'Search menu... (Alexandrian Liver, shawarma, grills, pastry)'
                }
                className="w-full bg-[#FFFDF9] text-[#2B160C] placeholder-stone-500 font-bold text-xs sm:text-sm rounded-full py-2.5 sm:py-3 ltr:pl-4 ltr:pr-10 rtl:pr-4 rtl:pl-10 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#B81D22] transition border-2 border-[#D7B77C]"
              />
              {searchQuery ? (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute ltr:right-3 rtl:left-3 p-1 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <div className="absolute ltr:right-3 rtl:left-3 w-8 h-8 rounded-full bg-[#B81D22] text-[#F8EFD8] flex items-center justify-center shadow-xs pointer-events-none">
                  <Search className="w-4 h-4" />
                </div>
              )}
            </div>
          </div>

          {/* Cart Icon inside Golden Button on Left */}
          <div className="shrink-0">
            <button
              onClick={onOpenCart}
              className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#FFFDF9] text-[#B81D22] hover:bg-[#FAF0D9] active:scale-95 shadow-md flex items-center justify-center cursor-pointer transition border-2 border-[#C89D4B]"
              aria-label="View Cart"
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#B81D22] text-[#FFF9EA] text-[11px] sm:text-xs font-black border-2 border-[#EEA323] flex items-center justify-center animate-bounce shadow-sm">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Sticky Categories Navbar (Aged Papyrus Tone with Crimson Badges) */}
      <nav className="bg-[#F3E5C8] border-b-2 border-[#D4B57E] py-1.5 px-3 sm:px-6 shadow-xs">
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
                  ? 'bg-[#B81D22] text-white shadow-md ring-2 ring-[#EEA323] scale-102'
                  : 'bg-[#FFFDF7] border border-[#DEC391] text-[#2B160C] hover:bg-[#FAF0D9]'
              }`}
            >
              <span>{isAr ? 'الكل' : 'All'}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  selectedCategoryId === 'all'
                    ? 'bg-white/20 text-white'
                    : 'bg-[#F3E5C8] text-[#5A3821] border border-[#DEC391]'
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
                      ? 'bg-[#B81D22] text-white shadow-md ring-2 ring-[#EEA323] scale-102'
                      : 'bg-[#FFFDF7] border border-[#DEC391] text-[#2B160C] hover:bg-[#FAF0D9]'
                  }`}
                >
                  <span>{isAr ? category.nameAr : category.nameEn}</span>
                  {count > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-[#F3E5C8] text-[#5A3821] border border-[#DEC391]'
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
