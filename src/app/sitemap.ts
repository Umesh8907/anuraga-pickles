import { MetadataRoute } from 'next'
import productService from '@/services/product.service'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Static routes
    const routes = [
        '',
        '/about',
        '/contact',
        '/collections/all-products',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }))

    // Fetch products
    let products: any[] = []
    try {
        const response = await productService.getProducts({ limit: 1000 })
        products = response.data.map((product) => ({
            url: `${baseUrl}/products/${product.slug}`,
            lastModified: new Date(), // Fallback as updatedAt might not be in interface
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }))
    } catch (error) {
        console.error('Failed to fetch products for sitemap', error)
    }

    // Collections (hardcoded for now as we don't have a collection service method exposed easily,
    // or we can assume standard ones. Ideally fetch from backend if dynamic)
    const collections = [
        'pickles',
        'spices',
        'powders',
        'sweets'
    ].map((slug) => ({
        url: `${baseUrl}/collections/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }))

    return [...routes, ...collections, ...products]
}
