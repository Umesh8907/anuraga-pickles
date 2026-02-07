import api from '@/lib/axios';
import { Collection } from '@/types';

const collectionService = {
    async getCollections(): Promise<Collection[]> {
        const response = await api.get<{ success: boolean; data: Collection[] }>('/collections');
        return response.data.data;
    },

    async getCollectionBySlug(slug: string): Promise<Collection> {
        const response = await api.get<{ success: boolean; data: Collection }>(`/collections/${slug}`);
        return response.data.data;
    }
};

export default collectionService;
