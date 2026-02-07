'use client'

import React, { useState } from 'react'
import { useUser, useLogout } from '@/hooks/useAuth'
import { useUpdateProfile, useAddAddress, useUpdateAddress, useDeleteAddress } from '@/hooks/useUserManagement'
import { useOrders } from '@/hooks/useOrders'
import {
    User as UserIcon,
    Package,
    LogOut,
    ChevronRight,
    Settings,
    MapPin,
    Plus,
    Trash2,
    Edit2,
    Save,
    X,
    Clock,
    Phone,
    ShieldCheck
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

type Tab = 'profile' | 'addresses' | 'orders'

export default function AccountPage() {
    const { data: user, isLoading: userLoading } = useUser();
    const { mutate: logout } = useLogout();
    const { data: orders, isLoading: ordersLoading } = useOrders();
    const [activeTab, setActiveTab] = useState<Tab>('profile')

    // Profile Editing State
    const [isEditingProfile, setIsEditingProfile] = useState(false)
    const [editedName, setEditedName] = useState('')
    const { mutate: updateProfile, isPending: profileUpdating } = useUpdateProfile()

    // Address Editing State
    const [isAddingAddress, setIsAddingAddress] = useState(false)
    const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
    const [addressForm, setAddressForm] = useState({
        name: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
    })

    const { mutate: addAddress, isPending: addressAdding } = useAddAddress()
    const { mutate: updateAddress, isPending: addressUpdating } = useUpdateAddress()
    const { mutate: deleteAddress } = useDeleteAddress()

    if (userLoading) return <div className="min-h-screen pt-32 text-center text-stone-600 font-medium italic">Preparing your dashboard...</div>;

    if (!user) {
        return (
            <div className="min-h-screen bg-stone-50 pt-32 px-4 flex flex-col items-center">
                <div className="max-w-md w-full bg-white p-12 rounded-[2.5rem] shadow-xl border border-stone-100 text-center">
                    <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <UserIcon className="w-10 h-10 text-stone-300" />
                    </div>
                    <h1 className="text-2xl font-bold text-stone-900 mb-2 tracking-tight">Access Restricted</h1>
                    <p className="text-stone-500 mb-10 font-medium italic leading-relaxed">Please sign in to view your account dashboard and order history.</p>
                    <Link href="/" className="inline-block w-full bg-stone-900 text-white font-bold py-4 rounded-2xl hover:bg-amber-600 transition-all shadow-lg hover:shadow-amber-100">Sign In Now</Link>
                </div>
            </div>
        )
    }

    const handleProfileUpdate = () => {
        updateProfile({ name: editedName }, {
            onSuccess: () => setIsEditingProfile(false)
        })
    }

    const handleAddressSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (editingAddressId) {
            updateAddress({ addressId: editingAddressId, data: addressForm }, {
                onSuccess: () => {
                    setEditingAddressId(null)
                    setIsAddingAddress(false)
                }
            })
        } else {
            addAddress({ ...addressForm, isDefault: user.addresses?.length === 0 }, {
                onSuccess: () => setIsAddingAddress(false)
            })
        }
    }

    const openEditAddress = (addr: any) => {
        setAddressForm({
            name: addr.name,
            phone: addr.phone,
            addressLine1: addr.addressLine1,
            addressLine2: addr.addressLine2 || '',
            city: addr.city,
            state: addr.state,
            pincode: addr.pincode,
        })
        setEditingAddressId(addr._id)
        setIsAddingAddress(true)
    }

    return (
        <div className="min-h-screen bg-stone-50 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-extrabold text-stone-900 tracking-tight">My Account</h1>
                        <p className="text-stone-500 mt-2 font-medium italic text-lg">Welcome back, {user.name || 'Friend'}!</p>
                    </div>
                    <button
                        onClick={() => logout()}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-red-100 text-red-600 font-bold rounded-2xl hover:bg-red-50 transition-all shadow-sm"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Navigation Rail */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-[2rem] shadow-sm border border-stone-100 p-2 sticky top-28">
                            <nav className="flex flex-col gap-1">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={cn(
                                        "flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all text-sm",
                                        activeTab === 'profile' ? "bg-amber-600 text-white shadow-lg shadow-amber-100" : "text-stone-600 hover:bg-stone-50"
                                    )}
                                >
                                    <UserIcon className="w-5 h-5" />
                                    Profile Details
                                </button>
                                <button
                                    onClick={() => setActiveTab('addresses')}
                                    className={cn(
                                        "flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all text-sm",
                                        activeTab === 'addresses' ? "bg-amber-600 text-white shadow-lg shadow-amber-100" : "text-stone-600 hover:bg-stone-50"
                                    )}
                                >
                                    <MapPin className="w-5 h-5" />
                                    Addresses
                                </button>
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className={cn(
                                        "flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all text-sm",
                                        activeTab === 'orders' ? "bg-amber-600 text-white shadow-lg shadow-amber-100" : "text-stone-600 hover:bg-stone-50"
                                    )}
                                >
                                    <Package className="w-5 h-5" />
                                    Order History
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="md:col-span-3">
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-stone-100 p-8 md:p-12 min-h-[500px]">
                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <div className="animate-in fade-in duration-500">
                                    <div className="flex justify-between items-start mb-10">
                                        <h2 className="text-2xl font-bold text-stone-900 tracking-tight">Personal Information</h2>
                                        {!isEditingProfile && (
                                            <button
                                                onClick={() => {
                                                    setEditedName(user.name || '')
                                                    setIsEditingProfile(true)
                                                }}
                                                className="flex items-center gap-2 text-amber-700 font-bold hover:underline py-1"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                                Edit Profile
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                        <div className="space-y-2">
                                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] block">Full Name</span>
                                            {isEditingProfile ? (
                                                <div className="space-y-4">
                                                    <input
                                                        type="text"
                                                        value={editedName}
                                                        onChange={(e) => setEditedName(e.target.value)}
                                                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                                                    />
                                                    <div className="flex gap-3">
                                                        <button
                                                            disabled={profileUpdating}
                                                            onClick={handleProfileUpdate}
                                                            className="bg-stone-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 disabled:opacity-50"
                                                        >
                                                            <Save className="w-4 h-4" />
                                                            {profileUpdating ? 'Saving...' : 'Save'}
                                                        </button>
                                                        <button
                                                            onClick={() => setIsEditingProfile(false)}
                                                            className="bg-stone-100 text-stone-600 px-4 py-2 rounded-lg text-sm font-bold"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-xl font-bold text-stone-800 italic">{user.name || 'Not provided'}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] block">Phone Number</span>
                                            <div className="flex items-center gap-3">
                                                <p className="text-xl font-bold text-stone-800 italic">{user.phone}</p>
                                                <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-green-100">Verified</span>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] block">Account ID</span>
                                            <p className="text-sm font-mono text-stone-400">#{user._id?.slice(-8).toUpperCase()}</p>
                                        </div>

                                        <div className="space-y-2">
                                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] block">Security</span>
                                            <div className="flex items-center gap-2 text-stone-800 font-bold italic">
                                                <ShieldCheck className="w-5 h-5 text-amber-600" />
                                                Two-Factor Active
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-16 bg-stone-900 rounded-[2rem] p-8 md:p-10 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600/20 blur-3xl rounded-full transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700"></div>
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2 bg-amber-600 rounded-lg">
                                                    <Clock className="w-5 h-5 text-white" />
                                                </div>
                                                <h3 className="text-white font-bold text-lg">Taste the Tradition</h3>
                                            </div>
                                            <p className="text-stone-300 italic leading-relaxed max-w-md">
                                                You've been helping us preserve the authentic flavors of Andhra since {user.createdAt ? new Date(user.createdAt).getFullYear() : '2026'}.
                                            </p>
                                            <Link href="/collections/all-products" className="mt-8 inline-flex items-center gap-2 text-amber-500 font-bold hover:text-amber-400 transition-colors">
                                                Explore Our Varieties
                                                <ChevronRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Addresses Tab */}
                            {activeTab === 'addresses' && (
                                <div className="animate-in fade-in duration-500">
                                    <div className="flex justify-between items-center mb-10">
                                        <h2 className="text-2xl font-bold text-stone-900 tracking-tight">Saved Addresses</h2>
                                        {!isAddingAddress && (
                                            <button
                                                onClick={() => {
                                                    setEditingAddressId(null)
                                                    setAddressForm({
                                                        name: '',
                                                        phone: user.phone || '',
                                                        addressLine1: '',
                                                        addressLine2: '',
                                                        city: '',
                                                        state: '',
                                                        pincode: '',
                                                    })
                                                    setIsAddingAddress(true)
                                                }}
                                                className="flex items-center gap-2 bg-stone-900 text-white px-5 py-3 rounded-2xl font-bold text-sm hover:bg-amber-600 transition-all"
                                            >
                                                <Plus className="w-4 h-4" />
                                                Add New Address
                                            </button>
                                        )}
                                    </div>

                                    {isAddingAddress ? (
                                        <div className="bg-stone-50 rounded-[2rem] p-8 border border-stone-100">
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="font-bold text-stone-900">{editingAddressId ? 'Edit Address' : 'New Address'}</h3>
                                                <button onClick={() => setIsAddingAddress(false)} className="p-2 text-stone-400 hover:text-stone-600">
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                            <form onSubmit={handleAddressSubmit} className="space-y-6">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Receiver&apos;s Name</label>
                                                        <input
                                                            required
                                                            type="text"
                                                            value={addressForm.name}
                                                            onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                                                            className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Contact Number</label>
                                                        <input
                                                            required
                                                            type="tel"
                                                            value={addressForm.phone}
                                                            onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                                                            className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Flat, House no., Building, Apartment</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        value={addressForm.addressLine1}
                                                        onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                                                        className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Area, Street, Sector, Village (Optional)</label>
                                                    <input
                                                        type="text"
                                                        value={addressForm.addressLine2}
                                                        onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                                                        className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Town/City</label>
                                                        <input
                                                            required
                                                            type="text"
                                                            value={addressForm.city}
                                                            onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                                            className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">State</label>
                                                        <input
                                                            required
                                                            type="text"
                                                            value={addressForm.state}
                                                            onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                                                            className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                                                        />
                                                    </div>
                                                    <div className="space-y-2 col-span-2 sm:col-span-1">
                                                        <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Pincode</label>
                                                        <input
                                                            required
                                                            type="text"
                                                            value={addressForm.pincode}
                                                            onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                                                            className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                                                        />
                                                    </div>
                                                </div>
                                                <button
                                                    type="submit"
                                                    disabled={addressAdding || addressUpdating}
                                                    className="w-full bg-stone-900 text-white font-bold py-4 rounded-2xl hover:bg-amber-600 transition-all disabled:opacity-50"
                                                >
                                                    {addressAdding || addressUpdating ? 'Saving...' : (editingAddressId ? 'Update Address' : 'Add Address')}
                                                </button>
                                            </form>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            {user.addresses && user.addresses.length > 0 ? (
                                                user.addresses.map((addr: any) => (
                                                    <div key={addr._id} className="group bg-white border border-stone-100 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:border-amber-100 transition-all relative">
                                                        {addr.isDefault && (
                                                            <span className="absolute top-6 right-8 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-amber-100 italic">Default</span>
                                                        )}
                                                        <div className="mb-6 flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-stone-50 rounded-xl flex items-center justify-center text-stone-400 group-hover:text-amber-600 transition-colors">
                                                                <MapPin className="w-5 h-5" />
                                                            </div>
                                                            <h4 className="font-bold text-stone-900 italic text-lg">{addr.name}</h4>
                                                        </div>
                                                        <div className="text-stone-500 text-sm italic space-y-1 mb-8">
                                                            <p>{addr.addressLine1}</p>
                                                            {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                                                            <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                                                            <div className="flex items-center gap-2 mt-4 text-stone-400">
                                                                <Phone className="w-3.5 h-3.5" />
                                                                {addr.phone}
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-4 pt-4 border-t border-stone-50">
                                                            <button
                                                                onClick={() => openEditAddress(addr)}
                                                                className="flex items-center gap-2 text-stone-400 hover:text-amber-700 font-bold transition-all"
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                                <span className="text-xs">Edit</span>
                                                            </button>
                                                            {!addr.isDefault && (
                                                                <button
                                                                    onClick={() => deleteAddress(addr._id)}
                                                                    className="flex items-center gap-2 text-stone-400 hover:text-red-500 font-bold transition-all"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                    <span className="text-xs">Remove</span>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="col-span-full border-2 border-dashed border-stone-100 rounded-[2.5rem] p-20 text-center">
                                                    <p className="text-stone-400 font-medium italic mb-6">You haven&apos;t saved any addresses yet.</p>
                                                    <button
                                                        onClick={() => setIsAddingAddress(true)}
                                                        className="text-amber-700 font-bold hover:underline"
                                                    >
                                                        Add your first address &rarr;
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Orders Tab Summary */}
                            {activeTab === 'orders' && (
                                <div className="animate-in fade-in duration-500">
                                    <div className="flex justify-between items-center mb-10">
                                        <h2 className="text-2xl font-bold text-stone-900 tracking-tight">Recent Orders</h2>
                                        <Link href="/orders" className="text-amber-700 font-bold hover:underline text-sm flex items-center gap-2">
                                            View All Orders
                                            <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </div>

                                    <div className="space-y-6">
                                        {ordersLoading ? (
                                            <div className="animate-pulse space-y-4">
                                                <div className="h-24 bg-stone-50 rounded-3xl"></div>
                                                <div className="h-24 bg-stone-50 rounded-3xl"></div>
                                            </div>
                                        ) : orders && orders.length > 0 ? (
                                            orders.slice(0, 3).map((order) => (
                                                <div key={order._id} className="bg-white border border-stone-100 rounded-[2rem] p-6 hover:shadow-lg transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                                                            <Package className="w-8 h-8" />
                                                        </div>
                                                        <div>
                                                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-1">Order #{order._id?.slice(-6).toUpperCase()}</span>
                                                            <p className="font-bold text-stone-900 italic">Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</p>
                                                            <p className="text-stone-500 text-sm mt-1 italic">{order.items.length} {order.items.length === 1 ? 'item' : 'items'} • ₹{order.totalAmount.toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between sm:justify-end gap-6">
                                                        <span className={cn(
                                                            "px-4 py-1.5 rounded-full text-xs font-bold italic tracking-wide border",
                                                            order.orderStatus === 'DELIVERED' ? "bg-green-50 text-green-600 border-green-100" : "bg-amber-50 text-amber-700 border-amber-100"
                                                        )}>
                                                            {order.orderStatus}
                                                        </span>
                                                        <Link
                                                            href={`/orders/${order._id}`}
                                                            className="p-3 bg-stone-50 text-stone-400 hover:text-stone-900 rounded-xl transition-colors"
                                                        >
                                                            <ChevronRight className="w-5 h-5" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="border-2 border-dashed border-stone-100 rounded-[2.5rem] p-20 text-center">
                                                <p className="text-stone-400 font-medium italic mb-6">No order history found.</p>
                                                <Link href="/collections/all-products" className="text-amber-700 font-bold hover:underline">
                                                    Start shopping &rarr;
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
