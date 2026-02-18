'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckoutStore } from '@/store/useCheckoutStore';
import { useCart } from '@/hooks/useCart';
import { useAddress } from '@/hooks/useAddress';
import { CreditCard, Truck, ShieldCheck, Loader2, Wallet, Banknote, Landmark, Percent, Tag, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import PriceDetails from '@/components/checkout/PriceDetails';
import Link from 'next/link';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { useQueryClient } from '@tanstack/react-query';

import Image from 'next/image';

import visa from "@/assets/visa.png";
import mastercard from "@/assets/mastercard.png";
import rupay from "@/assets/rupay.png";
import upi from "@/assets/upi.png";
import netbanking from "@/assets/netbanking.png";
import codIcon from "@/assets/Vector.png";

// Razorpay Type Definition (Basic)
declare global {
    interface Window {
        Razorpay: any;
    }
}

const loadRazorpay = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export default function PaymentPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { selectedAddressId, isAddressConfirmed, setPaymentMethod } = useCheckoutStore();
    const { data: cart, isLoading: isCartLoading } = useCart();
    const { addresses } = useAddress();
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    // UI State for Payment Mode Selection
    const [activeTab, setActiveTab] = useState('RECOMMENDED');

    // Use a ref to track if order was successfully placed to prevent the "Empty Cart" redirect
    const isOrderSuccess = useRef(false);

    // Redirect if checks fail
    useEffect(() => {
        if (isCartLoading || isOrderSuccess.current) return;

        if (!cart || cart.items.length === 0) {
            router.push('/checkout/cart');
        } else if (!selectedAddressId || !isAddressConfirmed) {
            router.push('/checkout/address');
        }
    }, [cart, isCartLoading, selectedAddressId, isAddressConfirmed, router]);

    if (isCartLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    const selectedAddress = addresses.find(a => a._id === selectedAddressId);

    const handlePlaceOrder = async () => {
        if (!selectedAddress) return;

        const backendPaymentMethod = activeTab === 'COD' ? 'COD' : 'ONLINE';

        setIsPlacingOrder(true);
        try {
            const orderRes = await api.post('/orders', {
                items: cart?.items,
                shippingAddress: selectedAddress,
                paymentMethod: backendPaymentMethod
            });
            const order = orderRes.data.data;

            if (backendPaymentMethod === 'ONLINE') {
                const isLoaded = await loadRazorpay();
                if (!isLoaded) {
                    throw new Error('Razorpay SDK failed to load');
                }

                const rzOrderRes = await api.post('/payments/razorpay/create-order', {
                    orderId: order._id
                });
                const { id: razorpayOrderId, amount, currency, key } = rzOrderRes.data;

                const options = {
                    key: key,
                    amount: amount,
                    currency: currency,
                    name: "Anuraga Pickles",
                    description: "Order Processing",
                    order_id: razorpayOrderId,
                    handler: async function (response: any) {
                        try {
                            const verifyRes = await api.post('/payments/razorpay/verify', {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                orderId: order._id
                            });

                            if (verifyRes.data.success) {
                                handleOrderSuccess(order._id);
                            }
                        } catch (err) {
                            console.error("Payment verification failed", err);
                            toast.error("Payment verification failed. Cancelling order...");
                            await api.post(`/orders/${order._id}/cancel`, { reason: "Payment Verification Failed" });
                            setIsPlacingOrder(false);
                        }
                    },
                    prefill: {
                        name: selectedAddress.name,
                        contact: selectedAddress.phone,
                    },
                    theme: {
                        color: "#346800"
                    },
                    modal: {
                        ondismiss: async function () {
                            setIsPlacingOrder(false);
                            toast.info("Payment cancelled.");
                            try {
                                await api.post(`/orders/${order._id}/cancel`, { reason: "Payment Cancelled by User" });
                            } catch (e) {
                                console.error("Failed to cancel order", e);
                            }
                        }
                    }
                };

                const rzp1 = new window.Razorpay(options);
                rzp1.open();

            } else {
                handleOrderSuccess(order._id);
            }

        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to place order');
            setIsPlacingOrder(false);
        }
    };

    const handleOrderSuccess = async (orderId: string) => {
        isOrderSuccess.current = true;
        toast.success('Order placed successfully!');
        await queryClient.invalidateQueries({ queryKey: ['cart'] });
        router.push(`/order-completed?orderId=${orderId}`);
    };

    return (
        <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
            <div className="lg:col-span-2 space-y-8">

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="text-base font-semibold text-zinc-900 mb-6 flex items-center gap-2 border-b border-zinc-100 pb-4">

                        Choose Payment Mode
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* ONLINE PAYMENT CARD */}
                        <div
                            onClick={() => setActiveTab('RECOMMENDED')}
                            className={cn(
                                "cursor-pointer rounded-xl border-2 p-6 transition-all",
                                activeTab !== 'COD'
                                    ? "border-yellow-500 bg-yellow-50"
                                    : "border-gray-200"
                            )}
                        >
                            {/* Logos */}
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <Image src={visa} alt="Visa" width={45} height={30} className="object-contain" />
                                <Image src={mastercard} alt="Mastercard" width={45} height={30} className="object-contain" />
                                <Image src={rupay} alt="Rupay" width={45} height={30} className="object-contain" />
                                <Image src={netbanking} alt="Netbanking" width={40} height={25} className="object-contain" />
                                <Image src={upi} alt="UPI" width={45} height={30} className="object-contain" />
                            </div>

                            {/* Label + Radio */}
                            <div className="flex items-center justify-center gap-3">
                                <div
                                    className={cn(
                                        "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                                        activeTab !== 'COD'
                                            ? "border-green-500"
                                            : "border-gray-300"
                                    )}
                                >
                                    {activeTab !== 'COD' && (
                                        <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                                    )}
                                </div>
                                <span className="text-sm font-medium text-gray-800">
                                    UPI / Credit / Debit / Netbanking
                                </span>
                            </div>


                        </div>

                        {/* CASH ON DELIVERY CARD */}
                        <div
                            onClick={() => setActiveTab('COD')}
                            className={cn(
                                "cursor-pointer rounded-xl border-2 p-6 transition-all",
                                activeTab === 'COD'
                                    ? "border-yellow-500 bg-yellow-50"
                                    : "border-gray-200"
                            )}
                        >
                            <div className="flex items-center justify-center gap-4 mb-4">
                                <Image src={codIcon} alt="Cash on Delivery" width={40} height={40} className="object-contain" />
                            </div>

                            <div className="flex items-center justify-center gap-3">
                                <div
                                    className={cn(
                                        "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                                        activeTab === 'COD'
                                            ? "border-green-500"
                                            : "border-gray-300"
                                    )}
                                >
                                    {activeTab === 'COD' && (
                                        <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                                    )}
                                </div>
                                <span className="text-sm font-medium text-gray-800">
                                    Cash On Delivery
                                </span>
                            </div>
                        </div>
                        <p className="flex items-center text-xs text-gray-500 mt-2">
                            Powered by <span className="font-semibold">Razorpay</span> Secure
                            Payments
                        </p>
                    </div>
                </div>

                {/* Selected Address Snippet */}
                {selectedAddress && (
                    <div className="bg-[#EAF4EF] border border-[#DDEBDD] rounded-2xl p-6 shadow-sm">
                        <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-3">SHIPPING TO</h3>
                        <div className="flex justify-between items-start">
                            <div className="text-sm">
                                <p className="font-bold text-gray-900 underline underline-offset-4 decoration-emerald-200">{selectedAddress?.name}</p>
                                <p className="text-gray-600 mt-1">{selectedAddress?.addressLine1}, {selectedAddress?.city}</p>
                            </div>
                            <button
                                onClick={() => router.push('/checkout/address')}
                                className="text-[10px] font-bold text-emerald-700 bg-white border border-emerald-100 px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors uppercase tracking-wider shadow-sm"
                            >
                                Change
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="lg:col-span-1 mt-8 lg:mt-0 space-y-6">
                <PriceDetails
                    button={
                        <button
                            onClick={handlePlaceOrder}
                            disabled={isPlacingOrder}
                            className="w-full bg-[#346800] hover:bg-[#2a5400] text-white font-bold py-3.5 rounded-xl uppercase tracking-wider text-sm transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.98]"
                        >
                            {isPlacingOrder ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Order'}
                        </button>
                    }
                />

                <button
                    onClick={() => router.push('/checkout/address')}
                    className="w-full text-zinc-500 text-xs font-bold uppercase tracking-widest hover:text-zinc-800 transition-colors"
                >
                    ← Back to Address
                </button>
            </div>
        </div>
    );
}
