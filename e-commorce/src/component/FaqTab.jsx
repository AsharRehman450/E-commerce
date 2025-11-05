import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "What is the delivery time?",
    answer: "Delivery typically takes 3-5 business days depending on your location.",
  },
  {
    question: "Can I return the product?",
    answer: "Yes, we offer a 30-day hassle-free return policy for all items.",
  },
  {
    question: "Do you offer size exchanges?",
    answer: "Yes, you can exchange sizes within 7 days of delivery.",
  },
  {
    question: "Are your clothes machine-washable?",
    answer: "Most of our items are machine-washable. Please refer to the product label for specific care instructions.",
  },
  {
    question: "Do you ship internationally?",
    answer: "Currently, we only ship within the country. International shipping will be available soon.",
  },
  {
    question: "Is Cash on Delivery available?",
    answer: "Yes, we do offer Cash on Delivery in most cities.",
  },
];

const FaqTab = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mt-6 space-y-4 px-4 md:px-6">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-xl shadow-sm bg-white transition-all duration-300"
        >
          <button
            onClick={() => toggleFaq(index)}
            className="w-full flex items-center justify-between px-4 py-3 text-left cursor-pointer"
          >
            <span className="font-medium text-gray-800">{faq.question}</span>
            {openIndex === index ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>
          {openIndex === index && (
            <div className="px-4 pb-4 text-gray-600 text-sm transition-opacity duration-300">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FaqTab;