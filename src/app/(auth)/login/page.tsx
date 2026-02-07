'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Phone, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import { useLogin } from '@/hooks/useAuth'

export default function LoginPage() {
    const router = useRouter();
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const { mutate: login, isPending } = useLogin();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMessage('')

        if (!phone || !password) {
            setErrorMessage('Please enter both phone number and password');
            return;
        }

        login(
            { phone, password },
            {
                onSuccess: () => {
                    router.push('/(dashboard)/account'); // Redirect to account on success
                },
                onError: (error: any) => {
                    setErrorMessage(error?.response?.data?.message || 'Invalid credentials. Please try again.');
                }
            }
        );
    }

    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-sm border border-stone-100">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">Welcome Back</h2>
                    <p className="mt-3 text-sm text-stone-500 font-medium italic">
                        Login with your phone number to access your account.
                    </p>
                </div>

                {errorMessage && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p>{errorMessage}</p>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="phone" className="block text-sm font-bold text-stone-700 mb-2 ml-1">
                                Phone Number
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400 group-focus-within:text-amber-600 transition-colors">
                                    <Phone className="h-5 w-5" />
                                </div>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                    placeholder="Enter 10-digit phone number"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-bold text-stone-700 mb-2 ml-1">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400 group-focus-within:text-amber-600 transition-colors">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between ml-1">
                        <div className="text-sm">
                            <Link href="/forgot-password" title="Coming soon!" className="font-bold text-amber-700 hover:text-amber-800 transition-colors">
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl text-white bg-stone-900 hover:bg-amber-600 font-bold text-base transition-all duration-300 shadow-lg shadow-stone-200 hover:shadow-amber-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isPending ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <>
                                Login
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <p className="text-sm text-stone-500 font-medium">
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="font-extrabold text-amber-700 hover:text-amber-800 transition-colors">
                            Sign up now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
