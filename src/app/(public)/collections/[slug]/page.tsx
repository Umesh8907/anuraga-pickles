export default async function CollectionPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    return (
        <div className="max-w-7xl mx-auto p-8">
            <h1 className="text-3xl font-bold capitalize text-amber-900 mb-8">{slug.replace('-', ' ')} Collection</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-stone-200 h-64 flex items-center justify-center text-stone-400">
                    Product Placeholder
                </div>
                {/* Dynamic product list would go here */}
            </div>
        </div>
    )
}
