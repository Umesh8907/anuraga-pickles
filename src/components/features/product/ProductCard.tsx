'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Heart, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { cn } from '@/lib/utils'

interface Product {
    id: string
    name: string
    image: string
    price: number
    mrp: number
    sizes: string[]
    tag?: string
}

interface ProductCardProps {
    product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
    const [selectedSize, setSelectedSize] = useState(product.sizes[0])
    const [isWishlisted, setIsWishlisted] = useState(false)
    const addItem = useCartStore((state) => state.addItem)

    const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100)

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault() // Prevent navigation if wrapped in Link
        addItem({
            ...product,
            selectedSize,
            quantity: 1
        })
        // Optional: Add toast notification here
    }

    const toggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault()
        setIsWishlisted(!isWishlisted)
    }

    return (
        <div className="group bg-white rounded-xl overflow-hidden border border-stone-100 hover:border-amber-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full relative">
            <Link href={`/products/${product.id}`} className="block relative h-64 overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Tag */}
                {product.tag && (
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-amber-800 text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider shadow-sm">
                        {product.tag}
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
                <Link href={`/products/${product.id}`}>
                    <h3 className="text-lg font-bold text-stone-800 mb-1 line-clamp-1 group-hover:text-amber-700 transition-colors">
                        {product.name}
                    </h3>
                </Link>

                {/* Price Section */}
                <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-lg font-bold text-stone-900">₹{product.price}</span>
                    <span className="text-sm text-stone-400 line-through">₹{product.mrp}</span>
                    <span className="text-xs font-bold text-green-600">({discount}% OFF)</span>
                </div>

                {/* Size Selection */}
                <div className="mb-4">
                    <p className="text-xs text-stone-500 mb-2 font-medium uppercase tracking-wide">Select Size</p>
                    <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size) => (
                            <button
                                key={size}
                                onClick={(e) => {
                                    e.preventDefault()
                                    setSelectedSize(size)
                                }}
                                className={cn(
                                    "px-3 py-1 text-xs rounded-md border transition-all",
                                    selectedSize === size
                                        ? "bg-amber-100 border-amber-500 text-amber-900 font-medium"
                                        : "bg-white border-stone-200 text-stone-600 hover:border-amber-300"
                                )}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Add to Cart */}
                <div className="mt-auto pt-2">
                    <button
                        onClick={handleAddToCart}
                        className="w-full flex items-center justify-center gap-2 bg-stone-900 hover:bg-amber-600 text-white py-2.5 rounded-lg transition-colors font-medium text-sm"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    )
}
