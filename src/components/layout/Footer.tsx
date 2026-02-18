import React from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/assets/footer-logo.png";

const Footer: React.FC = () => {
    return (
        <footer className="bg-[#004F49] text-white font-poppins">
            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
                {/* Logo & Description */}
                <div className="md:col-span-1">
                    <Link href="/">
                        <Image src={Logo} alt="Anuraga Logo" className="w-40 mb-4" />
                    </Link>
                    <p className="text-sm">
                        Homemade pickles crafted with care, tradition, and responsibly sourced ingredients.
                        Preservative-free South Indian delicacies, crafted by women artisans.
                    </p>
                </div>

                {/* Shop */}
                <div>
                    <h3 className="font-semibold mb-4">Shop</h3>
                    <ul className="space-y-2 text-sm">
                        {[
                            { name: "All Products", href: "/collections/all-products" },
                            { name: "Pickles", href: "/collections/pickles" },
                            { name: "Seasonal Collections", href: "/collections/seasonal" },
                            { name: "Gift Sets", href: "/collections/gift-sets" }
                        ].map((item) => (
                            <li key={item.name}>
                                <Link href={item.href} className="hover:text-green-300 cursor-pointer transition-colors">
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* About Us */}
                <div>
                    <h3 className="font-semibold mb-4">About Us</h3>
                    <ul className="space-y-2 text-sm">
                        {[
                            { name: "Our Story", href: "/#whyanuraga" },
                            { name: "Meet the Artisans", href: "/#carouselcard" }
                        ].map((item) => (
                            <li key={item.name}>
                                <Link href={item.href} className="hover:text-green-300 cursor-pointer transition-colors">
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Customer Care */}
                <div>
                    <h3 className="font-semibold mb-4">Customer Care</h3>
                    <ul className="space-y-2 text-sm">
                        {[
                            { name: "FAQs", href: "#" },
                            { name: "Shipping & Delivery", href: "#" },
                            { name: "Returns & Refunds", href: "#" },
                            { name: "Track Order", href: "#" },
                            { name: "Contact Us", href: "#" }
                        ].map((item) => (
                            <li key={item.name}>
                                <Link href={item.href} className="hover:text-green-300 cursor-pointer transition-colors">
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Legal */}
                <div>
                    <h3 className="font-semibold mb-4">Legal</h3>
                    <ul className="space-y-2 text-sm">
                        {[
                            { name: "Privacy Policy", href: "#" },
                            { name: "Terms & Conditions", href: "#" },
                            { name: "Pricing Policy", href: "#" },
                            { name: "Cancellation", href: "#" },
                            { name: "Contact Us", href: "#" }
                        ].map((item) => (
                            <li key={item.name}>
                                <Link href={item.href} className="hover:text-green-300 cursor-pointer transition-colors">
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Bottom Line */}
            <div className="border-t border-white/30 mt-8 py-4 text-sm flex flex-col sm:flex-row justify-between items-center px-6 text-center sm:text-left gap-2">
                <span>© 2026 Anuraga. All rights reserved.</span>
                <span>Made with care. Crafted in India</span>
            </div>
        </footer>
    );
};

export default Footer;
