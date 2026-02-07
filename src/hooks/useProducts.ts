import { useQuery } from '@tanstack/react-query';
import productService from '@/services/product.service';

export const useProducts = (params?: any, options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey: ['products', params],
        queryFn: () => productService.getProducts(params),
        enabled: options?.enabled !== false,
    });
};

import { Product } from '@/types';

export const useProduct = (slug: string, initialData?: Product | null) => {
    return useQuery<Product>({
        queryKey: ['product', slug],
        queryFn: () => productService.getProductBySlug(slug),
        enabled: !!slug,
        initialData: initialData as Product // Cast if necessary, or let it infer if types match
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
