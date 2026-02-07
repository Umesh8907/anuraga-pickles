export interface User {
    id: string;
    name: string;
    phone: string;
    role: 'USER' | 'ADMIN';
    createdAt?: string;
}

export interface ProductVariant {
    _id: string;
    label: string;
    price: number;
    mrp: number;
    stock: number;
    isDefault: boolean;
}

export interface Product {
    _id: string;
    name: string;
    slug: string;
    description: string;
    images: string[];
    variants: ProductVariant[];
    isActive: boolean;
    averageRating: number;
    reviewCount: number;
    collections?: any[]; // Populated collections
    createdAt: string;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        limit: number;
    };
}

export interface CartItem {
    _id: string;
    product: Product;
    variantId: string;
    variantLabel: string;
    price: number;
    quantity: number;
}

export interface Cart {
    _id: string;
    user: string;
    items: CartItem[];
    createdAt?: string;
    updatedAt?: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}


export interface ApiError {
    message: string;
    status: number;
}
