'use client'

import React, { useState } from 'react'
import { X, Phone, Lock, User, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useLogin, useRegister } from '@/hooks/useAuth'
import { useAuthModalStore } from '@/store/useAuthModalStore'
import { cn } from '@/lib/utils'

export default function AuthModal() {
    const { isOpen, view, closeModal, setView } = useAuthModalStore();

    // Login State
    const [loginPhone, setLoginPhone] = useState('')
    const [loginPassword, setLoginPassword] = useState('')
    const [loginError, setLoginError] = useState('')

    // Register State
    const [regName, setRegName] = useState('')
    const [regPhone, setRegPhone] = useState('')
    const [regPassword, setRegPassword] = useState('')
    const [regError, setRegError] = useState('')

    const { mutate: login, isPending: isLoginPending } = useLogin();
    const { mutate: register, isPending: isRegPending } = useRegister();

    if (!isOpen) return null;

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        setLoginError('')
        login({ phone: loginPhone, password: loginPassword }, {
            onSuccess: () => closeModal(),
            onError: (err: any) => setLoginError(err?.response?.data?.message || 'Invalid credentials')
        })
    }

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault()
        setRegError('')
        register({ name: regName, phone: regPhone, password: regPassword }, {
            onSuccess: () => closeModal(),
            onError: (err: any) => setRegError(err?.response?.data?.message || 'Registration failed')
        })
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 italic">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
                onClick={closeModal}
            />

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Close Button */}
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-900 transition-colors z-10"
                >
                    <X className="w-5 h-5 not-italic" />
                </button>

                <div className="p-8 sm:p-10">
                    {view === 'LOGIN' ? (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h2 className="text-2xl font-extrabold text-stone-900 not-italic">Welcome Back</h2>
                                <p className="text-sm text-stone-500 mt-2 font-medium">Spicing up your life, one jar at a time.</p>
                            </div>

                            {loginError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl flex items-center gap-2 text-xs not-italic">
                                    <AlertCircle className="w-4 h-4" />
                                    {loginError}
                                </div>
                            )}

                            <form onSubmit={handleLogin} className="space-y-4 not-italic">
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400 group-focus-within:text-amber-600">
                                            <Phone className="h-4 w-4" />
                                        </div>
                                        <input
                                            type="tel"
                                            required
                                            value={loginPhone}
                                            onChange={(e) => setLoginPhone(e.target.value)}
                                            className="block w-full pl-11 pr-4 py-3 border border-stone-200 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                                            placeholder="Phone Number"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400 group-focus-within:text-amber-600">
                                            <Lock className="h-4 w-4" />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            value={loginPassword}
                                            onChange={(e) => setLoginPassword(e.target.value)}
                                            className="block w-full pl-11 pr-4 py-3 border border-stone-200 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                                            placeholder="Password"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoginPending}
                                    className="w-full bg-stone-900 text-white font-bold py-3.5 rounded-xl hover:bg-amber-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-stone-100"
                                >
                                    {isLoginPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Login <ArrowRight className="w-4 h-4" /></>}
                                </button>
                            </form>

                            <div className="text-center text-sm">
                                <p className="text-stone-500 font-medium">
                                    New to Anuraga?{' '}
                                    <button
                                        onClick={() => setView('REGISTER')}
                                        className="text-amber-700 font-extrabold hover:underline"
                                    >
                                        Create account
                                    </button>
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h2 className="text-2xl font-extrabold text-stone-900 not-italic">Join the Family</h2>
                                <p className="text-sm text-stone-500 mt-2 font-medium">Taste the tradition of Andhra.</p>
                            </div>

                            {regError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl flex items-center gap-2 text-xs not-italic">
                                    <AlertCircle className="w-4 h-4" />
                                    {regError}
                                </div>
                            )}

                            <form onSubmit={handleRegister} className="space-y-4 not-italic">
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400 group-focus-within:text-amber-600">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={regName}
                                            onChange={(e) => setRegName(e.target.value)}
                                            className="block w-full pl-11 pr-4 py-3 border border-stone-200 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                                            placeholder="Full Name"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400 group-focus-within:text-amber-600">
                                            <Phone className="h-4 w-4" />
                                        </div>
                                        <input
                                            type="tel"
                                            required
                                            value={regPhone}
                                            onChange={(e) => setRegPhone(e.target.value)}
                                            className="block w-full pl-11 pr-4 py-3 border border-stone-200 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                                            placeholder="Phone Number"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400 group-focus-within:text-amber-600">
                                            <Lock className="h-4 w-4" />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            value={regPassword}
                                            onChange={(e) => setRegPassword(e.target.value)}
                                            className="block w-full pl-11 pr-4 py-3 border border-stone-200 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                                            placeholder="Set Password"
                                        />
                                    </div>
                                    <div className="flex items-start gap-2 bg-stone-50 p-3 rounded-lg text-[10px] text-stone-500 italic">
                                        <CheckCircle2 className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                                        Sign up to get 10% off on your first order.
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isRegPending}
                                    className="w-full bg-amber-600 text-white font-bold py-3.5 rounded-xl hover:bg-amber-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-50"
                                >
                                    {isRegPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Join Now <ArrowRight className="w-4 h-4" /></>}
                                </button>
                            </form>

                            <div className="text-center text-sm">
                                <p className="text-stone-500 font-medium">
                                    Part of family already?{' '}
                                    <button
                                        onClick={() => setView('LOGIN')}
                                        className="text-amber-700 font-extrabold hover:underline"
                                    >
                                        Login here
                                    </button>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
