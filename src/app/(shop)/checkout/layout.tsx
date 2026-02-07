import React from 'react';
import CheckoutSteps from '@/components/checkout/CheckoutSteps';

export default function CheckoutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-stone-50 pt-[120px] pb-20">
            <div className="container mx-auto px-4 max-w-6xl">
                <CheckoutSteps />
                {children}
            </div>
        </div>
    );
}
