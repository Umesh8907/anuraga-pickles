'use client'

import React from 'react'
import { useUser } from '@/hooks/useAuth'
import { User as UserIcon, Package, LogOut, ChevronRight, Settings } from 'lucide-react'
import { useLogout } from '@/hooks/useAuth'

export default function AccountPage() {
    const { data: user, isLoading } = useUser();
    const { mutate: logout } = useLogout();

    if (isLoading) return <div className="min-h-screen pt-32 text-center text-stone-600 font-medium">Loading account details...</div>;

    if (!user) {
        return (
            <div className="min-h-screen bg-stone-50 pt-32 px-4 flex flex-col items-center">
                <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-sm border border-stone-100 text-center">
                    <UserIcon className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-stone-900 mb-2">Please Login</h1>
                    <p className="text-stone-500 mb-6 font-medium italic">You need to be logged in to view your account.</p>
                    <a href="/login" className="inline-block w-full bg-stone-900 text-white font-bold py-3 rounded-xl hover:bg-amber-600 transition-colors">Login</a>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-stone-50 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-10 text-center sm:text-left">
                    <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">Account Dashboard</h1>
                    <p className="text-stone-500 mt-1 font-medium italic">Welcome back, {user.name}!</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1">
                        <nav className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden text-sm italic">
                            <ul className="divide-y divide-stone-50">
                                <li>
                                    <button className="w-full flex items-center justify-between p-5 text-amber-700 bg-amber-50/50 font-bold border-l-4 border-amber-600 transition-all">
                                        <div className="flex items-center gap-3">
                                            <UserIcon className="w-5 h-5" />
                                            <span>Profile Details</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </li>
                                <li>
                                    <button className="w-full flex items-center justify-between p-5 text-stone-600 hover:text-amber-700 hover:bg-stone-50 font-medium transition-all">
                                        <div className="flex items-center gap-3">
                                            <Package className="w-5 h-5" />
                                            <span>Order History</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </li>
                                <li>
                                    <button className="w-full flex items-center justify-between p-5 text-stone-600 hover:text-amber-700 hover:bg-stone-50 font-medium transition-all">
                                        <div className="flex items-center gap-3">
                                            <Settings className="w-5 h-5" />
                                            <span>Settings</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => logout()}
                                        className="w-full flex items-center gap-3 p-5 text-red-600 hover:bg-red-50 font-bold transition-all"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span>Sign Out</span>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8 sm:p-10">
                            <h2 className="text-2xl font-bold text-stone-900 mb-8 border-b border-stone-100 pb-4">Personal Information</h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Full Name</label>
                                    <p className="text-lg font-bold text-stone-800 italic">{user.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Phone Number</label>
                                    <p className="text-lg font-bold text-stone-800 italic">{user.phone}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Account Status</label>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                        <span className="text-sm font-bold text-green-700 px-2 py-0.5 bg-green-50 rounded-lg border border-green-100">
                                            Active {user.role === 'ADMIN' && '(Admin)'}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-stone-400 uppercase tracking-widest">Member Since</label>
                                    <p className="text-lg font-bold text-stone-800 italic">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'February 2026'}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-12 bg-amber-50 rounded-2xl p-6 border border-amber-100 italic">
                                <h3 className="text-amber-900 font-bold mb-2 flex items-center gap-2">
                                    <Package className="w-4 h-4" />
                                    Recent Activity
                                </h3>
                                <p className="text-amber-800/80 text-sm leading-relaxed">
                                    You haven&apos;t placed any orders yet. Explore our authentic Andhra pickles and start your flavorful journey!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
