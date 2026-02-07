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
            router.push('/cart');
        }
    }, [user, isLoading, router]);

    if (isLoading) {
        return <div className="min-h-screen bg-stone-50 pt-[120px] pb-20 flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-stone-50 pt-[120px] pb-20">
            <div className="container mx-auto px-4 max-w-6xl">
                <CheckoutSteps />
                {children}
            </div>
        </div>
    );
}
