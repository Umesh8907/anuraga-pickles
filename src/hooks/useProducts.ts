import { useQuery } from '@tanstack/react-query';
import productService from '@/services/product.service';

export const useProducts = (params?: any, options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey: ['products', params],
        queryFn: () => productService.getProducts(params),
        enabled: options?.enabled !== false,
    });
};

export const useProduct = (slug: string) => {
    return useQuery({
        queryKey: ['product', slug],
        queryFn: () => productService.getProductBySlug(slug),
        enabled: !!slug,
    });
};

export const useFeaturedProducts = () => {
    return useQuery({
        queryKey: ['products', 'featured'],
        queryFn: () => productService.getFeaturedProducts(),
    });
};

export const useProductsByCollection = (slug: string) => {
    return useQuery({
        queryKey: ['products', 'collection', slug],
        queryFn: () => productService.getProductsByCollection(slug),
        enabled: !!slug,
    });
};
