'use client';

import React from 'react';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';

import Image from "next/image";

import visa from "@/assets/visa.png";
import mastercard from "@/assets/mastercard.png";
import rupay from "@/assets/rupay.png";
import upi from "@/assets/upi.png";
import netbanking from "@/assets/netbanking.png";
import cod from "@/assets/Vector.png";


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
        <div className={cn("sticky top-24 flex flex-col gap-4", className)}>
            {/* Coupons */}
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-zinc-900 border-b border-zinc-100 pb-3 mb-3">COUPONS</h3>
                <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-medium text-zinc-700">
                        Apply Coupons
                    </div>
                    <button
                        type="button"
                        className="rounded-xl border border-green-600 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-50"
                    >
                        APPLY
                    </button>
                </div>
            </div>

            {/* Order Summary */}
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <h3 className="text-base font-semibold text-zinc-900 mb-6">Order Summary</h3>

                <div className="space-y-3 mb-6 text-sm">
                    <div className="flex justify-between items-center text-zinc-600">
                        <span>Total MRP</span>
                        <span className="font-medium">₹{totalMRP.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between items-center text-zinc-600">
                        <span>Discount on MRP</span>
                        <span className="font-medium text-green-700">-₹{discount.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between items-center text-zinc-600">
                        <span>Coupon Discount</span>
                        <button className="text-sm font-semibold text-green-700 hover:underline">Apply Coupon</button>
                    </div>

                    <div className="flex justify-between items-center text-zinc-600">
                        <span>Delivery Charge</span>
                        <span className="font-medium">
                            {shipping === 0 ? <span className="text-green-700">Free</span> : `₹${shipping}`}
                        </span>
                    </div>
                </div>

                <div className="border-t border-zinc-200 pt-4 mb-4">
                    <div className="flex justify-between items-center">
                        <span className="text-base font-semibold text-zinc-900">Total Amount</span>
                        <span className="text-base font-semibold text-zinc-900">₹{total.toLocaleString()}</span>
                    </div>
                </div>

                <p className="mb-4 text-xs text-zinc-500">
                    By placing the order, you agree to Anuraga's{" "}
                    <span className="font-medium text-green-700 cursor-pointer">Terms of Use</span> and{" "}
                    <span className="font-medium text-green-700 cursor-pointer">Privacy Policy</span>.
                </p>

                {button && (
                    <div className="mb-6">
                        {button}
                    </div>
                )}

                {/* Accepted Payment Methods */}
                <div className="pt-4 border-t border-zinc-100">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">ACCEPTED PAYMENT METHODS</p>
                    <div className="mt-3 flex items-center gap-5">
                        <Image src={visa} alt="Visa" className="h-4 w-auto object-contain" />
                        <Image src={mastercard} alt="Mastercard" className="h-4 w-auto object-contain" />
                        <Image src={rupay} alt="RuPay" className="h-4 w-auto object-contain" />
                        <Image src={cod} alt="cod" className="h-4 w-auto object-contain" />
                        <Image src={netbanking} alt="Netbanking" className="h-4 w-auto object-contain" />
                        <Image src={upi} alt="UPI" className="h-4 w-auto object-contain" />
                    </div>
                </div>
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
