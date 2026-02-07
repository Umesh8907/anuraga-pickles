import { useQuery } from '@tanstack/react-query';
import collectionService from '@/services/collection.service';

export const useCollections = () => {
    return useQuery({
        queryKey: ['collections'],
        queryFn: () => collectionService.getCollections(),
    });
};

export const useCollection = (slug: string) => {
    return useQuery({
        queryKey: ['collection', slug],
        queryFn: () => collectionService.getCollectionBySlug(slug),
        enabled: !!slug,
    });
};
