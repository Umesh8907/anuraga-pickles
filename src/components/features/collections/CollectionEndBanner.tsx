"use client";

import Image from "next/image";

import leftLeaves from "@/assets/left-leaves.png";
import rightLeaves from "@/assets/right-leaves.png";

export default function CollectionEndBanner() {
  return (
    <section className="relative w-full bg-[#dff0c6] py-10 sm:py-14">
      {/* LEFT IMAGE */}
      <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 sm:left-8">
        <Image
          src={leftLeaves}
          alt="Leaves decoration"
          priority
          className="h-[70px] w-auto object-contain sm:h-[90px] md:h-[110px] lg:h-[130px]"
        />
      </div>

      {/* RIGHT IMAGE */}
      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 sm:right-8">
        <Image
          src={rightLeaves}
          alt="Leaves decoration"
          priority
          className="h-[70px] w-auto object-contain sm:h-[90px] md:h-[110px] lg:h-[130px]"
        />
      </div>

      {/* TEXT */}
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 text-center">
        {/* Poppins */}
        <p className="font-poppins text-[18px] font-medium leading-[1] text-[#0a4d3c] sm:text-[26px] md:text-[32px]">
          Hey, you made it to the end of the page
        </p>

        {/* Caveat Brush */}
        <h2 className="mt-4 font-caveat text-[#346800] text-center font-normal leading-[1.05] text-[32px] sm:text-[48px] md:text-[68px] lg:text-[90px] xl:text-[100px]">
          Don&apos;t forget to <br />
          Take Care, have fun!
        </h2>
      </div>
    </section>
  );
}