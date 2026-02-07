'use client'

import React, { useState } from 'react'
import {
    Search,
    Filter,
    UserCircle,
    Mail,
    Phone,
    Calendar,
    Shield,
    ShieldAlert,
    MoreVertical,
    CheckCircle2,
    XCircle
} from 'lucide-react'
import { useAdminUsers, useUpdateUserStatus } from '@/hooks/useAdmin'
import { cn } from '@/lib/utils'

export default function AdminUsers() {
    const [search, setSearch] = useState('')
    const { data, isLoading } = useAdminUsers({ search })
    const { mutate: updateStatus } = useUpdateUserStatus()

    const users = data?.users || []

    const handleStatusUpdate = (userId: string, currentRole: string) => {
        const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN'
        if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
            updateStatus({ userId, status: newRole })
        }
    }

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-8 h-8 border-4 border-stone-200 border-t-amber-600 rounded-full animate-spin"></div>
        </div>
    )

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-black text-stone-900 tracking-tight">User Management</h1>
                <p className="text-stone-500 font-medium">Manage user accounts, roles, and permissions.</p>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                    <input
                        type="text"
                        placeholder="Search by name or phone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
                    />
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-white border border-stone-200 rounded-xl font-bold text-stone-600 hover:bg-stone-50 transition-all">
                    <Filter className="w-5 h-5" />
                    Filters
                </button>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-stone-50 border-b border-stone-100">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black text-stone-500 uppercase tracking-widest">User Profile</th>
                                <th className="px-6 py-4 text-[10px] font-black text-stone-500 uppercase tracking-widest">Contact</th>
                                <th className="px-6 py-4 text-[10px] font-black text-stone-500 uppercase tracking-widest">Joined Date</th>
                                <th className="px-6 py-4 text-[10px] font-black text-stone-500 uppercase tracking-widest">Role</th>
                                <th className="px-6 py-4 text-[10px] font-black text-stone-500 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-50">
                            {users.map((user: any) => (
                                <tr key={user._id} className="hover:bg-amber-50/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 font-black text-sm">
                                                {user.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-stone-900">{user.name}</span>
                                                <span className="text-[10px] text-stone-500 font-bold uppercase tracking-tighter">ID: {user._id.slice(-6).toUpperCase()}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-stone-600">
                                                <Phone className="w-3 h-3" />
                                                <span className="text-[10px] font-bold">{user.phone}</span>
                                            </div>
                                            {user.email && (
                                                <div className="flex items-center gap-2 text-stone-400">
                                                    <Mail className="w-3 h-3" />
                                                    <span className="text-[10px] font-medium">{user.email}</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-[10px] font-bold text-stone-500 flex items-center gap-2 mt-4">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide flex items-center gap-1 w-fit",
                                            user.role === 'ADMIN'
                                                ? "bg-amber-100 text-amber-700"
                                                : "bg-stone-100 text-stone-600"
                                        )}>
                                            {user.role === 'ADMIN' ? <Shield className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3 opacity-50" />}
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleStatusUpdate(user._id, user.role)}
                                            className="p-2 text-stone-400 hover:text-amber-600 transition-colors rounded-lg hover:bg-amber-50"
                                        >
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {users.length === 0 && (
                    <div className="p-20 text-center">
                        <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <UserCircle className="w-8 h-8 text-stone-200" />
                        </div>
                        <h3 className="text-lg font-bold text-stone-900 mb-1">No Users Found</h3>
                        <p className="text-stone-500 text-sm">No customers matching your search criteria were found.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
