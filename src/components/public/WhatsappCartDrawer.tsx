import React, { useState } from 'react';
import { CartItem, RestaurantSettings, formatBaisaToOmr } from '../../types/menu';
import {
  X,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  ShoppingBag,
  User,
  Phone,
  MapPin,
  UtensilsCrossed,
  FileText,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface WhatsappCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  settings: RestaurantSettings;
  lang: 'ar' | 'en';
}

export const WhatsappCartDrawer: React.FC<WhatsappCartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  settings,
  lang,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderType, setOrderType] = useState<'dinein' | 'takeaway' | 'delivery'>('takeaway');
  const [addressOrTable, setAddressOrTable] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const isAr = lang === 'ar';

  const totalBaisa = cartItems.reduce((acc, curr) => {
    const unitPrice = curr.selectedVariant
      ? curr.selectedVariant.priceBaisa
      : curr.item.basePriceBaisa;
    return acc + unitPrice * curr.quantity;
  }, 0);

  const totalQuantity = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  const handleSendWhatsappOrder = () => {
    setValidationError(null);

    // Form Validation
    if (cartItems.length === 0) {
      setValidationError(isAr ? 'السلة فارغة، اختر أصنافك أولاً' : 'Cart is empty');
      return;
    }

    if (!customerName.trim()) {
      setValidationError(isAr ? 'من فضلك اكتب اسمك لتسجيل الطلب' : 'Please enter your name');
      return;
    }

    if (!customerPhone.trim() || customerPhone.trim().length < 6) {
      setValidationError(isAr ? 'من فضلك اكتب رقم تليفونك للتواصل وتأكيد الطلب' : 'Please enter your phone number');
      return;
    }

    if (orderType === 'dinein' && !addressOrTable.trim()) {
      setValidationError(isAr ? 'من فضلك اكتب رقم الطاولة داخل المطعم' : 'Please enter table number');
      return;
    }

    if (orderType === 'delivery' && !addressOrTable.trim()) {
      setValidationError(isAr ? 'من فضلك اكتب عنوان التوصيل بالتفصيل' : 'Please provide delivery address');
      return;
    }

    const orderTypeLabel = {
      dinein: isAr ? 'تناول بالصالة (داخل المطعم)' : 'Dine-in (Table)',
      takeaway: isAr ? 'استلام من المطعم (سفري / تيك أواي)' : 'Takeaway / Pick-up',
      delivery: isAr ? 'توصيل للمنزل' : 'Home Delivery',
    }[orderType];

    const now = new Date();
    const timeStr = now.toLocaleTimeString(isAr ? 'ar-OM' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    let message = `*طلب جديد من المنيو الرقمي — مطعم كبدة إسكندراني* 🍽️\n`;
    message += `📅 التاريخ والوقت: ${timeStr}\n`;
    message += `👤 اسم العميل: ${customerName.trim()}\n`;
    message += `📞 رقم التليفون: ${customerPhone.trim()}\n`;
    message += `🛵 نوع الطلب: ${orderTypeLabel}\n`;

    if (orderType === 'dinein') {
      message += `🪑 رقم الطاولة: ${addressOrTable.trim()}\n`;
    } else if (orderType === 'delivery') {
      message += `📍 عنوان التوصيل: ${addressOrTable.trim()}\n`;
    }

    if (orderNotes.trim()) {
      message += `📝 ملاحظات خاصة: ${orderNotes.trim()}\n`;
    }

    message += `\n*🛒 تفاصيل الأصناف والكميات:*\n`;
    message += `--------------------------------\n`;

    cartItems.forEach((ci, idx) => {
      const itemName = isAr ? ci.item.nameAr : ci.item.nameEn;
      const variantText = ci.selectedVariant
        ? ` (${isAr ? ci.selectedVariant.nameAr : ci.selectedVariant.nameEn})`
        : '';
      const unitPrice = ci.selectedVariant
        ? ci.selectedVariant.priceBaisa
        : ci.item.basePriceBaisa;
      const lineTotal = formatBaisaToOmr(unitPrice * ci.quantity, 'ar');

      message += `${idx + 1}. *${itemName}${variantText}*\n`;
      message += `   الكمية: ${ci.quantity} × ${formatBaisaToOmr(unitPrice, 'ar')} = ${lineTotal}\n`;
    });

    message += `--------------------------------\n`;
    message += `*💰 إجمالي الطلب: ${formatBaisaToOmr(totalBaisa, 'ar')}*\n`;
    message += `\nبرجاء تأكيد استلام الطلب وتجهيزه. شكراً لكم!`;

    const cleanNumber = (settings.whatsapp || '79348565').replace(/[^0-9]/g, '');
    let finalPhone = cleanNumber;
    if (finalPhone.length === 8 && (finalPhone.startsWith('9') || finalPhone.startsWith('7'))) {
      finalPhone = `968${finalPhone}`;
    }

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${finalPhone}?text=${encoded}`;

    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex flex-col justify-end sm:justify-center items-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Bottom Sheet Container */}
      <div className="relative w-full sm:max-w-lg bg-[#FFFDF9] rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] flex flex-col z-10 animate-in slide-in-from-bottom duration-300 border-t sm:border border-[#E8D8B5]">
        {/* Mobile Pull Handle Indicator */}
        <div className="w-12 h-1.5 bg-[#E8D8B5] rounded-full mx-auto mt-3 mb-1 shrink-0" />

        {/* Sheet Header */}
        <div className="px-4 py-3 border-b border-[#E8D8B5]/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#8B1E1E]/10 flex items-center justify-center text-[#8B1E1E]">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#2C1810]">
                {isAr ? 'سلة الطلبات' : 'Your Order Cart'}
              </h3>
              <p className="text-[11px] text-[#755947] font-semibold">
                {totalQuantity} {isAr ? 'وجبة مختارة' : 'items'} • {formatBaisaToOmr(totalBaisa, lang)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cartItems.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-[11px] text-red-600 hover:text-red-700 font-bold px-2 py-1 rounded-lg hover:bg-red-50 transition"
              >
                {isAr ? 'تفريغ' : 'Clear'}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Sheet Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {cartItems.length === 0 ? (
            <div className="text-center py-12 text-[#755947]">
              <div className="w-16 h-16 bg-[#FAF5EC] rounded-full flex items-center justify-center mx-auto mb-3 border border-[#E8D8B5]">
                <ShoppingBag className="w-8 h-8 text-[#8B1E1E]" />
              </div>
              <p className="font-black text-base text-[#2C1810]">
                {isAr ? 'السلة فارغة حالياً' : 'Your cart is empty'}
              </p>
              <p className="text-xs text-[#755947] mt-1">
                {isAr ? 'اضغط على زر (+) بجوار أي وجبة لإضافتها هنا' : 'Tap (+) on any meal to add it here'}
              </p>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="space-y-2">
                {cartItems.map((ci, index) => {
                  const itemName = isAr ? ci.item.nameAr : ci.item.nameEn;
                  const variantName = ci.selectedVariant
                    ? isAr ? ci.selectedVariant.nameAr : ci.selectedVariant.nameEn
                    : null;
                  const unitPrice = ci.selectedVariant
                    ? ci.selectedVariant.priceBaisa
                    : ci.item.basePriceBaisa;

                  return (
                    <div
                      key={`${ci.item.id}-${ci.selectedVariant?.id || 'base'}-${index}`}
                      className="bg-white p-3 rounded-2xl border border-[#E8D8B5] flex items-center justify-between gap-2.5 shadow-2xs"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-black text-[#2C1810] truncate">
                          {itemName}
                        </h4>
                        {variantName && (
                          <span className="text-[11px] text-[#D97706] font-bold block">
                            {isAr ? `الحجم: ${variantName}` : `Size: ${variantName}`}
                          </span>
                        )}
                        <span className="text-xs font-black text-[#8B1E1E] font-mono mt-0.5 block">
                          {formatBaisaToOmr(unitPrice * ci.quantity, lang)}
                        </span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1.5 bg-[#FAF5EC] border border-[#E8D8B5] rounded-xl p-1 shrink-0">
                        <button
                          onClick={() => onUpdateQuantity(index, ci.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center rounded-lg bg-white text-[#5C3E2E] shadow-2xs hover:bg-[#8B1E1E] hover:text-white transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-black text-[#2C1810] w-5 text-center font-mono">
                          {ci.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(index, ci.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center rounded-lg bg-white text-[#5C3E2E] shadow-2xs hover:bg-[#8B1E1E] hover:text-white transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(index)}
                        className="p-1.5 text-stone-300 hover:text-red-600 transition"
                        title={isAr ? 'حذف' : 'Remove'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Order Options & Customer Form */}
              <div className="bg-white p-3.5 rounded-2xl border border-[#E8D8B5] space-y-3 shadow-2xs">
                {/* Order Type Tabs */}
                <div>
                  <label className="text-xs font-black text-[#5C3E2E] block mb-1.5">
                    {isAr ? 'طريقة الاستلام:' : 'Order Type:'}
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 bg-[#FAF5EC] p-1 rounded-xl border border-[#E8D8B5]">
                    <button
                      type="button"
                      onClick={() => setOrderType('dinein')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-black transition flex flex-col items-center gap-0.5 ${
                        orderType === 'dinein'
                          ? 'bg-[#8B1E1E] text-white shadow-xs'
                          : 'text-[#755947] hover:bg-white/50'
                      }`}
                    >
                      <UtensilsCrossed className="w-3.5 h-3.5" />
                      <span>{isAr ? 'صالة (طاولة)' : 'Dine-in'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOrderType('takeaway')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-black transition flex flex-col items-center gap-0.5 ${
                        orderType === 'takeaway'
                          ? 'bg-[#8B1E1E] text-white shadow-xs'
                          : 'text-[#755947] hover:bg-white/50'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{isAr ? 'سفري / تيك أواي' : 'Takeaway'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOrderType('delivery')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-black transition flex flex-col items-center gap-0.5 ${
                        orderType === 'delivery'
                          ? 'bg-[#8B1E1E] text-white shadow-xs'
                          : 'text-[#755947] hover:bg-white/50'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{isAr ? 'توصيل' : 'Delivery'}</span>
                    </button>
                  </div>
                </div>

                {/* Table Number or Delivery Address */}
                {orderType === 'dinein' && (
                  <div>
                    <label className="text-xs font-black text-[#5C3E2E] block mb-1">
                      {isAr ? 'رقم الطاولة في المطعم *' : 'Table Number *'}
                    </label>
                    <input
                      type="text"
                      value={addressOrTable}
                      onChange={(e) => setAddressOrTable(e.target.value)}
                      placeholder={isAr ? 'مثال: طاولة رقم 4' : 'e.g. Table 4'}
                      className="w-full bg-[#FAF5EC] border border-[#E8D8B5] focus:border-[#8B1E1E] rounded-xl px-3 py-2 text-xs font-bold text-[#2C1810] outline-none"
                    />
                  </div>
                )}

                {orderType === 'delivery' && (
                  <div>
                    <label className="text-xs font-black text-[#5C3E2E] block mb-1">
                      {isAr ? 'عنوان التوصيل بالتفصيل *' : 'Delivery Address *'}
                    </label>
                    <input
                      type="text"
                      value={addressOrTable}
                      onChange={(e) => setAddressOrTable(e.target.value)}
                      placeholder={isAr ? 'المنطقة، الشارع، رقم المبنى أو الشقة' : 'Area, street, building'}
                      className="w-full bg-[#FAF5EC] border border-[#E8D8B5] focus:border-[#8B1E1E] rounded-xl px-3 py-2 text-xs font-bold text-[#2C1810] outline-none"
                    />
                  </div>
                )}

                {/* Customer Name */}
                <div>
                  <label className="text-xs font-black text-[#5C3E2E] block mb-1">
                    {isAr ? 'الاسم الكريم *' : 'Your Name *'}
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder={isAr ? 'الاسم لتسجيل الطلب' : 'Full Name'}
                      className="w-full bg-[#FAF5EC] border border-[#E8D8B5] focus:border-[#8B1E1E] rounded-xl ltr:pl-8 ltr:pr-3 rtl:pr-8 rtl:pl-3 py-2 text-xs font-bold text-[#2C1810] outline-none"
                    />
                  </div>
                </div>

                {/* Customer Phone */}
                <div>
                  <label className="text-xs font-black text-[#5C3E2E] block mb-1">
                    {isAr ? 'رقم الهاتف للتواصل *' : 'Phone Number *'}
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder={isAr ? 'رقم الهاتف / الواتساب' : 'Phone / WhatsApp'}
                      className="w-full bg-[#FAF5EC] border border-[#E8D8B5] focus:border-[#8B1E1E] rounded-xl ltr:pl-8 ltr:pr-3 rtl:pr-8 rtl:pl-3 py-2 text-xs font-bold text-[#2C1810] outline-none"
                    />
                  </div>
                </div>

                {/* Special Notes */}
                <div>
                  <label className="text-xs font-black text-[#5C3E2E] block mb-1">
                    {isAr ? 'ملاحظات خاصة (اختياري)' : 'Notes (optional)'}
                  </label>
                  <textarea
                    rows={2}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder={isAr ? 'بدون شطة، طحينة زيادة، خبز بلدي...' : 'Special requests...'}
                    className="w-full bg-[#FAF5EC] border border-[#E8D8B5] focus:border-[#8B1E1E] rounded-xl p-2.5 text-xs text-[#2C1810] outline-none resize-none"
                  />
                </div>
              </div>

              {/* Validation Warning */}
              {validationError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl animate-in shake">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Fixed Footer with Send WhatsApp Button */}
        {cartItems.length > 0 && (
          <div className="p-3.5 sm:p-4 bg-white border-t border-[#E8D8B5] shrink-0">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-bold text-[#755947]">
                {isAr ? 'الإجمالي الكلي:' : 'Total Amount:'}
              </span>
              <span className="text-base sm:text-lg font-black text-[#8B1E1E] font-mono">
                {formatBaisaToOmr(totalBaisa, lang)}
              </span>
            </div>

            <button
              onClick={handleSendWhatsappOrder}
              className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] active:scale-98 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>{isAr ? 'إرسال الطلب عبر واتساب 📲' : 'Send Order via WhatsApp 📲'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
