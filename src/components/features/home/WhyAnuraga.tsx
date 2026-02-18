'use client'

import Image from 'next/image'
import icon from '@/assets/whyanuraga.png'
import whyBg from '@/assets/whyanuraga-bg.png'

const data = [
  {
    title: 'Holistic Wellness',
    desc: 'Not just organic, but nourishing for the long run',
  },
  {
    title: 'South Indian\nAuthentic',
    desc: 'Recipes rooted in tradition, taste you can trust',
  },
  {
    title: 'Women-Led\nExcellence',
    desc: 'Made by artisans who understand food is love',
  },
  {
    title: 'Transparent Always',
    desc: 'Ingredients you recognize, no preservatives, no shortcuts',
  },
]

const WhyAnuraga = () => {
  return (
    <section id="whyanuraga" className="relative w-full overflow-hidden bg-[#FDEAA3]">

      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-0">
        <Image
          src={whyBg}
          alt="Why Anuraga Background"
          fill
          priority
          className="object-cover opacity-40"
        />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16 py-16 sm:py-20 lg:py-24">

        {/* TITLE */}
        <h2 className="text-center font-cinzel font-bold text-[18px] sm:text-[22px] md:text-[28px] lg:text-[36px] leading-tight lg:leading-[49px] text-[#C7602E] mb-12 sm:mb-14 lg:mb-16">
          WHY ANURAGA
        </h2>

        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
          {data.map((item, i) => (
            <div
              key={i}
              className="bg-[#064E3B] rounded-[32px] px-4 sm:px-5 lg:px-6 py-5 sm:py-6 lg:py-8 text-center flex flex-col items-center min-h-[300px] sm:min-h-[320px] lg:min-h-[340px]"
            >
              {/* ICON */}
              <div className="w-[160px] sm:w-[180px] lg:w-[200px] h-[160px] sm:h-[180px] lg:h-[200px] bg-white rounded-full flex items-center justify-center mb-5 sm:mb-6 lg:mb-7">
                <Image
                  src={icon}
                  alt={item.title}
                  width={140}   // increased size
                  height={140}  // increased size
                  className="object-contain"
                />
              </div>


              {/* TITLE */}
              <h3 className="text-white text-[16px] sm:text-[18px] md:text-[18px] font-semibold leading-tight mb-2 sm:mb-3 lg:mb-4 whitespace-pre-line">
                {item.title}
              </h3>

              {/* DESCRIPTION */}
              <p className="text-white/90 text-[14px] sm:text-[14px] md:text-[15px] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyAnuraga
