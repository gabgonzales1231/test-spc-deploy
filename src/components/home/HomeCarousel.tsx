"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight, Play, Pause, Image as ImageIcon } from "lucide-react";
// 1. Import the hook
import { useGetBanners } from "@/hooks/useApi";
// 2. REMOVED: import { carouselImages } from "@/data/carousel";

// 3. Define the Banner type based on your API response
interface Banner {
  banner_id: number;
  title: string | null;
  description: string | null;
  media?: {
    media_id: number;
    file_path: string; // This is the full URL
    caption: string | null;
  };
}

function ImageCarouselItem({
  src,
  alt,
  title,
  subtitle,
  isActive = false,
}: {
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  isActive?: boolean;
}) {
  return (
    <CarouselItem className="pl-2 md:pl-4">
      <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
        {/* Container with fixed responsive height */}
        <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] overflow-hidden">
          {/* Blurred background image */}
          <Image
            src={src}
            alt={`${alt} background`}
            fill
            className="object-cover scale-110 blur-2xl opacity-60"
            priority={isActive}
            sizes="100vw"
          />

          {/* Main image - always fully visible */}
          <Image
            src={src}
            alt={alt}
            fill
            className={`
              object-contain transition-all duration-700 ease-out
              ${isActive ? "scale-[1.02]" : "scale-100"}
              group-hover:scale-105
            `}
            priority={isActive}
            sizes="100vw"
          />

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-0" />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/0 via-teal-600/0 to-green-600/0 transition-opacity duration-500 group-hover:opacity-0" />
        </div>

        {/* Text overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 lg:p-12">
          <div
            className={`
              transform transition-all duration-700 ease-out
              ${isActive ? "translate-y-0 opacity-100" : "translate-y-2 opacity-90"}
              group-hover:opacity-0 group-hover:translate-y-4
            `}
          >
            <h3 className="text-left text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-1 sm:mb-2 md:mb-3 drop-shadow-lg leading-tight">
              {title}
            </h3>
            <p className="text-left text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-white/90 max-w-2xl drop-shadow-md leading-relaxed">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Hover highlight effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
      </div>
    </CarouselItem>
  );
}

export default function HomeCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  // 4. Setup hook to fetch banners
  const { data: bannersResponse, loading, error, execute: fetchBanners } = useGetBanners();
  const [banners, setBanners] = useState<Banner[]>([]);

  // 5. Fetch banners on component mount
  useEffect(() => {
    // Fetches active, ordered banners from /api/banners
    fetchBanners({ page: 1, limit: 10 });
  }, [fetchBanners]);

  // 6. Update local state when data arrives (FIXED)
  useEffect(() => {
    // bannersResponse IS the array, or null.
    if (Array.isArray(bannersResponse)) {
      setBanners(bannersResponse as Banner[]);
    }
  }, [bannersResponse]);

  // listen to slide changes
  useEffect(() => {
    if (!api) return;
    const update = () => setCurrentSlide(api.selectedScrollSnap());
    api.on("select", update);
    update();
    return () => {
      api.off("select", update);
    };
  }, [api]);

  // autoplay
  useEffect(() => {
    if (!api || !isAutoplay || banners.length <= 1) return;
    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [api, isAutoplay, banners.length]);



  // 7. Handle loading and error states
  if (loading && banners.length === 0) {
    return (
      <div className="w-full bg-gradient-to-br from-slate-50 via-white to-emerald-50/20 pt-8 sm:pt-12">
        <div className="px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-24 pt-32 sm:pt-28 md:pt-32">
           <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] bg-gray-200 rounded-2xl animate-pulse flex items-center justify-center">
             <ImageIcon className="w-16 h-16 text-gray-400" />
           </div>
        </div>
      </div>
    );
  }

  if (error && banners.length === 0) {
     return (
       <div className="w-full bg-gradient-to-br from-slate-50 via-white to-emerald-50/20 pt-8 sm:pt-12">
         <div className="px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-24 pt-32 sm:pt-28 md:pt-32">
           <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] bg-red-100 rounded-2xl flex items-center justify-center">
             <p className="text-red-700 font-medium">Error loading banners: {error}</p>
           </div>
         </div>
       </div>
     );
  }

  if (banners.length === 0) {
    return (
      <div className="w-full bg-gradient-to-br from-slate-50 via-white to-emerald-50/20 pt-8 sm:pt-12">
        <div className="px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-24 pt-32 sm:pt-28 md:pt-32">
           <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] bg-gray-100 rounded-2xl flex items-center justify-center">
             <p className="text-gray-500">No banners to display.</p>
           </div>
        </div>
      </div>
    );
  }

  // 8. Use the dynamic 'banners' state to render
  return (
    <div className="w-full bg-gradient-to-br from-slate-50 via-white to-emerald-50/20 pt-8 sm:pt-12">
      <div className="px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-24 pt-32 sm:pt-28 md:pt-32">
        <Carousel
          className="w-full mx-auto relative"
          opts={{
            loop: banners.length > 1,
          }}
          setApi={setApi}
        >
          <CarouselContent>
            {banners.map((banner, index) => (
              <ImageCarouselItem
                key={banner.banner_id}
                src={banner.media?.file_path || "https://placehold.co/1920x1080?text=No+Image"}
                alt={banner.title || "Banner image"}
                title={banner.title || ""}
                subtitle={banner.description || ""}
                isActive={index === currentSlide}
              />
            ))}
          </CarouselContent>

          {banners.length > 1 && (
            <>
              <CarouselPrevious
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10
                w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full 
                bg-white/90 backdrop-blur-sm border-0 shadow-lg
                hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 
                hover:text-white hover:shadow-xl hover:scale-110
                transition-all duration-300 group
                hidden xs:flex"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </CarouselPrevious>
              <CarouselNext
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10
                w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full 
                bg-white/90 backdrop-blur-sm border-0 shadow-lg
                hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 
                hover:text-white hover:shadow-xl hover:scale-110
                transition-all duration-300 group
                hidden xs:flex"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </CarouselNext>
            </>
          )}
          {banners.length > 1 && (
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10">
              <button
                onClick={() => setIsAutoplay((prev) => !prev)}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full 
                  bg-white/20 backdrop-blur-sm border border-white/30
                  hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 
                  hover:text-white hover:border-transparent
                  transition-all duration-300"
              >
                {isAutoplay ? (
                  <Pause className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mx-auto text-white" />
                ) : (
                  <Play className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mx-auto text-white" />
                )}
              </button>
            </div>
          )}
        </Carousel>
        
        {banners.length > 1 && (
          <div className="flex justify-center mt-6">
            <div className="flex space-x-2 bg-emerald-500/20 backdrop-blur-md rounded-full px-3 py-2 shadow-md border border-emerald-500/30">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={`
            h-2 w-2 md:h-3 md:w-3 rounded-full transition-all duration-300
            ${index === currentSlide
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 w-6 md:w-8 shadow"
                      : "bg-emerald-300/70 hover:bg-emerald-400/90"}
          `}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}