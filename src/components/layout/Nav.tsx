"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    FaUser,
    FaShoppingCart,
    FaChevronDown,
    FaBars,
    FaTimes,
    FaSearch,
    FaHeart,
} from "react-icons/fa";

import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";

// 🔥 FUNCTIONALITY IMPORTS
import { useCart } from "@/hooks/useCart";
import { useUser, useLogout } from "@/hooks/useAuth";
import { useAuthModalStore } from "@/store/useAuthModalStore";
import { useCollections } from "@/hooks/useCollections";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

const TOPBAR_HEIGHT = 48;
const HEADER_HEIGHT = 96;

const Nav = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [shopOpen, setShopOpen] = useState(false);
    const [storyOpen, setStoryOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    const profileRef = useRef<HTMLDivElement | null>(null);

    // 🔥 FUNCTIONALITY
    const { data: cart } = useCart();
    const { data: user } = useUser();
    const { mutate: logout } = useLogout();
    const { openModal } = useAuthModalStore();
    const { data: collections } = useCollections();

    const cartItemCount =
        cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

    // Hydration fix
    useEffect(() => {
        setMounted(true);
    }, []);

    // close dropdown outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Element;
            
            // Don't close dropdowns if clicking on dropdown content
            if (target.closest('.dropdown-content')) {
                return;
            }
            
            if (
                profileRef.current &&
                !profileRef.current.contains(e.target as Node)
            ) {
                setProfileOpen(false);
                setShopOpen(false);
                setStoryOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        setIsLogoutModalOpen(true);
        setProfileOpen(false); // Close dropdown if open
    };

    const handleConfirmLogout = () => {
        logout();
        setIsLogoutModalOpen(false);
    };

    // Prepare navigation links with dynamic collections
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
    ];

    return (
        <>
            <header
                className="w-full z-40 bg-[#FFF9EC] border-b border-black/10 relative font-poppins"
                style={{ height: HEADER_HEIGHT }}
            >
                <div
                    className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 flex items-center justify-between h-full"
                >
                    {/* LOGO */}
                    <Link href="/" className="shrink-0">
                        <Image
                            src={logo}
                            alt="Anuraga Logo"
                            width={150}
                            height={80}
                            priority
                            className="w-[120px] sm:w-[140px] lg:w-[150px] h-auto"
                        />
                    </Link>

                    {/* DESKTOP NAVIGATION */}
                    <nav className="hidden lg:flex items-center gap-10 relative">
                        {/* SHOP */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setShopOpen((p) => !p);
                                    setStoryOpen(false);
                                }}
                                className="font-poppins font-medium text-[20px] flex items-center gap-1 text-black hover:text-[#C1572A] transition-colors"
                            >
                                Shop
                                <FaChevronDown className={cn("text-xs mt-[2px] transition-transform duration-200", shopOpen && "rotate-180")} />
                            </button>

                            {shopOpen && (
                                <div className="dropdown-content absolute top-10 w-56 bg-white rounded-xl shadow-lg border border-black/10 overflow-hidden z-[51]">
                                    <Link
                                        href="/collections/all-products"
                                        className="block px-4 py-3 hover:bg-[#FFF9EC] text-black hover:text-[#C1572A] transition-colors"
                                    >
                                        All Products
                                    </Link>
                                    {collections?.filter(col => col.slug !== 'all-products').map((col) => (
                                        <Link
                                            key={col.slug}
                                            href={`/collections/${col.slug}`}
                                            className="block px-4 py-3 hover:bg-[#FFF9EC] text-black hover:text-[#C1572A] transition-colors"
                                        >
                                            {col.name}
                                        </Link>
                                    ))}
                                    {/* Fallback Static Links if collections not loaded yet */}
                                    {!collections && (
                                        <>
                                            <Link
                                                href="/collections/pickles"
                                                className="block px-4 py-3 hover:bg-[#FFF9EC] text-black hover:text-[#C1572A] transition-colors"
                                            >
                                                Pickles
                                            </Link>
                                            <Link
                                                href="/collections/oils"
                                                className="block px-4 py-3 hover:bg-[#FFF9EC] text-black hover:text-[#C1572A] transition-colors"
                                            >
                                                Cold-Pressed Oils
                                            </Link>
                                            <Link
                                                href="/collections/spices"
                                                className="block px-4 py-3 hover:bg-[#FFF9EC] text-black hover:text-[#C1572A] transition-colors"
                                            >
                                                Spices & Masalas
                                            </Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* OUR STORY */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setStoryOpen((p) => !p);
                                    setShopOpen(false);
                                }}
                                className="font-poppins font-medium text-[20px] flex items-center gap-1 text-black hover:text-[#C1572A] transition-colors"
                            >
                                Our Story
                                <FaChevronDown className={cn("text-xs mt-[2px] transition-transform duration-200", storyOpen && "rotate-180")} />
                            </button>

                            {storyOpen && (
                                <div className="dropdown-content absolute top-10 w-64 bg-white rounded-xl shadow-lg border border-black/10 overflow-hidden z-[51]">
                                    <Link
                                        href="/about"
                                        className="block px-4 py-3 hover:bg-[#FFF9EC] text-black hover:text-[#C1572A] transition-colors"
                                    >
                                        About ANURAGA
                                    </Link>
                                    <Link
                                        href="/women-behind-food"
                                        className="block px-4 py-3 hover:bg-[#FFF9EC] text-black hover:text-[#C1572A] transition-colors"
                                    >
                                        The Women Behind Our Food
                                    </Link>
                                    <Link
                                        href="/production-process"
                                        className="block px-4 py-3 hover:bg-[#FFF9EC] text-black hover:text-[#C1572A] transition-colors"
                                    >
                                        Our Production Process
                                    </Link>
                                </div>
                            )}
                        </div>

                        <Link
                            href="/blog"
                            className="font-poppins font-medium text-[20px] text-black hover:text-[#C1572A] transition-colors"
                        >
                            Wellness Hub
                        </Link>

                        <Link
                            href="/recipes"
                            className="font-poppins font-medium text-[20px] text-black hover:text-[#C1572A] transition-colors"
                        >
                            Recipes
                        </Link>

                        <Link
                            href="/contact"
                            className="font-poppins font-medium text-[20px] text-black hover:text-[#C1572A] transition-colors"
                        >
                            Contact
                        </Link>
                    </nav>

                    {/* RIGHT SIDE */}
                    <div className="flex items-center gap-3">
                        <button className="w-10 h-10 flex items-center justify-center cursor-pointer text-black hover:text-[#C1572A] transition-colors">
                            <FaSearch className="text-lg" />
                        </button>

                        <Link
                            href="/wishlist"
                            className="w-10 h-10 flex items-center justify-center cursor-pointer text-black hover:text-red-500 transition-colors"
                        >
                            <FaHeart className="text-lg" />
                        </Link>

                        {/* PROFILE */}
                        <div className="hidden lg:block relative" ref={profileRef}>
                            {user ? (
                                <>
                                    <button
                                        onClick={() => setProfileOpen((p) => !p)}
                                        className="w-10 h-10 rounded-lg bg-[#C1572A] flex items-center justify-center cursor-pointer hover:bg-[#a04622] transition-colors"
                                    >
                                        <FaUser className="text-white text-sm" />
                                    </button>

                                    {profileOpen && (
                                        <div className="dropdown-content absolute right-0 mt-3 w-[200px] rounded-xl bg-white shadow-lg border border-black/10 overflow-hidden z-[51]">
                                            <div className="px-4 py-2 border-b border-stone-100 mb-1">
                                                <p className="text-xs text-stone-500 font-medium">Signed in as</p>
                                                <p className="text-sm font-bold text-stone-800 truncate">{user.name}</p>
                                            </div>

                                            <Link
                                                href="/account"
                                                className="block px-4 py-2.5 font-poppins text-[15px] font-medium text-black hover:bg-[#FFF9EC] hover:text-[#C1572A] transition"
                                                onClick={() => setProfileOpen(false)}
                                            >
                                                Profile
                                            </Link>

                                            <Link
                                                href="/orders"
                                                className="block px-4 py-2.5 font-poppins text-[15px] font-medium text-black hover:bg-[#FFF9EC] hover:text-[#C1572A] transition"
                                                onClick={() => setProfileOpen(false)}
                                            >
                                                Orders
                                            </Link>

                                            {user.role === "ADMIN" && (
                                                <Link
                                                    href="/admin/dashboard"
                                                    className="block px-4 py-2.5 font-poppins text-[15px] font-medium text-black hover:bg-[#FFF9EC] hover:text-[#C1572A] transition"
                                                    onClick={() => setProfileOpen(false)}
                                                >
                                                    Admin Dashboard
                                                </Link>
                                            )}

                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left block px-4 py-2.5 font-poppins text-[15px] font-medium text-red-600 hover:bg-stone-50 transition border-t border-stone-100 mt-1"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <button
                                    onClick={() => openModal("LOGIN")}
                                    className="w-10 h-10 rounded-lg bg-[#C1572A] flex items-center justify-center cursor-pointer hover:bg-[#a04622] transition-colors"
                                >
                                    <FaUser className="text-white text-sm" />
                                </button>
                            )}
                        </div>

                        {/* CART */}
                        <Link
                            href="/checkout/cart"
                            className="relative w-10 h-10 rounded-lg bg-[#C1572A] flex items-center justify-center cursor-pointer hover:bg-[#a04622] transition-colors"
                        >
                            <FaShoppingCart className="text-white text-sm" />
                            {mounted && cartItemCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white text-[10px] text-[#C1572A] flex items-center justify-center font-bold border-2 border-[#fff9ec]">
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>

                        {/* MOBILE MENU BUTTON */}
                        <button
                            onClick={() => setMenuOpen((p) => !p)}
                            className="lg:hidden w-10 h-10 rounded-lg bg-[#C1572A] flex items-center justify-center cursor-pointer hover:bg-[#a04622] transition-colors"
                        >
                            {menuOpen ? (
                                <FaTimes className="text-white text-base" />
                            ) : (
                                <FaBars className="text-white text-base" />
                            )}
                        </button>
                    </div>
                </div>

                {/* MOBILE MENU */}
                {menuOpen && (
                    <div className="lg:hidden w-full bg-[#FFF9EC] border-t border-black/10 h-[calc(100vh-144px)] overflow-y-auto absolute left-0 top-[96px] z-50 shadow-xl">
                        <div className="px-6 py-6 flex flex-col gap-4">
                            <Link href="/collections/all-products" onClick={() => setMenuOpen(false)} className="font-poppins text-[18px] font-medium text-stone-800 hover:text-[#C1572A] transition-colors">Shop</Link>
                            <Link href="/about" onClick={() => setMenuOpen(false)} className="font-poppins text-[18px] font-medium text-stone-800 hover:text-[#C1572A] transition-colors">Our Story</Link>
                            <Link href="/blog" onClick={() => setMenuOpen(false)} className="font-poppins text-[18px] font-medium text-stone-800 hover:text-[#C1572A] transition-colors">Wellness Hub</Link>
                            <Link href="/recipes" onClick={() => setMenuOpen(false)} className="font-poppins text-[18px] font-medium text-stone-800 hover:text-[#C1572A] transition-colors">Recipes</Link>
                            <Link href="/contact" onClick={() => setMenuOpen(false)} className="font-poppins text-[18px] font-medium text-stone-800 hover:text-[#C1572A] transition-colors">Contact</Link>

                            <div className="mt-4 pt-4 border-t border-black/10 flex flex-col gap-4">
                                {user ? (
                                    <>
                                        <div className="font-poppins text-[16px] font-medium text-stone-500">Hi, {user.name}</div>
                                        <Link href="/account" onClick={() => setMenuOpen(false)} className="font-poppins text-[18px] font-medium text-stone-800 hover:text-[#C1572A] transition-colors">Profile</Link>
                                        <Link href="/orders" onClick={() => setMenuOpen(false)} className="font-poppins text-[18px] font-medium text-stone-800 hover:text-[#C1572A] transition-colors">Orders</Link>
                                        <button onClick={handleLogout} className="text-left font-poppins text-[18px] font-medium text-red-600 hover:text-red-700 transition-colors">Logout</button>
                                    </>
                                ) : (
                                    <button onClick={() => { openModal('LOGIN'); setMenuOpen(false); }} className="text-left font-poppins text-[18px] font-medium text-[#C1572A] hover:text-[#a04622] transition-colors">Login / Sign Up</button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </header>

            <ConfirmationModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleConfirmLogout}
                title="Logout Confirmation"
                message="Are you sure you want to logout?"
                confirmText="Logout"
                cancelText="Cancel"
                variant="danger"
            />
        </>
    );
};

export default Nav;