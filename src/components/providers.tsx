'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import CartSync from './features/cart/CartSync'
import { SocketProvider } from '@/providers/SocketProvider'

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60 * 5, // 5 minutes
                refetchOnWindowFocus: false,
                retry: 1,
            },
        },
    }))

    return (
        <QueryClientProvider client={queryClient}>
            <SocketProvider>
                <CartSync />
                {children}
            </SocketProvider>
        </QueryClientProvider>
    )
}
