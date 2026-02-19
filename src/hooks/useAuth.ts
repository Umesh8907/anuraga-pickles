import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import authService from '@/services/auth.service';

export const useUser = () => {
    return useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) return null;
            try {
                return await authService.getCurrentUser();
            } catch (error) {
                return null;
            }
        },
        retry: false,
    });
};

export const useLogin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (credentials: { phone: string; password: string; role?: string }) => authService.login(credentials),
        onSuccess: (data) => {
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            queryClient.setQueryData(['user'], data.user);
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
    });
};

export const useRegister = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { phone: string; email: string; password: string; name: string; role?: string }) => authService.register(data),
        onSuccess: (data) => {
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            queryClient.setQueryData(['user'], data.user);
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => {
            const refreshToken = localStorage.getItem('refreshToken') || '';
            return authService.logout(refreshToken);
        },
        onSuccess: () => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            queryClient.setQueryData(['user'], null);
            queryClient.invalidateQueries({ queryKey: ['user'] });
            window.location.href = '/';
        },
    });
};
