import React from 'react';
import { MenuItem, Category } from '../../types/menu';
import { EasyOrderProductCard } from './EasyOrderProductCard';
import { CATEGORY_IMAGES } from '../../utils/foodImageResolver';
import { Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';

interface EasyOrderFeaturedSplitProps {
  category: Category;
  items: MenuItem[];
  lang: 'ar' | 'en';
  onSelectCategory: (id: string) => void;
  onSelectItem: (item: MenuItem) => void;
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity: (item: MenuItem, newQty: number) => void;
  cartItemCounts: Record<string, number>;
}

export const EasyOrderFeaturedSplit: React.FC<EasyOrderFeaturedSplitProps> = ({
  category,
  items,
  lang,
  onSelectCategory,
  onSelectItem,
  onAddToCart,
  onUpdateQuantity,
  cartItemCounts,
}) => {
  const isAr = lang === 'ar';
  const categoryImage =
    category.imageUrl ||
    CATEGORY_IMAGES[category.id] ||
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80';

  // Take top items to display alongside the category highlight banner
  const displayItems = items.slice(0, 4);

  return (
    <section className="w-full max-w-6xl mx-auto px-3 sm:px-6 pt-6 sm:pt-8 select-none">
      {/* Centered Big Headline "الأكثر مبيعاً" */}
      <div className="text-center mb-4 sm:mb-6">
        <div className="inline-flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-[#d31414] fill-[#d31414]" />
          <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            {isAr ? 'الأكثر مبيعاً وطلباً' : 'Best Sellers & Signature Feasts'}
          </h3>
          <Sparkles className="w-5 h-5 text-[#d31414] fill-[#d31414]" />
        </div>
        <p className="text-xs sm:text-sm text-gray-500 font-semibold max-w-md mx-auto">
          {isAr
            ? 'أطباق وصواني كبدة إسكندراني المميزة الأكثر إقبالاً بتتبيلتنا السرية'
            : 'Most popular customer favorites and signature Alexandrian platters'}
        </p>
      </div>

      {/* Split Layout: Highlight Banner on Right (RTL) + Product Grid on Left */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch">
        {/* Category Highlight Banner (Right side in RTL, 4 cols) */}
        <div
          onClick={() => onSelectCategory(category.id)}
          className="lg:col-span-4 relative rounded-2xl sm:rounded-3xl overflow-hidden min-h-[220px] lg:min-h-[340px] shadow-sm cursor-pointer group flex flex-col justify-center items-center text-center p-6 border border-gray-100"
        >
          {/* Background image */}
          <img
            src={categoryImage}
            alt={isAr ? category.nameAr : category.nameEn}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Dark Overlay for contrast */}
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/70 to-black/85 transition-opacity group-hover:opacity-90" />

          {/* Content inside banner */}
          <div className="relative z-10 flex flex-col items-center">
            <span className="text-[11px] font-black uppercase tracking-widest text-amber-300 bg-black/40 px-3 py-1 rounded-full border border-amber-300/30 mb-2">
              {isAr ? 'قسم مميز' : 'Featured Section'}
            </span>

            <h4 className="text-xl sm:text-2xl font-black text-white drop-shadow-md mb-1.5">
              {isAr ? category.nameAr : category.nameEn}
            </h4>

            <span className="text-xs sm:text-sm text-gray-200 font-medium mb-4">
              {items.length} {isAr ? 'وجبة شهية متوفرة' : 'dishes available'}
            </span>

            <button
              type="button"
              className="inline-flex items-center gap-2 bg-transparent hover:bg-white hover:text-gray-900 text-white font-black px-4 py-2 rounded-xl text-xs sm:text-sm border-2 border-white transition shadow-sm active:scale-95 cursor-pointer"
            >
              <span>{isAr ? 'عرض الكل' : 'View All'}</span>
              {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Product Cards on Left (8 cols) */}
        <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
          {displayItems.map((item) => (
            <EasyOrderProductCard
              key={item.id}
              item={item}
              lang={lang}
              onSelect={onSelectItem}
              onAddToCart={onAddToCart}
              onUpdateQuantity={onUpdateQuantity}
              cartQuantity={cartItemCounts[item.id] || 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
