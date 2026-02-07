'use client'

import React from 'react'
import { useProductsByCollection, useProducts } from '@/hooks/useProducts'
import ProductCard from '@/components/features/product/ProductCard'
import { Loader2 } from 'lucide-react'

interface CollectionClientProps {
    slug: string;
}

export default function CollectionClient({ slug }: CollectionClientProps) {
    const isAllProducts = slug === 'all-products';

    const { data: collectionProducts, isLoading: isColLoading } = useProductsByCollection(isAllProducts ? '' : slug);
    const { data: allProductsData, isLoading: isAllLoading } = useProducts({ limit: 50 }, { enabled: isAllProducts });

    const isLoading = isAllProducts ? isAllLoading : isColLoading;
    const products = isAllProducts ? allProductsData?.data : collectionProducts;

    if (isLoading) {
        return (
            <div className="py-24 text-center flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-amber-600" />
                <p className="text-stone-500 font-medium italic">Finding the best picks for you...</p>
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="py-24 text-center">
                <p className="text-stone-500 font-medium italic">No products found in this collection yet.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
                <ProductCard key={product._id} product={product} />
            ))}
        </div>
    )
}
