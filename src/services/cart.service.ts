import api from '@/lib/axios';
import { Cart } from '@/types';

const cartService = {
    async getCart(): Promise<Cart> {
        const response = await api.get<{ success: boolean; data: Cart }>('/cart');
        return response.data.data;
    },

    async addToCart(productId: string, variantId: string, quantity: number): Promise<Cart> {
        const response = await api.post<{ success: boolean; data: Cart }>('/cart', {
            productId,
            variantId,
            quantity
        });
        return response.data.data;
    },

    async removeFromCart(cartItemId: string): Promise<Cart> {
        const response = await api.delete<{ success: boolean; data: Cart }>(`/cart/${cartItemId}`);
        return response.data.data;
    },

    async updateCartItem(itemId: string, quantity: number): Promise<Cart> {
        const response = await api.put<{ success: boolean; data: Cart }>(`/cart/${itemId}`, { quantity });
        return response.data.data;
    },

    async updateCartItemVariant(itemId: string, newVariantId: string): Promise<Cart> {
        const response = await api.put<{ success: boolean; data: Cart }>(`/cart/${itemId}/variant`, { newVariantId });
        return response.data.data;
    },

    async syncCart(items: { productId: string; variantId: string; quantity: number }[]): Promise<Cart> {
        const response = await api.post<{ success: boolean; data: Cart }>('/cart/sync', { items });
        return response.data.data;
    },
};

export default cartService;
