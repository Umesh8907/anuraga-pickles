'use client';

import React, { useEffect } from 'react';
import CheckoutSteps from '@/components/checkout/CheckoutSteps';
import { useUser } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function CheckoutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: user, isLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/checkout/cart');
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return <div className="min-h-screen bg-[#fbf6ee] pt-[140px] sm:pt-[140px] md:pt-[150px] lg:pt-[160px] pb-20 flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-[#fbf6ee] pt-[100px] sm:pt-[80px] md:pt-[90px] lg:pt-[90px] pb-20 font-poppins">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
                <CheckoutSteps />
                {children}
            </div>
        </div>
    );
}
