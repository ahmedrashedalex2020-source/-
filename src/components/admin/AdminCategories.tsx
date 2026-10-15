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
      showToast('❌ من فضلك اكتب اسم القسم بالعربي والإنجليزي يا فندم');
      return;
    }
    const updated: Category = {
      ...cat,
      nameAr: inlineNameAr.trim(),
      nameEn: inlineNameEn.trim(),
    };
    await onSaveCategory(updated, false);
    setInlineEditingId(null);
    showToast(`تم تعديل اسم القسم لـ "${updated.nameAr}" بنجاح!`);
  };

  const handleTogglePublish = async (cat: Category) => {
    const updated: Category = {
      ...cat,
      isPublished: !cat.isPublished,
    };
    await onSaveCategory(updated, false);
    showToast(updated.isPublished ? `قسم "${cat.nameAr}" معروض الآن بالمنيو` : `تم إخفاء قسم "${cat.nameAr}" من المنيو`);
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
    showToast(`تم تحديث ترتيب قسم "${currentCat.nameAr}"`);
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
      showToast('❌ اكتب اسم القسم بالعربي والإنجليزي من فضلك يا فندم');
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
    showToast(`ألف مبروك! تم إضافة قسم "${newCat.nameAr}" بنجاح`);
  };

  const handleDelete = async (cat: Category) => {
    const count = itemCounts[cat.id] || 0;
    if (count > 0) {
      if (
        !window.confirm(
          `خد بالك يا فندم! القسم ده فيه ${count} وجبة مربوطة بيه حالياً. هل أنت متأكد تماماً من حذفه؟`
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
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 start-1/2 -translate-x-1/2 z-50 bg-[#392A23] text-white px-6 py-3.5 rounded-2xl shadow-2xl border-2 border-[#C58D38] flex items-center gap-3 animate-in fade-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#E8D8B5] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 text-[#C58D38]">
              <FolderKanban className="w-5 h-5 text-[#392A23]" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#392A23]">
              إدارة أقسام وتصنيفات الطعام
            </h2>
          </div>
          <p className="text-xs text-[#755947] mt-1">
            عدل أسماء الأقسام، رتب ظهورها بالأسهم، أو أخفِ أي قسم بنقرة واحدة
          </p>
        </div>

        <button
          onClick={handleStartAdd}
          className="flex items-center justify-center gap-2 bg-[#A1312E] hover:bg-[#862724] text-white px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition shadow-md hover:scale-102"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة قسم جديد</span>
        </button>
      </div>

      {/* Add New Category Box */}
      {isAddingNew && (
        <div className="bg-[#FFF9EF] border-2 border-[#C58D38] p-5 rounded-3xl space-y-4 animate-in fade-in shadow-md">
          <div className="flex items-center justify-between border-b border-[#E8D8B5] pb-2">
            <h3 className="text-sm font-black text-[#392A23]">
              ➕ إضافة قسم طعام جديد للمنيو
            </h3>
            <button onClick={() => setIsAddingNew(false)} className="p-1 text-gray-500 hover:text-black">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="font-bold text-[#755947] block mb-1">
                اسم القسم بالعربي *
              </label>
              <input
                type="text"
                value={formNameAr}
                onChange={(e) => setFormNameAr(e.target.value)}
                placeholder="مثال: طواجن مصرية"
                className="w-full bg-white border border-[#E8D8B5] rounded-xl p-2.5 font-bold text-sm text-[#392A23] outline-hidden focus:border-[#A1312E]"
                autoFocus
              />
            </div>

            <div>
              <label className="font-bold text-[#755947] block mb-1">
                اسم القسم بالإنجليزي *
              </label>
              <input
                type="text"
                value={formNameEn}
                onChange={(e) => setFormNameEn(e.target.value)}
                placeholder="e.g. Egyptian Tajines"
                className="w-full bg-white border border-[#E8D8B5] rounded-xl p-2.5 font-bold text-sm text-[#392A23] outline-hidden focus:border-[#A1312E]"
              />
            </div>

            <div>
              <label className="font-bold text-[#755947] block mb-1">
                ترتيب الظهور
              </label>
              <input
                type="number"
                min="1"
                value={formOrder}
                onChange={(e) => setFormOrder(parseInt(e.target.value) || 1)}
                className="w-full bg-white border border-[#E8D8B5] rounded-xl p-2.5 font-bold text-sm text-[#392A23] outline-hidden"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#392A23]">
              <input
                type="checkbox"
                checked={formPublished}
                onChange={(e) => setFormPublished(e.target.checked)}
                className="w-4 h-4 accent-[#A1312E]"
              />
              <span>منشور ويظهر للزبائن في قائمة الطعام</span>
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-white rounded-xl"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleSaveNew}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-[#A1312E] hover:bg-[#862724] text-white rounded-xl text-xs font-black transition shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>حفظ القسم فوراً</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-white rounded-3xl border border-[#E8D8B5] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-[#FFF9EF] border-b border-[#E8D8B5] text-[#755947] font-black">
              <tr>
                <th className="p-3.5 text-center w-16">الترتيب</th>
                <th className="p-3.5 text-center w-20">تحريك</th>
                <th className="p-3.5 text-start min-w-[200px]">اسم القسم (عربي)</th>
                <th className="p-3.5 text-start min-w-[200px]">اسم القسم (English)</th>
                <th className="p-3.5 text-center">عدد الوجبات</th>
                <th className="p-3.5 text-center">الظهور بالمنيو</th>
                <th className="p-3.5 text-end min-w-[120px]">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8D8B5]/50">
              {sortedCategories.map((cat, index) => {
                const count = itemCounts[cat.id] || 0;
                const isInlineEdit = inlineEditingId === cat.id;

                return (
                  <tr key={cat.id} className="hover:bg-[#FFF9EF]/40 transition">
                    {/* Display Order Number */}
                    <td className="p-3.5 text-center font-black text-sm text-[#A1312E] font-mono">
                      #{cat.displayOrder}
                    </td>

                    {/* Up / Down Reorder Arrows */}
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleMoveOrder(index, 'up')}
                          disabled={index === 0}
                          className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"
                          title="رفع للأعلى"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveOrder(index, 'down')}
                          disabled={index === sortedCategories.length - 1}
                          className="p-1 hover:bg-gray-100 rounded text-gray-500 disabled:opacity-30"
                          title="تنزيل للأسفل"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Arabic Name (Inline Editable) */}
                    <td className="p-3.5 font-bold text-sm text-[#392A23]">
                      {isInlineEdit ? (
                        <input
                          type="text"
                          value={inlineNameAr}
                          onChange={(e) => setInlineNameAr(e.target.value)}
                          className="bg-white border-2 border-[#A1312E] rounded-xl px-2.5 py-1 text-sm font-bold text-[#392A23] outline-hidden w-full max-w-xs"
                          autoFocus
                        />
                      ) : (
                        <div
                          onClick={() => handleStartInlineEdit(cat)}
                          className="cursor-pointer hover:text-[#A1312E] inline-flex items-center gap-1.5"
                          title="اضغط للتعديل السريع للاسم"
                        >
                          <span>{cat.nameAr}</span>
                          <span className="text-[10px] text-gray-400">✏️</span>
                        </div>
                      )}
                    </td>

                    {/* English Name (Inline Editable) */}
                    <td className="p-3.5 font-semibold text-[#755947]">
                      {isInlineEdit ? (
                        <input
                          type="text"
                          value={inlineNameEn}
                          onChange={(e) => setInlineNameEn(e.target.value)}
                          className="bg-white border-2 border-[#A1312E] rounded-xl px-2.5 py-1 text-xs font-bold text-[#755947] outline-hidden w-full max-w-xs font-['Inter']"
                        />
                      ) : (
                        <span className="font-['Inter']">{cat.nameEn}</span>
                      )}
                    </td>

                    {/* Product count in this category */}
                    <td className="p-3.5 text-center">
                      <span className="px-3 py-1 rounded-full bg-[#E8D8B5]/50 text-[#755947] font-black text-xs">
                        {count} وجبة
                      </span>
                    </td>

                    {/* Published / Hidden in menu toggle */}
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => handleTogglePublish(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 mx-auto ${
                          cat.isPublished
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200 border border-gray-300'
                        }`}
                        title="انقر لإخفاء أو إظهار القسم للزبائن"
                      >
                        {cat.isPublished ? (
                          <>
                            <Eye className="w-3.5 h-3.5 text-emerald-600" />
                            <span>معروض</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-gray-400" />
                            <span>مخفي</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-3.5 text-end">
                      <div className="flex items-center justify-end gap-1.5">
                        {isInlineEdit ? (
                          <>
                            <button
                              onClick={() => handleSaveInlineEdit(cat)}
                              className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition"
                              title="حفظ الاسم"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setInlineEditingId(null)}
                              className="p-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition"
                              title="إلغاء"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleStartInlineEdit(cat)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition text-xs font-black shadow-xs cursor-pointer hover:scale-102"
                            title="تعديل اسم القسم بالعربي والإنجليزي"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>تعديل ✏️</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(cat)}
                          className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition"
                          title="حذف القسم"
                        >
                          <Trash2 className="w-4 h-4" />
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
