'use client'

import { useEffect } from 'react';
import { useUser } from '@/hooks/useAuth';
import guestCartService from '@/services/guestCart.service';
import cartService from '@/services/cart.service';
import { useQueryClient } from '@tanstack/react-query';

export const useSyncCart = () => {
    const { data: user } = useUser();
    const queryClient = useQueryClient();

    useEffect(() => {
        const sync = async () => {
            if (user) {
                const guestCart = await guestCartService.getCart();
                if (guestCart.items.length > 0) {
                    try {
                        const itemsToSync = guestCart.items.map(item => ({
                            productId: item.product._id,
                            variantId: item.variantId,
                            quantity: item.quantity
                        }));

                        await cartService.syncCart(itemsToSync);
                        guestCartService.clearCart();

                        // Refresh the cart data
                        queryClient.invalidateQueries({ queryKey: ['cart'] });
                    } catch (error) {
                        console.error('Failed to sync guest cart:', error);
                    }
                }
            }
        };

        sync();
    }, [user, queryClient]);
};
