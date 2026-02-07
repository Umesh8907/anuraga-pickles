import api from '@/lib/axios';
import { User, Address } from '@/types';

const userService = {
    async updateProfile(data: { name: string }): Promise<User> {
        const response = await api.put<{ success: boolean; data: User }>('/users/me', data);
        return response.data.data;
    },

    async addAddress(data: Omit<Address, '_id'>): Promise<Address[]> {
        const response = await api.post<{ success: boolean; data: Address[] }>('/users/addresses', data);
        return response.data.data;
    },

    async updateAddress(addressId: string, data: Partial<Address>): Promise<Address[]> {
        const response = await api.put<{ success: boolean; data: Address[] }>(`/users/addresses/${addressId}`, data);
        return response.data.data;
    },

    async deleteAddress(addressId: string): Promise<Address[]> {
        const response = await api.delete<{ success: boolean; data: Address[] }>(`/users/addresses/${addressId}`);
        return response.data.data;
    },
};

export default userService;
