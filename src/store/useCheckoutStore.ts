import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CheckoutState {
    selectedAddressId: string | null;
    paymentMethod: 'COD' | 'ONLINE';
    orderNote: string;
    isAddressConfirmed: boolean;

    setSelectedAddressId: (id: string) => void;
    setPaymentMethod: (method: 'COD' | 'ONLINE') => void;
    setOrderNote: (note: string) => void;
    confirmAddress: () => void;
    resetCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutState>()(
    persist(
        (set) => ({
            selectedAddressId: null,
            paymentMethod: 'ONLINE',
            orderNote: '',
            isAddressConfirmed: false,

            setSelectedAddressId: (id) => set({ selectedAddressId: id }),
            setPaymentMethod: (method) => set({ paymentMethod: method }),
            setOrderNote: (note) => set({ orderNote: note }),
            confirmAddress: () => set({ isAddressConfirmed: true }),
            resetCheckout: () => set({
                selectedAddressId: null,
                paymentMethod: 'ONLINE',
                orderNote: '',
                isAddressConfirmed: false
            }),
        }),
        {
            name: 'checkout-storage',
        }
    )
);
