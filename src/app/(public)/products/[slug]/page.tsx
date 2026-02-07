export default async function ProductPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    return (
        <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-stone-100 rounded-lg h-96 flex items-center justify-center text-stone-400">
                Product Image
            </div>
            <div>
                <h1 className="text-4xl font-bold text-amber-900 capitalize mb-4">{slug.replace('-', ' ')}</h1>
                <p className="text-lg text-stone-600 mb-6">Description for {slug}. This area will contain the full product description, ingredients, and nutritional info.</p>
                <button className="px-8 py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition font-medium">
                    Add to Cart
                </button>
            </div>
        </div>
    )
}
