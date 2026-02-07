export interface Address {
    _id: string;
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
}

export interface User {
    _id: string;
    id?: string;
    name: string;
    phone: string;
    role: 'USER' | 'ADMIN';
    addresses?: Address[];
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

export interface Collection {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    bannerImage?: string;
    isActive: boolean;
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

export interface OrderItem {
    _id: string;
    product: Product;
    variant?: string;
    name: string;
    image?: string;
    price: number;
    quantity: number;
    total: number;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED';

export interface Order {
    _id: string;
    user: string;
    items: OrderItem[];
    shippingAddress: {
        name: string;
        addressLine1: string;
        city: string;
        state: string;
        pincode: string;
        phone: string;
    };
    paymentMethod: 'COD' | 'ONLINE';
    paymentStatus: PaymentStatus;
    orderStatus: OrderStatus;
    totalAmount: number;
    transactionId?: string;
    history: {
        status: string;
        note?: string;
        timestamp: string;
    }[];
    createdAt: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}


export interface Wishlist {
    _id: string;
    user: string;
    products: Product[];
    createdAt?: string;
    updatedAt?: string;
}

export interface ApiError {
    message: string;
    status: number;
}
