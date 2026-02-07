'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckoutStore } from '@/store/useCheckoutStore';
import { useCart } from '@/hooks/useCart';
import { useAddress } from '@/hooks/useAddress';
import { CreditCard, Truck, ShieldCheck, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import OrderSummary from '@/components/checkout/OrderSummary';
import { toast } from 'sonner';
import api from '@/lib/axios';

export default function PaymentPage() {
    const router = useRouter();
    const { selectedAddressId, isAddressConfirmed, paymentMethod, setPaymentMethod, resetCheckout } = useCheckoutStore();
    const { data: cart, isLoading: isCartLoading } = useCart();
    const { addresses } = useAddress();
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    // Redirect if checks fail
    useEffect(() => {
        if (isCartLoading) return;

        if (!cart || cart.items.length === 0) {
            router.push('/cart');
        } else if (!selectedAddressId || !isAddressConfirmed) {
            router.push('/checkout/address');
        }
    }, [cart, isCartLoading, selectedAddressId, isAddressConfirmed, router]);

    if (isCartLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
            </div>
        );
    }

    const selectedAddress = addresses.find(a => a._id === selectedAddressId);

    const handlePlaceOrder = async () => {
        if (!selectedAddress) return;

        setIsPlacingOrder(true);
        try {
            await api.post('/orders', {
                items: cart?.items, // Backend should ideally re-fetch from cart ID to be safe, but passing items is common
                shippingAddress: selectedAddress,
                paymentMethod: paymentMethod
            });

            toast.success('Order placed successfully!');
            resetCheckout();
            router.push('/account/orders'); // Or a thank you page
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to place order');
        } finally {
            setIsPlacingOrder(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                    <h3 className="text-lg font-black text-stone-900 mb-6 flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                        Choose Payment Mode
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label
                            className={cn(
                                "p-6 rounded-xl border-2 cursor-pointer transition-all relative flex flex-col items-center justify-center gap-3 text-center h-40",
                                paymentMethod === 'ONLINE'
                                    ? "bg-amber-50 border-amber-600 shadow-md"
                                    : "bg-stone-50 border-stone-200 hover:border-amber-200"
                            )}
                            onClick={() => setPaymentMethod('ONLINE')}
                        >
                            <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'ONLINE'} readOnly />
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                                <CreditCard className={cn("w-6 h-6", paymentMethod === 'ONLINE' ? "text-amber-600" : "text-stone-400")} />
                            </div>
                            <span className={cn("font-bold", paymentMethod === 'ONLINE' ? "text-stone-900" : "text-stone-500")}>
                                UPI / Card / NetBanking
                            </span>
                            {paymentMethod === 'ONLINE' && (
                                <div className="absolute top-3 right-3 w-4 h-4 bg-amber-600 rounded-full border-2 border-white" />
                            )}
                        </label>

                        <label
                            className={cn(
                                "p-6 rounded-xl border-2 cursor-pointer transition-all relative flex flex-col items-center justify-center gap-3 text-center h-40",
                                paymentMethod === 'COD'
                                    ? "bg-amber-50 border-amber-600 shadow-md"
                                    : "bg-stone-50 border-stone-200 hover:border-amber-200"
                            )}
                            onClick={() => setPaymentMethod('COD')}
                        >
                            <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'COD'} readOnly />
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                                <Truck className={cn("w-6 h-6", paymentMethod === 'COD' ? "text-amber-600" : "text-stone-400")} />
                            </div>
                            <span className={cn("font-bold", paymentMethod === 'COD' ? "text-stone-900" : "text-stone-500")}>
                                Cash On Delivery
                            </span>
                            {paymentMethod === 'COD' && (
                                <div className="absolute top-3 right-3 w-4 h-4 bg-amber-600 rounded-full border-2 border-white" />
                            )}
                        </label>
                    </div>

                    <div className="mt-6 flex items-start gap-3 p-4 bg-stone-50 rounded-lg text-xs text-stone-500 leading-relaxed">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <p>
                            Your payment is 100% secure. We use razorpay for online transactions.
                            For COD, please keep exact change ready.
                        </p>
                    </div>
                </div>

                <button
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder}
                    className="w-full bg-amber-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-amber-600/20 hover:bg-amber-700 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                    {isPlacingOrder ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        'Place Order'
                    )}
                </button>
            </div>

            <div className="lg:col-span-1">
                <OrderSummary address={selectedAddress} />
            </div>
        </div>
    );
}
