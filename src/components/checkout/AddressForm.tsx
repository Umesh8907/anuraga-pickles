'use client';

import React, { useState } from 'react';
import { Address } from '@/types';
import { useAddress } from '@/hooks/useAddress';

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
        <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1">Full Name</label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-500 transition-all font-medium"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1">Phone Number</label>
                    <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-500 transition-all font-medium"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1">Pincode</label>
                <input
                    type="text"
                    required
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-500 transition-all font-medium"
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1">Address Line 1 (House No, Building, Street)</label>
                <input
                    type="text"
                    required
                    value={formData.addressLine1}
                    onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                    className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-500 transition-all font-medium"
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1">Address Line 2 (Area, Landmark) - Optional</label>
                <input
                    type="text"
                    value={formData.addressLine2}
                    onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                    className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-500 transition-all font-medium"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1">City/District</label>
                    <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-500 transition-all font-medium"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1">State</label>
                    <input
                        type="text"
                        required
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-500 transition-all font-medium"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500"
                />
                <label htmlFor="isDefault" className="text-sm font-medium text-stone-700">Make this my default address</label>
            </div>

            <div className="flex items-center gap-4 pt-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 bg-stone-100 text-stone-600 rounded-xl font-bold hover:bg-stone-200 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={addAddress.isPending || updateAddress.isPending}
                    className="flex-1 px-4 py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-colors disabled:opacity-50"
                >
                    {isEditing ? 'Update Address' : 'Save Address'}
                </button>
            </div>
        </form>
    );
}
