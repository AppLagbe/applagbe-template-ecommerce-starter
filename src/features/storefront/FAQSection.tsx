"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
}

interface FAQSectionProps {
  content: {
    headline?: string;
    subheadline?: string;
    faqs?: FAQItem[];
  };
}

export function FAQSection({ content }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = content.faqs || [
    {
      q: "ডেলিভারি চার্জ কত এবং কতদিনে পাবো?",
      a: "ঢাকা সিটির ভেতরে ডেলিভারি চার্জ মাত্র ৭০ টাকা (২৪-৪৮ ঘণ্টায় ডেলিভারি)। ঢাকা সিটির বাইরে ১৩০ টাকা (৩-৫ দিন)। তবে ৩টি জারের বান্ডিলে ডেলিভারি সম্পূর্ণ ফ্রি!",
    },
    {
      q: "আমি কি পণ্য চেক করে টাকা দিতে পারবো?",
      a: "হ্যাঁ, অবশ্যই! ডেলিভারি ম্যান থাকা অবস্থায় পার্সেল খুলে চেক করে তারপর মূল্য পরিশোধ করতে পারবেন।",
    },
    {
      q: "মধু জমে গেলে কি সেটা ভেজাল?",
      a: "না, প্রাকৃতিক খাঁটি মধু বিশেষ করে খলিশা বা সরিষা ফুলের মধু ঠান্ডা আবহাওয়ায় জমে যাওয়া একটি স্বাভাবিক প্রাকৃতিক বৈশিষ্ট্য। এতে মধুর গুণাগুণ নষ্ট হয় না।",
    },
    {
      q: "অগ্রিম কোনো টাকা দিতে হবে কি?",
      a: "না, আমাদের কাছে অর্ডারের জন্য কোনো অগ্রিম টাকা দেওয়ার প্রয়োজন নেই। আপনি ১০০% ক্যাশ অন ডেলিভারিতে নিতে পারবেন।",
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200/60">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {content.headline || "সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)"}
          </h2>
          {content.subheadline && (
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              {content.subheadline}
            </p>
          )}
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-brand-primary transition"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-brand-primary" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
