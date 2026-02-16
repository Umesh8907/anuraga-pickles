'use client'

import React, { useState } from 'react'
import { useProductsByCollection, useProducts } from '@/hooks/useProducts'
import ProductCard from '@/components/features/product/ProductCard'
import { Loader2 } from 'lucide-react'

interface CollectionClientProps {
    slug: string;
}

export default function CollectionClient({ slug }: CollectionClientProps) {
    const isAllProducts = slug === 'all-products';

    const { data: collectionProducts, isLoading: isColLoading } = useProductsByCollection(isAllProducts ? '' : slug);
    const { data: allProductsData, isLoading: isAllLoading } = useProducts({ limit: 50 }, { enabled: isAllProducts });

    const isLoading = isAllProducts ? isAllLoading : isColLoading;
    const products = isAllProducts ? allProductsData?.data : collectionProducts;

    // State for filters
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);

    // Get available categories from products
    const availableCategories = Array.from(new Set(
        products?.flatMap(p => 
            p.collections?.map((col: any) => 
                typeof col === 'string' ? col : col.name
            ) || []
        ) || []
    ));

    // Filter products based on selected filters
    const filteredProducts = products?.filter(product => {
        // Category filter
        if (selectedCategory && product.collections) {
            const collectionMatch = product.collections.some((col: any) => 
                typeof col === 'string' ? col === selectedCategory : col.name === selectedCategory
            );
            if (!collectionMatch) return false;
        }
        
        // Price range filter
        if (selectedPriceRange && product.variants?.length > 0) {
            const variant = product.variants[0];
            const price = variant.price;
            switch (selectedPriceRange) {
                case '0-200':
                    return price >= 0 && price <= 200;
                case '200-400':
                    return price > 200 && price <= 400;
                case '400-600':
                    return price > 400 && price <= 600;
                case '600+':
                    return price > 600;
                default:
                    return true;
            }
        }
        
        return true;
    }) || [];

    // Helper functions for filter updates
    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category === "all" ? null : category);
    };

    const handlePriceRangeChange = (price: string | null) => {
        setSelectedPriceRange(price === "all" ? null : price);
    };

    if (isLoading) {
        return (
            <div className="py-24 text-center flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-amber-600" />
                <p className="text-stone-500 font-medium italic">Finding the best picks for you...</p>
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="py-24 text-center">
                <p className="text-stone-500 font-medium italic">No products found in this collection yet.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fbf6ee]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-10 py-8 lg:py-12">
                {/* ================= MOBILE FILTERS (Select) ================= */}
                <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
                    {/* Category Select */}
                    <div>
                        <label className="block text-sm font-semibold mb-1 text-stone-800">
                            Category
                        </label>
                        <select
                            value={selectedCategory ?? "all"}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-700 bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        >
                            <option value="all">All Products</option>
                            {availableCategories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Price Select */}
                    <div>
                        <label className="block text-sm font-semibold mb-1 text-stone-800">
                            Price Range
                        </label>
                        <select
                            value={selectedPriceRange ?? "all"}
                            onChange={(e) => handlePriceRangeChange(e.target.value)}
                            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-700 bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        >
                            <option value="all">All Prices</option>
                            <option value="0-200">₹0 - ₹200</option>
                            <option value="200-400">₹200 - ₹400</option>
                            <option value="400-600">₹400 - ₹600</option>
                            <option value="600+">₹600+</option>
                        </select>
                    </div>
                </div>

                {/* ================= MAIN LAYOUT ================= */}
                <div className="flex flex-col md:flex-row gap-8 w-full">
                    {/* ================= SIDEBAR (Checkbox for md+) ================= */}
                    <aside className="hidden md:block md:w-64 md:flex-shrink-0">
                        <div className="rounded-2xl border bg-white p-5 shadow-sm h-fit">
                            {/* CATEGORY CHECKBOX */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold mb-3 text-stone-800">
                                    Categories
                                </h3>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm cursor-pointer text-stone-700">
                                        <input
                                            type="checkbox"
                                            checked={!selectedCategory}
                                            onChange={() => handleCategoryChange("all")}
                                            className="text-amber-600 focus:ring-amber-500"
                                        />
                                        All Products
                                    </label>
                                    {availableCategories.map((cat) => (
                                        <label
                                            key={cat}
                                            className="flex items-center gap-2 text-sm cursor-pointer text-stone-700"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedCategory === cat}
                                                onChange={() => handleCategoryChange(cat)}
                                                className="text-amber-600 focus:ring-amber-500"
                                            />
                                            {cat}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* PRICE CHECKBOX */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold mb-3 text-stone-800">
                                    Price Range
                                </h3>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm cursor-pointer text-stone-700">
                                        <input
                                            type="checkbox"
                                            checked={!selectedPriceRange}
                                            onChange={() => handlePriceRangeChange("all")}
                                            className="text-amber-600 focus:ring-amber-500"
                                        />
                                        All Prices
                                    </label>
                                    <label className="flex items-center gap-2 text-sm cursor-pointer text-stone-700">
                                        <input
                                            type="checkbox"
                                            checked={selectedPriceRange === "0-200"}
                                            onChange={() => handlePriceRangeChange("0-200")}
                                            className="text-amber-600 focus:ring-amber-500"
                                        />
                                        ₹0 - ₹200
                                    </label>
                                    <label className="flex items-center gap-2 text-sm cursor-pointer text-stone-700">
                                        <input
                                            type="checkbox"
                                            checked={selectedPriceRange === "200-400"}
                                            onChange={() => handlePriceRangeChange("200-400")}
                                            className="text-amber-600 focus:ring-amber-500"
                                        />
                                        ₹200 - ₹400
                                    </label>
                                    <label className="flex items-center gap-2 text-sm cursor-pointer text-stone-700">
                                        <input
                                            type="checkbox"
                                            checked={selectedPriceRange === "400-600"}
                                            onChange={() => handlePriceRangeChange("400-600")}
                                            className="text-amber-600 focus:ring-amber-500"
                                        />
                                        ₹400 - ₹600
                                    </label>
                                    <label className="flex items-center gap-2 text-sm cursor-pointer text-stone-700">
                                        <input
                                            type="checkbox"
                                            checked={selectedPriceRange === "600+"}
                                            onChange={() => handlePriceRangeChange("600+")}
                                            className="text-amber-600 focus:ring-amber-500"
                                        />
                                        ₹600+
                                    </label>
                                </div>
                            </div>

                            {/* RECENT VIEWED */}
                            <div>
                                <h3 className="text-sm font-semibold mb-3 text-stone-800">
                                    Recent Viewed
                                </h3>
                                <div className="space-y-4">
                                    {filteredProducts.slice(0, 3).map((product) => (
                                        <div 
                                            key={product._id}
                                            className="flex gap-3 rounded-lg border border-stone-200 p-2 hover:bg-stone-50 transition cursor-pointer"
                                        >
                                            <div className="relative h-14 w-14 rounded-md bg-[#FFE2C4] flex-shrink-0">
                                                <div className="absolute inset-0 flex items-center justify-center text-stone-400">
                                                    <span className="text-xs">No Image</span>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-medium line-clamp-2 text-stone-700">
                                                    {product.name}
                                                </p>
                                                <p className="mt-1 text-sm font-semibold text-stone-800">
                                                    ₹{product.variants?.[0]?.price || 0}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* ================= PRODUCT GRID ================= */}
                    <div className="flex-1 min-w-0 overflow-hidden">
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>

                        {filteredProducts.length === 0 && (
                            <div className="py-14 text-center text-zinc-500">
                                No products found matching your criteria.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
