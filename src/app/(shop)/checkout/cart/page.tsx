'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart, MapPin, Tag, Gift, Heart, ChevronDown, Check } from 'lucide-react'
import { useCart, useRemoveFromCart, useUpdateCartItem } from '@/hooks/useCart'
import { cn } from '@/lib/utils'
import { useUser } from '@/hooks/useAuth'
import { useAuthModalStore } from '@/store/useAuthModalStore'
import { useRouter } from 'next/navigation'
import PriceDetails from '@/components/checkout/PriceDetails'
import { useAddress } from '@/hooks/useAddress'

export default function CartPage() {
    const { data: cartData, isLoading } = useCart();
    const { mutate: removeFromCart } = useRemoveFromCart();
    const { mutate: updateCartItem } = useUpdateCartItem();
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
            <div className="bg-white border-b border-stone-200 py-4">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 text-sm text-stone-500">
                    <Link href="/" className="hover:text-stone-900">Home</Link> / <span>Shop</span> / <span className="font-bold text-stone-900">Cart</span>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
                    {/* Left Column */}
                    <div className="lg:col-span-8 space-y-4">
                        {/* Deliver To Section */}
                        {user && (
                            <div className="bg-emerald-50/50 p-4 rounded-sm border border-emerald-100 flex justify-between items-center">
                                <div className="text-sm">
                                    <span className="text-stone-600 mr-1">Deliver to:</span>
                                    <span className="font-bold text-stone-900">{defaultAddress ? defaultAddress.name : 'Select Address'}</span>
                                    {defaultAddress && <span className="text-stone-900">, {defaultAddress.pincode}</span>}
                                    <div className="text-xs text-stone-500 mt-0.5. truncate max-w-xs">
                                        {defaultAddress ? `${defaultAddress.addressLine1}, ${defaultAddress.city}` : 'Login to view addresses'}
                                    </div>
                                </div>
                                <button
                                    onClick={() => router.push('/checkout/address')}
                                    className="text-white text-xs font-bold bg-emerald-700 px-4 py-2 rounded-sm hover:bg-emerald-800 uppercase shadow-sm"
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
                                    <span className="mt-2 w-1.5 h-1.5 bg-stone-300 rounded-full flex-shrink-0" />
                                    <span className="leading-relaxed">10% Instant Discount on Canara Bank Credit Card on min spend of ₹3,500</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-2 w-1.5 h-1.5 bg-stone-300 rounded-full flex-shrink-0" />
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
                                <div key={item._id} className="bg-white p-4 rounded-sm border border-stone-200 relative group">
                                    <button
                                        onClick={() => removeFromCart(item._id)}
                                        className="absolute top-4 right-4 text-stone-400 hover:text-stone-800"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>

                                    <div className="flex gap-6">
                                        {/* Image */}
                                        <div className="flex-shrink-0 w-32 h-32 bg-stone-50 rounded-sm overflow-hidden">
                                            <img
                                                src={item.product?.images?.[0] || 'https://placehold.co/150x200?text=No+Image'}
                                                alt={item.product?.name || 'Product'}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 py-1">
                                            <h3 className="font-bold text-stone-900 text-base mb-1">{item.product?.name}</h3>
                                            <p className="text-stone-500 text-sm mb-4">{item.variantLabel}</p>

                                            <div className="flex flex-wrap gap-6 mb-4">
                                                {/* Quantity Selector */}
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs font-bold text-stone-500 bg-stone-100 px-2 py-1 rounded">Qty</span>
                                                    <div className="flex items-center border border-stone-300 rounded-sm">
                                                        <button
                                                            disabled={item.quantity <= 1}
                                                            onClick={() => updateCartItem({ itemId: item._id, quantity: item.quantity - 1 })}
                                                            className="px-2 py-1 hover:bg-stone-50 disabled:opacity-50"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="px-2 text-sm font-bold w-6 text-center">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateCartItem({ itemId: item._id, quantity: item.quantity + 1 })}
                                                            className="px-2 py-1 hover:bg-stone-50"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Size Selector (Mock) */}
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs font-bold text-stone-500 bg-stone-100 px-2 py-1 rounded">Size</span>
                                                    <div className="flex gap-2">
                                                        {['200g', '500g', '1kg'].map(size => (
                                                            <button
                                                                key={size}
                                                                className={cn(
                                                                    "px-3 py-1 rounded-full border text-xs font-medium transition-colors",
                                                                    item.variantLabel?.includes(size) || (size === '500g')
                                                                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                                                                        : "border-stone-200 text-stone-600 hover:border-stone-300"
                                                                )}
                                                            >
                                                                {size}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-stone-900 text-lg">₹{item.price.toLocaleString()}</span>
                                                <span className="text-stone-400 line-through text-sm">₹{Math.round(item.price * 1.3).toLocaleString()}</span>
                                                <span className="text-rose-500 text-xs font-bold">(Inclusive of all taxes)</span>
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
                        <div className="bg-white p-5 rounded-sm border border-stone-200">
                            <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-4">COUPONS</div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <Tag className="w-4 h-4 text-stone-900" />
                                    <span className="font-bold text-stone-900 text-sm">Apply Coupons</span>
                                </div>
                                <button className="text-emerald-600 text-xs font-bold border border-emerald-600 px-4 py-1.5 rounded-sm hover:bg-emerald-50 uppercase">
                                    APPLY
                                </button>
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
