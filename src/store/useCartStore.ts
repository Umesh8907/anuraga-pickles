import { create } from 'zustand'

interface CartState {
    items: any[]
    addItem: (item: any) => void
    removeItem: (id: string) => void
    clearCart: () => void
}

export const useCartStore = create<CartState>((set) => ({
    items: [],
    addItem: (item) => set((state) => ({ items: [...state.items, item] })),
    removeItem: (id) => set((state) => ({ items: state.items.filter((i: any) => i.id !== id) })),
    clearCart: () => set({ items: [] }),
}))
