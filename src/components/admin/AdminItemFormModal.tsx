import React, { useState, useEffect } from 'react';
import { MenuItem, Category, ProductVariant, ExtractionStatus } from '../../types/menu';
import { X, Plus, Trash2, ShieldCheck, AlertCircle } from 'lucide-react';

interface AdminItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItem | null; // null if creating new
  categories: Category[];
  onSave: (item: MenuItem, isNew: boolean) => Promise<void>;
  lang: 'ar' | 'en';
}

export const AdminItemFormModal: React.FC<AdminItemFormModalProps> = ({
  isOpen,
  onClose,
  item,
  categories,
  onSave,
  lang,
}) => {
  const isAr = lang === 'ar';
  const isNew = !item;

  const [formData, setFormData] = useState<Partial<MenuItem>>({
    id: '',
    categoryId: categories[0]?.id || 'sandwiches',
    nameAr: '',
    nameEn: '',
    descriptionAr: '',
    descriptionEn: '',
    imageUrl: '',
    basePriceBaisa: 500,
    hasVariants: false,
    variants: [],
    portionDetailsAr: '',
    portionDetailsEn: '',
    accompanimentsAr: '',
    accompanimentsEn: '',
    isAvailable: true,
    isFeatured: false,
    isPublished: true,
    displayOrder: 1,
    extractionStatus: 'verified',
    sourceImage: 'Manual',
    originalPriceText: '',
    adminNotes: '',
  });

  const [basePriceOmrInput, setBasePriceOmrInput] = useState('0.500');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setFormData({ ...item });
      setBasePriceOmrInput((item.basePriceBaisa / 1000).toFixed(3));
    } else {
      const generatedId = `item_${Date.now()}`;
      setFormData({
        id: generatedId,
        categoryId: categories[0]?.id || 'sandwiches',
        nameAr: '',
        nameEn: '',
        descriptionAr: '',
        descriptionEn: '',
        imageUrl: '',
        basePriceBaisa: 500,
        hasVariants: false,
        variants: [],
        portionDetailsAr: '',
        portionDetailsEn: '',
        accompanimentsAr: '',
        accompanimentsEn: '',
        isAvailable: true,
        isFeatured: false,
        isPublished: true,
        displayOrder: 99,
        extractionStatus: 'verified',
        sourceImage: 'Manual',
        originalPriceText: '0.500',
        adminNotes: '',
      });
      setBasePriceOmrInput('0.500');
    }
    setErrorMessage(null);
  }, [item, categories, isOpen]);

  if (!isOpen) return null;

  const handleBasePriceChange = (val: string) => {
    setBasePriceOmrInput(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed >= 0) {
      setFormData((prev) => ({ ...prev, basePriceBaisa: Math.round(parsed * 1000) }));
    }
  };

  const handleAddVariant = () => {
    const newVariant: ProductVariant = {
      id: `var_${Date.now()}`,
      nameAr: 'حجم جديد',
      nameEn: 'New Size',
      priceBaisa: formData.basePriceBaisa || 500,
      isAvailable: true,
      displayOrder: (formData.variants?.length || 0) + 1,
    };
    setFormData((prev) => ({
      ...prev,
      hasVariants: true,
      variants: [...(prev.variants || []), newVariant],
    }));
  };

  const handleUpdateVariant = (idx: number, updates: Partial<ProductVariant>) => {
    setFormData((prev) => {
      const current = [...(prev.variants || [])];
      current[idx] = { ...current[idx], ...updates };
      return { ...prev, variants: current };
    });
  };

  const handleRemoveVariant = (idx: number) => {
    setFormData((prev) => {
      const current = [...(prev.variants || [])].filter((_, i) => i !== idx);
      return {
        ...prev,
        variants: current,
        hasVariants: current.length > 0,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameAr?.trim() || !formData.nameEn?.trim()) {
      setErrorMessage(isAr ? 'يرجى إدخال اسم المنتج باللغتين العربية والإنجليزية' : 'Please provide Arabic and English names');
      return;
    }

    if (formData.basePriceBaisa === undefined || formData.basePriceBaisa < 0) {
      setErrorMessage(isAr ? 'السعر غير صالح' : 'Invalid price');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await onSave(formData as MenuItem, isNew);
      onClose();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Error saving menu item');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-2xl rounded-3xl border border-[#E8D8B5] shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 ltr:right-5 rtl:left-5 p-2 text-gray-400 hover:text-gray-600 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h3 className="text-xl font-black text-[#392A23]">
            {isNew
              ? isAr ? 'إضافة وجبة / منتج جديد' : 'Add New Menu Item'
              : isAr ? 'تعديل تفاصيل المنتج والأسعار' : 'Edit Menu Item & Prices'}
          </h3>
          <p className="text-xs text-[#755947] mt-0.5">
            {isAr ? 'تعديل وحفظ البيانات مباشرة في قاعدة بيانات Firestore' : 'Live updates stored directly into Cloud Firestore'}
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Category & ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-[#755947] block mb-1">
                {isAr ? 'القسم / التصنيف' : 'Category'} *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full bg-[#FFF9EF] border border-[#E8D8B5] rounded-xl p-2.5 font-semibold text-[#392A23] outline-hidden focus:border-[#A1312E]"
                required
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {isAr ? c.nameAr : c.nameEn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-[#755947] block mb-1">
                {isAr ? 'حالة التوثيق (Verification Status)' : 'Extraction Status'}
              </label>
              <select
                value={formData.extractionStatus}
                onChange={(e) => setFormData({ ...formData, extractionStatus: e.target.value as ExtractionStatus })}
                className="w-full bg-[#FFF9EF] border border-[#E8D8B5] rounded-xl p-2.5 font-semibold text-[#392A23] outline-hidden focus:border-[#A1312E]"
              >
                <option value="verified">{isAr ? 'موثق (Verified)' : 'Verified'}</option>
                <option value="needs_review">{isAr ? 'بحاجة لمراجعة (Needs Review)' : 'Needs Review'}</option>
                <option value="missing_price">{isAr ? 'سعر مفقود بالقائمة (Missing Price)' : 'Missing Price'}</option>
                <option value="draft">{isAr ? 'مسودة (Draft)' : 'Draft'}</option>
              </select>
            </div>
          </div>

          {/* Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-[#755947] block mb-1">
                {isAr ? 'الاسم باللغة العربية' : 'Arabic Name'} *
              </label>
              <input
                type="text"
                value={formData.nameAr || ''}
                onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                placeholder="مثال: كبدة إسكندراني"
                className="w-full bg-white border border-[#E8D8B5] rounded-xl p-2.5 text-sm font-bold text-[#392A23] outline-hidden focus:border-[#A1312E]"
                required
              />
            </div>

            <div>
              <label className="font-bold text-[#755947] block mb-1">
                {isAr ? 'الاسم باللغة الإنجليزية' : 'English Name'} *
              </label>
              <input
                type="text"
                value={formData.nameEn || ''}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                placeholder="e.g. Alexandrian Liver Sandwich"
                className="w-full bg-white border border-[#E8D8B5] rounded-xl p-2.5 text-sm font-bold text-[#392A23] outline-hidden focus:border-[#A1312E]"
                required
              />
            </div>
          </div>

          {/* Descriptions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-[#755947] block mb-1">
                {isAr ? 'الوصف بالعربية' : 'Arabic Description'}
              </label>
              <textarea
                rows={2}
                value={formData.descriptionAr || ''}
                onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                className="w-full bg-white border border-[#E8D8B5] rounded-xl p-2 text-xs text-[#392A23] outline-hidden focus:border-[#A1312E]"
              />
            </div>

            <div>
              <label className="font-bold text-[#755947] block mb-1">
                {isAr ? 'الوصف بالإنجليزية' : 'English Description'}
              </label>
              <textarea
                rows={2}
                value={formData.descriptionEn || ''}
                onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                className="w-full bg-white border border-[#E8D8B5] rounded-xl p-2 text-xs text-[#392A23] outline-hidden focus:border-[#A1312E]"
              />
            </div>
          </div>

          {/* Base Price & OMR Calculation */}
          <div className="p-4 bg-[#FFF9EF] border border-[#E8D8B5] rounded-2xl space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              <div>
                <label className="font-bold text-[#755947] block mb-1">
                  {isAr ? 'السعر الأساسي (OMR)' : 'Base Price (OMR)'} *
                </label>
                <input
                  type="number"
                  step="0.050"
                  min="0"
                  value={basePriceOmrInput}
                  onChange={(e) => handleBasePriceChange(e.target.value)}
                  className="w-full bg-white border border-[#A1312E] rounded-xl p-2 font-black text-sm text-[#A1312E] outline-hidden"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-[#755947] block mb-1">
                  {isAr ? 'القيمة بالبيسة (Baisa)' : 'Stored Baisa'}
                </label>
                <div className="p-2 bg-white rounded-xl border border-[#E8D8B5] font-mono font-bold text-gray-700">
                  {formData.basePriceBaisa || 0} baisa
                </div>
              </div>

              <div>
                <label className="font-bold text-[#755947] block mb-1">
                  {isAr ? 'معاينة السعر الرسمي' : 'Official Display Preview'}
                </label>
                <div className="p-2 bg-white rounded-xl border border-[#C58D38] font-black text-[#A1312E]">
                  {((formData.basePriceBaisa || 0) / 1000).toFixed(3)} OMR
                </div>
              </div>
            </div>

            {/* Variants Toggle */}
            <div className="pt-2 border-t border-[#E8D8B5] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#392A23] block">
                  {isAr ? 'تمكين أحجام متعددة للمنتج (Variants)' : 'Enable Multiple Variants / Sizes'}
                </span>
                <span className="text-[11px] text-[#755947]">
                  {isAr
                    ? 'مثل: لبناني / صمون / صاروخ أو أحجام المشاوي والعيوش'
                    : 'e.g. Lebanese / Samoon / Saroukh or skewer platters'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.hasVariants || false}
                onChange={(e) => setFormData({ ...formData, hasVariants: e.target.checked })}
                className="w-5 h-5 accent-[#A1312E] rounded cursor-pointer"
              />
            </div>

            {/* Variants Repeater */}
            {formData.hasVariants && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#755947]">
                    {isAr ? 'قائمة الأحجام والأسعار' : 'Variants List'}
                  </span>
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#A1312E] hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAr ? 'إضافة حجم جديد' : 'Add Variant'}</span>
                  </button>
                </div>

                {formData.variants?.map((v, idx) => (
                  <div
                    key={v.id || idx}
                    className="p-2.5 bg-white rounded-xl border border-[#E8D8B5] grid grid-cols-12 gap-2 items-center"
                  >
                    <div className="col-span-4">
                      <input
                        type="text"
                        value={v.nameAr}
                        onChange={(e) => handleUpdateVariant(idx, { nameAr: e.target.value })}
                        placeholder="الاسم بالعربي"
                        className="w-full bg-[#FFF9EF] p-1.5 rounded-lg border border-[#E8D8B5] text-xs font-semibold outline-hidden"
                      />
                    </div>
                    <div className="col-span-4">
                      <input
                        type="text"
                        value={v.nameEn}
                        onChange={(e) => handleUpdateVariant(idx, { nameEn: e.target.value })}
                        placeholder="English Name"
                        className="w-full bg-[#FFF9EF] p-1.5 rounded-lg border border-[#E8D8B5] text-xs font-semibold outline-hidden"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        step="0.050"
                        value={(v.priceBaisa / 1000).toFixed(3)}
                        onChange={(e) => {
                          const p = parseFloat(e.target.value);
                          if (!isNaN(p)) handleUpdateVariant(idx, { priceBaisa: Math.round(p * 1000) });
                        }}
                        className="w-full bg-white p-1.5 rounded-lg border border-[#A1312E] text-xs font-bold text-[#A1312E] outline-hidden"
                      />
                    </div>
                    <div className="col-span-1 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(idx)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mx-auto" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Portions & Source Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-[#755947] block mb-1">
                {isAr ? 'تفاصيل الوجبة أو عدد القطع' : 'Portion Details'}
              </label>
              <input
                type="text"
                value={formData.portionDetailsAr || ''}
                onChange={(e) => setFormData({ ...formData, portionDetailsAr: e.target.value })}
                placeholder="مثال: ٨ قطع مع بطاطس ومخلل"
                className="w-full bg-white border border-[#E8D8B5] rounded-xl p-2 text-xs text-[#392A23] outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-[#755947] block mb-1">
                {isAr ? 'صورة المصدر الورقي' : 'Source Menu Image'}
              </label>
              <select
                value={formData.sourceImage || 'Manual'}
                onChange={(e) => setFormData({ ...formData, sourceImage: e.target.value as any })}
                className="w-full bg-white border border-[#E8D8B5] rounded-xl p-2 text-xs text-[#392A23] outline-hidden"
              >
                <option value="Image 1">Image 1 (Sandwiches, Shawarma, Burger, Plates, Salad)</option>
                <option value="Image 2">Image 2 (Grills, Ayoush Rice, Salona, Bread, Fish)</option>
                <option value="Image 3">Image 3 (Cover, Manakish, Pastry, Juices, Drinks, Desserts)</option>
                <option value="Manual">Manual Entry / Added by Admin</option>
              </select>
            </div>
          </div>

          {/* Availability & Publication Checkboxes */}
          <div className="flex flex-wrap items-center gap-6 p-3 bg-gray-50 rounded-xl border border-gray-200">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-[#392A23]">
              <input
                type="checkbox"
                checked={formData.isAvailable ?? true}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                className="w-4 h-4 accent-[#A1312E]"
              />
              <span>{isAr ? 'متوفر للطلب (In Stock)' : 'Available in stock'}</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-[#392A23]">
              <input
                type="checkbox"
                checked={formData.isPublished ?? true}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="w-4 h-4 accent-[#A1312E]"
              />
              <span>{isAr ? 'منشور في القائمة للجمهور (Published)' : 'Published on public menu'}</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-[#392A23]">
              <input
                type="checkbox"
                checked={formData.isFeatured ?? false}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 accent-[#C58D38]"
              />
              <span>{isAr ? 'طبق مميز (Featured)' : 'Featured dish'}</span>
            </label>
          </div>

          {/* Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E8D8B5]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-bold transition"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#A1312E] hover:bg-[#862724] text-white rounded-xl font-bold transition shadow-xs disabled:opacity-50 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? (isAr ? 'جاري الحفظ...' : 'Saving...')
                  : (isAr ? 'حفظ وتأكيد التغييرات' : 'Save Changes')}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
