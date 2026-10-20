import React from "react";
import { MousePointerClick, MapPin, Truck } from "lucide-react";

interface StepItem {
  stepNumber: string;
  title: string;
  desc: string;
}

interface UsageStepsSectionProps {
  content: {
    headline?: string;
    subheadline?: string;
    steps?: StepItem[];
  };
}

export function UsageStepsSection({ content }: UsageStepsSectionProps) {
  const steps = content.steps || [
    {
      stepNumber: "০১",
      title: "প্যাকেজ নির্বাচন করুন",
      desc: "নিচের ফর্ম থেকে আপনার পছন্দের বান্ডিল বা পরিমাণ সিলেক্ট করুন।",
    },
    {
      stepNumber: "০২",
      title: "নাম ও ঠিকানা দিন",
      desc: "আপনার নাম, মোবাইল নম্বর এবং সঠিক ডেলিভারি ঠিকানা লিখুন।",
    },
    {
      stepNumber: "০৩",
      title: "পণ্য দেখে টাকা দিন",
      desc: "ডেলিভারি ম্যানের কাছ থেকে পার্সেল বুঝে পেয়ে মূল্য পরিশোধ করুন।",
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-slate-200/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {content.headline || "সহজ ৩ ধাপে অর্ডার সম্পন্ন করুন"}
          </h2>
          {content.subheadline && (
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              {content.subheadline}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center text-center space-y-3"
            >
              <span className="text-3xl font-black text-brand-primary opacity-80">
                {step.stepNumber}
              </span>
              <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
