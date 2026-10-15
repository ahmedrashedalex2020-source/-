import React, { useRef, useEffect } from 'react';
import { BrandLogo } from '../brand/BrandLogo';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  UtensilsCrossed,
  FolderKanban,
  ShieldCheck,
  Image as ImageIcon,
  Settings,
  QrCode,
  Database,
  History,
  Globe,
  ExternalLink,
  Wifi,
  WifiOff,
  Plus,
  MessageCircle,
  Menu,
  CheckCircle,
} from 'lucide-react';

interface AdminLayoutProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onExitAdmin: () => void;
  lang: 'ar' | 'en';
  onToggleLang: () => void;
  onOpenAddItem?: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  activeTab,
  onSelectTab,
  onExitAdmin,
  lang,
  onToggleLang,
  onOpenAddItem,
  children,
}) => {
  const isAr = lang === 'ar';
  const { isConnected } = useAuth();
  const tabsScrollRef = useRef<HTMLDivElement>(null);

  const mainNavItems = [
    {
      id: 'items',
      labelAr: 'وجبات القائمة وتعديل الأسعار',
      labelEn: 'Menu Items & Prices',
      icon: UtensilsCrossed,
      badge: 'الرئيسي',
      descAr: 'تعديل الأسعار والأصناف فوراً',
    },
    {
      id: 'categories',
      labelAr: 'أقسام وتصنيفات الطعام',
      labelEn: 'Categories',
      icon: FolderKanban,
      badge: 'مهم',
      descAr: 'إضافة وتعديل وترتيب الأقسام',
    },
    {
      id: 'settings',
      labelAr: 'إعدادات المطعم ورقم الواتساب',
      labelEn: 'WhatsApp & Settings',
      icon: MessageCircle,
      badge: 'واتساب',
      descAr: 'تعديل رقم واتساب استقبال الطلبات',
    },
    {
      id: 'overview',
      labelAr: 'لوحة الإحصائيات العامة',
      labelEn: 'Overview & Stats',
      icon: LayoutDashboard,
      descAr: 'ملخص الأصناف والمبيعات',
    },
    {
      id: 'verification',
      labelAr: 'تدقيق وتوثيق الأسعار',
      labelEn: 'Price Verification',
      icon: ShieldCheck,
      descAr: 'مطابقة الأسعار مع المنيو الورقي',
    },
    {
      id: 'data',
      labelAr: 'استيراد وتصدير ونسخ احتياطي',
      labelEn: 'Import & Backup',
      icon: Database,
      descAr: 'تصدير واستيراد بيانات المنيو',
    },
    {
      id: 'media',
      labelAr: 'مكتبة صور الوجبات',
      labelEn: 'Media Library',
      icon: ImageIcon,
      descAr: 'إدارة صور الوجبات',
    },
    {
      id: 'qr',
      labelAr: 'رمز QR والطباعة',
      labelEn: 'QR Code',
      icon: QrCode,
      descAr: 'تحميل وطباعة باركود الطاولات',
    },
    {
      id: 'hosting',
      labelAr: 'ربط الدومين واستضافة InfinityFree',
      labelEn: 'Domain & DNS (InfinityFree)',
      icon: Globe,
      badge: 'DNS',
      descAr: 'خطوات ربط الدومين والـ DNS والرفع',
    },
    {
      id: 'logs',
      labelAr: 'سجل العمليات والتعديلات',
      labelEn: 'Activity Log',
      icon: History,
      descAr: 'تتبع كافة التعديلات السابقة',
    },
  ];

  // Auto-scroll active tab into view
  useEffect(() => {
    if (!tabsScrollRef.current) return;
    const activeEl = tabsScrollRef.current.querySelector(
      `[data-tab-id="${activeTab}"]`
    ) as HTMLElement;
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#FBF5E8] flex flex-col text-[#392A23] pb-20 md:pb-8">
      {/* 1. TOP HEADER WITH BRANDING & QUICK CONTROLS */}
      <header className="sticky top-0 z-40 bg-[#2A1E19] text-white border-b-2 border-[#C58D38] shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-18 gap-2">
            {/* Logo & Dashboard Title */}
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-1.5 rounded-xl shrink-0">
                <BrandLogo size="sm" showSubtitle={false} className="[&_span]:text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-black text-[#C58D38] uppercase tracking-wider block">
                    لوحة التحكم الاحترافية للمطعم
                  </span>
                  <span className="hidden sm:inline-block bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    نشط مباشر
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-extrabold text-white line-clamp-1">
                  كبدة إسكندراني — فرع دارسيت، مسقط
                </span>
              </div>
            </div>

            {/* Quick Actions & Exit to Customer Menu */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Add Item Quick Button */}
              {onOpenAddItem && (
                <button
                  onClick={onOpenAddItem}
                  className="hidden sm:flex items-center gap-1.5 bg-[#C58D38] hover:bg-[#b07b2c] text-[#2A1E19] px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition shadow-sm hover:scale-102 cursor-pointer"
                  title="إضافة وجبة جديدة للمنيو الآن"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>إضافة وجبة +</span>
                </button>
              )}

              {/* Firestore sync pill */}
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 text-[11px] font-bold border border-[#755947]">
                {isConnected ? (
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Wifi className="w-3.5 h-3.5" />
                    <span>متصل مباشر</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-amber-400">
                    <WifiOff className="w-3.5 h-3.5" />
                    <span>مزامنة محلية</span>
                  </span>
                )}
              </div>

              {/* Language toggle */}
              <button
                onClick={onToggleLang}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition text-[#E8D8B5]"
                title="تغيير اللغة"
              >
                <Globe className="w-3.5 h-3.5 text-[#C58D38]" />
                <span>{isAr ? 'EN' : 'عربي'}</span>
              </button>

              {/* Back to Public Menu Button */}
              <button
                onClick={onExitAdmin}
                className="flex items-center gap-1.5 bg-[#A1312E] hover:bg-[#862724] text-white px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition shadow-sm border border-red-400 hover:scale-102 cursor-pointer"
                title="الرجوع لقائمة الطعام العامة للزبائن"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="whitespace-nowrap">عرض منيو الزبائن</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. PROMINENT NAVIGATION BUTTONS BAR (PRIMARY TABS) */}
        <div className="bg-[#1A110D] border-t-2 border-[#C58D38]/40 py-2.5 px-2 sm:px-4 shadow-inner">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between gap-2">
              {/* Scrollable button strip */}
              <div
                ref={tabsScrollRef}
                className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 flex-1"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {mainNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      data-tab-id={item.id}
                      onClick={() => onSelectTab(item.id)}
                      className={`whitespace-nowrap px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                        isActive
                          ? 'bg-[#A1312E] text-white shadow-lg ring-2 ring-[#C58D38] scale-102'
                          : 'bg-[#2E2018] text-[#E8D8B5] hover:bg-[#3E2C22] hover:text-white border border-[#755947]/60'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#C58D38]'}`} />
                      <span>{isAr ? item.labelAr : item.labelEn}</span>
                      {item.badge && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                            isActive
                              ? 'bg-[#C58D38] text-[#2A1E19]'
                              : 'bg-black/60 text-[#C58D38] border border-[#C58D38]/30'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Mobile quick add */}
              {onOpenAddItem && (
                <button
                  onClick={onOpenAddItem}
                  className="sm:hidden shrink-0 bg-[#C58D38] text-[#2A1E19] p-2 rounded-xl font-black text-xs flex items-center gap-1 shadow-sm"
                  title="إضافة وجبة"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 3. SUB-HEADER BREADCRUMB & QUICK STATS BAR */}
      <div className="max-w-7xl mx-auto w-full px-3 sm:px-6 pt-4 pb-2">
        <div className="bg-white px-4 py-3 rounded-2xl border-2 border-[#E8D8B5] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-amber-50 text-[#C58D38] border border-amber-200">
              <Menu className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[11px] font-bold text-gray-400 block">
                أنت الآن في قسم:
              </span>
              <h1 className="text-base sm:text-lg font-black text-[#A1312E] leading-tight">
                {mainNavItems.find((n) => n.id === activeTab)?.[isAr ? 'labelAr' : 'labelEn']}
              </h1>
            </div>
          </div>

          {/* Quick jump shortcuts */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-[#755947] hidden md:inline">
              تنقل سريع:
            </span>
            <button
              onClick={() => onSelectTab('items')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'items'
                  ? 'bg-[#A1312E] text-white'
                  : 'bg-[#FFF9EF] text-[#755947] hover:bg-[#E8D8B5]/50 border border-[#E8D8B5]'
              }`}
            >
              الوجبات والأسعار 🍔
            </button>
            <button
              onClick={() => onSelectTab('categories')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-[#A1312E] text-white'
                  : 'bg-[#FFF9EF] text-[#755947] hover:bg-[#E8D8B5]/50 border border-[#E8D8B5]'
              }`}
            >
              الأقسام 📁
            </button>
            <button
              onClick={() => onSelectTab('settings')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#A1312E] text-white'
                  : 'bg-[#FFF9EF] text-emerald-800 hover:bg-emerald-50 border border-emerald-300'
              }`}
            >
              رقم الواتساب 📱
            </button>
            <button
              onClick={() => onSelectTab('overview')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#A1312E] text-white'
                  : 'bg-[#FFF9EF] text-[#755947] hover:bg-[#E8D8B5]/50 border border-[#E8D8B5]'
              }`}
            >
              الإحصائيات 📊
            </button>
          </div>
        </div>
      </div>

      {/* 4. MAIN CONTENT VIEW */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 py-2">
        {children}
      </main>

      {/* 5. MOBILE BOTTOM NAVIGATION DOCK (FIXED ON PHONES) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-[#2A1E19] text-white border-t-2 border-[#C58D38] z-50 shadow-2xl px-2 py-1.5 flex items-center justify-around">
        <button
          onClick={() => onSelectTab('items')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-black transition ${
            activeTab === 'items' ? 'text-[#C58D38] bg-white/10' : 'text-[#E8D8B5]'
          }`}
        >
          <UtensilsCrossed className="w-5 h-5 mb-0.5" />
          <span>الأصناف</span>
        </button>

        <button
          onClick={() => onSelectTab('categories')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-black transition ${
            activeTab === 'categories' ? 'text-[#C58D38] bg-white/10' : 'text-[#E8D8B5]'
          }`}
        >
          <FolderKanban className="w-5 h-5 mb-0.5" />
          <span>الأقسام</span>
        </button>

        {onOpenAddItem && (
          <button
            onClick={onOpenAddItem}
            className="flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-black bg-[#A1312E] text-white shadow-md -mt-3 ring-2 ring-white"
          >
            <Plus className="w-5 h-5 mb-0.5 stroke-[3]" />
            <span>إضافة صنف</span>
          </button>
        )}

        <button
          onClick={() => onSelectTab('settings')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-black transition ${
            activeTab === 'settings' ? 'text-emerald-400 bg-white/10' : 'text-[#E8D8B5]'
          }`}
        >
          <MessageCircle className="w-5 h-5 mb-0.5" />
          <span>الواتساب</span>
        </button>

        <button
          onClick={onExitAdmin}
          className="flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-black text-amber-300"
        >
          <ExternalLink className="w-5 h-5 mb-0.5" />
          <span>المنيو</span>
        </button>
      </nav>
    </div>
  );
};
