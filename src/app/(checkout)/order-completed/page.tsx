export default function OrderCompletedPage() {
    return (
        <div className="max-w-xl mx-auto p-12 text-center">
            <h1 className="text-4xl font-bold text-green-700 mb-4">Order Placed!</h1>
            <p className="text-stone-600 mb-8">Thank you for your order. We will send you a confirmation email shortly.</p>
            <a href="/collections/all-products" className="text-amber-600 hover:underline">Continue Shopping</a>
        </div>
    )
}
