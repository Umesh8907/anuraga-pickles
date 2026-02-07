'use client'

import React from 'react'
import Link from 'next/link'
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart } from 'lucide-react'
import { useCart, useRemoveFromCart, useUpdateCartItem } from '@/hooks/useCart'

export default function CartPage() {
    const { data: cartData, isLoading } = useCart();
    const { mutate: removeFromCart } = useRemoveFromCart();
    const { mutate: updateCartItem } = useUpdateCartItem();

    const cartItems = cartData?.items || [];
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = subtotal > 999 ? 0 : 50;
    const total = subtotal + shipping;

    if (isLoading) return <div className="min-h-screen pt-32 text-center text-stone-600 font-medium">Loading your cart...</div>;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-stone-50 pt-20 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-12 rounded-3xl shadow-sm text-center max-w-md w-full border border-stone-100 italic">
                    <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingCart className="w-10 h-10 text-amber-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-stone-900 mb-2">Your cart feels a bit light!</h2>
                    <p className="text-stone-500 mb-10">Add some authentic Andhra pickles to spice up your meals.</p>
                    <Link
                        href="/collections/all-products"
                        className="inline-flex items-center justify-center w-full bg-amber-600 text-white font-bold py-4 px-8 rounded-xl hover:bg-amber-700 transition-all shadow-lg shadow-amber-200"
                    >
                        Explore Collection
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-stone-50 min-h-screen pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4 mb-10">
                    <ShoppingCart className="w-8 h-8 text-amber-700" />
                    <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">Your Cart</h1>
                    <span className="bg-stone-200 text-stone-800 text-sm font-bold px-3 py-1 rounded-full">
                        {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
                    </span>
                </div>

                <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-start">
                    {/* Cart Items */}
                    <div className="lg:col-span-8 space-y-4">
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-stone-100">
                            <ul className="divide-y divide-stone-100">
                                {cartItems.map((item) => (
                                    <li key={item._id} className="p-6 flex flex-col sm:flex-row sm:items-center gap-6 group">
                                        {/* Image */}
                                        <div className="flex-shrink-0 w-28 h-28 bg-stone-50 rounded-2xl overflow-hidden border border-stone-200 shadow-sm">
                                            <img
                                                src={item.product?.images?.[0] || 'https://placehold.co/150x150?text=No+Image'}
                                                alt={item.product?.name || 'Product'}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                                            <div className="space-y-1">
                                                <h3 className="text-lg font-bold text-stone-900 leading-snug">
                                                    <Link href={`/products/${item.product?.slug}`} className="hover:text-amber-700 transition-colors">
                                                        {item.product?.name}
                                                    </Link>
                                                </h3>
                                                <div className="flex flex-wrap gap-2 text-sm">
                                                    <span className="px-2 py-0.5 bg-amber-50 text-amber-800 font-bold rounded-md border border-amber-100">
                                                        {item.variantLabel}
                                                    </span>
                                                </div>
                                                <p className="text-base font-bold text-stone-900 pt-2">₹{item.price.toLocaleString()}</p>
                                            </div>

                                            {/* Quantity & Remove */}
                                            <div className="flex items-center justify-between sm:justify-end gap-8 pt-4 sm:pt-0">
                                                <div className="flex items-center bg-stone-50 border border-stone-200 rounded-xl overflow-hidden">
                                                    <button
                                                        onClick={() => {
                                                            if (item.quantity > 1) {
                                                                updateCartItem({ itemId: item._id, quantity: item.quantity - 1 })
                                                            }
                                                        }}
                                                        className="p-2.5 text-stone-500 hover:text-amber-700 hover:bg-stone-100 transition"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="w-10 text-center font-bold text-stone-900">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateCartItem({ itemId: item._id, quantity: item.quantity + 1 })}
                                                        className="p-2.5 text-stone-500 hover:text-amber-700 hover:bg-stone-100 transition"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => removeFromCart(item._id)}
                                                    className="p-3 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                    title="Remove item"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex justify-between items-center p-4">
                            <Link href="/collections/all-products" className="text-amber-700 font-bold text-sm hover:underline flex items-center gap-2">
                                &larr; Continue Shopping
                            </Link>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-4 mt-8 lg:mt-0">
                        <div className="bg-white rounded-3xl shadow-sm p-8 border border-stone-100 sticky top-28">
                            <h2 className="text-xl font-bold text-stone-900 mb-8 tracking-tight">Order Summary</h2>

                            <div className="space-y-4 text-sm font-medium text-stone-600 mb-10">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="text-stone-900">₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping Estimate</span>
                                    <span className={cn(shipping === 0 ? "text-green-600 font-bold" : "text-stone-900")}>
                                        {shipping === 0 ? 'FREE' : `₹${shipping}`}
                                    </span>
                                </div>
                                {shipping > 0 && (
                                    <p className="text-[10px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-100 italic">
                                        Add ₹{999 - subtotal} more to unlock FREE shipping!
                                    </p>
                                )}
                            </div>

                            <div className="border-t border-stone-100 pt-6 flex justify-between items-center mb-10">
                                <span className="text-lg font-bold text-stone-900">Total Amount</span>
                                <span className="text-2xl font-extrabold text-amber-700">₹{total.toLocaleString()}</span>
                            </div>

                            <button className="w-full bg-stone-900 hover:bg-amber-600 text-white font-bold py-5 rounded-2xl shadow-xl hover:shadow-amber-200 transition-all duration-300 hoverScale-up active:scale-[0.98]">
                                Proceed to Checkout
                            </button>

                            <div className="mt-8 space-y-4">
                                <div className="flex items-center gap-3 text-xs text-stone-500 justify-center">
                                    <ShoppingCart className="w-4 h-4" />
                                    <span>Secure checkout powered by Razorpay</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
