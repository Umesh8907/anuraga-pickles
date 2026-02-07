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
    },

    async createCollection(data: any): Promise<Collection> {
        const response = await api.post<{ success: boolean; data: Collection }>('/collections', data);
        return response.data.data;
    },

    async updateCollection(id: string, data: any): Promise<Collection> {
        const response = await api.put<{ success: boolean; data: Collection }>(`/collections/${id}`, data);
        return response.data.data;
    },

    async deleteCollection(id: string): Promise<void> {
        await api.delete(`/collections/${id}`);
    }
};

export default collectionService;
