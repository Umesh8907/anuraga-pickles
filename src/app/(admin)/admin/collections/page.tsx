'use client'

import React, { useState } from 'react'
import {
    Plus,
    Search,
    Layers,
    Edit,
    Trash2,
    MoreVertical,
    Image as ImageIcon,
    CheckCircle2,
    XCircle,
    ChevronRight
} from 'lucide-react'
import { useCollections } from '@/hooks/useCollections'
import { useCreateCollection, useUpdateCollection, useDeleteCollection } from '@/hooks/useAdmin'
import { cn } from '@/lib/utils'

export default function AdminCollections() {
    const [search, setSearch] = useState('')
    const [isAdding, setIsAdding] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        isActive: true,
        bannerImage: ''
    })

    const { data: collections, isLoading } = useCollections()
    const { mutate: createCollection } = useCreateCollection()
    const { mutate: updateCollection } = useUpdateCollection()
    const { mutate: deleteCollection } = useDeleteCollection()

    const filteredCollections = collections?.filter((c: any) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    )

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (editingId) {
            updateCollection({ id: editingId, data: formData }, {
                onSuccess: () => {
                    setEditingId(null)
                    setFormData({ name: '', description: '', isActive: true, bannerImage: '' })
                }
            })
        } else {
            createCollection(formData, {
                onSuccess: () => {
                    setIsAdding(false)
                    setFormData({ name: '', description: '', isActive: true, bannerImage: '' })
                }
            })
        }
    }

    const handleEdit = (collection: any) => {
        setEditingId(collection._id)
        setFormData({
            name: collection.name,
            description: collection.description || '',
            isActive: collection.isActive,
            bannerImage: collection.bannerImage || ''
        })
        setIsAdding(true)
    }

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this collection?')) {
            deleteCollection(id)
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
                    <h1 className="text-3xl font-black text-stone-900 tracking-tight">Collections</h1>
                    <p className="text-stone-500 font-medium">Group your products into themed collections.</p>
                </div>
                {!isAdding && (
                    <button
                        onClick={() => {
                            setIsAdding(true)
                            setEditingId(null)
                            setFormData({ name: '', description: '', isActive: true, bannerImage: '' })
                        }}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-amber-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Plus className="w-5 h-5" />
                        Create Collection
                    </button>
                )}
            </div>

            {isAdding ? (
                <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm animate-in slide-in-from-top-4 duration-300">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-black text-stone-500 uppercase tracking-widest mb-2">Collection Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Seasonal Picks"
                                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-stone-500 uppercase tracking-widest mb-2">Description</label>
                                    <textarea
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Briefly describe this collection..."
                                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
                                    />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-200">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-2 h-2 rounded-full",
                                            formData.isActive ? "bg-emerald-500" : "bg-red-500"
                                        )} />
                                        <span className="text-xs font-black text-stone-900 uppercase tracking-widest">Active Status</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                        className={cn(
                                            "w-12 h-6 rounded-full relative transition-colors duration-300",
                                            formData.isActive ? "bg-amber-600" : "bg-stone-200"
                                        )}
                                    >
                                        <div className={cn(
                                            "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300",
                                            formData.isActive ? "translate-x-6" : "translate-x-0"
                                        )} />
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-black text-stone-500 uppercase tracking-widest mb-2">Banner Image URL</label>
                                    <div className="aspect-[21/9] bg-stone-50 rounded-2xl border-2 border-dashed border-stone-200 overflow-hidden flex items-center justify-center relative mb-4">
                                        {formData.bannerImage ? (
                                            <img src={formData.bannerImage} alt="Banner Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <ImageIcon className="w-8 h-8 text-stone-200" />
                                        )}
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.bannerImage}
                                        onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
                                        placeholder="https://..."
                                        className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium text-xs"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-4 pt-4 border-t border-stone-100">
                            <button
                                type="button"
                                onClick={() => setIsAdding(false)}
                                className="px-6 py-3 rounded-xl font-bold text-stone-500 hover:bg-stone-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-amber-600/20 transition-all"
                            >
                                {editingId ? 'Update Collection' : 'Create Collection'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <>
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                        <input
                            type="text"
                            placeholder="Search collections..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
                        />
                    </div>

                    {/* Collection Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCollections?.map((collection: any) => (
                            <div key={collection._id} className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden group hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                                <div className="aspect-[21/9] bg-stone-100 relative overflow-hidden">
                                    {collection.bannerImage ? (
                                        <img src={collection.bannerImage} alt={collection.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Layers className="w-8 h-8 text-stone-200" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <span className={cn(
                                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide",
                                            collection.isActive ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                                        )}>
                                            {collection.isActive ? 'Active' : 'Draft'}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-lg font-black text-stone-900">{collection.name}</h3>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleEdit(collection)}
                                                className="p-2 text-stone-400 hover:text-amber-600 transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(collection._id)}
                                                className="p-2 text-stone-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-stone-500 text-sm line-clamp-2 font-medium mb-4">
                                        {collection.description || 'No description provided.'}
                                    </p>
                                    <div className="pt-4 border-t border-stone-50 flex items-center justify-between">
                                        <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                                            SLUG: {collection.slug}
                                        </span>
                                        <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {!filteredCollections?.length && (
                        <div className="p-20 text-center bg-white rounded-3xl border border-stone-100 shadow-sm">
                            <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Layers className="w-8 h-8 text-stone-200" />
                            </div>
                            <h3 className="text-lg font-bold text-stone-900 mb-1">No Collections Found</h3>
                            <p className="text-stone-500 text-sm">Try creating a new collection to group your products.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
