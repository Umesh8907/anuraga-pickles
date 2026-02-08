'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const steps = [
    {
        id: 'cart',
        label: 'CART',
        path: '/checkout/cart',
    },
    {
        id: 'address',
        label: 'ADDRESS',
        path: '/checkout/address',
    },
    {
        id: 'payment',
        label: 'PAYMENT',
        path: '/checkout/payment',
    },
];

export default function CheckoutSteps() {
    const pathname = usePathname();

    const getCurrentStepIndex = () => {
        if (pathname === '/checkout/cart') return 0;
        if (pathname.includes('/checkout/address')) return 1;
        if (pathname.includes('/checkout/payment')) return 2;
        return 0;
    };

    const currentStepIndex = getCurrentStepIndex();

    return (
        <div className="w-full py-8 bg-stone-50/50">
            <div className="max-w-2xl mx-auto px-4">
                <div className="flex items-center justify-between relative">
                    {/* Progress Bar Background */}
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-stone-200 -z-10" />

                    {steps.map((step, index) => {
                        const isCompleted = index < currentStepIndex;
                        const isCurrent = index === currentStepIndex;

                        return (
                            <div key={step.id} className="relative bg-stone-50 px-2">
                                <Link
                                    href={step.path}
                                    className={cn(
                                        "text-xs font-bold tracking-widest uppercase transition-colors",
                                        (isCompleted || isCurrent) ? "text-emerald-700" : "text-stone-400",
                                        isCurrent && "border-b-2 border-emerald-600 pb-0.5"
                                    )}
                                >
                                    {step.label}
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
