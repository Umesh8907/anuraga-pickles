import CollectionClient from './CollectionClient'

export default async function CollectionPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const title = slug === 'all-products' ? 'All Our Delights' : slug.replace(/-/g, ' ')

    return (
        <div className="bg-stone-50 min-h-screen pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12 text-center sm:text-left">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900 capitalize tracking-tight">
                        {title}
                    </h1>
                    <p className="text-stone-600 mt-2 font-medium italic max-w-2xl">
                        Handcrafted with tradition and the finest ingredients. Explore our authentic flavors.
                    </p>
                </div>

                <CollectionClient slug={slug} />
            </div>
        </div>
    )
}
