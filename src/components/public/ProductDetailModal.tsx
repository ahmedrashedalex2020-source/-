import React, { useState, useEffect } from 'react';
import { MenuItem, ProductVariant, formatBaisaToOmr } from '../../types/menu';
import { X, Utensils, CheckCircle, Plus, Minus, ShoppingBag, ShieldCheck } from 'lucide-react';

interface ProductDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
  lang: 'ar' | 'en';
  onAddToCart?: (item: MenuItem, variant?: ProductVariant, quantity?: number) => void;
  enableOrdering?: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  item,
  onClose,
  lang,
  onAddToCart,
  enableOrdering = false,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (item && item.hasVariants && item.variants && item.variants.length > 0) {
      setSelectedVariant(item.variants[0]);
    } else {
      setSelectedVariant(undefined);
    }
    setQuantity(1);
  }, [item]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  const isAr = lang === 'ar';
  const name = isAr ? item.nameAr : item.nameEn;
  const altName = isAr ? item.nameEn : item.nameAr;
  const description = isAr ? item.descriptionAr : item.descriptionEn;
  const portion = isAr ? item.portionDetailsAr : item.portionDetailsEn;
  const accompaniments = isAr ? item.accompanimentsAr : item.accompanimentsEn;

  const currentPriceBaisa = selectedVariant ? selectedVariant.priceBaisa : item.basePriceBaisa;
  const totalPriceBaisa = currentPriceBaisa * quantity;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-[#FFF9EF] w-full max-w-lg rounded-3xl border border-[#E8D8B5] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="relative p-5 pb-3 bg-linear-to-b from-[#F6ECD5] to-[#FFF9EF] border-b border-[#E8D8B5]">
          <button
            onClick={onClose}
            className="absolute top-4 ltr:right-4 rtl:left-4 p-2 bg-white/80 hover:bg-white text-[#755947] hover:text-[#A1312E] rounded-full transition shadow-xs"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-[#A1312E] uppercase tracking-wider">
              {item.sourceImage}
            </span>
            {item.extractionStatus === 'verified' && (
              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>{isAr ? 'سعر موثق من القائمة الأصلية' : 'Verified Price'}</span>
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-[#392A23] leading-snug">
            {name}
          </h2>
          <p className="text-xs sm:text-sm text-[#755947] font-medium mt-0.5">
            {altName}
          </p>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Image if available */}
          {item.imageUrl && (
            <div className="w-full h-48 sm:h-56 rounded-2xl overflow-hidden border border-[#E8D8B5]">
              <img
                src={item.imageUrl}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Description */}
          {description && (
            <div className="bg-white/70 p-3.5 rounded-xl border border-[#E8D8B5]">
              <h4 className="text-xs font-bold text-[#755947] mb-1">
                {isAr ? 'الوصف' : 'Description'}
              </h4>
              <p className="text-sm text-[#392A23] leading-relaxed">
                {description}
              </p>
            </div>
          )}

          {/* Portion & Pieces */}
          {portion && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F6ECD5]/50 border border-[#C58D38]/30">
              <Utensils className="w-4 h-4 text-[#A1312E] shrink-0" />
              <div>
                <span className="text-xs font-bold text-[#755947] block">
                  {isAr ? 'تفاصيل الوجبة والكمية' : 'Portion & Quantity'}
                </span>
                <span className="text-sm font-semibold text-[#392A23]">
                  {portion}
                </span>
              </div>
            </div>
          )}

          {/* Accompaniments */}
          {accompaniments && (
            <div className="p-3 rounded-xl bg-white/70 border border-[#E8D8B5]">
              <span className="text-xs font-bold text-[#755947] block mb-0.5">
                {isAr ? 'المرفقات والإضافات' : 'Included Accompaniments'}
              </span>
              <span className="text-xs sm:text-sm text-[#392A23]">
                {accompaniments}
              </span>
            </div>
          )}

          {/* Variants Selector */}
          {item.hasVariants && item.variants && item.variants.length > 0 && (
            <div className="pt-2">
              <h4 className="text-xs font-bold text-[#755947] mb-2 uppercase tracking-wide">
                {isAr ? 'اختر الحجم أو النوع' : 'Select Size or Format'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {item.variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`p-3 rounded-xl text-start border transition flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#A1312E] bg-white ring-2 ring-[#A1312E]/30 shadow-xs'
                          : 'border-[#E8D8B5] bg-white/50 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#392A23]">
                          {isAr ? v.nameAr : v.nameEn}
                        </span>
                        {isSelected && <CheckCircle className="w-3.5 h-3.5 text-[#A1312E]" />}
                      </div>
                      <span className="text-sm font-extrabold text-[#A1312E] mt-1.5">
                        {formatBaisaToOmr(v.priceBaisa, lang)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Original Source Reference Note */}
          <div className="text-[11px] text-[#755947]/70 border-t border-[#E8D8B5]/50 pt-2 flex items-center justify-between">
            <span>
              {isAr ? `المصدر: ${item.sourceImage}` : `Source: ${item.sourceImage}`}
            </span>
            {item.originalPriceText && (
              <span>
                {isAr ? `السعر بالقائمة: ${item.originalPriceText} ر.ع` : `Listed: ${item.originalPriceText} OMR`}
              </span>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#E8D8B5] flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-[#755947] font-semibold block uppercase">
              {isAr ? 'الإجمالي' : 'Total Price'}
            </span>
            <span className="text-xl sm:text-2xl font-black text-[#A1312E]">
              {item.extractionStatus === 'missing_price' && currentPriceBaisa === 0
                ? (isAr ? 'سعر قيد المراجعة' : 'Pending Price')
                : formatBaisaToOmr(totalPriceBaisa, lang)}
            </span>
          </div>

          {item.isAvailable ? (
            <div className="flex items-center gap-3">
              {/* Quantity Controls */}
              <div className="flex items-center border border-[#E8D8B5] rounded-xl bg-[#FFF9EF] p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 hover:bg-white rounded-lg text-[#755947] transition cursor-pointer"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-3 text-sm font-black text-[#392A23] min-w-[24px] text-center font-mono">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1.5 hover:bg-white rounded-lg text-[#755947] transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to WhatsApp Order Button */}
              <button
                onClick={() => {
                  if (onAddToCart) {
                    onAddToCart(item, selectedVariant, quantity);
                    onClose();
                  }
                }}
                className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] active:scale-95 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-md transition cursor-pointer hover:scale-102"
              >
                <ShoppingBag className="w-4 h-4 fill-white" />
                <span>{isAr ? 'إضافة للطلب بالسلة 🛒' : 'Add to Order 🛒'}</span>
              </button>
            </div>
          ) : (
            <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-xl border border-red-200">
              {isAr ? 'الصنف غير متوفر حالياً' : 'Currently Unavailable'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
