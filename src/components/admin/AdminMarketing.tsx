import React, { useState } from 'react';
import { Megaphone, Compass, Wallet, Filter, ShoppingBag, Plus, Check, Trash2, DollarSign, Tag, TrendingUp, Sparkles } from 'lucide-react';
import { CustomerOrder, formatBaisaToOmr } from '../../types/menu';

interface AdminMarketingProps {
  orders: CustomerOrder[];
  activeSubTab?: 'marketing' | 'tracking' | 'wallet' | 'funnels' | 'services';
  lang: 'ar' | 'en';
}

export const AdminMarketing: React.FC<AdminMarketingProps> = ({
  orders,
  activeSubTab = 'marketing',
  lang,
}) => {
  const isAr = lang === 'ar';
  const [currentTab, setCurrentTab] = useState(activeSubTab);

  // Coupons Mock / State
  const [coupons, setCoupons] = useState([
    { code: 'ALEX20', discount: '20%', active: true, usageCount: 14 },
    { code: 'DARSAIT10', discount: '10%', active: true, usageCount: 28 },
    { code: 'FREESHIP', discount: 'توصيل مجاني', active: true, usageCount: 39 },
  ]);
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState('');

  // Tracking Pixels State
  const [fbPixel, setFbPixel] = useState('149827364129841');
  const [tiktokPixel, setTiktokPixel] = useState('');
  const [gaId, setGaId] = useState('G-ALEXLIVER2026');
  const [savedTracking, setSavedTracking] = useState(false);

  const handleAddCoupon = () => {
    if (!newCode.trim() || !newDiscount.trim()) return;
    setCoupons((prev) => [
      ...prev,
      { code: newCode.toUpperCase().trim(), discount: newDiscount.trim(), active: true, usageCount: 0 },
    ]);
    setNewCode('');
    setNewDiscount('');
  };

  const totalSalesBaisa = orders.reduce((acc, curr) => acc + (curr.totalBaisa || 0), 0);
  const totalOrdersCount = orders.length;
  const estimatedCostBaisa = Math.round(totalSalesBaisa * 0.35); // Cost of goods ~ 35%
  const estimatedNetProfit = totalSalesBaisa - estimatedCostBaisa;

  return (
    <div className="space-y-4 sm:space-y-6 text-[#ededed] font-['Cairo',sans-serif]">
      {/* Tab Switcher Header */}
      <div className="bg-[#141414] p-3 sm:p-4 rounded-[12px] border border-[#222222] shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setCurrentTab('marketing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'marketing'
                ? 'bg-[#1c1c1c] text-[#00c853] border border-[#282828]'
                : 'text-[#888888] hover:text-white'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>{isAr ? 'أدوات التسويق والكوبونات' : 'Marketing & Coupons'}</span>
          </button>

          <button
            onClick={() => setCurrentTab('tracking')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'tracking'
                ? 'bg-[#1c1c1c] text-[#00c853] border border-[#282828]'
                : 'text-[#888888] hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{isAr ? 'أدوات التتبع (Pixel & GA)' : 'Pixels & Tracking'}</span>
          </button>

          <button
            onClick={() => setCurrentTab('wallet')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'wallet'
                ? 'bg-[#1c1c1c] text-[#00c853] border border-[#282828]'
                : 'text-[#888888] hover:text-white'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>{isAr ? 'محفظتك وحساب الأرباح' : 'Wallet & Profits'}</span>
          </button>

          <button
            onClick={() => setCurrentTab('funnels')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'funnels'
                ? 'bg-[#1c1c1c] text-[#00c853] border border-[#282828]'
                : 'text-[#888888] hover:text-white'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Funnels</span>
          </button>

          <button
            onClick={() => setCurrentTab('services')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              currentTab === 'services'
                ? 'bg-[#1c1c1c] text-[#00c853] border border-[#282828]'
                : 'text-[#888888] hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isAr ? 'معرض الخدمات' : 'Services Store'}</span>
            <span className="text-[10px] bg-[#00c853]/15 text-[#00c853] px-1.5 py-0.2 rounded font-bold">جديد</span>
          </button>
        </div>
      </div>

      {/* TAB CONTENT: MARKETING */}
      {currentTab === 'marketing' && (
        <div className="space-y-4">
          <div className="bg-[#141414] p-4 sm:p-5 rounded-[12px] border border-[#222222] shadow-sm">
            <h3 className="text-sm font-black text-white mb-2 flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#00c853]" />
              <span>{isAr ? 'كوبونات الخصم والعروض الترويجية' : 'Discount Coupons'}</span>
            </h3>
            <p className="text-xs text-[#888888] mb-4">
              {isAr
                ? 'أنشئ أكواد خصم يكتبها الزبون عند الدفع في سلة المشتريات'
                : 'Create discount codes for customer checkout in the cart'}
            </p>

            {/* Create Coupon Input */}
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <input
                type="text"
                placeholder={isAr ? 'كود الخصم (مثال: ALEX10)' : 'Coupon Code'}
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                className="bg-[#0e0e0e] border border-[#282828] focus:border-[#00c853] rounded-xl px-3 py-2 text-xs font-bold text-white uppercase outline-none"
              />
              <input
                type="text"
                placeholder={isAr ? 'نسبة الخصم أو القيمة (مثال: 10% أو 0.500 ر.ع)' : 'Discount Value'}
                value={newDiscount}
                onChange={(e) => setNewDiscount(e.target.value)}
                className="bg-[#0e0e0e] border border-[#282828] focus:border-[#00c853] rounded-xl px-3 py-2 text-xs font-bold text-white outline-none"
              />
              <button
                onClick={handleAddCoupon}
                className="bg-[#00c853] hover:bg-[#00b34a] text-black font-black text-xs px-4 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{isAr ? 'إضافة الكوبون' : 'Add Coupon'}</span>
              </button>
            </div>

            {/* Coupons Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead className="bg-[#1a1a1a] border-b border-[#222222] text-[#888888]">
                  <tr>
                    <th className="p-2.5 text-start">الكود</th>
                    <th className="p-2.5 text-start">الخصم</th>
                    <th className="p-2.5 text-center">مرات الاستخدام</th>
                    <th className="p-2.5 text-center">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222222]">
                  {coupons.map((c, i) => (
                    <tr key={i} className="hover:bg-[#1a1a1a]">
                      <td className="p-2.5 font-mono font-black text-white">{c.code}</td>
                      <td className="p-2.5 font-bold text-[#00c853]">{c.discount}</td>
                      <td className="p-2.5 text-center font-mono text-[#888888]">{c.usageCount}</td>
                      <td className="p-2.5 text-center">
                        <span className="text-[10px] bg-[#00c853]/15 text-[#00c853] font-bold px-2 py-0.5 rounded-full border border-[#00c853]/30">
                          نشط
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: TRACKING */}
      {currentTab === 'tracking' && (
        <div className="bg-[#141414] p-4 sm:p-5 rounded-[12px] border border-[#222222] shadow-sm space-y-4">
          <h3 className="text-sm font-black text-white mb-2 flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#00bcd4]" />
            <span>{isAr ? 'بكسل التتبع والتحليلات الإعلانية' : 'Tracking Pixels & Analytics'}</span>
          </h3>
          <p className="text-xs text-[#888888]">
            {isAr
              ? 'اربط متجرك ببيكسل فيسبوك وتيك توك وجوجل لتتبع المبيعات والزيارات وتحسين الحملات الإعلانية'
              : 'Integrate Meta Pixel, TikTok Pixel, and Google Analytics to track ad conversions'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-[#888888] block mb-1">Facebook Pixel ID</label>
              <input
                type="text"
                value={fbPixel}
                onChange={(e) => setFbPixel(e.target.value)}
                placeholder="e.g. 149827364129841"
                className="w-full bg-[#0e0e0e] border border-[#282828] focus:border-[#00c853] rounded-xl p-2.5 font-mono text-white outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-[#888888] block mb-1">TikTok Pixel ID</label>
              <input
                type="text"
                value={tiktokPixel}
                onChange={(e) => setTiktokPixel(e.target.value)}
                placeholder="e.g. C8X92K4J5L8"
                className="w-full bg-[#0e0e0e] border border-[#282828] focus:border-[#00c853] rounded-xl p-2.5 font-mono text-white outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-bold text-[#888888] block mb-1">Google Analytics ID (GA4)</label>
              <input
                type="text"
                value={gaId}
                onChange={(e) => setGaId(e.target.value)}
                placeholder="e.g. G-XXXXXXX"
                className="w-full bg-[#0e0e0e] border border-[#282828] focus:border-[#00c853] rounded-xl p-2.5 font-mono text-white outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => {
                setSavedTracking(true);
                setTimeout(() => setSavedTracking(false), 3000);
              }}
              className="bg-[#00c853] hover:bg-[#00b34a] text-black font-black text-xs px-5 py-2.5 rounded-xl transition cursor-pointer"
            >
              {savedTracking ? (isAr ? 'تم الحفظ بنجاح ✓' : 'Saved!') : isAr ? 'حفظ إعدادات التتبع' : 'Save Pixels'}
            </button>
          </div>
        </div>
      )}

      {/* TAB CONTENT: WALLET */}
      {currentTab === 'wallet' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#141414] border border-[#222222] rounded-[12px] p-4">
              <span className="text-xs text-[#888888] font-bold block mb-1">إجمالي الإيرادات</span>
              <span className="text-xl font-black text-white font-mono">
                {formatBaisaToOmr(totalSalesBaisa, lang)}
              </span>
            </div>
            <div className="bg-[#141414] border border-[#222222] rounded-[12px] p-4">
              <span className="text-xs text-[#888888] font-bold block mb-1">تكلفة المواد الغذائية التقديرية</span>
              <span className="text-xl font-black text-[#ffca28] font-mono">
                {formatBaisaToOmr(estimatedCostBaisa, lang)}
              </span>
            </div>
            <div className="bg-[#141414] border border-[#222222] rounded-[12px] p-4">
              <span className="text-xs text-[#888888] font-bold block mb-1">صافي الأرباح المحققة</span>
              <span className="text-xl font-black text-[#00c853] font-mono">
                {formatBaisaToOmr(estimatedNetProfit, lang)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: FUNNELS */}
      {currentTab === 'funnels' && (
        <div className="bg-[#141414] p-4 sm:p-5 rounded-[12px] border border-[#222222] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#222222] pb-3">
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#ba68c8]" />
                <span>{isAr ? 'مسارات البيع والعروض الخاصة (Funnels)' : 'Sales Funnels'}</span>
              </h3>
              <p className="text-xs text-[#888888] mt-0.5">
                {isAr ? 'صفحات هبوط مخصصة لعروض الوجبات الجماعية وصواني التوفير' : 'Landing pages for high-ticket meal deals'}
              </p>
            </div>
            <button className="bg-[#00c853] hover:bg-[#00b34a] text-black font-black text-xs px-3 py-1.5 rounded-lg cursor-pointer">
              + {isAr ? 'إنشاء Funnel جديد' : 'New Funnel'}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[#0e0e0e] border border-[#222222] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#00c853]" />
              <div>
                <h4 className="text-xs font-black text-white">{isAr ? 'عرض صينية التوفير العائلية الخاصة' : 'Family Platter Funnel'}</h4>
                <span className="text-[11px] text-[#777777] font-mono">/funnel/family-tray-offer</span>
              </div>
            </div>
            <span className="text-xs font-mono text-[#00c853] font-bold">142 زيارة • 28 طلب</span>
          </div>
        </div>
      )}

      {/* TAB CONTENT: SERVICES */}
      {currentTab === 'services' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-[#141414] border border-[#222222] p-4 sm:p-5 rounded-[12px] shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] bg-[#00c853]/15 text-[#00c853] font-bold px-2 py-0.5 rounded-full inline-block mb-2">
                خدمة جديدة
              </span>
              <h3 className="text-base font-black text-white mb-1">تصميم وتصوير احترافي للوجبات</h3>
              <p className="text-xs text-[#888888] leading-relaxed">
                جلسات تصوير طعام احترافية لأطباق المشاوي والكبدة الإسكندراني لتنسيقها داخل المنيو الإلكتروني.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#1f1f1f] flex items-center justify-between">
              <span className="text-xs font-mono text-[#00c853] font-bold">ابتداءً من 25 ر.ع</span>
              <button className="px-3 py-1.5 bg-[#1c1c1c] hover:bg-[#252525] text-white rounded-lg text-xs font-bold border border-[#2b2b2b] cursor-pointer">
                طلب الخدمة
              </button>
            </div>
          </div>

          <div className="bg-[#141414] border border-[#222222] p-4 sm:p-5 rounded-[12px] shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] bg-[#00c853]/15 text-[#00c853] font-bold px-2 py-0.5 rounded-full inline-block mb-2">
                خدمة جديدة
              </span>
              <h3 className="text-base font-black text-white mb-1">إدارة الحملات الإعلانية الممولة</h3>
              <p className="text-xs text-[#888888] leading-relaxed">
                إطلاق حملات إنستجرام وتيك توك موجهة لسكان دارسيت وروي ومطرح ومسقط لزيادة طلبات الدليفري.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#1f1f1f] flex items-center justify-between">
              <span className="text-xs font-mono text-[#00c853] font-bold">حسب الميزانية</span>
              <button className="px-3 py-1.5 bg-[#1c1c1c] hover:bg-[#252525] text-white rounded-lg text-xs font-bold border border-[#2b2b2b] cursor-pointer">
                طلب الخدمة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
