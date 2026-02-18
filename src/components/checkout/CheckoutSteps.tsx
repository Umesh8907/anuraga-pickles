'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const steps = [
    { id: 'cart', label: 'CART', path: '/checkout/cart' },
    { id: 'address', label: 'ADDRESS', path: '/checkout/address' },
    { id: 'payment', label: 'PAYMENT', path: '/checkout/payment' },
];

export default function CheckoutSteps() {
    const pathname = usePathname();

    const getCurrentStepIndex = () => {
        if (pathname === '/checkout/cart') return 0;
        if (pathname.includes('/checkout/address')) return 1;
        if (pathname.includes('/checkout/payment')) return 2;
        return 0;
    };

    const currentIdx = getCurrentStepIndex();

    return (
        <div className="flex items-center justify-center py-8 bg-white">
            <div className="flex items-center">
                {steps.map((step, idx) => {
                    const isCompleted = idx < currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                        <React.Fragment key={step.id}>
                            {/* Connector Line */}
                            {idx > 0 && (
                                <div className={cn(
                                    "w-12 h-px mx-4",
                                    idx <= currentIdx ? "bg-stone-300" : "bg-stone-200"
                                )} />
                            )}

                            {/* Step Label */}
                            <Link
                                href={step.path}
                                className={cn(
                                    "text-xs font-bold tracking-widest uppercase transition-colors",
                                    isCurrent ? "text-[#A0522D] border-b-2 border-[#A0522D] pb-1" :
                                        isCompleted ? "text-stone-900" : "text-stone-300"
                                )}
                            >
                                {step.label}
                            </Link>
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}
