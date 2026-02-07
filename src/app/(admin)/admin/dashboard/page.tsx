'use client'

import React from 'react'
import {
    Users,
    ShoppingBag,
    ShoppingBasket,
    IndianRupee,
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp,
    Package,
    Clock
} from 'lucide-react'
import { useAdminStats } from '@/hooks/useAdmin'
import { cn } from '@/lib/utils'

export default function AdminDashboard() {
    const { data: stats, isLoading, isError } = useAdminStats()

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-8 h-8 border-4 border-stone-200 border-t-amber-600 rounded-full animate-spin"></div>
        </div>
    )

    if (isError || !stats) return (
        <div className="bg-red-50 text-red-600 p-8 rounded-2xl text-center border border-red-100">
            <h2 className="text-xl font-bold mb-2">Error Loading Stats</h2>
            <p className="text-sm">We couldn't fetch the latest data. Please refresh the page.</p>
        </div>
    )

    const cards = [
        {
            label: 'Total Revenue',
            value: `₹${stats.counts.revenue.toLocaleString()}`,
            icon: IndianRupee,
            trend: '+12.5%',
            isUp: true,
            color: 'bg-emerald-500'
        },
        {
            label: 'Total Orders',
            value: stats.counts.orders,
            icon: ShoppingBasket,
            trend: '+8.2%',
            isUp: true,
            color: 'bg-amber-500'
        },
        {
            label: 'Total Products',
            value: stats.counts.products,
            icon: ShoppingBag,
            trend: '+2.1%',
            isUp: true,
            color: 'bg-blue-500'
        },
        {
            label: 'Total Users',
            value: stats.counts.users,
            icon: Users,
            trend: '+4.5%',
            isUp: true,
            color: 'bg-purple-500'
        },
    ]

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-stone-900 tracking-tight">Dashboard Overview</h1>
                    <p className="text-stone-500 font-medium">Welcome back, Admin. Here's what's happening with ANURAGA today.</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-stone-200 shadow-sm">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">Store Status</p>
                        <p className="text-xs font-black text-emerald-600">ONLINE & ACTIVE</p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
                        <div className="flex items-start justify-between mb-4">
                            <div className={cn("p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg", card.color)}>
                                <card.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className={cn(
                                "flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black tracking-wide",
                                card.isUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                            )}>
                                {card.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {card.trend}
                            </div>
                        </div>
                        <p className="text-stone-500 text-sm font-bold uppercase tracking-wider mb-1">{card.label}</p>
                        <p className="text-3xl font-black text-stone-900">{card.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-stone-100 flex items-center justify-between">
                        <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-amber-600" />
                            Recent Orders
                        </h2>
                        <button className="text-xs font-bold text-amber-600 hover:text-amber-700 uppercase tracking-widest">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-stone-50 border-b border-stone-100">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black text-stone-500 uppercase tracking-widest">Order ID</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-stone-500 uppercase tracking-widest">Customer</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-stone-500 uppercase tracking-widest">Amount</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-stone-500 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-50 font-medium">
                                {stats.recentOrders.map((order: any) => (
                                    <tr key={order._id} className="hover:bg-amber-50/30 transition-colors">
                                        <td className="px-6 py-4 text-xs font-bold text-stone-900">#{order._id.slice(-6).toUpperCase()}</td>
                                        <td className="px-6 py-4 text-stone-600 text-xs">
                                            {order.user?.name || 'Guest Customer'}
                                        </td>
                                        <td className="px-6 py-4 text-stone-900 font-bold text-xs">₹{order.totalAmount}</td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide",
                                                order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' :
                                                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                                        'bg-amber-100 text-amber-700'
                                            )}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Low Stock Alerts */}
                <div className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-stone-100">
                        <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
                            <Package className="w-5 h-5 text-red-600" />
                            Inventory Alerts
                        </h2>
                    </div>
                    <div className="p-6 space-y-6 flex-1">
                        {stats.lowStockProducts.map((product: any) => (
                            <div key={product._id} className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                                    {product.variants[0]?.stock}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black text-stone-900 truncate">{product.name}</p>
                                    <p className="text-xs text-red-500 font-bold uppercase tracking-tighter">Low Stock Left</p>
                                </div>
                                <button className="p-2 text-stone-400 hover:text-amber-600 transition-colors">
                                    <ArrowUpRight className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        {stats.lowStockProducts.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-center py-12">
                                <Package className="w-10 h-10 text-stone-200 mb-2" />
                                <p className="text-sm text-stone-400 font-bold">Inventory levels are healthy.</p>
                            </div>
                        )}
                    </div>
                    <div className="p-6 bg-stone-50 border-t border-stone-100">
                        <button className="w-full py-3 bg-white border border-stone-200 rounded-xl text-xs font-black text-stone-600 hover:border-amber-500 hover:text-amber-600 transition-all uppercase tracking-widest shadow-sm">
                            Manage Inventory
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
