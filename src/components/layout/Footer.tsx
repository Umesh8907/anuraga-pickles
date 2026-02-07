import Link from 'next/link'
import { Facebook, Instagram, Twitter } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand Info */}
                    <div>
                        <h3 className="text-xl font-bold text-amber-500 mb-4">Anuraga Pickles</h3>
                        <p className="text-sm text-stone-400 mb-6">
                            Bringing authentic South Indian flavors to your doorstep. Handmade with love and traditional recipes.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-stone-400 hover:text-amber-500 transition"><Facebook className="w-5 h-5" /></a>
                            <a href="#" className="text-stone-400 hover:text-amber-500 transition"><Instagram className="w-5 h-5" /></a>
                            <a href="#" className="text-stone-400 hover:text-amber-500 transition"><Twitter className="w-5 h-5" /></a>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Shop</h4>
                        <ul className="space-y-2">
                            <li><Link href="/collections/all-products" className="hover:text-amber-500 transition">All Products</Link></li>
                            <li><Link href="/collections/mango-pickles" className="hover:text-amber-500 transition">Pickles</Link></li>
                            <li><Link href="/collections/spices" className="hover:text-amber-500 transition">Spices & Powders</Link></li>
                            <li><Link href="/collections/festive-deals" className="hover:text-amber-500 transition">Festive Deals</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
                        <ul className="space-y-2">
                            <li><Link href="#" className="hover:text-amber-500 transition">Contact Us</Link></li>
                            <li><Link href="#" className="hover:text-amber-500 transition">Shipping Policy</Link></li>
                            <li><Link href="#" className="hover:text-amber-500 transition">Returns & Refunds</Link></li>
                            <li><Link href="#" className="hover:text-amber-500 transition">FAQs</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Stay Updated</h4>
                        <p className="text-sm text-stone-400 mb-4">Subscribe to our newsletter for new launches and special offers.</p>
                        <form className="flex flex-col space-y-2">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="bg-stone-800 border border-stone-700 rounded px-4 py-2 text-white focus:outline-none focus:border-amber-500"
                            />
                            <button
                                type="button"
                                className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 transition font-medium"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-stone-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-stone-500">
                    <p>&copy; {new Date().getFullYear()} Anuraga Pickles. All rights reserved.</p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        {/* Payment Icons Placeholder */}
                        <span>Visa</span>
                        <span>Mastercard</span>
                        <span>UPI</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
