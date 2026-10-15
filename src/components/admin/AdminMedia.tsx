import React, { useState } from 'react';
import { MenuItem } from '../../types/menu';
import { Image as ImageIcon, Upload, Check, Link as LinkIcon } from 'lucide-react';

interface AdminMediaProps {
  items: MenuItem[];
  onUpdateItemImage: (itemId: string, imageUrl: string) => Promise<void>;
  lang: 'ar' | 'en';
}

export const AdminMedia: React.FC<AdminMediaProps> = ({
  items,
  onUpdateItemImage,
  lang,
}) => {
  const isAr = lang === 'ar';
  const [selectedItemId, setSelectedItemId] = useState(items[0]?.id || '');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const selectedItem = items.find((i) => i.id === selectedItemId);

  const handleSaveImage = async () => {
    if (!selectedItemId) return;
    try {
      setIsSaving(true);
      await onUpdateItemImage(selectedItemId, imageUrlInput.trim());
      setMessage(isAr ? 'تم تحديث صورة الوجبة بنجاح!' : 'Image updated successfully!');
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage('Error updating image');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-[#E8D8B5]">
        <h2 className="text-xl font-black text-[#392A23] flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-[#A1312E]" />
          <span>{isAr ? 'مكتبة الصور والوسائط' : 'Media Library'}</span>
        </h2>
        <p className="text-xs text-[#755947] mt-0.5">
          {isAr
            ? 'ربط وتحديث صور الوجبات والأطباق لظهورها في القائمة الرقمية للعملاء'
            : 'Manage and link authentic food photographs to your menu items'}
        </p>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Assign Image to Item */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8D8B5] space-y-4">
          <h3 className="text-sm font-bold text-[#392A23]">
            {isAr ? 'تخصيص صورة لوجبة في القائمة' : 'Assign Photo to Item'}
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-[#755947] block mb-1">
                {isAr ? 'اختر الوجبة' : 'Select Item'}
              </label>
              <select
                value={selectedItemId}
                onChange={(e) => {
                  setSelectedItemId(e.target.value);
                  const found = items.find((i) => i.id === e.target.value);
                  setImageUrlInput(found?.imageUrl || '');
                }}
                className="w-full bg-[#FFF9EF] border border-[#E8D8B5] rounded-xl p-2.5 font-bold text-xs text-[#392A23] outline-hidden"
              >
                {items.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.nameAr} ({i.nameEn})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-[#755947] block mb-1">
                {isAr ? 'رابط الصورة (Image URL)' : 'Photo URL'}
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="flex-1 bg-white border border-[#E8D8B5] rounded-xl p-2.5 text-xs text-[#392A23] outline-hidden focus:border-[#A1312E]"
                />
                <button
                  type="button"
                  onClick={handleSaveImage}
                  disabled={isSaving}
                  className="px-4 bg-[#A1312E] hover:bg-[#862724] text-white rounded-xl font-bold text-xs transition disabled:opacity-50"
                >
                  {isAr ? 'حفظ' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8D8B5] space-y-3 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-bold text-[#755947]">
            {isAr ? 'معاينة العرض' : 'Live Preview'}
          </span>

          <div className="w-48 h-48 rounded-2xl overflow-hidden bg-[#FFF9EF] border-2 border-[#E8D8B5] flex items-center justify-center">
            {imageUrlInput ? (
              <img
                src={imageUrlInput}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '';
                }}
              />
            ) : (
              <div className="p-4 text-[#755947]/50 text-xs">
                <ImageIcon className="w-8 h-8 mx-auto mb-1 text-[#C58D38]" />
                <span>{isAr ? 'لا توجد صورة مخصصة' : 'No photo specified'}</span>
              </div>
            )}
          </div>

          {selectedItem && (
            <div className="text-xs font-bold text-[#392A23]">
              {selectedItem.nameAr} — {selectedItem.nameEn}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
