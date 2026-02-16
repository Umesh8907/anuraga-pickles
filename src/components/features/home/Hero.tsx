'use client'

import Image from 'next/image'
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

import heroBg from '@/assets/hero-bg.png'
import rightHero from '@/assets/right-hero.png'
import pickleJar from '@/assets/pickle-jar.png'
import arrow from '@/assets/arrow.png'

const features = [
    'FSSAI Certified',
    'Women-Led MSME',
    '100% Vegetarian',
    'Preservative-Free',
]

const HeroSection = () => {
    return (
        <section className="relative w-full min-h-[550px] md:min-h-[650px] lg:min-h-[720px] overflow-hidden bg-[#FFF9EC] pb-12 lg:pb-0">


            {/* HERO BG */}
            <div className="absolute -top-32 left-0 w-full h-[calc(100%+9rem)] z-0">
                <Image
                    src={heroBg}
                    alt="Hero Background"
                    fill
                    priority
                    className="object-cover"
                />
            </div>

            {/* RIGHT HERO BG */}
            <div className="absolute -top-32 right-0 h-[calc(100%+9rem)] w-[380px] z-10 hidden lg:block">
                <Image
                    src={rightHero}
                    alt="Right Hero"
                    fill
                    className="object-cover"
                />
            </div>

            {/* CONTENT */}
            <div className="relative z-20 max-w-[1440px] mx-auto px-6 lg:px-16 pt-[90px] sm:pt-[110px] md:pt-[130px] lg:pt-[40px] lg:-translate-y-20">

                {/* Reduced padding to move content up */}
                <div className="flex flex-col lg:flex-row justify-between items-center gap-12">

                    {/* LEFT TEXT */}
                    <div className="max-w-[700px]">

                        {/* HEADING */}
                        <h1 className="font-cinzel font-display font-bold text-[#1F1F1F] leading-[1] tracking-[-0.02em] text-[28px] sm:text-[36px] lg:text-[48px]">
                            TASTE OF LOVE <span className="text-[#C76A2A]">| FOOD</span>
                            <br />
                            THAT <span className="text-[#C76A2A]">NOURISHES</span> YOUR SOUL
                        </h1>

                        {/* SUB TEXT */}
                        <p className="mt-4 text-[18px] text-gray-700 max-w-xl">
                            Preservative-free South Indian delicacies, crafted by women artisans
                        </p>

                        {/* FEATURES */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 mt-8 max-w-md">
                            {features.map((item) => (
                                <div key={item} className="flex items-center gap-3">
                                    <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#F6C100]">
                                        <ShieldCheckIcon className="w-5 h-5 text-[#FFFFFF]" />
                                    </div>
                                    <span className="text-sm font-medium text-[#1F1F1F]">
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>



                        <div className="flex flex-col sm:flex-row gap-4 mt-10 w-full sm:w-auto">
                            <button className="bg-[#C76A2A] text-white px-[22px] py-[13px] rounded-[8px] font-poppins font-semibold text-[16px] leading-[100%] flex items-center justify-center text-center w-full sm:w-auto">
                                Shop Ginger Pickle (₹399)
                            </button>

                            <button className="w-full sm:w-[194px] h-[50px] bg-white border-2 border-[#C1572A73] rounded-[8px] px-[22px] py-[13px] text-[#C1572A] font-medium text-sm flex items-center justify-center gap-[10px] hover:bg-[#C1572A] hover:text-white transition">
                                Discover Our Story
                            </button>
                        </div>

                    </div>

                    {/* RIGHT VISUAL */}
                    <div className="relative hidden lg:flex items-start justify-end w-[480px] h-[900px]">
                        <Image
                            src={arrow}
                            alt="Arrow"
                            width={90}
                            height={55}
                            className="absolute top-24 left-0 z-20"
                        />

                        <Image
                            src={pickleJar}
                            alt="Pickle Jar"
                            width={420}
                            height={820}
                            className="relative z-30 mt-24"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection
