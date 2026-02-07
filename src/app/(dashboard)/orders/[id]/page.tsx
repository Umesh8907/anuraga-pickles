'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { useOrder } from '@/hooks/useOrders'
import { Package, Clock, CheckCircle2, Truck, XCircle, ChevronLeft, MapPin, CreditCard, Calendar, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const statusConfig = {
    PENDING: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', label: 'Processing' },
    CONFIRMED: { icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', label: 'Confirmed' },
    SHIPPED: { icon: Truck, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', label: 'Shipped' },
    DELIVERED: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100', label: 'Delivered' },
    CANCELLED: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', label: 'Cancelled' },
}

export default function OrderDetailsPage() {
    const params = useParams()
    const id = params.id as string
    const { data: order, isLoading } = useOrder(id)

    if (isLoading) return <div className="min-h-screen pt-32 text-center text-stone-600 font-medium italic">Retreiving order details...</div>;

    if (!order) {
        return (
            <div className="min-h-screen pt-32 text-center text-stone-600">
                <p>Order not found.</p>
                <Link href="/orders" className="text-amber-700 font-bold hover:underline mt-4 inline-block">Back to Orders</Link>
            </div>
        )
    }

    const status = statusConfig[order.orderStatus as keyof typeof statusConfig] || statusConfig.PENDING;
    const StatusIcon = status.icon;

    return (
        <div className="min-h-screen bg-stone-50 pt-24 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Link */}
                <Link href="/orders" className="inline-flex items-center gap-2 text-stone-500 hover:text-amber-700 font-bold mb-8 transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                    Back to History
                </Link>

                {/* Header Card */}
                <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-stone-100 mb-8 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>

                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                            <div>
                                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.3em] block mb-2">Order Summary</span>
                                <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight italic">#{order._id?.toUpperCase()}</h1>
                                <div className="flex items-center gap-4 mt-3">
                                    <div className="flex items-center gap-2 text-stone-500 font-medium italic text-sm">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                                    </div>
                                    <div className={cn("px-4 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border", status.bg, status.color, status.border)}>
                                        {status.label}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right md:text-right">
                                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Total Amount</p>
                                <p className="text-4xl font-black text-stone-900 tracking-tighter">₹{order.totalAmount.toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Order Progress (Simple) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-stone-50">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-400">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Shipping To</p>
                                    <p className="font-bold text-stone-800 italic text-sm">{order.shippingAddress.name}</p>
                                    <p className="text-xs text-stone-500 leading-snug">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-400">
                                    <CreditCard className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Payment</p>
                                    <p className="font-bold text-stone-800 italic text-sm">{order.paymentMethod}</p>
                                    <p className={cn("text-xs font-bold leading-snug", order.paymentStatus === 'PAID' ? "text-green-600" : "text-amber-600")}>
                                        {order.paymentStatus}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", status.bg, status.color)}>
                                    <StatusIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Status Update</p>
                                    <p className="font-bold text-stone-800 italic text-sm">{status.label}</p>
                                    <p className="text-xs text-stone-500 leading-snug">Last updated today</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Items List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-stone-100 overflow-hidden">
                            <div className="px-8 py-6 border-b border-stone-50 flex items-center justify-between">
                                <h2 className="font-bold text-stone-900 italic">Order Items ({order.items.length})</h2>
                                <Package className="w-4 h-4 text-stone-300" />
                            </div>
                            <ul className="divide-y divide-stone-50">
                                {order.items.map((item) => (
                                    <li key={item._id} className="p-8 flex items-center gap-6 group">
                                        <div className="w-20 h-20 bg-stone-50 rounded-[1.5rem] overflow-hidden border border-stone-100 flex-shrink-0">
                                            <img
                                                src={item.image || 'https://placehold.co/150x150?text=Pickle'}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-stone-900 italic text-lg">{item.name}</h3>
                                            <p className="text-stone-400 text-sm italic">Qty: {item.quantity} • ₹{item.price.toLocaleString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-stone-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Journey Tracker */}
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-stone-100 p-8">
                            <h2 className="font-bold text-stone-900 italic mb-10 flex items-center gap-3">
                                <Clock className="w-4 h-4 text-amber-600" />
                                Order History
                            </h2>
                            <div className="space-y-8">
                                {order.history && order.history.length > 0 ? (
                                    order.history.map((h, idx) => (
                                        <div key={idx} className="flex gap-6 relative">
                                            {idx !== order.history.length - 1 && (
                                                <div className="absolute left-2.5 top-5 w-[1px] h-10 bg-stone-100"></div>
                                            )}
                                            <div className={cn(
                                                "w-5 h-5 rounded-full mt-1.5 flex-shrink-0 z-10",
                                                idx === 0 ? "bg-amber-600 shadow-lg shadow-amber-200" : "bg-stone-200"
                                            )}></div>
                                            <div>
                                                <p className={cn("font-bold text-sm italic", idx === 0 ? "text-stone-900" : "text-stone-400")}>{h.status}</p>
                                                {h.note && <p className="text-xs text-stone-500 mt-1">{h.note}</p>}
                                                <p className="text-[10px] text-stone-400 mt-1 uppercase tracking-wider">{new Date(h.timestamp).toLocaleString('en-IN')}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-stone-400 italic text-sm">Waiting for the next milestone...</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Address & Actions */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-stone-900 rounded-[2.5rem] p-10 text-white shadow-xl shadow-stone-200 relative overflow-hidden">
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-600/20 blur-2xl rounded-full"></div>
                            <h3 className="font-bold text-lg mb-8 italic flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-amber-500" />
                                Shipping Address
                            </h3>
                            <div className="space-y-1 text-stone-300 text-sm italic leading-relaxed">
                                <p className="text-white font-black not-italic text-lg mb-2">{order.shippingAddress.name}</p>
                                <p>{order.shippingAddress.addressLine1}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                                <p>{order.shippingAddress.pincode}</p>
                                <p className="mt-6 pt-6 border-t border-stone-800 text-stone-500">
                                    <Phone className="w-3.5 h-3.5 inline mr-2" />
                                    {order.shippingAddress.phone}
                                </p>
                            </div>
                        </div>

                        <div className="bg-amber-50 rounded-[2rem] p-8 border border-amber-100 italic">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="p-2 bg-white rounded-xl shadow-sm">
                                    <Info className="w-4 h-4 text-amber-600" />
                                </div>
                                <h4 className="font-bold text-amber-900 text-sm">Need Help?</h4>
                            </div>
                            <p className="text-amber-800/70 text-xs leading-relaxed mb-6">
                                If there is any issue with your order, feel free to contact our spice support team.
                            </p>
                            <button className="w-full bg-white text-stone-900 font-bold py-3 rounded-xl shadow-sm border border-stone-100 hover:bg-stone-50 transition-all text-sm">
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Phone({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
    )
}
