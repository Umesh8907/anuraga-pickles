"use client";

import { useState } from "react";
import Image, { StaticImageData } from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

import c1 from "@/assets/artisan-1.jpg";
import c2 from "@/assets/artisan-2.jpg";
import c3 from "@/assets/artisan-3.jpg";
import c4 from "@/assets/artisan-4.jpg";
import c5 from "@/assets/artisan-5.jpg";

interface Artisan {
  id: number;
  name: string;
  role: string;
  description: string;
  image: StaticImageData;
}

const artisans: Artisan[] = [
  { id: 1, name: "Lakshmi Bai", role: "Traditional Cook", description: "Lakshmi has been cooking traditional recipes for over 20 years.", image: c1 },
  { id: 2, name: "Kamala Devi", role: "Spice Grinder", description: "Kamala specializes in hand-ground spice blends.", image: c2 },
  { id: 3, name: "Savita Devi", role: "Traditional Spice Artisan", description: "Savita has blended spices for over 15 years.", image: c3 },
  { id: 4, name: "Anjali Kumari", role: "Pickle Master", description: "Anjali crafts traditional pickles.", image: c4 },
  { id: 5, name: "Radha Sharma", role: "Textile Weaver", description: "Radha weaves intricate patterns.", image: c5 },
];

export default function ArtisansCarousel() {
  const [active, setActive] = useState(2);

  const getOffset = (index: number) => {
    const diff = index - active;
    if (diff > 2) return diff - artisans.length;
    if (diff < -2) return diff + artisans.length;
    return diff;
  };

  return (
    <section className="bg-[#fffaf3] py-20 overflow-hidden">
      {/* Header */}
      <div className="text-center mb-14 px-4">
        <h2 className="text-center font-cinzel font-bold uppercase text-[18px] sm:text-[22px] md:text-[28px] lg:text-[36px] leading-tight lg:leading-[49px] text-[#a94f1d] mb-4 sm:mb-5 lg:mb-6">
          Meet the Artisans
        </h2>

        <p className="mt-3 text-[#a94f1d]/80 max-w-xl mx-auto">
          Five women. Five stories. One shared devotion to food, family, and craft.
        </p>
      </div>

      {/* Carousel */}
      <div className="relative flex items-center justify-center h-[480px] perspective-[1400px]">
        {/* Prev */}
        <button
          onClick={() => setActive((p) => (p === 0 ? artisans.length - 1 : p - 1))}
          className="absolute left-6 z-40 w-12 h-12 rounded-full bg-[#a94f1d] text-white flex items-center justify-center shadow-lg"
        >
          <ChevronLeft />
        </button>

        {/* Next */}
        <button
          onClick={() => setActive((p) => (p === artisans.length - 1 ? 0 : p + 1))}
          className="absolute right-6 z-40 w-12 h-12 rounded-full bg-[#a94f1d] text-white flex items-center justify-center shadow-lg"
        >
          <ChevronRight />
        </button>

        {/* Cards */}
        {artisans.map((item, index) => {
          const offset = getOffset(index);
          const isActive = offset === 0;

          return (
            <motion.div
              key={item.id}
              onClick={() => setActive(index)}
              className="absolute cursor-pointer"
              style={{ transformStyle: "preserve-3d" }}
              animate={{
                x: offset * 160,          // 🔥 no gap like Figma
                scale: isActive ? 1 : 0.82,
                rotateY: offset * -12,    // 🔥 subtle 3D
                opacity: isActive ? 1 : 0.45,
                zIndex: isActive ? 30 : 20 - Math.abs(offset),
              }}
              transition={{ type: "spring", stiffness: 120, damping: 22 }}
            >
              <div
                className={`relative overflow-hidden rounded-2xl shadow-2xl
                ${isActive ? "w-[300px] h-[420px]" : "w-[240px] h-[340px]"}`}
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  priority={isActive}
                />

                {/* Active Overlay */}
                {isActive && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] text-center text-white">
                      <h3 className="text-[20px] font-semibold leading-tight">
                        {item.name}
                      </h3>

                      {/* Yellow pill (exact Figma feel) */}
                      <div className="mt-2 flex justify-center">
                        <span className="bg-[#f2b705] text-black text-sm font-medium px-4 py-1 rounded-full">
                          {item.role}
                        </span>
                      </div>

                      <p className="mt-3 text-sm text-white/90 leading-snug">
                        {item.description}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="flex justify-center mt-12">
        <button className="bg-[#a94f1d] text-white px-8 py-3 rounded-lg font-semibold hover:scale-105 transition">
          Meet Our Full Team
        </button>
      </div>
    </section>
  );
}
