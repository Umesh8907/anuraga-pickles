'use client'

import React from 'react'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Product } from '@/types'
import { useAddToCart } from '@/hooks/useCart'
import { useWishlist, useAddToWishlist, useRemoveFromWishlist } from '@/hooks/useWishlist'
import { useAuthModalStore } from '@/store/useAuthModalStore'
import { useUser } from '@/hooks/useAuth'
import productimg from '@/assets/Productimg.png'

interface ProductCardProps {
    product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
    const { data: user } = useUser();
    const { data: wishlist } = useWishlist();
    const { mutate: addToWishlist } = useAddToWishlist();
    const { mutate: removeFromWishlist } = useRemoveFromWishlist();
    const { openModal } = useAuthModalStore();
    const { mutate: addToCart } = useAddToCart();

    console.log("Rendering ProductCard:", product.name, product._id);

    const isWishlisted =
        wishlist?.products.some(p => p._id === product._id) || false;

    // ✅ FIXED: Always ensure image is string
    const mainImage =
        product.images?.[0] ||
        (typeof productimg === "string" ? productimg : productimg.src);

    // Use first variant
    const firstVariant = product.variants?.[0];
    const price = firstVariant?.price || 0;
    const mrp = firstVariant?.mrp || price;

    const discount =
        mrp > price
            ? Math.round(((mrp - price) / mrp) * 100)
            : 0;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();

        // ✅ Safe check
        if (!firstVariant) return;

        addToCart({
            product: product,
            variantId: firstVariant._id,
            quantity: 1
        });
    };

    const toggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();

        if (!user) {
            openModal('LOGIN');
            return;
        }

        if (isWishlisted) {
            removeFromWishlist(product._id);
        } else {
            addToWishlist(product._id);
        }
    };

    return (
        <div className="relative w-full rounded-2xl bg-white shadow-md transition hover:shadow-lg overflow-hidden">

            {/* Collection Tag */}
            {product.collections && product.collections[0] && (
                (() => {
                    const col = product.collections[0];
                    const name = typeof col === 'string' ? col : col.name;
                    // Check if it's a raw ObjectId (24 hex chars)
                    const isId = /^[0-9a-fA-F]{24}$/.test(name);

                    if (isId || !name) return null;

                    return (
                        <span className="absolute left-3 top-3 z-10 rounded bg-black px-2 py-1 text-[11px] font-semibold text-white">
                            {name}
                        </span>
                    );
                })()
            )}

            {/* Wishlist Button */}
            <button
                onClick={toggleWishlist}
                className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow"
            >
                <Heart
                    className={cn(
                        "w-4 h-4",
                        isWishlisted
                            ? "fill-current text-red-500"
                            : "text-stone-400"
                    )}
                />
            </button>

            {/* Image Section */}
            <Link href={`/products/${product.slug}`}>
                <div className="relative h-[180px] sm:h-[200px] md:h-[220px] lg:h-[240px] xl:h-[260px] rounded-t-2xl bg-[#FFE2C4]">
                    <img
                        src={mainImage}
                        alt={product.name}
                        className="w-full h-full object-contain p-5"
                    />
                </div>
            </Link>

            {/* Content */}
            <div className="px-4 pb-4 pt-3">

                {/* Feature Tags */}
                <div className="mb-2 sm:mb-3 flex flex-wrap items-center gap-1 sm:gap-1.5">
                    <span className="rounded-full bg-[#E5FAD1] px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-medium leading-none text-black">
                        Preservative-Free
                    </span>

                    <span className="rounded-full bg-[#D7FFEC] px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-medium leading-none text-black">
                        Woman-Made
                    </span>
                </div>

                {/* Product Name */}
                <p className="line-clamp-2 text-xs sm:text-sm font-semibold leading-snug text-black">
                    {product.name}
                </p>

                {/* Rating */}
                <div className="mt-1 sm:mt-1.5 flex items-center gap-1 sm:gap-2 text-xs text-black/60">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-3 h-3 text-[#F4B400]"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span>{product.averageRating ?? 4.8}</span>

                    {product.collections && product.collections[0] && (
                        (() => {
                            const col = product.collections[0];
                            const name = typeof col === 'string' ? col : col.name;
                            const isId = /^[0-9a-fA-F]{24}$/.test(name);
                            if (isId || !name) return null;

                            return (
                                <span className="hidden sm:inline">
                                    | {name}
                                </span>
                            );
                        })()
                    )}
                </div>

                {/* Price */}
                <div className="mt-1.5 sm:mt-2 flex items-center gap-1.5 sm:gap-2">
                    {mrp > price && (
                        <span className="text-xs text-black/40 line-through">
                            ₹{mrp}
                        </span>
                    )}

                    <span className="text-sm sm:text-base font-bold text-black">
                        ₹{price}
                    </span>

                    {discount > 0 && (
                        <span className="text-xs font-bold text-green-600">
                            ({discount}% OFF)
                        </span>
                    )}
                </div>

                {/* Add To Cart Button */}
                <button
                    onClick={handleAddToCart}
                    disabled={!firstVariant || firstVariant.stock <= 0}
                    className={cn(
                        "mt-2 sm:mt-3 h-[36px] sm:h-[40px] w-full rounded-lg text-xs sm:text-sm font-semibold transition",
                        (!firstVariant || firstVariant.stock <= 0)
                            ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                            : "bg-[#C05A2B] hover:bg-[#a94d24] text-white"
                    )}
                >
                    {!firstVariant || firstVariant.stock <= 0
                        ? "Out of Stock"
                        : "+ ADD"}
                </button>

            </div>
        </div>
    )
}
