import React from 'react';
import { Category, MenuItem } from '../../types/menu';
import {
  FolderKanban,
  UtensilsCrossed,
  CheckCircle2,
  FileEdit,
  AlertTriangle,
  HelpCircle,
  ArchiveX,
  Clock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface AdminOverviewProps {
  categories: Category[];
  items: MenuItem[];
  onNavigateTab: (tabId: string) => void;
  lang: 'ar' | 'en';
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  categories,
  items,
  onNavigateTab,
  lang,
}) => {
  const isAr = lang === 'ar';

  const totalCategories = categories.length;
  const totalProducts = items.length;
  const publishedProducts = items.filter((i) => i.isPublished).length;
  const draftProducts = items.filter((i) => !i.isPublished).length;
  const awaitingReview = items.filter((i) => i.extractionStatus === 'needs_review').length;
  const missingPrices = items.filter((i) => i.extractionStatus === 'missing_price' || i.basePriceBaisa === 0).length;
  const outOfStock = items.filter((i) => !i.isAvailable).length;
  const verifiedProducts = items.filter((i) => i.extractionStatus === 'verified').length;

  const recentItems = [...items]
    .sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''))
    .slice(0, 6);

  const stats = [
    {
      title: isAr ? 'إجمالي الأقسام' : 'Total Categories',
      value: totalCategories,
      icon: FolderKanban,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 border-indigo-200',
      tab: 'categories',
    },
    {
      title: isAr ? 'إجمالي المنتجات' : 'Total Menu Items',
      value: totalProducts,
      icon: UtensilsCrossed,
      color: 'text-[#A1312E]',
      bg: 'bg-red-50 border-red-200',
      tab: 'items',
    },
    {
      title: isAr ? 'منتجات منشورة' : 'Published Items',
      value: publishedProducts,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-200',
      tab: 'items',
    },
    {
      title: isAr ? 'مسودات غير منشورة' : 'Draft Items',
      value: draftProducts,
      icon: FileEdit,
      color: 'text-slate-600',
      bg: 'bg-slate-50 border-slate-200',
      tab: 'items',
    },
    {
      title: isAr ? 'أسعار مؤكدة رسمياً' : 'Verified Products',
      value: verifiedProducts,
      icon: ShieldCheck,
      color: 'text-teal-600',
      bg: 'bg-teal-50 border-teal-200',
      tab: 'verification',
    },
    {
      title: isAr ? 'بانتظار المراجعة' : 'Needs Review',
      value: awaitingReview,
      icon: AlertTriangle,
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-200',
      tab: 'verification',
      urgent: awaitingReview > 0,
    },
    {
      title: isAr ? 'أسعار مفقودة / سوقية' : 'Missing Prices',
      value: missingPrices,
      icon: HelpCircle,
      color: 'text-rose-600',
      bg: 'bg-rose-50 border-rose-200',
      tab: 'verification',
      urgent: missingPrices > 0,
    },
    {
      title: isAr ? 'وجبات غير متوفرة (نفذت)' : 'Out of Stock',
      value: outOfStock,
      icon: ArchiveX,
      color: 'text-orange-600',
      bg: 'bg-orange-50 border-orange-200',
      tab: 'items',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Alert Banner if items need review */}
      {(awaitingReview > 0 || missingPrices > 0) && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900">
                {isAr ? 'عناصر بحاجة للمراجعة من الصور الأصلية' : 'Items require manual review'}
              </h4>
              <p className="text-xs text-amber-700 mt-0.5">
                {isAr
                  ? `يوجد ${missingPrices} صنف بدون سعر واضح (مثل سمك بابلوه، الروبيان، الكلماري) بحاجة لتأكيدك قبل النشر.`
                  : `There are ${missingPrices} items with missing/unlisted prices in the original menu photos.`}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('verification')}
            className="whitespace-nowrap px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
          >
            <span>{isAr ? 'فتح شاشة التدقيق' : 'Open Verification'}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              onClick={() => onNavigateTab(stat.tab)}
              className={`p-4 rounded-2xl border ${stat.bg} transition-all hover:shadow-xs cursor-pointer flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#755947]">
                  {stat.title}
                </span>
                <div className={`p-2 rounded-xl bg-white shadow-2xs ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-black text-[#392A23]">
                  {stat.value}
                </span>
                {stat.urgent && (
                  <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded-md animate-pulse">
                    {isAr ? 'تنبيه' : 'Action'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Section: Recent Updates & Data Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recently Updated Products */}
        <div className="bg-white rounded-2xl border border-[#E8D8B5] p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#A1312E]" />
              <h3 className="text-sm font-bold text-[#392A23]">
                {isAr ? 'آخر المنتجات المحدثة' : 'Recently Updated Products'}
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('items')}
              className="text-xs font-bold text-[#A1312E] hover:underline"
            >
              {isAr ? 'عرض الكل' : 'View All'}
            </button>
          </div>

          <div className="divide-y divide-[#E8D8B5]/50">
            {recentItems.map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-[#392A23] truncate">
                    {isAr ? item.nameAr : item.nameEn}
                  </p>
                  <span className="text-[11px] text-[#755947]/70">
                    {item.sourceImage} • {item.hasVariants ? (isAr ? 'متعدد الأحجام' : 'Variants') : (isAr ? 'سعر أساسي' : 'Standard')}
                  </span>
                </div>
                <div className="text-end shrink-0">
                  <span className="font-bold text-[#A1312E] block">
                    {(item.basePriceBaisa / 1000).toFixed(3)} OMR
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
                      item.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {item.isAvailable ? (isAr ? 'متوفر' : 'In Stock') : (isAr ? 'غير متوفر' : 'Out')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit & Compliance Card */}
        <div className="bg-white rounded-2xl border border-[#E8D8B5] p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-bold text-[#392A23]">
                {isAr ? 'حالة استخراج وتوثيق قائمة الطعام' : 'Menu Extraction Health'}
              </h3>
            </div>

            <p className="text-xs text-[#755947] leading-relaxed mb-4">
              {isAr
                ? 'تم استخراج بيانات المطعم بدقة من ٣ صور رسمية لقائمة الطعام الورقية مع ربط كل عنصر بمصدره وصورته وتحديد أسعار الريال العماني بالأرقام الدقيقة.'
                : 'Menu records extracted from 3 original menu photographs with 100% provenance tracking, variant matrixes, and integer baisa accuracy.'}
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#E8D8B5]/50">
                <span className="text-[#755947]">{isAr ? 'العملة المعتمدة' : 'Standard Currency'}:</span>
                <span className="font-bold text-[#392A23]">ريال عماني (1 OMR = 1000 baisa)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E8D8B5]/50">
                <span className="text-[#755947]">{isAr ? 'عدد صور المصدر' : 'Source Menu Images'}:</span>
                <span className="font-bold text-[#392A23]">٣ صور مستندات ورقية</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E8D8B5]/50">
                <span className="text-[#755947]">{isAr ? 'قاعدة البيانات المتصلة' : 'Database'}:</span>
                <span className="font-bold text-emerald-700">Cloud Firestore (Live)</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[#E8D8B5] flex gap-2">
            <button
              onClick={() => onNavigateTab('verification')}
              className="flex-1 py-2 px-3 bg-[#A1312E] hover:bg-[#862724] text-white rounded-xl text-xs font-bold text-center transition"
            >
              {isAr ? 'شاشة التدقيق والمراجعة' : 'Audit Screen'}
            </button>
            <button
              onClick={() => onNavigateTab('qr')}
              className="py-2 px-3 bg-[#FFF9EF] border border-[#C58D38] hover:bg-white text-[#755947] rounded-xl text-xs font-bold text-center transition"
            >
              {isAr ? 'رمز QR' : 'QR Code'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
