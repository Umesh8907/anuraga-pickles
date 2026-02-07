import { create } from 'zustand';
import { Cart } from '@/types';

// The store now mainly acts as a client-side cache or UI state holder
// Logic is shifted to React Query for server state
interface CartState {
    isOpen: boolean;
    toggleCart: () => void;
    // We can keep these for optimistic UI or local-only actions if needed
    // or simply remove them if relying purely on React Query cache
}

export const useCartStore = create<CartState>((set) => ({
    isOpen: false,
    toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
}));
