import api from '@/lib/axios';
import { Order } from '@/types';

const orderService = {
    async getMyOrders(): Promise<Order[]> {
        const response = await api.get<{ success: boolean; data: Order[] }>('/orders');
        return response.data.data;
    },

    async getOrderById(id: string): Promise<Order> {
        const response = await api.get<{ success: boolean; data: Order }>(`/orders/${id}`);
        return response.data.data;
    },
};

export default orderService;
