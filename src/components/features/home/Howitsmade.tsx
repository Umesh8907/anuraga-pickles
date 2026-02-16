import Image, { StaticImageData } from "next/image";

// ✅ Import your images from src/assets
import sourcingImg from "@/assets/Sourcing.png";
import preparationImg from "@/assets/Preparation.png";
import qualityImg from "@/assets/QualityCheck.png";
import packagingImg from "@/assets/Packaging.png";
import deliveryImg from "@/assets/Delivary.png";

type Step = {
  id: number;
  title: string;
  desc: string;
  image: StaticImageData;
  side: "left" | "right";
};

const steps: Step[] = [
  {
    id: 1,
    title: "Sourcing",
    desc: "Local, seasonal ingredients sourced directly from trusted farmers.",
    image: sourcingImg,
    side: "left",
  },
  {
    id: 2,
    title: "Preparation",
    desc: "Vegetables are washed, cut, and sun-dried before being mixed with spices in small batches.",
    image: preparationImg,
    side: "right",
  },
  {
    id: 3,
    title: "Quality Check",
    desc: "Each batch of pickle is tasted and inspected to ensure balanced flavor and safety.",
    image: qualityImg,
    side: "left",
  },
  {
    id: 4,
    title: "Packaging",
    desc: "Pickles are carefully packed into clean jars using minimal, sustainable materials.",
    image: packagingImg,
    side: "right",
  },
  {
    id: 5,
    title: "Delivery",
    desc: "Freshly prepared pickles are sealed and delivered to your doorstep with care.",
    image: deliveryImg,
    side: "left",
  },
];

export default function HowItsMade() {
  return (
    <section className="w-full bg-white px-4 py-14 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-center font-cinzel font-bold text-[18px] sm:text-[22px] md:text-[28px] lg:text-[36px] leading-tight lg:leading-[49px] text-[#1f1f1f]">
            HOW ITS MADE
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm text-black/60 sm:text-base">
            Five women. Five stories. One shared devotion to food, family, and
            craft.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative mx-auto mt-14 max-w-5xl">
          {/* Center vertical line (desktop only) */}
          <div className="absolute left-1/2 top-0 hidden h-full w-[2px] -translate-x-1/2 bg-[#d9d9d9] md:block" />

          <div className="flex flex-col gap-16 md:gap-24">

            {steps.map((step) => (
              <TimelineRow key={step.id} step={step} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- ROW ---------------- */

function TimelineRow({ step }: { step: Step }) {
  const isLeft = step.side === "left";

  return (
    <div className="relative grid grid-cols-1 items-center gap-6 md:grid-cols-2 md:gap-14">
      {/* Dot */}
      <div className="absolute left-1/2 top-1/2 hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0a8a00] md:block" />

      {/* DESKTOP ONLY */}
      {/* LEFT COLUMN */}
      <div className="hidden md:block">
        {isLeft ? (
          // LEFT step => IMAGE on LEFT
          <ImageBox img={step.image} alt={step.title} align="left" />
        ) : (
          // RIGHT step => TEXT on LEFT
          <TextBox title={step.title} desc={step.desc} align="right" />
        )}
      </div>

      {/* RIGHT COLUMN */}
      <div className="hidden md:block">
        {isLeft ? (
          // LEFT step => TEXT on RIGHT
          <TextBox title={step.title} desc={step.desc} align="left" />
        ) : (
          // RIGHT step => IMAGE on RIGHT
          <ImageBox img={step.image} alt={step.title} align="right" />
        )}
      </div>

      {/* MOBILE ONLY (stack) */}
      <div className="md:hidden">
        <div className="flex flex-col gap-4">
          <ImageBox img={step.image} alt={step.title} align="mobile" />
          <TextBox title={step.title} desc={step.desc} align="mobile" />
        </div>
      </div>
    </div>
  );
}

/* ---------------- IMAGE ---------------- */

function ImageBox({
  img,
  alt,
  align,
}: {
  img: StaticImageData;
  alt: string;
  align: "left" | "right" | "mobile";
}) {
  return (
    <div
      className={`relative h-[160px] w-full max-w-[360px] overflow-hidden rounded-xl shadow-md sm:h-[180px] ${
        align === "left"
          ? "ml-auto"
          : align === "right"
          ? "mr-auto"
          : ""
      }`}
    >
      <Image src={img} alt={alt} fill className="object-cover" />
    </div>
  );
}

/* ---------------- TEXT ---------------- */

function TextBox({
  title,
  desc,
  align,
}: {
  title: string;
  desc: string;
  align: "left" | "right" | "mobile";
}) {
  return (
    <div
      className={`max-w-[360px] min-h-[140px] flex flex-col justify-center ${
        align === "right"
          ? "ml-auto text-right"
          : align === "left"
          ? "mr-auto text-left"
          : "text-left"
      }`}
    >
      <h3 className="text-[20px] font-semibold text-black">
        {title}
      </h3>

      <p className="mt-4 text-[15px] leading-[1.75] text-black/60">
        {desc}
      </p>
    </div>
  );
}
