import { Star } from 'lucide-react'

const TESTIMONIALS = [
    {
        id: 1,
        name: 'Priya Reddy',
        role: 'Home Chef',
        comment: 'The Mango Avakai takes me back to my childhood summers in Andhra. The spice level is just perfect!',
        rating: 5,
    },
    {
        id: 2,
        name: 'Rahul Sharma',
        role: 'Bangalore',
        comment: 'I have tried many brands, but the authenticity of Anuraga Pickles is unmatched. The garlic pickle is a must-try.',
        rating: 5,
    },
    {
        id: 3,
        name: 'Sneha Kapoor',
        role: 'Mumbai',
        comment: 'Fast delivery and amazing packaging. The jars are so cute and the pickle tastes homemade.',
        rating: 5,
    }
]

export default function Testimonials() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">Loved by 10,000+ Customers</h2>
                    <p className="text-lg text-stone-600 max-w-2xl mx-auto">
                        Don't just take our word for it. Here is what our community has to say.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {TESTIMONIALS.map((t) => (
                        <div key={t.id} className="bg-stone-50 p-8 rounded-2xl border border-stone-100 flex flex-col h-full hover:border-amber-200 transition-colors">
                            <div className="flex text-amber-500 mb-4">
                                {[...Array(t.rating)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-current" />
                                ))}
                            </div>
                            <p className="text-stone-700 italic mb-6 grow">"{t.comment}"</p>
                            <div>
                                <h4 className="font-bold text-stone-900">{t.name}</h4>
                                <span className="text-sm text-stone-500">{t.role}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
