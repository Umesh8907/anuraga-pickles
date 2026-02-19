'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Phone, Lock, User, ArrowRight, Loader2, AlertCircle, CheckCircle2, Mail, Eye, EyeOff } from 'lucide-react'
import { useRegister } from '@/hooks/useAuth'

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const { mutate: register, isPending } = useRegister();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMessage('')

        if (!name || !phone || !email || !password || !confirmPassword) {
            setErrorMessage('All fields are required');
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        if (phone.length < 10) {
            setErrorMessage('Please enter a valid phone number');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorMessage('Please enter a valid email address');
            return;
        }

        register(
            { name, phone, email, password },
            {
                onSuccess: () => {
                    router.push('/(dashboard)/account');
                },
                onError: (error: any) => {
                    setErrorMessage(error?.response?.data?.message || 'Registration failed. This phone or email may already be registered.');
                }
            }
        );
    }

    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-sm border border-stone-100 italic">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight not-italic">Join Our Kitchen</h2>
                    <p className="mt-3 text-sm text-stone-500 font-medium">
                        Create an account to start spicing up your meals with our handcrafted Andhra pickles.
                    </p>
                </div>

                {errorMessage && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 text-sm not-italic">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p>{errorMessage}</p>
                    </div>
                )}

                <form className="mt-8 space-y-6 not-italic" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-bold text-stone-700 mb-2 ml-1">
                                Full Name
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400 group-focus-within:text-amber-600 transition-colors">
                                    <User className="h-5 w-5" />
                                </div>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium"
                                    placeholder="Anuraga Pickles"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-stone-700 mb-2 ml-1">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400 group-focus-within:text-amber-600 transition-colors">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium"
                                    placeholder="hello@anuragapickles.com"
                                />
                            </div>
                        </div>

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
                                    className="block w-full pl-11 pr-4 py-3 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium"
                                    placeholder="10-digit mobile number"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-bold text-stone-700 mb-2 ml-1">
                                Set Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400 group-focus-within:text-amber-600 transition-colors">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-11 pr-11 py-3 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium"
                                    placeholder="Create a strong password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-bold text-stone-700 mb-2 ml-1">
                                Confirm Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400 group-focus-within:text-amber-600 transition-colors">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="block w-full pl-11 pr-11 py-3 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium"
                                    placeholder="Confirm your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start gap-2 text-xs text-stone-500 bg-stone-50 p-4 rounded-xl border border-stone-100 italic">
                            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                            <span>By signing up, you agree to receive order notifications and updates on WhatsApp.</span>
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="group relative w-full flex justify-center py-4 px-4 border border-transparent rounded-xl text-white bg-amber-600 hover:bg-amber-700 font-bold text-base transition-all duration-300 shadow-xl shadow-amber-50 hover:shadow-amber-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className="text-center mt-6">
                    <p className="text-sm text-stone-500 font-medium">
                        Already part of the family?{' '}
                        <Link href="/login" className="font-extrabold text-amber-700 hover:text-amber-800 transition-colors not-italic">
                            Log in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
