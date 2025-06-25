import React from "react";
import { BsQuestionCircle } from "react-icons/bs";

const faqs = [
  {
    question: "What is BillStack?",
    answer:
      "BillStack is a platform where you can store, manage, and track all your bills in one place. It also provides reminders and payment options to avoid missing due dates.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. We use secure protocols and follow industry best practices to ensure your data is protected and accessible only to you.",
  },
  {
    question: "Can I pay my bills directly?",
    answer:
      "Yes. BillStack integrates with Razorpay so you can pay your bills directly from the platform.",
  },
  {
    question: "Is BillStack free to use?",
    answer:
      "Yes, BillStack is free to use. Some premium features might be introduced later, but the core features will always remain free.",
  },
];

const FAQ = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 transition-all duration-300">
      <div className="flex flex-col items-center mb-10">
        <div className="bg-indigo-100 dark:bg-gray-700 p-4 rounded-full mb-4 shadow-md">
          <BsQuestionCircle size={40} className="text-gray-600 dark:text-white" />
        </div>
        <h1 className="text-4xl font-extrabold text-center text-gray-800 dark:text-gray-700">
          Frequently Asked Questions
        </h1>
        <span className="mt-2 inline-block bg-indigo-200 text-blue-800 text-sm font-medium px-4 py-1 rounded-full tracking-wide shadow-sm">
          Everything You Might Want to Know
        </span>
      </div>

      <div className="space-y-8">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border-b border-gray-300 dark:border-gray-600 pb-6 group"
          >
            <h3 className="text-2xl font-bold text-gray-700 dark:text  transition-colors duration-200">
              {faq.question}
            </h3>
            <p className=" bg-gray-50 px-2 py-3 rounded-lg text-indigo-500 mt-2 font-semibold text-justify">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
