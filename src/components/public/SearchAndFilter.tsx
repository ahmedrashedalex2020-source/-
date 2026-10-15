import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  lang: 'ar' | 'en';
  onClear: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchQuery,
  onSearchChange,
  lang,
  onClear,
  isOpen,
  onClose,
}) => {
  const isAr = lang === 'ar';

  if (!isOpen && !searchQuery) return null;

  return (
    <div className="bg-[#F6ECD5]/70 border-b border-[#E8D8B5] py-3 px-4 sm:px-6 transition-all">
      <div className="max-w-3xl mx-auto flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute ltr:left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2 text-[#755947]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              isAr
                ? 'ابحث باسم الوجبة، الشاورما، المشاوي، العيوش، العصائر...'
                : 'Search by dish name, shawarma, grills, rice, juices...'
            }
            className="w-full bg-white border border-[#C58D38]/50 focus:border-[#A1312E] focus:ring-2 focus:ring-[#A1312E]/20 text-[#392A23] rounded-xl ltr:pl-11 ltr:pr-10 rtl:pr-11 rtl:pl-10 py-2.5 text-sm outline-hidden placeholder:text-[#755947]/50 shadow-2xs"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={onClear}
              className="absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2 p-1 text-[#755947] hover:text-[#A1312E]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          onClick={onClose}
          className="p-2.5 bg-white border border-[#E8D8B5] hover:bg-[#FFF9EF] text-[#755947] rounded-xl text-xs font-bold transition"
        >
          {isAr ? 'إغلاق' : 'Close'}
        </button>
      </div>
    </div>
  );
};
