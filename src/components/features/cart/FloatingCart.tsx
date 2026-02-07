'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, ArrowRight } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

export default function FloatingCart() {
    const { data: cart } = useCart()
    const pathname = usePathname()
    const [isVisible, setIsVisible] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const items = cart?.items || []
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)
    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0)

    useEffect(() => {
        if (itemCount > 0 && pathname !== '/cart') {
            setIsVisible(true)
        } else {
            setIsVisible(false)
        }
    }, [itemCount, pathname])

    if (!mounted || !isVisible) return null

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-lg px-4 animate-in fade-in slide-in-from-bottom-5 duration-500">
            <Link
                href="/cart"
                className="flex items-center justify-between bg-stone-900 border border-stone-800 text-white p-4 rounded-2xl shadow-2xl hover:bg-stone-800 transition-all group active:scale-[0.98]"
            >
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="bg-amber-600 p-2.5 rounded-xl group-hover:bg-amber-500 transition-colors">
                            <ShoppingCart className="w-5 h-5 text-white" />
                        </div>
                        <span className="absolute -top-1.5 -right-1.5 bg-white text-stone-900 text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-stone-900">
                            {itemCount}
                        </span>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-stone-400 uppercase tracking-wider">Your Delights</p>
                        <p className="text-lg font-bold">₹{subtotal.toLocaleString()}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl group-hover:bg-white/20 transition-colors">
                    <span className="text-sm font-bold">Checkout</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
            </Link>
        </div>
    )
}
