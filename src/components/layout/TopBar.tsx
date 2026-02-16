'use client'

import { FaTruck, FaMoneyBillWave, FaGift } from 'react-icons/fa'

const announcements = [
    { text: 'FREE SHIPPING ON ALL PREPAID ORDERS', icon: <FaTruck /> },
    { text: 'FREE COD ON ORDERS ABOVE ₹299', icon: <FaMoneyBillWave /> },
    { text: 'EXCITING GIFTS ON SELECT ORDERS', icon: <FaGift /> },
]

const TopBar = () => {
    return (
        <div className="relative w-full z-50 bg-[#004F49] text-white overflow-hidden">
            <div className="flex w-max gap-6 whitespace-nowrap py-3 animate-marquee">
                {[...announcements, ...announcements].map((a, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm font-medium">
                        {a.icon}
                        <span>{a.text}</span>
                        <span className="opacity-70">•</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TopBar
