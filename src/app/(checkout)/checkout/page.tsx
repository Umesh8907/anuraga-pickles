export default function CheckoutPage() {
    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-3xl font-bold text-amber-900 mb-6">Checkout</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-stone-50 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                    {/* Form placeholder */}
                </div>
                <div className="p-6 bg-stone-50 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                    {/* Summary placeholder */}
                </div>
            </div>
        </div>
    )
}
