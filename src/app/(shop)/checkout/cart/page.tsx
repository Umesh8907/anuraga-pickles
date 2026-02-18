'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart, MapPin, Tag, Gift, Heart, ChevronDown, Check } from 'lucide-react'
import { useCart, useRemoveFromCart, useUpdateCartItem } from '@/hooks/useCart'
import { cn } from '@/lib/utils'
import { useUser } from '@/hooks/useAuth'
import { useAuthModalStore } from '@/store/useAuthModalStore'
import { useRouter } from 'next/navigation'
import PriceDetails from '@/components/checkout/PriceDetails'
import { useAddress } from '@/hooks/useAddress'
import productimg from '@/assets/Productimg.png'

export default function CartPage() {
    const { data: cartData, isLoading } = useCart();
    const { mutate: removeFromCart } = useRemoveFromCart();
    const { mutate: updateCartItem } = useUpdateCartItem();
    const { data: user } = useUser();
    const { addresses } = useAddress();
    const { openModal } = useAuthModalStore();
    const router = useRouter();

    const cartItems = cartData?.items || [];

    // Get default address for "Deliver to" snippet
    const defaultAddress = addresses?.find(a => a.isDefault) || addresses?.[0];

    if (isLoading) return <div className="min-h-screen pt-32 text-center text-stone-600 font-medium">Loading your bag...</div>;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-[#fbf6ee] pt-20 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-12 rounded-2xl shadow-sm text-center max-w-md w-full border border-stone-100">
                    <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingCart className="w-10 h-10 text-stone-300" />
                    </div>
                    <h2 className="text-xl font-bold text-stone-900 mb-2">Hey, it feels so light!</h2>
                    <p className="text-stone-500 mb-8 text-sm">There is nothing in your bag. Let's add some items.</p>
                    <Link
                        href="/collections/all-products"
                        className="inline-block border border-rose-500 text-rose-500 font-bold py-3 px-10 rounded-xl hover:bg-rose-50 transition-all uppercase tracking-wider text-sm"
                    >
                        Add Items From Wishlist
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-4">

                {/* Deliver To Section (AddressBlock Style) */}
                <div className="bg-[#EAF4EF] border border-[#DDEBDD] rounded-2xl px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div className="flex gap-3 items-start">
                        <div className="bg-[#2F6B3D]/10 text-[#2F6B3D] p-2 rounded-full">
                            <MapPin size={18} />
                        </div>
                        {user ? (
                            <div>
                                <p className="text-sm text-gray-700">
                                    Deliver to:{" "}
                                    <span className="font-semibold text-black">
                                        {defaultAddress ? `${defaultAddress.name}, ${defaultAddress.pincode}` : 'Select Address'}
                                    </span>
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    {defaultAddress ? `${defaultAddress.addressLine1}, ${defaultAddress.city}` : 'Please add an address'}
                                </p>
                            </div>
                        ) : (
                            <div className="flex-1 text-left">
                                <h3 className="text-base font-semibold text-gray-900">Login to see saved addresses</h3>
                                <p className="text-sm text-gray-600">Add your delivery address to continue</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => {
                            if (user) router.push('/checkout/address');
                            else openModal('LOGIN');
                        }}
                        className="bg-[#346800] inline-flex items-center whitespace-nowrap text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#2a5400] transition"
                    >
                        {defaultAddress ? 'CHANGE ADDRESS' : 'ADD ADDRESS'}
                    </button>

                </div>

                {/* Cart Items List */}
                <div className="space-y-4">
                    {cartItems.map((item) => (
                        <div key={item._id} className="w-full rounded-2xl border bg-white p-4 shadow-sm relative group transition-all duration-200">
                            <div className="flex gap-4">
                                {/* Image */}
                                <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-[#EAF5E6] flex-shrink-0">
                                    <div className="relative h-[90px] w-[90px]">
                                        <Image
                                            src={item.product?.images?.[0] || productimg}
                                            alt={item.product?.name || 'Product'}
                                            fill
                                            className="object-contain rounded-lg"
                                        />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex flex-1 flex-col gap-2 py-1">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h3 className="text-[15px] font-semibold text-zinc-900">
                                                {item.product?.name}
                                            </h3>
                                            <p className="text-sm text-zinc-500">{item.variantLabel}</p>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item._id)}
                                            className="rounded-xl p-2 text-zinc-500 hover:bg-zinc-100 hover:text-rose-500 transition-colors"
                                            aria-label="Remove item"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    {/* Quantity + Size */}
                                    <div className="flex flex-wrap items-center gap-6 mt-1">
                                        {/* Quantity */}
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-medium text-zinc-700">Quantity</span>
                                            <div className="flex items-center overflow-hidden rounded-xl border-2 border-zinc-100 bg-white shadow-sm">
                                                <button
                                                    disabled={item.quantity <= 1}
                                                    onClick={() => updateCartItem({ itemId: item._id, quantity: item.quantity - 1 })}
                                                    className="p-2.5 hover:bg-zinc-50 disabled:opacity-30 transition-colors"
                                                    aria-label="Decrease quantity"
                                                >
                                                    <Minus size={14} className="text-zinc-600" />
                                                </button>
                                                <span className="min-w-[44px] text-center text-sm font-bold text-zinc-900 border-x-2 border-zinc-100/50">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateCartItem({ itemId: item._id, quantity: item.quantity + 1 })}
                                                    className="p-2.5 hover:bg-zinc-50 transition-colors"
                                                    aria-label="Increase quantity"
                                                >
                                                    <Plus size={14} className="text-zinc-600" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Size */}
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="text-sm font-medium text-zinc-700">Size</span>
                                            <div className="flex flex-wrap gap-2">
                                                {['200g', '500g', '1kg'].map(size => (
                                                    <button
                                                        key={size}
                                                        className={cn(
                                                            "rounded-full border px-4 py-1 text-xs font-medium transition",
                                                            item.variantLabel?.includes(size) || (size === '500g' && !item.variantLabel)
                                                                ? "border-green-600 bg-green-600 text-white shadow-sm"
                                                                : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                                                        )}
                                                    >
                                                        {size}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="pt-2 flex items-baseline gap-2">
                                        <p className="text-[15px] font-bold text-zinc-900">
                                            ₹{item.price.toLocaleString()}
                                        </p>
                                        <span className="text-xs text-zinc-500 line-through">
                                            ₹{Math.round(item.price * 1.3).toLocaleString()}
                                        </span>
                                        <span className="text-xs font-medium text-green-700">
                                            Save ₹{Math.round(item.price * 0.3).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-zinc-400">Inclusive of all taxes</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Column (Sidebar) */}
            <div className="lg:col-span-1 space-y-6">
                <PriceDetails
                    button={
                        <button
                            onClick={() => {
                                if (user) {
                                    router.push('/checkout/address');
                                } else {
                                    openModal('LOGIN');
                                }
                            }}
                            className="w-full bg-[#B85B2B] hover:opacity-95 text-white font-bold py-3.5 rounded-xl uppercase tracking-wider text-sm transition-all shadow-md active:scale-[0.98]"
                        >
                            Proceed to Address
                        </button>
                    }
                />
            </div>
        </div>
    )
}
