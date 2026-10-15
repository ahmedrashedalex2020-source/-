import React, { useState, useEffect, useMemo } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Category, MenuItem, RestaurantSettings, CartItem, AuditLog, ProductVariant, formatBaisaToOmr } from './types/menu';
import { MessageCircle, ShoppingBag } from 'lucide-react';
import {
  subscribeCategories,
  subscribeMenuItems,
  subscribeSettings,
  subscribeAuditLogs,
  saveMenuItem,
  deleteMenuItem,
  toggleItemAvailability,
  toggleItemPublished,
  saveCategory,
  deleteCategory,
  saveRestaurantSettings,
  bulkImportMenuItems,
} from './services/menuService';
import { DEFAULT_RESTAURANT_SETTINGS, INITIAL_CATEGORIES, INITIAL_MENU_ITEMS } from './data/initialData';

// Public Components
import { Header } from './components/public/Header';
import { Hero } from './components/public/Hero';
import { CategoryNav } from './components/public/CategoryNav';
import { ProductCard } from './components/public/ProductCard';
import { ProductDetailModal } from './components/public/ProductDetailModal';
import { SearchAndFilter } from './components/public/SearchAndFilter';
import { WhatsappCartDrawer } from './components/public/WhatsappCartDrawer';
import { Footer } from './components/public/Footer';

// Admin Components
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminOverview } from './components/admin/AdminOverview';
import { AdminItems } from './components/admin/AdminItems';
import { AdminItemFormModal } from './components/admin/AdminItemFormModal';
import { AdminCategories } from './components/admin/AdminCategories';
import { AdminVerification } from './components/admin/AdminVerification';
import { AdminMedia } from './components/admin/AdminMedia';
import { AdminSettings } from './components/admin/AdminSettings';
import { AdminQRCode } from './components/admin/AdminQRCode';
import { AdminDataExchange } from './components/admin/AdminDataExchange';
import { AdminAuditLogs } from './components/admin/AdminAuditLogs';
import { AdminHostingGuide } from './components/admin/AdminHostingGuide';
import { AdminLoginModal } from './components/admin/AdminLoginModal';

