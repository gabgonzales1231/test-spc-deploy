//spc-website\src\app\about-us\history\page.tsx

"use client";

import { useState, useEffect } from "react";
import { Building2, MapPin, Eye, Mountain, BookOpen, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

const ImageGallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const images = [
    {
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      title: "San Pablo Landscape",
    },
    {
      url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      title: "City View",
    },
    {
      url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800",
      title: "Mountain Scenery",
    },
    {
      url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800",
      title: "Natural Beauty",
    },
    {
      url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
      title: "Greenery",
    },
    {
      url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800",
      title: "Waterscape",
    },
  ];

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative group cursor-pointer overflow-hidden rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            style={{
              gridRow: index === 0 ? "span 2" : "span 1",
              aspectRatio: index === 0 ? "1/1" : "16/9",
            }}
            onClick={() => setSelectedImage(index)}
          >
            <Image
              src={image.url}
              alt={image.title}
              className="w-full h-full object-cover"
              width={600}
              height={400}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 text-white">
                <p className="font-semibold">{image.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <Button
            className="absolute top-4 right-4 text-white hover:text-emerald-400 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </Button>
          <div
            className="max-w-6xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[selectedImage].url}
              alt={images[selectedImage].title}
              className="w-full h-auto rounded-xl shadow-2xl"
              width={1200}
              height={800}
            />
            <p className="text-white text-center mt-4 text-xl font-semibold">
              {images[selectedImage].title}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

interface Lake {
  name: string;
  description: string;
  image: string;
}

const SevenLakesCarousel = () => {
  const [selectedLake, setSelectedLake] = useState<Lake | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const lakes: Lake[] = [
    {
      name: "Sampaloc Lake",
      description:
        "The largest and most popular of the seven lakes, perfect for water activities and scenic views.",
      image:
        "https://hvalkmxibjgrwipfuvhw.supabase.co/storage/v1/object/public/assets/seven-lakes/lakesampaloc00-ssdiaries.jpg",
    },
    {
      name: "Palakpakin Lake",
      description:
        "A serene lake surrounded by lush vegetation, ideal for peaceful retreats.",
      image:
        "https://hvalkmxibjgrwipfuvhw.supabase.co/storage/v1/object/public/assets/seven-lakes/lake_palakpakin01ss_diaries.jpg",
    },
    {
      name: "Mohicap Lake",
      description:
        "Known for its crystal-clear waters and tranquil atmosphere.",
      image:
        "https://hvalkmxibjgrwipfuvhw.supabase.co/storage/v1/object/public/assets/seven-lakes/lake_mohicap14-ssd.jpg",
    },
    {
      name: "Yambo Lake",
      description:
        "A picturesque lake offering stunning views and fishing opportunities.",
      image:
        "https://hvalkmxibjgrwipfuvhw.supabase.co/storage/v1/object/public/assets/seven-lakes/lake_yambo20mod-crop-ssdiaries.jpg",
    },
    {
      name: "Pandin Lake",
      description:
        "Famous for its bamboo raft rides and pristine natural beauty.",
      image:
        "https://hvalkmxibjgrwipfuvhw.supabase.co/storage/v1/object/public/assets/seven-lakes/lakepandin-rev02-ssdiaries.jpg",
    },
    {
      name: "Calibato Lake",
      description:
        "A hidden gem with calm waters perfect for kayaking and nature walks.",
      image:
        "https://hvalkmxibjgrwipfuvhw.supabase.co/storage/v1/object/public/assets/seven-lakes/lake_calibato01mod-ssdiaries.jpg",
    },
    {
      name: "Bunot Lake",
      description:
        "The smallest but most charming lake, surrounded by verdant landscapes.",
      image:
        "https://hvalkmxibjgrwipfuvhw.supabase.co/storage/v1/object/public/assets/seven-lakes/lakebunot_rev02-ssdiaries.jpg",
    },
  ];

  // Device orientation for mobile parallax
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
        window.removeEventListener(
          "deviceorientation",
          handleDeviceOrientation
        );
      }
    };
  }, []);

  // Mouse move handler for parallax effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setMousePosition({ x: x * 20, y: y * 20 });
  };

  // Mouse leave handler to reset position
  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <Carousel className="w-full">
        <CarouselContent>
          {lakes.map((lake, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <div
                  className="cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden rounded-xl group"
                  onClick={() => setSelectedLake(lake)}
                >
                  <div className="relative w-full h-64 overflow-hidden rounded-xl">
                    <Image
                      src={lake.image}
                      alt={lake.name}
                      fill
                      className="object-cover transform group-hover:scale-110 transition-transform duration-500"
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
        <CarouselPrevious className="bg-white/90 hover:bg-emerald-500 hover:text-white" />
        <CarouselNext className="bg-white/90 hover:bg-emerald-500 hover:text-white" />
      </Carousel>

      <Dialog
        open={selectedLake !== null}
        onOpenChange={() => setSelectedLake(null)}
      >
        <DialogContent
          className="max-w-7xl w-[95vw] h-[90vh] max-h-[90vh] p-0 overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {selectedLake && (
            <div className="h-full flex flex-col">
              {/* Parallax Image Section */}
              <div
                className="relative w-full h-2/3 overflow-hidden"
                style={{
                  transform: `perspective(1000px) rotateY(${
                    mousePosition.x || tilt.x
                  }deg) rotateX(${-(mousePosition.y || tilt.y)}deg)`,
                  transition: "transform 0.1s ease-out",
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    transform: `scale(1.1) translate(${
                      (mousePosition.x || tilt.x) * -0.5
                    }px, ${(mousePosition.y || tilt.y) * -0.5}px)`,
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
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                  style={{
                    transform: `translate(${
                      (mousePosition.x || tilt.x) * -0.3
                    }px, ${(mousePosition.y || tilt.y) * -0.3}px)`,
                    transition: "transform 0.1s ease-out",
                  }}
                />
              </div>

              {/* Content Section */}
              <div className="flex-1 p-8 flex flex-col justify-center overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-4xl md:text-5xl font-bold text-emerald-800">
                    {selectedLake.name}
                  </DialogTitle>
                  <DialogDescription className="text-gray-700 text-xl leading-relaxed pt-4">
                    {selectedLake.description}
                  </DialogDescription>
                </DialogHeader>
              </div>
            </div>
          )}
          <DialogClose className="absolute top-4 right-4 text-white hover:text-emerald-400 transition-colors" />
        </DialogContent>
      </Dialog>

      <div className="mt-8 text-center space-y-2">
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Photo Credits:</span> All images
          courtesy of SS Diaries
        </p>
        <p className="text-xs text-gray-500 max-w-2xl mx-auto">
          <span className="font-semibold">Disclaimer:</span> The information
          provided about the Seven Lakes is for general informational purposes
          only. Conditions, accessibility, and activities may vary. Please
          verify current details before planning your visit.
        </p>
      </div>
    </div>
  );
};

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
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow-sm border border-gray-200">
        <thead>
          <tr className="bg-emerald-50">
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b">
              Name of Municipality
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-b">
              Distance (km)
            </th>
          </tr>
        </thead>
        <tbody>
          {municipalities.map((municipality, index) => (
            <tr
              key={index}
              className={`${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              } hover:bg-emerald-50 transition-colors`}
            >
              <td className="px-6 py-3 text-sm text-gray-800 border-b border-gray-100">
                {municipality.name}
              </td>
              <td className="px-6 py-3 text-sm text-gray-800 border-b border-gray-100 font-medium">
                {municipality.distance}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default function SanPabloCityInfoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Hero Section */}
      <section className="relative py-20 pt-40 px-4 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white overflow-hidden">
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
            <Building2 className="w-4 h-4 mr-2" />
            City of Seven Lakes
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            San Pablo City
            <br />
            Information
          </h1>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
            Your comprehensive guide to San Pablo City - from our vision and
            mission to our rich history and commitment to excellent public
            service.
          </p>
        </div>
      </section>

      {/* City Location */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-2xl mb-6">
              <MapPin className="w-10 h-10 text-emerald-700" />
            </div>
            <h2 className="text-4xl font-bold mb-6">CITY LOCATION</h2>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-8">
            <p className="text-gray-700 leading-relaxed text-lg">
              San Pablo City is located at the Southern tip of the Province of
              Laguna in the island of Luzon at geographical coordinates, 14°
              4&apos; north latitude and 121° 19&apos; east longitude. It is
              bounded by 6 municipalities and 1 city namely Calauan, Laguna in
              the northwest; Nagcarlan, Laguna in the northeast; Alaminos,
              Laguna in the west; Rizal, Laguna in the east; Lipa City, Batangas
              in the southeastern tip; and the municipalities of Tiaong and
              Dolores, Quezon in the south. All adjoining municipalities and
              city have entry points making San Pablo accessible from virtually
              all directions.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg mt-4">
              Kilometerage distance from the National Capital Region is about 82
              kilometers and located southwesterly of Manila.
            </p>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-2xl mb-6">
              <Eye className="w-10 h-10 text-emerald-700" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Discover San Pablo City</h2>
            <p className="text-gray-600 text-lg">
              A visual journey through our beautiful city
            </p>
          </div>
          <ImageGallery />
        </div>
      </section>

      {/* Seven Lakes Carousel */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-2xl mb-6">
              <Mountain className="w-10 h-10 text-emerald-700" />
            </div>
            <h2 className="text-4xl font-bold mb-4">The City of Seven Lakes</h2>
            <p className="text-gray-600 text-lg">
              Explore the natural wonders that define our city
            </p>
          </div>
          <SevenLakesCarousel />
        </div>
      </section>

      {/* Distance Table */}
      <section className="py-16 px-4 bg-white/70">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-2xl mb-6">
              <MapPin className="w-10 h-10 text-emerald-700" />
            </div>
            <h2 className="text-4xl font-bold mb-4">
              Neighboring Municipalities
            </h2>
            <p className="text-gray-600 text-lg">
              Accessibility from all directions
            </p>
          </div>
          <NeighboringMunicipalities />
        </div>
      </section>

      {/* Geography */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-2xl mb-6">
              <Mountain className="w-10 h-10 text-emerald-700" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Geography and Topology</h2>
            <p className="text-gray-600 text-lg">The City of Seven Lakes</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-8">
            <p className="text-gray-700 leading-relaxed text-lg mb-6">
              San Pablo City also known as the City of Seven Lakes is located at
              geographical coordinates 14°4&#39; north latitude and 121° east
              longitude. It is about 87 km south-southwest of the City of Manila
              with Rizal Park as reference point. The City is the center of
              other progressive cities in Southern Luzon as it belongs to a
              vital economic hub.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg mb-6">
              The City at 14° 15&#39; 20&quot; north latitude is bounded by the
              mountain ranges of Kaisungan and Calauan Hills in the south;
              Mabilog in the northwest; San Cristobal and Banahaw Mountains in
              the east; and Susong-Dalaga, Napayong and Masalukot Hills in the
              south to the southeast.
            </p>
            <div className="bg-emerald-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-emerald-800 mb-2">
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
      </section>

      {/* History */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-2xl mb-6">
              <BookOpen className="w-10 h-10 text-emerald-700" />
            </div>
            <h2 className="text-4xl font-bold mb-4">
              History of San Pablo City
            </h2>
            <p className="text-gray-600 text-lg">
              From Sampalok village to a chartered city
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-8">
              <h3 className="text-xl font-bold text-emerald-800 mb-4">
                Early History
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                The earliest historical record of the City of San Pablo dates
                back to pre-Spanish times when four (4) big barrios bounded by
                Mt. Banahaw and Mt. Makiling composed Sampaloc. In 1521,
                Sampaloc was changed to San Pablo De Los Montes, which became a
                parish in 1556 and then a municipality in 1647.
              </p>
              <p className="text-gray-700 leading-relaxed">
                San Pablo was known as &quot;Sampalok village&quot; before the
                coming of the Spaniards, because of the dominant tamarind trees
                in this area. It was a village of Bay, Laguna.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-8">
              <h3 className="text-xl font-bold text-emerald-800 mb-4">
                City Charter
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                In 1899, a Municipal Government was established with Inocente
                Martinez as Municipal President in 1902 when the Civil
                Government was granted independence from the Province of Laguna.
                On May 7, 1940, the charter bill sponsored by Congressman Tomas
                Dizon was approved.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The bill became known as the City Charter of San Pablo or
                Commonwealth Act No. 520. The City was inaugurated on March 30,
                1941 with Dr. Potenciano Malvar as the appointed City Mayor.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-2xl shadow-xl text-white p-8">
            <h3 className="text-xl font-bold mb-4">Spanish Period</h3>
            <p className="text-emerald-100 leading-relaxed mb-4">
              In 1571, Spaniards came to the village of Sampalok under Capitan
              Juan de Salcedo. It became a separate parish in July 8, 1586 with
              Augustinian Priest Father Mateo Mendoza as prior of the convent.
            </p>
            <p className="text-emerald-100 leading-relaxed">
              It was in 1647 when Sampalok was separated from Bay as a
              municipality and was renamed San Pablo de los Montes (St. Paul of
              the Mountains) in honor of its patron, St. Paul the First Hermit.
              It was placed under the cabecera of Pagsanjan, with Bartolome
              Maghayin as first gobernadorcillo in 1648.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
