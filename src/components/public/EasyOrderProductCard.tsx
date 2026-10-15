import React from 'react';
import { MenuItem, formatBaisaToOmr } from '../../types/menu';
import { getProductImageUrl } from '../../utils/foodImageResolver';
import { ShoppingCart, Plus, Minus, Layers } from 'lucide-react';

interface EasyOrderProductCardProps {
  item: MenuItem;
  lang: 'ar' | 'en';
  onSelect: (item: MenuItem) => void;
  onAddToCart: (item: MenuItem) => void;
  onUpdateQuantity?: (item: MenuItem, newQty: number) => void;
  cartQuantity?: number;
}

export const EasyOrderProductCard: React.FC<EasyOrderProductCardProps> = ({
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

  // Resolve image
  const imageUrl = getProductImageUrl(item.id, item.categoryId, item.imageUrl);

  // Price calculations
  let currentPriceBaisa = item.basePriceBaisa;
  if (item.hasVariants && item.variants && item.variants.length > 0) {
    const min = Math.min(...item.variants.map((v) => v.priceBaisa));
    currentPriceBaisa = min;
  }

  // Promotional price badge for featured items
  const hasDiscount = item.isFeatured || (item.basePriceBaisa > 800 && item.displayOrder % 2 === 0);
  const discountPercent = hasDiscount ? (item.basePriceBaisa > 1500 ? 15 : 12) : 0;
  const originalPriceBaisa = hasDiscount
    ? Math.round((currentPriceBaisa * 100) / (100 - discountPercent))
    : currentPriceBaisa;

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.isAvailable) return;
    if (item.hasVariants) {
      onSelect(item);
    } else {
      if (cartQuantity === 0) {
        onAddToCart(item);
      } else if (onUpdateQuantity) {
        onUpdateQuantity(item, cartQuantity + 1);
      } else {
        onAddToCart(item);
      }
    }
  };

  const handleMinusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpdateQuantity) {
      onUpdateQuantity(item, Math.max(0, cartQuantity - 1));
    }
  };

  return (
    <div
      onClick={() => onSelect(item)}
      className={`rounded-2xl border-2 transition-all duration-200 p-2.5 sm:p-3 flex flex-col justify-between cursor-pointer group shadow-xs hover:shadow-md ${
        cartQuantity > 0
          ? 'bg-[#FFFDF7] border-[#B81D22] ring-2 ring-[#EEA323]/40'
          : 'bg-[#FFFDF9] border-[#DEC495] hover:border-[#C89D4B]'
      } ${!item.isAvailable ? 'opacity-65' : ''}`}
    >
      <div>
        {/* Top: 1:1 Square Image with Badges */}
        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white mb-2.5 border border-[#E5CE9F]">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />

          {/* Discount Badge in top corner */}
          {hasDiscount && item.isAvailable && (
            <div className="absolute top-2 start-2 bg-[#FFF2F0] text-[#B81D22] font-black text-[11px] px-2 py-0.5 rounded-lg border border-[#F3B3B3] shadow-xs">
              -{discountPercent}%
            </div>
          )}

          {/* Sizes / Variants badge */}
          {item.hasVariants && (
            <div className="absolute bottom-2 start-2 bg-[#2B160C]/80 backdrop-blur-xs text-[#FAF1DC] font-bold text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 border border-[#C89D4B]/40">
              <Layers className="w-3 h-3 text-[#EEA323]" />
              <span>{isAr ? 'أحجام متعددة' : 'Variants'}</span>
            </div>
          )}

          {/* Out of Stock Badge */}
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-[#F5E8CB]/85 backdrop-blur-xs flex items-center justify-center">
              <span className="bg-[#B81D22] text-white font-bold text-xs px-3 py-1 rounded-full shadow-sm">
                {isAr ? 'نفذت الكمية' : 'Sold Out'}
              </span>
            </div>
          )}
        </div>

        {/* Item Name in Dark Wood Brown */}
        <h4 className="text-center font-extrabold text-[#261309] text-xs sm:text-sm leading-snug line-clamp-1 mb-1 group-hover:text-[#B81D22] transition font-['Cairo']">
          {name}
        </h4>

        {/* Brief description in Warm Leather Brown */}
        {description && (
          <p className="text-center text-[11px] text-[#6A472E] line-clamp-1 mb-1.5 font-medium">
            {description}
          </p>
        )}

        {/* Price Row: Current Price in bold, struck-through original price */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="font-extrabold text-sm sm:text-base text-[#261309] font-mono">
            {item.hasVariants && isAr ? 'من ' : ''}
            {formatBaisaToOmr(currentPriceBaisa, lang)}
          </span>

          {hasDiscount && (
            <span className="text-[11px] sm:text-xs text-[#8C6D54] line-through font-mono">
              {formatBaisaToOmr(originalPriceBaisa, lang)}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Button: Full width Crimson Red Button with Ochre Accent */}
      <div className="mt-auto pt-1">
        {cartQuantity > 0 && !item.hasVariants ? (
          /* Interactive Counter Button */
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-[#B81D22] text-[#FFF9EA] py-1.5 px-2 rounded-xl flex items-center justify-between shadow-xs font-bold text-xs border border-[#EEA323]/50"
          >
            <button
              onClick={handleMinusClick}
              className="w-7 h-7 rounded-lg bg-black/20 hover:bg-black/35 active:scale-90 flex items-center justify-center transition cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-sm font-black">{cartQuantity}</span>
            <button
              onClick={handleAddClick}
              className="w-7 h-7 rounded-lg bg-black/20 hover:bg-black/35 active:scale-90 flex items-center justify-center transition cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          /* Standard Add to Cart Button in Crimson Red */
          <button
            type="button"
            disabled={!item.isAvailable}
            onClick={handleAddClick}
            className={`w-full py-2 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition duration-150 shadow-xs cursor-pointer ${
              item.isAvailable
                ? 'bg-[#B81D22] hover:bg-[#9E151A] active:scale-98 text-[#FFF9EA] border border-[#EEA323]/40'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>{isAr ? 'أضف للسلة' : 'Add to Cart'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
