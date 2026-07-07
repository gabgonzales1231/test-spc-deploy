//src/app/about-us/explore/page.tsx

"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Building2, MapPin, Eye, Mountain, BookOpen, XIcon } from "lucide-react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { ImageGallery } from "@/components/explore/ImageGallery";

const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 },
  },
};

const ScrollRevealSection = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.section
    className={className}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.22, margin: "0px 0px -80px 0px" }}
    variants={sectionReveal}
  >
    {children}
  </motion.section>
);

// ---------------------------------------------------------------------------
// SevenLakesCarousel — auto-scrolling with pause on hover/interaction
// ---------------------------------------------------------------------------

interface Lake {
  name: string;
  description: string;
  image: string;
}

const SCROLL_INTERVAL = 2000;

const SevenLakesCarousel = () => {
  const [selectedLake, setSelectedLake] = useState<Lake | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [api, setApi] = useState<CarouselApi>();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const lakes: Lake[] = [
    {
      name: "Sampaloc Lake",
      description: "The largest and most popular of the seven lakes, perfect for water activities and scenic views.",
      image: "https://hvalkmxibjgrwipfuvhw.supabase.co/storage/v1/object/public/assets/seven-lakes/lakesampaloc00-ssdiaries.jpg",
    },
    {
      name: "Palakpakin Lake",
      description: "A serene lake surrounded by lush vegetation, ideal for peaceful retreats.",
      image: "https://hvalkmxibjgrwipfuvhw.supabase.co/storage/v1/object/public/assets/seven-lakes/lake_palakpakin01ss_diaries.jpg",
    },
    {
      name: "Mohicap Lake",
      description: "Known for its crystal-clear waters and tranquil atmosphere.",
      image: "https://hvalkmxibjgrwipfuvhw.supabase.co/storage/v1/object/public/assets/seven-lakes/lake_mohicap14-ssd.jpg",
    },
    {
      name: "Yambo Lake",
      description: "A picturesque lake offering stunning views and fishing opportunities.",
      image: "https://hvalkmxibjgrwipfuvhw.supabase.co/storage/v1/object/public/assets/seven-lakes/lake_yambo20mod-crop-ssdiaries.jpg",
    },
    {
      name: "Pandin Lake",
      description: "Famous for its bamboo raft rides and pristine natural beauty.",
      image: "https://hvalkmxibjgrwipfuvhw.supabase.co/storage/v1/object/public/assets/seven-lakes/lakepandin-rev02-ssdiaries.jpg",
    },
    {
      name: "Calibato Lake",
      description: "A hidden gem with calm waters perfect for kayaking and nature walks.",
      image: "https://hvalkmxibjgrwipfuvhw.supabase.co/storage/v1/object/public/assets/seven-lakes/lake_calibato01mod-ssdiaries.jpg",
    },
    {
      name: "Bunot Lake",
      description: "The smallest but most charming lake, surrounded by verdant landscapes.",
      image: "https://hvalkmxibjgrwipfuvhw.supabase.co/storage/v1/object/public/assets/seven-lakes/lakebunot_rev02-ssdiaries.jpg",
    },
  ];

  const startAutoScroll = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!api) return;
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, SCROLL_INTERVAL);
  }, [api]);

  const stopAutoScroll = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!api) return;
    startAutoScroll();
    return () => stopAutoScroll();
  }, [api, startAutoScroll, stopAutoScroll]);

  useEffect(() => {
    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta !== null && event.gamma !== null) {
        setTilt({
          x: Math.max(-15, Math.min(15, event.gamma / 2)),
          y: Math.max(-15, Math.min(15, event.beta / 2)),
        });
      }
    };

    if (typeof window !== "undefined" && window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleDeviceOrientation);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("deviceorientation", handleDeviceOrientation);
      }
    };
  }, []);

  return (
    <div
      className="w-full max-w-6xl mx-auto px-4 overflow-hidden"
      onMouseEnter={stopAutoScroll}
      onMouseLeave={startAutoScroll}
    >
      <Carousel
        className="w-full"
        setApi={setApi}
        opts={{ loop: true, duration: 40 }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {lakes.map((lake, index) => (
            <CarouselItem key={index} className="pl-2 md:pl-4 basis-[85%] md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <div
                  className="cursor-pointer overflow-hidden rounded-xl"
                  onClick={() => {
                    stopAutoScroll();
                    setSelectedLake(lake);
                  }}
                >
                  <div className="relative w-full h-64 overflow-hidden rounded-xl">
                    <Image
                      src={lake.image}
                      alt={lake.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="text-xl font-bold">{lake.name}</h3>
                      <p className="text-sm text-emerald-100 mt-1 line-clamp-2">
                        {lake.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          className="hidden md:flex bg-white/90 hover:bg-emerald-500 hover:text-white"
          onClick={() => { stopAutoScroll(); startAutoScroll(); }}
        />
        <CarouselNext
          className="hidden md:flex bg-white/90 hover:bg-emerald-500 hover:text-white"
          onClick={() => { stopAutoScroll(); startAutoScroll(); }}
        />
      </Carousel>

      <Dialog
        open={selectedLake !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedLake(null);
            startAutoScroll();
          }
        }}
      >
        <DialogContent
          className="max-w-7xl w-[95vw] h-[90vh] md:h-[85vh] p-0 overflow-hidden border-none"
          showCloseButton={false}
        >
          {selectedLake && (
            <div className="h-full flex flex-col overflow-hidden">
              <div
                className="relative w-full h-1/2 md:h-2/3 overflow-hidden bg-slate-900"
                style={{ perspective: "1000px" }}
              >
                <div
                  className="absolute inset-0 w-full h-full"
                  style={{
                    transform: `rotateY(${tilt.x}deg) rotateX(${-tilt.y}deg) scale(1.1)`,
                    transition: "transform 0.1s ease-out",
                  }}
                >
                  <Image
                    src={selectedLake.image}
                    alt={selectedLake.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              <div className="flex-1 p-6 md:p-12 flex flex-col justify-start md:justify-center overflow-hidden bg-white">
                <DialogHeader className="text-left">
                  <DialogTitle className="text-3xl md:text-5xl font-bold text-emerald-800">
                    {selectedLake.name}
                  </DialogTitle>
                  <DialogDescription className="text-gray-700 text-lg md:text-xl leading-relaxed pt-4">
                    {selectedLake.description}
                  </DialogDescription>
                </DialogHeader>
              </div>
            </div>
          )}
          <DialogClose className="absolute top-4 right-4 z-50 p-2 text-white hover:bg-emerald-700/70 transition-colors">
            <XIcon className="size-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ---------------------------------------------------------------------------
// NeighboringMunicipalities
// ---------------------------------------------------------------------------

const NeighboringMunicipalities = () => {
  const municipalities = [
    { name: "Calauan, Laguna", distance: "9.5" },
    { name: "Alaminos, Laguna", distance: "10" },
    { name: "Nagcarlan, Laguna", distance: "14" },
    { name: "Rizal, Laguna", distance: "14" },
    { name: "Tiaong, Quezon", distance: "14" },
    { name: "Dolores, Quezon", distance: "14" },
    { name: "Lipa, Batangas", distance: "36" },
  ];

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead>
          <tr className="bg-emerald-50">
            <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-gray-900">
              Name of Municipality
            </th>
            <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-gray-900">
              Distance (km)
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {municipalities.map((municipality, index) => (
            <tr
              key={index}
              className={`${
                index % 2 === 0 ? "bg-gray-50/50" : "bg-white"
              } hover:bg-emerald-50/50 transition-colors`}
            >
              <td className="px-4 md:px-6 py-3 text-sm text-gray-800 whitespace-nowrap">
                {municipality.name}
              </td>
              <td className="px-4 md:px-6 py-3 text-sm text-gray-800 font-medium">
                {municipality.distance}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function SanPabloCityInfoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 max-w-[100vw] overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative py-20 pt-32 md:pt-40 px-4 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white overflow-hidden">
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-xs md:text-sm font-medium mb-6 backdrop-blur-sm">
            <Building2 className="w-4 h-4 mr-2" />
            About City
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
            Explore San Pablo City
          </h1>
          <p className="text-lg md:text-xl text-emerald-50 max-w-2xl mx-auto opacity-90">
            Learn its rich history, notable landmarks, and cultural heritage that reflect the city's identity and legacy of public service.
          </p>
        </div>
      </section>

      {/* City Location */}
      <ScrollRevealSection className="py-12 md:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-emerald-100 rounded-2xl mb-6">
              <MapPin className="w-8 h-8 md:w-10 md:h-10 text-emerald-700" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">City Location</h2>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 md:p-8">
            <p className="text-gray-700 leading-relaxed text-base md:text-lg">
              San Pablo City is located at the Southern tip of the Province of
              Laguna in the island of Luzon at geographical coordinates, 14°
              4&apos; north latitude and 121° 19&apos; east longitude. It is
              bounded by 6 municipalities and 1 city namely Calauan, Laguna in
              the northwest; Nagcarlan, Laguna in the northeast; Alaminos,
              Laguna in the west; Rizal, Laguna in the east; Lipa City, Batangas
              in the southeastern tip; and the municipalities of Tiaong and
              Dolores, Quezon in the south.
            </p>
            <p className="text-gray-700 leading-relaxed text-base md:text-lg mt-4">
              Kilometerage distance from the National Capital Region is about 82
              kilometers and located southwesterly of Manila.
            </p>
          </div>
        </div>
      </ScrollRevealSection>

      {/* Image Gallery — CMS-driven */}
      <motion.section 
        className="py-12 md:py-16 px-4 bg-emerald-50/30"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25, margin: "0px 0px -100px 0px" }}
        variants={sectionReveal}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-emerald-100 rounded-2xl mb-6">
              <Eye className="w-8 h-8 md:w-10 md:h-10 text-emerald-700" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Discover Our City</h2>
            <p className="text-gray-600 text-base md:text-lg">
              A visual journey through our beautiful city
            </p>
          </div>
          <ImageGallery />
        </div>
      </motion.section>

      {/* Seven Lakes Carousel */}
      <ScrollRevealSection className="py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-emerald-100 rounded-2xl mb-6">
              <Mountain className="w-8 h-8 md:w-10 md:h-10 text-emerald-700" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The City of Seven Lakes</h2>
            <p className="text-gray-600 text-base md:text-lg">
              Explore the natural wonders that define our city
            </p>
          </div>
          <SevenLakesCarousel />
        </div>
      </ScrollRevealSection>

      {/* Distance Table */}
      <ScrollRevealSection className="py-12 md:py-16 px-4 bg-white/70">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-emerald-100 rounded-2xl mb-6">
              <MapPin className="w-8 h-8 md:w-10 md:h-10 text-emerald-700" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Neighboring Municipalities
            </h2>
            <p className="text-gray-600 text-base md:text-lg">
              Accessibility from all directions
            </p>
          </div>
          <NeighboringMunicipalities />
        </div>
      </ScrollRevealSection>

      {/* Geography */}
      <ScrollRevealSection className="py-12 md:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-emerald-100 rounded-2xl mb-6">
              <Mountain className="w-8 h-8 md:w-10 md:h-10 text-emerald-700" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Geography and Topology</h2>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 md:p-8">
            <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-6">
              San Pablo City is about 87 km south-southwest of the City of Manila
              with Rizal Park as reference point. The City is the center of
              other progressive cities in Southern Luzon as it belongs to a
              vital economic hub.
            </p>
            <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-6">
              The City is bounded by the mountain ranges of Kaisungan and Calauan Hills in the south;
              Mabilog in the northwest; San Cristobal and Banahaw Mountains in
              the east; and Susong-Dalaga, Napayong and Masalukot Hills in the
              south to the southeast.
            </p>
            <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
              <h3 className="text-lg font-bold text-emerald-800 mb-2">
                Total Land Area
              </h3>
              <p className="text-gray-700">
                The City of San Pablo has a total land area of{" "}
                <span className="font-semibold">19,899 hectares</span>, 77.16%
                of which is devoted to crop production.
              </p>
            </div>
          </div>
        </div>
      </ScrollRevealSection>

      {/* History */}
      <ScrollRevealSection className="py-12 md:py-16 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-emerald-100 rounded-2xl mb-6">
              <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-emerald-700" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              History of San Pablo City
            </h2>
            <p className="text-gray-600 text-base md:text-lg">
              From Sampalok village to a chartered city
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 md:p-8">
              <h3 className="text-xl font-bold text-emerald-800 mb-4">
                Early History
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4 text-base md:text-lg">
                The earliest historical record of the City of San Pablo dates
                back to pre-Spanish times when four (4) big barrios bounded by
                Mt. Banahaw and Mt. Makiling composed Sampaloc. In 1521,
                Sampaloc was changed to San Pablo De Los Montes.
              </p>
              <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                San Pablo was known as &quot;Sampalok village&quot; before the
                coming of the Spaniards, because of the dominant tamarind trees
                in this area.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 md:p-8">
              <h3 className="text-xl font-bold text-emerald-800 mb-4">
                City Charter
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4 text-base md:text-lg">
                On May 7, 1940, the charter bill sponsored by Congressman Tomas
                Dizon was approved. It became known as the City Charter of San Pablo or
                Commonwealth Act No. 520.
              </p>
              <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                The City was inaugurated on March 30,
                1941 with Dr. Potenciano Malvar as the appointed City Mayor.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-700 to-emerald-900 rounded-2xl shadow-xl text-white p-6 md:p-10">
            <h3 className="text-xl md:text-2xl font-bold mb-4">Spanish Period</h3>
            <p className="text-emerald-50 leading-relaxed mb-4 text-base md:text-lg opacity-90">
              In 1571, Spaniards came to the village of Sampalok under Capitan
              Juan de Salcedo. It became a separate parish in July 8, 1586 with
              Augustinian Priest Father Mateo Mendoza as prior of the convent.
            </p>
            <p className="text-emerald-50 leading-relaxed text-base md:text-lg opacity-90">
              It was in 1647 when Sampalok was separated from Bay as a
              municipality and was renamed San Pablo de los Montes (St. Paul of
              the Mountains) in honor of its patron, St. Paul the First Hermit.
            </p>
          </div>
        </div>
      </ScrollRevealSection>

      <footer className="py-8 px-4 border-t border-gray-100 bg-white">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <p className="text-xs text-gray-500">
            <span className="font-semibold">Photo Credits:</span> All images courtesy of SS Diaries
          </p>
          <p className="text-[10px] text-gray-400 leading-tight">
            The information provided about the Seven Lakes is for general informational purposes only. Conditions, accessibility, and activities may vary.
          </p>
        </div>
      </footer>
    </div>
  );
}