'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Star, Truck, ShieldCheck, CheckCircle, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useProduct } from '@/hooks/useProducts'
import { useAddToCart } from '@/hooks/useCart'
import { cn } from '@/lib/utils'
import { Product, ProductVariant } from '@/types'

export default function ProductClient({ initialData }: { initialData?: Product | null }) {
    const params = useParams();
    const slug = params?.slug as string;

    // Fetch product data
    const { data: product, isLoading, isError } = useProduct(slug, initialData);
    const { mutate: addToCart } = useAddToCart();

    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
    const [quantity, setQuantity] = useState(1)

    // Update selected variant when product loads
    useEffect(() => {
        if (product && product.variants && product.variants.length > 0) {
            const defaultV = product.variants.find(v => v.isDefault) || product.variants[0];
            setSelectedVariant(defaultV);
        }
    }, [product]);

    if (isLoading) return <div className="min-h-screen pt-32 text-center text-stone-600 font-medium">Loading product details...</div>;
    if (isError || !product) return <div className="min-h-screen pt-32 text-center text-red-500 font-medium">Product not found</div>;

    const price = selectedVariant?.price || 0;
    const mrp = selectedVariant?.mrp || price;
    const discount = mrp > price
        ? Math.round(((mrp - price) / mrp) * 100)
        : 0;

    const mainImage = product.images?.[0] || 'https://placehold.co/600x600?text=No+Image';

    const handleAddToCart = () => {
        if (!selectedVariant) return;

        addToCart({
            product: product,
            variantId: selectedVariant._id,
            quantity
        });
        // We could add a toast here
    }

    return (
        <div className="bg-white min-h-screen pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-stone-50 rounded-2xl overflow-hidden border border-stone-100 shadow-sm">
                            <img
                                src={mainImage}
                                alt={product.name}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        {/* Multiple images could be mapped here */}
                        {product.images && product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.map((img, i) => (
                                    <div key={i} className="aspect-square bg-stone-50 rounded-lg overflow-hidden border border-stone-100 cursor-pointer hover:border-amber-500 transition-colors">
                                        <img src={img} alt={`${product.name} ${i}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col">
                        <nav className="text-sm text-stone-500 mb-6">
                            <ul className="flex items-center space-x-2">
                                <li><a href="/" className="hover:text-amber-700 transition-colors">Home</a></li>
                                <li className="text-stone-300">/</li>
                                <li><a href="/collections/all-products" className="hover:text-amber-700 transition-colors">Shop</a></li>
                                <li className="text-stone-300">/</li>
                                <li className="text-stone-900 font-medium truncate">{product.name}</li>
                            </ul>
                        </nav>

                        <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-2 leading-tight">{product.name}</h1>

                        <div className="flex items-center space-x-3 mb-6">
                            <div className="flex text-amber-500">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={cn("w-4 h-4", i < Math.floor(product.averageRating || 5) ? "fill-current" : "text-stone-200")} />
                                ))}
                            </div>
                            <span className="text-sm text-stone-500 font-medium">({product.reviewCount || 0} customer reviews)</span>
                        </div>

                        <div className="flex items-baseline space-x-3 mb-8 p-4 bg-stone-50 rounded-xl border border-stone-100 w-fit">
                            <span className="text-3xl font-extrabold text-stone-900">₹{price}</span>
                            {discount > 0 && (
                                <>
                                    <span className="text-xl text-stone-400 line-through font-medium">₹{mrp}</span>
                                    <span className="text-sm font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full border border-green-200">
                                        {discount}% OFF
                                    </span>
                                </>
                            )}
                        </div>

                        <div className="prose prose-stone prose-sm mb-8 text-stone-600 leading-relaxed">
                            <p>{product.description}</p>
                        </div>

                        {/* Variant Selection (Weight) */}
                        {product.variants && product.variants.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-sm font-bold text-stone-900 mb-4 uppercase tracking-wider flex items-center gap-2">
                                    <ShoppingBag className="w-4 h-4 text-amber-600" />
                                    Select Pack Size
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {product.variants.map((variant) => (
                                        <button
                                            key={variant._id}
                                            onClick={() => setSelectedVariant(variant)}
                                            className={cn(
                                                "px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 border-2",
                                                selectedVariant?._id === variant._id
                                                    ? "border-amber-600 bg-amber-50 text-amber-900 shadow-md"
                                                    : "border-stone-200 bg-white text-stone-600 hover:border-amber-300 hover:bg-stone-50"
                                            )}
                                        >
                                            {variant.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}


                        <div className="flex flex-col sm:flex-row gap-4 mb-10">
                            <div className="flex items-center bg-stone-100 rounded-xl border border-stone-200 overflow-hidden">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="p-4 text-stone-600 hover:text-amber-700 hover:bg-stone-200 transition"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-10 text-center font-bold text-stone-900 text-lg">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="p-4 text-stone-600 hover:text-amber-700 hover:bg-stone-200 transition"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                disabled={!selectedVariant || selectedVariant.stock === 0}
                                className={cn(
                                    "flex-1 font-bold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-3",
                                    selectedVariant?.stock === 0
                                        ? "bg-stone-300 text-stone-500 cursor-not-allowed shadow-none"
                                        : "bg-amber-600 hover:bg-amber-700 text-white hover:scale-[1.02] active:scale-[0.98]"
                                )}
                            >
                                <ShoppingBag className="w-5 h-5" />
                                {selectedVariant?.stock === 0 ? 'Out of Stock' : `Add to Cart - ₹${(price * quantity).toLocaleString()}`}
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-stone-100 pt-8 mt-auto">
                            <div className="flex flex-col items-center sm:items-start gap-2 text-center sm:text-left">
                                <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center mb-1">
                                    <Truck className="w-5 h-5 text-amber-700" />
                                </div>
                                <span className="text-xs font-bold text-stone-900 uppercase">Fast Delivery</span>
                                <span className="text-[10px] text-stone-500">Free shipping on orders above ₹999</span>
                            </div>
                            <div className="flex flex-col items-center sm:items-start gap-2 text-center sm:text-left">
                                <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center mb-1">
                                    <ShieldCheck className="w-5 h-5 text-amber-700" />
                                </div>
                                <span className="text-xs font-bold text-stone-900 uppercase">100% Authentic</span>
                                <span className="text-[10px] text-stone-500">Pure ingredients from traditional farms</span>
                            </div>
                            <div className="flex flex-col items-center sm:items-start gap-2 text-center sm:text-left">
                                <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center mb-1">
                                    <CheckCircle className="w-5 h-5 text-amber-700" />
                                </div>
                                <span className="text-xs font-bold text-stone-900 uppercase">Safe Packing</span>
                                <span className="text-[10px] text-stone-500">Glass bottles with safe seal technology</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
