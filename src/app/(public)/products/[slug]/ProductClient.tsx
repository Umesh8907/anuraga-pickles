'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Star, Truck, ShieldCheck, CheckCircle, Plus, Minus, ShoppingBag, Leaf, BadgeCheck, Utensils, Info, Heart, Share2, ChevronRight } from 'lucide-react'
import { useProduct } from '@/hooks/useProducts'
import { useAddToCart } from '@/hooks/useCart'
import { cn } from '@/lib/utils'
import { Product, ProductVariant } from '@/types'
import ProductCard from '@/components/features/product/ProductCard'
import FrequentlyBoughtCard from '@/components/features/product/FrequentlyBoughtCard'

export default function ProductClient({ initialData }: { initialData?: Product | null }) {
    const params = useParams();
    const slug = params?.slug as string;

    // Fetch product data
    const { data: product, isLoading, isError } = useProduct(slug, initialData);
    const { mutate: addToCart } = useAddToCart();

    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
    const [quantity, setQuantity] = useState(1)
    const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'details'>('description');

    // Update selected variant when product loads
    useEffect(() => {
        if (product && product.variants && product.variants.length > 0) {
            // Default to the first SIZE variant if available, else just first variant
            const defaultV = product.variants.find(v => v.isDefault) || product.variants.find(v => v.type === 'SIZE') || product.variants[0];
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

    // Group variants
    const sizeVariants = product.variants?.filter(v => v.type !== 'COMBO') || [];
    const comboVariants = product.variants?.filter(v => v.type === 'COMBO') || [];

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
        <div className="bg-[#FFFFF0] min-h-screen pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Left Column: Image Gallery */}
                    <div className="space-y-6">
                        <div className="aspect-4/5 bg-[#F9E4B7] rounded-3xl overflow-hidden relative shadow-xl group">
                            {/* Decorative Background Element */}
                            <div className="absolute inset-0 bg-linear-to-b from-[#F9E4B7] to-[#F0D59A] opacity-50" />

                            <img
                                src={mainImage}
                                alt={product.name}
                                className="w-full h-full object-contain relative z-10 hover:scale-105 transition-transform duration-700 ease-in-out p-8"
                            />

                            {/* Floating Badges */}
                            <div className="absolute top-6 left-6 z-20 flex flex-col gap-3">
                                {discount > 0 && (
                                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                                        {discount}% OFF
                                    </span>
                                )}
                                <span className="bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                                    <Leaf className="w-3 h-3" /> 100% Natural
                                </span>
                            </div>
                        </div>

                        {/* Thumbnails */}
                        {product.images && product.images.length > 1 && (
                            <div className="grid grid-cols-5 gap-4">
                                {product.images.map((img, i) => (
                                    <div key={i} className="aspect-square bg-white rounded-xl overflow-hidden border border-stone-200 cursor-pointer hover:border-amber-500 hover:shadow-md transition-all">
                                        <img src={img} alt={`${product.name} ${i}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Product Info */}
                    <div className="flex flex-col">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl md:text-5xl font-serif font-bold text-stone-900 mb-2 leading-tight">
                                    {product.name}
                                </h1>
                                <div className="flex items-center space-x-2 mb-6">
                                    <div className="flex text-amber-500">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={cn("w-4 h-4 fill-current", i >= Math.floor(product.averageRating || 5) && "text-stone-300")} />
                                        ))}
                                    </div>
                                    <span className="text-sm text-stone-500 font-medium">
                                        {product.averageRating || 4.8} | {product.reviewCount || 180} Reviews
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 rounded-full hover:bg-stone-100 text-stone-500 transition-colors">
                                    <Heart className="w-6 h-6" />
                                </button>
                                <button className="p-2 rounded-full hover:bg-stone-100 text-stone-500 transition-colors">
                                    <Share2 className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <p className="text-stone-600 mb-8 leading-relaxed font-light text-lg">
                            {product.description?.substring(0, 120)}...
                        </p>

                        <div className="flex items-baseline gap-3 mb-8">
                            <span className="text-4xl font-bold text-stone-900">₹{price.toFixed(2)}</span>
                            <span className="text-sm text-stone-500">(Inclusive of all taxes)</span>
                            {mrp > price && (
                                <span className="text-lg text-stone-400 line-through">M.R.P - ₹{mrp}</span>
                            )}
                        </div>

                        {/* Size Selection */}
                        {sizeVariants.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-sm font-bold text-stone-900 mb-3">Choose Size</h3>
                                <div className="flex flex-wrap gap-3">
                                    {sizeVariants.map((variant) => (
                                        <button
                                            key={variant._id}
                                            onClick={() => setSelectedVariant(variant)}
                                            className={cn(
                                                "px-6 py-2 rounded-full font-medium text-sm transition-all duration-200 border",
                                                selectedVariant?._id === variant._id
                                                    ? "bg-[#8B4513] text-white border-[#8B4513]" // Brown color from design
                                                    : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
                                            )}
                                        >
                                            {variant.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Combo Selection */}
                        {comboVariants.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-sm font-bold text-stone-900 mb-3">Value for money Combos</h3>
                                <div className="flex flex-wrap gap-4">
                                    {comboVariants.map((variant) => {
                                        const savings = variant.mrp - variant.price;
                                        return (
                                            <button
                                                key={variant._id}
                                                onClick={() => setSelectedVariant(variant)}
                                                className={cn(
                                                    "flex flex-col p-4 rounded-xl border-2 transition-all duration-200 text-left min-w-[140px]",
                                                    selectedVariant?._id === variant._id
                                                        ? "border-amber-400 bg-amber-50"
                                                        : "border-stone-200 bg-white hover:border-amber-200"
                                                )}
                                            >
                                                <span className="font-bold text-stone-900 mb-1">{variant.label}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-lg">₹{variant.price}</span>
                                                    {savings > 0 && <span className="text-xs text-green-600 font-bold">Save ₹{savings}</span>}
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Delivery Availability Check */}
                        <div className="mb-8 p-6 bg-stone-50 rounded-2xl border border-stone-200">
                            <h3 className="text-sm font-bold text-stone-900 mb-4 flex items-center gap-2">
                                <Truck className="w-4 h-4 text-amber-600" />
                                Check Delivery Availability
                            </h3>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        maxLength={6}
                                        placeholder="Enter 6-digit Pincode"
                                        className="w-full h-11 px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-bold focus:border-amber-500 outline-none"
                                        id="delivery-pincode"
                                    />
                                </div>
                                <button
                                    onClick={async () => {
                                        const pincode = (document.getElementById('delivery-pincode') as HTMLInputElement).value;
                                        if (pincode.length !== 6) {
                                            alert('Please enter a valid 6-digit pincode');
                                            return;
                                        }
                                        try {
                                            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products/${product._id}/check-delivery?pincode=${pincode}`);
                                            const data = await res.json();
                                            const statusEl = document.getElementById('delivery-status');
                                            if (statusEl) {
                                                statusEl.innerText = data.message;
                                                statusEl.className = cn(
                                                    "text-xs font-bold mt-2",
                                                    data.isDeliverable ? "text-emerald-600" : "text-red-500"
                                                );
                                            }
                                        } catch (e) {
                                            alert('Failed to check delivery');
                                        }
                                    }}
                                    className="px-6 h-11 bg-stone-900 border border-stone-900 text-white rounded-lg text-sm font-bold hover:bg-stone-800 transition-colors"
                                >
                                    Check
                                </button>
                            </div>
                            <div id="delivery-status" className="text-xs font-medium mt-2 text-stone-500">
                                Enter pincode to check delivery date and availability.
                            </div>
                        </div>

                        {/* Quantity and Add to Cart */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-10 items-end">
                            <div className="flex flex-col gap-2 w-full sm:w-auto">
                                <label className="text-sm font-bold text-stone-900">Quantity</label>
                                <div className="flex items-center bg-stone-50 rounded-lg border border-stone-200 overflow-hidden h-12">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-4 text-stone-600 hover:text-amber-700 hover:bg-stone-200 transition h-full"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-10 text-center font-bold text-stone-900">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="px-4 text-stone-600 hover:text-amber-700 hover:bg-stone-200 transition h-full"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={!selectedVariant || selectedVariant.stock === 0}
                                className={cn(
                                    "flex-1 h-12 rounded-lg font-bold shadow-lg transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wide",
                                    selectedVariant?.stock === 0
                                        ? "bg-stone-300 text-stone-500 cursor-not-allowed shadow-none"
                                        : "bg-[#A0522D] hover:bg-[#8B4513] text-white hover:scale-[1.02] active:scale-[0.98]" // Sienna / SaddleBrown
                                )}
                            >
                                <ShoppingBag className="w-5 h-5" />
                                {selectedVariant?.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                            </button>
                        </div>

                        {/* Benefits Strip */}
                        <div className="grid grid-cols-2 gap-4 bg-[#F0FAF9] p-6 rounded-2xl mb-8">
                            {product.keyBenefits?.map((benefit, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-green-700">
                                        {/* We would ideally render dynamic icons here, for now simpler */}
                                        <Leaf className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-medium text-stone-700">{benefit.title}</span>
                                </div>
                            ))}
                            {/* Fallback/Default Benefits if none provided */}
                            {(!product.keyBenefits || product.keyBenefits.length === 0) && (
                                <>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-green-700">
                                            <Leaf className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-medium text-stone-700">Helps in digestion</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-green-700">
                                            <Leaf className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-medium text-stone-700">Immunity booster</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-green-700">
                                            <Leaf className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-medium text-stone-700">No preservatives</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-green-700">
                                            <Leaf className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-medium text-stone-700">Gut health friendly</span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Tabs Section */}
                        <div className="bg-[#F5F7F6] rounded-2xl p-6">
                            <div className="flex gap-4 border-b border-stone-200 mb-6">
                                {['Description', 'Key Ingredients', 'Product Details'].map((tab) => {
                                    const tabKey = tab.toLowerCase().replace(' ', '') === 'keyingredients' ? 'ingredients' : tab.toLowerCase().replace(' ', '') === 'productdetails' ? 'details' : 'description';
                                    const isActive = activeTab === tabKey;
                                    return (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tabKey as any)}
                                            className={cn(
                                                "pb-3 font-bold text-sm transition-all border-b-2",
                                                isActive ? "text-[#DDA15E] border-[#DDA15E]" : "text-stone-500 border-transparent hover:text-stone-800"
                                            )}
                                        >
                                            {tab}
                                        </button>
                                    )
                                })}
                            </div>

                            <div className="min-h-[150px]">
                                {activeTab === 'description' && (
                                    <div className="prose prose-stone prose-sm max-w-none text-stone-600">
                                        <p>{product.description}</p>
                                    </div>
                                )}
                                {activeTab === 'ingredients' && (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        {/* Fallback if no structured ingredients */}
                                        {(!product.keyIngredients || product.keyIngredients.length === 0) ? (
                                            product.ingredients ? (
                                                <p className="text-sm text-stone-600 col-span-full">{product.ingredients}</p>
                                            ) : (
                                                <p className="text-sm text-stone-500 italic col-span-full">Ingredients information coming soon.</p>
                                            )
                                        ) : (
                                            product.keyIngredients.map((ing, i) => (
                                                <div key={i} className="flex flex-col items-center text-center">
                                                    <div className="w-20 h-20 rounded-full bg-white border border-stone-200 mb-2 overflow-hidden">
                                                        <img src={ing.image || "https://placehold.co/100x100?text=Ing"} alt={ing.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <span className="text-xs font-bold text-stone-900">{ing.name}</span>
                                                    <span className="text-[10px] text-stone-500 leading-tight mt-1">{ing.description}</span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                                {activeTab === 'details' && (
                                    <div className="grid grid-cols-2 gap-y-3 text-sm">
                                        {product.brand && <div className="flex flex-col"><span className="text-xs text-stone-500 uppercase">Brand</span><span className="font-medium">{product.brand}</span></div>}
                                        {product.flavor && <div className="flex flex-col"><span className="text-xs text-stone-500 uppercase">Flavor</span><span className="font-medium">{product.flavor}</span></div>}
                                        {product.itemForm && <div className="flex flex-col"><span className="text-xs text-stone-500 uppercase">Form</span><span className="font-medium">{product.itemForm}</span></div>}
                                        {product.packagingType && <div className="flex flex-col"><span className="text-xs text-stone-500 uppercase">Packaging</span><span className="font-medium">{product.packagingType}</span></div>}
                                        {product.storageInstruction && <div className="flex flex-col"><span className="text-xs text-stone-500 uppercase">Storage</span><span className="font-medium">{product.storageInstruction}</span></div>}
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Frequently Bought Together */}
                {product.frequentlyBoughtTogether && product.frequentlyBoughtTogether.length > 0 && (
                    <div className="mt-20 border-t border-stone-100 pt-16">
                        <h2 className="text-2xl font-bold text-stone-900 mb-8">Frequently bought together</h2>
                        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide p-1">
                            {(product.frequentlyBoughtTogether as unknown as Product[]).map((related: Product) => (
                                <FrequentlyBoughtCard key={related._id} product={related} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Related Products (Same Collection) */}
                {product.relatedProducts && product.relatedProducts.length > 0 && (
                    <div className="mt-12 border-t border-stone-100 pt-16 mb-20">
                        <h2 className="text-2xl font-bold text-stone-900 mb-8">You might also like</h2>
                        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide p-1">
                            {(product.relatedProducts as unknown as Product[]).map((related: Product) => (
                                <div key={related._id} className="min-w-[280px] w-[280px]">
                                    <ProductCard product={related} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}
