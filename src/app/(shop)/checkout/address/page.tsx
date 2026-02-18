'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAddress } from '@/hooks/useAddress';
import { useCheckoutStore } from '@/store/useCheckoutStore';
import { Plus, CheckCircle2, MapPin, Edit, Trash2, Loader2, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';
import AddressForm from '@/components/checkout/AddressForm';
import { useCart } from '@/hooks/useCart';
import PriceDetails from '@/components/checkout/PriceDetails';

export default function AddressPage() {
    const router = useRouter();
    const { addresses, deleteAddress } = useAddress();
    const { data: cart, isLoading: isCartLoading } = useCart();
    const { selectedAddressId, setSelectedAddressId, confirmAddress } = useCheckoutStore();

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Redirect to cart if empty
    useEffect(() => {
        if (isCartLoading) return;

        if (!cart || cart.items.length === 0) {
            router.push('/checkout/cart');
        }
    }, [cart, isCartLoading, router]);

    // Set default address if none selected
    useEffect(() => {
        if (!selectedAddressId && addresses.length > 0) {
            const defaultAddr = addresses.find(a => a.isDefault);
            if (defaultAddr) setSelectedAddressId(defaultAddr._id);
            else setSelectedAddressId(addresses[0]._id);
        }
    }, [addresses, selectedAddressId, setSelectedAddressId]);

    const handleDeliverHere = () => {
        if (selectedAddressId) {
            confirmAddress();
            router.push('/checkout/payment');
        }
    };

    const handleEdit = (id: string) => {
        setEditingId(id);
        setShowForm(true);
    };

    const handleAddNew = () => {
        setEditingId(null);
        setShowForm(true);
    };

    if (isCartLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
            </div>
        );
    }

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
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-lg font-bold text-stone-900 uppercase">Select Delivery Address</h2>
                            <button
                                onClick={handleAddNew}
                                className="text-xs font-bold text-stone-900 border border-stone-300 px-4 py-2 rounded-sm hover:border-black uppercase tracking-wide bg-white"
                            >
                                Add New Address
                            </button>
                        </div>

                        <div className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">Saved Addresses</div>

                        {showForm && (
                            <div className="bg-white p-6 rounded-sm border border-stone-200 shadow-sm mb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                                        {editingId ? 'Edit Address' : 'Add New Address'}
                                    </h3>
                                    <button onClick={() => setShowForm(false)} className="text-xs font-bold text-stone-500 hover:text-stone-900">CANCEL</button>
                                </div>
                                <AddressForm
                                    initialData={editingId ? addresses.find(a => a._id === editingId) : undefined}
                                    onClose={() => setShowForm(false)}
                                />
                            </div>
                        )}

                        <div className="space-y-4">
                            {addresses.map((address) => (
                                <div
                                    key={address._id}
                                    onClick={() => setSelectedAddressId(address._id)}
                                    className={cn(
                                        "p-6 rounded-lg border cursor-pointer transition-all duration-200 relative group bg-white",
                                        selectedAddressId === address._id
                                            ? "border-emerald-500 shadow-sm ring-1 ring-emerald-500 bg-emerald-50/10"
                                            : "border-stone-200 hover:border-stone-300"
                                    )}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1">
                                            <div className={cn(
                                                "w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
                                                selectedAddressId === address._id
                                                    ? "border-emerald-500"
                                                    : "border-stone-400"
                                            )}>
                                                {selectedAddressId === address._id && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-stone-900 text-sm">{address.name}</h3>
                                                <span className={cn(
                                                    "px-2 py-0.5 text-[10px] font-bold uppercase rounded-full border",
                                                    address.isDefault ? "text-emerald-700 border-emerald-200 bg-emerald-50" : "text-stone-500 border-stone-200 bg-stone-50"
                                                )}>
                                                    {address.isDefault ? 'Home' : 'Work'}
                                                </span>
                                            </div>
                                            <p className="text-stone-600 text-sm leading-relaxed mb-2">
                                                {address.addressLine1}, {address.addressLine2 && `${address.addressLine2}, `}
                                                {address.city}, {address.state} - <span className="font-bold text-stone-800">{address.pincode}</span>
                                            </p>
                                            <p className="text-stone-600 text-sm mb-3">
                                                Mobile: <span className="font-bold text-stone-800">{address.phone}</span>
                                            </p>

                                            <div className="flex items-center gap-4 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (confirm('Are you sure?')) deleteAddress.mutate(address._id);
                                                    }}
                                                    className="text-xs font-bold text-stone-500 hover:text-stone-900 hover:underline uppercase"
                                                >
                                                    Remove
                                                </button>
                                                <div className="w-px h-3 bg-stone-300" />
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleEdit(address._id); }}
                                                    className="text-xs font-bold text-stone-500 hover:text-stone-900 hover:underline uppercase"
                                                >
                                                    Edit
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {addresses.length === 0 && !showForm && (
                                <div className="text-center py-12 bg-white rounded-sm border border-dashed border-stone-300">
                                    <MapPin className="w-12 h-12 text-stone-200 mx-auto mb-3" />
                                    <h3 className="text-stone-900 font-bold mb-1">No Addresses Found</h3>
                                    <button
                                        onClick={handleAddNew}
                                        className="mt-4 px-6 py-2 bg-[#A0522D] text-white rounded-sm font-bold text-sm hover:opacity-90 transition-colors uppercase"
                                    >
                                        Add New Address
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Delivery Estimates (Styled better) */}
                        <div className="bg-white p-5 rounded-sm border border-stone-200">
                            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-4">DELIVERY ESTIMATES</h3>
                            <ul className="space-y-4">
                                {cart?.items.map(item => (
                                    <li key={item._id} className="flex gap-4">
                                        <div className="w-12 h-16 bg-stone-50 rounded-sm overflow-hidden shrink-0 border border-stone-100">
                                            <img src={item.product?.images?.[0] || 'https://placehold.co/100'} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div className="text-sm">
                                            <p className="font-medium text-stone-800 line-clamp-1">{item.product?.name}</p>
                                            <p className="text-stone-500 text-xs mt-1">Estimated delivery by <span className="font-bold text-stone-900">11 Feb 2026</span></p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <PriceDetails
                            button={
                                <button
                                    onClick={handleDeliverHere}
                                    disabled={!selectedAddressId}
                                    className="w-full bg-[#A0522D] hover:bg-[#8B4513] text-white font-bold py-3.5 rounded-sm uppercase tracking-wider text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                >
                                    Continue
                                </button>
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
