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
  Lock,
  Palette,
  Sliders,
  Copy,
  Check,
  User,
  KeyRound,
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
  const [formData, setFormData] = useState<RestaurantSettings>({
    ...settings,
    publicMenuUrl: settings.publicMenuUrl || 'https://kebdaaskndrany.ct.ws',
    adminUsername: settings.adminUsername || 'admin',
    adminPassword: settings.adminPassword || 'alex2024',
    adminPinCode: settings.adminPinCode || '1973',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedAdminLink, setCopiedAdminLink] = useState(false);
  const [copiedMenuLink, setCopiedMenuLink] = useState(false);

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
      'مرحباً! رسالة تجريبية من لوحة تحكم مطعم كبدة إسكندراني للتأكد من وصول طلبات الزبائن بنجاح على هذا الرقم.'
    );
    window.open(`https://wa.me/${cleanNumber}?text=${testMsg}`, '_blank');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 text-[#ededed] font-['Cairo',sans-serif]">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141414] p-4 sm:p-5 rounded-[12px] border border-[#222222] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#00c853]/15 text-[#00c853] border border-[#00c853]/30">
              <Sliders className="w-4 h-4" />
            </span>
            <h2 className="text-lg sm:text-xl font-black text-white">
              {isAr ? 'تصميم المتجر وإعدادات الطلبات' : 'Store Design & Settings'}
            </h2>
          </div>
          <p className="text-xs text-[#888888] mt-1">
            {isAr
              ? 'التحكم في بنرات العروض، نصوص الهيدر، رقم واتساب استقبال الفواتير، ورمز حماية الإدارة'
              : 'Manage store banners, header texts, WhatsApp ordering, and admin PIN'}
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center justify-center gap-2 bg-[#00c853] hover:bg-[#00b34a] text-black px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer shadow-md disabled:opacity-50 active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : isAr ? 'حفظ التعديلات' : 'Save Changes'}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-[#00c853]/15 border border-[#00c853]/40 text-[#00c853] rounded-[12px] text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{isAr ? 'تم حفظ كافة الإعدادات وتحديثها في قاعدة البيانات بنجاح.' : 'Settings saved successfully.'}</span>
        </div>
      )}

      {/* 1. WHATSAPP ORDERING SECTION */}
      <div className="bg-[#141414] p-4 sm:p-5 rounded-[12px] border border-[#00c853]/40 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222222] pb-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-[#00c853] text-black rounded-xl shadow-xs">
              <MessageCircle className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-white">
                {isAr ? 'رقم واتساب المطعم الرسمي لاستقبال الطلبات' : 'Official WhatsApp Ordering Number'}
              </h3>
              <p className="text-xs text-[#888888] mt-0.5">
                {isAr
                  ? 'تصلك تفاصيل فواتير الزبائن مباشرة على هذا الرقم بصيغة منسقة ومنظمة'
                  : 'Customer orders and invoice details will be delivered directly to this number'}
              </p>
            </div>
          </div>

          {/* Toggle Active */}
          <div className="flex items-center gap-3 bg-[#0e0e0e] px-3 py-1.5 rounded-xl border border-[#282828]">
            <span className="text-xs font-bold text-[#cccccc]">
              {formData.enableWhatsappOrdering
                ? isAr ? 'الطلب مفعل ✓' : 'Enabled'
                : isAr ? 'الطلب معطل' : 'Disabled'}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.enableWhatsappOrdering}
                onChange={(e) => setFormData({ ...formData, enableWhatsappOrdering: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-[#222222] rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00c853]"></div>
            </label>
          </div>
        </div>

        {/* WhatsApp Phone Input & Test Button */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-8">
            <label className="text-xs font-bold text-[#888888] block mb-1">
              {isAr ? 'رقم واتساب المطعم (مع كود الدولة مثل +968) *' : 'WhatsApp Number *'}
            </label>
            <div className="relative">
              <MessageCircle className="w-4 h-4 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 text-[#00c853]" />
              <input
                type="text"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="+968 79348565"
                className="w-full bg-[#0e0e0e] border border-[#282828] focus:border-[#00c853] rounded-xl ltr:pl-9 ltr:pr-3 rtl:pr-9 rtl:pl-3 py-2.5 font-mono font-bold text-sm text-white outline-none"
                required
              />
            </div>
            <span className="text-[11px] text-[#777777] mt-1 block">
              {isAr ? 'الرقم الافتراضي المعتمد في المنيو:' : 'Default:'}{' '}
              <strong className="text-[#00c853] font-mono">+968 79348565</strong>
            </span>
          </div>

          <div className="md:col-span-4 flex gap-2">
            <button
              type="button"
              onClick={handleTestWhatsApp}
              className="flex-1 flex items-center justify-center gap-1.5 bg-[#00c853]/15 hover:bg-[#00c853]/25 text-[#00c853] border border-[#00c853]/30 py-2.5 px-3 rounded-xl font-bold text-xs transition cursor-pointer"
              title="اختبار فتح الواتساب"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isAr ? 'تجربة الرقم' : 'Test'}</span>
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-1.5 bg-[#00c853] hover:bg-[#00b34a] text-black py-2.5 px-3 rounded-xl font-bold text-xs transition cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isAr ? 'حفظ' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. STORE BRANDING & HEADLINE */}
      <div className="bg-[#141414] p-4 sm:p-5 rounded-[12px] border border-[#222222] space-y-4 shadow-sm">
        <h3 className="text-sm font-black text-white border-b border-[#222222] pb-2 flex items-center gap-2">
          <Palette className="w-4 h-4 text-[#00c853]" />
          <span>{isAr ? 'بيانات الهوية والشريط الإعلاني' : 'Store Branding & Banners'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="font-bold text-[#888888] block mb-1">
              {isAr ? 'اسم المطعم (بالعربية)' : 'Restaurant Name (Ar)'}
            </label>
            <input
              type="text"
              value={formData.nameAr}
              onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
              className="w-full bg-[#0e0e0e] border border-[#282828] focus:border-[#00c853] rounded-xl p-2.5 font-bold text-sm text-white outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-[#888888] block mb-1">
              {isAr ? 'اسم المطعم (بالإنجليزية)' : 'Restaurant Name (En)'}
            </label>
            <input
              type="text"
              value={formData.nameEn}
              onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
              className="w-full bg-[#0e0e0e] border border-[#282828] focus:border-[#00c853] rounded-xl p-2.5 font-bold text-sm text-white outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="font-bold text-[#888888] block mb-1">
              {isAr ? 'شعار البنر الإعلاني (Tagline)' : 'Hero Tagline'}
            </label>
            <input
              type="text"
              value={formData.heroTaglineAr || ''}
              onChange={(e) => setFormData({ ...formData, heroTaglineAr: e.target.value })}
              placeholder="أشهى المأكولات الإسكندرية والشواء الطازج على أصوله في قلب مسقط"
              className="w-full bg-[#0e0e0e] border border-[#282828] focus:border-[#00c853] rounded-xl p-2.5 font-bold text-sm text-white outline-none"
            />
          </div>
        </div>
      </div>

      {/* 3. CONTACT & LOCATION */}
      <div className="bg-[#141414] p-4 sm:p-5 rounded-[12px] border border-[#222222] space-y-4 shadow-sm">
        <h3 className="text-sm font-black text-white border-b border-[#222222] pb-2 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#00c853]" />
          <span>{isAr ? 'العناوين وأوقات العمل' : 'Location & Hours'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="font-bold text-[#888888] block mb-1">
              {isAr ? 'عنوان الفرع (عربي)' : 'Address (Ar)'}
            </label>
            <input
              type="text"
              value={formData.addressAr}
              onChange={(e) => setFormData({ ...formData, addressAr: e.target.value })}
              className="w-full bg-[#0e0e0e] border border-[#282828] focus:border-[#00c853] rounded-xl p-2.5 font-bold text-sm text-white outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-[#888888] block mb-1">
              {isAr ? 'رقم الهاتف للاتصال' : 'Phone'}
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-[#0e0e0e] border border-[#282828] focus:border-[#00c853] rounded-xl p-2.5 font-bold text-sm text-white outline-none font-mono"
            />
          </div>

          <div>
            <label className="font-bold text-[#888888] block mb-1">
              {isAr ? 'ساعات العمل' : 'Opening Hours'}
            </label>
            <input
              type="text"
              value={formData.openingHoursAr}
              onChange={(e) => setFormData({ ...formData, openingHoursAr: e.target.value })}
              className="w-full bg-[#0e0e0e] border border-[#282828] focus:border-[#00c853] rounded-xl p-2.5 font-bold text-sm text-white outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-[#888888] block mb-1">
              {isAr ? 'رابط خرائط جوجل (Google Maps)' : 'Google Maps Link'}
            </label>
            <input
              type="url"
              value={formData.googleMapsUrl}
              onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
              className="w-full bg-[#0e0e0e] border border-[#282828] focus:border-[#00c853] rounded-xl p-2.5 font-mono text-xs text-white outline-none"
            />
          </div>
        </div>
      </div>

      {/* 4. ADMIN CMS CREDENTIALS, DIRECT URL & QR DOMAIN */}
      <div className="bg-[#141414] p-4 sm:p-5 rounded-[12px] border border-[#222222] space-y-5 shadow-sm">
        <div className="flex items-center gap-2 border-b border-[#222222] pb-2">
          <Lock className="w-4 h-4 text-[#00c853]" />
          <h3 className="text-sm font-black text-white">
            {isAr ? 'أمان لوحة التحكم، رابط الدخول المباشر، وبيانات الحساب' : 'Security, Direct URL & Credentials'}
          </h3>
        </div>

        {/* Direct Links Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Admin Direct URL */}
          <div className="bg-[#0e0e0e] p-3 rounded-xl border border-[#222222] space-y-1.5">
            <label className="text-xs font-bold text-[#888888] flex items-center justify-between">
              <span>{isAr ? '🔗 رابط الدخول المباشر للوحة التحكم:' : 'Direct Admin Access Link:'}</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText('https://kebdaaskndrany.ct.ws/#admin');
                  setCopiedAdminLink(true);
                  setTimeout(() => setCopiedAdminLink(false), 2000);
                }}
                className="text-[11px] text-[#00c853] hover:underline flex items-center gap-1 cursor-pointer font-bold"
              >
                {copiedAdminLink ? <Check className="w-3 h-3 text-[#00c853]" /> : <Copy className="w-3 h-3" />}
                <span>{copiedAdminLink ? (isAr ? 'تم النسخ!' : 'Copied!') : isAr ? 'نسخ الرابط' : 'Copy'}</span>
              </button>
            </label>
            <div className="bg-[#161616] px-3 py-2 rounded-lg font-mono text-xs text-[#00c853] select-all border border-[#262626] font-bold">
              https://kebdaaskndrany.ct.ws/#admin
            </div>
            <p className="text-[10px] text-[#666666]">
              {isAr ? 'احفظ هذا الرابط في المفضلة لديك للدخول السريع للوحة الإدارة.' : 'Bookmark this link for instant access.'}
            </p>
          </div>

          {/* Fixed Public Menu Domain */}
          <div className="bg-[#0e0e0e] p-3 rounded-xl border border-[#222222] space-y-1.5">
            <label className="text-xs font-bold text-[#888888] flex items-center justify-between">
              <span>{isAr ? '📱 رابط منيو الزبائن (المثبت على الـ QR):' : 'Public Menu URL (Fixed QR):'}</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText('https://kebdaaskndrany.ct.ws');
                  setCopiedMenuLink(true);
                  setTimeout(() => setCopiedMenuLink(false), 2000);
                }}
                className="text-[11px] text-[#00c853] hover:underline flex items-center gap-1 cursor-pointer font-bold"
              >
                {copiedMenuLink ? <Check className="w-3 h-3 text-[#00c853]" /> : <Copy className="w-3 h-3" />}
                <span>{copiedMenuLink ? (isAr ? 'تم النسخ!' : 'Copied!') : isAr ? 'نسخ الرابط' : 'Copy'}</span>
              </button>
            </label>
            <div className="bg-[#161616] px-3 py-2 rounded-lg font-mono text-xs text-white select-all border border-[#262626] font-bold">
              https://kebdaaskndrany.ct.ws
            </div>
            <p className="text-[10px] text-[#666666]">
              {isAr ? 'هذا الرابط المربوط مباشرة برمز QR وبطاقات الطاولات.' : 'This URL is hardwired to table QR codes.'}
            </p>
          </div>
        </div>

        {/* Username, Password & PIN inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2 border-t border-[#1f1f1f]">
          {/* Username */}
          <div>
            <label className="text-xs font-bold text-[#aaaaaa] block mb-1">
              {isAr ? 'اسم المستخدم (Username)' : 'Admin Username'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.adminUsername || 'admin'}
                onChange={(e) => setFormData({ ...formData, adminUsername: e.target.value })}
                className="w-full bg-[#0e0e0e] border border-[#282828] focus:border-[#00c853] rounded-xl p-2.5 font-bold text-xs sm:text-sm text-white outline-none"
              />
              <div className="absolute left-3 top-3 text-[#666666] pointer-events-none">
                <User className="w-4 h-4" />
              </div>
            </div>
            <p className="text-[10px] text-[#666666] mt-1 font-mono">الافتراضي: admin</p>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-bold text-[#aaaaaa] block mb-1">
              {isAr ? 'كلمة المرور (Password)' : 'Admin Password'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.adminPassword || 'alex2024'}
                onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                className="w-full bg-[#0e0e0e] border border-[#282828] focus:border-[#00c853] rounded-xl p-2.5 font-bold text-xs sm:text-sm text-white outline-none font-mono"
              />
              <div className="absolute left-3 top-3 text-[#666666] pointer-events-none">
                <Lock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-[10px] text-[#666666] mt-1 font-mono">الافتراضي: alex2024</p>
          </div>

          {/* PIN Code */}
          <div>
            <label className="text-xs font-bold text-[#aaaaaa] block mb-1">
              {isAr ? 'رمز PIN السريع (اختياري)' : 'Master PIN'}
            </label>
            <div className="relative">
              <input
                type="text"
                maxLength={8}
                value={formData.adminPinCode || '1973'}
                onChange={(e) => setFormData({ ...formData, adminPinCode: e.target.value.replace(/[^0-9]/g, '') })}
                className="w-full bg-[#0e0e0e] border border-[#282828] focus:border-[#00c853] rounded-xl p-2.5 font-bold text-xs sm:text-sm text-[#00c853] outline-none font-mono text-center tracking-wider"
              />
              <div className="absolute left-3 top-3 text-[#666666] pointer-events-none">
                <KeyRound className="w-4 h-4" />
              </div>
            </div>
            <p className="text-[10px] text-[#666666] mt-1 font-mono">الافتراضي: 1973</p>
          </div>
        </div>
      </div>
    </form>
  );
};
