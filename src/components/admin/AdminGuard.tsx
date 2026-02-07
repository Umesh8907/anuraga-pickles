'use client'

import React, { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useUser } from '@/hooks/useAuth'

interface AdminGuardProps {
    children: React.ReactNode
}

import { useAdminUser } from '@/hooks/useAdminAuth'

export default function AdminGuard({ children }: AdminGuardProps) {
    const { data: user, isLoading } = useAdminUser()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        // If loading, do nothing yet
        if (isLoading) return

        const isLoginPage = pathname === '/admin/login'

        // If not authenticated or not admin
        if (!user || user.role !== 'ADMIN') {
            // Redirect to login if trying to access other admin pages
            if (!isLoginPage) {
                router.push('/admin/login')
            }
        }
        // If authenticated as admin and trying to access login page
        else if (isLoginPage) {
            router.push('/admin/dashboard')
        }
    }, [user, isLoading, router, pathname])

    // While loading authentication state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-stone-900">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-stone-700 border-t-amber-500 rounded-full animate-spin"></div>
                    <span className="text-sm font-bold text-stone-500 uppercase tracking-widest">Verifying Authorization...</span>
                </div>
            </div>
        )
    }

    // Determine if we should show content
    const isLoginPage = pathname === '/admin/login'

    // Allow rendering if:
    // 1. It's the login page (and user is not yet authenticated/authorized - effect handles redirect if they are)
    // 2. User is authenticated and is an ADMIN
    if (isLoginPage || (user && user.role === 'ADMIN')) {
        return <>{children}</>
    }

    return null
}
