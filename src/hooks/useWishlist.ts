import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import wishlistService from '@/services/wishlist.service';
import { toast } from 'sonner';

export const useWishlist = () => {
    return useQuery({
        queryKey: ['wishlist'],
        queryFn: () => wishlistService.getWishlist(),
        retry: false,
    });
};


export const useAddToWishlist = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (productId: string) => wishlistService.addToWishlist(productId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
            toast.success('Added to wishlist');
        },
        onError: () => {
            toast.error('Failed to add to wishlist');
        }
    });
};

export const useRemoveFromWishlist = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (productId: string) => wishlistService.removeFromWishlist(productId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
            toast.success('Removed from wishlist');
        },
        onError: () => {
            toast.error('Failed to remove from wishlist');
        }
    });
};
