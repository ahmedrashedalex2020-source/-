import React, { useState, useEffect, useMemo } from 'react';
import { CustomerOrder, formatBaisaToOmr } from '../../types/menu';
import {
  subscribeOrders,
  updateOrderStatus,
  deleteCustomerOrder,
  clearAllOrders,
} from '../../services/menuService';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  ChefHat,
  Phone,
  MessageCircle,
  Printer,
  Trash2,
  RefreshCw,
  Search,
  AlertCircle,
  Truck,
  Store,
  UtensilsCrossed,
  Filter,
  Check,
  X,
  Volume2,
} from 'lucide-react';

interface AdminOrdersProps {
  lang: 'ar' | 'en';
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({ lang }) => {
  const isAr = lang === 'ar';
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | CustomerOrder['status']>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<CustomerOrder | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  useEffect(() => {
    const unsub = subscribeOrders((fetchedOrders) => {
      setOrders(fetchedOrders);
    });
    return () => unsub();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: CustomerOrder['status']) => {
    await updateOrderStatus(orderId, newStatus);
    const label = {
      new: 'جديد',
      preparing: 'قيد التحضير في المطبخ',
      completed: 'مكتمل ومستلم',
      cancelled: 'ملغي',
    }[newStatus];
    showToast(`تم تغيير حالة الطلب إلى: ${label}`);
  };

  const handleDelete = async (orderId: string) => {
    if (window.confirm(isAr ? 'هل أنت متأكد من حذف هذا الطلب من السجل نهائياً؟' : 'Delete order?')) {
      await deleteCustomerOrder(orderId);
      showToast(isAr ? 'تم حذف الطلب' : 'Order deleted');
    }
  };

  const handleClearAll = async () => {
    if (window.confirm(isAr ? 'تأكيد: هل تريد مسح أرشيف الطلبات بالكامل؟' : 'Clear all orders?')) {
      await clearAllOrders();
      showToast(isAr ? 'تم مسح أرشيف الطلبات' : 'All orders cleared');
    }
  };

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== 'all' && o.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = o.customerName.toLowerCase().includes(q);
        const matchesPhone = o.customerPhone.includes(q);
        const matchesId = o.id.toLowerCase().includes(q);
        const matchesAddress = o.addressOrTable.toLowerCase().includes(q);
        return matchesName || matchesPhone || matchesId || matchesAddress;
      }
      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  const counts = useMemo(() => {
    return {
      all: orders.length,
      new: orders.filter((o) => o.status === 'new').length,
      preparing: orders.filter((o) => o.status === 'preparing').length,
      completed: orders.filter((o) => o.status === 'completed').length,
      cancelled: orders.filter((o) => o.status === 'cancelled').length,
    };
  }, [orders]);

  const printReceipt = (order: CustomerOrder) => {
    setSelectedOrderForPrint(order);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <div className="space-y-4 sm:space-y-6 text-[#ededed] font-['Cairo',sans-serif]">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-16 inset-x-4 max-w-md mx-auto z-50 bg-[#1c1c1c] text-[#00c853] p-3 rounded-xl shadow-2xl border border-[#00c853]/40 text-xs sm:text-sm font-bold text-center animate-in slide-in-from-top">
          {toastMsg}
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-[#141414] rounded-[12px] border border-[#222222] p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00c853] animate-pulse" />
            <h2 className="text-lg sm:text-xl font-black text-white">
              {isAr ? 'إدارة الطلبات الواردة والفواتير' : 'Live Customer Orders'}
            </h2>
            <span className="text-[11px] bg-[#00c853]/15 text-[#00c853] px-2.5 py-0.5 rounded-full font-bold border border-[#00c853]/30">
              {counts.new} {isAr ? 'طلب جديد' : 'new'}
            </span>
          </div>
          <p className="text-xs text-[#888888] font-medium">
            {isAr
              ? 'متابعة حية لطلبات الزبائن الواردة من المنيو مع إمكانية تحديث الحالة والتواصل بالواتساب وطباعة الفاتورة'
              : 'Live tracking of orders placed through the digital menu'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {orders.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-3 py-2 bg-[#1c1c1c] hover:bg-rose-950/40 hover:text-rose-400 text-[#888888] rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-[#262626]"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isAr ? 'مسح الأرشيف' : 'Clear Archive'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Summary Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
        <button
          onClick={() => setStatusFilter('all')}
          className={`p-3 rounded-[12px] border text-center transition cursor-pointer flex flex-col items-center justify-center ${
            statusFilter === 'all'
              ? 'bg-[#1c1c1c] text-white border-[#00c853] shadow-xs'
              : 'bg-[#141414] text-[#888888] border-[#222222] hover:border-[#333333]'
          }`}
        >
          <span className="text-xs font-bold">{isAr ? 'كافة الطلبات' : 'All'}</span>
          <span className="text-lg font-black font-mono mt-0.5 text-white">{counts.all}</span>
        </button>

        <button
          onClick={() => setStatusFilter('new')}
          className={`p-3 rounded-[12px] border text-center transition cursor-pointer flex flex-col items-center justify-center ${
            statusFilter === 'new'
              ? 'bg-[#1c1c1c] text-[#00bcd4] border-[#00bcd4] shadow-xs'
              : 'bg-[#141414] text-[#888888] border-[#222222] hover:border-[#333333]'
          }`}
        >
          <span className="text-xs font-bold flex items-center gap-1">
            <span>{isAr ? 'جديدة' : 'New'}</span>
            {counts.new > 0 && <span className="w-2 h-2 rounded-full bg-[#00bcd4] animate-ping" />}
          </span>
          <span className="text-lg font-black font-mono mt-0.5 text-[#00bcd4]">{counts.new}</span>
        </button>

        <button
          onClick={() => setStatusFilter('preparing')}
          className={`p-3 rounded-[12px] border text-center transition cursor-pointer flex flex-col items-center justify-center ${
            statusFilter === 'preparing'
              ? 'bg-[#1c1c1c] text-[#ffca28] border-[#ffca28] shadow-xs'
              : 'bg-[#141414] text-[#888888] border-[#222222] hover:border-[#333333]'
          }`}
        >
          <span className="text-xs font-bold">{isAr ? 'قيد التجهيز' : 'Preparing'}</span>
          <span className="text-lg font-black font-mono mt-0.5 text-[#ffca28]">{counts.preparing}</span>
        </button>

        <button
          onClick={() => setStatusFilter('completed')}
          className={`p-3 rounded-[12px] border text-center transition cursor-pointer flex flex-col items-center justify-center ${
            statusFilter === 'completed'
              ? 'bg-[#1c1c1c] text-[#00c853] border-[#00c853] shadow-xs'
              : 'bg-[#141414] text-[#888888] border-[#222222] hover:border-[#333333]'
          }`}
        >
          <span className="text-xs font-bold">{isAr ? 'مكتملة' : 'Completed'}</span>
          <span className="text-lg font-black font-mono mt-0.5 text-[#00c853]">{counts.completed}</span>
        </button>

        <button
          onClick={() => setStatusFilter('cancelled')}
          className={`p-3 rounded-[12px] border text-center transition cursor-pointer flex flex-col items-center justify-center ${
            statusFilter === 'cancelled'
              ? 'bg-[#1c1c1c] text-[#ef5350] border-[#ef5350] shadow-xs'
              : 'bg-[#141414] text-[#888888] border-[#222222] hover:border-[#333333]'
          }`}
        >
          <span className="text-xs font-bold">{isAr ? 'ملغية' : 'Cancelled'}</span>
          <span className="text-lg font-black font-mono mt-0.5 text-[#ef5350]">{counts.cancelled}</span>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            isAr
              ? 'بحث برقم الطلب، اسم العميل، رقم الهاتف أو العنوان...'
              : 'Search order ID, customer name, phone or address...'
          }
          className="w-full bg-[#141414] border border-[#222222] rounded-[12px] py-3 pr-10 pl-4 text-xs sm:text-sm font-bold text-white placeholder-[#555555] focus:outline-none focus:border-[#00c853]"
        />
        <Search className="w-4 h-4 text-[#666666] absolute right-3.5 top-1/2 -translate-y-1/2" />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#888888] hover:text-white"
          >
            {isAr ? 'مسح' : 'Clear'}
          </button>
        )}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-[#141414] rounded-[12px] border border-[#222222] p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-[#1c1c1c] text-[#555555] flex items-center justify-center mx-auto mb-3 border border-[#262626]">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h4 className="text-base font-black text-white">
            {isAr ? 'لا توجد طلبات مسجلة في هذا القسم' : 'No orders found'}
          </h4>
          <p className="text-xs text-[#777777] mt-1">
            {isAr
              ? 'ستظهر هنا طلبات الزبائن مباشرة عند إتمام الطلب من المتجر'
              : 'Customer orders will appear here automatically in real-time'}
          </p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filteredOrders.map((order) => {
            const formattedDate = new Date(order.createdAt).toLocaleTimeString('ar-EG', {
              hour: '2-digit',
              minute: '2-digit',
              day: 'numeric',
              month: 'short',
            });

            const statusColors = {
              new: 'bg-[#00bcd4]/15 text-[#4dd0e1] border-[#00bcd4]/30',
              preparing: 'bg-[#ffb300]/15 text-[#ffca28] border-[#ffb300]/30',
              completed: 'bg-[#00c853]/15 text-[#00c853] border-[#00c853]/30',
              cancelled: 'bg-[#e53935]/15 text-[#ef5350] border-[#e53935]/30',
            }[order.status];

            const statusLabel = {
              new: isAr ? 'طلب جديد' : 'New',
              preparing: isAr ? 'قيد التحضير' : 'Preparing',
              completed: isAr ? 'مكتمل ومستلم' : 'Completed',
              cancelled: isAr ? 'ملغي' : 'Cancelled',
            }[order.status];

            const orderTypeLabel = {
              takeaway: isAr ? 'استلام سفري' : 'Takeaway',
              delivery: isAr ? 'توصيل للمنزل' : 'Delivery',
              dinein: isAr ? 'تناول بالصالة' : 'Dine-in',
            }[order.orderType];

            const cleanPhone = order.customerPhone.replace(/[^0-9]/g, '');

            return (
              <div
                key={order.id}
                className={`bg-[#141414] rounded-[12px] border transition shadow-sm p-4 sm:p-5 ${
                  order.status === 'new' ? 'border-[#00c853]/40' : 'border-[#222222]'
                }`}
              >
                {/* Header Row: ID, Time, Type, Status Pill */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#222222]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs sm:text-sm font-black text-white bg-[#1c1c1c] px-2.5 py-1 rounded-lg border border-[#282828]">
                      #{order.id.slice(-6)}
                    </span>
                    <span className="text-[11px] text-[#777777] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formattedDate}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-[#aaaaaa] bg-[#1c1c1c] px-2.5 py-0.5 rounded-full border border-[#262626]">
                      {orderTypeLabel}
                    </span>
                    <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${statusColors}`}>
                      {statusLabel}
                    </span>
                  </div>
                </div>

                {/* Customer Details Row */}
                <div className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-[#666666] block">{isAr ? 'العميل:' : 'Customer:'}</span>
                    <span className="font-bold text-white text-sm">{order.customerName}</span>
                  </div>
                  <div>
                    <span className="text-[#666666] block">{isAr ? 'رقم الهاتف:' : 'Phone:'}</span>
                    <a
                      href={`tel:${order.customerPhone}`}
                      className="font-mono font-bold text-[#64b5f6] hover:underline"
                    >
                      {order.customerPhone}
                    </a>
                  </div>
                  <div>
                    <span className="text-[#666666] block">{isAr ? 'العنوان / الطاولة:' : 'Address/Table:'}</span>
                    <span className="font-bold text-[#aaaaaa]">{order.addressOrTable || '—'}</span>
                  </div>
                </div>

                {order.orderNotes && (
                  <div className="mb-3 p-2.5 rounded-xl bg-[#1c1c1c] border border-[#262626] text-xs">
                    <span className="text-[#888888] font-bold block mb-0.5">{isAr ? 'ملاحظات العميل:' : 'Notes:'}</span>
                    <span className="text-amber-300 font-medium">{order.orderNotes}</span>
                  </div>
                )}

                {/* Order Items Table */}
                <div className="bg-[#0e0e0e] rounded-xl p-3 border border-[#1f1f1f] space-y-1.5 my-2">
                  <div className="text-[11px] font-bold text-[#666666] border-b border-[#1f1f1f] pb-1 flex justify-between">
                    <span>{isAr ? 'الأصناف والكمية' : 'Items & Qty'}</span>
                    <span>{isAr ? 'الإجمالي' : 'Subtotal'}</span>
                  </div>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-[#1c1c1c] text-[#00c853] font-bold font-mono text-[11px] flex items-center justify-center">
                          {item.quantity}×
                        </span>
                        <span className="text-white font-bold">{isAr ? item.nameAr : item.nameEn}</span>
                        {item.variantNameAr && (
                          <span className="text-[10px] text-[#888888] bg-[#1c1c1c] px-1.5 py-0.2 rounded">
                            {isAr ? item.variantNameAr : item.variantNameEn}
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-white font-bold">
                        {formatBaisaToOmr(item.lineTotalBaisa, lang)}
                      </span>
                    </div>
                  ))}

                  <div className="border-t border-[#222222] pt-2 mt-2 flex items-center justify-between text-xs font-black">
                    <span className="text-[#888888]">{isAr ? 'إجمالي الفاتورة:' : 'Total:'}</span>
                    <span className="text-sm sm:text-base font-mono text-[#00c853]">
                      {formatBaisaToOmr(order.totalBaisa, lang)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons Row */}
                <div className="pt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#222222]">
                  {/* Status update buttons */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] text-[#777777] font-bold ml-1">{isAr ? 'تغيير الحالة:' : 'Status:'}</span>
                    <button
                      onClick={() => handleStatusChange(order.id, 'new')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        order.status === 'new'
                          ? 'bg-[#00bcd4] text-black font-black'
                          : 'bg-[#1c1c1c] text-[#777777] hover:text-white'
                      }`}
                    >
                      {isAr ? 'جديد' : 'New'}
                    </button>
                    <button
                      onClick={() => handleStatusChange(order.id, 'preparing')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        order.status === 'preparing'
                          ? 'bg-[#ffca28] text-black font-black'
                          : 'bg-[#1c1c1c] text-[#777777] hover:text-white'
                      }`}
                    >
                      {isAr ? 'تحضير بالمطبخ' : 'Kitchen'}
                    </button>
                    <button
                      onClick={() => handleStatusChange(order.id, 'completed')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        order.status === 'completed'
                          ? 'bg-[#00c853] text-black font-black'
                          : 'bg-[#1c1c1c] text-[#777777] hover:text-white'
                      }`}
                    >
                      {isAr ? 'مكتمل' : 'Done'}
                    </button>
                    <button
                      onClick={() => handleStatusChange(order.id, 'cancelled')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        order.status === 'cancelled'
                          ? 'bg-[#ef5350] text-white font-black'
                          : 'bg-[#1c1c1c] text-[#777777] hover:text-white'
                      }`}
                    >
                      {isAr ? 'إلغاء' : 'Cancel'}
                    </button>
                  </div>

                  {/* Print and WhatsApp */}
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                        `مرحباً ${order.customerName}، بخصوص طلبك رقم #${order.id.slice(
                          -6
                        )} من مطعم كبدة إسكندراني:`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00c853]/15 text-[#00c853] hover:bg-[#00c853]/25 border border-[#00c853]/30 text-xs font-bold transition cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-current" />
                      <span>{isAr ? 'واتساب العميل' : 'WhatsApp'}</span>
                    </a>

                    <button
                      onClick={() => printReceipt(order)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1c1c1c] hover:bg-[#252525] text-white border border-[#2b2b2b] text-xs font-bold transition cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>{isAr ? 'طباعة إيصال' : 'Print Slip'}</span>
                    </button>

                    <button
                      onClick={() => handleDelete(order.id)}
                      className="p-1.5 rounded-lg text-[#666666] hover:text-rose-400 hover:bg-[#1c1c1c] transition cursor-pointer"
                      title={isAr ? 'حذف الطلب' : 'Delete'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Hidden Thermal Receipt Print Template */}
      {selectedOrderForPrint && (
        <div id="receipt-print-area" className="hidden print:block text-black p-4 bg-white max-w-xs mx-auto font-mono text-xs">
          <div className="text-center pb-2 border-b border-black">
            <h3 className="font-black text-sm">مطعم كبدة إسكندراني</h3>
            <p className="text-[10px]">دارسيت — مسقط، سلطنة عُمان</p>
            <p className="text-[10px]">هاتف: 92347955 / 79348565</p>
          </div>
          <div className="py-2 border-b border-black space-y-0.5 text-[11px]">
            <div>الطلب: #{selectedOrderForPrint.id.slice(-6)}</div>
            <div>العميل: {selectedOrderForPrint.customerName}</div>
            <div>الهاتف: {selectedOrderForPrint.customerPhone}</div>
            <div>النوع: {selectedOrderForPrint.orderType}</div>
            <div>العنوان: {selectedOrderForPrint.addressOrTable}</div>
          </div>
          <div className="py-2 border-b border-black space-y-1">
            {selectedOrderForPrint.items.map((it, i) => (
              <div key={i} className="flex justify-between">
                <span>
                  {it.quantity}x {it.nameAr}
                </span>
                <span>{formatBaisaToOmr(it.lineTotalBaisa, 'ar')}</span>
              </div>
            ))}
          </div>
          <div className="pt-2 flex justify-between font-black text-sm">
            <span>الإجمالي:</span>
            <span>{formatBaisaToOmr(selectedOrderForPrint.totalBaisa, 'ar')}</span>
          </div>
          <div className="text-center pt-3 text-[10px]">
            شكراً لطلبكم! بالهناء والشفاء ❤️
          </div>
        </div>
      )}
    </div>
  );
};
