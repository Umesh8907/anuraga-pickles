"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FAQ = {
  question: string;
  answer: string;
};

const faqs: FAQ[] = [
  {
    question: "Which Ayurvedic Fitness is best for weight loss?",
    answer:
      "Ayurvedic fitness products like Triphala, Guggul, and herbal metabolism boosters are commonly recommended for healthy weight management.",
  },
  {
    question: "Do Ayurvedic Fitness products help you in losing weight?",
    answer:
      "Yes, when combined with a balanced diet and lifestyle, Ayurvedic fitness products may support digestion, metabolism, and overall weight management.",
  },
  {
    question: "Does Triphala herb burn fat?",
    answer:
      "Triphala helps improve digestion and detoxification, which can indirectly support fat metabolism when used consistently.",
  },
  {
    question:
      "Are there any side effects associated with using Ayurvedic fitness products?",
    answer:
      "Ayurvedic products are generally safe when taken as directed. However, it is recommended to consult a healthcare professional if you have medical conditions.",
  },
  {
    question:
      "Are there any age restrictions for using the weight management products?",
    answer:
      "Most products are suitable for adults. Pregnant women, nursing mothers, and children should consult a doctor before use.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-5xl px-4">
        {/* Heading */}
        <h2 className="mb-10 text-center text-3xl font-semibold text-black">
          Frequently Asked Questions
        </h2>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="rounded-lg bg-[#EEF7F1] px-6 py-4"
              >
                <button
                  onClick={() =>
                    setOpenIndex(isOpen ? null : index)
                  }
                  className="flex w-full items-center justify-between text-left"
                >
                  <span className="text-sm font-medium text-[#1F5C2E]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-[#1F5C2E] transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
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
