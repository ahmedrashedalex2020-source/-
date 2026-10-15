// Helper utility providing appetizing, high-resolution food images for all Alexandrian Liver dishes & categories

export const CATEGORY_IMAGES: Record<string, string> = {
  sandwiches: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=400&q=80',
  'shawarma-sandwiches': 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=400&q=80',
  burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
  'dishes-plates': 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80',
  appetizers: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=400&q=80',
  salad: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80',
  grills: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80',
  'ayoush-rice': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=400&q=80',
  salona: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=400&q=80',
  bread: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
  'fish-seafood': 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=400&q=80',
  manakish: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80',
  pastry: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281223?auto=format&fit=crop&w=400&q=80',
  juices: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=400&q=80',
  'cold-drinks': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80',
  'hot-drinks': 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=400&q=80',
  desserts: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80',
};

export const HERO_SLIDES = [
  {
    id: 'slide-1',
    titleAr: 'صواني وعروض كبدة إسكندراني العائلية',
    subtitleAr: 'طعم إسكندراني أصيل على أصوله مع السجق والتحابيش والخبز الطازج',
    titleEn: 'Alexandrian Family Platters & Feasts',
    subtitleEn: 'Original Alexandrian liver, sausage, fresh baked bread & appetizers',
    badgeAr: 'عرض خاص ومميز 🔥',
    badgeEn: 'Special Offer 🔥',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    categoryId: 'dishes-plates',
  },
  {
    id: 'slide-2',
    titleAr: 'مشاوي مشكلة فاخرة على الفحم',
    subtitleAr: 'كباب وكفتة وشيش طاووق وريش ضاني بتتبيلة سرية وشواء فوري',
    titleEn: 'Charcoal Mixed Grills',
    subtitleEn: 'Juicy kebabs, kofta, shish tawook & lamb chops grilled on live coals',
    badgeAr: 'الأكثر طلباً ⭐',
    badgeEn: 'Best Seller ⭐',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',
    categoryId: 'grills',
  },
  {
    id: 'slide-3',
    titleAr: 'سندوتشات كبدة وسجق وشاورما بلدي',
    subtitleAr: 'محضرة طازجة فور طلبك بالعيش الفينو أو البلدي مع الطحينة والفلفل الحار',
    titleEn: 'Signature Sandwiches & Shawarma',
    subtitleEn: 'Freshly prepared liver, sausage and shawarma with authentic tahini sauce',
    badgeAr: 'أصل الطعم 🌯',
    badgeEn: 'Authentic Taste 🌯',
    imageUrl: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=1200&q=80',
    categoryId: 'sandwiches',
  },
  {
    id: 'slide-4',
    titleAr: 'فطائر ومعجنات طازجة ومقرمشة',
    subtitleAr: 'حواوشي، فطائر باللحم والجبن، ومناقيش ساخنة من الفرن مباشرة',
    titleEn: 'Hot Oven Pies & Fresh Pastries',
    subtitleEn: 'Hawawshi, meat & cheese pies directly from the blazing oven',
    badgeAr: 'طازج من الفرن 🥧',
    badgeEn: 'Hot from Oven 🥧',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
    categoryId: 'manakish',
  },
];

export function getProductImageUrl(itemId: string, categoryId: string, customUrl?: string): string {
  if (customUrl && customUrl.trim().length > 5) {
    return customUrl.trim();
  }

  // Keyword-based accurate image mapping for signature dishes
  const id = itemId.toLowerCase();

  if (id.includes('liver') || id.includes('كبده') || id.includes('كبدة')) {
    if (id.includes('plate') || id.includes('dish') || id.includes('طبق') || id.includes('صحن')) {
      return 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80';
    }
    return 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=500&q=80';
  }

  if (id.includes('shawarma') || id.includes('شاورما')) {
    return 'https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=500&q=80';
  }

  if (id.includes('burger') || id.includes('برجر')) {
    return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80';
  }

  if (id.includes('grill') || id.includes('مشاوي') || id.includes('كباب') || id.includes('ريش') || id.includes('كفتة') || id.includes('طاووق')) {
    return 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=500&q=80';
  }

  if (id.includes('rice') || id.includes('برياني') || id.includes('مندي') || id.includes('عيوش') || id.includes('أرز')) {
    return 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=500&q=80';
  }

  if (id.includes('salona') || id.includes('صالونة') || id.includes('مرق') || id.includes('طاجن')) {
    return 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=500&q=80';
  }

  if (id.includes('fish') || id.includes('سمك') || id.includes('جمبري') || id.includes('روبيان') || id.includes('seafood')) {
    return 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=500&q=80';
  }

  if (id.includes('pie') || id.includes('فطير') || id.includes('مناقيش') || id.includes('manakish') || id.includes('حواوشي')) {
    return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80';
  }

  if (id.includes('salad') || id.includes('سلطة') || id.includes('متبل') || id.includes('طحينة') || id.includes('حمص')) {
    return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80';
  }

  if (id.includes('appetizer') || id.includes('بطاطس') || id.includes('فرايز') || id.includes('fries') || id.includes('سمبوسة')) {
    return 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=500&q=80';
  }

  if (id.includes('juice') || id.includes('عصير') || id.includes('مانجو') || id.includes('كوكتيل') || id.includes('ليمون')) {
    return 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=500&q=80';
  }

  if (id.includes('drink') || id.includes('بيبسي') || id.includes('كولا') || id.includes('مشروب') || id.includes('ماء')) {
    return 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=80';
  }

  if (id.includes('tea') || id.includes('coffee') || id.includes('شاي') || id.includes('قهوة') || id.includes('كرك')) {
    return 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=500&q=80';
  }

  if (id.includes('sweet') || id.includes('dessert') || id.includes('حلو') || id.includes('كنافة') || id.includes('بسبوسة') || id.includes('أم علي')) {
    return 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=80';
  }

  // Fallback to Category image
  if (CATEGORY_IMAGES[categoryId]) {
    return CATEGORY_IMAGES[categoryId];
  }

  // General delicious food fallback
  return 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=500&q=80';
}
