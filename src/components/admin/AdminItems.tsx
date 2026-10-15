import React, { useState } from 'react';
import { MenuItem, Category, formatBaisaToOmr } from '../../types/menu';
import {
  Plus,
  Search,
  Trash2,
  Copy,
  Edit,
  Eye,
  EyeOff,
  Check,
  X,
  Sparkles,
  Save,
  CheckCircle2,
  DollarSign,
  Utensils,
  Layers,
  ArrowUpDown,
  AlertCircle,
} from 'lucide-react';

interface AdminItemsProps {
  items: MenuItem[];
  categories: Category[];
  onOpenAddModal: () => void;
  onOpenEditModal: (item: MenuItem) => void;
  onDeleteItem: (id: string, name: string) => Promise<void>;
  onDuplicateItem: (item: MenuItem) => Promise<void>;
  onToggleAvailability: (id: string, isAvailable: boolean) => Promise<void>;
  onTogglePublished: (id: string, isPublished: boolean) => Promise<void>;
  onUpdateItemDirect?: (item: MenuItem) => Promise<void>;
  lang: 'ar' | 'en';
}

export const AdminItems: React.FC<AdminItemsProps> = ({
  items,
  categories,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteItem,
  onDuplicateItem,
  onToggleAvailability,
  onTogglePublished,
  onUpdateItemDirect,
  lang,
}) => {
  const isAr = lang === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'order' | 'name' | 'priceAsc' | 'priceDesc'>('order');

  // Inline Quick Editing states
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPriceOmr, setTempPriceOmr] = useState<string>('');

  // Toast feedback banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const categoryMap = new Map(categories.map((c) => [c.id, c.nameAr]));

  // Inline Price Edit Handlers
  const handleStartPriceEdit = (item: MenuItem) => {
    setEditingPriceId(item.id);
    setTempPriceOmr((item.basePriceBaisa / 1000).toFixed(3));
  };

  const handleCancelPriceEdit = () => {
    setEditingPriceId(null);
    setTempPriceOmr('');
  };

  const handleSavePriceEdit = async (item: MenuItem) => {
    const parsed = parseFloat(tempPriceOmr);
    if (isNaN(parsed) || parsed < 0) {
      showToast('❌ من فضلك اكتب سعر صحيح بالريال العماني يا فندم (مثال: 0.500 أو 1.200)');
      return;
    }

    const newBaisa = Math.round(parsed * 1000);
    const updated: MenuItem = {
      ...item,
      basePriceBaisa: newBaisa,
      originalPriceText: parsed.toFixed(3),
      extractionStatus: 'verified',
      updatedAt: new Date().toISOString(),
    };

    if (onUpdateItemDirect) {
      await onUpdateItemDirect(updated);
    }
    setEditingPriceId(null);
    showToast(`تمام يا باشا! تم تعديل سعر "${item.nameAr}" لـ ${parsed.toFixed(3)} ر.ع وتحدث في القائمة العامة فوراً`);
  };

  // Inline Category Change Handler
  const handleQuickCategoryChange = async (item: MenuItem, newCatId: string) => {
    const updated: MenuItem = {
      ...item,
      categoryId: newCatId,
      updatedAt: new Date().toISOString(),
    };
    if (onUpdateItemDirect) {
      await onUpdateItemDirect(updated);
    }
    const catName = categoryMap.get(newCatId) || newCatId;
    showToast(`اتنقل الصنف "${item.nameAr}" لقسم "${catName}" بنجاح`);
  };

  // Inline Featured Toggle
  const handleToggleFeatured = async (item: MenuItem) => {
    const updated: MenuItem = {
      ...item,
      isFeatured: !item.isFeatured,
      updatedAt: new Date().toISOString(),
    };
    if (onUpdateItemDirect) {
      await onUpdateItemDirect(updated);
    }
    showToast(updated.isFeatured ? `تم تمييز صنف "${item.nameAr}" كطبق مميز بالمنيو!` : `تم إلغاء التمييز لصنف "${item.nameAr}"`);
  };

  // Filter & Sort
  const filteredItems = items
    .filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.nameAr.toLowerCase().includes(q) ||
        item.nameEn.toLowerCase().includes(q) ||
        (item.descriptionAr && item.descriptionAr.toLowerCase().includes(q)) ||
        (item.descriptionEn && item.descriptionEn.toLowerCase().includes(q));

      const matchesCategory =
        selectedCategory === 'all' || item.categoryId === selectedCategory;

      const matchesStatus =
        selectedStatusFilter === 'all' ||
        (selectedStatusFilter === 'published' && item.isPublished) ||
        (selectedStatusFilter === 'draft' && !item.isPublished) ||
        (selectedStatusFilter === 'available' && item.isAvailable) ||
        (selectedStatusFilter === 'soldout' && !item.isAvailable);

      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.nameAr.localeCompare(b.nameAr);
      }
      if (sortBy === 'priceAsc') {
        return a.basePriceBaisa - b.basePriceBaisa;
      }
      if (sortBy === 'priceDesc') {
        return b.basePriceBaisa - a.basePriceBaisa;
      }
      return a.displayOrder - b.displayOrder;
    });

  const handleDeleteConfirm = (item: MenuItem) => {
    if (window.confirm(`يا باشا هل أنت متأكد من مسح صنف "${item.nameAr}" نهائياً من قاعدة البيانات؟`)) {
      onDeleteItem(item.id, item.nameAr);
      showToast(`اتمسح صنف "${item.nameAr}" بنجاح`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 start-1/2 -translate-x-1/2 z-50 bg-[#392A23] text-white px-6 py-3.5 rounded-2xl shadow-2xl border-2 border-[#C58D38] flex items-center gap-3 animate-in fade-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Quick Add */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#E8D8B5] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-red-100 text-[#A1312E]">
              <Utensils className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#392A23]">
              لوحة التحكم الاحترافية في وجبات وقائمة الطعام
            </h2>
          </div>
          <p className="text-xs text-[#755947] mt-1">
            عدّل الأسعار والأصناف مباشرة بنقرة واحدة — كل تغيير بينزل فوراً على قائمة الزباين
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center justify-center gap-2 bg-[#A1312E] hover:bg-[#862724] text-white px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition shadow-md hover:scale-102"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة وجبة جديدة</span>
        </button>
      </div>

      {/* Quick Search & Filter Console */}
      <div className="bg-white p-4 rounded-3xl border border-[#E8D8B5] space-y-3 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search bar */}
          <div className="relative md:col-span-5">
            <Search className="w-4 h-4 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم الوجبة، الكبدة، الشاورما، المشاوي..."
              className="w-full bg-[#FFF9EF] border border-[#E8D8B5] focus:border-[#A1312E] rounded-2xl ltr:pl-9 ltr:pr-3 rtl:pr-9 rtl:pl-3 py-2.5 text-xs font-bold text-[#392A23] outline-hidden"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#FFF9EF] border border-[#E8D8B5] focus:border-[#A1312E] rounded-2xl px-3 py-2.5 text-xs font-bold text-[#392A23] outline-hidden cursor-pointer"
            >
              <option value="all">كل الأقسام ({items.length} صنف)</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nameAr} ({c.nameEn})
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="w-full bg-[#FFF9EF] border border-[#E8D8B5] focus:border-[#A1312E] rounded-2xl px-3 py-2.5 text-xs font-bold text-[#392A23] outline-hidden cursor-pointer"
            >
              <option value="all">كل الحالات</option>
              <option value="available">المتوفر فقط</option>
              <option value="soldout">النافذ فقط</option>
              <option value="published">المنشور للعملاء</option>
              <option value="draft">المسودات المخفية</option>
            </select>
          </div>

          {/* Sorting */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-[#FFF9EF] border border-[#E8D8B5] focus:border-[#A1312E] rounded-2xl px-3 py-2.5 text-xs font-bold text-[#392A23] outline-hidden cursor-pointer"
            >
              <option value="order">ترتيب القائمة الأصلي</option>
              <option value="name">أبجدياً (أ - ي)</option>
              <option value="priceAsc">السعر: من الأقل للأعلى</option>
              <option value="priceDesc">السعر: من الأعلى للأقل</option>
            </select>
          </div>
        </div>

        {/* Quick count indicator */}
        <div className="flex items-center justify-between text-[11px] text-[#755947] font-bold px-2 pt-1 border-t border-[#E8D8B5]/40">
          <span>
            معروض حالياً: <strong className="text-[#A1312E]">{filteredItems.length}</strong> من أصل {items.length} صنف
          </span>
          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            ✓ التعديل السريع للأسعار مفعل بالجدول (اضغط على أي سعر لتغييره فوراً)
          </span>
        </div>
      </div>

      {/* Main Operational Items Table */}
      <div className="bg-white rounded-3xl border border-[#E8D8B5] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-[#FFF9EF] border-b border-[#E8D8B5] text-[#755947] font-black">
              <tr>
                <th className="p-3.5 text-center w-12">#</th>
                <th className="p-3.5 text-start min-w-[200px]">الصنف والاسم</th>
                <th className="p-3.5 text-start min-w-[150px]">القسم</th>
                <th className="p-3.5 text-start min-w-[160px]">
                  السعر بالريال (OMR)
                  <span className="block text-[10px] font-normal text-emerald-700">اضغط لتعديل السعر</span>
                </th>
                <th className="p-3.5 text-center">الأحجام المتعددة</th>
                <th className="p-3.5 text-center">التوفر بالمطعم</th>
                <th className="p-3.5 text-center">الظهور بالمنيو</th>
                <th className="p-3.5 text-center">مميز</th>
                <th className="p-3.5 text-end min-w-[130px]">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8D8B5]/50">
              {filteredItems.map((item, idx) => {
                const isPriceEditing = editingPriceId === item.id;
                const formattedPrice = formatBaisaToOmr(item.basePriceBaisa, 'ar');

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-[#FFF9EF]/60 transition ${
                      !item.isAvailable ? 'bg-gray-50/70 opacity-80' : ''
                    }`}
                  >
                    {/* Index */}
                    <td className="p-3.5 text-center font-mono font-bold text-gray-400">
                      {idx + 1}
                    </td>

                    {/* Name & Subtitle */}
                    <td className="p-3.5">
                      <div className="flex items-start gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-black text-[#392A23] text-sm">
                              {item.nameAr}
                            </span>
                            {item.isFeatured && (
                              <Sparkles className="w-3.5 h-3.5 text-[#C58D38] fill-[#C58D38] shrink-0" />
                            )}
                          </div>
                          <span className="text-[11px] font-semibold text-[#755947]/70 block font-['Inter']">
                            {item.nameEn}
                          </span>
                          {item.portionDetailsAr && (
                            <span className="text-[10px] text-[#A1312E] bg-red-50 border border-red-100 px-1.5 py-0.5 rounded-md mt-1 inline-block">
                              {item.portionDetailsAr}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category Selector Dropdown */}
                    <td className="p-3.5">
                      <select
                        value={item.categoryId}
                        onChange={(e) => handleQuickCategoryChange(item, e.target.value)}
                        className="bg-[#FFF9EF] hover:bg-white border border-[#E8D8B5] hover:border-[#A1312E] rounded-xl px-2 py-1.5 text-xs font-bold text-[#392A23] outline-hidden cursor-pointer"
                        title="تغيير القسم فوراً"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nameAr}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Price Cell with One-Click Inline Edit */}
                    <td className="p-3.5">
                      {isPriceEditing ? (
                        <div className="flex items-center gap-1.5 animate-in fade-in">
                          <input
                            type="number"
                            step="0.050"
                            min="0"
                            value={tempPriceOmr}
                            onChange={(e) => setTempPriceOmr(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSavePriceEdit(item);
                              if (e.key === 'Escape') handleCancelPriceEdit();
                            }}
                            className="w-24 bg-white border-2 border-[#A1312E] rounded-xl p-1.5 text-xs font-black text-[#A1312E] outline-hidden text-center shadow-xs"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSavePriceEdit(item)}
                            className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition"
                            title="حفظ السعر فوراً (Enter)"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancelPriceEdit}
                            className="p-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition"
                            title="إلغاء (Esc)"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => handleStartPriceEdit(item)}
                          className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FFF9EF] border border-[#C58D38]/50 hover:border-[#A1312E] hover:bg-white cursor-pointer transition shadow-2xs"
                          title="اضغط لتعديل السعر مباشرة"
                        >
                          <span className="font-black text-[#A1312E] text-sm font-mono">
                            {item.extractionStatus === 'missing_price' && item.basePriceBaisa === 0 ? (
                              <span className="text-amber-700 text-xs font-bold">تحديد السعر ✍️</span>
                            ) : (
                              formattedPrice
                            )}
                          </span>
                          <span className="text-[10px] text-gray-400 group-hover:text-[#A1312E]">
                            ✏️
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Variants badge */}
                    <td className="p-3.5 text-center">
                      {item.hasVariants && item.variants && item.variants.length > 0 ? (
                        <span
                          onClick={() => onOpenEditModal(item)}
                          className="px-2.5 py-1 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 font-bold text-[10px] cursor-pointer hover:bg-blue-100 inline-block"
                          title="اضغط لتعديل تفاصيل وأسعار الأحجام"
                        >
                          {item.variants.length} أحجام ⚙️
                        </span>
                      ) : (
                        <span className="text-gray-400 font-semibold text-[11px]">سعر واحد</span>
                      )}
                    </td>

                    {/* Stock Availability Toggle */}
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => {
                          onToggleAvailability(item.id, !item.isAvailable);
                          showToast(
                            !item.isAvailable
                              ? `تم تعيين "${item.nameAr}" متوفر بالمطعم`
                              : `تم تعيين "${item.nameAr}" غير متوفر (نافذ)`
                          );
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer shadow-2xs ${
                          item.isAvailable
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                            : 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-300'
                        }`}
                        title="انقر لتغيير التوفر"
                      >
                        {item.isAvailable ? 'متوفر ✓' : 'غير متوفر ✕'}
                      </button>
                    </td>

                    {/* Published in public menu toggle */}
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => {
                          onTogglePublished(item.id, !item.isPublished);
                          showToast(
                            !item.isPublished
                              ? `تم نشر صنف "${item.nameAr}" في المنيو`
                              : `تم إخفاء صنف "${item.nameAr}" وحفظه كمسودة`
                          );
                        }}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 mx-auto ${
                          item.isPublished
                            ? 'bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-200'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200 border border-gray-300'
                        }`}
                        title="انقر لإخفاء أو إظهار الصنف في المنيو"
                      >
                        {item.isPublished ? (
                          <>
                            <Eye className="w-3.5 h-3.5 text-blue-600" />
                            <span>ظاهر</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-gray-400" />
                            <span>مخفي</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Featured Toggle */}
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => handleToggleFeatured(item)}
                        className={`p-1.5 rounded-xl transition ${
                          item.isFeatured
                            ? 'text-[#C58D38] bg-amber-50 hover:bg-amber-100'
                            : 'text-gray-300 hover:text-amber-500'
                        }`}
                        title="تمييز كطبق رئيسي مميز"
                      >
                        <Sparkles className={`w-4 h-4 ${item.isFeatured ? 'fill-[#C58D38]' : ''}`} />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-end">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        <button
                          onClick={() => onOpenEditModal(item)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition text-xs font-black shadow-xs cursor-pointer hover:scale-102"
                          title="تعديل تفصيلي كامل للصنف والأسعار والأحجام"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>تعديل ✏️</span>
                        </button>

                        <button
                          onClick={() => {
                            onDuplicateItem(item);
                            showToast(`تم نسخ صنف "${item.nameAr}"`);
                          }}
                          className="p-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl transition cursor-pointer"
                          title="نسخ وتكرار الصنف"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteConfirm(item)}
                          className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition cursor-pointer"
                          title="حذف نهائي"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-[#755947]">
                    <AlertCircle className="w-8 h-8 text-[#C58D38] mx-auto mb-2 opacity-60" />
                    <p className="font-bold text-sm">مفيش وجبات مطابقة للبحث أو الفلتر ده يا فندم</p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                        setSelectedStatusFilter('all');
                      }}
                      className="mt-2 text-xs font-bold text-[#A1312E] underline"
                    >
                      إعادة ضبط الفلاتر
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
