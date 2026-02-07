import Link from 'next/link'

export default function Hero() {
    return (
        <section className="relative bg-amber-900 text-white py-32 overflow-hidden">
            {/* Background Pattern/Image Overlay */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1597362925123-77861d3fbac7?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-950/90 to-amber-900/40"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-start justify-center h-full">
                <span className="text-amber-400 font-bold tracking-wider uppercase mb-4 text-sm md:text-base">Grandma's Secret Recipe</span>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                    Authentic South Indian <br />
                    <span className="text-amber-400">Pickles & Spices</span>
                </h1>
                <p className="text-lg md:text-xl text-stone-200 mb-8 max-w-2xl leading-relaxed">
                    Handmade with organic ingredients, traditional methods, and lots of love. Experience the nostalgia of home in every bite.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href="/collections/all-products"
                        className="px-8 py-4 bg-amber-500 text-amber-950 font-bold rounded-lg hover:bg-amber-400 transition transform hover:-translate-y-1 shadow-lg shadow-amber-900/50"
                    >
                        Shop All Pickles
                    </Link>
                    <Link
                        href="/collections/combos"
                        className="px-8 py-4 bg-transparent border-2 border-stone-400 text-stone-100 font-bold rounded-lg hover:bg-white/10 transition backdrop-blur-sm"
                    >
                        Explore Combos
                    </Link>
                </div>
            </div>
        </section>
    )
}
