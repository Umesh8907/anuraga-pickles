'use client';

import React from 'react';
import { useCart } from '@/hooks/useCart';
import { Address } from '@/types';

interface OrderSummaryProps {
    address?: Address;
}

export default function OrderSummary({ address }: OrderSummaryProps) {
    const { data: cart } = useCart();

    const subtotal =
        cart?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

    const totalMRP = subtotal;
    const discount = 0;
    const shipping = 40;
    const total = subtotal + shipping - discount;

    return (
        <div className="rounded-2xl border bg-white p-5 shadow-sm">

            <h3 className="text-base font-semibold text-zinc-900">
                Order Summary
            </h3>

            <div className="mt-4 space-y-3 text-sm">

                <div className="flex items-center justify-between">
                    <span className="text-zinc-600">Total MRP</span>
                    <span className="font-medium">₹{totalMRP}</span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-zinc-600">Discount on MRP</span>
                    <span className="font-medium text-green-700">
                        -₹{discount}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-zinc-600">Delivery Charge</span>
                    <span className="font-medium">₹{shipping}</span>
                </div>

                <div className="my-3 h-px w-full bg-zinc-200" />

                <div className="flex items-center justify-between text-base font-semibold text-zinc-900">
                    <span>Total Amount</span>
                    <span>₹{total}</span>
                </div>
            </div>

            <p className="mt-4 text-xs text-zinc-500">
                By placing the order, you agree to our{" "}
                <span className="font-medium text-green-700 cursor-pointer">
                    Terms of Use
                </span>{" "}
                and{" "}
                <span className="font-medium text-green-700 cursor-pointer">
                    Privacy Policy
                </span>.
            </p>

            {address && (
                <div className="mt-6 border-t pt-4">
                    <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">
                        Deliver To
                    </h4>
                    <p className="font-medium text-zinc-900 text-sm">
                        {address.name}
                    </p>
                    <p className="text-zinc-600 text-xs mt-1 leading-relaxed">
                        {address.addressLine1}, {address.city}, {address.pincode}
                    </p>
                </div>
            )}

            {/* <button
                type="button"
                className="mt-5 w-full rounded-xl bg-[#B85B2B] py-3 text-sm font-semibold text-white hover:opacity-95 transition"
            >
                PLACE ORDER
            </button> */}
        </div>
    );
}
