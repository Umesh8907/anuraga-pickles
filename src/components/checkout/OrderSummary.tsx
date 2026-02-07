'use client';

import React from 'react';
import { useCart } from '@/hooks/useCart';
import { Address } from '@/types';
import { cn } from '@/lib/utils';

interface OrderSummaryProps {
    address?: Address;
}

export default function OrderSummary({ address }: OrderSummaryProps) {
    const { data: cart } = useCart();

    const subtotal = cart?.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
    // Assuming MRP calculation if available, else using price for now
    const totalMRP = subtotal; // If we had MRP in cart items we'd use that
    const discount = 0; // If any
    const shipping = 40; // Fixed for now as per design mockup
    const total = subtotal + shipping - discount;

    return (
        <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm space-y-6">
            <div>
                <h3 className="font-black text-stone-900 mb-4">Order Summary</h3>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm text-stone-600 font-medium">
                        <span>Total MRP</span>
                        <span>₹{totalMRP}</span>
                    </div>
                    <div className="flex justify-between text-sm text-emerald-600 font-medium">
                        <span>Discount on MRP</span>
                        <span>-₹{discount}</span>
                    </div>
                    <div className="flex justify-between text-sm text-stone-600 font-medium">
                        <span>Delivery Charge</span>
                        <span>₹{shipping}</span>
                    </div>
                    <div className="pt-3 border-t border-dashed border-stone-200 flex justify-between text-base font-black text-stone-900">
                        <span>Total Amount</span>
                        <span>₹{total}</span>
                    </div>
                </div>
            </div>

            {address && (
                <div className="pt-4 border-t border-stone-100">
                    <h4 className="font-bold text-xs text-stone-400 uppercase tracking-widest mb-2">Deliver To:</h4>
                    <p className="font-bold text-stone-900 text-sm">{address.name}</p>
                    <p className="text-stone-500 text-xs leading-relaxed mt-1">
                        {address.addressLine1}, {address.city}, {address.pincode}
                    </p>
                </div>
            )}
        </div>
    );
}
