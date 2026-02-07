import { useQuery } from '@tanstack/react-query';
import orderService from '@/services/order.service';

export const useOrders = () => {
    return useQuery({
        queryKey: ['orders'],
        queryFn: () => orderService.getMyOrders(),
    });
};

export const useOrder = (id: string) => {
    return useQuery({
        queryKey: ['order', id],
        queryFn: () => orderService.getOrderById(id),
        enabled: !!id,
    });
};