function MainApp() {
  const { user, isAdmin } = useAuth();

  // App Navigation & Language State
  const [viewMode, setViewMode] = useState<'public' | 'admin'>('public');
  const [adminTab, setAdminTab] = useState<string>('overview');
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  // Firestore Real-time Data
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [settings, setSettings] = useState<RestaurantSettings>(DEFAULT_RESTAURANT_SETTINGS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Public Menu UI State
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState<MenuItem | null>(null);

  // Cart State (for optional WhatsApp Ordering)
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Admin Modals State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Check URL path on mount (e.g. /admin)
  useEffect(() => {
    if (window.location.pathname.includes('/admin') || window.location.hash === '#admin') {
      setViewMode('admin');
    }
  }, []);

  // Sync document language and dir attribute
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // Subscribe to Firestore collections
  useEffect(() => {
    const unsubCats = subscribeCategories(setCategories);
    const unsubItems = subscribeMenuItems(setMenuItems);
    const unsubSettings = subscribeSettings((s) => {
      setSettings(s);
      if (s.defaultLanguage && (s.defaultLanguage === 'ar' || s.defaultLanguage === 'en')) {
        // preserve current or default
      }
    });
    const unsubLogs = subscribeAuditLogs(setAuditLogs);

    return () => {
      unsubCats();
      unsubItems();
      unsubSettings();
      unsubLogs();
    };
  }, []);

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  // Cart Operations
  const handleAddToCart = (item: MenuItem, variant?: ProductVariant, quantity: number = 1) => {
    const resolvedVariant =
      variant ||
      (item.hasVariants && item.variants && item.variants.length > 0
        ? item.variants[0]
        : undefined);

    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (ci) => ci.item.id === item.id && ci.selectedVariant?.id === resolvedVariant?.id
      );
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }
      return [...prev, { item, selectedVariant: resolvedVariant, quantity }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(index);
      return;
    }
    setCartItems((prev) => {
      const updated = [...prev];
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Item counts by category for public tabs
  const itemCountsByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    menuItems.forEach((it) => {
      if (it.isPublished) {
        map[it.categoryId] = (map[it.categoryId] || 0) + 1;
      }
    });
    return map;
  }, [menuItems]);

  // Cart item count map for badges on product cards
  const cartItemCounts = useMemo(() => {
    const map: Record<string, number> = {};
    cartItems.forEach((ci) => {
      map[ci.item.id] = (map[ci.item.id] || 0) + ci.quantity;
    });
    return map;
  }, [cartItems]);

  // Filtered Menu Items for Public Display
  const filteredPublicItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Must be published for public view
      if (!item.isPublished) return false;

      // Category filter
      if (selectedCategoryId !== 'all' && item.categoryId !== selectedCategoryId) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesAr = item.nameAr.toLowerCase().includes(q);
        const matchesEn = item.nameEn.toLowerCase().includes(q);
        const matchesDescAr = item.descriptionAr?.toLowerCase().includes(q) || false;
        const matchesDescEn = item.descriptionEn?.toLowerCase().includes(q) || false;
        const cat = categories.find((c) => c.id === item.categoryId);
        const matchesCatAr = cat?.nameAr.toLowerCase().includes(q) || false;
        const matchesCatEn = cat?.nameEn.toLowerCase().includes(q) || false;

        return matchesAr || matchesEn || matchesDescAr || matchesDescEn || matchesCatAr || matchesCatEn;
      }

      return true;
    });
  }, [menuItems, selectedCategoryId, searchQuery, categories]);

  // Group items by category when 'all' is selected
  const groupedPublicCategories = useMemo(() => {
    if (selectedCategoryId !== 'all') {
      const singleCat = categories.find((c) => c.id === selectedCategoryId);
      if (!singleCat) return [];
      return [
        {
          category: singleCat,
          items: filteredPublicItems,
        },
      ];
    }

    return categories
      .filter((cat) => cat.isPublished)
      .map((cat) => ({
        category: cat,
        items: filteredPublicItems.filter((i) => i.categoryId === cat.id),
      }))
      .filter((grp) => grp.items.length > 0);
  }, [categories, selectedCategoryId, filteredPublicItems]);

  // Navigate to Admin Handler
  const handleNavigateToAdmin = () => {
    setViewMode('admin');
    window.history.pushState(null, '', '#admin');
  };

  const handleExitAdmin = () => {
    setViewMode('public');
    window.history.pushState(null, '', window.location.pathname);
  };

  // Admin Item Actions with Optimistic State Updates
  const handleOpenAddItem = () => {
    setEditingItem(null);
    setIsItemModalOpen(true);
  };

  const handleOpenEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setIsItemModalOpen(true);
  };

  const handleUpdateItemDirect = async (item: MenuItem) => {
    // Instant optimistic update in React state
    setMenuItems((prev) => {
      const filtered = prev.filter((i) => i.id !== item.id);
      return [...filtered, item].sort((a, b) => a.displayOrder - b.displayOrder);
    });
    // Persist to Firestore & Local storage
    await saveMenuItem(item, false);
  };

  const handleSaveItem = async (item: MenuItem, isNew: boolean) => {
    setMenuItems((prev) => {
      const filtered = prev.filter((i) => i.id !== item.id);
      return [...filtered, item].sort((a, b) => a.displayOrder - b.displayOrder);
    });
    await saveMenuItem(item, isNew);
  };

  const handleDeleteItem = async (itemId: string, name: string) => {
    setMenuItems((prev) => prev.filter((i) => i.id !== itemId));
    await deleteMenuItem(itemId, name);
  };

  const handleDuplicateItem = async (item: MenuItem) => {
    const duplicated: MenuItem = {
      ...item,
      id: `item_${Date.now()}`,
      nameAr: `${item.nameAr} (نسخة)`,
      nameEn: `${item.nameEn} (Copy)`,
      displayOrder: item.displayOrder + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setMenuItems((prev) => [...prev, duplicated].sort((a, b) => a.displayOrder - b.displayOrder));
    await saveMenuItem(duplicated, true);
  };

  const handleToggleItemAvailability = async (id: string, isAvailable: boolean) => {
    setMenuItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, isAvailable } : i))
    );
    await toggleItemAvailability(id, isAvailable);
  };

  const handleToggleItemPublished = async (id: string, isPublished: boolean) => {
    setMenuItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, isPublished } : i))
    );
    await toggleItemPublished(id, isPublished);
  };

  const handleSaveCategory = async (cat: Category, isNew: boolean) => {
    setCategories((prev) => {
      const filtered = prev.filter((c) => c.id !== cat.id);
      return [...filtered, cat].sort((a, b) => a.displayOrder - b.displayOrder);
    });
    await saveCategory(cat, isNew);
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    await deleteCategory(id, name);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* 🌟 PERMANENT TOP DUAL-MODE SWITCHER BAR 🌟 */}
      <div className="bg-[#18110D] text-white border-b-2 border-[#C58D38] px-3 sm:px-6 py-2 flex items-center justify-between flex-wrap gap-2 text-xs font-bold z-50 sticky top-0 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-[#E8D8B5] font-extrabold text-xs sm:text-sm">
            مطعم كبدة إسكندراني — دارسيت، مسقط 🇴🇲
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('public')}
            className={`px-3 py-1.5 rounded-xl font-black transition flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'public'
                ? 'bg-[#A1312E] text-white shadow-md ring-2 ring-white scale-102'
                : 'bg-white/10 hover:bg-white/20 text-[#E8D8B5]'
            }`}
          >
            <span>📱 منيو الزبائن وسلة الطلبات</span>
          </button>

          <button
            onClick={() => setViewMode('admin')}
            className={`px-3 py-1.5 rounded-xl font-black transition flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'admin'
                ? 'bg-[#C58D38] text-[#18110D] shadow-md ring-2 ring-white scale-102'
                : 'bg-white/10 hover:bg-white/20 text-[#E8D8B5]'
            }`}
          >
            <span>⚙️ لوحة التحكم الاحترافية للمطعم</span>
          </button>
        </div>
      </div>

      {viewMode === 'admin' ? (
        /* ADMIN CMS VIEW */
        <AdminLayout
          activeTab={adminTab}
          onSelectTab={setAdminTab}
          onExitAdmin={handleExitAdmin}
          lang={lang}
          onToggleLang={handleToggleLang}
          onOpenAddItem={handleOpenAddItem}
        >
          {adminTab === 'overview' && (
            <AdminOverview
              categories={categories}
              items={menuItems}
              onNavigateTab={setAdminTab}
              lang={lang}
            />
          )}

          {adminTab === 'items' && (
            <AdminItems
              items={menuItems}
              categories={categories}
              onOpenAddModal={handleOpenAddItem}
              onOpenEditModal={handleOpenEditItem}
              onDeleteItem={handleDeleteItem}
              onDuplicateItem={handleDuplicateItem}
              onToggleAvailability={handleToggleItemAvailability}
              onTogglePublished={handleToggleItemPublished}
              onUpdateItemDirect={handleUpdateItemDirect}
              lang={lang}
            />
          )}

          {adminTab === 'categories' && (
            <AdminCategories
              categories={categories}
              items={menuItems}
              onSaveCategory={handleSaveCategory}
              onDeleteCategory={handleDeleteCategory}
              lang={lang}
            />
          )}

          {adminTab === 'verification' && (
            <AdminVerification
              items={menuItems}
              categories={categories}
              onUpdateItem={async (item) => saveMenuItem(item, false)}
              onEditItemModal={handleOpenEditItem}
              lang={lang}
            />
          )}

          {adminTab === 'media' && (
            <AdminMedia
              items={menuItems}
              onUpdateItemImage={async (id, url) => {
                const found = menuItems.find((i) => i.id === id);
                if (found) await saveMenuItem({ ...found, imageUrl: url }, false);
              }}
              lang={lang}
            />
          )}

          {adminTab === 'settings' && (
            <AdminSettings
              settings={settings}
              onSaveSettings={saveRestaurantSettings}
              lang={lang}
            />
          )}

          {adminTab === 'qr' && (
            <AdminQRCode settings={settings} lang={lang} />
          )}

          {adminTab === 'data' && (
            <AdminDataExchange
              items={menuItems}
              categories={categories}
              settings={settings}
              onBulkImportItems={bulkImportMenuItems}
              lang={lang}
            />
          )}

          {adminTab === 'logs' && (
            <AdminAuditLogs logs={auditLogs} lang={lang} />
          )}

          {adminTab === 'hosting' && (
            <AdminHostingGuide lang={lang} />
          )}

          {/* Admin Item Form Modal */}
          <AdminItemFormModal
            isOpen={isItemModalOpen}
            onClose={() => setIsItemModalOpen(false)}
            item={editingItem}
            categories={categories}
            onSave={handleSaveItem}
            lang={lang}
          />
        </AdminLayout>
      ) : (
        /* PUBLIC DIGITAL MENU VIEW */
        <div className="flex-1 flex flex-col parchment-bg">
          {/* Header */}
          <Header
            settings={settings}
            lang={lang}
            onToggleLang={handleToggleLang}
            onOpenSearch={() => setIsSearchOpen((prev) => !prev)}
            cartItems={cartItems}
            onOpenCart={() => setIsCartOpen(true)}
            onNavigateToAdmin={handleNavigateToAdmin}
          />

          {/* Hero Banner */}
          <Hero settings={settings} lang={lang} />

          {/* Search Bar */}
          <SearchAndFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            lang={lang}
            onClear={() => setSearchQuery('')}
            isOpen={isSearchOpen}
            onClose={() => {
              setIsSearchOpen(false);
              setSearchQuery('');
            }}
          />

          {/* Category Sticky Navigation */}
          <CategoryNav
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
            lang={lang}
            itemCountsByCategory={itemCountsByCategory}
          />

          {/* Main Menu Body */}
          <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            {groupedPublicCategories.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-[#E8D8B5] p-8 max-w-md mx-auto">
                <p className="text-base font-bold text-[#392A23]">
                  {lang === 'ar' ? 'لا توجد وجبات متوفرة حالياً' : 'No menu items found'}
                </p>
                <p className="text-xs text-[#755947] mt-1">
                  {lang === 'ar'
                    ? 'جرب البحث بكلمة مختلفة أو اختر قسماً آخر'
                    : 'Try searching for something else or choose another category'}
                </p>
              </div>
            ) : (
              <div className="space-y-12">
                {groupedPublicCategories.map(({ category, items }) => (
                  <section
                    key={category.id}
                    id={`cat-section-${category.id}`}
                    className="scroll-mt-32"
                  >
                    {/* Section Header */}
                    <div className="flex items-center gap-3 mb-5 border-b-2 border-[#E8D8B5] pb-2">
                      <div className="w-2.5 h-6 bg-[#A1312E] rounded-full" />
                      <h2 className="text-xl sm:text-2xl font-black text-[#392A23]">
                        {lang === 'ar' ? category.nameAr : category.nameEn}
                      </h2>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#E8D8B5]/60 text-[#755947]">
                        {items.length}
                      </span>
                    </div>

                    {/* Product Cards Responsive Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {items.map((item) => (
                        <ProductCard
                          key={item.id}
                          item={item}
                          lang={lang}
                          onSelect={setSelectedDetailItem}
                          onAddToCart={handleAddToCart}
                          enableOrdering={settings.enableWhatsappOrdering}
                          cartQuantity={cartItemCounts[item.id] || 0}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </main>

          {/* Product Detail Modal */}
          <ProductDetailModal
            item={selectedDetailItem}
            onClose={() => setSelectedDetailItem(null)}
            lang={lang}
            onAddToCart={handleAddToCart}
            enableOrdering={settings.enableWhatsappOrdering}
          />

          {/* WhatsApp Cart Drawer */}
          <WhatsappCartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveCartItem}
            onClearCart={handleClearCart}
            settings={settings}
            lang={lang}
          />

          {/* Floating Sticky Bottom Cart Bar for Customers - Always Visible */}
          {!isCartOpen && (
            <div className="fixed bottom-4 inset-x-3 sm:inset-x-auto sm:end-6 sm:w-96 z-40 animate-in slide-in-from-bottom duration-300">
              {cartItems.length > 0 ? (
                <div
                  onClick={() => setIsCartOpen(true)}
                  className="bg-[#25D366] hover:bg-[#20ba5a] text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl flex items-center justify-between cursor-pointer border-2 border-white transition transform hover:scale-102 ring-4 ring-emerald-500/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-xl">
                      <MessageCircle className="w-6 h-6 text-white fill-white" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block opacity-95">
                        {cartItems.reduce((acc, curr) => acc + curr.quantity, 0)} وجبة في السلة 🛒
                      </span>
                      <span className="text-sm sm:text-base font-black font-mono">
                        الإجمالي: {formatBaisaToOmr(
                          cartItems.reduce((acc, curr) => {
                            const unitPrice = curr.selectedVariant
                              ? curr.selectedVariant.priceBaisa
                              : curr.item.basePriceBaisa;
                            return acc + unitPrice * curr.quantity;
                          }, 0),
                          'ar'
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white text-[#128C7E] px-3.5 py-2 rounded-xl text-xs font-black shadow-xs">
                    <span>إتمام الطلب واتساب</span>
                    <span className="rtl:rotate-180">❯</span>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setIsCartOpen(true)}
                  className="bg-[#392A23] hover:bg-[#4E392F] text-[#E8D8B5] p-3 rounded-2xl shadow-xl flex items-center justify-between cursor-pointer border-2 border-[#C58D38] transition transform hover:scale-102"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="bg-[#A1312E] p-1.5 rounded-xl text-white">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block text-white">
                        سلة الطلبات جاهزة 🛒
                      </span>
                      <span className="text-[11px] text-[#E8D8B5]/80">
                        اضغط لفتح السلة أو اختر وجباتك الآن
                      </span>
                    </div>
                  </div>
                  <div className="bg-[#C58D38] text-[#392A23] px-3 py-1.5 rounded-xl text-xs font-black">
                    <span>فتح السلة</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <Footer
            settings={settings}
            lang={lang}
            onNavigateToAdmin={handleNavigateToAdmin}
          />
        </div>
      )}

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => {
          setIsLoginModalOpen(false);
          if (user && isAdmin) {
            setViewMode('admin');
          }
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
