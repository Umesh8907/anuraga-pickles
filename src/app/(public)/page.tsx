import Hero from '@/components/features/home/Hero'
import FeaturedProducts from '@/components/features/home/FeaturedProducts'
import Journey from '@/components/features/home/Journey'
import Testimonial from '@/components/features/home/Testimonial'
import FAQ from '@/components/features/home/FAQ'
import CarouselCard from '@/components/features/home/CarouselCard'
import HowItsMade from '@/components/features/home/Howitsmade'
import WhyAnuraga from '@/components/features/home/WhyAnuraga'
import React from 'react'


export default function Home() {
    return (
        <main className="min-h-screen">
            <Hero />
            <FeaturedProducts />
            <WhyAnuraga />
            <CarouselCard />
            <HowItsMade />
            <FAQ />


    
            <Testimonial />
            
        </main>
    )
}
