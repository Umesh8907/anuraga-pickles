'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
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
        if (pathname === '/checkout/address') return 1;
        if (pathname === '/checkout/payment') return 2;
        return 0;
    };

    const currentStepIndex = getCurrentStepIndex();

    return (
        <div className="mb-10">
            <div className="flex items-center justify-center">
                {steps.map((step, index) => {
                    const isCurrent = index === currentStepIndex;

                    return (
                        <React.Fragment key={step.id}>
                            {/* Step Label */}
                            <div className="flex flex-col items-center">
                                <span
                                    className={cn(
                                        "text-sm tracking-wide transition-all duration-200",
                                        isCurrent
                                            ? "text-[#346800] font-semibold"
                                            : "text-[#5D5D5D] font-medium"
                                    )}
                                >
                                    {step.label}
                                </span>

                                {/* Underline */}
                                <div
                                    className={cn(
                                        "mt-1 h-[2px] w-full transition-all duration-200",
                                        isCurrent
                                            ? "bg-[#346800]"
                                            : "bg-transparent"
                                    )}
                                />
                            </div>

                            {/* Connector Line (except last item) */}
                            {index !== steps.length - 1 && (
                                <div className="w-16 sm:w-24 h-[1px] bg-gray-300 mx-4" />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}
