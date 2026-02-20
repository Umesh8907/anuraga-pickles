'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useCreateProduct } from '@/hooks/useAdmin'
import { useCollections } from '@/hooks/useCollections'
import ProductForm from '@/components/admin/ProductForm'

export default function NewProduct() {
    const router = useRouter()
    const { mutate: createProduct, isPending } = useCreateProduct()
    const { data: collections } = useCollections()

    const handleSubmit = (data: any) => {
        // Basic Validation
        if (!data.name || !data.description || data.variants.length === 0) {
            alert('Please fill in all required fields.')
            return
        }

        createProduct(data, {
            onSuccess: () => {
                router.push('/admin/products')
            },
            onError: (error: any) => {
                alert(error.message || 'Failed to create product')
            }
        })
    }

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
                title="Add New Product"
                collections={collections}
                isPending={isPending}
                onSubmit={handleSubmit}
            />
        </div>
    )
}
