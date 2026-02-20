'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    Layers,
    ShoppingBasket,
    Settings,
    ChevronRight,
    LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAdminUser, useAdminLogout } from '@/hooks/useAdminAuth';
import { useAdminStats } from '@/hooks/useAdmin';

const adminNavItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { label: 'Products', icon: ShoppingBag, href: '/admin/products' },
    { label: 'Orders', icon: ShoppingBasket, href: '/admin/orders' },
    { label: 'Users', icon: Users, href: '/admin/users' },
    { label: 'Collections', icon: Layers, href: '/admin/collections' },
]

export default function AdminSidebar() {
    const pathname = usePathname()
    const { data: user } = useAdminUser();
    const { mutate: logout } = useAdminLogout();
    const { data: stats } = useAdminStats();

    const pendingCount = stats?.orderStatusBreakdown?.find(s => s._id === 'PENDING')?.count || 0;

    const navItems = adminNavItems.map(item => ({
        ...item,
        badge: item.label === 'Orders' && pendingCount > 0 ? pendingCount : null
    }));

    return (
        <aside className="w-64 bg-stone-900 text-white flex flex-col h-screen fixed left-0 top-0 z-50">
            <div className="p-6 border-b border-stone-800">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-2xl font-black tracking-tighter text-amber-500">ANURAGA</span>
                    <span className="text-[10px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-widest">Admin</span>
                </Link>
            </div>

            <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group",
                            pathname.startsWith(item.href)
                                ? "bg-amber-600 text-white shadow-lg shadow-amber-600/20"
                                : "text-stone-400 hover:bg-stone-800 hover:text-stone-100"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <item.icon className={cn(
                                "w-5 h-5",
                                pathname.startsWith(item.href) ? "text-white" : "text-stone-500 group-hover:text-amber-500"
                            )} />
                            <span className="font-bold text-sm tracking-wide">{item.label}</span>
                        </div>
                        {item.badge ? (
                            <span className={cn(
                                "px-2 py-0.5 rounded-full text-[10px] font-black",
                                pathname.startsWith(item.href)
                                    ? "bg-white text-amber-600"
                                    : "bg-amber-500 text-stone-900"
                            )}>
                                {item.badge}
                            </span>
                        ) : (
                            pathname.startsWith(item.href) && <ChevronRight className="w-4 h-4 opacity-70" />
                        )}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-stone-800 space-y-2">
                <Link
                    href="/admin/settings"
                    className="flex items-center gap-3 px-4 py-3 text-stone-400 hover:text-stone-100 font-bold text-sm transition-all"
                >
                    <Settings className="w-5 h-5" />
                    <span>Settings</span>
                </Link>
                <div className="flex-1" />

                {user && (
                    <div className="px-4 py-3 mb-2 flex items-center gap-3 bg-stone-800 rounded-xl border border-stone-700">
                        <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold text-lg">
                            {user.name?.charAt(0) || 'A'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-white truncate">{user.name}</p>
                            <p className="text-xs text-stone-400 truncate">{user.phone}</p>
                        </div>
                    </div>
                )}

                <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/5 rounded-xl font-bold text-sm transition-all"
                    onClick={() => logout()}
                >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    )
}
