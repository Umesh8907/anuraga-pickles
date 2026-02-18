"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    question: "How long do the pickles last?",
    answer:
      "Since we don't use artificial preservatives, our pickles stay fresh for 12 months when stored in a cool, dry place. Using a dry spoon is recommended.",
  },
  {
    question: "Are your products organic?",
    answer:
      "Yes, we source 100% organic ingredients directly from certified farmers to ensure the best quality and taste.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Currently, we ship across India. We are working on international shipping and will launch it soon!",
  },
  {
    question: "What is your return policy?",
    answer:
      "If you receive a damaged jar, please email us within 24 hours with photos, and we will send a replacement immediately.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-5xl px-4">

        {/* Heading */}
        <h2 className="mb-10 text-center text-3xl font-semibold uppercase  text-black">
          Frequently Asked Questions
        </h2>

        {/* FAQ List */}
        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="rounded-lg bg-[#EEF7F1] px-6 py-4"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <span className="text-sm font-medium text-[#1F5C2E]">
                    {faq.question}
                  </span>

                  <ChevronDown
                    className={`h-5 w-5 text-[#1F5C2E] transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {isOpen && (
                  <p className="mt-4 text-sm leading-relaxed text-black/70">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
