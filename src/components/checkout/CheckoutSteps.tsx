'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Check, ShoppingCart, MapPin, CreditCard, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const steps = [
    {
        id: 'cart',
        label: 'Cart',
        path: '/cart',
        icon: ShoppingCart,
    },
    {
        id: 'address',
        label: 'Address',
        path: '/checkout/address',
        icon: MapPin,
    },
    {
        id: 'payment',
        label: 'Payment',
        path: '/checkout/payment',
        icon: CreditCard,
    },
];

export default function CheckoutSteps() {
    const pathname = usePathname();

    const getCurrentStepIndex = () => {
        if (pathname === '/cart') return 0;
        if (pathname.includes('/checkout/address')) return 1;
        if (pathname.includes('/checkout/payment')) return 2;
        return 0;
    };

    const currentStepIndex = getCurrentStepIndex();

    return (
        <div className="w-full py-8">
            <div className="flex items-center justify-center gap-2 md:gap-4">
                {steps.map((step, index) => {
                    const isCompleted = index < currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    const Icon = step.icon;

                    return (
                        <div key={step.id} className="flex items-center">
                            {/* Step Indicator */}
                            <div className={cn(
                                "flex items-center gap-2",
                                isCompleted ? "text-emerald-600" : isCurrent ? "text-amber-600" : "text-stone-400"
                            )}>
                                <div className={cn(
                                    "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                                    isCompleted ? "bg-emerald-100 border-emerald-600" :
                                        isCurrent ? "bg-amber-100 border-amber-600" : "bg-stone-50 border-stone-200"
                                )}>
                                    {isCompleted ? (
                                        <Check className="w-4 h-4 md:w-5 md:h-5" />
                                    ) : (
                                        <Icon className="w-4 h-4 md:w-5 md:h-5" />
                                    )}
                                </div>
                                <span className={cn(
                                    "text-xs md:text-sm font-bold uppercase tracking-wider hidden md:block",
                                    isCurrent && "font-black"
                                )}>
                                    {step.label}
                                </span>
                            </div>

                            {/* Separator Line */}
                            {index < steps.length - 1 && (
                                <div className="mx-2 md:mx-4 w-8 md:w-16 h-[2px] bg-stone-100 relative">
                                    <div
                                        className="absolute inset-0 bg-emerald-500 transition-all duration-500"
                                        style={{
                                            width: isCompleted ? '100%' : '0%'
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
