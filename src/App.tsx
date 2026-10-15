import React, { useState, useEffect, useMemo } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Category, MenuItem, RestaurantSettings, CartItem, AuditLog, ProductVariant, CustomerOrder, formatBaisaToOmr } from './types/menu';
import { MessageCircle, ShoppingBag, Sparkles } from 'lucide-react';
import {
  subscribeCategories,
  subscribeMenuItems,
  subscribeSettings,
  subscribeAuditLogs,
  subscribeOrders,
  subscribeAnalytics,
  trackStoreVisit,
  trackCartAddition,
  trackCheckoutStart,
  StoreAnalytics,
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

// Public EasyOrder Components
import { EasyOrderHeader } from './components/public/EasyOrderHeader';
import { EasyOrderHeroSlider } from './components/public/EasyOrderHeroSlider';
import { EasyOrderCategoryCarousel } from './components/public/EasyOrderCategoryCarousel';
import { EasyOrderFeaturedSplit } from './components/public/EasyOrderFeaturedSplit';
import { EasyOrderProductCard } from './components/public/EasyOrderProductCard';
import { EasyOrderCartDrawer } from './components/public/EasyOrderCartDrawer';
import { ProductDetailModal } from './components/public/ProductDetailModal';
import { Footer } from './components/public/Footer';

// Admin Components
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminOrders } from './components/admin/AdminOrders';
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
import { AdminShater } from './components/admin/AdminShater';
import { AdminMarketing } from './components/admin/AdminMarketing';

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
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [analytics, setAnalytics] = useState<StoreAnalytics>({
    visits: 0,
    cartAdditions: 0,
    checkoutStarts: 0,
    crossSellAdditions: 0,
    lostOrders: 0,
  });

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

  // Check URL path on mount and on route change (e.g. #admin, ?admin=true, /admin)
  useEffect(() => {
    const checkAdminRoute = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const hasAdminParam = searchParams.get('admin') === 'true' || searchParams.get('admin') === '1';
      const hasAdminHash = window.location.hash.toLowerCase() === '#admin';
      const hasAdminPath = window.location.pathname.endsWith('/admin') || window.location.pathname.includes('/admin');

      if (hasAdminParam || hasAdminHash || hasAdminPath) {
        if (isAdmin) {
          setViewMode('admin');
        } else {
          setIsLoginModalOpen(true);
        }
      } else {
        // Record customer visit for analytics
        trackStoreVisit();
      }
    };

    checkAdminRoute();
    window.addEventListener('hashchange', checkAdminRoute);
    window.addEventListener('popstate', checkAdminRoute);

    return () => {
      window.removeEventListener('hashchange', checkAdminRoute);
      window.removeEventListener('popstate', checkAdminRoute);
    };
  }, [isAdmin]);

  // Sync document language and dir attribute
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // Subscribe to Firestore collections & live metrics
  useEffect(() => {
    const unsubCats = subscribeCategories(setCategories);
    const unsubItems = subscribeMenuItems(setMenuItems);
    const unsubSettings = subscribeSettings((s) => {
      setSettings(s);
    });
    const unsubLogs = subscribeAuditLogs(setAuditLogs);
    const unsubOrders = subscribeOrders(setOrders);
    const unsubAnalytics = subscribeAnalytics(setAnalytics);

    return () => {
      unsubCats();
      unsubItems();
      unsubSettings();
      unsubLogs();
      unsubOrders();
      unsubAnalytics();
    };
  }, []);

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  // Cart Operations
  const handleAddToCart = (
    item: MenuItem,
    variant?: ProductVariant,
    quantity: number = 1,
    openCartDrawer: boolean = false
  ) => {
    trackCartAddition();
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
    if (openCartDrawer) {
      trackCheckoutStart();
      setIsCartOpen(true);
    }
  };

  const handleUpdateCardQuantity = (item: MenuItem, newQty: number) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex((ci) => ci.item.id === item.id);
      if (newQty <= 0) {
        return prev.filter((ci) => ci.item.id !== item.id);
      }
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx].quantity = newQty;
        return updated;
      }
      return [...prev, { item, quantity: newQty }];
    });
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

  // Direct WhatsApp Quick Order
  const handleDirectWhatsAppOrder = () => {
    if (cartItems.length > 0) {
      setIsCartOpen(true);
    } else {
      const rawPhone = (settings.whatsapp || settings.phone || '+96890000000').replace(/[^0-9]/g, '');
      const msg = encodeURIComponent(
        lang === 'ar'
          ? 'مرحباً مطعم كبدة إسكندراني، أود الاستفسار والطلب من قائمة الطعام 🍽️'
          : 'Hello Alexandrian Liver Restaurant, I would like to order from the menu 🍽️'
      );
      window.open(`https://wa.me/${rawPhone}?text=${msg}`, '_blank');
    }
  };

  // Featured / Most Popular items for landing page highlights
  const featuredItems = useMemo(() => {
    return menuItems.filter((i) => i.isPublished && i.isFeatured);
  }, [menuItems]);

  // Featured split highlight category (e.g. Platters / Sandwiches / Grills)
  const featuredSplitCategory = useMemo(() => {
    return (
      categories.find((c) => c.id === 'dishes-plates' && c.isPublished) ||
      categories.find((c) => c.id === 'sandwiches' && c.isPublished) ||
      categories.find((c) => c.id === 'grills' && c.isPublished) ||
      categories.find((c) => c.isPublished)
    );
  }, [categories]);

  const featuredSplitItems = useMemo(() => {
    if (!featuredSplitCategory) return [];
    const catItems = menuItems.filter(
      (i) => i.categoryId === featuredSplitCategory.id && i.isPublished
    );
    return catItems.length > 0 ? catItems : featuredItems;
  }, [featuredSplitCategory, menuItems, featuredItems]);

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
    window.location.hash = 'admin';
    if (!isAdmin) {
      setIsLoginModalOpen(true);
    } else {
      setViewMode('admin');
    }
  };

  const handleExitAdmin = () => {
    setViewMode('public');
    if (window.location.hash === '#admin') {
      window.history.pushState(null, '', window.location.pathname + window.location.search);
    }
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
              orders={orders}
              items={menuItems}
              categories={categories}
              analytics={analytics}
              onNavigateTab={setAdminTab}
              lang={lang}
            />
          )}

          {adminTab === 'orders' && (
            <AdminOrders lang={lang} />
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

          {adminTab === 'shater' && (
            <AdminShater orders={orders} lang={lang} />
          )}

          {(adminTab === 'marketing' ||
            adminTab === 'tracking' ||
            adminTab === 'wallet' ||
            adminTab === 'funnels' ||
            adminTab === 'services') && (
            <AdminMarketing
              orders={orders}
              activeSubTab={adminTab as any}
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

          {(adminTab === 'qrcode' || adminTab === 'qr') && (
            <AdminQRCode settings={settings} lang={lang} />
          )}

          {(adminTab === 'data' || adminTab === 'apps') && (
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
        /* PUBLIC DIGITAL MENU VIEW - Official Alexandria Paper Menu Identity */
        <div className="flex-1 flex flex-col bg-[#FAF6ED] min-h-screen text-[#261309]">
          {/* 1. Header (Announcement + Main Red Header + Categories Subnav) */}
          <EasyOrderHeader
            settings={settings}
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={(id) => {
              setSelectedCategoryId(id);
              if (searchQuery) setSearchQuery('');
            }}
            itemCountsByCategory={itemCountsByCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            cartItems={cartItems}
            onOpenCart={() => setIsCartOpen(true)}
            lang={lang}
            onToggleLang={handleToggleLang}
            onNavigateToAdmin={handleNavigateToAdmin}
          />

          {/* 2. Hero Slider Banner (Displayed when on 'all' and not searching) */}
          {!searchQuery.trim() && selectedCategoryId === 'all' && (
            <EasyOrderHeroSlider
              lang={lang}
              onSelectCategory={(catId) => {
                setSelectedCategoryId(catId);
                const el = document.getElementById(`cat-section-${catId}`);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          )}

          {/* 3. Visual Categories Carousel (Large Square Cards) */}
          {!searchQuery.trim() && (
            <EasyOrderCategoryCarousel
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={(id) => {
                setSelectedCategoryId(id);
                if (id !== 'all') {
                  const el = document.getElementById(`cat-section-${id}`);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              lang={lang}
              itemCountsByCategory={itemCountsByCategory}
            />
          )}

          {/* 4. Featured Split Layout: "الأكثر مبيعاً" (When on 'all' and not searching) */}
          {!searchQuery.trim() &&
            selectedCategoryId === 'all' &&
            featuredSplitCategory &&
            featuredSplitItems.length > 0 && (
              <EasyOrderFeaturedSplit
                category={featuredSplitCategory}
                items={featuredSplitItems}
                lang={lang}
                onSelectCategory={(id) => setSelectedCategoryId(id)}
                onSelectItem={setSelectedDetailItem}
                onAddToCart={(it) => handleAddToCart(it, undefined, 1, false)}
                onUpdateQuantity={handleUpdateCardQuantity}
                cartItemCounts={cartItemCounts}
              />
            )}

          {/* 5. Main Product Grids by Category */}
          <main className="flex-1 max-w-6xl mx-auto px-3 sm:px-6 py-6 w-full pb-28">
            {/* Active Search Notification Banner */}
            {searchQuery.trim() && (
              <div className="mb-5 bg-white p-3.5 rounded-2xl border border-gray-200 shadow-2xs flex items-center justify-between">
                <div className="text-xs sm:text-sm font-bold text-gray-800">
                  {lang === 'ar' ? 'نتائج البحث عن:' : 'Search results for:'}{' '}
                  <span className="text-[#8B2220] font-black">"{searchQuery}"</span>
                </div>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs font-bold text-gray-500 hover:text-[#8B2220] cursor-pointer"
                >
                  {lang === 'ar' ? 'إلغاء البحث' : 'Clear search'}
                </button>
              </div>
            )}

            {groupedPublicCategories.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 max-w-md mx-auto my-6 shadow-xs">
                <div className="w-16 h-16 rounded-full bg-[#FFF9EF] text-[#8B2220] flex items-center justify-center mx-auto mb-3 border border-[#E8D8B5]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-base sm:text-lg font-black text-gray-900">
                  {lang === 'ar' ? 'لم يتم العثور على وجبات مطابقة' : 'No menu items found'}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {lang === 'ar'
                    ? 'جرب البحث بكلمة مختلفة أو اختر قسماً آخر من الأعلى'
                    : 'Try searching for something else or pick another category'}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategoryId('all');
                  }}
                  className="mt-4 px-4 py-2 bg-[#8B2220] text-white rounded-xl text-xs font-bold hover:bg-[#721B19] transition cursor-pointer shadow-xs"
                >
                  {lang === 'ar' ? 'عرض جميع الأصناف' : 'Show All Items'}
                </button>
              </div>
            ) : (
              <div className="space-y-8 sm:space-y-10">
                {groupedPublicCategories.map(({ category, items }) => (
                  <section
                    key={category.id}
                    id={`cat-section-${category.id}`}
                    className="scroll-mt-36"
                  >
                    {/* Section Header */}
                    <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-[#E0CFAB]">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-5 bg-[#B81D22] rounded-full shadow-xs" />
                        <h2 className="text-base sm:text-xl font-black text-[#261309] font-['Cairo']">
                          {lang === 'ar' ? category.nameAr : category.nameEn}
                        </h2>
                        <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#FFF8E6] text-[#6A472E] border border-[#DEC495]">
                          {items.length} {lang === 'ar' ? 'وجبة' : 'items'}
                        </span>
                      </div>
                    </div>

                    {/* 4-Column Responsive Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
                      {items.map((item) => (
                        <EasyOrderProductCard
                          key={item.id}
                          item={item}
                          lang={lang}
                          onSelect={setSelectedDetailItem}
                          onAddToCart={(it) => handleAddToCart(it, undefined, 1, false)}
                          onUpdateQuantity={handleUpdateCardQuantity}
                          cartQuantity={cartItemCounts[item.id] || 0}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </main>

          {/* Product Detail Modal (for selecting sizes/variants) */}
          <ProductDetailModal
            item={selectedDetailItem}
            onClose={() => setSelectedDetailItem(null)}
            lang={lang}
            onAddToCart={(it, variant, qty) => {
              handleAddToCart(it, variant, qty, false);
              setSelectedDetailItem(null);
            }}
            enableOrdering={settings.enableWhatsappOrdering}
          />

          {/* Slide-over Left Cart Drawer */}
          <EasyOrderCartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveCartItem}
            onClearCart={handleClearCart}
            settings={settings}
            lang={lang}
          />

          {/* Floating Bottom Cart Bar (Prompt on mobile / desktop when items exist) */}
          {!isCartOpen && cartItems.length > 0 && (
            <div className="fixed bottom-4 inset-x-3 sm:inset-x-auto sm:end-6 sm:w-[420px] z-30 animate-in slide-in-from-bottom duration-300">
              <div
                onClick={() => setIsCartOpen(true)}
                className="bg-gradient-to-r from-[#B81D22] to-[#921317] hover:from-[#921317] hover:to-[#730F12] active:scale-98 text-[#FFF9EA] p-3 sm:p-3.5 rounded-2xl shadow-xl flex items-center justify-between cursor-pointer border-2 border-[#EEA323] transition transform ring-4 ring-[#B81D22]/20"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#FFF9EF] text-[#B81D22] flex items-center justify-center shrink-0 shadow-xs border border-[#EEA323]/50">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black">
                        {cartItems.reduce((acc, curr) => acc + curr.quantity, 0)} {lang === 'ar' ? 'أصناف مختارة' : 'items'}
                      </span>
                      <span className="text-[10px] opacity-75">•</span>
                      <span className="text-xs sm:text-sm font-black font-mono">
                        {formatBaisaToOmr(
                          cartItems.reduce((acc, curr) => {
                            const unitPrice = curr.selectedVariant
                              ? curr.selectedVariant.priceBaisa
                              : curr.item.basePriceBaisa;
                            return acc + unitPrice * curr.quantity;
                          }, 0),
                          lang
                        )}
                      </span>
                    </div>
                    <span className="text-[10px] text-amber-200 block font-medium">
                      {lang === 'ar' ? 'اضغط لعرض السلة وإتمام الطلب' : 'Tap to review cart and order'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-[#FFF9EF] text-[#B81D22] px-3 py-1.5 rounded-xl text-xs font-black shadow-xs shrink-0 border border-[#EEA323]/50">
                  <span>{lang === 'ar' ? 'سلة التسوق' : 'View Cart'}</span>
                  <span className="rtl:rotate-180 text-[10px]">❯</span>
                </div>
              </div>
            </div>
          )}

          {/* Store Footer */}
          <Footer
            settings={settings}
            lang={lang}
            onNavigateToAdmin={handleNavigateToAdmin}
          />
        </div>
      )}

      {/* Admin Login Modal with Username & Password verification */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        configuredUsername={settings.adminUsername || 'admin'}
        configuredPassword={settings.adminPassword || 'alex2024'}
        configuredPin={settings.adminPinCode || '1973'}
        onSuccess={() => {
          setViewMode('admin');
          window.location.hash = 'admin';
        }}
        onClose={() => {
          setIsLoginModalOpen(false);
          if (isAdmin) {
            setViewMode('admin');
          } else {
            if (window.location.hash === '#admin') {
              window.history.pushState(null, '', window.location.pathname + window.location.search);
            }
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
