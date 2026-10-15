import React, { useState } from 'react';
import { BrandLogo } from '../brand/BrandLogo';
import { useAuth } from '../../context/AuthContext';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Palette,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Lock,
  Eye,
  Plus,
  MessageCircle,
  Database,
  QrCode,
  Layers,
  CheckCircle2,
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
  const { lockAdmin } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Accordion state for dropdowns in sidebar
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    orders: true,
    products: false,
    design: false,
  });

  const toggleDropdown = (key: string) => {
    setExpandedMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectNav = (tabId: string) => {
    onSelectTab(tabId);
    setIsMobileSidebarOpen(false);
  };

  return (
    <div
      className="min-h-screen bg-[#0b0b0b] text-[#ededed] flex flex-col font-['Cairo',sans-serif] selection:bg-[#00c853]/30 selection:text-white"
      dir="rtl"
    >
      {/* ========================================================
          TOP HEADER BAR (Dark, Minimalist, Matching Dark Theme)
         ======================================================== */}
      <header className="h-14 bg-[#141414] border-b border-[#222222] sticky top-0 z-40 px-3 sm:px-6 flex items-center justify-between">
        {/* Right side: Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="lg:hidden p-2 rounded-lg bg-[#1c1c1c] text-[#aaaaaa] hover:text-white cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={onExitAdmin}
            className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition"
            title={isAr ? 'معاينة المتجر' : 'Storefront Preview'}
          >
            <BrandLogo size="sm" showSubtitle={false} lightMode={true} />
            <span className="hidden sm:inline-block text-[11px] font-bold text-[#888888] bg-[#1c1c1c] px-2 py-0.5 rounded-md border border-[#262626]">
              {isAr ? 'لوحة التحكم والإدارة' : 'Admin Portal'}
            </span>
          </div>
        </div>

        {/* Left side actions: Store Preview, Quick Add, Lock */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Add Product button */}
          {onOpenAddItem && (
            <button
              onClick={onOpenAddItem}
              className="hidden sm:inline-flex items-center gap-1.5 bg-[#00c853] hover:bg-[#00b34a] text-black font-black text-xs px-3 py-1.5 rounded-lg transition active:scale-95 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{isAr ? 'إضافة منتج' : 'Add Item'}</span>
            </button>
          )}

          {/* Quick Storefront Preview Button */}
          <button
            onClick={onExitAdmin}
            className="inline-flex items-center gap-1.5 bg-[#1c1c1c] hover:bg-[#252525] text-white border border-[#2b2b2b] text-xs font-bold px-3 py-1.5 rounded-lg transition cursor-pointer"
            title={isAr ? 'العودة لواجهة المتجر وسلة الطلبات' : 'View Storefront'}
          >
            <Eye className="w-3.5 h-3.5 text-[#00c853]" />
            <span className="hidden xs:inline">{isAr ? 'معاينة المتجر' : 'Store'}</span>
          </button>

          {/* Lock Session */}
          <button
            onClick={() => {
              lockAdmin();
              onExitAdmin();
            }}
            className="p-1.5 rounded-lg bg-[#1c1c1c] hover:bg-rose-950/40 text-[#888888] hover:text-rose-400 border border-[#2b2b2b] transition cursor-pointer"
            title={isAr ? 'قفل لوحة التحكم فوراً' : 'Lock session'}
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ========================================================
          MAIN BODY WITH CLEAN RIGHT SIDEBAR + WORKSPACE
         ======================================================== */}
      <div className="flex-1 flex overflow-hidden">
        {/* ========================================================
            RIGHT SIDEBAR (Clean, focused, no clutter)
           ======================================================== */}
        <aside
          className={`fixed inset-y-0 right-0 z-50 w-64 bg-[#141414] border-l border-[#222222] flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
            isMobileSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Mobile close button */}
          <div className="lg:hidden p-3 flex justify-between items-center border-b border-[#222222]">
            <span className="text-xs font-bold text-[#aaaaaa]">
              {isAr ? 'لوحة التحكم' : 'Control Panel'}
            </span>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="p-1 text-[#888888] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sidebar Nav Items List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-5 no-scrollbar">
            {/* SECTION: إدارة المطعم الرئيسية */}
            <div>
              <h3 className="text-[11px] font-bold text-[#666666] mb-2 px-3 uppercase tracking-wider">
                {isAr ? 'إدارة المطعم' : 'Restaurant Management'}
              </h3>

              <div className="space-y-1">
                {/* 1. لوحة الإحصائيات (Active item with dark pill & emerald green icon) */}
                <button
                  onClick={() => handleSelectNav('overview')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                    activeTab === 'overview'
                      ? 'bg-[#1c1c1c] text-white border border-[#262626] shadow-xs'
                      : 'text-[#aaaaaa] hover:bg-[#181818] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 flex items-center justify-center text-[#00c853]">
                      <svg
                        className="w-4 h-4 stroke-current"
                        viewBox="0 0 24 24"
                        fill="none"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 17l6-6 4 4 8-8" />
                        <path d="M14 7h7v7" />
                      </svg>
                    </div>
                    <span>{isAr ? 'لوحة الإحصائيات' : 'Dashboard'}</span>
                  </div>
                </button>

                {/* 2. الطلبات (Dropdown with Package Icon) */}
                <div>
                  <button
                    onClick={() => {
                      toggleDropdown('orders');
                      handleSelectNav('orders');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                      activeTab === 'orders'
                        ? 'bg-[#1c1c1c] text-white'
                        : 'text-[#aaaaaa] hover:bg-[#181818] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Package className="w-4 h-4 text-[#888888]" />
                      <span>{isAr ? 'إدارة الطلبات' : 'Orders'}</span>
                    </div>
                    {expandedMenus.orders ? (
                      <ChevronUp className="w-3.5 h-3.5 text-[#666666]" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-[#666666]" />
                    )}
                  </button>

                  {/* Submenu for Orders */}
                  {expandedMenus.orders && (
                    <div className="pr-8 pl-2 py-1 space-y-1 text-xs text-[#888888]">
                      <button
                        onClick={() => handleSelectNav('orders')}
                        className="w-full text-right py-1.5 hover:text-white cursor-pointer transition block"
                      >
                        {isAr ? '• كل الطلبات' : '• All Orders'}
                      </button>
                      <button
                        onClick={() => handleSelectNav('orders')}
                        className="w-full text-right py-1.5 hover:text-white cursor-pointer transition block"
                      >
                        {isAr ? '• طلبات جديدة' : '• New Orders'}
                      </button>
                      <button
                        onClick={() => handleSelectNav('orders')}
                        className="w-full text-right py-1.5 hover:text-white cursor-pointer transition block"
                      >
                        {isAr ? '• قيد التجهيز' : '• In Progress'}
                      </button>
                      <button
                        onClick={() => handleSelectNav('orders')}
                        className="w-full text-right py-1.5 hover:text-white cursor-pointer transition block"
                      >
                        {isAr ? '• مكتملة' : '• Completed'}
                      </button>
                    </div>
                  )}
                </div>

                {/* 3. قائمة الطعام (المنتجات والتصنيفات) */}
                <div>
                  <button
                    onClick={() => {
                      toggleDropdown('products');
                      handleSelectNav('items');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                      activeTab === 'items' || activeTab === 'categories' || activeTab === 'verification'
                        ? 'bg-[#1c1c1c] text-white'
                        : 'text-[#aaaaaa] hover:bg-[#181818] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="w-4 h-4 text-[#888888]" />
                      <span>{isAr ? 'قائمة الطعام' : 'Menu & Food'}</span>
                    </div>
                    {expandedMenus.products ? (
                      <ChevronUp className="w-3.5 h-3.5 text-[#666666]" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-[#666666]" />
                    )}
                  </button>

                  {expandedMenus.products && (
                    <div className="pr-8 pl-2 py-1 space-y-1 text-xs text-[#888888]">
                      <button
                        onClick={() => handleSelectNav('items')}
                        className="w-full text-right py-1.5 hover:text-white cursor-pointer transition block"
                      >
                        {isAr ? '• كل الوجبات والسندوتشات' : '• All Items'}
                      </button>
                      {onOpenAddItem && (
                        <button
                          onClick={() => {
                            onOpenAddItem();
                            setIsMobileSidebarOpen(false);
                          }}
                          className="w-full text-right py-1.5 text-[#00c853] hover:underline cursor-pointer transition block font-bold"
                        >
                          {isAr ? '+ إضافة وجبة جديدة' : '+ Add New Item'}
                        </button>
                      )}
                      <button
                        onClick={() => handleSelectNav('categories')}
                        className="w-full text-right py-1.5 hover:text-white cursor-pointer transition block"
                      >
                        {isAr ? '• الأقسام والتصنيفات' : '• Categories'}
                      </button>
                      <button
                        onClick={() => handleSelectNav('verification')}
                        className="w-full text-right py-1.5 hover:text-white cursor-pointer transition block"
                      >
                        {isAr ? '• تدقيق أسعار المنيو' : '• Price Verification'}
                      </button>
                    </div>
                  )}
                </div>

                {/* 4. تصميم وإعدادات المتجر */}
                <div>
                  <button
                    onClick={() => {
                      toggleDropdown('design');
                      handleSelectNav('settings');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                      activeTab === 'settings'
                        ? 'bg-[#1c1c1c] text-white'
                        : 'text-[#aaaaaa] hover:bg-[#181818] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Palette className="w-4 h-4 text-[#888888]" />
                      <span>{isAr ? 'تصميم وإعدادات المتجر' : 'Store Settings'}</span>
                    </div>
                    {expandedMenus.design ? (
                      <ChevronUp className="w-3.5 h-3.5 text-[#666666]" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-[#666666]" />
                    )}
                  </button>

                  {expandedMenus.design && (
                    <div className="pr-8 pl-2 py-1 space-y-1 text-xs text-[#888888]">
                      <button
                        onClick={() => handleSelectNav('settings')}
                        className="w-full text-right py-1.5 hover:text-white cursor-pointer transition block"
                      >
                        {isAr ? '• البنرات الإعلانية' : '• Hero Sliders'}
                      </button>
                      <button
                        onClick={() => handleSelectNav('settings')}
                        className="w-full text-right py-1.5 hover:text-white cursor-pointer transition block"
                      >
                        {isAr ? '• شريط الإعلانات العلوي' : '• Top Announcement'}
                      </button>
                      <button
                        onClick={() => handleSelectNav('settings')}
                        className="w-full text-right py-1.5 hover:text-white cursor-pointer transition block"
                      >
                        {isAr ? '• أرقام الواتساب والتواصل' : '• Contact Numbers'}
                      </button>
                      <button
                        onClick={() => handleSelectNav('settings')}
                        className="w-full text-right py-1.5 hover:text-white cursor-pointer transition block"
                      >
                        {isAr ? '• عنوان الفرع وساعات العمل' : '• Branch & Hours'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION: أدوات مساعدة سريعة */}
            <div className="pt-2 border-t border-[#1f1f1f]">
              <h3 className="text-[11px] font-bold text-[#666666] mb-2 px-3 uppercase tracking-wider">
                {isAr ? 'أدوات مساعدة' : 'Quick Tools'}
              </h3>

              <div className="space-y-1">
                {/* رمز QR */}
                <button
                  onClick={() => handleSelectNav('qrcode')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                    activeTab === 'qrcode'
                      ? 'bg-[#1c1c1c] text-white border border-[#262626]'
                      : 'text-[#aaaaaa] hover:bg-[#181818] hover:text-white'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-[#888888]" />
                  <span>{isAr ? 'رمز QR للمنيو الورقي' : 'Menu QR Code'}</span>
                </button>

                {/* النسخ الاحتياطي والبيانات */}
                <button
                  onClick={() => handleSelectNav('data')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                    activeTab === 'data'
                      ? 'bg-[#1c1c1c] text-white border border-[#262626]'
                      : 'text-[#aaaaaa] hover:bg-[#181818] hover:text-white'
                  }`}
                >
                  <Database className="w-4 h-4 text-[#888888]" />
                  <span>{isAr ? 'تصدير ونسخ البيانات' : 'Backup & Export'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Footer: Quick Back to Storefront Button */}
          <div className="p-3 border-t border-[#222222] bg-[#0e0e0e]">
            <button
              onClick={onExitAdmin}
              className="w-full flex items-center justify-center gap-2 bg-[#1c1c1c] hover:bg-[#252525] text-white py-2.5 px-3 rounded-xl text-xs font-black transition cursor-pointer border border-[#2b2b2b]"
            >
              <Eye className="w-4 h-4 text-[#00c853]" />
              <span>{isAr ? 'العودة لمعاينة المتجر' : 'Back to Storefront'}</span>
            </button>
          </div>
        </aside>

        {/* Mobile backdrop */}
        {isMobileSidebarOpen && (
          <div
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-xs"
          />
        )}

        {/* ========================================================
            CONTENT WORKSPACE (Clean Dark Theme #0b0b0b)
           ======================================================== */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 bg-[#0b0b0b] min-h-[calc(100vh-3.5rem)] relative">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Floating WhatsApp Support Icon in Bottom-Left Corner */}
      <a
        href="https://wa.me/96879348565"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 left-5 z-40 w-12 h-12 rounded-full bg-[#00c853] hover:bg-[#00e676] active:scale-95 shadow-lg flex items-center justify-center text-white transition duration-200 cursor-pointer drop-shadow-md hover:scale-105"
        title="WhatsApp Direct Contact"
        aria-label="WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-white" />
      </a>
    </div>
  );
};
