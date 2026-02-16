'use client'

import React from 'react'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import AuthModal from '@/components/features/auth/AuthModal'
import FloatingCart from '@/components/features/cart/FloatingCart'
import CartSync from '@/components/features/cart/CartSync'

import TopBar from '@/components/layout/TopBar'

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="sticky top-0 z-50 w-full">
                <TopBar />
                <Nav />
            </div>
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
