import api from '@/lib/axios';
import { Product, PaginatedResponse } from '@/types';

const productService = {
    async getProducts(params?: any): Promise<PaginatedResponse<Product>> {
        const response = await api.get<PaginatedResponse<Product>>('/products', { params });
        return response.data;
    },

    async getProductBySlug(slug: string): Promise<Product> {
        const response = await api.get<{ success: boolean; data: Product }>(`/products/${slug}`);
        return response.data.data;
    },

    async getFeaturedProducts(): Promise<Product[]> {
        const response = await api.get<PaginatedResponse<Product>>('/products', {
            params: { limit: 4 }
        });
        return response.data.data;
    },
};

export default productService;
