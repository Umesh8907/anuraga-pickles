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
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    return (
        <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
            <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-base font-semibold text-gray-900 uppercase">Select Delivery Address</h2>
                    <button
                        onClick={handleAddNew}
                        className="text-xs font-bold text-gray-900 border border-gray-300 px-5 py-2.5 rounded-lg hover:bg-gray-50 uppercase tracking-wide bg-white transition-all shadow-sm"
                    >
                        Add New Address
                    </button>
                </div>

                {showForm && (
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-md mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                                {editingId ? 'Edit Address' : 'Add New Address'}
                            </h3>
                            <button onClick={() => setShowForm(false)} className="text-xs font-bold text-gray-400 hover:text-rose-500 uppercase">CANCEL</button>
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
                                "p-6 rounded-2xl border cursor-pointer transition-all duration-200 relative group bg-white",
                                selectedAddressId === address._id
                                    ? "border-green-600 ring-1 ring-green-600 shadow-sm"
                                    : "border-gray-200 hover:border-gray-300"
                            )}
                        >
                            <div className="flex items-start gap-4">
                                <div className="mt-1">
                                    <div className={cn(
                                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                                        selectedAddressId === address._id
                                            ? "border-green-600 bg-white"
                                            : "border-gray-300"
                                    )}>
                                        {selectedAddressId === address._id && <div className="w-2.5 h-2.5 rounded-full bg-green-600" />}
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-bold text-gray-900 text-[15px] underline underline-offset-4 decoration-zinc-200">{address.name}</h3>
                                        <span className={cn(
                                            "px-3 py-0.5 text-[10px] font-bold uppercase rounded-full border",
                                            address.isDefault ? "text-green-700 border-green-200 bg-green-50" : "text-gray-500 border-gray-200 bg-gray-50"
                                        )}>
                                            {address.isDefault ? 'Home' : 'Work'}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                        {address.addressLine1}
                                        {address.addressLine2 && `, ${address.addressLine2}`}
                                        <br />
                                        {address.city}, {address.state} - <span className="font-bold text-gray-900">{address.pincode}</span>
                                    </p>
                                    <p className="text-gray-600 text-sm mb-4">
                                        Mobile: <span className="font-bold text-gray-900">{address.phone}</span>
                                    </p>

                                    <div className="flex items-center gap-6 pt-4 border-t border-gray-100 mt-4">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleEdit(address._id); }}
                                            className="text-xs font-bold text-gray-900 hover:underline uppercase tracking-wide"
                                        >
                                            Edit
                                        </button>
                                        <div className="w-px h-3 bg-gray-200" />
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (confirm('Are you sure you want to remove this address?')) deleteAddress.mutate(address._id);
                                            }}
                                            className="text-xs font-bold text-rose-500 hover:underline uppercase tracking-wide"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {addresses.length === 0 && !showForm && (
                        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                            <MapPin className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                            <h3 className="text-gray-900 font-bold mb-2">No Addresses Found</h3>
                            <p className="text-gray-500 text-sm mb-6">Please add a delivery address to continue.</p>
                            <button
                                onClick={handleAddNew}
                                className="px-8 py-3 bg-[#346800] text-white rounded-xl font-bold text-sm hover:opacity-95 shadow-md active:scale-95 transition-all uppercase"
                            >
                                Add New Address
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column (Sidebar) */}
            <div className="lg:col-span-1 space-y-6">

                {/* Delivery Est */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">DELIVERY ESTIMATES</h3>
                    <ul className="space-y-4">
                        {cart?.items.map(item => (
                            <li key={item._id} className="flex gap-4 items-center">
                                <div className="w-12 h-12 bg-[#EAF5E6] rounded-xl overflow-hidden flex-shrink-0 border border-gray-100/50">
                                    <img src={item.product?.images?.[0] || 'https://placehold.co/100'} className="w-full h-full object-contain p-1" alt="" />
                                </div>
                                <div className="text-sm">
                                    <p className="font-semibold text-zinc-800 line-clamp-1">{item.product?.name}</p>
                                    <p className="text-zinc-500 text-[10px] mt-0.5 uppercase font-medium">Est. delivery <span className="text-green-600 font-bold">Soon</span></p>
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
                            className="w-full bg-[#346800] hover:bg-[#2a5400] text-white font-bold py-3.5 rounded-xl uppercase tracking-wider text-sm transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                        >
                            Continue
                        </button>
                    }
                />

                <button
                    onClick={() => router.push('/checkout/cart')}
                    className="w-full text-zinc-500 text-xs font-bold uppercase tracking-widest hover:text-zinc-800 transition-colors"
                >
                    ← Back to cart
                </button>
            </div>
        </div>
    );
}
