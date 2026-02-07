import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import cartService from '@/services/cart.service';

export const useCart = () => {
    return useQuery({
        queryKey: ['cart'],
        queryFn: () => cartService.getCart(),
    });
};

export const useAddToCart = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ productId, variantId, quantity }: { productId: string; variantId: string; quantity: number }) =>
            cartService.addToCart(productId, variantId, quantity),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });
};

export const useRemoveFromCart = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (cartItemId: string) => cartService.removeFromCart(cartItemId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });
};

export const useUpdateCartItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
            cartService.updateCartItem(itemId, quantity),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });
};
