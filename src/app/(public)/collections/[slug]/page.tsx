import { Metadata } from 'next'
import CollectionClient from './CollectionClient'
import CollectionEndBanner from '@/components/features/collections/CollectionEndBanner'
import CollectionHeader from '@/components/features/collections/CollectionHeader'

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const { slug } = await params
    const title = slug === 'all-products' ? 'All Our Delights' : slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

    return {
        title: `${title}`,
        description: `Explore our authentic collection of ${title}. Handcrafted with traditional recipes and premium ingredients.`,
        openGraph: {
            title: `${title} | Anuraga Pickles`,
            description: `Explore our authentic collection of ${title}. Handcrafted with traditional recipes and premium ingredients.`,
        }
    }
}

export default async function CollectionPage({
    params,
}: Props) {
    const { slug } = await params
    console.log("CollectionPage slug:", slug);

    return (
        <main className="min-h-screen bg-[#fbf6ee]">
            <CollectionHeader />
            <CollectionClient slug={slug} />
            <CollectionEndBanner />
        </main>
    )
}
