'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useOrder } from '@/hooks/useOrders'
import {
    Truck,
    Star,
    MessageCircle,
    FileDown,
    ArrowLeft,
    CheckCircle,
    Home,
    User,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

/* ---------------- HELPERS ---------------- */

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default function OrderDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string
    const { data: order, isLoading } = useOrder(id)

    if (isLoading) return <div className="min-h-screen pt-32 text-center text-stone-600 font-medium italic">Retrieving order details...</div>;

    if (!order) {
        return (
            <div className="min-h-screen pt-32 text-center font-poppins text-stone-600">
                <p>Order not found.</p>
                <button
                    onClick={() => router.push("/orders")}
                    className="text-amber-700 font-semibold font-poppins hover:underline mt-4 inline-block"
                >
                    Back to Orders
                </button>
            </div>
        )
    }

    const deliveryCharge = 40;
    const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="min-h-screen bg-[#FAFAFA] pt-[25px] pb-20">
            <div className="max-w-6xl mx-auto px-4">
                {/* BACK BUTTON */}
                <button
                    onClick={() => router.push("/orders")}
                    className="flex items-center gap-2 text-gray-700 mb-6 hover:text-black transition font-semibold font-poppins"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Orders
                </button>

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* LEFT COLUMN */}
                    <div className="space-y-6">
                        {/* TOP CARD: ORDER ID + PAYMENT STATUS */}
                        <div className="bg-white bg-[#FFFFFF] border border-[#E8E8E8] rounded-2xl overflow-hidden shadow-sm">
                            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                                <div>
                                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-1">Order ID</p>
                                    <h1 className="text-lg font-semibold text-gray-900 font-poppins">
                                        #{order._id?.toUpperCase()}
                                    </h1>
                                </div>
                                <div className="text-right">
                                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-1 font-poppins">Order Date</p>
                                    <p className="text-sm font-semibold text-gray-800 font-poppins">{formatDate(order.createdAt)}</p>
                                </div>
                            </div>

                            {/* PAYMENT SUCCESS ALERT */}
                            {order.paymentStatus === 'PAID' && (
                                <div className="bg-[#EAF8F0] px-6 py-5 flex gap-3">
                                    <CheckCircle className="text-green-600 w-5 h-5 mt-[2px]" />
                                    <div>
                                        <p className="font-semibold font-poppins text-[15px] text-gray-900">
                                            Payment Successful
                                        </p>
                                        <p className="text-sm text-gray-700 mt-1 font-medium font-poppins">
                                            All set. No cash needed when your order arrives.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ITEMS LIST */}
                        <div className="space-y-4">
                            {order.items.map((item, index) => (
                                <div
                                    key={index}
                                    className=" bg-white border border-[#E8E8E8] rounded-2xl px-6 py-6 shadow-sm"
                                >
                                    <div className="flex bg-[#FFFFFF] flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                                        {/* PRODUCT INFO */}
                                        <div className="flex gap-5">
                                            <div className="w-[95px] h-[95px] bg-[#EEF7F0] rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                                                <img
                                                    src={item.image || 'https://placehold.co/100x100?text=Pickle'}
                                                    alt={item.name}
                                                    className="w-[75px] h-[75px] object-contain"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <h2 className="font-semibold text-[16px] leading-snug max-w-[260px] text-gray-900 font-poppins">
                                                    {item.name}
                                                </h2>

                                                <p className="font-semibold text-[17px] text-gray-900 font-poppins">
                                                    ₹{item.price.toLocaleString()}
                                                </p>

                                                <div className="pt-2 space-y-2 text-[13px]">
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                                        <span className="font-medium text-gray-800 font-poppins">Order Confirmed, {formatDate(order.createdAt)}</span>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        {order.orderStatus === 'DELIVERED' ? (
                                                            <>
                                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                                                <span className="font-medium text-gray-800 font-poppins">Delivered</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Truck className="w-4 h-4 text-blue-600" />
                                                                <span className="font-medium text-gray-800 font-poppins">{order.orderStatus === 'SHIPPED' ? 'In Transit' : 'Processing'}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* TRACK BUTTON */}
                                        {order.orderStatus === 'SHIPPED' && (
                                            <button className="bg-stone-900 hover:bg-stone-800 text-white font-semibold px-6 py-2.5 rounded-xl h-fit text-sm shadow-md transition-all font-poppins">
                                                Track Order
                                            </button>
                                        )}
                                    </div>

                                    {/* ACTIONS */}
                                    <div className="flex justify-between items-center mt-8 text-sm border-t border-gray-50 pt-5">
                                        <button className="text-gray-900 font-medium hover:text-[#C1572A] transition font-poppins">
                                            Return
                                        </button>

                                        <button className="flex items-center gap-2 text-gray-900 font-medium hover:text-[#C1572A] transition font-poppins">
                                            <MessageCircle className="w-4 h-4" />
                                            Chat with Us
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* RATE EXPERIENCE */}
                        <div className="bg-[#FFFFFF] border border-[#E8E8E8] rounded-2xl shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b bg-[#FBFBFB]">
                                <p className="font-semibold text-[15px] text-gray-900 font-poppins">
                                    Rate your experience
                                </p>
                            </div>

                            <div className="px-6 py-5">
                                <p className="text-sm text-gray-700 mb-3 font-medium font-poppins">
                                    Rate the product quality and delivery
                                </p>

                                <div className="bg-[#F8F8F8] rounded-xl py-4 flex justify-center gap-3">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star
                                            key={i}
                                            className="w-6 h-6 text-gray-400 cursor-pointer hover:text-yellow-400 transition"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="space-y-6">
                        {/* DELIVERY DETAILS */}
                        <div className="bg-[#FFFFFF]  border border-[#E8E8E8] rounded-2xl shadow-sm">
                            <div className="px-6 py-4 border-b">
                                <h3 className="font-semibold text-[15px] text-gray-900 font-poppins">
                                    Delivery Details
                                </h3>
                            </div>

                            <div className="px-6 py-5 space-y-4 bg-[#FFFFFF]">
                                {/* Address */}
                                <div className="bg-[#F7F7F7] rounded-xl px-4 py-3 flex gap-4 items-start">
                                    <div className="bg-white p-2 rounded-lg shadow-sm">
                                        <Home className="w-4 h-4 text-gray-700" />
                                    </div>
                                    <div className="text-sm font-poppins">
                                        <p className="font-semibold text-gray-900 font-poppins">Shipping Address</p>
                                        <p className="text-gray-700 text-[13px] leading-snug mt-1 font-medium  font-poppins">
                                            {order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.pincode}
                                        </p>
                                    </div>
                                </div>

                                {/* User Info */}
                                <div className="bg-[#F7F7F7] rounded-xl px-4 py-3 flex gap-4 items-start">
                                    <div className="bg-white p-2 rounded-lg shadow-sm">
                                        <User className="w-4 h-4 text-gray-700" />
                                    </div>
                                    <div className="text-sm flex justify-between w-full">
                                        <div>
                                            <p className="font-semibold text-gray-900 font-poppins">{order.shippingAddress.name}</p>
                                            <p className="text-gray-700 text-[12px] mt-0.5 font-medium font-poppins">{order.shippingAddress.phone}</p>
                                        </div>
                                        {/* <span className="text-gray-500 text-[11px] font-medium uppercase tracking-wider font-poppins">Contact</span> */}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ORDER SUMMARY */}
                        <div className="bg-[#FFFFFF] border border-[#E8E8E8] rounded-2xl shadow-sm">
                            <div className="px-6 py-4 border-b">
                                <h3 className="font-semibold text-[15px] text-gray-900 font-poppins">
                                    Order Summary
                                </h3>
                            </div>

                            <div className="px-6 py-5 space-y-4 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700 font-medium font-poppins">Subtotal</span>
                                    <span className="font-semibold text-gray-700 font-poppins">₹{subtotal.toLocaleString()}</span>
                                </div>

                                <div className="flex justify-between items-center text-green-700">
                                    <span className="font-medium font-poppins">Discount</span>
                                    <span className="font-semibold font-poppins">-₹0.00</span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700 font-medium font-poppins">Delivery Charge</span>
                                    <span className="font-semibold text-gray-700 font-poppins">₹{deliveryCharge.toLocaleString()}</span>
                                </div>

                                <div className="border-t border-gray-50 pt-4 flex justify-between items-center font-semibold text-[15px] text-gray-700 tracking-tighter font-poppins">
                                    <span>Total Amount</span>
                                    <span>₹{order.totalAmount.toLocaleString()}</span>
                                </div>

                                {/* Payment Method Badge */}
                                <div className="border border-gray-100 rounded-xl px-4 py-3 bg-[#FCFCFC] flex items-center justify-between mt-6">
                                    <span className="text-gray-800 font-semibold text-[13px] font-poppins">
                                        Payment Method
                                    </span>
                                    <span className="px-3 py-1 bg-gray-900 text-white rounded-md text-[10px] font-semibold uppercase tracking-widest font-poppins">
                                        {order.paymentMethod}
                                    </span>
                                </div>

                                {/* Download Invoice Button */}
                                <button className="w-full bg-[#F9EFE9] hover:bg-[#f3e2d8] transition py-3.5 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm border border-[#F1DED2] text-[#C1572A] mt-4 shadow-sm font-poppins">
                                    <FileDown className="w-4 h-4" />
                                    Download Invoice
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}