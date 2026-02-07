import Link from 'next/link'
import ProductCard from '@/components/features/product/ProductCard'

// Mock Data featuring MRP and Sizes
const PRODUCTS = [
    {
        id: 'mango-avakai',
        name: 'Mango Avakai',
        price: 250,
        mrp: 350,
        image: 'https://images.unsplash.com/photo-1589135234696-26759eb5e574?q=80&w=2670&auto=format&fit=crop',
        tag: 'Bestseller',
        sizes: ['250g', '500g', '1kg']
    },
    {
        id: 'gongura-pickle',
        name: 'Gongura Pickle',
        price: 220,
        mrp: 300,
        image: 'https://images.unsplash.com/photo-1621996659490-6213b5eb5321?q=80&w=2670&auto=format&fit=crop',
        tag: 'Spicy',
        sizes: ['250g', '500g']
    },
    {
        id: 'lemon-pickle',
        name: 'Lemon Pickle',
        price: 200,
        mrp: 280,
        image: 'https://images.unsplash.com/photo-1599636653378-7b960be24c4d?q=80&w=2670&auto=format&fit=crop',
        tag: 'Traditional',
        sizes: ['250g', '500g', '1kg']
    },
    {
        id: 'garlic-pickle',
        name: 'Garlic Pickle',
        price: 280,
        mrp: 380,
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=2670&auto=format&fit=crop',
        tag: 'New',
        sizes: ['250g', '500g']
    }
]

export default function FeaturedProducts() {
    return (
        <section className="py-24 bg-stone-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">Featured Delights</h2>
                    <p className="text-lg text-stone-600 max-w-2xl mx-auto">
                        Our most loved pickles, made with hand-picked ingredients and age-old recipes.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {PRODUCTS.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link href="/collections/all-products" className="inline-flex items-center text-amber-700 font-semibold hover:text-amber-800 hover:underline">
                        View All Products &rarr;
                    </Link>
                </div>
            </div>
        </section>
    )
}
