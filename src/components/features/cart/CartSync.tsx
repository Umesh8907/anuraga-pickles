'use client'

import { useSyncCart } from '@/hooks/useSyncCart'

export default function CartSync() {
    useSyncCart();
    return null;
}
