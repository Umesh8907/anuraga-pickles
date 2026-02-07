'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
    ChevronLeft,
    Save,
    Plus,
    Trash2,
    Image as ImageIcon,
    Info,
    CheckCircle2,
    Package,
    Layers
} from 'lucide-react'
import Link from 'next/link'
import { useUpdateProduct, useProductById } from '@/hooks/useAdmin'
import { useCollections } from '@/hooks/useCollections'
import { cn } from '@/lib/utils'

export default function EditProduct() {
    const router = useRouter()
    const params = useParams()
    const productId = params?.id as string

    const { data: product, isLoading: isLoadingProduct } = useProductById(productId)
    const { mutate: updateProduct, isPending } = useUpdateProduct()
    const { data: collections } = useCollections()

    const [formData, setFormData] = useState<any>(null)

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                description: product.description,
                images: product.images.length > 0 ? product.images : [''],
                variants: product.variants,
                collections: product.collections?.map((c: any) => typeof c === 'string' ? c : c._id) || [],
                isActive: product.isActive
            })
        }
    }, [product])

    const handleAddVariant = () => {
        setFormData({
            ...formData,
            variants: [
                ...formData.variants,
                { label: '', price: 0, mrp: 0, stock: 0, isDefault: false }
            ]
        })
    }

    const handleRemoveVariant = (index: number) => {
        const newVariants = formData.variants.filter((_v: any, i: number) => i !== index)
        if (newVariants.length > 0 && !newVariants.some((v: any) => v.isDefault)) {
            newVariants[0].isDefault = true
        }
        setFormData({ ...formData, variants: newVariants })
    }

    const handleVariantChange = (index: number, field: string, value: any) => {
        const newVariants = [...formData.variants]
        newVariants[index] = { ...newVariants[index], [field]: value }

        if (field === 'isDefault' && value === true) {
            newVariants.forEach((v, i) => {
                if (i !== index) v.isDefault = false
            })
        }

        setFormData({ ...formData, variants: newVariants })
    }

    const handleAddImage = () => {
        setFormData({ ...formData, images: [...formData.images, ''] })
    }

    const handleImageChange = (index: number, value: string) => {
        const newImages = [...formData.images]
        newImages[index] = value
        setFormData({ ...formData, images: newImages })
    }

    const handleRemoveImage = (index: number) => {
        setFormData({ ...formData, images: formData.images.filter((_img: string, i: number) => i !== index) })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name || !formData.description || formData.variants.length === 0) {
            alert('Please fill in all required fields.')
            return
        }

        updateProduct({ id: productId, data: formData }, {
            onSuccess: () => {
                router.push('/admin/products')
            },
            onError: (error: any) => {
                alert(error.message || 'Failed to update product')
            }
        })
    }

    if (isLoadingProduct || !formData) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-8 h-8 border-4 border-stone-200 border-t-amber-600 rounded-full animate-spin"></div>
        </div>
    )

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="flex items-center justify-between">
                <Link
                    href="/admin/products"
                    className="flex items-center gap-2 text-stone-500 hover:text-stone-900 font-bold transition-colors group"
                >
                    <div className="p-2 bg-white rounded-lg border border-stone-200 group-hover:border-stone-400">
                        <ChevronLeft className="w-4 h-4" />
                    </div>
                    Back to Products
                </Link>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleSubmit}
                        disabled={isPending}
                        className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-amber-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {isPending ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Save className="w-5 h-5" />
                        )}
                        Update Product
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Info */}
                    <section className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm space-y-6">
                        <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
                            <Info className="w-5 h-5 text-amber-600" />
                            General Information
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-black text-stone-500 uppercase tracking-widest mb-2">Product Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Classic Mango Pickle"
                                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-stone-500 uppercase tracking-widest mb-2">Description</label>
                                <textarea
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Tell the story of this pickle..."
                                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Variants */}
                    <section className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
                                <Package className="w-5 h-5 text-amber-600" />
                                Sizes & Pricing
                            </h2>
                            <button
                                onClick={handleAddVariant}
                                className="text-xs font-black text-amber-600 uppercase tracking-widest flex items-center gap-1 hover:text-amber-700"
                            >
                                <Plus className="w-4 h-4" />
                                Add Size
                            </button>
                        </div>

                        <div className="space-y-4">
                            {formData.variants.map((variant: any, index: number) => (
                                <div key={index} className="p-6 bg-stone-50 rounded-2xl border border-stone-200 relative group animate-in slide-in-from-right-2 duration-300">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="col-span-2 md:col-span-1">
                                            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Label</label>
                                            <input
                                                type="text"
                                                placeholder="250g"
                                                value={variant.label}
                                                onChange={(e) => handleVariantChange(index, 'label', e.target.value)}
                                                className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm font-bold focus:border-amber-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Price (₹)</label>
                                            <input
                                                type="number"
                                                value={variant.price}
                                                onChange={(e) => handleVariantChange(index, 'price', Number(e.target.value))}
                                                className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm font-bold focus:border-amber-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">MRP (₹)</label>
                                            <input
                                                type="number"
                                                value={variant.mrp}
                                                onChange={(e) => handleVariantChange(index, 'mrp', Number(e.target.value))}
                                                className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm font-bold focus:border-amber-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Stock</label>
                                            <input
                                                type="number"
                                                value={variant.stock}
                                                onChange={(e) => handleVariantChange(index, 'stock', Number(e.target.value))}
                                                className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm font-bold focus:border-amber-500 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between">
                                        <button
                                            onClick={() => handleVariantChange(index, 'isDefault', !variant.isDefault)}
                                            className={cn(
                                                "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors",
                                                variant.isDefault ? "text-emerald-600" : "text-stone-400 hover:text-stone-600"
                                            )}
                                        >
                                            <CheckCircle2 className={cn("w-4 h-4", variant.isDefault && "fill-emerald-100")} />
                                            {variant.isDefault ? 'Default Size' : 'Set as Default'}
                                        </button>

                                        {formData.variants.length > 1 && (
                                            <button
                                                onClick={() => handleRemoveVariant(index)}
                                                className="p-2 text-stone-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar Content */}
                <div className="space-y-8">
                    {/* Media */}
                    <section className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-amber-600" />
                                Images
                            </h2>
                            <button
                                onClick={handleAddImage}
                                className="text-xs font-black text-amber-600 uppercase tracking-widest hover:text-amber-700"
                            >
                                Add
                            </button>
                        </div>
                        <div className="space-y-4">
                            {formData.images.map((url: string, index: number) => (
                                <div key={index} className="space-y-2 relative group">
                                    <div className="aspect-square bg-stone-50 rounded-2xl border-2 border-dashed border-stone-200 overflow-hidden flex items-center justify-center relative">
                                        {url ? (
                                            <img src={url} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <ImageIcon className="w-8 h-8 text-stone-200" />
                                        )}
                                        {formData.images.length > 1 && (
                                            <button
                                                onClick={() => handleRemoveImage(index)}
                                                className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Image URL"
                                        value={url}
                                        onChange={(e) => handleImageChange(index, e.target.value)}
                                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium focus:border-amber-500 outline-none"
                                    />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Organization */}
                    <section className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm space-y-6">
                        <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
                            <Layers className="w-5 h-5 text-amber-600" />
                            Collections
                        </h2>
                        <div className="space-y-4">
                            {collections?.map((collection: any) => (
                                <label key={collection._id} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={formData.collections.includes(collection._id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setFormData({ ...formData, collections: [...formData.collections, collection._id] })
                                                } else {
                                                    setFormData({ ...formData, collections: formData.collections.filter((id: string) => id !== collection._id) })
                                                }
                                            }}
                                            className="peer sr-only"
                                        />
                                        <div className="w-5 h-5 bg-stone-100 border-2 border-stone-200 rounded-md peer-checked:bg-amber-600 peer-checked:border-amber-600 transition-all" />
                                        <CheckCircle2 className="w-3 h-3 text-white absolute top-1 left-1 opacity-0 peer-checked:opacity-100 transition-opacity" />
                                    </div>
                                    <span className="text-sm font-bold text-stone-600 group-hover:text-stone-900 transition-colors uppercase tracking-tight">{collection.name}</span>
                                </label>
                            ))}
                        </div>
                    </section>

                    {/* Status Toggle */}
                    <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "w-3 h-3 rounded-full animate-pulse",
                                formData.isActive ? "bg-emerald-500" : "bg-red-500"
                            )} />
                            <span className="text-xs font-black text-stone-900 uppercase tracking-widest">
                                Status: {formData.isActive ? 'Active' : 'Private'}
                            </span>
                        </div>
                        <button
                            onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                            className={cn(
                                "w-12 h-6 rounded-full relative transition-colors duration-300",
                                formData.isActive ? "bg-amber-600" : "bg-stone-200"
                            )}
                        >
                            <div className={cn(
                                "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm",
                                formData.isActive ? "translate-x-6" : "translate-x-0"
                            )} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
