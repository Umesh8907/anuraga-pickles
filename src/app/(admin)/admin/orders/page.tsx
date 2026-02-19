'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
    Search,
    Filter,
    Eye,
    Truck,
    CheckCircle2,
    XCircle,
    Clock,
    CreditCard,
    ChevronDown,
    IndianRupee,
    UserCircle,
    ShoppingBasket,
    MoreVertical
} from 'lucide-react'
import { useAllOrders, useUpdateOrderStatus } from '@/hooks/useAdmin'
import { cn } from '@/lib/utils'
import ConfirmationModal from '@/components/ui/ConfirmationModal'

export default function AdminOrders() {
    const [search, setSearch] = useState('')
    const { data: orders, isLoading, isError } = useAllOrders()
    const { mutate: updateStatus, isPending } = useUpdateOrderStatus()

    const [openOrderId, setOpenOrderId] = useState<string | null>(null);
    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; orderId: string; status: string }>({
        isOpen: false,
        orderId: '',
        status: ''
    });
    const menuRef = useRef<HTMLDivElement>(null);

    const filteredOrders = orders?.filter((o: any) =>
        o._id.toLowerCase().includes(search.toLowerCase()) ||
        o.user?.name?.toLowerCase().includes(search.toLowerCase())
    )

    const handleStatusUpdate = (orderId: string, status: string) => {
        setConfirmModal({ isOpen: true, orderId, status });
        setOpenOrderId(null);
    }

    const confirmStatusUpdate = () => {
        updateStatus({ orderId: confirmModal.orderId, status: confirmModal.status });
        setConfirmModal({ ...confirmModal, isOpen: false });
    }

    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenOrderId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-8 h-8 border-4 border-stone-200 border-t-amber-600 rounded-full animate-spin"></div>
        </div>
    )

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-black text-stone-900 tracking-tight">Order Management</h1>
                <p className="text-stone-500 font-medium">Track and process customer orders across your store.</p>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                    <input
                        type="text"
                        placeholder="Search by order ID or customer name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
                    />
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-white border border-stone-200 rounded-xl font-bold text-stone-600 hover:bg-stone-50 transition-all">
                    <Filter className="w-5 h-5" />
                    Filters
                </button>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-stone-50 border-b border-stone-100">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black text-stone-500 uppercase tracking-widest">Order Details</th>
                                <th className="px-6 py-4 text-[10px] font-black text-stone-500 uppercase tracking-widest">Customer</th>
                                <th className="px-6 py-4 text-[10px] font-black text-stone-500 uppercase tracking-widest">Amount</th>
                                <th className="px-6 py-4 text-[10px] font-black text-stone-500 uppercase tracking-widest">Payment</th>
                                <th className="px-6 py-4 text-[10px] font-black text-stone-500 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-stone-500 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-50">
                            {filteredOrders?.map((order: any) => (
                                <tr key={order._id} className="hover:bg-amber-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-stone-900 uppercase">#{order._id.slice(-8).toUpperCase()}</span>
                                            <span className="text-[10px] text-stone-500 font-bold uppercase tracking-tighter mt-1">
                                                {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                                                <UserCircle className="w-5 h-5" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-stone-900">{order.user?.name || 'Guest Customer'}</span>
                                                <span className="text-[10px] text-stone-500">{order.user?.phone || 'No phone'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-stone-900">₹{order.totalAmount.toLocaleString()}</span>
                                            <span className="text-[10px] text-stone-500 font-bold uppercase tracking-tight">{order.items.length} items</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={cn(
                                                "w-2 h-2 rounded-full",
                                                order.paymentStatus === 'PAID' ? 'bg-emerald-500' : 'bg-red-500'
                                            )} />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-stone-600">{order.paymentStatus}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className={cn(
                                                "w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide",
                                                order.orderStatus === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' :
                                                    order.orderStatus === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                                        order.orderStatus === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-amber-100 text-amber-700'
                                            )}>
                                                {order.orderStatus}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="relative inline-block" ref={order._id === openOrderId ? menuRef : null}>
                                            <button
                                                onClick={() => setOpenOrderId(openOrderId === order._id ? null : order._id)}
                                                className={cn(
                                                    "p-2 transition-colors rounded-lg border",
                                                    openOrderId === order._id
                                                        ? "text-amber-600 bg-amber-50 border-amber-200"
                                                        : "text-stone-400 hover:text-amber-600 bg-stone-50 border-stone-100"
                                                )}
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </button>

                                            {openOrderId === order._id && (
                                                <div className="absolute right-0 top-full mt-2 bg-white border border-stone-100 rounded-xl shadow-xl py-2 w-48 z-50 animate-in fade-in zoom-in-95 duration-200">
                                                    <button
                                                        onClick={() => handleStatusUpdate(order._id, 'CONFIRMED')}
                                                        className="w-full text-left px-4 py-2 text-[10px] font-black text-stone-600 hover:bg-stone-50 flex items-center gap-2 uppercase tracking-widest"
                                                    >
                                                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                                        Confirm Order
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(order._id, 'SHIPPED')}
                                                        className="w-full text-left px-4 py-2 text-[10px] font-black text-stone-600 hover:bg-stone-50 flex items-center gap-2 uppercase tracking-widest"
                                                    >
                                                        <Truck className="w-3 h-3 text-blue-500" />
                                                        Mark Shipped
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(order._id, 'DELIVERED')}
                                                        className="w-full text-left px-4 py-2 text-[10px] font-black text-stone-600 hover:bg-stone-50 flex items-center gap-2 uppercase tracking-widest"
                                                    >
                                                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                                        Mark delivered
                                                    </button>
                                                    <div className="h-px bg-stone-100 my-1 mx-2" />
                                                    <button
                                                        onClick={() => handleStatusUpdate(order._id, 'CANCELLED')}
                                                        className="w-full text-left px-4 py-2 text-[10px] font-black text-red-500 hover:bg-red-50 flex items-center gap-2 uppercase tracking-widest"
                                                    >
                                                        <XCircle className="w-3 h-3" />
                                                        Cancel order
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {!filteredOrders?.length && (
                    <div className="p-20 text-center">
                        <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShoppingBasket className="w-8 h-8 text-stone-200" />
                        </div>
                        <h3 className="text-lg font-bold text-stone-900 mb-1">No Orders Found</h3>
                        <p className="text-stone-500 text-sm">Your store doesn't have any orders yet.</p>
                    </div>
                )}
            </div>
            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={confirmStatusUpdate}
                title="Update Order Status"
                message={`Are you sure you want to update the order status to ${confirmModal.status}?`}
                confirmText="Update Status"
                variant={confirmModal.status === 'CANCELLED' ? 'danger' : 'warning'}
            />
        </div>
    )
}
