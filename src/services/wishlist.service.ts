import api from '@/lib/axios';
import { Wishlist } from '@/types';

const wishlistService = {
    async getWishlist(): Promise<Wishlist> {
        const response = await api.get<{ success: boolean; data: Wishlist }>('/wishlist');
        return response.data.data;
    },

    async addToWishlist(productId: string): Promise<Wishlist> {
        const response = await api.post<{ success: boolean; data: Wishlist }>('/wishlist', { productId });
        return response.data.data;
    },

    async removeFromWishlist(productId: string): Promise<Wishlist> {
        const response = await api.delete<{ success: boolean; data: Wishlist }>(`/wishlist/${productId}`);
        return response.data.data;
    },
};

export default wishlistService;
