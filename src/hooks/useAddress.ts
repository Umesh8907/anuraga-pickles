import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import userService from '@/services/user.service';
import { Address } from '@/types';
import { useUser } from './useAuth';

export const useAddress = () => {
    const queryClient = useQueryClient();
    const { data: user } = useUser();

    // We rely on the useUser hook which fetches the user profile containing addresses.
    // When addresses change, we invalidate the 'user' query to refetch.

    const addAddress = useMutation({
        mutationFn: (data: Omit<Address, '_id'>) => userService.addAddress(data),
        onSuccess: () => {
            toast.success('Address added successfully');
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to add address');
        },
    });

    const updateAddress = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Address> }) =>
            userService.updateAddress(id, data),
        onSuccess: () => {
            toast.success('Address updated successfully');
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update address');
        },
    });

    const deleteAddress = useMutation({
        mutationFn: (id: string) => userService.deleteAddress(id),
        onSuccess: () => {
            toast.success('Address deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete address');
        },
    });

    return {
        addresses: user?.addresses || [],
        addAddress,
        updateAddress,
        deleteAddress,
    };
};

