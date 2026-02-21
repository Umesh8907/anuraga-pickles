'use client'

import React from 'react'
import { useWishlist } from '@/hooks/useWishlist'
import ProductCard from '@/components/features/product/ProductCard'
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useUser } from '@/hooks/useAuth'

export default function WishlistPage() {
    const { data: user, isLoading: userLoading } = useUser();
    const { data: wishlist, isLoading: wishlistLoading } = useWishlist();

    if (userLoading || wishlistLoading) {
        return (
            <div className="min-h-screen pt-32 text-center text-stone-600 font-medium italic">
                Brewing your collection of favorites...
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-stone-50 pt-30 pb-20">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                        <Heart className="w-12 h-12 text-stone-200" />
                    </div>
                    <h1 className="text-3xl font-black text-stone-900 mb-4 font-poppins">Sign in to save your love</h1>
                    <p className="text-stone-500 mb-10 max-w-md font-poppins">
                        Create a wishlist of your favorite pickles and spices to keep track of what you love most.
                    </p>
                    <Link
                        href="/login"
                        className="bg-brand-teal text-white font-black px-10 py-4 rounded-2xl hover:brightness-110 transition-all shadow-xl shadow-stone-200 inline-block"
                    >
                        Sign In Now
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50 pt-20 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <Link href="/" className="p-2 bg-white rounded-xl shadow-sm text-stone-400 hover:text-brand-teal transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <span className="text-[10px] font-poppins font-black text-brand-amber uppercase tracking-[0.3em]">Treasury of Flavors</span>
                        </div>
                        <h1 className="text-4xl font-black text-stone-900 tracking-tight font-poppins ">My Wishlist</h1>
                        <p className="text-stone-500 mt-2 font-medium font-poppins">Your handpicked selection of authentic traditions.</p>
                    </div>
                    <div className="bg-white px-6 py-3 rounded-2xl border border-stone-100 shadow-sm flex items-center gap-3">
                        <Heart className="w-5 h-5 text-red-500 fill-current" />
                        <span className="font-black text-stone-900">{wishlist?.products?.length || 0} Items Saved</span>
                    </div>
                </div>

                {!wishlist?.products || wishlist.products.length === 0 ? (
                    <div className="bg-white rounded-[3rem] p-16 text-center border border-stone-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                        <div className="relative z-10 max-w-md mx-auto">
                            <div className="w-20 h-20 bg-stone-50 rounded-2xl flex items-center justify-center mx-auto mb-8">
                                <ShoppingBag className="w-10 h-10 text-stone-200" />
                            </div>
                            <h2 className="text-2xl font-black text-stone-900 mb-4 font-poppins">Your Wishlist is Empty</h2>
                            <p className="text-stone-500 mb-10 italic leading-relaxed font-poppins">
                                Explore our traditional collections and save the flavors that speak to your soul.
                            </p>
                            <Link
                                href="/collections/all-products"
                                className="bg-brand-teal text-white font-black px-10 py-4 rounded-2xl hover:brightness-110 transition-all shadow-xl shadow-stone-200 inline-block font-poppins"
                            >
                                Start Discovery
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {wishlist.products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
