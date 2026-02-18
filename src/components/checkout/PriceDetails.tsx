'use client';

import React from 'react';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';
import { Tag } from 'lucide-react';

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
            <div className="bg-white p-5 rounded-sm border border-stone-200 shadow-sm">
                <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-4">Price Details</h3>

                <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-stone-600">Total MRP</span>
                        <span className="text-stone-900 font-medium">₹{totalMRP}</span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                        <span className="text-stone-600">Discount on MRP</span>
                        <span className="text-emerald-600 font-medium">-₹{discount}</span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                        <span className="text-stone-600">Coupon Discount</span>
                        <span className="text-stone-900 font-medium">
                            <span className="text-stone-400 text-xs mr-1">No Coupon Applied</span>
                        </span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                        <span className="text-stone-600">Delivery Charge</span>
                        <span className="text-stone-900 font-medium">
                            {shipping === 0 ? <span className="text-emerald-600">Free</span> : `₹${shipping}`}
                        </span>
                    </div>
                </div>

                <div className="border-t border-dashed border-stone-200 pt-4 mb-4">
                    <div className="flex justify-between items-center">
                        <span className="text-base font-bold text-stone-900">Total Amount</span>
                        <span className="text-lg font-bold text-stone-900">₹{total}</span>
                    </div>
                </div>

                {discount > 0 && (
                    <div className="bg-emerald-50 px-3 py-2 rounded-sm border border-emerald-100 mb-6 flex items-center gap-2 justify-center">
                        <Tag className="w-3.5 h-3.5 text-emerald-600" />
                        <p className="text-emerald-700 font-bold text-xs">You are saving ₹{discount} on this order</p>
                    </div>
                )}

                {button && (
                    <div className="mb-6">
                        {button}
                    </div>
                )}

                <div className="pt-2 border-t border-stone-100">
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-3 text-center">We Accept</p>
                    <div className="flex gap-2 justify-center opacity-80 grayscale hover:grayscale-0 transition-all duration-300">
                        <img src="https://placehold.co/40x25?text=VISA" alt="Visa" className="h-5 w-auto" />
                        <img src="https://placehold.co/40x25?text=MC" alt="Mastercard" className="h-5 w-auto" />
                        <img src="https://placehold.co/40x25?text=RuPay" alt="RuPay" className="h-5 w-auto" />
                        <img src="https://placehold.co/40x25?text=UPI" alt="UPI" className="h-5 w-auto" />
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
