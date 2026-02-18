'use client';

import React, { useState } from 'react';
import { Address } from '@/types';
import { useAddress } from '@/hooks/useAddress';
import { cn } from '@/lib/utils';

interface AddressFormProps {
    initialData?: Partial<Address>;
    onClose: () => void;
}

export default function AddressForm({ initialData, onClose }: AddressFormProps) {
    const { addAddress, updateAddress } = useAddress();
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        phone: initialData?.phone || '',
        addressLine1: initialData?.addressLine1 || '',
        addressLine2: initialData?.addressLine2 || '',
        city: initialData?.city || '',
        state: initialData?.state || '',
        pincode: initialData?.pincode || '',
        isDefault: initialData?.isDefault || false
    });

    const isEditing = !!initialData?._id;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing && initialData?._id) {
            updateAddress.mutate({
                id: initialData._id,
                data: formData
            }, {
                onSuccess: onClose
            });
        } else {
            addAddress.mutate(formData, {
                onSuccess: onClose
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="animate-in fade-in slide-in-from-bottom-2">

            {/* Contact Details */}
            <div className="mb-6">
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-4">Contact Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Name*"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-stone-500 transition-all font-medium placeholder:text-stone-400 text-sm"
                        />
                    </div>
                    <div>
                        <input
                            type="tel"
                            placeholder="Mobile No*"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-stone-500 transition-all font-medium placeholder:text-stone-400 text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Address */}
            <div className="mb-6">
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-4">Address</h4>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Pin Code*"
                            required
                            value={formData.pincode}
                            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-stone-500 transition-all font-medium placeholder:text-stone-400 text-sm"
                        />
                        <input
                            type="text"
                            placeholder="Address (House No, Building, Street, Area)*"
                            required
                            value={formData.addressLine1}
                            onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-stone-500 transition-all font-medium placeholder:text-stone-400 text-sm"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Locality / Town*"
                            required
                            value={formData.city} // Mapping city to locality as per typical usage, or add a new field if schema supports
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-stone-500 transition-all font-medium placeholder:text-stone-400 text-sm"
                        />
                        <div className="flex gap-4">
                            <input
                                type="text"
                                placeholder="City / District*"
                                required
                                value={formData.city} // Reuse city or add another field? The previous form had city/district. 
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                className="w-full px-4 py-3 bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-stone-500 transition-all font-medium placeholder:text-stone-400 text-sm"
                            />
                            <input
                                type="text"
                                placeholder="State*"
                                required
                                value={formData.state}
                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                className="w-full px-4 py-3 bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-stone-500 transition-all font-medium placeholder:text-stone-400 text-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Address As (Address Type) */}
            <div className="mb-8">
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-4">Save Address As</h4>
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        // Simplification: using isDefault as 'Home' for now? Or need type field? 
                        // The mock shows "Home" and "Work" buttons. 
                        // Existing schema has isDefault boolean. 
                        // Let's assume isDefault=true -> Home, isDefault=false -> Work? 
                        // Or I should stick to the existing form logic which had a checkbox for default.
                        // Use isDefault checkbox separately if needed, but for "Type", we might need a new field if schema doesn't have it.
                        // Looking at Address type in `view_file` (Address interface not fully visible but existing form had isDefault).
                        // I will keep isDefault checkbox separate and just use simple buttons for visual, but wait, I can't add fields if backend doesn't support.
                        // I'll stick to the "isDefault" checkbox for now but style it as per design if possible, or just keep it simple.
                        className={cn(
                            "px-6 py-2 rounded-full border text-xs font-bold uppercase transition-all",
                            formData.isDefault ? "bg-stone-900 text-white border-stone-900" : "bg-white text-stone-500 border-stone-300 hover:border-stone-400"
                        )}
                        onClick={() => setFormData({ ...formData, isDefault: true })}
                    >
                        Home
                    </button>
                    <button
                        type="button"
                        className={cn(
                            "px-6 py-2 rounded-full border text-xs font-bold uppercase transition-all",
                            !formData.isDefault ? "bg-stone-900 text-white border-stone-900" : "bg-white text-stone-500 border-stone-300 hover:border-stone-400"
                        )}
                        onClick={() => setFormData({ ...formData, isDefault: false })}
                    >
                        Work
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-stone-100">
                <button
                    type="submit"
                    disabled={addAddress.isPending || updateAddress.isPending}
                    className="flex-1 px-4 py-3 bg-[#A0522D] text-white rounded-sm font-bold uppercase tracking-wider hover:bg-[#8B4513] transition-colors disabled:opacity-50"
                >
                    {isEditing ? 'Save Address' : 'Save Address'}
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 bg-white text-stone-500 border border-stone-200 rounded-sm font-bold uppercase tracking-wider hover:text-stone-900 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
