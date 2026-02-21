'use client'

import React, { useState, useMemo } from 'react'
import { useOrders } from '@/hooks/useOrders'
import { Package, ChevronRight, ShoppingBag, Clock, CheckCircle2, Truck, XCircle, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'

/* ---------------- FILTER DATA ---------------- */

const statusFilters = [
    { id: "all", label: "All Orders", checked: true },
    { id: "ontheway", label: "On the way", checked: false },
    { id: "delivered", label: "Delivered", checked: false },
    { id: "cancelled", label: "Cancelled", checked: false },
    { id: "returned", label: "Returned", checked: false },
];

const timeFilters = [
    { id: "all_time", label: "Anytime", checked: true },
    { id: "last30", label: "Last 30 days", checked: false },
    { id: "2024", label: "2024", checked: false },
    { id: "2023", label: "2023", checked: false },
    { id: "older", label: "Older", checked: false },
];

/* ---------------- HELPERS ---------------- */

function formatDate(iso: string) {
    const d = new Date(iso);
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return `${months[d.getMonth()]} ${d.getDate()}`;
}

export default function OrdersPage() {
    const { data: orders, isLoading } = useOrders();
    const [statusFilter, setStatusFilter] = useState(statusFilters);
    const [timeFilter, setTimeFilter] = useState(timeFilters);

    /* -------- FILTER HANDLERS -------- */

    const handleStatusFilterChange = (id: string) => {
        setStatusFilter(prev =>
            prev.map(f => {
                // If 'all' is clicked, uncheck all others
                if (id === 'all') {
                    return f.id === 'all' ? { ...f, checked: true } : { ...f, checked: false };
                }
                // If any other filter is clicked, uncheck 'all'
                if (f.id === 'all' && f.checked && id !== 'all') {
                    return { ...f, checked: false };
                }
                // Toggle the clicked filter
                if (f.id === id) {
                    return { ...f, checked: !f.checked };
                }
                return f;
            })
        );
    };

    const handleTimeFilterChange = (id: string) => {
        setTimeFilter(prev =>
            prev.map(f => {
                // If 'all_time' is clicked, uncheck all others
                if (id === 'all_time') {
                    return f.id === 'all_time' ? { ...f, checked: true } : { ...f, checked: false };
                }
                // If any other filter is clicked, uncheck 'all_time'
                if (f.id === 'all_time' && f.checked && id !== 'all_time') {
                    return { ...f, checked: false };
                }
                // Toggle the clicked filter
                if (f.id === id) {
                    return { ...f, checked: !f.checked };
                }
                return f;
            })
        );
    };

    const filteredOrders = useMemo(() => {
        if (!orders) return [];

        const activeStatusIds = statusFilter.filter(f => f.checked).map(f => f.id);
        const activeTimeIds = timeFilter.filter(f => f.checked).map(f => f.id);

        // If no filters are selected, show all
        if (activeStatusIds.length === 0 && activeTimeIds.length === 0) {
            return orders.flatMap((order) =>
                order.items.map((item, index) => ({
                    id: `${order._id}-${index}`,
                    orderId: order._id,
                    title: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    status: order.orderStatus.toLowerCase(),
                    deliveryDate: formatDate(order.createdAt),
                    imageUrl: item.image || 'https://placehold.co/100x100?text=Pickle',
                    message: order.orderStatus === 'DELIVERED'
                        ? "Your item has been delivered"
                        : order.orderStatus === 'SHIPPED'
                            ? "Your item is shipped"
                            : "Your order is processing"
                }))
            ).reverse();
        }

        return orders.flatMap((order) => {
            const createdAt = new Date(order.createdAt);
            const now = new Date();
            const daysDiff = (now.getTime() - createdAt.getTime()) / (1000 * 3600 * 24);

            // Time filtering - check if any selected time filter matches
            let timeMatch = false;
            if (activeTimeIds.includes('all_time')) {
                timeMatch = true;
            } else {
                if (activeTimeIds.includes('last30') && daysDiff <= 30) timeMatch = true;
                if (activeTimeIds.includes('2024') && createdAt.getFullYear() === 2024) timeMatch = true;
                if (activeTimeIds.includes('2023') && createdAt.getFullYear() === 2023) timeMatch = true;
                if (activeTimeIds.includes('older') && createdAt.getFullYear() < 2023) timeMatch = true;
            }

            if (!timeMatch) return [];

            // Status filtering - check if any selected status filter matches
            let statusMatch = false;
            const status = order.orderStatus;

            if (activeStatusIds.includes('all')) {
                statusMatch = true;
            } else {
                if (activeStatusIds.includes('ontheway') && ['PENDING', 'CONFIRMED', 'SHIPPED'].includes(status)) statusMatch = true;
                if (activeStatusIds.includes('delivered') && status === 'DELIVERED') statusMatch = true;
                if (activeStatusIds.includes('cancelled') && status === 'CANCELLED') statusMatch = true;
                // if (activeStatusIds.includes('returned') && status === 'RETURNED') statusMatch = true;
            }

            if (!statusMatch) return [];

            return order.items.map((item, index) => ({
                id: `${order._id}-${index}`,
                orderId: order._id,
                title: item.name,
                price: item.price,
                quantity: item.quantity,
                status: order.orderStatus.toLowerCase(),
                deliveryDate: formatDate(order.createdAt),
                imageUrl: item.image || 'https://placehold.co/100x100?text=Pickle',
                message: order.orderStatus === 'DELIVERED'
                    ? "Your item has been delivered"
                    : order.orderStatus === 'SHIPPED'
                        ? "Your item is shipped"
                        : "Your order is processing"
            }));
        }).reverse();
    }, [orders, statusFilter, timeFilter]);

    if (isLoading) return <div className="min-h-screen pt-32 text-center text-stone-600 font-medium italic">Loading your order history...</div>;

    return (
        <div className="min-h-screen bg-white pt-[25px] pb-20">
            {/* ✅ MAIN WRAPPER - Reduced left padding */}
            <div className="max-w-[1240px] mx-auto px-4 py-8 lg:pl-10 xl:pl-14">
                <h1 className="text-[26px] font-bold text-gray-900 mb-8 font-poppins">
                    Orders
                </h1>

                {/* MAIN ROW */}
                <div className="flex flex-col lg:flex-row gap-10">
                    {/*Side bar ================= SIDEBAR ================= */}
                    <div className="hidden lg:block w-full lg:w-[240px] shrink-0">
                        <div className="lg:sticky lg:top-[120px]">
                            <h3 className="text-[15px] font-semibold text-gray-900 mb-4 font-poppins">
                                Filters
                            </h3>

                            <div className="border border-gray-200 rounded-2xl p-5 bg-white">
                                <h3 className="font-semibold text-gray-900 mb-4 text-[12px] tracking-wide font-poppins">
                                    ORDER STATUS
                                </h3>

                                <div className="space-y-3 mb-8">
                                    {statusFilter.map(filter => (
                                        <label
                                            key={filter.id}
                                            className="flex items-center gap-3 cursor-pointer group"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={filter.checked}
                                                onChange={() => handleStatusFilterChange(filter.id)}
                                                className="accent-green-600 cursor-pointer w-4 h-4 rounded"
                                            />
                                            <span className={cn("text-sm transition-colors font-poppins", filter.checked ? "text-green-700 font-bold" : "text-gray-700 font-medium")}>
                                                {filter.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>

                                <h3 className="font-semibold text-gray-900 mb-4 text-[12px] tracking-wide font-poppins">
                                    ORDER TIME
                                </h3>

                                <div className="space-y-3">
                                    {timeFilter.map(filter => (
                                        <label
                                            key={filter.id}
                                            className="flex items-center gap-3 cursor-pointer group"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={filter.checked}
                                                onChange={() => handleTimeFilterChange(filter.id)}
                                                className="accent-green-600 cursor-pointer w-4 h-4 rounded"
                                            />
                                            <span className={cn("text-sm transition-colors font-poppins", filter.checked ? "text-green-700 font-bold" : "text-gray-700 font-medium")}>
                                                {filter.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* ================= MOBILE FILTERS ================= */}
                    <div className="lg:hidden mb-6 space-y-4">

                        {/* Status Select */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2 font-poppins">
                                Order Status
                            </label>
                            <select
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-600"
                                value={statusFilter.find(f => f.checked)?.id}
                                onChange={(e) => handleStatusFilterChange(e.target.value)}
                            >
                                {statusFilter.map(filter => (
                                    <option key={filter.id} value={filter.id}>
                                        {filter.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Time Select */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2 font-poppins">
                                Order Time
                            </label>
                            <select
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-600"
                                value={timeFilter.find(f => f.checked)?.id}
                                onChange={(e) => handleTimeFilterChange(e.target.value)}
                            >
                                {timeFilter.map(filter => (
                                    <option key={filter.id} value={filter.id}>
                                        {filter.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>

                    {/* ================= ORDERS COLUMN ================= */}
                    <div className="w-full lg:max-w-[720px]">
                        <div className="space-y-6">
                            {filteredOrders.length === 0 ? (
                                <div className="bg-white rounded-[3rem] p-16 text-center shadow-sm border border-stone-100">
                                    <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Package className="w-12 h-12 text-stone-300" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-stone-900 mb-4 font-poppins">No matching orders found</h2>
                                    <p className="text-stone-500 mb-10 italic max-w-xs mx-auto leading-relaxed font-poppins">Adjust your filters or start a new collection of flavors!</p>
                                    <Link
                                        href="/collections/all-products"
                                        className="inline-flex items-center gap-2 bg-stone-900 text-white font-bold px-8 py-4 rounded-2xl hover:bg-[#C1572A] transition-all shadow-xl hover:shadow-orange-100 font-poppins"
                                    >
                                        Explore Collection
                                    </Link>
                                </div>
                            ) : (
                                filteredOrders.map(order => (
                                    <div
                                        key={order.id}
                                        className="border border-[#E6E6E6] rounded-2xl px-6 py-5 bg-white hover:shadow-sm transition cursor-pointer w-full"
                                        onClick={() =>
                                            (window.location.href = `/orders/${order.orderId}`)
                                        }
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                                            {/* LEFT SIDE */}
                                            <div className="flex items-center gap-5 flex-1">
                                                <div className="w-[80px] h-[80px] sm:w-[92px] sm:h-[92px] bg-[#EEF7F0] rounded-xl flex items-center justify-center shrink-0">
                                                    <img
                                                        src={order.imageUrl}
                                                        alt={order.title}
                                                        className="w-[70px] h-[70px] object-contain"
                                                    />
                                                </div>

                                                <div className="max-w-[280px]">
                                                    <h3 className="font-bold text-[15px] leading-snug text-gray-900 font-poppins">
                                                        {order.title}
                                                    </h3>

                                                    <p className="font-bold mt-1 text-gray-900 text-[15px] font-poppins">
                                                        ₹{order.price.toLocaleString()}
                                                    </p>

                                                    {order.status === "shipped" && (
                                                        <button className="mt-3 bg-[#C1572A] hover:bg-[#a94c24] text-white text-sm font-semibold px-5 py-2 rounded-md transition font-poppins">
                                                            Track Order
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* RIGHT SIDE */}
                                            <div className="text-left sm:w-[220px] shrink-0">
                                                <p className="font-bold text-[15px] text-gray-900 uppercase font-mukta">
                                                    {order.status === 'delivered' ? `Delivered on ${order.deliveryDate}` : `${order.status} on ${order.deliveryDate}`}
                                                </p>

                                                <p className="text-sm text-gray-700 font-medium mt-1 font-mukta">
                                                    {order.message}
                                                </p>

                                                <button className="mt-3 text-[14px] font-bold text-black flex items-center gap-2 hover:text-[#C76A2A] transition-all group font-mukta">

                                                    <span >Rate & Review Product</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
