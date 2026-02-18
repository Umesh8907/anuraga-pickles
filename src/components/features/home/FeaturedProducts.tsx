'use client'

import React from 'react';
import Link from 'next/link'
import ProductCard from '@/components/features/product/ProductCard'
import { useFeaturedProducts } from '@/hooks/useProducts';
import { Loader2 } from 'lucide-react';

export default function FeaturedProducts() {
    const { data: products, isLoading, isError } = useFeaturedProducts();

    if (isLoading) {
        return (
            <div className="py-24 text-center flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-amber-600" />
                <p className="text-stone-500 font-medium">Preparing our featured delights...</p>
            </div>
        );
    }

    if (isError || !products || products.length === 0) {
        return null; // Or show a fallback
    }

    return (
        <section className="py-24 bg-stone-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-center font-cinzel font-bold uppercase text-[18px] sm:text-[22px] md:text-[28px] lg:text-[36px] leading-tight lg:leading-[49px] text-[#a94f1d] mb-4 sm:mb-5 lg:mb-6">Our Signature Collection</h2>
                    <p className="mt-3 text-[#a94f1d]/80 max-w-xl mx-auto">
                        Handcrafted with tradition, shared with love. Explore our most popular Andhra pickles.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>

                <div className="text-center mt-16">
                    <Link
                        href="/collections/all-products"
                        className="inline-flex items-center gap-2 bg-white border-2 border-[#C1572A73] text-[#C1572A] hover:bg-[#C1572A] hover:text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 shadow-sm"
                    >
                        View Full Collection
                        <span className="text-lg">&rarr;</span>
                    </Link>
                </div>
            </div>
        </section>
    )
}
