'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminGuard from '@/components/admin/AdminGuard'
import { cn } from '@/lib/utils'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const isLoginPage = pathname === '/admin/login'

    return (
        <AdminGuard>
            <div className="flex min-h-screen bg-stone-50">
                {!isLoginPage && <AdminSidebar />}
                <main className={cn(
                    "flex-1",
                    !isLoginPage && "pl-64"
                )}>
                    <div className={cn(
                        "h-full",
                        !isLoginPage && "p-8 max-w-7xl mx-auto"
                    )}>
                        {children}
                    </div>
                </main>
            </div>
        </AdminGuard>
    )
}
