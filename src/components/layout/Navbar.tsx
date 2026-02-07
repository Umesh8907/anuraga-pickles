'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingBag, Menu, X, User, Search } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { cn } from '@/lib/utils'

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const cartItems = useCartStore((state) => state.items)
    const [mounted, setMounted] = useState(false)

    // Hydration fix for zustand
    useEffect(() => {
        setMounted(true)
    }, [])

    const navLinks = [
        { name: 'Shop All', href: '/collections/all-products' },
        { name: 'Pickles', href: '/collections/mango-pickles' },
        { name: 'Combos', href: '/collections/combos' },
        { name: 'Festive Deals', href: '/collections/festive-deals' },
    ]

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-2xl font-extrabold text-amber-700 tracking-tighter">
                            Anuraga<span className="text-stone-800">Pickles</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex space-x-8 items-center">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-stone-600 hover:text-amber-700 font-medium transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Icons / Actions */}
                    <div className="flex items-center space-x-6">
                        <button className="text-stone-600 hover:text-amber-700 transition-colors">
                            <Search className="w-5 h-5" />
                        </button>
                        <Link href="/account" className="text-stone-600 hover:text-amber-700 transition-colors hidden sm:block">
                            <User className="w-5 h-5" />
                        </Link>
                        <Link href="/cart" className="group flex items-center text-stone-600 hover:text-amber-700 transition-colors relative">
                            <ShoppingBag className="w-5 h-5" />
                            {mounted && cartItems.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                    {cartItems.length}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="text-stone-600 hover:text-amber-700 focus:outline-none"
                            >
                                {isMobileMenuOpen ? (
                                    <X className="w-6 h-6" />
                                ) : (
                                    <Menu className="w-6 h-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-stone-100">
                    <div className="pt-2 pb-4 space-y-1 px-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:text-amber-700 hover:bg-stone-50"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            href="/account"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:text-amber-700 hover:bg-stone-50"
                        >
                            My Account
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    )
}
