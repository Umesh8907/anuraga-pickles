import { Sun, Leaf, UtensilsCrossed, ShieldCheck } from 'lucide-react'

const STEPS = [
    {
        title: 'Sourcing Ingredients',
        description: 'We source the finest raw mangoes, lemons, and spices directly from organic farmers in Guntur and Vijayawada.',
        icon: Leaf
    },
    {
        title: 'Traditional Preparation',
        description: 'Cleaned, cut, and marinated using Grandma’s secret ratios of oil and spices without any preservatives.',
        icon: UtensilsCrossed
    },
    {
        title: 'Sun Drying',
        description: 'Naturally sun-dried for days to enhance shelf life and concentrate the flavors naturally.',
        icon: Sun
    },
    {
        title: 'Hygienic Packaging',
        description: 'Packed in sterilized glass jars to retain freshness and flavor for months.',
        icon: ShieldCheck
    }
]

export default function Journey() {
    return (
        <section className="py-24 bg-amber-50">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-amber-600 font-semibold tracking-wider uppercase text-sm">Our Process</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mt-2 mb-4">From Our Kitchen to Your Table</h2>
                    <p className="text-lg text-stone-600 max-w-2xl mx-auto">
                        We believe in the slow, traditional way of making pickle — no shortcuts, just pure love and patience.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-amber-200 -z-10 transform translate-y-4"></div>

                    {STEPS.map((step, index) => (
                        <div key={index} className="flex flex-col items-center text-center group">
                            <div className="w-16 h-16 bg-white border-2 border-amber-400 rounded-full flex items-center justify-center text-amber-600 shadow-md mb-6 group-hover:scale-110 transition-transform duration-300">
                                <step.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-stone-800 mb-3">{step.title}</h3>
                            <p className="text-stone-600 leading-relaxed text-sm">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
