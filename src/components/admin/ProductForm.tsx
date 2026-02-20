'use client'

import React, { useState, useEffect } from 'react'
import {
    Save,
    Plus,
    Trash2,
    Image as ImageIcon,
    Info,
    CheckCircle2,
    Package,
    Layers,
    Search,
    Globe,
    FileText,
    Tag
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Product, ProductVariant, Collection } from '@/types'

interface ProductFormProps {
    initialData?: Partial<Product>;
    collections?: Collection[];
    isPending: boolean;
    onSubmit: (data: any) => void;
    title: string;
}

export default function ProductForm({
    initialData,
    collections,
    isPending,
    onSubmit,
    title
}: ProductFormProps) {
    const [formData, setFormData] = useState<any>({
        name: '',
        description: '',
        images: [''],
        variants: [
            { label: '250g', price: 0, mrp: 0, stock: 10, isDefault: true }
        ],
        collections: [],
        isActive: true,
        type: '',
        brand: 'Anuraga',
        flavor: '',
        itemForm: 'Pickle',
        ingredients: '',
        nutritionInformation: '',
        packagingType: 'Glass Jar',
        storageInstruction: 'Store in a cool, dry place.',
        dietaryPreference: 'Vegetarian',
        metaTitle: '',
        metaDescription: '',
        keywords: [] as string[],
        isDeliverableEverywhere: true,
        availableLocations: [] as string[]
    })

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...formData,
                ...initialData,
                images: initialData.images?.length ? initialData.images : [''],
                variants: initialData.variants?.length ? initialData.variants : formData.variants,
                collections: initialData.collections?.map((c: any) => typeof c === 'string' ? c : c._id) || [],
                keywords: initialData.keywords || [],
                isDeliverableEverywhere: initialData.isDeliverableEverywhere ?? true,
                availableLocations: initialData.availableLocations || []
            })
        }
    }, [initialData])

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
        const newVariants = formData.variants.filter((_: any, i: number) => i !== index)
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
        setFormData({ ...formData, images: formData.images.filter((_: any, i: number) => i !== index) })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    const [activeTab, setActiveTab] = useState<'general' | 'specs' | 'seo' | 'delivery'>('general')

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black text-stone-900">{title}</h1>
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
                    Save Product
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 p-1 bg-stone-100 rounded-2xl w-fit">
                {[
                    { id: 'general', label: 'General', icon: Info },
                    { id: 'specs', label: 'Specifications', icon: FileText },
                    { id: 'delivery', label: 'Delivery', icon: Package },
                    { id: 'seo', label: 'SEO', icon: Globe }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                            "flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all",
                            activeTab === tab.id
                                ? "bg-white text-amber-600 shadow-sm"
                                : "text-stone-500 hover:text-stone-700 hover:bg-white/50"
                        )}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {activeTab === 'general' && (
                        <>
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
                        </>
                    )}

                    {activeTab === 'specs' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <section className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm space-y-6">
                                <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-amber-600" />
                                    Product Specifications
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-black text-stone-500 uppercase tracking-widest mb-2">Item Form</label>
                                        <input
                                            type="text"
                                            value={formData.itemForm}
                                            onChange={(e) => setFormData({ ...formData, itemForm: e.target.value })}
                                            placeholder="e.g. Pickle, Spice Powder"
                                            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-stone-500 uppercase tracking-widest mb-2">Packaging Type</label>
                                        <input
                                            type="text"
                                            value={formData.packagingType}
                                            onChange={(e) => setFormData({ ...formData, packagingType: e.target.value })}
                                            placeholder="e.g. Glass Jar"
                                            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-black text-stone-500 uppercase tracking-widest mb-2">Ingredients</label>
                                        <textarea
                                            rows={2}
                                            value={formData.ingredients}
                                            onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                                            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-black text-stone-500 uppercase tracking-widest mb-2">Nutrition Information</label>
                                        <textarea
                                            rows={2}
                                            value={formData.nutritionInformation}
                                            onChange={(e) => setFormData({ ...formData, nutritionInformation: e.target.value })}
                                            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-stone-500 uppercase tracking-widest mb-2">Storage Instructions</label>
                                        <input
                                            type="text"
                                            value={formData.storageInstruction}
                                            onChange={(e) => setFormData({ ...formData, storageInstruction: e.target.value })}
                                            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-stone-500 uppercase tracking-widest mb-2">Dietary Preference</label>
                                        <input
                                            type="text"
                                            value={formData.dietaryPreference}
                                            onChange={(e) => setFormData({ ...formData, dietaryPreference: e.target.value })}
                                            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                            </section>

                            <section className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-amber-600" />
                                        Expert Badges
                                    </h2>
                                    <button
                                        onClick={() => setFormData({ ...formData, expertBadges: [...(formData.expertBadges || []), ''] })}
                                        className="text-xs font-black text-amber-600 uppercase tracking-widest hover:text-amber-700"
                                    >
                                        Add Badge
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {formData.expertBadges?.map((badge: string, index: number) => (
                                        <div key={index} className="flex gap-2 group">
                                            <input
                                                type="text"
                                                value={badge}
                                                onChange={(e) => {
                                                    const newBadges = [...formData.expertBadges]
                                                    newBadges[index] = e.target.value
                                                    setFormData({ ...formData, expertBadges: newBadges })
                                                }}
                                                placeholder="e.g. 100% Traditional"
                                                className="flex-1 px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm font-bold"
                                            />
                                            <button
                                                onClick={() => setFormData({ ...formData, expertBadges: formData.expertBadges.filter((_: any, i: number) => i !== index) })}
                                                className="p-2 text-stone-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {(!formData.expertBadges || formData.expertBadges.length === 0) && (
                                        <p className="text-sm text-stone-400 font-medium italic">No badges added yet.</p>
                                    )}
                                </div>
                            </section>

                            <section className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
                                        <Tag className="w-5 h-5 text-amber-600" />
                                        Key Benefits
                                    </h2>
                                    <button
                                        onClick={() => setFormData({ ...formData, keyBenefits: [...(formData.keyBenefits || []), { title: '', icon: '' }] })}
                                        className="text-xs font-black text-amber-600 uppercase tracking-widest hover:text-amber-700"
                                    >
                                        Add Benefit
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {formData.keyBenefits?.map((benefit: any, index: number) => (
                                        <div key={index} className="flex gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-200 relative group">
                                            <div className="flex-1 space-y-3">
                                                <div>
                                                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Title</label>
                                                    <input
                                                        type="text"
                                                        value={benefit.title}
                                                        onChange={(e) => {
                                                            const newBenefits = [...formData.keyBenefits]
                                                            newBenefits[index] = { ...benefit, title: e.target.value }
                                                            setFormData({ ...formData, keyBenefits: newBenefits })
                                                        }}
                                                        placeholder="e.g. No Artificial Colors"
                                                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm font-bold focus:border-amber-500 outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Icon URL / Name</label>
                                                    <input
                                                        type="text"
                                                        value={benefit.icon}
                                                        onChange={(e) => {
                                                            const newBenefits = [...formData.keyBenefits]
                                                            newBenefits[index] = { ...benefit, icon: e.target.value }
                                                            setFormData({ ...formData, keyBenefits: newBenefits })
                                                        }}
                                                        placeholder="e.g. shield"
                                                        className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm font-bold focus:border-amber-500 outline-none"
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setFormData({ ...formData, keyBenefits: formData.keyBenefits.filter((_: any, i: number) => i !== index) })}
                                                className="p-2 text-stone-400 hover:text-red-500 transition-colors self-start"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {(!formData.keyBenefits || formData.keyBenefits.length === 0) && (
                                        <p className="text-sm text-stone-400 font-medium italic">No benefits added yet.</p>
                                    )}
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'delivery' && (
                        <section className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
                                <Package className="w-5 h-5 text-amber-600" />
                                Delivery Availability
                            </h2>

                            <div className="space-y-6">
                                <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200">
                                    <label className="flex items-center justify-between cursor-pointer">
                                        <div className="space-y-1">
                                            <span className="text-sm font-black text-stone-900 uppercase tracking-tight">Deliver Everywhere</span>
                                            <p className="text-xs text-stone-500 font-medium">When enabled, this product can be delivered to any pincode.</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, isDeliverableEverywhere: !formData.isDeliverableEverywhere })}
                                            className={cn(
                                                "w-12 h-6 rounded-full relative transition-colors duration-300",
                                                formData.isDeliverableEverywhere ? "bg-amber-600" : "bg-stone-300"
                                            )}
                                        >
                                            <div className={cn(
                                                "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm",
                                                formData.isDeliverableEverywhere ? "translate-x-6" : "translate-x-0"
                                            )} />
                                        </button>
                                    </label>
                                </div>

                                {!formData.isDeliverableEverywhere && (
                                    <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
                                        <label className="block text-xs font-black text-stone-500 uppercase tracking-widest mb-2">
                                            Available Pincodes (comma separated)
                                        </label>
                                        <textarea
                                            value={formData.availableLocations?.join(', ')}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                availableLocations: e.target.value.split(',').map(p => p.trim()).filter(p => p.length === 6)
                                            })}
                                            rows={4}
                                            placeholder="e.g. 500001, 500002..."
                                            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-bold text-sm"
                                        />
                                        <p className="text-[10px] text-stone-400 font-medium">
                                            Only 6-digit valid pincodes will be saved.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {activeTab === 'seo' && (
                        <section className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm space-y-6">
                            <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
                                <Globe className="w-5 h-5 text-amber-600" />
                                Search Engine Optimization
                            </h2>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-xs font-black text-stone-500 uppercase tracking-widest">Meta Title</label>
                                        <span className={cn("text-[10px] font-bold", formData.metaTitle?.length > 60 ? "text-red-500" : "text-stone-400")}>
                                            {formData.metaTitle?.length || 0}/60
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.metaTitle}
                                        onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                                        placeholder="Product title as shown in Google"
                                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-xs font-black text-stone-500 uppercase tracking-widest">Meta Description</label>
                                        <span className={cn("text-[10px] font-bold", formData.metaDescription?.length > 160 ? "text-red-500" : "text-stone-400")}>
                                            {formData.metaDescription?.length || 0}/160
                                        </span>
                                    </div>
                                    <textarea
                                        rows={3}
                                        value={formData.metaDescription}
                                        onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                                        placeholder="Summary for search engine snippets..."
                                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-stone-500 uppercase tracking-widest mb-2">Keywords (comma separated)</label>
                                    <input
                                        type="text"
                                        value={formData.keywords?.join(', ')}
                                        onChange={(e) => setFormData({ ...formData, keywords: e.target.value.split(',').map(k => k.trim()) })}
                                        placeholder="mango pickle, authentic, home made"
                                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
                                    />
                                </div>
                            </div>
                        </section>
                    )}
                </div>

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
                                    <div className="w-5 h-5 bg-stone-100 border-2 border-stone-200 rounded-md peer-checked:bg-amber-600 peer-checked:border-amber-600 transition-all flex items-center justify-center">
                                        <CheckCircle2 className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                                    </div>
                                    <span className="text-sm font-bold text-stone-600 group-hover:text-stone-900 transition-colors uppercase tracking-tight">{collection.name}</span>
                                </label>
                            ))}
                        </div>
                    </section>

                    {/* Status */}
                    <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "w-3 h-3 rounded-full",
                                formData.isActive ? "bg-emerald-500 animate-pulse" : "bg-red-500"
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
