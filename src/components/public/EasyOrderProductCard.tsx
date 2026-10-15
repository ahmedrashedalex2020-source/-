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

  // Calculate promotional original price (if item is featured or has discount)
  // For authentic retail appeal like EasyOrder, featured items show ~15% discount
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
      className={`bg-white rounded-2xl border transition-all duration-200 p-2.5 sm:p-3 flex flex-col justify-between cursor-pointer group shadow-xs hover:shadow-md ${
        cartQuantity > 0
          ? 'border-[#d31414]/50 ring-2 ring-[#d31414]/15'
          : 'border-gray-100 hover:border-gray-200'
      } ${!item.isAvailable ? 'opacity-65' : ''}`}
    >
      <div>
        {/* Top: 1:1 Square Image with Badges */}
        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-50 mb-2.5">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />

          {/* Discount Badge in top corner */}
          {hasDiscount && item.isAvailable && (
            <div className="absolute top-2 start-2 bg-[#FFEBEB] text-[#D31414] font-black text-[11px] px-2 py-0.5 rounded-lg border border-[#FFCDCD] shadow-xs">
              -{discountPercent}%
            </div>
          )}

          {/* Sizes / Variants badge */}
          {item.hasVariants && (
            <div className="absolute bottom-2 start-2 bg-black/60 backdrop-blur-xs text-white font-bold text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1">
              <Layers className="w-3 h-3 text-amber-300" />
              <span>{isAr ? 'أحجام متعددة' : 'Variants'}</span>
            </div>
          )}

          {/* Out of Stock Badge */}
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center">
              <span className="bg-red-600 text-white font-bold text-xs px-3 py-1 rounded-full shadow-sm">
                {isAr ? 'نفذت الكمية' : 'Sold Out'}
              </span>
            </div>
          )}
        </div>

        {/* Item Name */}
        <h4 className="text-center font-extrabold text-gray-900 text-xs sm:text-sm leading-snug line-clamp-1 mb-1 group-hover:text-[#d31414] transition">
          {name}
        </h4>

        {/* Brief description */}
        {description && (
          <p className="text-center text-[11px] text-gray-500 line-clamp-1 mb-1.5 font-normal">
            {description}
          </p>
        )}

        {/* Price Row: Current Price in bold, struck-through original price */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="font-extrabold text-sm sm:text-base text-gray-950 font-mono">
            {item.hasVariants && isAr ? 'من ' : ''}
            {formatBaisaToOmr(currentPriceBaisa, lang)}
          </span>

          {hasDiscount && (
            <span className="text-[11px] sm:text-xs text-gray-400 line-through font-mono">
              {formatBaisaToOmr(originalPriceBaisa, lang)}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Button: Full width EasyOrder Red Button */}
      <div className="mt-auto pt-1">
        {cartQuantity > 0 && !item.hasVariants ? (
          /* Interactive Counter Button */
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-[#d31414] text-white py-1.5 px-2 rounded-xl flex items-center justify-between shadow-xs font-bold text-xs"
          >
            <button
              onClick={handleMinusClick}
              className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 active:scale-90 flex items-center justify-center transition cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-sm font-black">{cartQuantity}</span>
            <button
              onClick={handleAddClick}
              className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 active:scale-90 flex items-center justify-center transition cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          /* Standard Add to Cart Button */
          <button
            type="button"
            disabled={!item.isAvailable}
            onClick={handleAddClick}
            className={`w-full py-2 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition duration-150 shadow-xs cursor-pointer ${
              item.isAvailable
                ? 'bg-[#d31414] hover:bg-[#b50e0e] active:scale-98 text-white'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
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
