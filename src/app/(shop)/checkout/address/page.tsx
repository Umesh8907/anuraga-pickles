'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAddress } from '@/hooks/useAddress';
import { useCheckoutStore } from '@/store/useCheckoutStore';
import { Plus, CheckCircle2, MapPin, Edit, Trash2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import AddressForm from '@/components/checkout/AddressForm';
import { useCart } from '@/hooks/useCart';

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
            router.push('/cart');
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
                <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-stone-900">Select Delivery Address</h2>
                    <button
                        onClick={handleAddNew}
                        className="flex items-center gap-2 text-sm font-bold text-amber-600 hover:text-amber-700 uppercase tracking-wide"
                    >
                        <Plus className="w-4 h-4" />
                        Add New Address
                    </button>
                </div>

                {showForm && (
                    <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm mb-6">
                        <h3 className="text-lg font-bold text-stone-900 mb-4">
                            {editingId ? 'Edit Address' : 'Add New Address'}
                        </h3>
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
                                "p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 relative group",
                                selectedAddressId === address._id
                                    ? "bg-amber-50/50 border-amber-500 shadow-md"
                                    : "bg-white border-stone-200 hover:border-amber-200"
                            )}
                        >
                            <div className="flex items-start gap-4">
                                <div className={cn(
                                    "w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 transition-colors",
                                    selectedAddressId === address._id
                                        ? "border-amber-600 bg-amber-600"
                                        : "border-stone-300 bg-transparent"
                                )}>
                                    {selectedAddressId === address._id && <CheckCircle2 className="w-4 h-4 text-white" />}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-stone-900">{address.name}</h3>
                                        <span className="px-2 py-0.5 bg-stone-100 text-[10px] font-black uppercase text-stone-500 rounded-full">
                                            {address.isDefault ? 'Default' : 'Other'}
                                        </span>
                                    </div>
                                    <p className="text-stone-600 text-sm leading-relaxed mb-1">
                                        {address.addressLine1}, {address.addressLine2 && `${address.addressLine2}, `}
                                        {address.city}, {address.state} - <span className="font-bold text-stone-800">{address.pincode}</span>
                                    </p>
                                    <p className="text-stone-500 text-sm font-medium">
                                        Mobile: <span className="text-stone-900">{address.phone}</span>
                                    </p>

                                    <div className="flex items-center gap-4 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleEdit(address._id); }}
                                            className="flex items-center gap-1 text-xs font-bold text-stone-400 hover:text-amber-600"
                                        >
                                            <Edit className="w-3 h-3" /> Edit
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (confirm('Are you sure?')) deleteAddress.mutate(address._id);
                                            }}
                                            className="flex items-center gap-1 text-xs font-bold text-stone-400 hover:text-red-600"
                                        >
                                            <Trash2 className="w-3 h-3" /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {addresses.length === 0 && !showForm && (
                        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-stone-200">
                            <MapPin className="w-12 h-12 text-stone-200 mx-auto mb-3" />
                            <h3 className="text-stone-900 font-bold mb-1">No Addresses Found</h3>
                            <p className="text-stone-500 text-sm mb-4">Please add a delivery address to proceed.</p>
                            <button
                                onClick={handleAddNew}
                                className="px-6 py-2 bg-amber-600 text-white rounded-lg font-bold text-sm hover:bg-amber-700 transition-colors"
                            >
                                Add Address
                            </button>
                        </div>
                    )}
                </div>

                {addresses.length > 0 && (
                    <div className="sticky bottom-4 z-10 pt-4 bg-transparent">
                        <button
                            onClick={handleDeliverHere}
                            disabled={!selectedAddressId}
                            className="w-full bg-amber-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-amber-600/20 hover:bg-amber-700 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:hover:scale-100"
                        >
                            Deliver Here
                        </button>
                    </div>
                )}
            </div>

            {/* Summary Sidebar (Could be a separate component) */}
            <div className="hidden lg:block">
                {/* Placeholder for Order summary if needed, but the design shows coupons etc. 
                     For now, let's keep it simple or reuse the cart summary logic if we extract it.
                     Since the design shows a specific summary styles, maybe we create OrderSummary component next.
                 */}
                <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm sticky top-24">
                    <h3 className="font-bold text-stone-900 mb-4">Delivery Estimate</h3>
                    <p className="text-sm text-stone-500">Standard Delivery (3-5 Business Days)</p>
                </div>
            </div>
        </div>
    );
}
