'use client';

import React from 'react';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';

interface PriceDetailsProps {
    className?: string;
    button?: React.ReactNode;
}

export default function PriceDetails({ className, button }: PriceDetailsProps) {
    const { data: cart } = useCart();

    const cartItems = cart?.items || [];
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
    const totalMRP = Math.round(subtotal * 1.3);
    const discount = totalMRP - subtotal;
    const shipping = subtotal > 999 ? 0 : 40;
    const total = subtotal + shipping;

    if (cartItems.length === 0) return null;

    return (
        <div className={cn("space-y-6", className)}>
            <div className="bg-white">
                <h3 className="text-base font-bold text-stone-900 mb-6">Order Summary</h3>

                <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center text-sm font-medium">
                        <span className="text-stone-600">Total MRP</span>
                        <span className="text-stone-900">₹{totalMRP}</span>
                    </div>

                    <div className="flex justify-between items-center text-sm font-medium">
                        <span className="text-stone-600">Discount on MRP</span>
                        <span className="text-emerald-500">-₹{discount}</span>
                    </div>

                    <div className="flex justify-between items-center text-sm font-medium">
                        <span className="text-stone-600">Coupon Discount</span>
                        <button className="text-rose-500 hover:text-rose-600 text-sm font-medium">Apply Coupon</button>
                    </div>

                    <div className="flex justify-between items-center text-sm font-medium">
                        <span className="text-stone-600">Delivery Charge</span>
                        <span className="text-stone-900">
                            {shipping === 0 ? <span className="text-emerald-500">Free</span> : `₹${shipping}`}
                        </span>
                    </div>
                </div>

                <div className="border-t border-stone-200 pt-4 mb-4">
                    <div className="flex justify-between items-center">
                        <span className="text-base font-bold text-stone-900">Total Amount</span>
                        <span className="text-base font-bold text-stone-900">₹{total}</span>
                    </div>
                </div>

                <div className="bg-emerald-50 p-3 rounded-sm border border-emerald-100 mb-6 text-center">
                    <p className="text-emerald-700 font-bold text-xs">You will save ₹{discount} on this order</p>
                </div>

                {button && (
                    <div className="mb-6">
                        {button}
                    </div>
                )}

                <div>
                    <p className="text-[10px] font-bold text-stone-900 uppercase tracking-wider mb-2">ACCEPTED PAYMENT METHODS</p>
                    <div className="flex gap-2">
                        <img src="https://placehold.co/40x25?text=VISA" alt="Visa" className="h-6 w-auto" />
                        <img src="https://placehold.co/40x25?text=MC" alt="Mastercard" className="h-6 w-auto" />
                        <img src="https://placehold.co/40x25?text=RuPay" alt="RuPay" className="h-6 w-auto" />
                        <img src="https://placehold.co/40x25?text=UPI" alt="UPI" className="h-6 w-auto" />
                        <img src="https://placehold.co/40x25?text=Bank" alt="Bank" className="h-6 w-auto" />
                    </div>
                </div>
            </div>

            <div className="text-xs text-stone-500">
                By placing the order, you agree to anuraga's <span className="font-bold text-emerald-700">Terms of Use</span> and <span className="font-bold text-emerald-700">Privacy Policy</span>
            </div>
        </div>
    );
}

function ShieldIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        </svg>
    )
}
