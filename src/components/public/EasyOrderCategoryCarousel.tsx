import React, { useRef } from 'react';
import { Category } from '../../types/menu';
import { CATEGORY_IMAGES } from '../../utils/foodImageResolver';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface EasyOrderCategoryCarouselProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  lang: 'ar' | 'en';
  itemCountsByCategory: Record<string, number>;
}

export const EasyOrderCategoryCarousel: React.FC<EasyOrderCategoryCarouselProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  lang,
  itemCountsByCategory,
}) => {
  const isAr = lang === 'ar';
  const carouselRef = useRef<HTMLDivElement>(null);

  const publishedCategories = categories.filter((c) => c.isPublished);

  const scroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const offset = 220;
    const delta = direction === 'left' ? -offset : offset;
    carouselRef.current.scrollBy({ left: delta, behavior: 'smooth' });
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6 select-none">
      {/* Section Header with Navigation Arrows */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-4.5 bg-[#B81D22] rounded-full shadow-xs" />
          <h3 className="text-base sm:text-lg font-black text-[#261309] font-['Cairo']">
            {isAr ? 'أقسام وتصنيفات الطعام' : 'Menu Categories'}
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scroll(isAr ? 'right' : 'left')}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FFFDF8] border-2 border-[#D4AA58] hover:bg-[#EEA323] hover:text-[#261309] shadow-xs flex items-center justify-center transition cursor-pointer text-[#261309] active:scale-95"
            aria-label="Previous categories"
          >
            {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
          <button
            onClick={() => scroll(isAr ? 'left' : 'right')}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FFFDF8] border-2 border-[#D4AA58] hover:bg-[#EEA323] hover:text-[#261309] shadow-xs flex items-center justify-center transition cursor-pointer text-[#261309] active:scale-95"
            aria-label="Next categories"
          >
            {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Categories Cards Carousel */}
      <div
        ref={carouselRef}
        className="flex gap-2.5 sm:gap-3.5 overflow-x-auto no-scrollbar scroll-smooth pb-2 pt-0.5"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* All Items Card */}
        <div
          onClick={() => onSelectCategory('all')}
          className={`shrink-0 w-24 sm:w-28 p-2 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-between group shadow-xs ${
            selectedCategoryId === 'all'
              ? 'bg-[#FFF8E6] border-[#B81D22] ring-2 ring-[#EEA323] shadow-md scale-102'
              : 'bg-[#FFFDF9] border-[#DEC495] hover:border-[#C89D4B] hover:shadow-sm'
          }`}
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-white flex items-center justify-center p-1 mb-1.5 border border-[#E5CE9F]">
            <img
              src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=200&q=80"
              alt="All items"
              className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition duration-300"
            />
          </div>
          <span
            className={`text-xs sm:text-sm font-black line-clamp-1 ${
              selectedCategoryId === 'all' ? 'text-[#B81D22]' : 'text-[#261309]'
            }`}
          >
            {isAr ? 'الكل' : 'All'}
          </span>
          <span className="text-[10px] text-[#6A472E] font-bold">
            {Object.values(itemCountsByCategory).reduce((a, b) => a + b, 0)} {isAr ? 'صنف' : 'items'}
          </span>
        </div>

        {publishedCategories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          const imageUrl = cat.imageUrl || CATEGORY_IMAGES[cat.id] || CATEGORY_IMAGES['sandwiches'];
          const count = itemCountsByCategory[cat.id] || 0;

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`shrink-0 w-24 sm:w-28 p-2 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-between group shadow-xs ${
                isSelected
                  ? 'bg-[#FFF8E6] border-[#B81D22] ring-2 ring-[#EEA323] shadow-md scale-102'
                  : 'bg-[#FFFDF9] border-[#DEC495] hover:border-[#C89D4B] hover:shadow-sm'
              }`}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-white flex items-center justify-center p-0.5 mb-1.5 border border-[#E5CE9F]">
                <img
                  src={imageUrl}
                  alt={isAr ? cat.nameAr : cat.nameEn}
                  className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition duration-300"
                  loading="lazy"
                />
              </div>
              <span
                className={`text-xs sm:text-sm font-black line-clamp-1 ${
                  isSelected ? 'text-[#B81D22]' : 'text-[#261309]'
                }`}
              >
                {isAr ? cat.nameAr : cat.nameEn}
              </span>
              <span className="text-[10px] text-[#6A472E] font-bold">
                {count} {isAr ? 'صنف' : 'items'}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
