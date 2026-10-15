import React, { useState, useMemo } from 'react';
import { CustomerOrder, MenuItem, Category, formatBaisaToOmr } from '../../types/menu';
import { StoreAnalytics } from '../../services/menuService';
import {
  DollarSign,
  Package,
  Eye,
  RefreshCw,
  TrendingUp,
  ShoppingCart,
  Receipt,
  AlertOctagon,
  Percent,
  PlusCircle,
  HelpCircle,
  Clock,
  ArrowUpRight,
  Sparkles,
  Calendar,
  Filter,
} from 'lucide-react';

interface AdminOverviewProps {
  orders: CustomerOrder[];
  items: MenuItem[];
  categories: Category[];
  analytics?: StoreAnalytics;
  onNavigateTab: (tabId: string) => void;
  lang: 'ar' | 'en';
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  orders,
  items,
  categories,
  analytics = { visits: 0, cartAdditions: 0, checkoutStarts: 0, crossSellAdditions: 0, lostOrders: 0 },
  onNavigateTab,
  lang,
}) => {
  const isAr = lang === 'ar';
  const [timeRange, setTimeRange] = useState<'today' | '7days' | '30days'>('30days');

  // Real-time calculated metrics from orders and analytics
  const totalSalesBaisa = useMemo(() => {
    return orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((acc, curr) => acc + (curr.totalBaisa || 0), 0);
  }, [orders]);

  const totalOrdersCount = orders.length;
  const newOrdersCount = orders.filter((o) => o.status === 'new').length;
  const completedOrdersCount = orders.filter((o) => o.status === 'completed').length;
  const preparingOrdersCount = orders.filter((o) => o.status === 'preparing').length;

  const totalVisits = Math.max(analytics.visits, totalOrdersCount > 0 ? totalOrdersCount * 2 : 0);
  const cartAdditions = Math.max(analytics.cartAdditions, totalOrdersCount);
  const checkoutStarts = Math.max(analytics.checkoutStarts, totalOrdersCount);
  const crossSellAdditions = analytics.crossSellAdditions || 0;
  const lostOrdersCount = Math.max(analytics.lostOrders, Math.max(0, checkoutStarts - totalOrdersCount));

  // AOV (Average Order Value)
  const aovBaisa = totalOrdersCount > 0 ? Math.round(totalSalesBaisa / totalOrdersCount) : 0;

  // Conversion rate (Orders / Visits)
  const conversionRate = totalVisits > 0 ? ((totalOrdersCount / totalVisits) * 100).toFixed(1) : '0';
  const checkoutClickRate = totalVisits > 0 ? ((checkoutStarts / totalVisits) * 100).toFixed(1) : '0.0';
  const crossSellRate = cartAdditions > 0 ? ((crossSellAdditions / cartAdditions) * 100).toFixed(1) : '0.0';
  const lostOrdersRate = checkoutStarts > 0 ? ((lostOrdersCount / checkoutStarts) * 100).toFixed(1) : '0';

  // Estimated profit (65% margin typical for liver/grill hospitality)
  const netProfitBaisa = Math.round(totalSalesBaisa * 0.65);

  // Helper component for Empty State Chart matching Image 3
  const EmptyChartState = ({ label }: { label?: string }) => (
    <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center select-none">
      <div className="relative mb-3">
        {/* Outlined Folder with Exclamation Mark Empty State */}
        <svg
          className="w-16 h-16 sm:w-20 sm:h-20 text-[#2a2a2a] stroke-current"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 18C8 14.6863 10.6863 12 14 12H24.5C26.3565 12 28.137 12.7375 29.45 14.05L33.95 18.55C35.263 19.8625 37.0435 20.6 38.9 20.6H50C53.3137 20.6 56 23.2863 56 26.6V48C56 51.3137 53.3137 54 50 54H14C10.6863 54 8 51.3137 8 48V18Z"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#252525]"
          />
          <circle cx="32" cy="38" r="8" strokeWidth="2" className="text-[#2c2c2c]" />
          <path d="M32 34V39" strokeWidth="2" strokeLinecap="round" className="text-[#3a3a3a]" />
          <circle cx="32" cy="42" r="1" fill="#3a3a3a" />
        </svg>
      </div>
      <p className="text-xs sm:text-sm font-bold text-[#555555]">
        {isAr ? 'لا توجد بيانات لعرضها' : 'No data to display'}
      </p>
      {label && <p className="text-[11px] text-[#444444] mt-1">{label}</p>}
    </div>
  );

  return (
    <div className="w-full space-y-4 sm:space-y-6 text-[#ededed] pb-12 select-none font-['Cairo',sans-serif]">
      {/* Top Header / Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#141414] border border-[#222222] p-4 rounded-[12px] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00c853]/10 border border-[#00c853]/30 flex items-center justify-center text-[#00c853]">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>{isAr ? 'لوحة الإحصائيات والتحليلات' : 'Analytics & Performance'}</span>
              <span className="text-[10px] bg-[#00c853]/15 text-[#00c853] font-bold px-2 py-0.5 rounded-full border border-[#00c853]/30">
                {isAr ? 'مباشر • Real-time' : 'Live'}
              </span>
            </h1>
            <p className="text-xs text-[#888888] font-medium">
              {isAr
                ? 'متابعة حية للمبيعات، الطلبات، زيارات المتجر ومعدلات التحويل'
                : 'Live overview of sales, orders, visits, and conversion rates'}
            </p>
          </div>
        </div>

        {/* Time Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#0b0b0b] p-1 rounded-xl border border-[#222222] text-xs font-bold">
          <button
            onClick={() => setTimeRange('today')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              timeRange === 'today'
                ? 'bg-[#1c1c1c] text-[#00c853] shadow-xs'
                : 'text-[#777777] hover:text-[#cccccc]'
            }`}
          >
            {isAr ? 'اليوم' : 'Today'}
          </button>
          <button
            onClick={() => setTimeRange('7days')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              timeRange === '7days'
                ? 'bg-[#1c1c1c] text-[#00c853] shadow-xs'
                : 'text-[#777777] hover:text-[#cccccc]'
            }`}
          >
            {isAr ? 'آخر 7 أيام' : '7 Days'}
          </button>
          <button
            onClick={() => setTimeRange('30days')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
              timeRange === '30days'
                ? 'bg-[#1c1c1c] text-[#00c853] shadow-xs'
                : 'text-[#777777] hover:text-[#cccccc]'
            }`}
          >
            {isAr ? 'هذا الشهر' : 'This Month'}
          </button>
        </div>
      </div>

      {/* ========================================================
          SECTION 1: TOP 4 MAIN CARDS (Matching Image 2)
         ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. إجمالي المبيعات (Green dollar icon) */}
        <div className="bg-[#141414] border border-[#222222] rounded-[12px] p-4 flex flex-col justify-between hover:border-[#333333] transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs sm:text-sm font-bold text-[#aaaaaa]">
              {isAr ? 'إجمالي المبيعات' : 'Total Sales'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#00c853]/15 border border-[#00c853]/30 flex items-center justify-center text-[#00c853]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono">
            {totalSalesBaisa > 0 ? formatBaisaToOmr(totalSalesBaisa, lang) : '-'}
          </div>
        </div>

        {/* 2. الطلبات (Purple box icon) */}
        <div className="bg-[#141414] border border-[#222222] rounded-[12px] p-4 flex flex-col justify-between hover:border-[#333333] transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs sm:text-sm font-bold text-[#aaaaaa]">
              {isAr ? 'الطلبات' : 'Orders'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#9c27b0]/15 border border-[#9c27b0]/30 flex items-center justify-center text-[#ba68c8]">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono">
            {totalOrdersCount > 0 ? totalOrdersCount : '-'}
          </div>
        </div>

        {/* 3. زيارات (Blue eye icon) */}
        <div className="bg-[#141414] border border-[#222222] rounded-[12px] p-4 flex flex-col justify-between hover:border-[#333333] transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs sm:text-sm font-bold text-[#aaaaaa]">
              {isAr ? 'زيارات' : 'Visits'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#2196f3]/15 border border-[#2196f3]/30 flex items-center justify-center text-[#64b5f6]">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono">
            {totalVisits > 0 ? totalVisits : '-'}
          </div>
        </div>

        {/* 4. معدل التحويل (Cyan refresh icon) */}
        <div className="bg-[#141414] border border-[#222222] rounded-[12px] p-4 flex flex-col justify-between hover:border-[#333333] transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs sm:text-sm font-bold text-[#aaaaaa]">
              {isAr ? 'معدل التحويل' : 'Conversion Rate'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#00bcd4]/15 border border-[#00bcd4]/30 flex items-center justify-center text-[#4dd0e1]">
              <RefreshCw className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono">
            {totalOrdersCount > 0 ? `${conversionRate}%` : '-'}
          </div>
        </div>
      </div>

      {/* ========================================================
          SECTION 2: "مؤشرات إضافية" (8 Cards in 2 Rows of 4)
         ======================================================== */}
      <div>
        <h3 className="text-xs font-bold text-[#777777] mb-2.5 px-1 uppercase tracking-wider">
          {isAr ? 'مؤشرات إضافية' : 'Additional Indicators'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. صافي الربح (Green) */}
          <div className="bg-[#141414] border border-[#222222] rounded-[12px] p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#999999]">
                {isAr ? 'صافي الربح' : 'Net Profit'}
              </span>
              <div className="w-7 h-7 rounded-md bg-[#00c853]/15 text-[#00c853] flex items-center justify-center">
                <DollarSign className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-lg font-black text-white font-mono">
              {netProfitBaisa > 0 ? formatBaisaToOmr(netProfitBaisa, lang) : '-'}
            </div>
          </div>

          {/* 2. متوسط سعر الطلب (Purple) */}
          <div className="bg-[#141414] border border-[#222222] rounded-[12px] p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#999999]">
                {isAr ? 'متوسط سعر الطلب' : 'Average Order Value'}
              </span>
              <div className="w-7 h-7 rounded-md bg-[#9c27b0]/15 text-[#ba68c8] flex items-center justify-center">
                <Receipt className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-lg font-black text-white font-mono">
              {aovBaisa > 0 ? formatBaisaToOmr(aovBaisa, lang) : '-'}
            </div>
          </div>

          {/* 3. مرات إضافة للسلة (Green Cart) */}
          <div className="bg-[#141414] border border-[#222222] rounded-[12px] p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#999999]">
                {isAr ? 'مرات إضافة للسلة' : 'Cart Additions'}
              </span>
              <div className="w-7 h-7 rounded-md bg-[#00c853]/15 text-[#00c853] flex items-center justify-center">
                <ShoppingCart className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-lg font-black text-white font-mono">
              {cartAdditions > 0 ? cartAdditions : '-'}
            </div>
          </div>

          {/* 4. مرات بدء الشراء (Yellow Cart) */}
          <div className="bg-[#141414] border border-[#222222] rounded-[12px] p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#999999]">
                {isAr ? 'مرات بدء الشراء' : 'Checkout Initiations'}
              </span>
              <div className="w-7 h-7 rounded-md bg-[#ffb300]/15 text-[#ffca28] flex items-center justify-center">
                <ShoppingCart className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-lg font-black text-white font-mono">
              {checkoutStarts > 0 ? checkoutStarts : '-'}
            </div>
          </div>

          {/* 5. إضافة كروس سيل (Blue) */}
          <div className="bg-[#141414] border border-[#222222] rounded-[12px] p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#999999]">
                {isAr ? 'إضافة كروس سيل' : 'Cross-sell Added'}
              </span>
              <div className="w-7 h-7 rounded-md bg-[#2196f3]/15 text-[#64b5f6] flex items-center justify-center">
                <PlusCircle className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-lg font-black text-white font-mono">
              {crossSellAdditions > 0 ? crossSellAdditions : '-'}
            </div>
          </div>

          {/* 6. طلبات جديدة (Cyan) */}
          <div
            onClick={() => onNavigateTab('orders')}
            className="bg-[#141414] border border-[#222222] rounded-[12px] p-3.5 flex flex-col justify-between cursor-pointer hover:border-[#00c853]/50 transition"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#999999]">
                {isAr ? 'طلبات جديدة' : 'New Orders'}
              </span>
              <div className="w-7 h-7 rounded-md bg-[#00bcd4]/15 text-[#4dd0e1] flex items-center justify-center">
                <Receipt className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-lg font-black text-white font-mono flex items-center justify-between">
              <span>{newOrdersCount > 0 ? newOrdersCount : '-'}</span>
              {newOrdersCount > 0 && (
                <span className="text-[10px] bg-[#00c853]/20 text-[#00c853] px-2 py-0.5 rounded-full font-bold">
                  {isAr ? 'واردة الآن' : 'Incoming'}
                </span>
              )}
            </div>
          </div>

          {/* 7. الطلبات المفقودة (Red) */}
          <div className="bg-[#141414] border border-[#222222] rounded-[12px] p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#999999]">
                {isAr ? 'الطلبات المفقودة' : 'Lost / Abandoned'}
              </span>
              <div className="w-7 h-7 rounded-md bg-[#e53935]/15 text-[#ef5350] flex items-center justify-center">
                <AlertOctagon className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-lg font-black text-white font-mono">
              {lostOrdersCount > 0 ? lostOrdersCount : '-'}
            </div>
          </div>

          {/* 8. المعدل بالمفقودة (Teal) */}
          <div className="bg-[#141414] border border-[#222222] rounded-[12px] p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#999999]">
                {isAr ? 'المعدل بالمفقودة' : 'Lost Orders Rate'}
              </span>
              <div className="w-7 h-7 rounded-md bg-[#00897b]/15 text-[#26a69a] flex items-center justify-center">
                <Percent className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-lg font-black text-white font-mono">
              {lostOrdersCount > 0 ? `${lostOrdersRate}%` : '-'}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          SECTION 3: CHARTS & REPORTS (Matching Image 3)
         ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch">
        {/* Card 1: Wide Card on Right (3/4 width - 8 or 9 cols) - "إجمالي المبيعات" */}
        <div className="lg:col-span-8 xl:col-span-9 bg-[#141414] border border-[#222222] rounded-[12px] p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 border-b border-[#1f1f1f] pb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-4 bg-[#00c853] rounded-full" />
              <h3 className="text-sm sm:text-base font-black text-white">
                {isAr ? 'اجمالي المبيعات' : 'Total Sales'}
              </h3>
            </div>
            <span className="text-xs text-[#777777] font-mono">
              {totalSalesBaisa > 0 ? formatBaisaToOmr(totalSalesBaisa, lang) : ''}
            </span>
          </div>

          {/* Chart or Exact Empty State */}
          {totalSalesBaisa === 0 ? (
            <EmptyChartState />
          ) : (
            <div className="h-48 sm:h-56 flex flex-col justify-between">
              {/* Sleek SVG Area Chart */}
              <div className="flex-1 w-full relative">
                <svg className="w-full h-full" viewBox="0 0 500 150" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00c853" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#00c853" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,130 Q100,110 200,90 T350,50 T500,20 L500,150 L0,150 Z"
                    fill="url(#salesGrad)"
                  />
                  <path
                    d="M0,130 Q100,110 200,90 T350,50 T500,20"
                    fill="none"
                    stroke="#00c853"
                    strokeWidth="3"
                  />
                  <circle cx="500" cy="20" r="5" fill="#00c853" />
                </svg>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#666666] pt-2 border-t border-[#1f1f1f]">
                <span>{isAr ? 'بداية الفترة' : 'Start'}</span>
                <span>{isAr ? 'منتصف الفترة' : 'Mid'}</span>
                <span className="text-[#00c853] font-bold">{isAr ? 'اليوم' : 'Today'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Card 2: Sidebar Card on Left (1/4 width - 4 or 3 cols) - "معدلات التحويل" */}
        <div className="lg:col-span-4 xl:col-span-3 bg-[#141414] border border-[#222222] rounded-[12px] p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 border-b border-[#1f1f1f] pb-3">
              <div className="w-2 h-4 bg-[#00bcd4] rounded-full" />
              <h3 className="text-sm font-black text-white">
                {isAr ? 'معدلات التحويل' : 'Conversion Rates'}
              </h3>
            </div>

            {/* List of 3 stats from Image 3 */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#888888]">{isAr ? 'معدل التحويل' : 'Conversion Rate'}</span>
                <span className="text-white font-mono">{conversionRate}%</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#888888]">{isAr ? 'معدل الضغط علي الشراء' : 'Checkout Click Rate'}</span>
                <span className="text-white font-mono">{checkoutClickRate}%</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#888888]">{isAr ? 'معدل اضافة كروس سيل' : 'Cross-sell Rate'}</span>
                <span className="text-white font-mono">{crossSellRate}%</span>
              </div>
            </div>
          </div>

          {/* Empty state folder icon matching screenshot */}
          <EmptyChartState />
        </div>
      </div>

      {/* ========================================================
          BOTTOM ROW: 4 EQUAL CARDS (Matching Image 3)
         ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. اجمالي الطلبات */}
        <div className="bg-[#141414] border border-[#222222] rounded-[12px] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-2 mb-2">
            <h4 className="text-xs font-black text-white">
              {isAr ? 'اجمالي الطلبات' : 'Total Orders'}
            </h4>
            <span className="text-xs font-mono text-[#ba68c8] font-bold">{totalOrdersCount}</span>
          </div>
          {totalOrdersCount === 0 ? <EmptyChartState /> : (
            <div className="py-6 text-center">
              <span className="text-3xl font-black text-white font-mono">{totalOrdersCount}</span>
              <p className="text-xs text-[#777777] mt-1">{isAr ? 'طلب مسجل' : 'Registered orders'}</p>
            </div>
          )}
        </div>

        {/* 2. متوسط سعر الطلب */}
        <div className="bg-[#141414] border border-[#222222] rounded-[12px] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-2 mb-2">
            <h4 className="text-xs font-black text-white">
              {isAr ? 'متوسط سعر الطلب' : 'Average Order Value'}
            </h4>
            <span className="text-xs font-mono text-[#00c853] font-bold">
              {aovBaisa > 0 ? formatBaisaToOmr(aovBaisa, lang) : '-'}
            </span>
          </div>
          {aovBaisa === 0 ? <EmptyChartState /> : (
            <div className="py-6 text-center">
              <span className="text-2xl font-black text-white font-mono">
                {formatBaisaToOmr(aovBaisa, lang)}
              </span>
              <p className="text-xs text-[#777777] mt-1">{isAr ? 'متوسط الفاتورة' : 'Average invoice'}</p>
            </div>
          )}
        </div>

        {/* 3. اجمالي الزيارات */}
        <div className="bg-[#141414] border border-[#222222] rounded-[12px] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-2 mb-2">
            <h4 className="text-xs font-black text-white">
              {isAr ? 'اجمالي الزيارات' : 'Total Visits'}
            </h4>
            <span className="text-xs font-mono text-[#64b5f6] font-bold">{totalVisits}</span>
          </div>
          {totalVisits === 0 ? <EmptyChartState /> : (
            <div className="py-6 text-center">
              <span className="text-3xl font-black text-white font-mono">{totalVisits}</span>
              <p className="text-xs text-[#777777] mt-1">{isAr ? 'زيارة للمتجر' : 'Store visits'}</p>
            </div>
          )}
        </div>

        {/* 4. إجمالي بدء الشراء */}
        <div className="bg-[#141414] border border-[#222222] rounded-[12px] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-2 mb-2">
            <h4 className="text-xs font-black text-white">
              {isAr ? 'إجمالي بدء الشراء' : 'Checkout Initiations'}
            </h4>
            <span className="text-xs font-mono text-[#ffca28] font-bold">{checkoutStarts}</span>
          </div>
          {checkoutStarts === 0 ? <EmptyChartState /> : (
            <div className="py-6 text-center">
              <span className="text-3xl font-black text-white font-mono">{checkoutStarts}</span>
              <p className="text-xs text-[#777777] mt-1">{isAr ? 'محاولة طلب' : 'Checkout attempts'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
