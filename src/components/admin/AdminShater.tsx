import React from 'react';
import { Sparkles, TrendingUp, DollarSign, MessageCircle, Lightbulb, Target, Users, Zap } from 'lucide-react';
import { CustomerOrder, formatBaisaToOmr } from '../../types/menu';

interface AdminShaterProps {
  orders: CustomerOrder[];
  lang: 'ar' | 'en';
}

export const AdminShater: React.FC<AdminShaterProps> = ({ orders, lang }) => {
  const isAr = lang === 'ar';

  const tips = [
    {
      title: isAr ? 'عروض وجبة الغداء السريعة' : 'Quick Lunch Deals',
      desc: isAr
        ? 'أوقات الذروة في دارسيت ومسقط تبدأ من 1:00 ظهراً إلى 4:00 عصراً. فعّل عرض "ساندوتش كبدة + بطاطس + كانز" لزيادة متوسط قيمة الطلب.'
        : 'Peak order times in Darsait are between 1 PM and 4 PM. Activate combo deals to increase AOV.',
      badge: isAr ? 'زيادة المبيعات' : 'Sales Boost',
      icon: TrendingUp,
      color: 'text-[#00c853]',
    },
    {
      title: isAr ? 'الكروس سيل الذكي (Cross-sell)' : 'Smart Cross-sell',
      desc: isAr
        ? '85% من زبائن صواني التوفير يفضلون إضافة طحينة ومخلل إسكندراني إضافي عند الدفع في سلة التسوق.'
        : '85% of family tray customers prefer adding extra tahini and Alexandrian pickles at checkout.',
      badge: isAr ? 'كروس سيل' : 'Cross-sell',
      icon: Target,
      color: 'text-[#ffca28]',
    },
    {
      title: isAr ? 'متابعة السلات المتروكة عبر واتساب' : 'Abandoned Cart Recovery',
      desc: isAr
        ? 'إرسال رسالة تذكير ودية للزبون بعد 15 دقيقة من عدم إتمام الطلب يسترجع حوالي 30% من المبيعات المفقودة.'
        : 'Sending a friendly WhatsApp reminder within 15 mins recovers ~30% of lost carts.',
      badge: isAr ? 'استرجاع الطلبات' : 'Recovery',
      icon: MessageCircle,
      color: 'text-[#00bcd4]',
    },
    {
      title: isAr ? 'عرض العشاء العائلي المسائي' : 'Family Dinner Feast',
      desc: isAr
        ? 'بين 8:00 مساءً و 11:30 ليلاً يرتفع الطلب على صواني المشاوي المشكلة والحواوشي الإسكندراني المخصوص.'
        : 'Between 8 PM and 11:30 PM demand peaks for mixed grills and Alexandrian Hawawshi.',
      badge: isAr ? 'ذروة المساء' : 'Night Peak',
      icon: Zap,
      color: 'text-[#ba68c8]',
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 text-[#ededed] font-['Cairo',sans-serif]">
      {/* Header */}
      <div className="bg-[#141414] p-4 sm:p-5 rounded-[12px] border border-[#222222] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00c853]/15 border border-[#00c853]/40 flex items-center justify-center">
            {/* Emerald Green Shater Icon */}
            <svg viewBox="0 0 16 16" fill="none" className="w-5 h-5">
              <rect x="5" y="1" width="6" height="5" rx="1.5" fill="#00c853" />
              <rect x="1" y="8" width="6" height="5" rx="1.5" fill="#00c853" />
              <rect x="9" y="8" width="6" height="5" rx="1.5" fill="#00c853" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <span>{isAr ? 'شاطر — بياعك الشاطر ومساعد المبيعات' : 'Shater — Smart AI Sales Assistant'}</span>
              <span className="text-[10px] bg-[#00c853]/15 text-[#00c853] font-bold px-2 py-0.5 rounded-full border border-[#00c853]/30">
                PRO
              </span>
            </h2>
            <p className="text-xs text-[#888888] font-medium">
              {isAr
                ? 'تحليلات ذكية وتوصيات مبنية على حركة زبائن المتجر وسلوك الشراء لزيادة المبيعات والأرباح'
                : 'Actionable smart recommendations to boost average order value and conversions'}
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Strategy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {tips.map((tip, idx) => {
          const Icon = tip.icon;
          return (
            <div
              key={idx}
              className="bg-[#141414] border border-[#222222] hover:border-[#333333] rounded-[12px] p-4 sm:p-5 transition shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#1c1c1c] border border-[#282828] flex items-center justify-center">
                      <Icon className={`w-4 h-4 ${tip.color}`} />
                    </div>
                    <h3 className="font-black text-white text-sm sm:text-base">{tip.title}</h3>
                  </div>
                  <span className="text-[10px] bg-[#1c1c1c] text-[#aaaaaa] px-2 py-0.5 rounded-full border border-[#262626] font-bold">
                    {tip.badge}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#888888] leading-relaxed">
                  {tip.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1f1f1f] flex items-center justify-between text-xs">
                <span className="text-[#00c853] font-bold">
                  {isAr ? 'تأثير متوقع: +18% مبيعات' : 'Estimated Impact: +18% sales'}
                </span>
                <button
                  type="button"
                  className="px-3 py-1 rounded-lg bg-[#1c1c1c] hover:bg-[#252525] text-white text-[11px] font-bold border border-[#2b2b2b] transition cursor-pointer"
                >
                  {isAr ? 'تطبيق النصيحة' : 'Apply'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
