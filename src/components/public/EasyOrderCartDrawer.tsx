import React, { useState } from 'react';
import { CartItem, RestaurantSettings, CustomerOrder, formatBaisaToOmr } from '../../types/menu';
import { getProductImageUrl } from '../../utils/foodImageResolver';
import { saveCustomerOrder } from '../../services/menuService';
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
  Clock,
  CheckCircle2,
  AlertCircle,
  UtensilsCrossed,
  Truck,
  Store,
} from 'lucide-react';

interface EasyOrderCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  settings: RestaurantSettings;
  lang: 'ar' | 'en';
}

export const EasyOrderCartDrawer: React.FC<EasyOrderCartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  settings,
  lang,
}) => {
  const isAr = lang === 'ar';

  // Customer Form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderType, setOrderType] = useState<'takeaway' | 'delivery' | 'dinein'>('takeaway');
  const [addressOrTable, setAddressOrTable] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalBaisa = cartItems.reduce((acc, curr) => {
    const unitPrice = curr.selectedVariant
      ? curr.selectedVariant.priceBaisa
      : curr.item.basePriceBaisa;
    return acc + unitPrice * curr.quantity;
  }, 0);

  const totalQuantity = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  const handleCheckoutAndWhatsapp = async () => {
    setErrorMsg(null);

    if (cartItems.length === 0) {
      setErrorMsg(isAr ? 'السلة فارغة، اختر بعض الوجبات أولاً' : 'Your cart is empty');
      return;
    }

    if (!customerName.trim()) {
      setErrorMsg(isAr ? 'يرجى كتابة اسم العميل لإتمام الطلب' : 'Please enter your name');
      return;
    }

    if (!customerPhone.trim() || customerPhone.trim().length < 6) {
      setErrorMsg(isAr ? 'يرجى كتابة رقم الهاتف للتواصل' : 'Please enter a valid phone number');
      return;
    }

    if (orderType === 'dinein' && !addressOrTable.trim()) {
      setErrorMsg(isAr ? 'يرجى كتابة رقم الطاولة داخل المطعم' : 'Please enter table number');
      return;
    }

    if (orderType === 'delivery' && !addressOrTable.trim()) {
      setErrorMsg(isAr ? 'يرجى كتابة عنوان التوصيل بالتفصيل' : 'Please provide delivery address');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderId = `ord_${Date.now()}`;
      const now = new Date();
      const timeStr = now.toLocaleTimeString(isAr ? 'ar-OM' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });

      const orderData: CustomerOrder = {
        id: orderId,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        orderType,
        addressOrTable: addressOrTable.trim(),
        orderNotes: orderNotes.trim() || undefined,
        items: cartItems.map((ci) => {
          const unitPrice = ci.selectedVariant
            ? ci.selectedVariant.priceBaisa
            : ci.item.basePriceBaisa;
          return {
            itemId: ci.item.id,
            nameAr: ci.item.nameAr,
            nameEn: ci.item.nameEn,
            variantNameAr: ci.selectedVariant?.nameAr,
            variantNameEn: ci.selectedVariant?.nameEn,
            priceBaisa: unitPrice,
            quantity: ci.quantity,
            lineTotalBaisa: unitPrice * ci.quantity,
          };
        }),
        totalBaisa,
        createdAt: now.toISOString(),
        status: 'new',
      };

      // 1. Save order to Firebase Firestore & local storage
      await saveCustomerOrder(orderData);

      // 2. Prepare WhatsApp message
      const orderTypeLabel = {
        dinein: isAr ? 'تناول بالصالة (محلي)' : 'Dine-in (Table)',
        takeaway: isAr ? 'استلام سفري (تيك أواي)' : 'Takeaway / Pick-up',
        delivery: isAr ? 'توصيل للمنزل' : 'Home Delivery',
      }[orderType];

      let msg = `*طلب جديد من مطعم كبدة إسكندراني* 🍽️\n`;
      msg += `رقم الطلب: #${orderId.slice(-6)}\n`;
      msg += `👤 العميل: ${customerName.trim()}\n`;
      msg += `📞 الهاتف: ${customerPhone.trim()}\n`;
      msg += `🛵 نوع الطلب: ${orderTypeLabel}\n`;

      if (orderType === 'dinein') {
        msg += `🪑 رقم الطاولة: ${addressOrTable.trim()}\n`;
      } else if (orderType === 'delivery') {
        msg += `📍 عنوان التوصيل: ${addressOrTable.trim()}\n`;
      }

      if (orderNotes.trim()) {
        msg += `📝 ملاحظات: ${orderNotes.trim()}\n`;
      }

      msg += `\n*🛒 تفاصيل الأصناف:*\n`;
      msg += `--------------------------------\n`;

      cartItems.forEach((ci, idx) => {
        const itemName = isAr ? ci.item.nameAr : ci.item.nameEn;
        const variantText = ci.selectedVariant
          ? ` (${isAr ? ci.selectedVariant.nameAr : ci.selectedVariant.nameEn})`
          : '';
        const unitPrice = ci.selectedVariant
          ? ci.selectedVariant.priceBaisa
          : ci.item.basePriceBaisa;
        const lineTotal = formatBaisaToOmr(unitPrice * ci.quantity, 'ar');

        msg += `${idx + 1}. *${itemName}${variantText}*\n`;
        msg += `   ${ci.quantity} × ${formatBaisaToOmr(unitPrice, 'ar')} = ${lineTotal}\n`;
      });

      msg += `--------------------------------\n`;
      msg += `*💰 إجمالي الفاتورة: ${formatBaisaToOmr(totalBaisa, 'ar')}*\n`;
      msg += `\nيرجى تأكيد استلام الطلب وتجهيزه في أسرع وقت. شكراً!`;

      // 3. Open WhatsApp with pre-filled message
      const rawNumber = (settings.whatsapp || settings.phone || '92347955').replace(/[^0-9]/g, '');
      let phoneWithCode = rawNumber;
      if (phoneWithCode.length === 8 && (phoneWithCode.startsWith('9') || phoneWithCode.startsWith('7'))) {
        phoneWithCode = `968${phoneWithCode}`;
      }

      const whatsappUrl = `https://wa.me/${phoneWithCode}?text=${encodeURIComponent(msg)}`;
      window.open(whatsappUrl, '_blank');

      setIsSuccess(true);
      setTimeout(() => {
        onClearCart();
        setIsSuccess(false);
        onClose();
      }, 2500);
    } catch (err) {
      console.error('Error completing order:', err);
      setErrorMsg(isAr ? 'حدث خطأ في حفظ الطلب، يرجى المحاولة ثانية' : 'Failed to save order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Slide-over Left Drawer */}
      <div className="fixed inset-y-0 left-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out animate-in slide-in-from-left">
          {/* Drawer Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-[#8B2220] to-[#721B19] text-white flex items-center justify-between shrink-0 shadow-xs border-b border-[#C58D38]/30">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#E5A93C]" />
              <div>
                <h3 className="text-base font-black">
                  {isAr ? 'سلة التسوق' : 'Shopping Cart'}
                </h3>
                <span className="text-xs text-amber-200/90 font-medium">
                  {totalQuantity} {isAr ? 'منتجات مختارة' : 'selected items'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cartItems.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-xs bg-white/15 hover:bg-white/25 text-white px-2.5 py-1 rounded-lg transition font-bold cursor-pointer"
                >
                  {isAr ? 'تفريغ السلة' : 'Clear'}
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            {isSuccess ? (
              <div className="text-center py-16 px-4 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-black text-gray-900 mb-1">
                  {isAr ? 'تم إرسال وحفظ طلبك بنجاح!' : 'Order Sent & Saved!'}
                </h4>
                <p className="text-xs text-gray-600">
                  {isAr
                    ? 'تم فتح واتساب لإرسال الفاتورة وحفظ الطلب في نظام إدارة المطعم'
                    : 'WhatsApp opened to send invoice and order saved to restaurant system'}
                </p>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                  <ShoppingBag className="w-10 h-10 text-gray-300" />
                </div>
                <h4 className="font-extrabold text-base text-gray-800">
                  {isAr ? 'سلة التسوق فارغة' : 'Your cart is empty'}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {isAr ? 'تصفح الأصناف واضغط "أضف للسلة" للبدء بالطلب' : 'Browse dishes and tap "Add to Cart"'}
                </p>
              </div>
            ) : (
              <>
                {/* List of Added Cart Items */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-black text-gray-500 uppercase tracking-wider">
                    {isAr ? 'المنتجات المطلوبة' : 'Cart Items'}
                  </h4>

                  {cartItems.map((ci, index) => {
                    const itemName = isAr ? ci.item.nameAr : ci.item.nameEn;
                    const variantName = ci.selectedVariant
                      ? isAr ? ci.selectedVariant.nameAr : ci.selectedVariant.nameEn
                      : null;
                    const unitPrice = ci.selectedVariant
                      ? ci.selectedVariant.priceBaisa
                      : ci.item.basePriceBaisa;
                    const itemImageUrl = getProductImageUrl(ci.item.id, ci.item.categoryId, ci.item.imageUrl);

                    return (
                      <div
                        key={`${ci.item.id}-${index}`}
                        className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-2xs flex items-center justify-between gap-3 hover:border-gray-200 transition"
                      >
                        {/* Thumbnail image on right in RTL */}
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                          <img
                            src={itemImageUrl}
                            alt={itemName}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Name and Price */}
                        <div className="flex-1 min-w-0">
                          <h5 className="font-extrabold text-xs sm:text-sm text-gray-900 truncate">
                            {itemName}
                          </h5>
                          {variantName && (
                            <span className="text-[11px] text-[#B81D22] font-bold block">
                              {variantName}
                            </span>
                          )}
                          <span className="text-xs font-extrabold text-gray-950 font-mono">
                            {formatBaisaToOmr(unitPrice * ci.quantity, lang)}
                          </span>
                        </div>

                        {/* Quantity Controls & Delete Icon */}
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                            <button
                              onClick={() => onUpdateQuantity(index, ci.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-200 active:bg-gray-300 transition cursor-pointer"
                              aria-label="Decrease"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center font-black text-xs font-mono text-gray-900">
                              {ci.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(index, ci.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-200 active:bg-gray-300 transition cursor-pointer"
                              aria-label="Increase"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(index)}
                            className="p-1 rounded-md text-red-500 hover:text-red-700 hover:bg-red-50 transition cursor-pointer"
                            title={isAr ? 'حذف الصنف' : 'Remove item'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Customer Checkout Form */}
                <div className="bg-gray-50 p-3 sm:p-3.5 rounded-2xl border border-gray-200/80 space-y-3">
                  <h4 className="text-xs font-black text-gray-900 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#8B2220]" />
                    <span>{isAr ? 'بيانات الزبون والتوصيل' : 'Customer & Delivery Info'}</span>
                  </h4>

                  {/* Order Type Tabs */}
                  <div className="grid grid-cols-3 gap-1 bg-gray-200/60 p-1 rounded-xl text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setOrderType('takeaway')}
                      className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition cursor-pointer ${
                        orderType === 'takeaway'
                          ? 'bg-white text-[#8B2220] shadow-xs font-black'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Store className="w-3.5 h-3.5" />
                      <span>{isAr ? 'سفري' : 'Takeaway'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderType('delivery')}
                      className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition cursor-pointer ${
                        orderType === 'delivery'
                          ? 'bg-white text-[#8B2220] shadow-xs font-black'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>{isAr ? 'توصيل' : 'Delivery'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderType('dinein')}
                      className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition cursor-pointer ${
                        orderType === 'dinein'
                          ? 'bg-white text-[#8B2220] shadow-xs font-black'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <UtensilsCrossed className="w-3.5 h-3.5" />
                      <span>{isAr ? 'محلي' : 'Dine-in'}</span>
                    </button>
                  </div>

                  {/* Name Input */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      {isAr ? 'اسم العميل *' : 'Customer Name *'}
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 absolute ltr:left-2.5 rtl:right-2.5 top-2.5 text-gray-400" />
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder={isAr ? 'مثال: أحمد راشد' : 'e.g. John Doe'}
                        className="w-full bg-white border border-gray-300 rounded-xl py-1.5 ltr:pl-8 ltr:pr-3 rtl:pr-8 rtl:pl-3 text-xs font-semibold focus:outline-none focus:border-[#8B2220]"
                      />
                    </div>
                  </div>

                  {/* Phone Input */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      {isAr ? 'رقم الهاتف للتواصل *' : 'Phone Number *'}
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 absolute ltr:left-2.5 rtl:right-2.5 top-2.5 text-gray-400" />
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder={isAr ? 'مثال: 92347955' : 'e.g. 92347955'}
                        className="w-full bg-white border border-gray-300 rounded-xl py-1.5 ltr:pl-8 ltr:pr-3 rtl:pr-8 rtl:pl-3 text-xs font-semibold focus:outline-none focus:border-[#8B2220]"
                      />
                    </div>
                  </div>

                  {/* Address or Table depending on order type */}
                  {orderType !== 'takeaway' && (
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">
                        {orderType === 'dinein'
                          ? isAr ? 'رقم الطاولة في المطعم *' : 'Table Number *'
                          : isAr ? 'عنوان التوصيل بالتفصيل *' : 'Delivery Address *'}
                      </label>
                      <div className="relative">
                        <MapPin className="w-3.5 h-3.5 absolute ltr:left-2.5 rtl:right-2.5 top-2.5 text-gray-400" />
                        <input
                          type="text"
                          value={addressOrTable}
                          onChange={(e) => setAddressOrTable(e.target.value)}
                          placeholder={
                            orderType === 'dinein'
                              ? isAr ? 'طاولة رقم 5' : 'Table #5'
                              : isAr ? 'دارسيت، مسقط، بناية...' : 'Darsait, Muscat, Building...'
                          }
                          className="w-full bg-white border border-gray-300 rounded-xl py-1.5 ltr:pl-8 ltr:pr-3 rtl:pr-8 rtl:pl-3 text-xs font-semibold focus:outline-none focus:border-[#8B2220]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      {isAr ? 'ملاحظات خاصة على الوجبات (اختياري)' : 'Special Instructions'}
                    </label>
                    <input
                      type="text"
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder={isAr ? 'بدون شطة، زيادة طحينة...' : 'Extra sauce, no chili...'}
                      className="w-full bg-white border border-gray-300 rounded-xl py-1.5 px-3 text-xs font-semibold focus:outline-none focus:border-[#8B2220]"
                    />
                  </div>

                  {errorMsg && (
                    <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 p-2 rounded-lg font-bold">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="bg-[#FFF9EF] p-3 rounded-xl border border-[#E8D8B5] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>{isAr ? 'المجموع الفرعي' : 'Subtotal'}</span>
                    <span className="font-mono font-bold">{formatBaisaToOmr(totalBaisa, lang)}</span>
                  </div>
                  <div className="flex items-center justify-between text-gray-600">
                    <span>{isAr ? 'خدمة التحضير والتجهيز' : 'Packaging & Service'}</span>
                    <span className="text-emerald-700 font-bold">{isAr ? 'مجاني' : 'Free'}</span>
                  </div>
                  <div className="border-t border-[#E8D8B5] pt-1.5 flex items-center justify-between font-black text-sm text-gray-950">
                    <span>{isAr ? 'الإجمالي النهائي' : 'Grand Total'}</span>
                    <span className="font-mono text-base text-[#8B2220]">
                      {formatBaisaToOmr(totalBaisa, lang)}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer with Checkout Button */}
          {cartItems.length > 0 && !isSuccess && (
            <div className="p-4 border-t border-gray-200 bg-white shrink-0">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleCheckoutAndWhatsapp}
                className="w-full bg-[#25D366] hover:bg-[#20ba5a] active:scale-98 text-white font-black py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-md transition cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>
                  {isSubmitting
                    ? isAr ? 'جاري تسجيل الطلب...' : 'Processing...'
                    : isAr
                    ? `إرسال الطلب عبر واتساب (${formatBaisaToOmr(totalBaisa, lang)})`
                    : `Send WhatsApp Order (${formatBaisaToOmr(totalBaisa, lang)})`}
                </span>
              </button>
              <p className="text-[10px] text-center text-gray-400 font-medium mt-1.5">
                {isAr
                  ? 'يتم إرسال الفاتورة بالواتساب وحفظ نسخة في سجلات المطعم'
                  : 'Invoice is sent via WhatsApp and stored in restaurant records'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
