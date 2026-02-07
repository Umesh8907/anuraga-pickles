export default function OrdersPage() {
    return (
        <div className="max-w-7xl mx-auto p-8">
            <h1 className="text-3xl font-bold text-amber-900 mb-6">My Orders</h1>
            <div className="space-y-4">
                {/* Order List */}
                <div className="p-4 border border-stone-200 rounded-lg">
                    <p>No orders found.</p>
                </div>
            </div>
        </div>
    )
}
