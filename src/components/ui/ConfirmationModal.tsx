'use client'

import React from 'react'
import { X, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger'
}: ConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 text-stone-400 hover:text-stone-900 transition-colors z-10 rounded-full hover:bg-stone-100"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-6 text-center">
                    <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4",
                        variant === 'danger' ? "bg-red-100 text-red-600" :
                            variant === 'warning' ? "bg-amber-100 text-amber-600" :
                                "bg-blue-100 text-blue-600"
                    )}>
                        <AlertTriangle className="w-6 h-6" />
                    </div>

                    <h3 className="text-lg font-bold text-stone-900 mb-2">{title}</h3>
                    <p className="text-stone-500 text-sm mb-6">{message}</p>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-white border border-stone-200 text-stone-700 font-medium rounded-xl hover:bg-stone-50 hover:border-stone-300 transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={cn(
                                "flex-1 px-4 py-2.5 font-bold rounded-xl text-white shadow-md transition-all hover:brightness-110",
                                variant === 'danger' ? "bg-red-600 shadow-red-100" :
                                    variant === 'warning' ? "bg-amber-600 shadow-amber-100" :
                                        "bg-brand-teal shadow-teal-100"
                            )}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
