import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import adminApi from '@/lib/adminAxios';
import { User, AuthResponse } from '@/types';

const adminAuthService = {
    async login(credentials: { phone: string; password: string; role?: string }): Promise<AuthResponse> {
        const response = await adminApi.post<{ success: boolean; data: AuthResponse }>('/auth/login', credentials);
        return response.data.data;
    },

    async logout(refreshToken: string): Promise<void> {
        await adminApi.post('/auth/logout', { refreshToken });
    },

    async getCurrentUser(): Promise<User> {
        const response = await adminApi.get<{ success: boolean; data: User }>('/users/me');
        return response.data.data;
    },
};

export const useAdminUser = () => {
    return useQuery({
        queryKey: ['adminUser'],
        queryFn: async () => {
            const token = localStorage.getItem('adminAccessToken');
            if (!token) return null;
            try {
                return await adminAuthService.getCurrentUser();
            } catch (error) {
                return null;
            }
        },
        retry: false,
    });
};

export const useAdminLogin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (credentials: { phone: string; password: string; role?: string }) => adminAuthService.login(credentials),
        onSuccess: (data) => {
            localStorage.setItem('adminAccessToken', data.accessToken);
            localStorage.setItem('adminRefreshToken', data.refreshToken);
            queryClient.setQueryData(['adminUser'], data.user);
            queryClient.invalidateQueries({ queryKey: ['adminUser'] });
        },
    });
};

export const useAdminLogout = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => {
            const refreshToken = localStorage.getItem('adminRefreshToken') || '';
            return adminAuthService.logout(refreshToken);
        },
        onSettled: () => {
            localStorage.removeItem('adminAccessToken');
            localStorage.removeItem('adminRefreshToken');
            queryClient.setQueryData(['adminUser'], null);
            queryClient.invalidateQueries({ queryKey: ['adminUser'] });
            window.location.href = '/admin/login';
        },
    });
};
