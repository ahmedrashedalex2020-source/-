import React, { useState, useEffect } from 'react';
import { RestaurantSettings } from '../../types/menu';
import {
  Save,
  CheckCircle,
  MessageCircle,
  Phone,
  MapPin,
  Clock,
  ExternalLink,
  ShieldCheck,
  Send,
} from 'lucide-react';

interface AdminSettingsProps {
  settings: RestaurantSettings;
  onSaveSettings: (settings: RestaurantSettings) => Promise<void>;
  lang: 'ar' | 'en';
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  settings,
  onSaveSettings,
  lang,
}) => {
  const isAr = lang === 'ar';
  const [formData, setFormData] = useState<RestaurantSettings>({ ...settings });
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setFormData({ ...settings });
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setErrorMsg(null);
      await onSaveSettings(formData);
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3500);
    } catch (err) {
      console.error(err);
      setErrorMsg('حدث خطأ أثناء حفظ الإعدادات، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestWhatsApp = () => {
    const cleanNumber = formData.whatsapp.replace(/[^0-9]/g, '');
    const testMsg = encodeURIComponent(
      'مرحباً! هذه رسالة تجريبية من لوحة تحكم مطعم كبدة إسكندراني للتأكد من وصول طلبات الزبائن بنجاح على هذا الرقم.'
    );
    window.open(`https://wa.me/${cleanNumber}?text=${testMsg}`, '_blank');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#E8D8B5] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <MessageCircle className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#392A23]">
              إعدادات المطعم ورقم واتساب الطلبات
            </h2>
          </div>
          <p className="text-xs text-[#755947] mt-1">
            عدل رقم الواتساب اللي بتستلم عليه طلبات الزباين واسم المطعم والعناوين وساعات العمل
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center justify-center gap-2 bg-[#A1312E] hover:bg-[#862724] text-white px-6 py-3 rounded-2xl text-xs sm:text-sm font-black transition shadow-md disabled:opacity-50 hover:scale-102"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'جاري الحفظ...' : 'حفظ كل التعديلات فوراً'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-300 text-emerald-900 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>تمام يا فندم! تم حفظ رقم الواتساب وكافة إعدادات المطعم في قاعدة البيانات بنجاح.</span>
        </div>
      )}

      {/* 1. HIGHLIGHTED WHATSAPP ORDERING SECTION */}
      <div className="bg-gradient-to-r from-emerald-50 via-[#FFF9EF] to-emerald-50 p-6 rounded-3xl border-2 border-emerald-400 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-200 pb-4">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-[#25D366] text-white rounded-2xl shadow-sm">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#392A23]">
                رقم واتساب المطعم الرسمي لاستقبال الطلبات
              </h3>
              <p className="text-xs text-[#755947] mt-0.5 max-w-xl">
                كل طلبات الزباين بالأسماء وأرقام التليفونات والأصناف المختارة هتوصلك تلقائياً كرسالة واتساب منسقة على هذا الرقم.
              </p>
            </div>
          </div>

          {/* Toggle Active */}
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-emerald-300 shadow-2xs">
            <span className="text-xs font-black text-[#392A23]">
              {formData.enableWhatsappOrdering ? 'الطلب بالواتساب: مفعل ✓' : 'الطلب بالواتساب: معطل'}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.enableWhatsappOrdering}
                onChange={(e) => setFormData({ ...formData, enableWhatsappOrdering: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-gray-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#25D366]"></div>
            </label>
          </div>
        </div>

        {/* WhatsApp Phone Input & Test Button */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-8">
            <label className="text-xs font-black text-[#392A23] block mb-1">
              رقم واتساب المطعم (مع كود الدولة مثل +968 لسلطنة عمان) *
            </label>
            <div className="relative">
              <MessageCircle className="w-5 h-5 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-emerald-600" />
              <input
                type="text"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="+968 79348565"
                className="w-full bg-white border-2 border-emerald-400 focus:border-emerald-600 rounded-2xl ltr:pl-10 ltr:pr-3 rtl:pr-10 rtl:pl-3 py-3 font-mono font-black text-base text-[#392A23] outline-hidden shadow-2xs"
                required
              />
            </div>
            <span className="text-[11px] text-[#755947] mt-1 block font-semibold">
              الرقم الأصلي المعتمد بالقائمة: <strong className="text-emerald-800 font-mono">+968 79348565</strong> (تقدر تغيره لأي رقم تاني في أي وقت وتدوس حفظ).
            </span>
          </div>

          <div className="md:col-span-4 flex gap-2">
            <button
              type="button"
              onClick={handleTestWhatsApp}
              className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-2xl font-black text-xs transition shadow-sm"
              title="اختبار فتح الواتساب للتأكد إن الرقم صحيح"
            >
              <Send className="w-4 h-4" />
              <span>تجربة الرقم (Test)</span>
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-1.5 bg-[#A1312E] hover:bg-[#862724] text-white py-3 px-4 rounded-2xl font-black text-xs transition shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>حفظ الآن</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. RESTAURANT PROFILE & DETAILS */}
      <div className="bg-white p-5 rounded-3xl border border-[#E8D8B5] space-y-4 shadow-xs">
        <h3 className="text-sm font-black text-[#392A23] border-b border-[#E8D8B5] pb-2 flex items-center gap-2">
          <span>بيانات المطعم والعناوين الرسمية</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-bold text-[#755947] block mb-1">
              اسم المطعم بالعربية *
            </label>
            <input
              type="text"
              value={formData.nameAr}
              onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
              className="w-full bg-[#FFF9EF] border border-[#E8D8B5] rounded-xl p-2.5 font-bold text-sm text-[#A1312E] outline-hidden"
              required
            />
          </div>

          <div>
            <label className="font-bold text-[#755947] block mb-1">
              اسم المطعم بالإنجليزية *
            </label>
            <input
              type="text"
              value={formData.nameEn}
              onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
              className="w-full bg-[#FFF9EF] border border-[#E8D8B5] rounded-xl p-2.5 font-bold text-sm text-[#755947] outline-hidden font-['Inter']"
              required
            />
          </div>

          <div>
            <label className="font-bold text-[#755947] block mb-1 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-[#A1312E]" />
              <span>رقم الاتصال المباشر (المكالمات) *</span>
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-[#FFF9EF] border border-[#E8D8B5] rounded-xl p-2.5 font-bold text-sm text-[#392A23] outline-hidden font-mono"
              required
            />
            <span className="text-[10px] text-gray-500 mt-0.5 block">
              الرقم المستخرج من القائمة للمكالمات: +968 92347955
            </span>
          </div>

          <div>
            <label className="font-bold text-[#755947] block mb-1 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#C58D38]" />
              <span>ساعات العمل الرسمية</span>
            </label>
            <input
              type="text"
              value={formData.openingHoursAr || ''}
              onChange={(e) => setFormData({ ...formData, openingHoursAr: e.target.value })}
              className="w-full bg-white border border-[#E8D8B5] rounded-xl p-2.5 text-xs text-[#392A23] outline-hidden"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="font-bold text-[#755947] block mb-1 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#A1312E]" />
              <span>عنوان المطعم بالعربية *</span>
            </label>
            <input
              type="text"
              value={formData.addressAr}
              onChange={(e) => setFormData({ ...formData, addressAr: e.target.value })}
              className="w-full bg-white border border-[#E8D8B5] rounded-xl p-2.5 text-xs text-[#392A23] outline-hidden font-bold"
              required
            />
          </div>

          <div>
            <label className="font-bold text-[#755947] block mb-1">
              العبارة الترحيبية بالمنيو
            </label>
            <input
              type="text"
              value={formData.heroTaglineAr || ''}
              onChange={(e) => setFormData({ ...formData, heroTaglineAr: e.target.value })}
              className="w-full bg-white border border-[#E8D8B5] rounded-xl p-2.5 text-xs text-[#392A23] outline-hidden"
            />
          </div>

          <div>
            <label className="font-bold text-[#755947] block mb-1">
              رابط خرائط جوجل (Google Maps)
            </label>
            <input
              type="url"
              value={formData.googleMapsUrl || ''}
              onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
              className="w-full bg-white border border-[#E8D8B5] rounded-xl p-2.5 text-xs text-[#392A23] outline-hidden"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
