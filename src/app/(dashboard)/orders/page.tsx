'use client'

import React from 'react'
import { useOrders } from '@/hooks/useOrders'
import { Package, ChevronRight, ShoppingBag, Clock, CheckCircle2, Truck, XCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const statusConfig = {
    PENDING: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', label: 'Processing' },
    CONFIRMED: { icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', label: 'Confirmed' },
    SHIPPED: { icon: Truck, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', label: 'In Transit' },
    DELIVERED: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100', label: 'Delivered' },
    CANCELLED: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', label: 'Cancelled' },
}

export default function OrdersPage() {
    const { data: orders, isLoading } = useOrders();

    if (isLoading) return <div className="min-h-screen pt-32 text-center text-stone-600 font-medium italic">Loading your order history...</div>;

    return (
        <div className="min-h-screen bg-stone-50 pt-24 pb-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">Order History</h1>
                        <p className="text-stone-500 mt-1 font-medium italic">Trace your journey of authentic flavors.</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-stone-100 shadow-sm">
                        <ShoppingBag className="w-5 h-5 text-amber-600" />
                        <span className="font-bold text-stone-900">{orders?.length || 0} Total Orders</span>
                    </div>
                </div>

                {!orders || orders.length === 0 ? (
                    <div className="bg-white rounded-[3rem] p-16 text-center shadow-sm border border-stone-100">
                        <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="w-12 h-12 text-stone-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-stone-900 mb-4">No orders yet?</h2>
                        <p className="text-stone-500 mb-10 italic max-w-xs mx-auto leading-relaxed">It seems you haven't started your spice collection yet. Our pickles are waiting for you!</p>
                        <Link
                            href="/collections/all-products"
                            className="inline-flex items-center gap-2 bg-stone-900 text-white font-bold px-8 py-4 rounded-2xl hover:bg-amber-600 transition-all shadow-xl hover:shadow-amber-100"
                        >
                            Explore Collection
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => {
                            const status = statusConfig[order.orderStatus as keyof typeof statusConfig] || statusConfig.PENDING;
                            const StatusIcon = status.icon;

                            return (
                                <Link
                                    key={order._id}
                                    href={`/orders/${order._id}`}
                                    className="block bg-white border border-stone-100 rounded-[2.5rem] p-6 sm:p-8 hover:shadow-2xl hover:border-amber-100 transition-all duration-300 group relative overflow-hidden"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                        <div className="flex items-start gap-6">
                                            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors", status.bg, status.color)}>
                                                <StatusIcon className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">Order #{order._id?.slice(-8).toUpperCase()}</span>
                                                    <span className={cn("px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border", status.bg, status.color, status.border)}>
                                                        {status.label}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg font-bold text-stone-900 italic">
                                                    {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'} • ₹{order.totalAmount.toLocaleString()}
                                                </h3>
                                                <div className="flex items-center gap-2 text-stone-500 text-sm mt-1 italic font-medium">
                                                    <Clock className="w-4 h-4" />
                                                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-end gap-6 sm:pl-6 sm:border-l border-stone-50">
                                            <div className="flex -space-x-3 overflow-hidden">
                                                {order.items.slice(0, 3).map((item, idx) => (
                                                    <div key={idx} className="w-12 h-12 rounded-full border-2 border-white bg-stone-50 overflow-hidden shadow-sm">
                                                        <img
                                                            src={item.image || 'https://placehold.co/100x100?text=Pickle'}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                ))}
                                                {order.items.length > 3 && (
                                                    <div className="w-12 h-12 rounded-full border-2 border-white bg-stone-800 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                                                        +{order.items.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-300 group-hover:bg-amber-600 group-hover:text-white transition-all duration-500">
                                                <ChevronRight className="w-6 h-6" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Preview of item names */}
                                    <p className="mt-6 text-xs text-stone-400 font-medium italic truncate max-w-lg">
                                        Contains: {order.items.map(i => i.name).join(', ')}
                                    </p>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
