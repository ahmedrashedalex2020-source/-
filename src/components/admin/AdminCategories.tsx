import React, { useState } from 'react';
import { Category, MenuItem } from '../../types/menu';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  FolderKanban,
  Check,
} from 'lucide-react';

interface AdminCategoriesProps {
  categories: Category[];
  items: MenuItem[];
  onSaveCategory: (cat: Category, isNew: boolean) => Promise<void>;
  onDeleteCategory: (id: string, name: string) => Promise<void>;
  lang: 'ar' | 'en';
}

export const AdminCategories: React.FC<AdminCategoriesProps> = ({
  categories,
  items,
  onSaveCategory,
  onDeleteCategory,
  lang,
}) => {
  const isAr = lang === 'ar';
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [inlineEditingId, setInlineEditingId] = useState<string | null>(null);
  const [inlineNameAr, setInlineNameAr] = useState('');
  const [inlineNameEn, setInlineNameEn] = useState('');

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formNameAr, setFormNameAr] = useState('');
  const [formNameEn, setFormNameEn] = useState('');
  const [formOrder, setFormOrder] = useState<number>(1);
  const [formPublished, setFormPublished] = useState(true);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Item counts by category
  const itemCounts = items.reduce((acc, it) => {
    acc[it.categoryId] = (acc[it.categoryId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleStartInlineEdit = (cat: Category) => {
    setInlineEditingId(cat.id);
    setInlineNameAr(cat.nameAr);
    setInlineNameEn(cat.nameEn);
  };

  const handleSaveInlineEdit = async (cat: Category) => {
    if (!inlineNameAr.trim() || !inlineNameEn.trim()) {
      showToast(isAr ? 'يرجى ملء الاسم بالعربي والإنجليزي' : 'Fill all fields');
      return;
    }
    const updated: Category = {
      ...cat,
      nameAr: inlineNameAr.trim(),
      nameEn: inlineNameEn.trim(),
    };
    await onSaveCategory(updated, false);
    setInlineEditingId(null);
    showToast(`تم حفظ اسم قسم "${updated.nameAr}"`);
  };

  const handleTogglePublish = async (cat: Category) => {
    const updated: Category = {
      ...cat,
      isPublished: !cat.isPublished,
    };
    await onSaveCategory(updated, false);
    showToast(updated.isPublished ? `قسم "${cat.nameAr}" معروض بالمنيو` : `تم إخفاء قسم "${cat.nameAr}"`);
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const sorted = [...categories].sort((a, b) => a.displayOrder - b.displayOrder);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    const currentCat = sorted[index];
    const targetCat = sorted[targetIndex];

    const tempOrder = currentCat.displayOrder;
    currentCat.displayOrder = targetCat.displayOrder;
    targetCat.displayOrder = tempOrder;

    await onSaveCategory(currentCat, false);
    await onSaveCategory(targetCat, false);
    showToast(`تم تعديل ترتيب قسم "${currentCat.nameAr}"`);
  };

  const handleStartAdd = () => {
    setIsAddingNew(true);
    setEditingCatId(null);
    setFormNameAr('');
    setFormNameEn('');
    setFormOrder(categories.length + 1);
    setFormPublished(true);
  };

  const handleSaveNew = async () => {
    if (!formNameAr.trim() || !formNameEn.trim()) {
      showToast(isAr ? 'اكتب اسم القسم بالعربي والإنجليزي' : 'Fill all fields');
      return;
    }

    const newCat: Category = {
      id: `cat_${Date.now()}`,
      nameAr: formNameAr.trim(),
      nameEn: formNameEn.trim(),
      displayOrder: formOrder,
      isPublished: formPublished,
    };

    await onSaveCategory(newCat, true);
    setIsAddingNew(false);
    showToast(`تمت إضافة قسم "${newCat.nameAr}" بنجاح`);
  };

  const handleDelete = async (cat: Category) => {
    const count = itemCounts[cat.id] || 0;
    if (count > 0) {
      if (
        !window.confirm(
          `تنبيه: هذا القسم يحتوي على ${count} وجبة مرتبطة به حالياً. هل أنت متأكد من حذفه؟`
        )
      ) {
        return;
      }
    } else {
      if (!window.confirm(`هل تريد حذف قسم "${cat.nameAr}" نهائياً؟`)) {
        return;
      }
    }
    await onDeleteCategory(cat.id, cat.nameEn);
    showToast(`تم حذف قسم "${cat.nameAr}"`);
  };

  const sortedCategories = [...categories].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="space-y-4 sm:space-y-6 text-[#ededed] font-['Cairo',sans-serif]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 start-1/2 -translate-x-1/2 z-50 bg-[#1c1c1c] text-[#00c853] px-5 py-3 rounded-xl shadow-2xl border border-[#00c853]/40 flex items-center gap-2.5 animate-in fade-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-4 h-4 text-[#00c853] shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141414] p-4 sm:p-5 rounded-[12px] border border-[#222222] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#00c853]/15 text-[#00c853] border border-[#00c853]/30">
              <FolderKanban className="w-4 h-4" />
            </span>
            <h2 className="text-lg sm:text-xl font-black text-white">
              {isAr ? 'إدارة أقسام وتصنيفات الطعام' : 'Menu Categories'}
            </h2>
            <span className="text-[11px] bg-[#1c1c1c] text-[#888888] px-2.5 py-0.5 rounded-full font-bold border border-[#262626]">
              {categories.length} {isAr ? 'أقسام رئيسية' : 'categories'}
            </span>
          </div>
          <p className="text-xs text-[#888888] mt-1">
            {isAr
              ? 'ترتيب الأقسام، تعديل الأسماء، أو إخفاء أي قسم من المتجر بنقرة واحدة'
              : 'Reorder categories, update titles, or toggle visibility with one click'}
          </p>
        </div>

        <button
          onClick={handleStartAdd}
          className="flex items-center justify-center gap-2 bg-[#00c853] hover:bg-[#00b34a] text-black px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{isAr ? 'إضافة قسم جديد' : 'Add Category'}</span>
        </button>
      </div>

      {/* Add New Category Box */}
      {isAddingNew && (
        <div className="bg-[#141414] border border-[#00c853]/40 p-4 sm:p-5 rounded-[12px] space-y-4 animate-in fade-in shadow-lg">
          <div className="flex items-center justify-between border-b border-[#222222] pb-2">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00c853]" />
              <span>{isAr ? 'إضافة قسم طعام جديد للمنيو' : 'Add New Category'}</span>
            </h3>
            <button onClick={() => setIsAddingNew(false)} className="p-1 text-[#888888] hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="font-bold text-[#888888] block mb-1">
                {isAr ? 'اسم القسم بالعربي *' : 'Arabic Name *'}
              </label>
              <input
                type="text"
                value={formNameAr}
                onChange={(e) => setFormNameAr(e.target.value)}
                placeholder="مثال: طواجن مصرية"
                className="w-full bg-[#0e0e0e] border border-[#282828] focus:border-[#00c853] rounded-xl p-2.5 font-bold text-sm text-white outline-none"
                autoFocus
              />
            </div>

            <div>
              <label className="font-bold text-[#888888] block mb-1">
                {isAr ? 'اسم القسم بالإنجليزي *' : 'English Name *'}
              </label>
              <input
                type="text"
                value={formNameEn}
                onChange={(e) => setFormNameEn(e.target.value)}
                placeholder="e.g. Egyptian Tajines"
                className="w-full bg-[#0e0e0e] border border-[#282828] focus:border-[#00c853] rounded-xl p-2.5 font-bold text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-[#888888] block mb-1">
                {isAr ? 'ترتيب الظهور' : 'Display Order'}
              </label>
              <input
                type="number"
                min="1"
                value={formOrder}
                onChange={(e) => setFormOrder(parseInt(e.target.value) || 1)}
                className="w-full bg-[#0e0e0e] border border-[#282828] focus:border-[#00c853] rounded-xl p-2.5 font-bold text-sm text-white outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-white">
              <input
                type="checkbox"
                checked={formPublished}
                onChange={(e) => setFormPublished(e.target.checked)}
                className="w-4 h-4 accent-[#00c853]"
              />
              <span>{isAr ? 'منشور ويظهر للزبائن في قائمة الطعام' : 'Published in store'}</span>
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-3 py-2 text-xs font-bold text-[#888888] hover:text-white rounded-xl cursor-pointer"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleSaveNew}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#00c853] hover:bg-[#00b34a] text-black rounded-xl text-xs font-black transition cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isAr ? 'حفظ القسم' : 'Save'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-[#141414] rounded-[12px] border border-[#222222] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-[#1a1a1a] border-b border-[#222222] text-[#888888] font-black">
              <tr>
                <th className="p-3 text-center w-16">{isAr ? 'الترتيب' : 'Order'}</th>
                <th className="p-3 text-center w-20">{isAr ? 'تحريك' : 'Move'}</th>
                <th className="p-3 text-start min-w-[200px]">{isAr ? 'اسم القسم (عربي)' : 'Arabic Name'}</th>
                <th className="p-3 text-start min-w-[200px]">{isAr ? 'اسم القسم (English)' : 'English Name'}</th>
                <th className="p-3 text-center">{isAr ? 'عدد الوجبات' : 'Dishes'}</th>
                <th className="p-3 text-center">{isAr ? 'الظهور بالمتجر' : 'Visibility'}</th>
                <th className="p-3 text-end min-w-[120px]">{isAr ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222]">
              {sortedCategories.map((cat, index) => {
                const count = itemCounts[cat.id] || 0;
                const isInlineEdit = inlineEditingId === cat.id;

                return (
                  <tr key={cat.id} className="hover:bg-[#1a1a1a] transition">
                    {/* Display Order Number */}
                    <td className="p-3 text-center font-black text-sm text-[#00c853] font-mono">
                      #{cat.displayOrder}
                    </td>

                    {/* Up / Down Reorder Arrows */}
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleMoveOrder(index, 'up')}
                          disabled={index === 0}
                          className="p-1 hover:bg-[#1c1c1c] rounded text-[#888888] hover:text-white disabled:opacity-20 cursor-pointer"
                          title="رفع للأعلى"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveOrder(index, 'down')}
                          disabled={index === sortedCategories.length - 1}
                          className="p-1 hover:bg-[#1c1c1c] rounded text-[#888888] hover:text-white disabled:opacity-20 cursor-pointer"
                          title="تنزيل للأسفل"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Arabic Name */}
                    <td className="p-3 font-bold text-sm text-white">
                      {isInlineEdit ? (
                        <input
                          type="text"
                          value={inlineNameAr}
                          onChange={(e) => setInlineNameAr(e.target.value)}
                          className="bg-[#0e0e0e] border border-[#00c853] rounded-lg px-2.5 py-1 text-sm font-bold text-white outline-none w-full max-w-xs"
                          autoFocus
                        />
                      ) : (
                        <div
                          onClick={() => handleStartInlineEdit(cat)}
                          className="cursor-pointer hover:text-[#00c853] inline-flex items-center gap-1.5"
                          title="اضغط للتعديل"
                        >
                          <span>{cat.nameAr}</span>
                          <span className="text-[10px] text-[#555555]">✏️</span>
                        </div>
                      )}
                    </td>

                    {/* English Name */}
                    <td className="p-3 font-semibold text-[#888888]">
                      {isInlineEdit ? (
                        <input
                          type="text"
                          value={inlineNameEn}
                          onChange={(e) => setInlineNameEn(e.target.value)}
                          className="bg-[#0e0e0e] border border-[#00c853] rounded-lg px-2.5 py-1 text-xs font-bold text-white outline-none w-full max-w-xs font-['Inter']"
                        />
                      ) : (
                        <span className="font-['Inter']">{cat.nameEn}</span>
                      )}
                    </td>

                    {/* Product count in this category */}
                    <td className="p-3 text-center">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#1c1c1c] text-[#aaaaaa] border border-[#282828] font-bold text-xs">
                        {count} {isAr ? 'وجبة' : 'items'}
                      </span>
                    </td>

                    {/* Visibility toggle */}
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleTogglePublish(cat)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 mx-auto cursor-pointer ${
                          cat.isPublished
                            ? 'bg-[#00c853]/15 text-[#00c853] border border-[#00c853]/30'
                            : 'bg-[#1c1c1c] text-[#666666] border border-[#282828]'
                        }`}
                      >
                        {cat.isPublished ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>{isAr ? 'معروض' : 'Active'}</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 text-[#555555]" />
                            <span>{isAr ? 'مخفي' : 'Hidden'}</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-end">
                      <div className="flex items-center justify-end gap-1.5">
                        {isInlineEdit ? (
                          <>
                            <button
                              onClick={() => handleSaveInlineEdit(cat)}
                              className="p-1.5 bg-[#00c853] hover:bg-[#00b34a] text-black rounded-lg transition cursor-pointer"
                              title="حفظ"
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </button>
                            <button
                              onClick={() => setInlineEditingId(null)}
                              className="p-1.5 bg-[#222222] hover:bg-[#2c2c2c] text-white rounded-lg transition cursor-pointer"
                              title="إلغاء"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleStartInlineEdit(cat)}
                            className="flex items-center gap-1 px-2.5 py-1 bg-[#1c1c1c] hover:bg-[#252525] text-white rounded-lg transition text-xs font-bold border border-[#2b2b2b] cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3 text-[#00c853]" />
                            <span>{isAr ? 'تعديل' : 'Edit'}</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(cat)}
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
