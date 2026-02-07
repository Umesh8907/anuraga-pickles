import api from '@/lib/axios';
import { Product, PaginatedResponse } from '@/types';

const productService = {
    async getProducts(params?: any): Promise<PaginatedResponse<Product>> {
        const response = await api.get<{ success: boolean; data: Product[]; pagination: any }>('/products', { params });
        return {
            success: response.data.success,
            data: response.data.data,
            pagination: response.data.pagination
        };
    },

    async getProductsByCollection(slug: string): Promise<Product[]> {
        const response = await api.get<{ success: boolean; data: Product[] }>(`/products/by-collection/${slug}`);
        return response.data.data;
    },

    async getProductBySlug(slug: string): Promise<Product> {
        const response = await api.get<{ success: boolean; data: Product }>(`/products/${slug}`);
        return response.data.data;
    },

    async getFeaturedProducts(): Promise<Product[]> {
        const response = await api.get<{ success: boolean; data: Product[]; pagination: any }>('/products', {
            params: { limit: 4 }
        });
        return response.data.data;
    },
};

export default productService;
