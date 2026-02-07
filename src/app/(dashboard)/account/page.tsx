export default function AccountPage() {
    return (
        <div className="max-w-7xl mx-auto p-8">
            <h1 className="text-3xl font-bold text-amber-900 mb-6">My Account</h1>
            <div className="flex gap-8">
                <aside className="w-64 shrink-0">
                    {/* Sidebar Navigation */}
                    <ul className="space-y-2">
                        <li className="font-medium text-amber-700">Profile</li>
                        <li className="text-stone-600">Orders</li>
                    </ul>
                </aside>
                <div className="flex-1 p-6 border border-stone-200 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Profile Details</h2>
                </div>
            </div>
        </div>
    )
}
