'use client'

import React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useUpdateProduct, useProductById } from '@/hooks/useAdmin'
import { useCollections } from '@/hooks/useCollections'
import ProductForm from '@/components/admin/ProductForm'

export default function EditProduct() {
    const router = useRouter()
    const params = useParams()
    const productId = params?.id as string

    const { data: product, isLoading: isLoadingProduct } = useProductById(productId)
    const { mutate: updateProduct, isPending } = useUpdateProduct()
    const { data: collections } = useCollections()

    const handleSubmit = (data: any) => {
        if (!data.name || !data.description || data.variants.length === 0) {
            alert('Please fill in all required fields.')
            return
        }

        updateProduct({ id: productId, data }, {
            onSuccess: () => {
                router.push('/admin/products')
            },
            onError: (error: any) => {
                alert(error.message || 'Failed to update product')
            }
        })
    }

    if (isLoadingProduct || !product) return (
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
            </div>

            <ProductForm
                title="Edit Product"
                initialData={product}
                collections={collections}
                isPending={isPending}
                onSubmit={handleSubmit}
            />
        </div>
    )
}
