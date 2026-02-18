'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart, MapPin, Tag, Gift, Heart, ChevronDown, Check } from 'lucide-react'
import { useCart, useRemoveFromCart, useUpdateCartItem, useUpdateCartItemVariant } from '@/hooks/useCart'
import { cn } from '@/lib/utils'
import { useUser } from '@/hooks/useAuth'
import { useAuthModalStore } from '@/store/useAuthModalStore'
import { useRouter } from 'next/navigation'
import PriceDetails from '@/components/checkout/PriceDetails'
import { useAddress } from '@/hooks/useAddress'
import CheckoutSteps from '@/components/checkout/CheckoutSteps'

export default function CartPage() {
    const { data: cartData, isLoading } = useCart();
    const { mutate: removeFromCart } = useRemoveFromCart();
    const { mutate: updateCartItem } = useUpdateCartItem();
    const { mutate: updateCartItemVariant } = useUpdateCartItemVariant();
    const { data: user } = useUser();
    const { addresses } = useAddress();
    const { openModal } = useAuthModalStore();
    const router = useRouter();

    // Mock state for UI elements
    const [donationChecked, setDonationChecked] = useState(false);

    const cartItems = cartData?.items || [];

    // Get default address for "Deliver to" snippet
    const defaultAddress = addresses?.find(a => a.isDefault) || addresses?.[0];

    if (isLoading) return <div className="min-h-screen pt-32 text-center text-stone-600 font-medium">Loading your bag...</div>;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-stone-50 pt-20 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-12 rounded-sm shadow-sm text-center max-w-md w-full border border-stone-100">
                    <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingCart className="w-10 h-10 text-stone-300" />
                    </div>
                    <h2 className="text-xl font-bold text-stone-900 mb-2">Hey, it feels so light!</h2>
                    <p className="text-stone-500 mb-8 text-sm">There is nothing in your bag. Let's add some items.</p>
                    <Link
                        href="/collections/all-products"
                        className="inline-block border border-rose-500 text-rose-500 font-bold py-3 px-10 rounded-sm hover:bg-rose-50 transition-all uppercase tracking-wider text-sm"
                    >
                        Add Items From Wishlist
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-stone-50 min-h-screen pb-20">
            {/* Breadcrumbs */}
            <div className="bg-white border-b border-stone-100">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
                    <p className="text-xs text-stone-500">Home / Checkout / Cart</p>
                </div>
            </div>

            {/* Checkout Steps */}
            <div className="bg-white border-b border-stone-200">
                <CheckoutSteps />
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
                    {/* Left Column */}
                    <div className="lg:col-span-8 space-y-4">
                        {/* Deliver To Section */}
                        {user && (
                            <div className="bg-white p-6 rounded-sm border border-stone-200 flex justify-between items-start">
                                <div>
                                    <h3 className="text-sm font-bold text-stone-900 mb-1">
                                        Deliver to: <span className="font-bold">{defaultAddress ? defaultAddress.name : 'Select Address'}</span>, <span className="font-bold">{defaultAddress?.pincode}</span>
                                    </h3>
                                    <p className="text-sm text-stone-500 max-w-lg">
                                        {defaultAddress ? `${defaultAddress.addressLine1}, ${defaultAddress.city}, ${defaultAddress.state}` : 'Login to view addresses'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => router.push('/checkout/address')}
                                    className="text-white text-xs font-bold bg-[#556B2F] px-4 py-2 rounded-sm hover:opacity-90 uppercase shadow-sm whitespace-nowrap"
                                >
                                    Change Address
                                </button>
                            </div>
                        )}

                        {/* Available Offers */}
                        <div className="bg-white p-5 rounded-sm border border-stone-200">
                            <div className="flex items-center gap-2 mb-3">
                                <Tag className="w-4 h-4 text-stone-900" />
                                <span className="font-bold text-stone-900 text-sm">Available Offers</span>
                            </div>
                            <ul className="space-y-3 text-sm text-stone-600 pl-1">
                                <li className="flex items-start gap-3">
                                    <span className="mt-2 w-1.5 h-1.5 bg-stone-300 rounded-full shrink-0" />
                                    <span className="leading-relaxed">10% Instant Discount on Canara Bank Credit Card on min spend of ₹3,500</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-2 w-1.5 h-1.5 bg-stone-300 rounded-full shrink-0" />
                                    <span className="leading-relaxed">5% Unlimited Cashback on Flipkart Axis Bank Credit Card</span>
                                </li>
                            </ul>
                            <button className="text-emerald-600 text-xs font-bold mt-4 hover:underline flex items-center gap-1">
                                Show More <ChevronDown className="w-3 h-3" />
                            </button>
                        </div>

                        {/* Cart Items List */}
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div key={item._id} className="bg-white p-6 rounded-sm border border-stone-200 relative">
                                    <button
                                        onClick={() => removeFromCart(item._id)}
                                        className="absolute top-6 right-6 text-stone-400 hover:text-stone-800"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>

                                    <div className="flex gap-8">
                                        {/* Image */}
                                        <div className="shrink-0 w-40 h-40 bg-[#F5F5DC] rounded-sm flex items-center justify-center p-4">
                                            <img
                                                src={item.product?.images?.[0] || 'https://placehold.co/150x200?text=No+Image'}
                                                alt={item.product?.name || 'Product'}
                                                className="w-full h-full object-contain mix-blend-multiply"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 py-1">
                                            <h3 className="font-bold text-stone-900 text-lg mb-4">{item.product?.name}</h3>

                                            <div className="grid grid-cols-2 gap-y-4 gap-x-8 max-w-md">
                                                {/* Quantity */}
                                                <div>
                                                    <div className="text-sm text-stone-500 mb-2">Quantity</div>
                                                    <div className="flex items-center border border-stone-200 rounded-sm w-fit">
                                                        <button
                                                            disabled={item.quantity <= 1}
                                                            onClick={() => updateCartItem({ itemId: item._id, quantity: item.quantity - 1 })}
                                                            className="px-3 py-1 hover:bg-stone-50 disabled:opacity-50 text-stone-500"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="px-3 text-sm font-bold w-8 text-center">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateCartItem({ itemId: item._id, quantity: item.quantity + 1 })}
                                                            className="px-3 py-1 hover:bg-stone-50 text-stone-500"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Choose Size */}
                                                <div>
                                                    <div className="text-sm text-stone-500 mb-2">Choose Size</div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {item.product?.variants?.map((variant) => (
                                                            <button
                                                                key={variant._id}
                                                                onClick={() => {
                                                                    if (variant._id !== item.variantId) {
                                                                        updateCartItemVariant({ itemId: item._id, newVariantId: variant._id });
                                                                    }
                                                                }}
                                                                disabled={variant.stock <= 0}
                                                                className={cn(
                                                                    "px-3 py-1 rounded-full border text-xs font-medium transition-colors",
                                                                    item.variantId === variant._id
                                                                        ? "border-[#9ACD32] bg-[#9ACD32] text-white"
                                                                        : "border-stone-200 text-stone-600 hover:border-stone-300",
                                                                    variant.stock <= 0 && "opacity-50 cursor-not-allowed bg-stone-50"
                                                                )}
                                                            >
                                                                {variant.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-4 pt-4 border-t border-stone-100 flex items-center gap-2">
                                                <span className="font-bold text-stone-900 text-xl">₹{item.price.toFixed(2)}</span>
                                                <span className="text-stone-400 text-sm">(Inclusive of all taxes)</span>
                                                <span className="text-stone-300 line-through text-sm ml-2">M.R.P - ₹{Math.round(item.price * 1.3).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column (Sidebar) */}
                    <div className="lg:col-span-4 mt-8 lg:mt-0 space-y-6">

                        {/* Coupons */}
                        <div className="bg-white p-5 rounded-sm border border-stone-200 shadow-sm relative overflow-hidden group hover:border-[#A0522D]/30 transition-all">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-[#A0522D]/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>

                            <div className="relative">
                                <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-4">Offers & Coupons</div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#A0522D]/10 flex items-center justify-center text-[#A0522D]">
                                            <Tag className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <span className="font-bold text-stone-900 text-sm block">Apply Coupons</span>
                                            <span className="text-[10px] text-stone-500 font-medium">Get extra discounts on your order</span>
                                        </div>
                                    </div>
                                    <button className="text-[#A0522D] text-xs font-bold border border-[#A0522D]/30 px-5 py-2 rounded-sm hover:bg-[#A0522D] hover:text-white transition-all uppercase tracking-wide">
                                        APPLY
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Price Details */}
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
                                    className="w-full bg-[#A0522D] hover:bg-[#8B4513] text-white font-bold py-3.5 rounded-sm uppercase tracking-wider text-sm transition-colors shadow-sm"
                                >
                                    Place Order
                                </button>
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
