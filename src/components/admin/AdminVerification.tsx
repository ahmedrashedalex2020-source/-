import React, { useState } from 'react';
import { MenuItem, Category, ExtractionStatus, formatBaisaToOmr } from '../../types/menu';
import {
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  FileEdit,
  CheckCircle,
  Edit3,
  ExternalLink,
  Save,
} from 'lucide-react';

interface AdminVerificationProps {
  items: MenuItem[];
  categories: Category[];
  onUpdateItem: (item: MenuItem) => Promise<void>;
  onEditItemModal: (item: MenuItem) => void;
  lang: 'ar' | 'en';
}

export const AdminVerification: React.FC<AdminVerificationProps> = ({
  items,
  categories,
  onUpdateItem,
  onEditItemModal,
  lang,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<ExtractionStatus | 'all'>('all');
  const [selectedImage, setSelectedImage] = useState<string>('all');
  const [editingPriceItemId, setEditingPriceItemId] = useState<string | null>(null);
  const [tempPriceOmr, setTempPriceOmr] = useState<string>('');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const isAr = lang === 'ar';

  const categoryMap = new Map(categories.map((c) => [c.id, isAr ? c.nameAr : c.nameEn]));

  // Filtering
  const filteredItems = items.filter((item) => {
    const matchesStatus =
      selectedStatus === 'all' || item.extractionStatus === selectedStatus;
    const matchesImage =
      selectedImage === 'all' || item.sourceImage === selectedImage;
    return matchesStatus && matchesImage;
  });

  const verifiedCount = items.filter((i) => i.extractionStatus === 'verified').length;
  const reviewCount = items.filter((i) => i.extractionStatus === 'needs_review').length;
  const missingPriceCount = items.filter((i) => i.extractionStatus === 'missing_price' || i.basePriceBaisa === 0).length;
  const draftCount = items.filter((i) => i.extractionStatus === 'draft').length;

  const handleQuickVerify = async (item: MenuItem) => {
    try {
      const updated: MenuItem = {
        ...item,
        extractionStatus: 'verified',
        isPublished: true,
        reviewedBy: 'Administrator',
        reviewedAt: new Date().toISOString(),
      };
      await onUpdateItem(updated);
      showNotice(isAr ? `تم توثيق "${item.nameAr}" بنجاح` : `Verified ${item.nameEn}`);
    } catch {
      showNotice(isAr ? 'حدث خطأ أثناء التحديث' : 'Error updating item');
    }
  };

  const handleSavePriceInline = async (item: MenuItem) => {
    const parsed = parseFloat(tempPriceOmr);
    if (isNaN(parsed) || parsed < 0) {
      alert(isAr ? 'يرجى إدخال سعر صحيح بالريال العماني' : 'Please enter valid OMR price');
      return;
    }
    const baisa = Math.round(parsed * 1000);
    try {
      const updated: MenuItem = {
        ...item,
        basePriceBaisa: baisa,
        originalPriceText: parsed.toFixed(3),
        extractionStatus: 'verified',
        isPublished: true,
        isAvailable: true,
        reviewedBy: 'Administrator',
        reviewedAt: new Date().toISOString(),
      };
      await onUpdateItem(updated);
      setEditingPriceItemId(null);
      showNotice(isAr ? `تم تحديث سعر "${item.nameAr}" إلى ${parsed.toFixed(3)} ر.ع وتوثيقه!` : `Price updated`);
    } catch {
      showNotice(isAr ? 'حدث خطأ' : 'Error saving price');
    }
  };

  const showNotice = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Explanation */}
      <div className="bg-white rounded-2xl border border-[#E8D8B5] p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#A1312E] bg-red-50 border border-red-200 px-3 py-1 rounded-full mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>{isAr ? 'شاشة التدقيق والمصادقة الإدارية' : 'Menu Import & Verification Screen'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#392A23]">
              {isAr ? 'تدقيق ومطابقة عناصر القائمة الورقية' : 'Paper Menu Data Verification'}
            </h2>
            <p className="text-xs sm:text-sm text-[#755947] mt-1 max-w-3xl leading-relaxed">
              {isAr
                ? 'مراجعة بيانات قائمة كبدة إسكندراني المستخرجة من الصور الثلاث لقائمة المطعم الورقية. تحقق من الأسعار والتفاصيل قبل النشر للعملاء لضمان دقة لا تشوبها شائبة.'
                : 'Inspect extracted menu items against the 3 authoritative paper menu photos. Verify prices, confirm portion notes, and resolve missing market rates before public display.'}
            </p>
          </div>

          {/* Progress Pill */}
          <div className="bg-[#FFF9EF] p-4 rounded-xl border border-[#C58D38]/40 shrink-0 text-center">
            <span className="text-xs text-[#755947] font-bold block mb-1">
              {isAr ? 'نسبة العناصر الموثقة' : 'Verified Ratio'}
            </span>
            <div className="text-2xl font-black text-[#A1312E]">
              {verifiedCount} / {items.length}
            </div>
            <span className="text-[11px] text-[#755947]">
              {Math.round((verifiedCount / (items.length || 1)) * 100)}% {isAr ? 'مكتمل' : 'Complete'}
            </span>
          </div>
        </div>

        {actionMessage && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold animate-in fade-in">
            {actionMessage}
          </div>
        )}
      </div>

      {/* Filter Tabs by Verification Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E8D8B5]">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedStatus === 'all'
                ? 'bg-[#392A23] text-white'
                : 'text-[#755947] hover:bg-[#FFF9EF]'
            }`}
          >
            {isAr ? 'الكل' : 'All'} ({items.length})
          </button>

          <button
            onClick={() => setSelectedStatus('needs_review')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              selectedStatus === 'needs_review'
                ? 'bg-amber-600 text-white'
                : 'text-amber-800 bg-amber-50 hover:bg-amber-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{isAr ? 'بحاجة لمراجعة' : 'Needs Review'}</span> ({reviewCount})
          </button>

          <button
            onClick={() => setSelectedStatus('missing_price')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              selectedStatus === 'missing_price'
                ? 'bg-rose-600 text-white'
                : 'text-rose-800 bg-rose-50 hover:bg-rose-100'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{isAr ? 'سعر مفقود / بالسوق' : 'Missing Price'}</span> ({missingPriceCount})
          </button>

          <button
            onClick={() => setSelectedStatus('draft')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              selectedStatus === 'draft'
                ? 'bg-slate-700 text-white'
                : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            <FileEdit className="w-3.5 h-3.5" />
            <span>{isAr ? 'مسودة' : 'Draft'}</span> ({draftCount})
          </button>

          <button
            onClick={() => setSelectedStatus('verified')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              selectedStatus === 'verified'
                ? 'bg-emerald-700 text-white'
                : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isAr ? 'موثق' : 'Verified'}</span> ({verifiedCount})
          </button>
        </div>

        {/* Source Image Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-[#755947]">{isAr ? 'صورة المصدر:' : 'Source:'}</span>
          <select
            value={selectedImage}
            onChange={(e) => setSelectedImage(e.target.value)}
            className="bg-[#FFF9EF] border border-[#E8D8B5] text-[#392A23] rounded-xl px-2.5 py-1 text-xs font-bold outline-hidden"
          >
            <option value="all">{isAr ? 'جميع الصور (١، ٢، ٣)' : 'All Images (1, 2, 3)'}</option>
            <option value="Image 1">Image 1 (Sandwiches, Shawarma, Burger, Plates, Apps, Salad)</option>
            <option value="Image 2">Image 2 (Grills, Ayoush Rice, Salona, Bread, Fish)</option>
            <option value="Image 3">Image 3 (Cover, Manakish, Pastry, Juices, Drinks, Desserts)</option>
          </select>
        </div>
      </div>

      {/* Verification Items List */}
      <div className="space-y-4">
        {filteredItems.map((item) => {
          const catName = categoryMap.get(item.categoryId) || item.categoryId;
          const isMissingPrice = item.extractionStatus === 'missing_price' || item.basePriceBaisa === 0;

          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border p-4 sm:p-5 transition-all shadow-2xs ${
                isMissingPrice
                  ? 'border-rose-300 ring-2 ring-rose-100'
                  : item.extractionStatus === 'needs_review'
                  ? 'border-amber-300'
                  : 'border-[#E8D8B5]'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Product Core Provenance */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FFF9EF] border border-[#C58D38] text-[#755947]">
                      {item.sourceImage}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                      {catName}
                    </span>

                    {/* Status Badge */}
                    {item.extractionStatus === 'verified' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        <span>{isAr ? 'موثق' : 'Verified'}</span>
                      </span>
                    )}
                    {item.extractionStatus === 'needs_review' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>{isAr ? 'بحاجة لمراجعة' : 'Needs Review'}</span>
                      </span>
                    )}
                    {isMissingPrice && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 flex items-center gap-1">
                        <HelpCircle className="w-3 h-3" />
                        <span>{isAr ? 'سعر غير مدون بالقائمة الورقية' : 'Missing Price in Source'}</span>
                      </span>
                    )}
                  </div>

                  {/* Names */}
                  <div className="flex items-baseline gap-3">
                    <h3 className="text-base sm:text-lg font-bold text-[#392A23]">
                      {item.nameAr}
                    </h3>
                    <span className="text-sm font-semibold text-[#755947]">
                      {item.nameEn}
                    </span>
                  </div>

                  {/* Portion details or accompaniments */}
                  {(item.portionDetailsAr || item.accompanimentsAr) && (
                    <p className="text-xs text-[#755947] bg-[#FFF9EF] p-2 rounded-lg border border-[#E8D8B5]">
                      {item.portionDetailsAr || item.portionDetailsEn || item.accompanimentsAr}
                    </p>
                  )}

                  {/* Admin notes on original text */}
                  {item.adminNotes && (
                    <p className="text-xs text-amber-800 italic">
                      📌 {item.adminNotes}
                    </p>
                  )}

                  {/* Variants display if applicable */}
                  {item.hasVariants && item.variants && (
                    <div className="pt-1 flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold text-[#755947]">
                        {isAr ? 'الأحجام المسجلة:' : 'Extracted variants:'}
                      </span>
                      {item.variants.map((v) => (
                        <span
                          key={v.id}
                          className="text-[11px] bg-[#FFF9EF] border border-[#E8D8B5] px-2 py-0.5 rounded-md font-semibold text-[#392A23]"
                        >
                          {v.nameAr} ({v.nameEn}): {formatBaisaToOmr(v.priceBaisa, lang)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price & Action Area */}
                <div className="flex flex-col sm:flex-row sm:items-center lg:flex-col lg:items-end gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#E8D8B5]">
                  {/* Price Block */}
                  <div className="text-start lg:text-end">
                    <span className="text-[10px] text-[#755947] block font-semibold">
                      {isAr ? 'السعر المسجل' : 'Registered Price'}
                    </span>
                    {editingPriceItemId === item.id ? (
                      <div className="flex items-center gap-1.5 mt-1">
                        <input
                          type="number"
                          step="0.100"
                          value={tempPriceOmr}
                          onChange={(e) => setTempPriceOmr(e.target.value)}
                          placeholder="0.000"
                          className="w-24 bg-white border border-[#A1312E] rounded-lg p-1 text-xs font-bold text-center outline-hidden"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSavePriceInline(item)}
                          className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition"
                          title={isAr ? 'حفظ وتوثيق' : 'Save and Verify'}
                        >
                          <Save className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-lg font-black text-[#A1312E]">
                        {isMissingPrice
                          ? (isAr ? 'غير مسجل' : 'Unset')
                          : formatBaisaToOmr(item.basePriceBaisa, lang)}
                      </span>
                    )}
                    {item.originalPriceText && (
                      <span className="text-[10px] text-[#755947]/70 block">
                        {isAr ? `نص القائمة: ${item.originalPriceText}` : `Raw: ${item.originalPriceText}`}
                      </span>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-2">
                    {isMissingPrice ? (
                      <button
                        onClick={() => {
                          setEditingPriceItemId(item.id);
                          setTempPriceOmr('');
                        }}
                        className="px-3 py-1.5 bg-[#A1312E] hover:bg-[#862724] text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{isAr ? 'تحديد السعر والمصادقة' : 'Set Price & Verify'}</span>
                      </button>
                    ) : item.extractionStatus !== 'verified' ? (
                      <button
                        onClick={() => handleQuickVerify(item)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>{isAr ? 'تأكيد وصحة البيانات' : 'Confirm & Verify'}</span>
                      </button>
                    ) : null}

                    <button
                      onClick={() => onEditItemModal(item)}
                      className="p-1.5 text-[#755947] hover:text-[#A1312E] hover:bg-[#FFF9EF] border border-[#E8D8B5] rounded-xl transition"
                      title={isAr ? 'تعديل كامل' : 'Edit full record'}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-[#E8D8B5] text-[#755947]">
            <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
            <p className="font-bold">{isAr ? 'لا توجد عناصر مطابقة لهذا الفلتر' : 'No items match this filter'}</p>
          </div>
        )}
      </div>
    </div>
  );
};
