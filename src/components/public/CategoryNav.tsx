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

  // Auto-scroll the active pill into view
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
  const totalPublishedItems = Object.values(itemCountsByCategory).reduce((a, b) => a + b, 0);

  return (
    <nav className="sticky top-[86px] sm:top-[94px] z-30 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#E8D8B5]/80 py-2 shadow-2xs transition-all">
      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* All Items Pill */}
          <button
            data-category-id="all"
            onClick={() => onSelectCategory('all')}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-black transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              selectedCategoryId === 'all'
                ? 'bg-[#8B1E1E] text-white shadow-sm ring-2 ring-[#8B1E1E]/20 scale-102'
                : 'bg-white text-[#5C3E2E] border border-[#E8D8B5] hover:border-[#8B1E1E]/40 hover:bg-[#FAF5EC]'
            }`}
          >
            <span>{isAr ? 'الكل' : 'All'}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                selectedCategoryId === 'all'
                  ? 'bg-[#D97706] text-white'
                  : 'bg-[#E8D8B5]/50 text-[#755947]'
              }`}
            >
              {totalPublishedItems}
            </span>
          </button>

          {publishedCategories.map((category) => {
            const isSelected = selectedCategoryId === category.id;
            const count = itemCountsByCategory[category.id] || 0;

            return (
              <button
                key={category.id}
                data-category-id={category.id}
                onClick={() => onSelectCategory(category.id)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-black transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#8B1E1E] text-white shadow-sm ring-2 ring-[#8B1E1E]/20 scale-102'
                    : 'bg-white text-[#5C3E2E] border border-[#E8D8B5] hover:border-[#8B1E1E]/40 hover:bg-[#FAF5EC]'
                }`}
              >
                <span>{isAr ? category.nameAr : category.nameEn}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold transition ${
                      isSelected
                        ? 'bg-[#D97706] text-white'
                        : 'bg-[#E8D8B5]/50 text-[#755947]'
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
