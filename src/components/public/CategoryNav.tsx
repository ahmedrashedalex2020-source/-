import React, { useRef, useEffect } from 'react';
import { Category } from '../../types/menu';

interface CategoryNavProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  lang: 'ar' | 'en';
  itemCountsByCategory: Record<string, number>;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  lang,
  itemCountsByCategory,
}) => {
  const isAr = lang === 'ar';
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll active tab into view
  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const activeElement = scrollContainerRef.current.querySelector(
      `[data-category-id="${selectedCategoryId}"]`
    ) as HTMLElement;
    if (activeElement) {
      activeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [selectedCategoryId]);

  const publishedCategories = categories.filter((c) => c.isPublished);

  return (
    <nav className="sticky top-18 sm:top-20 z-30 bg-[#FFF9EF]/95 backdrop-blur-md border-b border-[#E8D8B5] py-2.5 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* All Items Pill */}
          <button
            data-category-id="all"
            onClick={() => onSelectCategory('all')}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              selectedCategoryId === 'all'
                ? 'bg-[#A1312E] text-white shadow-xs scale-102'
                : 'bg-white text-[#755947] border border-[#E8D8B5] hover:border-[#C58D38] hover:bg-[#F6ECD5]/40'
            }`}
          >
            <span>{isAr ? 'جميع الأقسام' : 'All Menu'}</span>
          </button>

          {publishedCategories.map((category) => {
            const isSelected = selectedCategoryId === category.id;
            const count = itemCountsByCategory[category.id] || 0;

            return (
              <button
                key={category.id}
                data-category-id={category.id}
                onClick={() => onSelectCategory(category.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#A1312E] text-white shadow-xs scale-102 ring-2 ring-[#C58D38]/30'
                    : 'bg-white text-[#755947] border border-[#E8D8B5] hover:border-[#C58D38] hover:bg-[#F6ECD5]/40'
                }`}
              >
                <span>{isAr ? category.nameAr : category.nameEn}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold transition ${
                      isSelected
                        ? 'bg-[#C58D38] text-white'
                        : 'bg-[#E8D8B5]/60 text-[#755947]'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
