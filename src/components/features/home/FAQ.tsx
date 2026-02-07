import { Plus } from 'lucide-react'

const FAQS = [
    {
        question: 'How long do the pickles last?',
        answer: 'Since we don\'t use artificial preservatives, our pickles stay fresh for 12 months when stored in a cool, dry place. Using a dry spoon is recommended.'
    },
    {
        question: 'Are your products organic?',
        answer: 'Yes, we source 100% organic ingredients directly from certified farmers to ensure the best quality and taste.'
    },
    {
        question: 'Do you ship internationally?',
        answer: 'Currently, we ship across India. We are working on international shipping and will launch it soon!'
    },
    {
        question: 'What is your return policy?',
        answer: 'If you receive a damaged jar, please email us within 24 hours with photos, and we will send a replacement immediately.'
    }
]

export default function FAQ() {
    return (
        <section className="py-24 bg-stone-50">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">Frequently Asked Questions</h2>
                </div>

                <div className="space-y-4">
                    {FAQS.map((faq, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
                            <details className="group">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-6 text-stone-900 hover:text-amber-700 transition">
                                    <span>{faq.question}</span>
                                    <span className="transition group-open:rotate-45">
                                        <Plus className="w-5 h-5 text-amber-500" />
                                    </span>
                                </summary>
                                <div className="text-stone-600 p-6 pt-0 leading-relaxed">
                                    {faq.answer}
                                </div>
                            </details>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
