import { create } from 'zustand';

type AuthView = 'LOGIN' | 'REGISTER';

interface AuthModalState {
    isOpen: boolean;
    view: AuthView;
    openModal: (view?: AuthView) => void;
    closeModal: () => void;
    setView: (view: AuthView) => void;
}

export const useAuthModalStore = create<AuthModalState>((set) => ({
    isOpen: false,
    view: 'LOGIN',
    openModal: (view = 'LOGIN') => set({ isOpen: true, view }),
    closeModal: () => set({ isOpen: false }),
    setView: (view) => set({ view }),
}));
