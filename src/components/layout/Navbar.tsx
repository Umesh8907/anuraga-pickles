'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Menu, X, User, Search, LogOut, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCart } from '@/hooks/useCart'
import { useUser, useLogout } from '@/hooks/useAuth'
import { useAuthModalStore } from '@/store/useAuthModalStore'
import { useCollections } from '@/hooks/useCollections'
import ConfirmationModal from '@/components/ui/ConfirmationModal'

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [expandedMobileSection, setExpandedMobileSection] = useState<string | null>(null)
    const [mounted, setMounted] = useState(false)
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

    // Data Hooks
    const { data: cart } = useCart();
    const { data: user } = useUser();
    const { mutate: logout } = useLogout();
    const { data: collections } = useCollections();

    const { openModal } = useAuthModalStore();
    const cartItemCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

    // Hydration fix
    useEffect(() => {
        setMounted(true)
    }, [])

    const navLinks = [
        {
            name: 'Shop',
            href: '/collections/all-products',
            isDropdown: true,
            children: [
                { name: 'All Products', href: '/collections/all-products' },
                ...(collections?.filter(col => col.slug !== 'all-products').map(col => ({
                    name: col.name,
                    href: `/collections/${col.slug}`
                })) || [
                        { name: 'Pickles', href: '/collections/pickles' },
                        { name: 'Cold-Pressed Oils', href: '#', isComingSoon: true },
                        { name: 'Spices & Masalas', href: '#', isComingSoon: true },
                    ]),
            ],
        },
        {
            name: 'Our Story',
            href: '/about',
            isDropdown: true,
            children: [
                { name: 'About ANURAGA', href: '/about' },
                { name: 'The Women Behind Our Food', href: '/women-behind-food' },
                { name: 'Our Production Process', href: '/production-process' },
            ],
        },
        { name: 'Wellness Hub', href: '/blog' },
        { name: 'Recipes', href: '/recipes' },
        { name: 'Contact', href: '/contact' },
    ]

    const toggleMobileSection = (name: string) => {
        if (expandedMobileSection === name) {
            setExpandedMobileSection(null)
        } else {
            setExpandedMobileSection(name)
        }
    }

    const handleLogout = () => {
        setIsLogoutModalOpen(true);
        setIsMobileMenuOpen(false);
    }

    const handleConfirmLogout = () => {
        logout();
        setIsLogoutModalOpen(false);
    }

    return (
        <>
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-24">
                        {/* Logo */}
                        <div className="shrink-0 flex items-center">
                            <Link href="/" className="flex items-center gap-3 group">
                                <div className="relative h-32 w-32 transition-transform duration-500 group-hover:scale-110">
                                    <Image
                                        src="/logo.png"
                                        alt="Anuraga Logo"
                                        fill
                                        className="object-contain"
                                        priority
                                    />
                                </div>

                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex space-x-8 items-center">
                            {navLinks.map((link) => (
                                <div key={link.name} className="relative group">
                                    {link.isDropdown ? (
                                        <button className="flex items-center text-stone-600 hover:text-brand-teal font-medium transition-colors py-2">
                                            {link.name}
                                            <svg
                                                className="w-4 h-4 ml-1 transform group-hover:rotate-180 transition-transform duration-200"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    ) : (
                                        <Link
                                            href={link.href}
                                            className="text-stone-600 hover:text-amber-700 font-medium transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    )}

                                    {/* Dropdown Menu */}
                                    {link.isDropdown && link.children && (
                                        <div className="absolute left-0 mt-0 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out z-50 pt-2">
                                            <div className="bg-white border border-stone-100 rounded-lg shadow-xl overflow-hidden">
                                                {link.children.map((child) => (
                                                    <Link
                                                        key={child.href + child.name}
                                                        href={child.href}
                                                        className={cn(
                                                            "block px-4 py-3 text-sm transition-colors hover:bg-stone-50",
                                                            child.isComingSoon
                                                                ? "text-stone-400 cursor-not-allowed pointer-events-none"
                                                                : "text-stone-700 hover:text-amber-700"
                                                        )}
                                                    >
                                                        <div className="flex justify-between items-center">
                                                            <span>{child.name}</span>
                                                            {child.isComingSoon && (
                                                                <span className="text-[10px] uppercase font-bold text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
                                                                    Soon
                                                                </span>
                                                            )}
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Icons / Actions */}
                        <div className="flex items-center space-x-4 sm:space-x-6">
                            <button className="text-stone-600 hover:text-brand-teal transition-colors p-1">
                                <Search className="w-5 h-5" />
                            </button>

                            <Link href="/wishlist" className="text-stone-600 hover:text-red-500 transition-colors p-1 relative group">
                                <Heart className="w-5 h-5 group-hover:fill-current" />
                            </Link>

                            <div className="hidden sm:flex items-center border-l border-stone-200 pl-6 space-x-6">
                                {user ? (
                                    <div className="flex items-center space-x-4">
                                        {user.role === 'ADMIN' && (
                                            <Link
                                                href="/admin/dashboard"
                                                className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-amber-200 transition-colors"
                                            >
                                                Admin
                                            </Link>
                                        )}

                                        <div className="relative group">
                                            <button className="flex items-center space-x-2 text-stone-600 hover:text-brand-teal transition-colors py-2">
                                                <User className="w-5 h-5" />
                                                <span className="text-sm font-medium">Hi, {user.name?.split(' ')[0]}</span>
                                            </button>

                                            {/* Dropdown */}
                                            <div className="absolute right-0 mt-0 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out z-50 pt-2">
                                                <div className="bg-white border border-stone-100 rounded-lg shadow-xl overflow-hidden py-1">
                                                    <Link href="/account" className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:text-amber-700">
                                                        Account
                                                    </Link>
                                                    <Link href="/orders" className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 hover:text-amber-700">
                                                        Orders
                                                    </Link>
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-stone-50"
                                                    >
                                                        Logout
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => openModal('LOGIN')}
                                        className="flex items-center space-x-1 text-stone-600 hover:text-brand-teal transition-colors"
                                    >
                                        <User className="w-5 h-5" />
                                        <span className="text-sm font-medium">Login</span>
                                    </button>
                                )}
                            </div>

                            <Link href="/checkout/cart" className="group flex items-center text-stone-600 hover:text-amber-700 transition-colors relative p-1">
                                <ShoppingBag className="w-5 h-5" />
                                {mounted && cartItemCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-amber-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                                        {cartItemCount}
                                    </span>
                                )}
                            </Link>

                            {/* Mobile Menu Button */}
                            <div className="lg:hidden flex items-center ml-2">
                                <button
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="text-stone-600 hover:text-amber-700 focus:outline-none p-1"
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
                    <div className="lg:hidden bg-white border-t border-stone-100 h-[calc(100vh-80px)] overflow-y-auto">
                        <div className="py-2 px-4 space-y-1">
                            {navLinks.map((link) => (
                                <div key={link.name} className="border-b border-stone-50 last:border-0">
                                    {link.isDropdown ? (
                                        <>
                                            <button
                                                onClick={() => toggleMobileSection(link.name)}
                                                className="flex justify-between items-center w-full px-3 py-4 text-base font-medium text-stone-800 hover:text-amber-700"
                                            >
                                                {link.name}
                                                <svg
                                                    className={cn(
                                                        "w-4 h-4 text-stone-400 transition-transform duration-200",
                                                        expandedMobileSection === link.name ? "rotate-180" : ""
                                                    )}
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                            <div
                                                className={cn(
                                                    "overflow-hidden transition-all duration-300 ease-in-out bg-stone-50",
                                                    expandedMobileSection === link.name ? "max-h-96" : "max-h-0"
                                                )}
                                            >
                                                {link.children?.map((child) => (
                                                    <Link
                                                        key={child.href + child.name}
                                                        href={child.href}
                                                        onClick={() => !child.isComingSoon && setIsMobileMenuOpen(false)}
                                                        className={cn(
                                                            "block px-6 py-3 text-sm font-medium",
                                                            child.isComingSoon
                                                                ? "text-stone-400"
                                                                : "text-stone-600 hover:text-amber-700"
                                                        )}
                                                    >
                                                        <div className="flex justify-between items-center">
                                                            <span>{child.name}</span>
                                                            {child.isComingSoon && (
                                                                <span className="text-[10px] uppercase font-bold text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200">
                                                                    Soon
                                                                </span>
                                                            )}
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <Link
                                            href={link.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block px-3 py-4 text-base font-medium text-stone-800 hover:text-amber-700 hover:bg-stone-50"
                                        >
                                            {link.name}
                                        </Link>
                                    )}
                                </div>
                            ))}
                            <div className="pt-4 pb-6 px-3 border-t border-stone-100 mt-4">
                                {user ? (
                                    <div className="space-y-2">
                                        <div className="px-4 py-2 font-medium text-stone-800 border-b border-stone-100 mb-2">Hi, {user.name}</div>
                                        <Link
                                            href="/account"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block px-4 py-3 text-base font-medium text-stone-600 hover:text-amber-700 hover:bg-stone-50"
                                        >
                                            Account
                                        </Link>
                                        <Link
                                            href="/orders"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block px-4 py-3 text-base font-medium text-stone-600 hover:text-amber-700 hover:bg-stone-50"
                                        >
                                            Orders
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center w-full px-4 py-3 text-base font-medium text-red-600 hover:bg-stone-50"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => {
                                            openModal('LOGIN');
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="flex items-center justify-center w-full px-4 py-3 border border-stone-200 rounded-lg text-base font-medium text-stone-700 hover:bg-stone-50 hover:text-amber-700 transition-colors"
                                    >
                                        <User className="w-5 h-5 mr-2" />
                                        Login / Account
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            <ConfirmationModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleConfirmLogout}
                title="Logout Confirmation"
                message="Are you sure you want to logout? You will need to login again to access your account."
                confirmText="Logout"
                cancelText="Cancel"
                variant="danger"
            />
        </>
    )
}
