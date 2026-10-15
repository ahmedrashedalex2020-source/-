import React from 'react';
import { MenuItem, formatBaisaToOmr } from '../../types/menu';
import { Sparkles, Utensils, Plus, Minus, Layers } from 'lucide-react';

interface ProductCardProps {
  item: MenuItem;
  lang: 'ar' | 'en';
  onSelect: (item: MenuItem) => void;
  onAddToCart?: (item: MenuItem) => void;
  onUpdateQuantity?: (item: MenuItem, newQty: number) => void;
  cartQuantity?: number;
  enableOrdering?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  item,
  lang,
  onSelect,
  onAddToCart,
  onUpdateQuantity,
  cartQuantity = 0,
}) => {
  const isAr = lang === 'ar';

  const name = isAr ? item.nameAr : item.nameEn;
  const description = isAr ? item.descriptionAr : item.descriptionEn;
  const portion = isAr ? item.portionDetailsAr : item.portionDetailsEn;

  // Price formatting
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
  }

  // Handle direct Quick Add (+)
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.isAvailable) return;

    if (item.hasVariants) {
      // If item has variants, open size picker
      onSelect(item);
    } else {
      if (cartQuantity === 0) {
        if (onAddToCart) onAddToCart(item);
      } else {
        if (onUpdateQuantity) onUpdateQuantity(item, cartQuantity + 1);
        else if (onAddToCart) onAddToCart(item);
      }
    }
  };

  // Handle Quick Minus (-)
  const handleQuickMinus = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpdateQuantity) {
      onUpdateQuantity(item, Math.max(0, cartQuantity - 1));
    }
  };

  return (
    <div
      onClick={() => onSelect(item)}
      className={`group relative bg-white hover:bg-[#FFFDF9] rounded-2xl border transition-all duration-200 cursor-pointer p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-2xs hover:shadow-md ${
        cartQuantity > 0
          ? 'border-[#8B1E1E]/40 ring-1 ring-[#8B1E1E]/20 bg-[#FFFBF8]'
          : 'border-[#E8D8B5]/80 hover:border-[#8B1E1E]/30'
      } ${!item.isAvailable ? 'opacity-65 bg-stone-50' : ''}`}
    >
      {/* Left / Right Content: Name, Description, Price, Portion */}
      <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
        <div>
          {/* Badges row */}
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            {item.isFeatured && (
              <span className="inline-flex items-center gap-1 bg-[#FFF4DC] text-[#8B1E1E] border border-[#D97706]/30 text-[10px] font-black px-1.5 py-0.2 rounded-md">
                <Sparkles className="w-2.5 h-2.5 text-[#D97706] fill-[#D97706]" />
                <span>{isAr ? 'مميز' : 'Popular'}</span>
              </span>
            )}
            {item.hasVariants && (
              <span className="inline-flex items-center gap-1 bg-[#FAF2EB] text-[#755947] border border-[#E8D8B5] text-[10px] font-bold px-1.5 py-0.2 rounded-md">
                <Layers className="w-2.5 h-2.5 text-[#D97706]" />
                <span>{isAr ? 'أحجام' : 'Sizes'}</span>
              </span>
            )}
            {!item.isAvailable && (
              <span className="bg-red-50 text-red-600 border border-red-200 text-[10px] font-bold px-1.5 py-0.2 rounded-md">
                {isAr ? 'نافذ' : 'Sold out'}
              </span>
            )}
          </div>

          {/* Item Name */}
          <h3 className="text-sm sm:text-base font-black text-[#2C1810] group-hover:text-[#8B1E1E] transition-colors leading-snug truncate">
            {name}
          </h3>

          {/* Short Description */}
          {description && (
            <p className="text-[11px] sm:text-xs text-[#755947] mt-0.5 line-clamp-1 sm:line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}

          {/* Portion details if present */}
          {portion && (
            <span className="text-[10px] text-[#A8795A] font-semibold mt-1 inline-block">
              {portion}
            </span>
          )}
        </div>

        {/* Bottom Row: Price & Inline Quantity Stepper */}
        <div className="mt-2 flex items-center justify-between gap-2 pt-1 border-t border-dashed border-[#E8D8B5]/60">
          {/* Price */}
          <div className="flex items-baseline gap-1">
            <span className="text-sm sm:text-base font-black text-[#8B1E1E] font-mono tracking-tight">
              {priceDisplay}
            </span>
          </div>

          {/* Interactive Quick Add / Counter Button */}
          {item.isAvailable ? (
            <div>
              {cartQuantity === 0 ? (
                <button
                  type="button"
                  onClick={handleQuickAdd}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#8B1E1E] hover:bg-[#721818] active:scale-95 text-white text-xs font-black shadow-2xs transition cursor-pointer"
                  title={isAr ? 'إضافة للسلة' : 'Add to cart'}
                  aria-label="Add to cart"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{item.hasVariants ? (isAr ? 'اختر' : 'Pick') : (isAr ? 'أضف' : 'Add')}</span>
                </button>
              ) : (
                /* Inline Stepper (+ / count / -) */
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 bg-[#8B1E1E] text-white rounded-xl p-1 shadow-sm transition"
                >
                  <button
                    type="button"
                    onClick={handleQuickMinus}
                    className="w-6 h-6 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 text-white transition active:scale-90"
                    title={isAr ? 'تقليل الكمية' : 'Decrease'}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3 h-3" />
                  </button>

                  <span className="text-xs font-black px-1.5 min-w-[20px] text-center font-mono">
                    {cartQuantity}
                  </span>

                  <button
                    type="button"
                    onClick={handleQuickAdd}
                    className="w-6 h-6 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 text-white transition active:scale-90"
                    title={isAr ? 'زيادة الكمية' : 'Increase'}
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <span className="text-[10px] text-stone-400 font-bold">
              {isAr ? 'غير متوفر' : 'Unavailable'}
            </span>
          )}
        </div>
      </div>

      {/* Side Image Thumbnail (Square with Rounded Corners) */}
      <div className="relative w-22 h-22 sm:w-24 sm:h-24 shrink-0 rounded-2xl overflow-hidden bg-[#FAF5EC] border border-[#E8D8B5] shadow-2xs flex items-center justify-center">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-2 text-center text-[#755947]">
            <Utensils className="w-6 h-6 text-[#8B1E1E]/50 mb-0.5" />
            <span className="text-[9px] font-bold opacity-60">كبدة إسكندراني</span>
          </div>
        )}

        {/* Floating Cart Badge on Image if in Cart */}
        {cartQuantity > 0 && (
          <div className="absolute top-1 ltr:right-1 rtl:left-1 w-5 h-5 rounded-full bg-[#D97706] text-white text-[10px] font-black flex items-center justify-center shadow-xs border border-white">
            {cartQuantity}
          </div>
        )}
      </div>
    </div>
  );
};
