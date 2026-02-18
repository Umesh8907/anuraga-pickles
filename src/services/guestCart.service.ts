import { Cart, CartItem, Product } from '@/types';

const GUEST_CART_KEY = 'anuraga_guest_cart';

const getGuestCart = (): Cart => {
    if (typeof window === 'undefined') return { _id: 'guest', user: 'guest', items: [] };
    const saved = localStorage.getItem(GUEST_CART_KEY);
    if (!saved) return { _id: 'guest', user: 'guest', items: [] };
    try {
        return JSON.parse(saved);
    } catch (e) {
        return { _id: 'guest', user: 'guest', items: [] };
    }
};

const saveGuestCart = (cart: Cart) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
};

const guestCartService = {
    async getCart(): Promise<Cart> {
        return getGuestCart();
    },

    async addToCart(product: Product, variantId: string, quantity: number): Promise<Cart> {
        const cart = getGuestCart();
        const variant = product.variants.find(v => v._id === variantId);
        if (!variant) throw new Error('Invalid variant');

        const existingIndex = cart.items.findIndex(
            i => i.product._id === product._id && i.variantId === variantId
        );

        if (existingIndex > -1) {
            cart.items[existingIndex].quantity = Math.min(
                cart.items[existingIndex].quantity + quantity,
                variant.stock
            );
        } else {
            const newItem: CartItem = {
                _id: Math.random().toString(36).substr(2, 9),
                product: product,
                variantId: variantId,
                variantLabel: variant.label,
                price: variant.price,
                quantity: Math.min(quantity, variant.stock)
            };
            cart.items.push(newItem);
        }

        saveGuestCart(cart);
        return cart;
    },

    async removeFromCart(cartItemId: string): Promise<Cart> {
        const cart = getGuestCart();
        cart.items = cart.items.filter(i => i._id !== cartItemId);
        saveGuestCart(cart);
        return cart;
    },

    async updateCartItem(itemId: string, quantity: number): Promise<Cart> {
        const cart = getGuestCart();
        const item = cart.items.find(i => i._id === itemId);
        if (item) {
            const variant = item.product.variants.find(v => v._id === item.variantId);
            if (variant) {
                // Ensure we don't exceed stock
                item.quantity = Math.min(quantity, variant.stock);
            }
        }
        saveGuestCart(cart);
        return cart;
    },

    async updateCartItemVariant(itemId: string, newVariantId: string): Promise<Cart> {
        const cart = getGuestCart();
        const itemIndex = cart.items.findIndex(i => i._id === itemId);
        if (itemIndex === -1) return cart;

        const item = cart.items[itemIndex];
        const product = item.product;
        // In local mock, product object is nested.
        // We need to find the variant in the product object.
        // For guest cart, the product object is stored in the item.
        const newVariant = product.variants.find(v => v._id === newVariantId);
        if (!newVariant) return cart;

        // Check if target variant already exists
        const existingTargetIndex = cart.items.findIndex(
            i => i.product._id === product._id &&
                i.variantId === newVariantId &&
                i._id !== itemId
        );

        if (existingTargetIndex > -1) {
            // MERGE
            const targetItem = cart.items[existingTargetIndex];
            const newQuantity = targetItem.quantity + item.quantity;
            targetItem.quantity = Math.min(newQuantity, newVariant.stock);
            cart.items.splice(itemIndex, 1);
        } else {
            // UPDATE
            item.variantId = newVariant._id;
            item.variantLabel = newVariant.label;
            item.price = newVariant.price;
            // Re-check stock constraint for new variant
            if (item.quantity > newVariant.stock) {
                item.quantity = newVariant.stock;
            }
        }

        saveGuestCart(cart);
        return cart;
    },

    clearCart() {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(GUEST_CART_KEY);
    }
};

export default guestCartService;
