'use client'

import React from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AuthModal from '@/components/features/auth/AuthModal'
import FloatingCart from '@/components/features/cart/FloatingCart'
import CartSync from '@/components/features/cart/CartSync'

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
            <AuthModal />
            <FloatingCart />
            <CartSync />
        </>
    )
}
