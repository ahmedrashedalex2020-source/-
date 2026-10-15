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
  Clock,
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
  const [orderType, setOrderType] = useState<'takeaway' | 'delivery' | 'dinein'>('takeaway');
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

    // Validation
    if (cartItems.length === 0) {
      setValidationError(isAr ? 'السلة فاضية! اختر أصنافك أولاً' : 'Cart is empty');
      return;
    }

    if (!customerName.trim()) {
      setValidationError(isAr ? 'من فضلك اكتب اسمك يا فندم لتسجيل الطلب باسمك' : 'Please enter your name');
      return;
    }

    if (!customerPhone.trim() || customerPhone.trim().length < 6) {
      setValidationError(isAr ? 'من فضلك اكتب رقم تليفونك لتأكيد الطلب والتواصل معاك' : 'Please enter your phone number');
      return;
    }

    if (orderType === 'delivery' && !addressOrTable.trim()) {
      setValidationError(isAr ? 'من فضلك اكتب عنوان التوصيل بالتفصيل' : 'Please provide delivery address');
      return;
    }

    if (orderType === 'dinein' && !addressOrTable.trim()) {
      setValidationError(isAr ? 'من فضلك اكتب رقم الطاولة داخل المطعم' : 'Please enter table number');
      return;
    }

    // Build the WhatsApp message
    const orderTypeLabel = {
      takeaway: isAr ? 'استلام من المطعم (سفري / تيك أواي)' : 'Takeaway / Pick-up',
      delivery: isAr ? 'توصيل للمنزل' : 'Home Delivery',
      dinein: isAr ? 'تناول داخل المطعم (صالة)' : 'Dine-in (Table)',
    }[orderType];

    const now = new Date();
    const timeStr = now.toLocaleTimeString(isAr ? 'ar-OM' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const dateStr = now.toLocaleDateString(isAr ? 'ar-OM' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    let message = `🌟 *طلب جديد من منيو كبدة إسكندراني* 🌟\n`;
    message += `📍 فرع دارسيت — مسقط (أمام بلدية مسقط وقريب من لولو)\n`;
    message += `⏰ ${dateStr} الساعة ${timeStr}\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

    message += `👤 *بيانات العميل:* \n`;
    message += `• *الاسم:* ${customerName.trim()}\n`;
    message += `• *رقم الهاتف:* ${customerPhone.trim()}\n`;
    message += `• *نوع الطلب:* ${orderTypeLabel}\n`;
    if (addressOrTable.trim()) {
      message += `• *${orderType === 'dinein' ? 'رقم الطاولة' : 'العنوان'}:* ${addressOrTable.trim()}\n`;
    }
    message += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `📋 *تفاصيل الأصناف والطلب:* \n\n`;

    cartItems.forEach((ci, idx) => {
      const itemName = isAr ? ci.item.nameAr : ci.item.nameEn;
      const variantName = ci.selectedVariant
        ? ` (${isAr ? ci.selectedVariant.nameAr : ci.selectedVariant.nameEn})`
        : '';
      const unitPriceBaisa = ci.selectedVariant
        ? ci.selectedVariant.priceBaisa
        : ci.item.basePriceBaisa;
      const subtotalBaisa = unitPriceBaisa * ci.quantity;

      message += `${idx + 1}. *${itemName}*${variantName}\n`;
      message += `   الكمية: ${ci.quantity} × ${formatBaisaToOmr(unitPriceBaisa, 'ar')} = *${formatBaisaToOmr(subtotalBaisa, 'ar')}*\n`;
      if (ci.notes) {
        message += `   ملاحظة: ${ci.notes}\n`;
      }
    });

    message += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `💰 *الإجمالي الكلي:* *${formatBaisaToOmr(totalBaisa, 'ar')}*\n`;
    message += `📦 *إجمالي عدد الوجبات:* ${totalQuantity} قطعة\n`;

    if (orderNotes.trim()) {
      message += `\n📝 *ملاحظات العميل:* ${orderNotes.trim()}\n`;
    }

    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `شكراً لاختياركم كبدة إسكندراني! يرجى تأكيد استلام الطلب وتجهيزه. 🙏✨`;

    // Destination WhatsApp Number
    const targetPhone = settings.whatsapp || '+968 79348565';
    const cleanNumber = targetPhone.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encoded}`;

    window.open(whatsappUrl, '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#FFF9EF] h-full shadow-2xl flex flex-col justify-between border-s border-[#E8D8B5] animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 bg-[#392A23] text-white border-b-2 border-[#C58D38] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#A1312E] rounded-xl text-white">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black leading-tight text-white">
                {isAr ? 'سلة الطلب وتجهيز رسالة الواتساب' : 'Your Order Cart'}
              </h3>
              <span className="text-[11px] text-[#E8D8B5]">
                {cartItems.length} {isAr ? 'أصناف في السلة' : 'items'} • كبدة إسكندراني
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#E8D8B5] hover:text-white hover:bg-white/10 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Validation Alert */}
        {validationError && (
          <div className="p-3 bg-red-100 border-b border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 text-[#755947]">
              <div className="w-16 h-16 bg-[#F6ECD5] rounded-full flex items-center justify-center mx-auto mb-3 border border-[#C58D38]/30">
                <ShoppingBag className="w-8 h-8 text-[#A1312E]" />
              </div>
              <p className="font-black text-lg text-[#392A23]">السلة فاضية يا فندم!</p>
              <p className="text-xs text-[#755947] mt-1 max-w-xs mx-auto">
                تصفح قائمة الطعام واضغط على زرار "إضافة" عند الوجبات اللي تحبها لإضافتها للطلب هنا.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-5 py-2.5 bg-[#A1312E] hover:bg-[#862724] text-white rounded-xl text-xs font-black transition"
              >
                تصفح منيو الطعام الآن
              </button>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-[#755947] border-b border-[#E8D8B5] pb-1.5">
                  <span>الأصناف المختارة ({cartItems.length})</span>
                  <button
                    onClick={onClearCart}
                    className="text-[11px] text-red-600 hover:underline font-semibold"
                  >
                    تفريغ السلة
                  </button>
                </div>

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
                      className="bg-white p-3.5 rounded-2xl border border-[#E8D8B5] flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-[#392A23] leading-snug truncate">
                          {itemName}
                        </h4>
                        {variantName && (
                          <span className="text-xs text-[#C58D38] font-bold block mt-0.5">
                            الحجم: {variantName}
                          </span>
                        )}
                        <span className="text-xs text-[#A1312E] font-black mt-1 block">
                          {formatBaisaToOmr(unitPrice * ci.quantity, 'ar')}
                        </span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1.5 bg-[#FFF9EF] border border-[#E8D8B5] rounded-xl p-1 shrink-0">
                        <button
                          onClick={() => onUpdateQuantity(index, ci.quantity - 1)}
                          className="p-1 hover:bg-white rounded-md text-[#755947] transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-black text-[#392A23] w-5 text-center font-mono">
                          {ci.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(index, ci.quantity + 1)}
                          className="p-1 hover:bg-white rounded-md text-[#755947] transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(index)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Customer Contact & Delivery Form */}
              <div className="bg-white p-4 rounded-2xl border-2 border-[#E8D8B5] space-y-3 shadow-2xs">
                <h4 className="text-xs font-black text-[#392A23] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#E8D8B5] pb-2">
                  <User className="w-4 h-4 text-[#A1312E]" />
                  <span>بيانات العميل وطريقة الاستلام (مطلوبة للطلب)</span>
                </h4>

                {/* Customer Name */}
                <div>
                  <label className="text-xs font-bold text-[#755947] block mb-1">
                    اسم العميل بالكامل *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="مثال: أحمد راشد / محمد علي"
                      className="w-full bg-[#FFF9EF] border border-[#E8D8B5] focus:border-[#A1312E] rounded-xl ltr:pl-9 ltr:pr-3 rtl:pr-9 rtl:pl-3 py-2 text-xs font-bold text-[#392A23] outline-hidden"
                      required
                    />
                  </div>
                </div>

                {/* Customer Phone */}
                <div>
                  <label className="text-xs font-bold text-[#755947] block mb-1">
                    رقم هاتف العميل (للتأكيد والواتساب) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="مثال: 91234567 أو +968 91234567"
                      className="w-full bg-[#FFF9EF] border border-[#E8D8B5] focus:border-[#A1312E] rounded-xl ltr:pl-9 ltr:pr-3 rtl:pr-9 rtl:pl-3 py-2 text-xs font-bold text-[#392A23] outline-hidden font-mono"
                      required
                    />
                  </div>
                </div>

                {/* Order Type Radio Buttons */}
                <div>
                  <label className="text-xs font-bold text-[#755947] block mb-1.5">
                    طريقة الاستلام *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setOrderType('takeaway')}
                      className={`p-2 rounded-xl text-center text-xs font-bold border transition ${
                        orderType === 'takeaway'
                          ? 'bg-[#A1312E] text-white border-[#A1312E]'
                          : 'bg-[#FFF9EF] text-[#755947] border-[#E8D8B5] hover:bg-white'
                      }`}
                    >
                      استلام سفري
                    </button>

                    <button
                      type="button"
                      onClick={() => setOrderType('delivery')}
                      className={`p-2 rounded-xl text-center text-xs font-bold border transition ${
                        orderType === 'delivery'
                          ? 'bg-[#A1312E] text-white border-[#A1312E]'
                          : 'bg-[#FFF9EF] text-[#755947] border-[#E8D8B5] hover:bg-white'
                      }`}
                    >
                      توصيل
                    </button>

                    <button
                      type="button"
                      onClick={() => setOrderType('dinein')}
                      className={`p-2 rounded-xl text-center text-xs font-bold border transition ${
                        orderType === 'dinein'
                          ? 'bg-[#A1312E] text-white border-[#A1312E]'
                          : 'bg-[#FFF9EF] text-[#755947] border-[#E8D8B5] hover:bg-white'
                      }`}
                    >
                      داخل الصالة
                    </button>
                  </div>
                </div>

                {/* Conditional Address or Table Number */}
                {orderType === 'delivery' && (
                  <div className="animate-in fade-in">
                    <label className="text-xs font-bold text-[#755947] block mb-1">
                      عنوان التوصيل بالتفصيل *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={addressOrTable}
                        onChange={(e) => setAddressOrTable(e.target.value)}
                        placeholder="المنطقة، الشارع، رقم المبنى..."
                        className="w-full bg-[#FFF9EF] border border-[#E8D8B5] rounded-xl ltr:pl-9 ltr:pr-3 rtl:pr-9 rtl:pl-3 py-2 text-xs font-bold text-[#392A23] outline-hidden"
                      />
                    </div>
                  </div>
                )}

                {orderType === 'dinein' && (
                  <div className="animate-in fade-in">
                    <label className="text-xs font-bold text-[#755947] block mb-1">
                      رقم الطاولة في المطعم *
                    </label>
                    <input
                      type="text"
                      value={addressOrTable}
                      onChange={(e) => setAddressOrTable(e.target.value)}
                      placeholder="مثال: طاولة رقم 5"
                      className="w-full bg-[#FFF9EF] border border-[#E8D8B5] rounded-xl p-2 text-xs font-bold text-[#392A23] outline-hidden"
                    />
                  </div>
                )}

                {/* Additional notes */}
                <div>
                  <label className="text-xs font-bold text-[#755947] block mb-1">
                    أي طلبات أو ملاحظات خاصة؟ (اختياري)
                  </label>
                  <textarea
                    rows={2}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="مثال: زيادة طحينة، بدون بصل، شطة زيادة..."
                    className="w-full bg-[#FFF9EF] border border-[#E8D8B5] rounded-xl p-2 text-xs text-[#392A23] outline-hidden"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer & WhatsApp Trigger */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 bg-white border-t-2 border-[#E8D8B5] space-y-3">
            {/* Subtotal & Total display */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-[#755947] font-bold block">
                  المجموع الكلي المطلوب:
                </span>
                <span className="text-xs text-gray-400 font-semibold">
                  ({totalQuantity} وجبات)
                </span>
              </div>
              <div className="text-end">
                <span className="text-2xl font-black text-[#A1312E] font-mono">
                  {formatBaisaToOmr(totalBaisa, 'ar')}
                </span>
              </div>
            </div>

            {/* BIG WHATSAPP SEND BUTTON */}
            <button
              onClick={handleSendWhatsappOrder}
              className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20ba5a] text-white py-3.5 px-4 rounded-2xl font-black text-sm sm:text-base shadow-lg transition transform active:scale-98 cursor-pointer"
            >
              <MessageCircle className="w-6 h-6 fill-white shrink-0" />
              <span>إرسال الطلب الآن لواتساب المطعم 📱</span>
            </button>

            {/* Target WhatsApp Info & Reassurance */}
            <div className="text-[11px] text-[#755947] text-center flex items-center justify-center gap-1.5 pt-1">
              <span>سيتم إرسال الطلب مباشرة لرقم واتساب الإدارة:</span>
              <strong className="text-emerald-700 font-mono font-bold">
                {settings.whatsapp || '+968 79348565'}
              </strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
