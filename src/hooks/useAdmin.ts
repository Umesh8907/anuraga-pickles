import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import adminService from '@/services/admin.service';
import collectionService from '@/services/collection.service';

export const useAdminStats = () => {
    return useQuery({
        queryKey: ['admin-stats'],
        queryFn: () => adminService.getDashboardStats(),
    });
};

export const useAdminUsers = (params: { page?: number; limit?: number; search?: string } = {}) => {
    return useQuery({
        queryKey: ['admin-users', params],
        queryFn: () => adminService.getUsers(params),
    });
};

export const useProductById = (id: string) => {
    return useQuery({
        queryKey: ['admin-product', id],
        queryFn: () => adminService.getProductById(id),
        enabled: !!id,
    });
};

export const useUpdateUserStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, status }: { userId: string; status: string }) =>
            adminService.updateUserStatus(userId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        },
    });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: adminService.createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
        },
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            adminService.updateProduct(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['product'] });
        },
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: adminService.deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
        },
    });
};

export const useAllOrders = () => {
    return useQuery({
        queryKey: ['admin-orders'],
        queryFn: () => adminService.getAllOrders(),
    });
};

import { toast } from 'sonner';

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
            adminService.updateOrderStatus(orderId, status),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
            queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
            toast.success(`Order status updated to ${variables.status}`);
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || error.message || 'Failed to update order status';
            toast.error(message);
        },
    });
};

export const useCreateCollection = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: collectionService.createCollection,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['collections'] });
        },
    });
};

export const useUpdateCollection = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            collectionService.updateCollection(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['collections'] });
        },
    });
};

export const useDeleteCollection = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: collectionService.deleteCollection,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['collections'] });
        },
    });
};
