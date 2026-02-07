import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import cartService from '@/services/cart.service';
import guestCartService from '@/services/guestCart.service';
import { useUser } from '@/hooks/useAuth';
import { Product } from '@/types';
import { toast } from 'sonner';

export const useCart = () => {
    const { data: user } = useUser();
    return useQuery({
        queryKey: ['cart', !!user],
        queryFn: () => user ? cartService.getCart() : guestCartService.getCart(),
    });
};


export const useAddToCart = () => {
    const queryClient = useQueryClient();
    const { data: user } = useUser();

    return useMutation({
        mutationFn: ({ product, variantId, quantity }: { product: Product; variantId: string; quantity: number }) =>
            user
                ? cartService.addToCart(product._id, variantId, quantity)
                : guestCartService.addToCart(product, variantId, quantity),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            toast.success('Added to cart');
        },
        onError: () => {
            toast.error('Failed to add to cart');
        }
    });
};

export const useRemoveFromCart = () => {
    const queryClient = useQueryClient();
    const { data: user } = useUser();

    return useMutation({
        mutationFn: (cartItemId: string) =>
            user ? cartService.removeFromCart(cartItemId) : guestCartService.removeFromCart(cartItemId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            toast.success('Removed from cart');
        },
        onError: () => {
            toast.error('Failed to remove from cart');
        }
    });
};

export const useUpdateCartItem = () => {
    const queryClient = useQueryClient();
    const { data: user } = useUser();

    return useMutation({
        mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
            user ? cartService.updateCartItem(itemId, quantity) : guestCartService.updateCartItem(itemId, quantity),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            toast.success('Cart updated');
        },
        onError: () => {
            toast.error('Failed to update cart');
        }
    });
};
