export type ExtractionStatus = 'verified' | 'needs_review' | 'missing_price' | 'draft';

export interface ProductVariant {
  id: string;
  nameAr: string;
  nameEn: string;
  priceBaisa: number; // in baisa (1000 baisa = 1.000 OMR)
  isAvailable: boolean;
  displayOrder: number;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  imageUrl?: string;
  basePriceBaisa: number; // in baisa (1000 baisa = 1.000 OMR)
  hasVariants: boolean;
  variants?: ProductVariant[];
  portionDetailsAr?: string;
  portionDetailsEn?: string;
  accompanimentsAr?: string;
  accompanimentsEn?: string;
  isAvailable: boolean;
  isFeatured?: boolean;
  isPublished: boolean;
  displayOrder: number;
  
  // Extraction & Verification Audit Fields
  extractionStatus: ExtractionStatus;
  sourceImage: 'Image 1' | 'Image 2' | 'Image 3' | 'Manual';
  originalCategoryName?: string;
  originalPriceText?: string;
  adminNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  imageUrl?: string;
  displayOrder: number;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RestaurantSettings {
  id: string;
  nameAr: string;
  nameEn: string;
  logoUrl?: string;
  currency: string; // "OMR"
  addressAr: string;
  addressEn: string;
  phone: string;
  whatsapp: string;
  instagram?: string;
  googleMapsUrl?: string;
  openingHoursAr?: string;
  openingHoursEn?: string;
  defaultLanguage: 'ar' | 'en';
  publicMenuUrl: string;
  enableWhatsappOrdering: boolean;
  heroTaglineAr?: string;
  heroTaglineEn?: string;
  updatedAt?: string;
}

export interface AuditLog {
  id: string;
  actorId?: string;
  actorEmail: string;
  action: string;
  entityType: 'menuItem' | 'category' | 'settings' | 'import';
  entityId?: string;
  details: string;
  timestamp: string;
}

export interface CartItem {
  item: MenuItem;
  selectedVariant?: ProductVariant;
  quantity: number;
  notes?: string;
}

/**
 * Converts integer baisa to standard 3-decimal OMR string.
 * e.g., 500 -> "0.500 OMR", 1200 -> "1.200 OMR", 10000 -> "10.000 OMR"
 */
export function formatBaisaToOmr(baisa: number, locale: 'ar' | 'en' = 'en'): string {
  if (isNaN(baisa) || baisa < 0) return locale === 'ar' ? '٠٫٠٠٠ ر.ع' : '0.000 OMR';
  const omrValue = (baisa / 1000).toFixed(3);
  if (locale === 'ar') {
    return `${omrValue} ر.ع`;
  }
  return `${omrValue} OMR`;
}

/**
 * Converts OMR string or float to integer baisa safely.
 * e.g. "0.500" -> 500, "1.2" -> 1200, 1.5 -> 1500
 */
export function parseOmrToBaisa(omrInput: string | number): number {
  if (typeof omrInput === 'number') {
    return Math.round(omrInput * 1000);
  }
  const cleanStr = (omrInput || '').toString().replace(/[^0-9.]/g, '').trim();
  const parsed = parseFloat(cleanStr);
  if (isNaN(parsed) || parsed < 0) return 0;
  return Math.round(parsed * 1000);
}
