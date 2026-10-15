import React from 'react';
import { MenuItem, formatBaisaToOmr } from '../../types/menu';
import { Sparkles, Utensils, AlertCircle, Eye, ShoppingBag, Plus, Check } from 'lucide-react';

interface ProductCardProps {
  item: MenuItem;
  lang: 'ar' | 'en';
  onSelect: (item: MenuItem) => void;
  onAddToCart?: (item: MenuItem) => void;
  enableOrdering?: boolean;
  cartQuantity?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  item,
  lang,
  onSelect,
  onAddToCart,
  cartQuantity = 0,
}) => {
  const isAr = lang === 'ar';

  const name = isAr ? item.nameAr : item.nameEn;
  const description = isAr ? item.descriptionAr : item.descriptionEn;
  const portion = isAr ? item.portionDetailsAr : item.portionDetailsEn;
  const accompaniments = isAr ? item.accompanimentsAr : item.accompanimentsEn;

  // Pricing display
  let priceDisplay = formatBaisaToOmr(item.basePriceBaisa, lang);
  if (item.hasVariants && item.variants && item.variants.length > 0) {
    const minPrice = Math.min(...item.variants.map((v) => v.priceBaisa));
    const maxPrice = Math.max(...item.variants.map((v) => v.priceBaisa));
    if (minPrice === maxPrice) {
      priceDisplay = formatBaisaToOmr(minPrice, lang);
    } else {
      priceDisplay = isAr
        ? `من ${formatBaisaToOmr(minPrice, lang)}`
        : `From ${formatBaisaToOmr(minPrice, lang)}`;
    }
  } else if (item.extractionStatus === 'missing_price' || item.basePriceBaisa === 0) {
    priceDisplay = isAr ? 'السعر حسب الطلب / مراجعة' : 'Market Price / Review';
  }

  const handleCardClick = () => {
    onSelect(item);
  };

  const handleAddButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.hasVariants) {
      // If item has variants, open modal so customer picks their size
      onSelect(item);
    } else {
      // Direct add to cart
      if (onAddToCart) onAddToCart(item);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative bg-white rounded-3xl border-2 transition-all duration-200 hover:shadow-xl cursor-pointer flex flex-col justify-between p-4 sm:p-5 ${
        cartQuantity > 0
          ? 'border-emerald-500 ring-2 ring-emerald-200 bg-emerald-50/10'
          : 'border-[#E8D8B5] hover:border-[#A1312E]'
      } ${!item.isAvailable ? 'opacity-70 bg-gray-50/80' : ''}`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            {item.isFeatured && (
              <span className="inline-flex items-center gap-1 bg-[#FFF4DC] text-[#A1312E] border border-[#C58D38]/40 text-[11px] font-black px-2.5 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-[#C58D38] fill-[#C58D38]" />
                <span>{isAr ? 'مميز' : 'Featured'}</span>
              </span>
            )}
            {item.hasVariants && (
              <span className="bg-[#437E9D]/15 text-[#437E9D] border border-[#437E9D]/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                {isAr
                  ? `${item.variants?.length || 3} أحجام`
                  : `${item.variants?.length || 3} Sizes`}
              </span>
            )}
            {cartQuantity > 0 && (
              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-black px-2.5 py-0.5 rounded-full animate-in zoom-in">
                <Check className="w-3 h-3" />
                <span>{isAr ? `${cartQuantity} بالسلة` : `${cartQuantity} in Cart`}</span>
              </span>
            )}
            {item.extractionStatus === 'missing_price' && (
              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md">
                <AlertCircle className="w-3 h-3" />
                <span>{isAr ? 'السعر قيد المراجعة' : 'Price Review'}</span>
              </span>
            )}
          </div>

          {!item.isAvailable && (
            <span className="bg-red-50 text-red-600 border border-red-200 text-[11px] font-black px-2.5 py-0.5 rounded-lg">
              {isAr ? 'غير متوفر (نافذ)' : 'Sold Out'}
            </span>
          )}
        </div>

        {/* Product Title & Details */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-black text-[#392A23] group-hover:text-[#A1312E] transition-colors leading-snug">
              {name}
            </h3>

            {/* Sub-name in alternative language for authenticity */}
            <p className="text-xs text-[#755947]/70 font-semibold mt-0.5 font-['Inter']">
              {isAr ? item.nameEn : item.nameAr}
            </p>

            {/* Description */}
            {description && (
              <p className="text-xs text-[#755947] mt-1.5 line-clamp-2 leading-relaxed">
                {description}
              </p>
            )}

            {/* Portion info / pieces */}
            {portion && (
              <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-[#A1312E] bg-[#FFF9EF] px-2.5 py-1 rounded-xl border border-[#E8D8B5] font-bold">
                <Utensils className="w-3 h-3 text-[#C58D38]" />
                <span>{portion}</span>
              </div>
            )}

            {/* Accompaniments */}
            {accompaniments && !portion && (
              <p className="mt-1.5 text-[11px] text-[#755947]/80 italic">
                {accompaniments}
              </p>
            )}
          </div>

          {/* Thumbnail */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-2xl overflow-hidden bg-[#FFF9EF] border-2 border-[#E8D8B5] flex items-center justify-center text-[#C58D38] group-hover:border-[#C58D38] transition shadow-xs">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-2 text-center">
                <Utensils className="w-7 h-7 text-[#A1312E]/40 mb-1" />
                <span className="text-[9px] text-[#755947]/70 font-bold leading-tight">
                  كبدة إسكندراني
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer / Price & Add to Cart Button */}
      <div className="mt-4 pt-3 border-t border-[#E8D8B5] flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-[10px] text-[#755947] font-bold uppercase tracking-wider">
            {isAr ? 'السعر' : 'Price'}
          </span>
          <span className="text-base sm:text-lg font-black text-[#A1312E] tracking-tight font-mono">
            {priceDisplay}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Eye View */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(item);
            }}
            className="p-2 text-[#755947] hover:text-[#A1312E] hover:bg-[#FFF9EF] rounded-xl transition border border-[#E8D8B5] cursor-pointer"
            title={isAr ? 'عرض التفاصيل' : 'View details'}
            aria-label="View details"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* PROMINENT ADD TO CART BUTTON */}
          {item.isAvailable ? (
            <button
              onClick={handleAddButtonClick}
              className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition shadow-md hover:scale-105 active:scale-95 cursor-pointer ${
                cartQuantity > 0
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-300'
                  : 'bg-[#A1312E] hover:bg-[#862724] text-white'
              }`}
              title={isAr ? 'إضافة إلى سلة الطلبات' : 'Add to cart'}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>
                {item.hasVariants
                  ? isAr ? 'اختيار الحجم 🛒' : 'Select Size 🛒'
                  : isAr ? 'أضف للسلة 🛒' : 'Add to Cart 🛒'}
              </span>
            </button>
          ) : (
            <span className="text-[11px] font-bold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-xl">
              {isAr ? 'غير متوفر' : 'Sold Out'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
