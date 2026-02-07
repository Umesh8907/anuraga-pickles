'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Heart, ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Product } from '@/types'
import { useAddToCart } from '@/hooks/useCart'
import { useWishlist, useAddToWishlist, useRemoveFromWishlist } from '@/hooks/useWishlist'
import { useAuthModalStore } from '@/store/useAuthModalStore'
import { useUser } from '@/hooks/useAuth'

interface ProductCardProps {
    product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
    const defaultVariant = product.variants?.find(v => v.isDefault) || product.variants?.[0];
    const [selectedVariant, setSelectedVariant] = useState(defaultVariant)

    const { data: user } = useUser();
    const { data: wishlist } = useWishlist();
    const { mutate: addToWishlist } = useAddToWishlist();
    const { mutate: removeFromWishlist } = useRemoveFromWishlist();
    const { openModal } = useAuthModalStore();
    const { mutate: addToCart } = useAddToCart();

    const isWishlisted = wishlist?.products.some(p => p._id === product._id) || false;

    const mainImage = product.images?.[0] || 'https://placehold.co/600x400?text=No+Image';

    const price = selectedVariant?.price || 0;
    const mrp = selectedVariant?.mrp || price;
    const discount = mrp > price
        ? Math.round(((mrp - price) / mrp) * 100)
        : 0;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        if (!selectedVariant) return;

        addToCart({
            productId: product._id,
            variantId: selectedVariant._id,
            quantity: 1
        });
    }

    const toggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault()
        if (!user) {
            openModal('LOGIN');
            return;
        }

        if (isWishlisted) {
            removeFromWishlist(product._id);
        } else {
            addToWishlist(product._id);
        }
    }

    return (
        <div className="group bg-white rounded-xl overflow-hidden border border-stone-100 hover:border-brand-teal shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full relative">
            <Link href={`/products/${product.slug}`} className="block relative h-64 overflow-hidden">
                <img
                    src={mainImage}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Collections as tags */}
                {product.collections && product.collections[0] && (
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-amber-800 text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider shadow-sm">
                        {typeof product.collections[0] === 'string' ? product.collections[0] : product.collections[0].name}
                    </span>
                )}

                {/* Wishlist Button */}
                <button
                    onClick={toggleWishlist}
                    className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-stone-400 hover:text-red-500 hover:bg-white transition-colors shadow-sm"
                >
                    <Heart className={cn("w-4 h-4", isWishlisted && "fill-current text-red-500")} />
                </button>
            </Link>

            <div className="p-5 flex flex-col flex-grow">
                <Link href={`/products/${product.slug}`}>
                    <h3 className="text-lg font-bold text-stone-800 mb-1 line-clamp-1 group-hover:text-brand-teal transition-colors">
                        {product.name}
                    </h3>
                </Link>

                {/* Price Section */}
                <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-lg font-bold text-stone-900">₹{price}</span>
                    {discount > 0 && (
                        <>
                            <span className="text-sm text-stone-400 line-through">₹{mrp}</span>
                            <span className="text-xs font-bold text-green-600">({discount}% OFF)</span>
                        </>
                    )}
                </div>

                {/* Variant Selector (Size Chooser) */}
                {product.variants && product.variants.length > 0 ? (
                    <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                            {product.variants.map((variant) => (
                                <button
                                    key={variant._id}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setSelectedVariant(variant);
                                    }}
                                    className={cn(
                                        "px-2.5 py-1 text-xs font-bold rounded-md transition-all border",
                                        selectedVariant?._id === variant._id
                                            ? "bg-brand-amber text-white border-brand-amber shadow-sm"
                                            : "bg-white text-stone-600 border-stone-200 hover:border-brand-teal hover:bg-stone-50"
                                    )}
                                >
                                    {variant.label}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="mb-4 h-6"></div> // Placeholder for spacing
                )}

                {/* Add to Cart */}
                <div className="mt-auto pt-2">
                    <button
                        onClick={handleAddToCart}
                        disabled={!selectedVariant || selectedVariant.stock <= 0}
                        className={cn(
                            "w-full flex items-center justify-center gap-2 py-2.5 rounded-lg transition-colors font-medium text-sm",
                            (!selectedVariant || selectedVariant.stock <= 0)
                                ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                                : "bg-brand-teal hover:brightness-110 text-white shadow-lg shadow-brand-teal/10"
                        )}
                    >
                        {(!selectedVariant || selectedVariant.stock <= 0) ? (
                            "Out of Stock"
                        ) : (
                            <>
                                <ShoppingBag className="w-4 h-4" />
                                Add to Cart
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
