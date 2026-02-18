"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
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
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [expandedMobileSections, setExpandedMobileSections] = useState<string[]>([]);

    const pathname = usePathname();
    const navRef = useRef<HTMLDivElement | null>(null);
    const profileRef = useRef<HTMLDivElement | null>(null);

    // 🔥 FUNCTIONALITY
    const { data: cart } = useCart();
    const { data: user } = useUser();
    const { mutate: logout } = useLogout();
    const { openModal } = useAuthModalStore();
    const { data: collections } = useCollections();

    const cartItemCount =
        cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

    // Navigation Links structure
    const navLinks = [
        {
            name: "Shop",
            href: "/collections/all-products",
            isDropdown: true,
            children: [
                { name: "All Products", href: "/collections/all-products" },
                ...(collections?.filter(col => col.slug !== 'all-products').map(col => ({
                    name: col.name,
                    href: `/collections/${col.slug}`
                })) || [
                        { name: "Pickles", href: "/collections/pickles" },
                        { name: "Seasonal Collections", href: "/collections/seasonal", isComingSoon: true },
                        { name: "Gift Sets", href: "/collections/gift-sets", isComingSoon: true },
                    ]),
            ],
        },
        {
            name: "Our Story",
            href: "/about",
            isDropdown: true,
            children: [
                { name: "About ANURAGA", href: "/#whyanuraga" },
                { name: "Meet the Artisans", href: "/#carouselcard" },
                { name: "Our Production Process", href: "/#howitsmade" },
            ],
        },
        { name: "Wellness Hub", href: "/blog" },
        { name: "Recipes", href: "/recipes" },
        { name: "Contact", href: "/contact" },
    ];

    // Hydration fix
    useEffect(() => {
        setMounted(true);
    }, []);

    // Close menus on route change
    useEffect(() => {
        setMenuOpen(false);
        setProfileOpen(false);
        setActiveDropdown(null);
    }, [pathname]);

    // close dropdown outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const isInsideNav = navRef.current && navRef.current.contains(e.target as Node);
            const isInsideProfile = profileRef.current && profileRef.current.contains(e.target as Node);

            if (!isInsideNav && !isInsideProfile) {
                setActiveDropdown(null);
                setProfileOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleMobileSection = (name: string) => {
        setExpandedMobileSections(prev =>
            prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
        );
    };

    const handleLogout = () => {
        setIsLogoutModalOpen(true);
        setProfileOpen(false);
        setMenuOpen(false);
    };

    const handleConfirmLogout = () => {
        logout();
        setIsLogoutModalOpen(false);
    };

    return (
        <>
            <header
                className="w-full z-40 bg-[#FFF9EC] border-b border-black/10 relative font-poppins"
                style={{ height: HEADER_HEIGHT }}
            >
                <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 flex items-center justify-between h-full">
                    {/* LOGO */}
                    <Link href="/" className="shrink-0 group">
                        <Image
                            src={logo}
                            alt="Anuraga Logo"
                            width={150}
                            height={80}
                            priority
                            className="w-[120px] sm:w-[140px] lg:w-[150px] h-auto transition-transform group-hover:scale-105"
                        />
                    </Link>

                    {/* DESKTOP NAVIGATION */}
                    <nav className="hidden lg:flex items-center gap-10 relative" ref={navRef}>
                        {navLinks.map((link) => (
                            <div key={link.name} className="relative">
                                {link.isDropdown ? (
                                    <button
                                        onClick={() => setActiveDropdown(activeDropdown === link.name ? null : link.name)}
                                        className={cn(
                                            "font-poppins font-medium text-[20px] flex items-center gap-1 transition-colors",
                                            activeDropdown === link.name ? "text-[#C1572A]" : "text-black hover:text-[#C1572A]"
                                        )}
                                    >
                                        {link.name}
                                        <FaChevronDown className={cn("text-[10px] mt-1 transition-transform duration-200", activeDropdown === link.name && "rotate-180")} />
                                    </button>
                                ) : (
                                    <Link
                                        href={link.href}
                                        className="font-poppins font-medium text-[20px] text-black hover:text-[#C1572A] transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                )}

                                {link.isDropdown && activeDropdown === link.name && (
                                    <div className="absolute top-[50px] left-0 w-64 bg-white rounded-xl shadow-2xl border border-black/5 overflow-hidden z-[51] animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="py-2">
                                            {link.children?.map((child, idx) => (
                                                <Link
                                                    key={`${child.href}-${idx}`}
                                                    href={child.href}
                                                    onClick={() => {
                                                        if (child.isComingSoon) return;
                                                        setActiveDropdown(null);
                                                        setMenuOpen(false);
                                                    }}
                                                    className={cn(
                                                        "flex justify-between items-center px-4 py-3 text-[15px] font-medium transition-colors",
                                                        child.isComingSoon
                                                            ? "text-stone-300 cursor-not-allowed pointer-events-none"
                                                            : "text-stone-700 hover:bg-[#FFF9EC] hover:text-[#C1572A]"
                                                    )}
                                                >
                                                    {child.name}
                                                    {child.isComingSoon && (
                                                        <span className="text-[9px] uppercase font-bold bg-stone-100 text-stone-400 px-1.5 py-0.5 rounded-full">Soon</span>
                                                    )}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
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
                                        onClick={() => {
                                            setProfileOpen(!profileOpen);
                                            setActiveDropdown(null);
                                        }}
                                        className="w-10 h-10 rounded-lg bg-[#C1572A] flex items-center justify-center cursor-pointer hover:bg-[#a04622] transition-colors"
                                    >
                                        <FaUser className="text-white text-sm" />
                                    </button>

                                    {profileOpen && (
                                        <div className="absolute right-0 mt-3 w-[220px] rounded-xl bg-white shadow-2xl border border-black/5 overflow-hidden z-[51] animate-in fade-in slide-in-from-top-2 duration-200">
                                            <div className="px-4 py-3 bg-stone-50 border-b border-stone-100 mb-1">
                                                <p className="text-[10px] uppercase tracking-wider text-stone-500 font-bold mb-0.5">Signed in as</p>
                                                <p className="text-sm font-bold text-stone-800 truncate">{user.name}</p>
                                            </div>

                                            <Link href="/account" className="block px-4 py-2.5 font-medium text-stone-700 hover:bg-[#FFF9EC] hover:text-[#C1572A] transition" onClick={() => setProfileOpen(false)}>Profile</Link>
                                            <Link href="/orders" className="block px-4 py-2.5 font-medium text-stone-700 hover:bg-[#FFF9EC] hover:text-[#C1572A] transition" onClick={() => setProfileOpen(false)}>Orders</Link>

                                            {user.role === "ADMIN" && (
                                                <Link href="/admin/dashboard" className="block px-4 py-2.5 font-bold text-amber-600 hover:bg-amber-50 transition" onClick={() => setProfileOpen(false)}>Admin Dashboard</Link>
                                            )}

                                            <button onClick={handleLogout} className="w-full text-left block px-4 py-3 font-bold text-red-600 hover:bg-red-50 transition border-t border-stone-100 mt-1 uppercase text-xs tracking-widest">Logout</button>
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
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="lg:hidden w-10 h-10 rounded-lg bg-[#C1572A] flex items-center justify-center cursor-pointer hover:bg-[#a04622] transition-colors"
                        >
                            {menuOpen ? <FaTimes className="text-white text-base" /> : <FaBars className="text-white text-base" />}
                        </button>
                    </div>
                </div>

                {/* MOBILE MENU */}
                {menuOpen && (
                    <div className="lg:hidden w-full bg-[#FFF9EC] border-t border-black/10 h-[calc(100vh-96px)] overflow-y-auto absolute left-0 top-[96px] z-50 shadow-xl animate-in slide-in-from-top duration-300">
                        <div className="px-6 py-8 flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <div key={link.name} className="border-b border-black/5 last:border-0 pb-2 mb-2">
                                    {link.isDropdown ? (
                                        <>
                                            <button
                                                onClick={() => toggleMobileSection(link.name)}
                                                className="flex justify-between items-center w-full py-3 text-[18px] font-bold text-stone-800"
                                            >
                                                {link.name}
                                                <FaChevronDown className={cn("text-xs transition-transform duration-300", expandedMobileSections.includes(link.name) && "rotate-180")} />
                                            </button>
                                            <div className={cn("overflow-hidden transition-all duration-300 flex flex-col gap-1 pl-4 bg-black/5 rounded-xl", expandedMobileSections.includes(link.name) ? "max-h-screen py-2 mb-2" : "max-h-0")}>
                                                {link.children?.map((child, idx) => (
                                                    <Link
                                                        key={`${child.href}-${idx}`}
                                                        href={child.href}
                                                        onClick={() => !child.isComingSoon && setMenuOpen(false)}
                                                        className={cn(
                                                            "py-2.5 px-3 text-[16px] font-medium rounded-lg",
                                                            child.isComingSoon ? "text-stone-400" : "text-stone-700 active:bg-white"
                                                        )}
                                                    >
                                                        <div className="flex justify-between items-center">
                                                            <span>{child.name}</span>
                                                            {child.isComingSoon && (
                                                                <span className="text-[9px] uppercase font-bold bg-stone-100 text-stone-400 px-2 py-0.5 rounded-full">Soon</span>
                                                            )}
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <Link
                                            href={link.href}
                                            onClick={() => setMenuOpen(false)}
                                            className="block py-3 text-[18px] font-bold text-stone-800"
                                        >
                                            {link.name}
                                        </Link>
                                    )}
                                </div>
                            ))}

                            <div className="mt-4 pt-6 border-t border-black/10 flex flex-col gap-4">
                                {user ? (
                                    <>
                                        <div className="bg-white/50 p-4 rounded-2xl border border-black/5">
                                            <p className="text-[10px] uppercase font-bold text-stone-400 mb-1">Account</p>
                                            <p className="text-lg font-bold text-stone-800">{user.name}</p>
                                        </div>
                                        <Link href="/account" onClick={() => setMenuOpen(false)} className="text-[18px] font-bold text-stone-800 py-2">Profile</Link>
                                        <Link href="/orders" onClick={() => setMenuOpen(false)} className="text-[18px] font-bold text-stone-800 py-2">Orders</Link>
                                        <button onClick={handleLogout} className="text-left text-[18px] font-bold text-red-600 py-2 uppercase tracking-widest text-sm">Logout</button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => { openModal('LOGIN'); setMenuOpen(false); }}
                                        className="bg-[#C1572A] text-white py-4 rounded-xl font-bold shadow-lg shadow-[#C1572A]/20 active:scale-95 transition-transform"
                                    >
                                        Login / Sign Up
                                    </button>
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
                message="Are you sure you want to logout? You'll be missed!"
                confirmText="Logout"
                cancelText="Cancel"
                variant="danger"
            />
        </>
    );
};

export default Nav;
