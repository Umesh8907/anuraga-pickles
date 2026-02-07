import { Metadata, ResolvingMetadata } from 'next'
import ProductClient from './ProductClient'
import productService from '@/services/product.service'
import { Product } from '@/types'

type Props = {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const slug = (await params).slug

    try {
        const product = await productService.getProductBySlug(slug)

        const previousImages = (await parent).openGraph?.images || []
        const productImages = product.images || []

        return {
            title: product.name,
            description: product.description.substring(0, 160), // Truncate for SEO
            openGraph: {
                title: product.name,
                description: product.description.substring(0, 160),
                images: [...productImages, ...previousImages],
            },
        }
    } catch (error) {
        return {
            title: 'Product Not Found',
            description: 'The requested product could not be found.',
        }
    }
}

export default async function ProductPage({ params }: Props) {
    const { slug } = await params
    let product: Product | null = null
    let jsonLd = null

    try {
        product = await productService.getProductBySlug(slug)

        if (product) {
            jsonLd = {
                '@context': 'https://schema.org',
                '@type': 'Product',
                name: product.name,
                image: product.images,
                description: product.description,
                offers: {
                    '@type': 'Offer',
                    priceCurrency: 'INR',
                    price: product.variants?.[0]?.price || 0,
                    availability: (product.variants?.[0]?.stock || 0) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
                },
                aggregateRating: product.averageRating ? {
                    '@type': 'AggregateRating',
                    ratingValue: product.averageRating,
                    reviewCount: product.reviewCount || 0
                } : undefined
            }
        }
    } catch (error) {
        // Fallback or handle error
    }

    return (
        <>
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            <ProductClient initialData={product} />
        </>
    )
}
