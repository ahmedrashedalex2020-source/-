import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  writeBatch,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, auth } from '../lib/firebase';
import { Category, MenuItem, RestaurantSettings, AuditLog, CustomerOrder } from '../types/menu';
import { INITIAL_CATEGORIES, INITIAL_MENU_ITEMS, DEFAULT_RESTAURANT_SETTINGS } from '../data/initialData';

const CATEGORIES_COL = 'categories';
const ITEMS_COL = 'menuItems';
const SETTINGS_COL = 'restaurantSettings';
const LOGS_COL = 'auditLogs';
const ORDERS_COL = 'orders';
const LS_ORDERS = 'alex_liver_orders_v1';

// Local storage backup keys
const LS_ITEMS = 'alex_liver_items_v1';
const LS_CATS = 'alex_liver_cats_v1';
const LS_SETTINGS = 'alex_liver_settings_v1';

function getLocal<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setLocal<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage save failed:', e);
  }
}

/**
 * Bootstrap and seed Firestore if initial collections are empty
 */
export async function ensureDatabaseInitialized(): Promise<void> {
  try {
    const categoriesSnapshot = await getDocs(collection(db, CATEGORIES_COL));
    if (categoriesSnapshot.empty) {
      console.log('جاري تهيئة ونقل أصناف كبدة إسكندراني لقاعدة البيانات...');
      const batch = writeBatch(db);

      // Seed categories
      for (const cat of INITIAL_CATEGORIES) {
        const catRef = doc(db, CATEGORIES_COL, cat.id);
        batch.set(catRef, {
          ...cat,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      // Seed menu items
      for (const item of INITIAL_MENU_ITEMS) {
        const itemRef = doc(db, ITEMS_COL, item.id);
        batch.set(itemRef, {
          ...item,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      // Seed default settings
      const settingsRef = doc(db, SETTINGS_COL, 'default');
      batch.set(settingsRef, {
        ...DEFAULT_RESTAURANT_SETTINGS,
        updatedAt: new Date().toISOString(),
      });

      // Audit log entry
      const logRef = doc(db, LOGS_COL, `init_${Date.now()}`);
      batch.set(logRef, {
        id: `init_${Date.now()}`,
        actorEmail: auth.currentUser?.email || 'admin@alexandrianliver.om',
        action: 'تهيئة_قاعدة_البيانات',
        entityType: 'import',
        details: 'تم استخراج وحفظ أصناف قائمة كبدة إسكندراني الـ 17 بنجاح في Firestore.',
        timestamp: new Date().toISOString(),
      });

      await batch.commit();
      setLocal(LS_ITEMS, INITIAL_MENU_ITEMS);
      setLocal(LS_CATS, INITIAL_CATEGORIES);
      setLocal(LS_SETTINGS, DEFAULT_RESTAURANT_SETTINGS);
      console.log('تمت تهيئة قاعدة البيانات بنجاح.');
    } else {
      // Ensure settings exists and enableWhatsappOrdering is true
      const settingsSnap = await getDoc(doc(db, SETTINGS_COL, 'default'));
      if (!settingsSnap.exists()) {
        await setDoc(doc(db, SETTINGS_COL, 'default'), {
          ...DEFAULT_RESTAURANT_SETTINGS,
          enableWhatsappOrdering: true,
          updatedAt: new Date().toISOString(),
        });
      } else {
        const data = settingsSnap.data() as RestaurantSettings;
        const updates: Partial<RestaurantSettings> = {};
        if (!data.enableWhatsappOrdering) {
          updates.enableWhatsappOrdering = true;
        }
        if (!data.publicMenuUrl || data.publicMenuUrl.includes('localhost') || !data.publicMenuUrl.includes('kebdaaskndrany')) {
          updates.publicMenuUrl = 'https://kebdaaskndrany.ct.ws';
        }
        if (!data.adminUsername) {
          updates.adminUsername = 'admin';
        }
        if (!data.adminPassword) {
          updates.adminPassword = 'alex2024';
        }
        if (!data.adminPinCode) {
          updates.adminPinCode = '1973';
        }
        if (Object.keys(updates).length > 0) {
          await updateDoc(doc(db, SETTINGS_COL, 'default'), {
            ...updates,
            updatedAt: new Date().toISOString(),
          });
        }
      }
    }
  } catch (error) {
    console.warn('ملاحظة أثناء تهيئة قاعدة البيانات:', error);
  }
}

/**
 * Subscribe to real-time categories
 */
export function subscribeCategories(callback: (categories: Category[]) => void) {
  // First load from localStorage if exists
  const localCats = getLocal<Category[]>(LS_CATS);
  if (localCats && localCats.length > 0) {
    callback(localCats);
  }

  const q = query(collection(db, CATEGORIES_COL), orderBy('displayOrder', 'asc'));
  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        callback(localCats || INITIAL_CATEGORIES);
        return;
      }
      const data: Category[] = [];
      snapshot.forEach((doc) => {
        data.push(doc.data() as Category);
      });
      setLocal(LS_CATS, data);
      callback(data);
    },
    (error) => {
      console.warn('تنبيه قراءة الأقسام:', error);
      callback(localCats || INITIAL_CATEGORIES);
    }
  );
}

/**
 * Subscribe to real-time menu items
 */
export function subscribeMenuItems(callback: (items: MenuItem[]) => void) {
  // First load from localStorage if exists
  const localItems = getLocal<MenuItem[]>(LS_ITEMS);
  if (localItems && localItems.length > 0) {
    callback(localItems);
  }

  const q = query(collection(db, ITEMS_COL), orderBy('displayOrder', 'asc'));
  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        callback(localItems || INITIAL_MENU_ITEMS);
        return;
      }
      const data: MenuItem[] = [];
      snapshot.forEach((doc) => {
        data.push(doc.data() as MenuItem);
      });
      setLocal(LS_ITEMS, data);
      callback(data);
    },
    (error) => {
      console.warn('تنبيه قراءة الأصناف:', error);
      callback(localItems || INITIAL_MENU_ITEMS);
    }
  );
}

