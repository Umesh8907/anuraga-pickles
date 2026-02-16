"use client";

import Image, { StaticImageData } from "next/image";
import { useMemo, useState } from "react";

// ✅ Import your images from src/assets
import leftTree from "@/assets/left-tree.png";
import rightTree from "@/assets/right-tree.png";

import profile1 from "@/assets/profile.png";
import profile2 from "@/assets/profile.png";
import profile3 from "@/assets/profile.png";

type Testimonial = {
    id: number;
    quote: string;
    name: string;
    role: string;
    location: string;
    stars: number;
    profile: StaticImageData;
};

const testimonials: Testimonial[] = [
    {
        id: 1,
        quote:
            "“ANURAGA doesn’t taste like a store-bought pickle—it tastes like something my grandmother would make with patience and care.”",
        name: "Bruce Hardy",
        role: "Content Creator",
        location: "Raipur, Chhattisgarh",
        stars: 5,
        profile: profile1,
    },
    {
        id: 2,
        quote:
            "“ANURAGA doesn’t taste like a store-bought pickle—it tastes like something my grandmother would make with patience and care.”",
        name: "Bruce Hardy",
        role: "Content Creator",
        location: "Raipur, Chhattisgarh",
        stars: 5,
        profile: profile2,
    },
    {
        id: 3,
        quote:
            "“ANURAGA doesn’t taste like a store-bought pickle—it tastes like something my grandmother would make with patience and care.”",
        name: "Bruce Hardy",
        role: "Content Creator",
        location: "Raipur, Chhattisgarh",
        stars: 5,
        profile: profile3,
    },
];

export default function Testimonials() {
    const [active, setActive] = useState(0);

    const total = testimonials.length;

    const visible = useMemo(() => {
        // show 3 always on desktop
        const t1 = testimonials[active % total];
        const t2 = testimonials[(active + 1) % total];
        const t3 = testimonials[(active + 2) % total];
        return [t1, t2, t3];
    }, [active, total]);

    const next = () => setActive((p) => (p + 1) % total);
    const prev = () => setActive((p) => (p - 1 + total) % total);

    return (
        <section className="relative w-full overflow-hidden bg-[#fbf3c7] px-4 py-16 sm:px-6 lg:px-10">
            {/* LEFT TREE */}
            <div className="pointer-events-none absolute bottom-0 left-0 hidden h-full md:block">
                <Image
                    src={leftTree}
                    alt="Tree decoration"
                    className="h-full w-auto object-contain"
                    priority
                />
            </div>


            {/* RIGHT TREE */}
            <div className="pointer-events-none absolute bottom-0 right-0 hidden w-[220px] md:block">
                <Image src={rightTree} alt="Tree decoration" className="h-auto w-full" />
            </div>

            <div className="relative mx-auto max-w-6xl">
                {/* Heading */}
                <div className="text-center">
                    <h2 className="text-[26px] font-cinzel font-semibold tracking-wide text-[#b54a1c] sm:text-3xl">
                        LOVED BY FAMILIES, TRUSTED FOR 
                        <br className="hidden sm:block" />
                        GENERATIONS
                    </h2>

                    <p className="mx-auto mt-3 max-w-2xl text-sm text-[#000000] sm:text-base">
                        Real stories from people who bring our pickles to their
                        <br className="hidden sm:block" />
                        tables and into their traditions.
                    </p>
                </div>

                {/* Cards */}
                <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {visible.map((t) => (
                        <TestimonialCard key={t.id} t={t} />
                    ))}
                </div>

                {/* Slider line */}
                <div className="mx-auto mt-10 flex max-w-xl items-center gap-3">
                    <button
                        onClick={prev}
                        className="rounded-full bg-white/40 px-3 py-2 text-sm font-semibold text-black/70 transition hover:bg-white/70"
                    >
                        ←
                    </button>

                    <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-black/20">
                        <div
                            className="absolute left-0 top-0 h-full w-[35%] rounded-full bg-[#0a4f43] transition-all duration-500"
                            style={{
                                transform: `translateX(${(active / total) * 100}%)`,
                            }}
                        />
                    </div>

                    <button
                        onClick={next}
                        className="rounded-full bg-white/40 px-3 py-2 text-sm font-semibold text-black/70 transition hover:bg-white/70"
                    >
                        →
                    </button>
                </div>

                {/* Button */}
                <div className="mt-10 flex justify-center">
                    <button className="rounded-lg bg-[#b54a1c] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.02]">
                        Shop Ginger Pickle (₹399)
                    </button>
                </div>
            </div>
        </section>
    );
}

/* ---------------- CARD ---------------- */

function TestimonialCard({ t }: { t: Testimonial }) {
    return (
        <div className="rounded-xl bg-[#f1b400] p-5 shadow-md">
            {/* Quote */}
            <p className="text-sm leading-relaxed text-[#6D3200]">{t.quote}</p>

            {/* Bottom row */}
            <div className="mt-6 flex items-center justify-between gap-3">
                {/* Profile */}
                <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 overflow-hidden rounded-full border text-[#8B2900] border-black/10">
                        <Image
                            src={t.profile}
                            alt={t.name}
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-[#000000]">{t.name}</p>
                        <p className="text-[12px] text-[#000000]">
                            {t.role}
                            <br />
                            {t.location}
                        </p>
                    </div>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1">
                    {Array.from({ length: t.stars }).map((_, i) => (
                        <span key={i} className="text-sm text-white">
                            ★
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
