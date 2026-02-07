'use client'

import React from 'react'
import Link from 'next/link'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-4 text-center">
            <div className="max-w-2xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-stone-100 flex flex-col md:flex-row items-stretch">
                {/* Image Side */}
                <div className="md:w-1/2 relative bg-amber-50 overflow-hidden min-h-[300px]">
                    <img
                        src="/images/not_found_pickles.png"
                        alt="Spices missing"
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                            // Fallback if image doesn't exist yet or fails
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=1000&auto=format&fit=crop'
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent flex items-end p-8">
                        <p className="text-white text-sm font-medium italic">"A meal without spice is like a page without content."</p>
                    </div>
                </div>

                {/* Content Side */}
                <div className="md:w-1/2 p-10 md:p-12 flex flex-col justify-center items-center md:items-start">
                    <div className="bg-brand-amber text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] mb-6 shadow-sm">
                        Error 404
                    </div>
                    <h1 className="text-4xl font-extrabold text-stone-900 mb-4 tracking-tight leading-tight md:text-left">
                        Spices <span className="text-brand-amber">Missing?</span>
                    </h1>
                    <p className="text-stone-500 mb-10 leading-relaxed md:text-left max-w-xs">
                        The page you are looking for seems to have wandered off our pantry shelves. Perhaps it's being marinated?
                    </p>

                    <div className="space-y-4 w-full">
                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2 w-full bg-brand-teal text-white font-bold py-4 rounded-2xl hover:brightness-110 transition-all shadow-xl shadow-stone-200 group"
                        >
                            <Home className="w-5 h-5 transition-transform group-hover:-translate-y-1" />
                            Return Home
                        </Link>

                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center justify-center gap-2 w-full bg-white border border-stone-200 text-stone-700 font-bold py-4 rounded-2xl hover:bg-stone-50 transition-all"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Go Back
                        </button>
                    </div>

                    <div className="mt-10 pt-8 border-t border-stone-100 w-full flex items-center justify-center md:justify-start gap-3 text-stone-400">
                        <Search className="w-4 h-4" />
                        <span className="text-[11px] font-medium uppercase tracking-wider">Try searching for your favorite pickle</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