/**
 * Subscribe to real-time restaurant settings
 */
export function subscribeSettings(callback: (settings: RestaurantSettings) => void) {
  const localSett = getLocal<RestaurantSettings>(LS_SETTINGS);
  if (localSett) {
    callback(localSett);
  }

  const ref = doc(db, SETTINGS_COL, 'default');
  return onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) {
        const val = snap.data() as RestaurantSettings;
        setLocal(LS_SETTINGS, val);
        callback(val);
      } else {
        callback(localSett || DEFAULT_RESTAURANT_SETTINGS);
      }
    },
    (error) => {
      console.warn('تنبيه إعدادات المطعم:', error);
      callback(localSett || DEFAULT_RESTAURANT_SETTINGS);
    }
  );
}

/**
 * Subscribe to audit logs
 */
export function subscribeAuditLogs(callback: (logs: AuditLog[]) => void) {
  const q = query(collection(db, LOGS_COL), orderBy('timestamp', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const data: AuditLog[] = [];
      snapshot.forEach((doc) => {
        data.push(doc.data() as AuditLog);
      });
      callback(data);
    },
    (error) => {
      console.warn('سجل العمليات:', error);
      callback([]);
    }
  );
}

/**
 * Create an audit log entry
 */
export async function logAdminAction(
  action: string,
  entityType: 'menuItem' | 'category' | 'settings' | 'import',
  entityId: string,
  details: string
): Promise<void> {
  try {
    const id = `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const logData: AuditLog = {
      id,
      actorId: auth.currentUser?.uid || 'admin',
      actorEmail: auth.currentUser?.email || 'ahmedrashedalex2020@gmail.com',
      action,
      entityType,
      entityId,
      details,
      timestamp: new Date().toISOString(),
    };
    await setDoc(doc(db, LOGS_COL, id), logData);
  } catch (error) {
    console.warn('تعذر تسجيل العملية في السجل:', error);
  }
}

/**
 * Menu Item CRUD with dual persistence & optimistic updates
 */
export async function saveMenuItem(item: MenuItem, isNew: boolean = false): Promise<void> {
  const now = new Date().toISOString();
  const payload: MenuItem = {
    ...item,
    updatedAt: now,
    ...(isNew ? { createdAt: now } : {}),
  };

  // Update local storage backup immediately
  const existing = getLocal<MenuItem[]>(LS_ITEMS) || INITIAL_MENU_ITEMS;
  const filtered = existing.filter((i) => i.id !== item.id);
  setLocal(LS_ITEMS, [...filtered, payload].sort((a, b) => a.displayOrder - b.displayOrder));

  // Write to Firestore
  try {
    const itemRef = doc(db, ITEMS_COL, item.id);
    await setDoc(itemRef, payload, { merge: true });
    await logAdminAction(
      isNew ? 'إضافة_صنف' : 'تعديل_صنف_وسعر',
      'menuItem',
      item.id,
      `تم ${isNew ? 'إضافة' : 'تحديث'} صنف "${item.nameAr}" بسعر ${(item.basePriceBaisa / 1000).toFixed(3)} ر.ع`
    );
  } catch (error) {
    console.error('Firestore saveMenuItem error:', error);
    // Don't throw to prevent breaking optimistic UI
  }
}

export async function deleteMenuItem(itemId: string, itemName: string): Promise<void> {
  // Update local storage
  const existing = getLocal<MenuItem[]>(LS_ITEMS) || INITIAL_MENU_ITEMS;
  setLocal(LS_ITEMS, existing.filter((i) => i.id !== itemId));

  try {
    await deleteDoc(doc(db, ITEMS_COL, itemId));
    await logAdminAction('حذف_صنف', 'menuItem', itemId, `تم حذف صنف "${itemName}"`);
  } catch (error) {
    console.error('Firestore delete error:', error);
  }
}

export async function toggleItemAvailability(itemId: string, isAvailable: boolean): Promise<void> {
  // Update local storage
  const existing = getLocal<MenuItem[]>(LS_ITEMS) || INITIAL_MENU_ITEMS;
  setLocal(
    LS_ITEMS,
    existing.map((i) => (i.id === itemId ? { ...i, isAvailable } : i))
  );

  try {
    await updateDoc(doc(db, ITEMS_COL, itemId), {
      isAvailable,
      updatedAt: new Date().toISOString(),
    });
    await logAdminAction(
      'تغيير_حالة_التوفر',
      'menuItem',
      itemId,
      `تم تغيير حالة توفر الصنف إلى: ${isAvailable ? 'متوفر' : 'نافذ'}`
    );
  } catch (error) {
    console.warn('Firestore toggle availability:', error);
  }
}

export async function toggleItemPublished(itemId: string, isPublished: boolean): Promise<void> {
  const existing = getLocal<MenuItem[]>(LS_ITEMS) || INITIAL_MENU_ITEMS;
  setLocal(
    LS_ITEMS,
    existing.map((i) => (i.id === itemId ? { ...i, isPublished } : i))
  );

  try {
    await updateDoc(doc(db, ITEMS_COL, itemId), {
      isPublished,
      updatedAt: new Date().toISOString(),
    });
    await logAdminAction(
      'تغيير_حالة_النشر',
      'menuItem',
      itemId,
      `تم تغيير حالة النشر إلى: ${isPublished ? 'منشور للزبائن' : 'مسودة مخفية'}`
    );
  } catch (error) {
    console.warn('Firestore toggle publish:', error);
  }
}

/**
 * Category CRUD
 */
export async function saveCategory(category: Category, isNew: boolean = false): Promise<void> {
  const now = new Date().toISOString();
  const payload: Category = {
    ...category,
    updatedAt: now,
    ...(isNew ? { createdAt: now } : {}),
  };

  const existing = getLocal<Category[]>(LS_CATS) || INITIAL_CATEGORIES;
  const filtered = existing.filter((c) => c.id !== category.id);
  setLocal(LS_CATS, [...filtered, payload].sort((a, b) => a.displayOrder - b.displayOrder));

  try {
    const catRef = doc(db, CATEGORIES_COL, category.id);
    await setDoc(catRef, payload, { merge: true });
    await logAdminAction(
      isNew ? 'إضافة_قسم' : 'تعديل_قسم',
      'category',
      category.id,
      `تم ${isNew ? 'إضافة' : 'تعديل'} قسم "${category.nameAr}"`
    );
  } catch (error) {
    console.warn('Firestore saveCategory:', error);
  }
}

export async function deleteCategory(categoryId: string, categoryName: string): Promise<void> {
  const existing = getLocal<Category[]>(LS_CATS) || INITIAL_CATEGORIES;
  setLocal(LS_CATS, existing.filter((c) => c.id !== categoryId));

  try {
    await deleteDoc(doc(db, CATEGORIES_COL, categoryId));
    await logAdminAction('حذف_قسم', 'category', categoryId, `تم حذف قسم "${categoryName}"`);
  } catch (error) {
    console.warn('Firestore deleteCategory:', error);
  }
}

/**
 * Update Restaurant Settings
 */
export async function saveRestaurantSettings(settings: RestaurantSettings): Promise<void> {
  setLocal(LS_SETTINGS, settings);
  try {
    const ref = doc(db, SETTINGS_COL, 'default');
    await setDoc(ref, {
      ...settings,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    await logAdminAction(
      'تحديث_بيانات_المطعم',
      'settings',
      'default',
      'تم تحديث أرقام التواصل والعناوين وإعدادات الطلب'
    );
  } catch (error) {
    console.warn('Firestore saveSettings:', error);
  }
}

/**
 * Bulk Import Items
 */
export async function bulkImportMenuItems(items: MenuItem[]): Promise<{ added: number; updated: number }> {
  setLocal(LS_ITEMS, items);
  try {
    const batch = writeBatch(db);
    let added = 0;
    const now = new Date().toISOString();

    for (const item of items) {
      const itemRef = doc(db, ITEMS_COL, item.id);
      batch.set(itemRef, {
        ...item,
        updatedAt: now,
      }, { merge: true });
      added++;
    }

    await batch.commit();
    await logAdminAction('استيراد_جماعي', 'import', 'batch', `تم استيراد ${items.length} صنف`);
    return { added, updated: 0 };
  } catch (error) {
    console.warn('Firestore bulk import:', error);
    return { added: items.length, updated: 0 };
  }
}

/**
 * Customer Orders (Save order to Firestore & local storage, write audit log)
 */
export async function saveCustomerOrder(order: CustomerOrder): Promise<boolean> {
  const localOrders = getLocal<CustomerOrder[]>(LS_ORDERS) || [];
  setLocal(LS_ORDERS, [order, ...localOrders].slice(0, 100));

  try {
    const orderRef = doc(db, ORDERS_COL, order.id);
    await setDoc(orderRef, order);
    await logAdminAction(
      'طلب_زبون_جديد',
      'import',
      order.id,
      `طلب جديد من ${order.customerName} بقيمة ${(order.totalBaisa / 1000).toFixed(3)} ر.ع (${order.items.length} وجبة)`
    );
    return true;
  } catch (error) {
    console.warn('Firestore saveCustomerOrder:', error);
    return true; // Saved locally as backup
  }
}

export function subscribeOrders(callback: (orders: CustomerOrder[]) => void): () => void {
  try {
    const q = query(collection(db, ORDERS_COL), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: CustomerOrder[] = [];
          snapshot.forEach((d) => list.push(d.data() as CustomerOrder));
          setLocal(LS_ORDERS, list);
          callback(list);
        } else {
          callback(getLocal<CustomerOrder[]>(LS_ORDERS) || []);
        }
      },
      (error) => {
        console.warn('subscribeOrders listener error:', error);
        callback(getLocal<CustomerOrder[]>(LS_ORDERS) || []);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('subscribeOrders setup error:', err);
    callback(getLocal<CustomerOrder[]>(LS_ORDERS) || []);
    return () => {};
  }
}

/**
 * Update Customer Order Status
 */
export async function updateOrderStatus(
  orderId: string,
  newStatus: CustomerOrder['status']
): Promise<void> {
  const localOrders = getLocal<CustomerOrder[]>(LS_ORDERS) || [];
  const updatedLocal = localOrders.map((o) =>
    o.id === orderId ? { ...o, status: newStatus } : o
  );
  setLocal(LS_ORDERS, updatedLocal);

  try {
    const orderRef = doc(db, ORDERS_COL, orderId);
    await updateDoc(orderRef, { status: newStatus });
    await logAdminAction(
      'تحديث_حالة_طلب',
      'import',
      orderId,
      `تم تحديث حالة الطلب إلى: ${newStatus}`
    );
  } catch (error) {
    console.warn('Firestore updateOrderStatus error:', error);
  }
}

/**
 * Delete Customer Order
 */
export async function deleteCustomerOrder(orderId: string): Promise<void> {
  const localOrders = getLocal<CustomerOrder[]>(LS_ORDERS) || [];
  setLocal(LS_ORDERS, localOrders.filter((o) => o.id !== orderId));

  try {
    const orderRef = doc(db, ORDERS_COL, orderId);
    await deleteDoc(orderRef);
    await logAdminAction('حذف_طلب', 'import', orderId, `تم حذف الطلب رقم ${orderId}`);
  } catch (error) {
    console.warn('Firestore deleteCustomerOrder error:', error);
  }
}

/**
 * Clear all completed or cancelled orders
 */
export async function clearAllOrders(): Promise<void> {
  setLocal(LS_ORDERS, []);
  try {
    const snapshot = await getDocs(collection(db, ORDERS_COL));
    const batch = writeBatch(db);
    snapshot.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
    await logAdminAction('مسح_سجل_الطلبات', 'import', 'batch', 'تم تفريغ أرشيف الطلبات بالكامل');
  } catch (error) {
    console.warn('Firestore clearAllOrders error:', error);
  }
}

/**
 * Store Analytics & Conversion Tracking
 */
export interface StoreAnalytics {
  visits: number;
  cartAdditions: number;
  checkoutStarts: number;
  crossSellAdditions: number;
  lostOrders: number;
  updatedAt?: string;
}

const ANALYTICS_COL = 'analytics';
const ANALYTICS_DOC = 'overview';
const LS_ANALYTICS = 'alex_liver_analytics_v1';

const DEFAULT_ANALYTICS: StoreAnalytics = {
  visits: 0,
  cartAdditions: 0,
  checkoutStarts: 0,
  crossSellAdditions: 0,
  lostOrders: 0,
};

export function subscribeAnalytics(callback: (analytics: StoreAnalytics) => void): () => void {
  const cached = getLocal<StoreAnalytics>(LS_ANALYTICS) || DEFAULT_ANALYTICS;
  callback(cached);

  try {
    const docRef = doc(db, ANALYTICS_COL, ANALYTICS_DOC);
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as StoreAnalytics;
          setLocal(LS_ANALYTICS, data);
          callback(data);
        } else {
          setDoc(docRef, { ...DEFAULT_ANALYTICS, updatedAt: new Date().toISOString() }).catch(() => {});
          callback(DEFAULT_ANALYTICS);
        }
      },
      (error) => {
        console.warn('Analytics onSnapshot warning:', error);
      }
    );
    return unsubscribe;
  } catch {
    return () => {};
  }
}

export async function incrementAnalyticsField(field: keyof Omit<StoreAnalytics, 'updatedAt'>, amount = 1): Promise<void> {
  const current = getLocal<StoreAnalytics>(LS_ANALYTICS) || DEFAULT_ANALYTICS;
  const updated: StoreAnalytics = {
    ...current,
    [field]: (current[field] || 0) + amount,
    updatedAt: new Date().toISOString(),
  };
  setLocal(LS_ANALYTICS, updated);

  try {
    const docRef = doc(db, ANALYTICS_COL, ANALYTICS_DOC);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const liveData = snap.data() as StoreAnalytics;
      const nextVal = (liveData[field] || 0) + amount;
      await updateDoc(docRef, { [field]: nextVal, updatedAt: new Date().toISOString() });
    } else {
      await setDoc(docRef, updated);
    }
  } catch (e) {
    console.warn('incrementAnalyticsField failed:', e);
  }
}

export function trackStoreVisit(): void {
  const sessionKey = 'alex_visit_tracked_session';
  if (!sessionStorage.getItem(sessionKey)) {
    sessionStorage.setItem(sessionKey, '1');
    incrementAnalyticsField('visits', 1);
  }
}

export function trackCartAddition(): void {
  incrementAnalyticsField('cartAdditions', 1);
}

export function trackCheckoutStart(): void {
  incrementAnalyticsField('checkoutStarts', 1);
}

export function trackCrossSellAddition(): void {
  incrementAnalyticsField('crossSellAdditions', 1);
}


