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
        isDefault: initialData?.isDefault || false,
        addressType: initialData?.addressType || 'HOME'
    });

    const isEditing = !!initialData?._id;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing && initialData?._id) {
            updateAddress.mutate(
                { id: initialData._id, data: formData },
                { onSuccess: onClose }
            );
        } else {
            addAddress.mutate(formData, {
                onSuccess: onClose
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">

            {/* CONTACT DETAILS */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-zinc-900">CONTACT DETAILS</h3>
                <input
                    type="text"
                    required
                    placeholder="Name*"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C05A2B] placeholder:text-zinc-400"
                />

                <input
                    type="tel"
                    required
                    placeholder="Mobile No*"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C05A2B] placeholder:text-zinc-400"
                />
            </div>

            {/* ADDRESS SECTION */}
            <div className="space-y-4 pt-4">
                <h3 className="text-sm font-semibold text-zinc-900">ADDRESS</h3>
                <input
                    type="text"
                    required
                    placeholder="Pin Code*"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C05A2B] placeholder:text-zinc-400"
                />

                <input
                    type="text"
                    required
                    placeholder="House Number/Tower/Block*"
                    value={formData.addressLine1}
                    onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C05A2B] placeholder:text-zinc-400"
                />

                <input
                    type="text"
                    placeholder="Address (locality,building,street)"
                    value={formData.addressLine2}
                    onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C05A2B] placeholder:text-zinc-400"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                        type="text"
                        required
                        placeholder="City/District*"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C05A2B] placeholder:text-zinc-400"
                    />

                    <input
                        type="text"
                        required
                        placeholder="State*"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C05A2B] placeholder:text-zinc-400"
                    />
                </div>
            </div>

            {/* ADDRESS TYPE */}
            <div className="pt-4">
                <h3 className="text-sm font-semibold text-zinc-900 mb-3">ADDRESS TYPE</h3>
                <div className="flex gap-8">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                            <input
                                type="radio"
                                name="addressType"
                                checked={formData.addressType === 'HOME'}
                                onChange={() => setFormData({ ...formData, addressType: 'HOME' })}
                                className="w-4 h-4 text-[#346800] border-gray-300 focus:ring-[#346800]"
                            />
                        </div>
                        <span className="text-sm text-zinc-600">Home</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                            type="radio"
                            name="addressType"
                            checked={formData.addressType === 'WORK'}
                            onChange={() => setFormData({ ...formData, addressType: 'WORK' })}
                            className="w-4 h-4 text-[#346800] border-gray-300 focus:ring-[#346800]"
                        />
                        <span className="text-sm text-zinc-600">Work</span>
                    </label>
                </div>
            </div>

            {/* DEFAULT ADDRESS checkbox */}
            <div className="flex items-center gap-2 pt-2">
                <input
                    type="checkbox"
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                />
                <label htmlFor="isDefault" className="text-sm text-zinc-600 cursor-pointer">
                    Make this my default address
                </label>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-zinc-100">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-8 py-2.5 border border-zinc-200 text-zinc-600 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-zinc-50 transition-all"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={addAddress.isPending || updateAddress.isPending}
                    className="px-10 py-2.5 bg-[#B85B2B] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-95 transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
                >
                    {isEditing ? 'Update' : 'Save'}
                </button>
            </div>

        </form>
    );
}
