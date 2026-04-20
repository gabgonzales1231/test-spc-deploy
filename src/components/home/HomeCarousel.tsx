"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Banner } from "@/app/page";

function ImageCarouselItem({
  src, alt, title, subtitle,
  isActive = false,
  isPriority = false,
  isVisible = false,
}: {
  src: string; alt: string; title: string; subtitle: string;
  isActive?: boolean; isPriority?: boolean; isVisible?: boolean;
}) {
  if (!isVisible && !isPriority) {
    return (
      <CarouselItem className="pl-2 md:pl-4">
        <div className="w-full h-[60vh] sm:h-[70vh] md:h-[80vh] bg-slate-100 rounded-2xl" />
      </CarouselItem>
    );
  }

  return (
    <CarouselItem className="pl-2 md:pl-4">
      <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
        <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] overflow-hidden">

          {/* ✅ FIX: Removed the custom 'quality' prop to prevent Next.js config errors.
              Using sizes="10vw" alone is enough to force Next.js to serve a tiny, 
              lightweight thumbnail for this blurred background. */}
          {isActive && (
            <Image
              src={src}
              alt=""
              fill
              className="object-cover scale-110 blur-2xl opacity-60"
              sizes="10vw"
              priority={isPriority}
              {...(isPriority ? { fetchPriority: "low" } : { loading: "lazy" })}
              aria-hidden="true"
            />
          )}

          <Image
            src={src}
            alt={alt}
            fill
            className={`object-contain
              ${isPriority
                ? "transition-transform transition-opacity duration-700 ease-out"
                : "transition-all duration-700 ease-out"}
              ${isActive ? "scale-[1.02]" : "scale-100"}
              group-hover:scale-105`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
            priority={isPriority}
            {...(isPriority ? { fetchPriority: "high" } : { loading: "lazy" })}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-0" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 lg:p-12">
          <div className={`transform transition-all duration-700 ease-out
            ${isActive ? "translate-y-0 opacity-100" : "translate-y-2 opacity-90"}
            group-hover:opacity-0 group-hover:translate-y-4`}>
            <h3 className="text-left text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-1 sm:mb-2 md:mb-3 drop-shadow-lg leading-tight">
              {title}
            </h3>
            <p className="text-left text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-white/90 max-w-2xl drop-shadow-md leading-relaxed">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </CarouselItem>
  );
}

export default function HomeCarousel({ banners }: { banners: Banner[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);

  const [autoplayReady, setAutoplayReady] = useState(false);

  const autoplay = useMemo(
    () => Autoplay({
      delay: 5000,
      stopOnInteraction: false,
      playOnInit: false,
    }),
    []
  );

  useEffect(() => {
    if (!api) return;
    const update = () => setCurrentSlide(api.selectedScrollSnap());
    api.on("select", update);
    return () => { api.off("select", update); };
  }, [api]);

  useEffect(() => {
    if (!api || banners.length <= 1) return;
    const startTimer = setTimeout(() => {
      autoplay.play();
    }, 2500);
    return () => clearTimeout(startTimer);
  }, [api, banners.length, autoplay]);

  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      setAutoplayReady(true);
    });
    return () => cancelAnimationFrame(rafId);
  }, []);

  if (banners.length === 0) return null;

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 via-white to-emerald-50/20 pt-8 sm:pt-12">
      <div className="px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-24 pt-32 sm:pt-28 md:pt-32">
        <Carousel
          className="w-full mx-auto relative"
          opts={{ loop: banners.length > 1 }}
          plugins={autoplayReady && banners.length > 1 ? [autoplay] : []}
          setApi={setApi}
        >
          <CarouselContent>
            {banners.map((banner, index) => {
              const isVisible =
                Math.abs(index - currentSlide) <= 1 ||
                (currentSlide === 0 && index === banners.length - 1) ||
                (currentSlide === banners.length - 1 && index === 0);

              return (
                <ImageCarouselItem
                  key={banner.banner_id}
                  src={banner.media?.file_path || ""}
                  alt={banner.title || ""}
                  title={banner.title || ""}
                  subtitle={banner.description || ""}
                  isActive={index === currentSlide}
                  isPriority={index === 0}
                  isVisible={isVisible}
                />
              );
            })}
          </CarouselContent>

          {banners.length > 1 && (
            <>
              <CarouselPrevious aria-label="Previous slide" className="hidden xs:flex absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:bg-emerald-500 hover:text-white transition-all">
                <ChevronLeft className="w-6 h-6" />
              </CarouselPrevious>
              <CarouselNext aria-label="Next slide" className="hidden xs:flex absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:bg-emerald-500 hover:text-white transition-all">
                <ChevronRight className="w-6 h-6" />
              </CarouselNext>
            </>
          )}
        </Carousel>

        {banners.length > 1 && (
          <div className="flex justify-center mt-6">
            <div className="flex space-x-2 bg-emerald-500/20 backdrop-blur-md rounded-full px-3 py-2 shadow-md border border-emerald-500/30">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  aria-label={`Show banner slide ${index + 1}`}
                  className={`h-2 w-2 md:h-3 md:w-3 rounded-full transition-all duration-300
                    ${index === currentSlide
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 w-6 md:w-8 shadow"
                      : "bg-emerald-300/70 hover:bg-emerald-400/90"}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}