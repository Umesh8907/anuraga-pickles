import api from '@/lib/axios';
import { User, AuthResponse } from '@/types';

const authService = {
    async login(credentials: { phone: string; password: string }): Promise<AuthResponse> {
        const response = await api.post<{ success: boolean; data: AuthResponse }>('/auth/login', credentials);
        return response.data.data;
    },

    async register(data: { phone: string; password: string; name: string }): Promise<AuthResponse> {
        const response = await api.post<{ success: boolean; data: AuthResponse }>('/auth/register', data);
        return response.data.data;
    },

    async logout(refreshToken: string): Promise<void> {
        await api.post('/auth/logout', { refreshToken });
    },

    async getCurrentUser(): Promise<User> {
        const response = await api.get<{ success: boolean; data: User }>('/users/me');
        return response.data.data;
    },
};

export default authService;
