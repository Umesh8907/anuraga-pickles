'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useUser } from '@/hooks/useAuth'
import { useAdminLogin, useAdminUser } from '@/hooks/useAdminAuth'
import { Lock, ArrowRight, AlertCircle } from 'lucide-react'

export default function AdminLoginPage() {
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const router = useRouter()
    const { mutate: login, isPending } = useAdminLogin()
    const { data: user } = useAdminUser()

    useEffect(() => {
        if (user && user.role === 'ADMIN') {
            router.push('/admin/dashboard')
        }
    }, [user, router])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        login({ phone, password, role: 'ADMIN' }, {
            onSuccess: (data) => {
                if (data.user.role !== 'ADMIN') {
                    setError('Access Denied. You do not have admin privileges.')
                    return
                }
                router.push('/admin/dashboard')
            },
            onError: () => {
                setError('Invalid credentials. Please try again.')
            }
        })
    }

    return (
        <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-stone-800 rounded-3xl border border-stone-700 shadow-2xl overflow-hidden relative">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-600 to-amber-400" />
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl" />

                <div className="p-8 md:p-12 relative z-10">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-stone-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner ring-1 ring-stone-600">
                            <Lock className="w-8 h-8 text-amber-500" />
                        </div>
                        <h1 className="text-2xl font-black text-white tracking-tight mb-2">Admin Portal</h1>
                        <p className="text-stone-400 text-sm font-medium">Secure access for authorized personnel only.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-400 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-black text-stone-500 uppercase tracking-widest">Phone Number</label>
                            <input
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-4 py-3 bg-stone-900 border border-stone-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-medium placeholder:text-stone-600"
                                placeholder="Enter your phone"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-stone-500 uppercase tracking-widest">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-stone-900 border border-stone-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all font-medium placeholder:text-stone-600"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-amber-600/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                        >
                            {isPending ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Sign In to Dashboard
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="bg-stone-900/50 p-6 text-center border-t border-stone-700">
                    <p className="text-xs text-stone-500 font-medium">
                        &copy; {new Date().getFullYear()} Anuraga Pickles. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    )
}
