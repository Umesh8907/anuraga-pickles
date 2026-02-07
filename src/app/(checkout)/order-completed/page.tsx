'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useCheckoutStore } from '@/store/useCheckoutStore';
import { CheckCircle2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function OrderCompletedPage() {
    const { resetCheckout } = useCheckoutStore();
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    useEffect(() => {
        resetCheckout();
    }, [resetCheckout]);

    return (
        <div className="max-w-xl mx-auto p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-black text-stone-900 mb-4">Order Placed!</h1>
            <p className="text-stone-600 mb-8 text-lg">
                Thank you for your order. We have received it and will process it shortly.
            </p>
            {orderId && (
                <p className="text-sm text-stone-500 mb-8 bg-stone-50 inline-block px-4 py-2 rounded-lg border border-stone-200">
                    Order ID: <span className="font-bold text-stone-900">{orderId}</span>
                </p>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                    href="/account/orders"
                    className="inline-flex items-center justify-center px-8 py-3 bg-white text-stone-900 border-2 border-stone-200 rounded-xl font-bold hover:border-amber-600 hover:text-amber-600 transition-colors"
                >
                    View Order
                </Link>
                <Link
                    href="/collections/all-products"
                    className="inline-flex items-center justify-center px-8 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 shadow-lg shadow-amber-200 transition-all"
                >
                    Continue Shopping
                </Link>
            </div>
        </div>
    )
}
