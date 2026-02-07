import api from '@/lib/axios';
import adminApi from '@/lib/adminAxios';
import { Product, Order, User, Collection } from '@/types';

export interface DashboardStats {
    counts: {
        users: number;
        products: number;
        orders: number;
        revenue: number;
    };
    orderStatusBreakdown: { _id: string; count: number }[];
    recentOrders: Partial<Order>[];
    lowStockProducts: Partial<Product>[];
    salesGraph: { _id: string; dailyRevenue: number; orderCount: number }[];
    topProducts: { _id: string; name: string; totalSold: number; revenue: number }[];
    revenueByCollection: { _id: string; totalRevenue: number }[];
}

const adminService = {
    async getDashboardStats(): Promise<DashboardStats> {
        const response = await adminApi.get<DashboardStats>('/admin/stats');
        return response.data;
    },

    async getProductById(id: string): Promise<Product> {
        const response = await adminApi.get<{ success: boolean; data: Product }>(`/products/id/${id}`);
        return response.data.data;
    },

    async getUsers(params: { page?: number; limit?: number; search?: string } = {}): Promise<{ users: User[]; totalPages: number; currentPage: number }> {
        const response = await adminApi.get<{ users: User[]; totalPages: number; currentPage: number }>('/admin/users', { params });
        // Filter out ADMIN users from the list so admins don't see other admins or themselves
        const filteredUsers = response.data.users.filter(user => user.role !== 'ADMIN');
        return {
            ...response.data,
            users: filteredUsers
        };
    },

    async updateUserStatus(userId: string, status: string): Promise<User> {
        const response = await adminApi.patch<User>(`/admin/users/${userId}/status`, { status });
        return response.data;
    },

    async createProduct(data: any): Promise<Product> {
        const response = await adminApi.post<{ success: boolean; data: Product }>('/products', data);
        return response.data.data;
    },

    async updateProduct(id: string, data: any): Promise<Product> {
        const response = await adminApi.put<{ success: boolean; data: Product }>(`/products/${id}`, data);
        return response.data.data;
    },

    async deleteProduct(id: string): Promise<void> {
        await adminApi.delete(`/products/${id}`);
    },

    async getAllOrders(): Promise<Order[]> {
        const response = await adminApi.get<{ success: boolean; data: { orders: Order[]; totalPages: number; currentPage: number } }>('/orders/admin/all?limit=100');
        return response.data.data.orders;
    },

    async updateOrderStatus(orderId: string, status: string): Promise<Order> {
        const response = await adminApi.patch<{ success: boolean; data: Order }>(`/orders/${orderId}/status`, { status });
        return response.data.data;
    }
};

export default adminService;
