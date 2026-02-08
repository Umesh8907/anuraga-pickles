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

const PAYMENT_MODES = [
    { id: 'RECOMMENDED', label: 'Recommended', icon: ShieldCheck },
    { id: 'COD', label: 'Cash On Delivery (Cash/UPI)', icon: Truck },
    { id: 'UPI', label: 'UPI (Pay via any App)', icon: Wallet },
    { id: 'CARD', label: 'Credit/Debit Card', icon: CreditCard },
    { id: 'NETBANKING', label: 'Net Banking', icon: Landmark },
];

export default function PaymentPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { selectedAddressId, isAddressConfirmed, paymentMethod, setPaymentMethod } = useCheckoutStore();
    const { data: cart, isLoading: isCartLoading } = useCart();
    const { addresses } = useAddress();
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    // UI State for Payment Mode Selection
    const [activeTab, setActiveTab] = useState('RECOMMENDED');

    // Use a ref to track if order was successfully placed to prevent the "Empty Cart" redirect
    // from triggering while we are redirecting to the success page.
    const isOrderSuccess = useRef(false);

    // Redirect if checks fail
    useEffect(() => {
        if (isCartLoading || isOrderSuccess.current) return;

        // If cart is empty and we haven't just placed an order, redirect.
        if (!cart || cart.items.length === 0) {
            router.push('/checkout/cart');
        } else if (!selectedAddressId || !isAddressConfirmed) {
            router.push('/checkout/address');
        }
    }, [cart, isCartLoading, selectedAddressId, isAddressConfirmed, router]);

    if (isCartLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
            </div>
        );
    }

    const selectedAddress = addresses.find(a => a._id === selectedAddressId);

    const handlePlaceOrder = async () => {
        if (!selectedAddress) return;

        // Map tab to backend payment method enum
        // For now, simpler mapping: COD is COD, everything else is ONLINE
        const backendPaymentMethod = activeTab === 'COD' ? 'COD' : 'ONLINE';

        setIsPlacingOrder(true);
        try {
            // 1. Create Order on Backend
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

                // 2. Create Razorpay Order
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
                            // 3. Verify Payment
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

                            // Cancel Order and release stock
                            await api.post(`/orders/${order._id}/cancel`, { reason: "Payment Verification Failed" });
                            setIsPlacingOrder(false);
                        }
                    },
                    prefill: {
                        name: selectedAddress.name,
                        contact: selectedAddress.phone,
                        // email: user?.email // Optional if we have it
                    },
                    theme: {
                        color: "#ef4444" // rose-500
                    },
                    modal: {
                        ondismiss: async function () {
                            setIsPlacingOrder(false);
                            toast.info("Payment cancelled. Stock released.");
                            // Cancel Order and release stock
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
                // COD
                handleOrderSuccess(order._id);
            }

        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to place order');
            setIsPlacingOrder(false);
        }
    };

    const handleOrderSuccess = async (orderId: string) => {
        isOrderSuccess.current = true; // Prevent redirect effect
        toast.success('Order placed successfully!');

        // Invalidate cart so it refetches (and shows empty)
        await queryClient.invalidateQueries({ queryKey: ['cart'] });

        // Navigate to completion page
        router.push(`/order-completed?orderId=${orderId}`);
    };

    return (
        <div className="bg-stone-50 min-h-screen pb-20">
            <div className="bg-white border-b border-stone-200 py-4">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 text-sm text-stone-500">
                    <Link href="/" className="hover:text-stone-900">Home</Link> / <span>Shop</span> / <span className="font-bold text-stone-900">Cart</span>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
                    <div className="lg:col-span-8 space-y-6">

                        {/* Available Offers */}
                        <div className="bg-white p-5 rounded-sm border border-stone-200">
                            <div className="flex items-center gap-2 mb-3">
                                <Tag className="w-4 h-4 text-stone-900" />
                                <span className="font-bold text-stone-900 text-sm">Available Offers</span>
                            </div>
                            <ul className="space-y-3 text-sm text-stone-600 pl-1">
                                <li className="flex items-start gap-3">
                                    <span className="mt-2 w-1.5 h-1.5 bg-stone-300 rounded-full flex-shrink-0" />
                                    <span className="leading-relaxed">10% Instant Discount on Canara Bank Credit Card on min spend of ₹3,500</span>
                                </li>
                            </ul>
                            <button className="text-emerald-600 text-xs font-bold mt-4 hover:underline flex items-center gap-1">
                                Show More <ChevronDown className="w-3 h-3" />
                            </button>
                        </div>

                        {/* Payment Modes */}
                        <div>
                            <h3 className="text-lg font-bold text-stone-900 mb-4">Choose Payment Mode</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Online Payment Card */}
                                <div
                                    onClick={() => setActiveTab('RECOMMENDED')}
                                    className={cn(
                                        "relative p-6 rounded-lg border-2 cursor-pointer transition-all flex flex-col justify-between min-h-[160px]",
                                        activeTab !== 'COD'
                                            ? "border-yellow-400 bg-white shadow-sm ring-1 ring-yellow-400"
                                            : "border-stone-200 bg-white hover:border-stone-300"
                                    )}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex gap-2">
                                            <img src="https://placehold.co/40x25?text=VISA" alt="Visa" className="h-5" />
                                            <img src="https://placehold.co/40x25?text=MC" alt="Mastercard" className="h-5" />
                                            <img src="https://placehold.co/40x25?text=RuPay" alt="RuPay" className="h-5" />
                                            <img src="https://placehold.co/40x25?text=UPI" alt="UPI" className="h-5" />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-5 h-5 rounded-full border flex items-center justify-center",
                                            activeTab !== 'COD' ? "border-emerald-500" : "border-stone-400"
                                        )}>
                                            {activeTab !== 'COD' && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />}
                                        </div>
                                        <span className="font-bold text-stone-800 text-sm uppercase">UPI/CREDIT-DEBIT/NETBANKING</span>
                                    </div>

                                    <div className="mt-4 text-[10px] text-stone-500 flex items-center gap-1">
                                        Powered by <span className="font-bold text-stone-700">Razorpay</span> Secure Payments
                                    </div>
                                </div>

                                {/* COD Card */}
                                <div
                                    onClick={() => setActiveTab('COD')}
                                    className={cn(
                                        "relative p-6 rounded-lg border-2 cursor-pointer transition-all flex flex-col justify-center min-h-[160px]",
                                        activeTab === 'COD'
                                            ? "border-emerald-500 bg-white shadow-sm"
                                            : "border-stone-200 bg-white hover:border-stone-300"
                                    )}
                                >
                                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                                        <Banknote className="w-8 h-8 text-stone-800" />

                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-5 h-5 rounded-full border flex items-center justify-center",
                                                activeTab === 'COD' ? "border-emerald-500" : "border-stone-400"
                                            )}>
                                                {activeTab === 'COD' && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />}
                                            </div>
                                            <span className="font-bold text-stone-800 text-sm uppercase">CASH ON DELIVERY</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="lg:col-span-4 mt-8 lg:mt-0">
                        <PriceDetails
                            button={
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={isPlacingOrder}
                                    className="w-full bg-[#A0522D] hover:bg-[#8B4513] text-white font-bold py-3.5 rounded-sm uppercase tracking-wider text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
                                >
                                    {isPlacingOrder ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Place Order'}
                                </button>
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
