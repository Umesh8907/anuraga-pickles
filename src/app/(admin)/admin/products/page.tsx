'use client'

import React, { useState } from 'react'
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    ExternalLink,
    Package,
    AlertCircle
} from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import { useDeleteProduct } from '@/hooks/useAdmin'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function AdminProducts() {
    const [search, setSearch] = useState('')
    const { data: products, isLoading, isError } = useProducts()
    const { mutate: deleteProduct } = useDeleteProduct()

    const filteredProducts = products?.data?.filter((p: any) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    )

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteProduct(id)
        }
    }

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-8 h-8 border-4 border-stone-200 border-t-amber-600 rounded-full animate-spin"></div>
        </div>
    )

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-stone-900 tracking-tight">Products</h1>
                    <p className="text-stone-500 font-medium">Manage your store's inventory and product details.</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-amber-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    <Plus className="w-5 h-5" />
                    Add New Product
                </Link>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
                    />
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-white border border-stone-200 rounded-xl font-bold text-stone-600 hover:bg-stone-50 transition-all">
                    <Filter className="w-5 h-5" />
                    Filters
                </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-stone-50 border-b border-stone-100">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black text-stone-500 uppercase tracking-widest">Product</th>
                                <th className="px-6 py-4 text-[10px] font-black text-stone-500 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-stone-500 uppercase tracking-widest">Inventory</th>
                                <th className="px-6 py-4 text-[10px] font-black text-stone-500 uppercase tracking-widest">Price</th>
                                <th className="px-6 py-4 text-[10px] font-black text-stone-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-50">
                            {filteredProducts?.map((product: any) => {
                                const totalStock = product.variants?.reduce((acc: number, v: any) => acc + v.stock, 0) || 0
                                const minPrice = Math.min(...product.variants?.map((v: any) => v.price) || [0])

                                return (
                                    <tr key={product._id} className="hover:bg-amber-50/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-stone-100 overflow-hidden border border-stone-200 flex-shrink-0">
                                                    <img
                                                        src={product.images?.[0] || 'https://placehold.co/400x400?text=No+Image'}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-black text-stone-900 truncate">{product.name}</p>
                                                    <p className="text-[10px] text-stone-500 font-bold uppercase tracking-tighter">{product.category || 'Pickle'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide",
                                                totalStock > 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                                            )}>
                                                {totalStock > 0 ? 'Active' : 'Out of Stock'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden max-w-[100px]">
                                                    <div
                                                        className={cn(
                                                            "h-full rounded-full transition-all duration-1000",
                                                            totalStock > 20 ? "bg-emerald-500" : totalStock > 0 ? "bg-amber-500" : "bg-red-500"
                                                        )}
                                                        style={{ width: `${Math.min(100, (totalStock / 50) * 100)}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-bold text-stone-600">{totalStock} in stock</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-stone-900 text-sm">
                                            Starting ₹{minPrice}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    href={`/products/${product.slug}`}
                                                    target="_blank"
                                                    className="p-2 text-stone-400 hover:text-blue-500 transition-colors"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/products/${product._id}/edit`}
                                                    className="p-2 text-stone-400 hover:text-amber-600 transition-colors"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    className="p-2 text-stone-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                {!filteredProducts?.length && (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="w-8 h-8 text-stone-300" />
                        </div>
                        <h3 className="text-lg font-bold text-stone-900 mb-1">No Products Found</h3>
                        <p className="text-stone-500 text-sm mb-6">Try adjusting your search or add a new product.</p>
                        <Link
                            href="/admin/products/new"
                            className="text-amber-600 font-bold uppercase tracking-widest text-xs hover:text-amber-700"
                        >
                            Add Your First Product
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
