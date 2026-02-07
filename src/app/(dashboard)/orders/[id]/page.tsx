export default async function OrderDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    return (
        <div className="max-w-7xl mx-auto p-8">
            <h1 className="text-3xl font-bold text-amber-900 mb-6">Order #{id}</h1>
            <div className="p-6 border border-stone-200 rounded-lg">
                <p>Order details will appear here.</p>
            </div>
        </div>
    )
}
