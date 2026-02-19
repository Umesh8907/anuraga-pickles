'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Plus, Minus, ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Product } from '@/types'
import { useAddToCart } from '@/hooks/useCart'

interface FrequentlyBoughtCardProps {
    product: Product
}

export default function FrequentlyBoughtCard({ product }: FrequentlyBoughtCardProps) {
    // Select default variant (same logic as ProductCard)
    const defaultVariant = product.variants?.find(v => v.isDefault) || product.variants?.[0];
    const [selectedVariant, setSelectedVariant] = useState(defaultVariant);
    const [quantity, setQuantity] = useState(1);

    const { mutate: addToCart } = useAddToCart();

    const mainImage = product.images?.[0] || 'https://placehold.co/600x600?text=No+Image';
    const price = selectedVariant?.price || 0;
    const mrp = selectedVariant?.mrp || price;

    const handleAddToCart = () => {
        if (!selectedVariant) return;

        addToCart({
            product: product,
            variantId: selectedVariant._id,
            quantity
        });
    }

    const increaseQty = () => setQuantity(prev => prev + 1);
    const decreaseQty = () => setQuantity(prev => Math.max(1, prev - 1));

    return (
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden flex flex-col sm:flex-row p-4 gap-6 transition-shadow hover:shadow-lg min-w-[320px] max-w-[600px]">
            {/* Image Section */}
            <div className="w-32 h-32 shrink-0 bg-[#B59443] rounded-2xl overflow-hidden self-center sm:self-start">
                {/* Using a gold/brown bg similar to the reference image for the image container */}
                <img
                    src={mainImage}
                    alt={product.name}
                    className="w-full h-full object-cover mix-blend-multiply opacity-90 hover:scale-105 transition-transform duration-500"
                />
            </div>

            {/* Details Section */}
            <div className="flex flex-col flex-1 justify-between">
                <div>
                    <Link href={`/products/${product.slug}`}>
                        <h3 className="text-lg font-bold text-stone-900 leading-tight mb-2 hover:text-[#A0522D] transition-colors">
                            {product.name}
                        </h3>
                    </Link>

                    <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-xl font-bold text-stone-900">₹{price.toFixed(2)}</span>
                        <span className="text-xs text-stone-500 font-medium">(Inclusive of all taxes)</span>
                    </div>

                    {mrp > price && (
                        <div className="text-sm text-stone-400 line-through mb-4">
                            M.R.P - ₹{mrp.toFixed(2)}
                        </div>
                    )}
                </div>

                {/* Actions Row */}
                <div className="flex items-center gap-4 mt-4">
                    {/* Quantity Selector */}
                    <div className="flex items-center bg-stone-50 rounded-lg border border-stone-200 h-10 px-1">
                        <button
                            onClick={decreaseQty}
                            className="w-8 h-full flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-bold text-stone-900 text-sm">{quantity}</span>
                        <button
                            onClick={increaseQty}
                            className="w-8 h-full flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        onClick={handleAddToCart}
                        disabled={!selectedVariant || selectedVariant.stock === 0}
                        className={cn(
                            "flex-1 h-10 px-6 rounded-lg font-bold text-sm tracking-wide uppercase transition-all shadow-md active:translate-y-0.5",
                            selectedVariant?.stock === 0
                                ? "bg-stone-300 text-stone-500 cursor-not-allowed shadow-none"
                                : "bg-[#A0522D] hover:bg-[#8B4513] text-white shadow-[#A0522D]/20 hover:shadow-[#A0522D]/40"
                        )}
                    >
                        {selectedVariant?.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    )
}
