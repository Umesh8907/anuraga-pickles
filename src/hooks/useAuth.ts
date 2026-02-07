import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import authService from '@/services/auth.service';

export const useUser = () => {
    return useQuery({
        queryKey: ['user'],
        queryFn: () => authService.getCurrentUser(),
        retry: false,
    });
};

export const useLogin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: authService.login,
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
        mutationFn: authService.register,
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
