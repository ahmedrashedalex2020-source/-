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
  Utensils,
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

  const categoryMap = new Map(categories.map((c) => [c.id, isAr ? c.nameAr : c.nameEn]));

  // Inline Quick Price Edit Handlers
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
      showToast(isAr ? 'يرجى كتابة سعر صحيح بالريال العماني' : 'Invalid price');
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
    showToast(`تم تعديل سعر "${item.nameAr}" لـ ${parsed.toFixed(3)} ر.ع`);
  };

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
    showToast(`تم نقل "${item.nameAr}" لقسم "${catName}"`);
  };

  const handleToggleFeatured = async (item: MenuItem) => {
    const updated: MenuItem = {
      ...item,
      isFeatured: !item.isFeatured,
      updatedAt: new Date().toISOString(),
    };
    if (onUpdateItemDirect) {
      await onUpdateItemDirect(updated);
    }
    showToast(updated.isFeatured ? `تم تمييز "${item.nameAr}" كطبق مميز` : `إلغاء التمييز`);
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
      if (sortBy === 'name') return a.nameAr.localeCompare(b.nameAr);
      if (sortBy === 'priceAsc') return a.basePriceBaisa - b.basePriceBaisa;
      if (sortBy === 'priceDesc') return b.basePriceBaisa - a.basePriceBaisa;
      return a.displayOrder - b.displayOrder;
    });

  const handleDeleteConfirm = (item: MenuItem) => {
    if (window.confirm(isAr ? `هل أنت متأكد من حذف صنف "${item.nameAr}" نهائياً؟` : 'Delete item?')) {
      onDeleteItem(item.id, item.nameAr);
      showToast(isAr ? `تم حذف "${item.nameAr}"` : 'Item deleted');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 text-[#ededed] font-['Cairo',sans-serif]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 start-1/2 -translate-x-1/2 z-50 bg-[#1c1c1c] text-[#00c853] px-5 py-3 rounded-xl shadow-2xl border border-[#00c853]/40 flex items-center gap-2.5 animate-in fade-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-4 h-4 text-[#00c853] shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Quick Add */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141414] p-4 sm:p-5 rounded-[12px] border border-[#222222] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#00c853]/15 text-[#00c853] border border-[#00c853]/30">
              <Utensils className="w-4 h-4" />
            </span>
            <h2 className="text-lg sm:text-xl font-black text-white">
              {isAr ? 'إدارة وجبات ومنتجات المنيو' : 'Menu Items Management'}
            </h2>
            <span className="text-[11px] bg-[#1c1c1c] text-[#888888] px-2.5 py-0.5 rounded-full font-bold border border-[#262626]">
              {items.length} {isAr ? 'صنف مسجل' : 'items'}
            </span>
          </div>
          <p className="text-xs text-[#888888] mt-1">
            {isAr
              ? 'تعديل الأسعار والأصناف فوراً مع الحفظ التلقائي في قاعدة البيانات وسيرفرات المنيو'
              : 'Edit prices and menu items with instant real-time synchronization'}
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center justify-center gap-2 bg-[#00c853] hover:bg-[#00b34a] text-black px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{isAr ? 'إضافة وجبة جديدة' : 'Add Item'}</span>
        </button>
      </div>

      {/* Quick Search & Filter Console */}
      <div className="bg-[#141414] p-4 rounded-[12px] border border-[#222222] space-y-3 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search bar */}
          <div className="relative md:col-span-5">
            <Search className="w-4 h-4 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-[#666666]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'ابحث باسم الوجبة، الكبدة، الشاورما، المشاوي...' : 'Search dish name...'}
              className="w-full bg-[#0e0e0e] border border-[#222222] focus:border-[#00c853] rounded-xl ltr:pl-9 ltr:pr-3 rtl:pr-9 rtl:pl-3 py-2.5 text-xs font-bold text-white placeholder-[#555555] outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-white"
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
              className="w-full bg-[#0e0e0e] border border-[#222222] focus:border-[#00c853] rounded-xl px-3 py-2.5 text-xs font-bold text-[#cccccc] outline-none cursor-pointer"
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
              className="w-full bg-[#0e0e0e] border border-[#222222] focus:border-[#00c853] rounded-xl px-3 py-2.5 text-xs font-bold text-[#cccccc] outline-none cursor-pointer"
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
              className="w-full bg-[#0e0e0e] border border-[#222222] focus:border-[#00c853] rounded-xl px-3 py-2.5 text-xs font-bold text-[#cccccc] outline-none cursor-pointer"
            >
              <option value="order">ترتيب القائمة</option>
              <option value="name">أبجدياً (أ - ي)</option>
              <option value="priceAsc">السعر: من الأقل للأعلى</option>
              <option value="priceDesc">السعر: من الأعلى للأقل</option>
            </select>
          </div>
        </div>

        {/* Quick count indicator */}
        <div className="flex items-center justify-between text-[11px] text-[#777777] font-bold px-1 pt-1 border-t border-[#1f1f1f]">
          <span>
            معروض حالياً: <strong className="text-white">{filteredItems.length}</strong> من أصل {items.length} صنف
          </span>
          <span className="text-[#00c853]">
            ✓ التعديل السريع للأسعار مفعل (اضغط على أي سعر لتغييره فوراً)
          </span>
        </div>
      </div>

      {/* Main Operational Items Table */}
      <div className="bg-[#141414] rounded-[12px] border border-[#222222] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-[#1a1a1a] border-b border-[#222222] text-[#888888] font-black">
              <tr>
                <th className="p-3 text-center w-12">#</th>
                <th className="p-3 text-start min-w-[200px]">الصنف والاسم</th>
                <th className="p-3 text-start min-w-[150px]">القسم</th>
                <th className="p-3 text-start min-w-[160px]">
                  السعر بالريال (OMR)
                </th>
                <th className="p-3 text-center">الأحجام</th>
                <th className="p-3 text-center">التوفر</th>
                <th className="p-3 text-center">الظهور بالمتجر</th>
                <th className="p-3 text-center">مميز</th>
                <th className="p-3 text-end min-w-[130px]">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222]">
              {filteredItems.map((item, idx) => {
                const isPriceEditing = editingPriceId === item.id;
                const formattedPrice = formatBaisaToOmr(item.basePriceBaisa, 'ar');

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-[#1a1a1a] transition ${
                      !item.isAvailable ? 'opacity-70 bg-[#111111]' : ''
                    }`}
                  >
                    {/* Index */}
                    <td className="p-3 text-center font-mono font-bold text-[#555555]">
                      {idx + 1}
                    </td>

                    {/* Name & Subtitle */}
                    <td className="p-3">
                      <div className="flex items-start gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-black text-white text-sm">
                              {item.nameAr}
                            </span>
                            {item.isFeatured && (
                              <Sparkles className="w-3.5 h-3.5 text-[#ffb300] fill-[#ffb300] shrink-0" />
                            )}
                          </div>
                          <span className="text-[11px] font-semibold text-[#777777] block font-['Inter']">
                            {item.nameEn}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category Selector Dropdown */}
                    <td className="p-3">
                      <select
                        value={item.categoryId}
                        onChange={(e) => handleQuickCategoryChange(item, e.target.value)}
                        className="bg-[#0e0e0e] hover:bg-[#1c1c1c] border border-[#282828] hover:border-[#00c853] rounded-lg px-2 py-1 text-xs font-bold text-white outline-none cursor-pointer"
                        title="تغيير القسم"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nameAr}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Price Cell with Inline Edit */}
                    <td className="p-3">
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
                            className="w-24 bg-[#0e0e0e] border-2 border-[#00c853] rounded-lg p-1.5 text-xs font-black text-[#00c853] outline-none text-center"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSavePriceEdit(item)}
                            className="p-1.5 bg-[#00c853] hover:bg-[#00b34a] text-black rounded-lg transition"
                            title="حفظ السعر"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </button>
                          <button
                            onClick={handleCancelPriceEdit}
                            className="p-1.5 bg-[#222222] hover:bg-[#2c2c2c] text-white rounded-lg transition"
                            title="إلغاء"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => handleStartPriceEdit(item)}
                          className="group inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#0e0e0e] border border-[#282828] hover:border-[#00c853] cursor-pointer transition"
                          title="اضغط لتعديل السعر"
                        >
                          <span className="font-black text-[#00c853] text-sm font-mono">
                            {formattedPrice}
                          </span>
                          <span className="text-[10px] text-[#555555] group-hover:text-[#00c853]">
                            ✏️
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Variants */}
                    <td className="p-3 text-center">
                      {item.hasVariants && item.variants && item.variants.length > 0 ? (
                        <span
                          onClick={() => onOpenEditModal(item)}
                          className="px-2 py-0.5 rounded-full bg-[#2196f3]/15 text-[#64b5f6] border border-[#2196f3]/30 font-bold text-[10px] cursor-pointer hover:bg-[#2196f3]/25 inline-block"
                        >
                          {item.variants.length} أحجام ⚙️
                        </span>
                      ) : (
                        <span className="text-[#555555] font-semibold text-[11px]">سعر موحد</span>
                      )}
                    </td>

                    {/* Availability Toggle */}
                    <td className="p-3 text-center">
                      <button
                        onClick={() => {
                          onToggleAvailability(item.id, !item.isAvailable);
                          showToast(
                            !item.isAvailable
                              ? `تم تعيين "${item.nameAr}" متوفر`
                              : `تم تعيين "${item.nameAr}" نافذ`
                          );
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                          item.isAvailable
                            ? 'bg-[#00c853]/15 text-[#00c853] border border-[#00c853]/30'
                            : 'bg-[#e53935]/15 text-[#ef5350] border border-[#e53935]/30'
                        }`}
                      >
                        {item.isAvailable ? 'متوفر ✓' : 'نافذ ✕'}
                      </button>
                    </td>

                    {/* Published Toggle */}
                    <td className="p-3 text-center">
                      <button
                        onClick={() => {
                          onTogglePublished(item.id, !item.isPublished);
                          showToast(
                            !item.isPublished
                              ? `تم إظهار "${item.nameAr}" في المتجر`
                              : `تم إخفاء "${item.nameAr}"`
                          );
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 mx-auto ${
                          item.isPublished
                            ? 'bg-[#2196f3]/15 text-[#64b5f6] border border-[#2196f3]/30'
                            : 'bg-[#1c1c1c] text-[#666666] border border-[#262626]'
                        }`}
                      >
                        {item.isPublished ? (
                          <>
                            <Eye className="w-3.5 h-3.5 text-[#64b5f6]" />
                            <span>معروض</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-[#555555]" />
                            <span>مخفي</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Featured */}
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleToggleFeatured(item)}
                        className={`p-1.5 rounded-lg transition cursor-pointer ${
                          item.isFeatured
                            ? 'text-[#ffb300] bg-[#ffb300]/15'
                            : 'text-[#444444] hover:text-[#ffb300]'
                        }`}
                        title="مميز"
                      >
                        <Sparkles className={`w-4 h-4 ${item.isFeatured ? 'fill-[#ffb300]' : ''}`} />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-end">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        <button
                          onClick={() => onOpenEditModal(item)}
                          className="flex items-center gap-1 px-2.5 py-1 bg-[#1c1c1c] hover:bg-[#252525] text-white rounded-lg transition text-xs font-bold border border-[#2b2b2b] cursor-pointer"
                        >
                          <Edit className="w-3 h-3 text-[#00c853]" />
                          <span>تعديل</span>
                        </button>

                        <button
                          onClick={() => {
                            onDuplicateItem(item);
                            showToast(`تم نسخ "${item.nameAr}"`);
                          }}
                          className="p-1 rounded-lg bg-[#1c1c1c] text-[#888888] hover:text-white border border-[#282828] transition cursor-pointer"
                          title="نسخ"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteConfirm(item)}
                          className="p-1 rounded-lg text-[#666666] hover:text-rose-400 hover:bg-[#1c1c1c] transition cursor-pointer"
                          title="حذف"
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
                  <td colSpan={9} className="text-center py-12 text-[#666666]">
                    <AlertCircle className="w-8 h-8 text-[#444444] mx-auto mb-2" />
                    <p className="font-bold text-sm text-[#aaaaaa]">لم يتم العثور على وجبات مطابقة للبحث</p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                        setSelectedStatusFilter('all');
                      }}
                      className="mt-2 text-xs font-bold text-[#00c853] underline cursor-pointer"
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
