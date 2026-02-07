import Hero from '@/components/features/home/Hero'
import FeaturedProducts from '@/components/features/home/FeaturedProducts'
import Journey from '@/components/features/home/Journey'
import Testimonials from '@/components/features/home/Testimonials'
import FAQ from '@/components/features/home/FAQ'

export default function Home() {
    return (
        <main className="min-h-screen">
            <Hero />
            <FeaturedProducts />
            <Journey />
            <Testimonials />
            <FAQ />
        </main>
    )
}
