import React, { useState, useEffect, useRef } from 'react';
import { HERO_SLIDES } from '../../utils/foodImageResolver';
import { ChevronRight, ChevronLeft, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

interface EasyOrderHeroSliderProps {
  lang: 'ar' | 'en';
  onSelectCategory: (categoryId: string) => void;
}

export const EasyOrderHeroSlider: React.FC<EasyOrderHeroSliderProps> = ({
  lang,
  onSelectCategory,
}) => {
  const isAr = lang === 'ar';
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const totalSlides = HERO_SLIDES.length;

  // Auto-play timer
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, totalSlides]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div
      className="relative w-full max-w-6xl mx-auto px-3 sm:px-6 pt-3 sm:pt-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
        <div className="relative h-44 sm:h-64 md:h-72 w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-md group border-2 border-[#C89D4B]/70">
        {/* Background Image with Warm Overlay */}
        <img
          src={slide.imageUrl}
          alt={isAr ? slide.titleAr : slide.titleEn}
          className="w-full h-full object-cover object-center transition-all duration-700 transform scale-102 group-hover:scale-105"
        />

        {/* Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/55 to-black/25 rtl:bg-linear-to-l" />

        {/* Slide Content */}
        <div className="absolute inset-0 p-4 sm:p-8 flex flex-col justify-center items-start text-white max-w-xl">
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B81D22] text-[#FFF9EA] text-[11px] sm:text-xs font-black shadow-sm mb-2 animate-in fade-in duration-300 border border-[#EEA323]">
            <Sparkles className="w-3.5 h-3.5 text-[#EEA323] fill-[#EEA323]" />
            <span>{isAr ? slide.badgeAr : slide.badgeEn}</span>
          </span>

          {/* Title */}
          <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-white leading-tight drop-shadow-md">
            {isAr ? slide.titleAr : slide.titleEn}
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-amber-100/90 mt-1 line-clamp-2 max-w-md font-medium drop-shadow-xs">
            {isAr ? slide.subtitleAr : slide.subtitleEn}
          </p>

          {/* Action CTA Button in Ochre Gold */}
          <button
            onClick={() => onSelectCategory(slide.categoryId)}
            className="mt-3 sm:mt-4 inline-flex items-center gap-2 bg-[#EEA323] hover:bg-[#DB9116] text-[#2B160C] font-black px-4 py-2 rounded-xl text-xs sm:text-sm shadow-md transition active:scale-95 cursor-pointer border border-[#2B160C]/30"
          >
            <span>{isAr ? 'اطلب الصنف الآن' : 'Order Now'}</span>
            {isAr ? (
              <ArrowLeft className="w-3.5 h-3.5" />
            ) : (
              <ArrowRight className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute start-2 sm:start-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/50 hover:bg-black/80 text-[#FAF1DC] backdrop-blur-xs flex items-center justify-center transition opacity-0 group-hover:opacity-100 cursor-pointer shadow-md border border-[#C89D4B]/40"
          aria-label="Previous Slide"
        >
          {isAr ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>

        <button
          onClick={handleNext}
          className="absolute end-2 sm:end-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/50 hover:bg-black/80 text-[#FAF1DC] backdrop-blur-xs flex items-center justify-center transition opacity-0 group-hover:opacity-100 cursor-pointer shadow-md border border-[#C89D4B]/40"
          aria-label="Next Slide"
        >
          {isAr ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>

        {/* Pagination Dots */}
        <div className="absolute bottom-2.5 sm:bottom-3 inset-x-0 flex items-center justify-center gap-1.5 z-10">
          {HERO_SLIDES.map((s, index) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentSlide === index
                  ? 'w-6 bg-[#EEA323] shadow-sm'
                  : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
