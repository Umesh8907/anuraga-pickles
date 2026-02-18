'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image, { type StaticImageData } from 'next/image'
import { Star, Plus, Minus, ShoppingBag, Leaf, CheckCircle } from 'lucide-react'
import { FaLeaf, FaUndo, FaMoneyBillWave, FaTruck, FaFlask, FaUserCheck } from 'react-icons/fa'
import ProductImg from '@/assets/Productimg.png'
import { useProduct } from '@/hooks/useProducts'
import { useAddToCart } from '@/hooks/useCart'
import { cn } from '@/lib/utils'
import { Product, ProductVariant } from '@/types'

export default function ProductClient({ initialData }: { initialData?: Product | null }) {
    const params = useParams();
    const slug = params?.slug as string;

    // Fetch product data
    const { data: product, isLoading, isError } = useProduct(slug, initialData);
    const { mutate: addToCart } = useAddToCart();

    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
    const [quantity, setQuantity] = useState(1)
    const [activeImg, setActiveImg] = useState<string | StaticImageData | undefined>(undefined)
    const [selectedCombo, setSelectedCombo] = useState<number | null>(null)

    const [activeTab, setActiveTab] = useState<"description" | "ingredients" | "howto" | "details">("ingredients");

    const tabs = [
        { key: "description", label: "Description" },
        { key: "ingredients", label: "Key Ingredients" },
        { key: "howto", label: "How To Use" },
        { key: "details", label: "Product Details" },
    ] as const;

    // Update selected variant and active image when product loads
    useEffect(() => {
        if (product) {
            if (product.variants && product.variants.length > 0) {
                const defaultV = product.variants.find(v => v.isDefault) || product.variants[0];
                setSelectedVariant(defaultV);
            }
            // ensure activeImg falls back to the local placeholder when images array is empty
            setActiveImg(product.images && product.images.length > 0 ? product.images[0] : ProductImg);
        }
    }, [product]);

    if (isLoading) return (
        <div className="min-h-screen pt-32 text-center text-stone-600 font-medium bg-[#FFF9F1]">
            <div className="animate-pulse">Loading product details...</div>
        </div>
    );

    if (isError || !product) return (
        <div className="min-h-screen pt-32 text-center text-red-500 font-medium bg-[#FFF9F1]">
            Product not found
        </div>
    );

    const price = selectedVariant?.price || 0;
    const mrp = selectedVariant?.mrp || price;

    // Use ProductImg if real image is not present
    const mainImage = product.images?.[0] || ProductImg;
    const displayActiveImg = activeImg || mainImage;

    // Thumbnails: always show exactly MAX_THUMBNAILS slots — fill missing with placeholder
    const MAX_THUMBNAILS = 6;
    const existingImages: (string | StaticImageData)[] = product.images?.length ? product.images.slice(0, MAX_THUMBNAILS) : [];
    const placeholders = Array.from({ length: Math.max(0, MAX_THUMBNAILS - existingImages.length) }, () => ProductImg);
    const thumbnails = [...existingImages, ...placeholders].slice(0, MAX_THUMBNAILS);

    const handleAddToCart = () => {
        if (!selectedVariant) return;

        addToCart({
            product: product,
            variantId: selectedVariant._id,
            quantity
        });
    }

    const getComboPrice = (q: number) => {
        const base = price * q;
        const discount = q === 2 ? 0.15 : q === 3 ? 0.2 : 0;
        const final = Math.round(base * (1 - discount));
        return { price: final, save: base - final };
    };

    const combos = [
        { label: `  ${selectedVariant?.label}`, qty: 2, ...getComboPrice(2) },
        { label: `  ${selectedVariant?.label}`, qty: 3, ...getComboPrice(3) },
    ];

    return (
        <section className="bg-[#FFF9F1] pt-[80px] lg:pt-[100px] overflow-x-hidden">
            <div className="mx-auto max-w-7xl px-4 pb-16">



                {/* ================= MAIN GRID ================= */}
                <div className="grid lg:grid-cols-2 gap-12">

                    {/* ================= LEFT (Images & Features) ================= */}
                    <div className="flex flex-col gap-6">

                        {/* Images Section */}
                        <div className="flex flex-col lg:flex-row gap-4">

                            {/* Thumbnails (Desktop) — six equal square thumbnails that span the main image height */}
                            <div className="hidden lg:flex flex-col justify-between w-24 h-[420px] md:h-[520px] gap-3">
                                {thumbnails.map((img, i) => (
                                    <div key={i} className="flex-1 flex items-center justify-center">
                                        <button
                                            onClick={() => setActiveImg(img)}
                                            className={cn(
                                                "rounded-xl border overflow-hidden bg-white h-full flex items-center justify-center border-stone-200 hover:border-stone-300"
                                            )}

                                        >
                                            <div className="aspect-square h-full w-auto relative mx-auto">
                                                <Image
                                                    src={img}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover rounded-lg"
                                                />
                                            </div>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Main Image */}
                            <div className="flex-1">
                                <div className="relative bg-[#FFC878] rounded-[40px] h-[420px] md:h-[520px] w-full">
                                    <Image
                                        src={displayActiveImg}
                                        alt={product.name}
                                        fill
                                        className="object-contain p-8"
                                        priority
                                    />
                                </div>

                                {/* Thumbnails (Mobile) — show 6 thumbnails that span the main image width */}
                                <div className="lg:hidden mt-4">
                                    <div className="grid grid-cols-6 gap-3">
                                        {thumbnails.map((img, i) => (
                                            <div key={i} className="text-center">
                                                <button
                                                    onClick={() => setActiveImg(img)}
                                                    className={cn(
                                                        "rounded-2xl overflow-hidden bg-white w-full border border-stone-200"
                                                    )}

                                                >
                                                    <div className="relative w-full aspect-square">
                                                        <Image
                                                            src={img}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* GREEN EXPERT CARD - MOBILE VISIBLE */}
                        <div className="lg:hidden space-y-4">
                            <div className="bg-[#2F6B3D] rounded-2xl px-6 py-5 grid grid-cols-2 gap-4 text-white font-poppins shadow-md">
                                <Feature icon={<FaUserCheck />} label="Crafted by Experts" />
                                <Feature icon={<FaFlask />} label="New-Age Formulation" />
                                <Feature icon={<FaLeaf />} label="100% Ayurvedic" />
                                <Feature icon={<FaUserCheck />} label="Free Consultation" />
                            </div>

                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl font-poppins px-6 py-4 grid grid-cols-3 gap-4 text-sm shadow-sm border border-stone-100">
                                <SmallFeature icon={<FaUndo />} label="Easy Returns" />
                                <SmallFeature icon={<FaMoneyBillWave />} label="COD Available" />
                                <SmallFeature icon={<FaTruck />} label="Delivery in 3 Days" />
                            </div>

                            {/* ✅ FREQUENTLY BOUGHT TOGETHER (ADDED) */}
                            <div className="mt-6 bg-white rounded-3xl p-6 shadow-sm border border-stone-100">
                                <p className="font-semibold font-mukta text-stone-900 mb-5 flex items-center gap-2">
                                    <ShoppingBag className="w-5 h-5 text-[#C05A2B]" />
                                    Frequently bought together
                                </p>
                                <div className="flex items-center gap-5">
                                    <div className="w-24 h-24 bg-[#FFF3ED] rounded-2xl flex items-center justify-center p-2 shadow-inner">
                                        <Image
                                            src={mainImage}
                                            alt=""
                                            width={80}
                                            height={80}
                                            className="object-contain"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-base font-medium font-mukta text-stone-900">
                                            Mango Pickle | Home Made
                                        </p>
                                        <p className="text-lg font-medium text-[#C05A2B]">₹299.00</p>
                                        <div className="mt-3 flex items-center gap-3">
                                            <div className="flex items-center bg-stone-50 border rounded-xl px-3 py-1.5 shadow-sm">
                                                <Minus size={14} className="text-stone-400 cursor-pointer hover:text-stone-900" />
                                                <span className="mx-4 text-sm font-medium">1</span>
                                                <Plus size={14} className="text-stone-400 cursor-pointer hover:text-stone-900" />
                                            </div>
                                            <button className="bg-[#C05A2B] text-white text-xs font-medium px-5 py-2.5 rounded-xl hover:bg-[#a94d24] transition-all shadow-sm hover:shadow-md active:scale-95">
                                                ADD TO CART
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* GREEN EXPERT CARD - DESKTOP ONLY */}
                        <div className="hidden lg:block space-y-4">
                            <div className="bg-[#2F6B3D] font-poppins rounded-2xl px-6 py-5 grid grid-cols-4 gap-4 text-white shadow-md">
                                <Feature icon={<FaUserCheck />} label="Crafted by Experts" />
                                <Feature icon={<FaFlask />} label="New-Age Formulation" />
                                <Feature icon={<FaLeaf />} label="100% Ayurvedic" />
                                <Feature icon={<FaUserCheck />} label="Free Consultation" />
                            </div>

                            <div className="bg-white/80 font-poppins backdrop-blur-sm rounded-2xl px-6 py-4 grid grid-cols-3 gap-4 text-sm shadow-sm border border-stone-100">
                                <SmallFeature icon={<FaUndo />} label="Easy Returns" />
                                <SmallFeature icon={<FaMoneyBillWave />} label="COD Available" />
                                <SmallFeature icon={<FaTruck />} label="Delivery in 3 Days" />
                            </div>

                            {/* ✅ FREQUENTLY BOUGHT TOGETHER (ADDED) */}
                            <div className="mt-6 bg-white font-mukta rounded-3xl p-6 shadow-sm border border-stone-100">
                                <p className="font-semibold font-mukta text-stone-900 mb-5 flex items-center gap-2">

                                    Frequently bought together
                                </p>
                                <div className="flex items-center gap-5">
                                    <div className="w-24 h-24 bg-[#FFF3ED] rounded-2xl flex items-center justify-center p-2 shadow-inner">
                                        <Image
                                            src={mainImage}
                                            alt=""
                                            width={80}
                                            height={80}
                                            className="object-contain"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-base font-medium text-stone-900 font-mukta">
                                            Mango Pickle | Home Made
                                        </p>
                                        <p className="text-lg font-medium text-[#C05A2B] font-mukta">₹299.00</p>
                                        <div className="mt-3 flex items-center gap-3">
                                            <div className="flex items-center bg-stone-50 border rounded-xl px-3 py-1.5 shadow-sm">
                                                <Minus size={14} className="text-stone-400 cursor-pointer hover:text-stone-900" />
                                                <span className="mx-4 text-sm font-medium">1</span>
                                                <Plus size={14} className="text-stone-400 cursor-pointer hover:text-stone-900" />
                                            </div>
                                            <button className="bg-[#C05A2B] text-white text-xs font-medium px-5 py-2.5 rounded-xl hover:bg-[#a94d24] transition-all shadow-sm hover:shadow-md active:scale-95 font-mukta">
                                                ADD TO CART
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ================= RIGHT (Product Details) ================= */}
                    <div className="flex flex-col font-mukta">
                        <h1 className="text-2xl md:text-3xl font-semibold font-mukta text-stone-900">
                            {product.name}
                        </h1>

                        <div className="mt-3 flex items-center gap-2 text-sm">
                            <div className="flex text-[#F6C100]">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} size={14} fill="currentColor" />
                                ))}
                            </div>
                            <span className="text-black/60 font-mukta">{product.averageRating || 4.8} | {product.reviewCount || 181} Reviews</span>
                        </div>

                        <div className="mt-4">
                            <div className="flex flex-col">
                                <p className="text-2xl font-semibold text-black font-mukta">₹{price}</p>
                                {mrp && (
                                    <p className="text-xs text-black/50 font-mukta">M.R.P - ₹{mrp} <span className="text-black/40">(Inclusive of all taxes)</span></p>
                                )}
                            </div>
                        </div>

                        {/* Size Selection */}
                        <div className="mt-10">
                            <p className="text-sm font-medium text-stone-900 mb-4 font-mukta">Choose Pack Size</p>
                            <div className="flex gap-3 flex-wrap font-mukta">
                                {product.variants?.map((v) => (
                                    <button
                                        key={v._id}
                                        onClick={() => setSelectedVariant(v)}
                                        className={cn(
                                            "px-5 py-2 rounded-full border text-sm font-mukta",
                                            selectedVariant?._id === v._id
                                                ? "bg-[#8BC34A] text-white border-[#8BC34A]"
                                                : "border-black/20 text-stone-900 hover:bg-stone-50"
                                        )}
                                    >
                                        {v.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Combo Options */}
                        <div className="mt-10">
                            <p className="text-base font-medium text-stone-900 mb-4 font-mukta">Value for money Combos</p>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {combos.map((c, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedCombo(i)}
                                        className={cn(
                                            "flex-1 rounded-2xl border-2 p-6 min-h-[120px] text-left transition-all duration-200 font-mukta", // increased padding & height
                                            selectedCombo === i
                                                ? "border-[#F6C100] bg-white"  // selected combo: yellow border
                                                : "border-black/10 bg-white hover:border-stone-300" // default combo
                                        )}
                                    >
                                        <p className="text-xl font-semibold text-stone-900">{c.label}</p> {/* bigger label */}
                                        <div className="mt-4 flex items-center gap-4">
                                            <p className="text-lg font-bold text-stone-900">₹{c.price}</p> {/* bigger price */}
                                            <p className="text-md text-green-600 font-semibold">Save ₹{c.save}</p> {/* bigger save text */}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>



                        {/* Qty + Cart */}
                        <div className="mt-6 flex flex-col sm:flex-row gap-4">
                            <div className="flex items-center border rounded-xl px-4 h-[52px] w-fit font-mukta">
                                <Minus onClick={() => setQuantity(Math.max(1, quantity - 1))} className="cursor-pointer text-stone-700" />
                                <span className="mx-6 text-stone-900 font-medium">{quantity}</span>
                                <Plus onClick={() => setQuantity(quantity + 1)} className="cursor-pointer text-stone-700" />
                            </div>
                            <button
                                onClick={handleAddToCart}
                                disabled={!selectedVariant || selectedVariant.stock === 0}
                                className={cn(
                                    "h-[52px] px-12 bg-[#C05A2B] text-white rounded-xl w-full  sm:w-auto lg:w-[320px] flex items-center justify-center gap-3 font-mukta",
                                    selectedVariant?.stock === 0 ? "opacity-50 cursor-not-allowed" : ""
                                )}
                            >
                                ADD TO CART
                            </button>
                        </div>

                        {/* Quality Badges */}
                        <div className="mt-6 bg-[#F0F9F5] font-mukta rounded-2xl p-8 grid grid-cols-2 md:grid-cols-2 gap-4">
                            {[
                                { icon: <FaLeaf />, label: "Helps in digestion" },
                                { icon: <FaLeaf />, label: "Traditional Taste" },
                                { icon: <FaLeaf />, label: "No Preservatives" },
                                { icon: <FaLeaf />, label: "Natural Ingredients" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="bg-white rounded-full p-2.5 shadow-sm">
                                        <FaLeaf className="text-[#0FA958] text-md" />
                                    </div>
                                    <p className="text-md font-medium text-stone-700 leading-tight">
                                        {item.label}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Tabs System */}
                        <div className="mt-8 bg-[#F0F9F5] font-mukta">
                            <div className="flex gap-1 bg-[#F0F9F5] p-1 rounded-xl">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`flex-1 px-4 py-2.5 text-md font-medium rounded-lg transition-all border
                                           ${activeTab === tab.key
                                                ? "bg-[#E7A647] text-white shadow-sm border-[#E7A647]"
                                                : "text-gray-600 hover:text-gray-900 border-[#C1C1C1]"
                                            }`}
                                    >
                                        {tab.label}
                                    </button>

                                ))}
                            </div>

                            <div className="mt-6 bg-[#F0F9F5]">
                                {activeTab === "description" && (
                                    <div className="bg-[#F0F9F5] rounded-2xl p-6 border border-stone-100 shadow-sm leading-relaxed text-stone-600">
                                        <p>{product.description}</p>
                                    </div>
                                )}

                                {activeTab === "ingredients" && (
                                    <div className="mt-4 bg-[#F0F9F5] rounded-2xl p-6 border border-stone-100 shadow-sm">
                                        <div className="flex justify-start gap-6 overflow-x-auto pb-2">
                                            {[1, 2, 3, 4].map((_, i) => (
                                                <div key={i} className="flex flex-col items-center text-center min-w-[90px]">
                                                    <div className="w-14 h-14 rounded-full bg-[#F0F7F4] border border-[#E8F5E9] flex items-center justify-center p-1.5 shadow-sm">
                                                        <Image src={ProductImg} alt={`ingredient-${i}`} width={40} height={40} className="object-contain" />
                                                    </div>
                                                    <p className="text-xs font-semibold mt-2 text-stone-800">Key Ingredient {i + 1}</p>
                                                    <p className="text-[10px] text-stone-400 mt-0.5">Helps metabolism</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === "howto" && (
                                    <div className="bg-[#F0F9F5] rounded-3xl p-8 border border-stone-100 shadow-sm">
                                        <ul className="space-y-4">
                                            {[
                                                "Consume with meals for enhanced flavor",
                                                "Use a clean, dry spoon for longevity",
                                                "Store in a cool and moisture-free area",
                                                "Keep the lid tightly closed after use"
                                            ].map((text, i) => (
                                                <li key={i} className="flex items-center gap-4 text-stone-600 font-medium">
                                                    <div className="w-6 h-6 bg-[#EAF4EF] rounded-full flex items-center justify-center shrink-0 text-[#0FA958]">
                                                        <CheckCircle size={14} />
                                                    </div>
                                                    {text}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {activeTab === "details" && (
                                    <div className="bg-[#F0F9F5] rounded-3xl p-8 border border-stone-100 shadow-sm grid sm:grid-cols-2 gap-4">
                                        {[
                                            "100% Traditional Recipe",
                                            "No Artificial Colors",
                                            "Handmade with Love",
                                            "Sustainable Sourcing",
                                            "Lab Tested for Quality",
                                            "Farm-to-Jar Process"
                                        ].map((item, i) => (
                                            <p key={i} className="flex items-center gap-3 text-stone-600 font-medium text-sm">
                                                <span className="text-[#0FA958] text-lg leading-none">✔</span>
                                                {item}
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* GREEN EXPERT CARD - MOBILE VISIBLE ABOVE "WE CARE..." SECTION
            <div className="lg:hidden mx-4">
                <div className="bg-[#2F6B3D] rounded-2xl px-6 py-5 grid grid-cols-2 gap-4 text-white shadow-md mb-4">
                    <Feature icon={<FaUserCheck />} label="Crafted by Experts" />
                    <Feature icon={<FaFlask />} label="New-Age Formulation" />
                    <Feature icon={<FaLeaf />} label="100% Ayurvedic" />
                    <Feature icon={<FaUserCheck />} label="Free Consultation" />
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 grid grid-cols-3 gap-4 text-sm shadow-sm border border-stone-100 mb-4">
                    <SmallFeature icon={<FaUndo />} label="Easy Returns" />
                    <SmallFeature icon={<FaMoneyBillWave />} label="COD Available" />
                    <SmallFeature icon={<FaTruck />} label="Delivery in 3 Days" />
                </div>
            </div> */}

            {/* PRODUCT VALUE PROPOSITION */}
            <div className="mt-16 w-full bg-[#0FA958] py-14 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16 tracking-tight">
                        We care to deliver a clean product
                    </h2>

                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-y-12 gap-x-4 text-white">
                        {[
                            { icon: <Leaf />, label: "Clean Label" },
                            { icon: <FaUndo />, label: "Easy Returns" },
                            { icon: <FaMoneyBillWave />, label: "Cash On Delivery" },
                            { icon: <FaTruck />, label: "Free Shipping" },
                            { icon: <FaFlask />, label: "Tested Formula" },
                            { icon: <FaUserCheck />, label: "Expert Approved" },
                            { icon: <CheckCircle />, label: "100% Quality" },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center text-center group cursor-default">
                                <div className="w-20 h-20 border-2 border-white/30 rounded-full flex items-center justify-center mb-5 group-hover:bg-white group-hover:text-[#0FA958] transition-all duration-500 group-hover:scale-110 shadow-lg group-hover:border-white">
                                    <span className="text-2xl">{item.icon}</span>
                                </div>
                                <p className="text-sm font-medium uppercase tracking-wide leading-tight">
                                    {item.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

/* HELPERS */
function Feature({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <div className="flex flex-col items-center sm:flex-row gap-3 text-sm group">
            <div className="bg-white/10 p-2.5 rounded-full group-hover:bg-white/20 transition-colors shadow-inner">{icon}</div>
            <span className="font-medium text-[11px] uppercase tracking-wide text-center sm:text-left">{label}</span>
        </div>
    );
}

function SmallFeature({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <div className="flex items-center justify-center gap-3 text-stone-700 hover:text-stone-900 transition-colors group">
            <div className="bg-stone-50 border border-stone-100 p-2.5 rounded-full shadow-sm group-hover:bg-white transition-all">{icon}</div>
            <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
        </div>
    );
}