import React from "react";
import { Star, CheckCircle, Quote } from "lucide-react";

interface ReviewItem {
  name: string;
  city: string;
  rating: number;
  comment: string;
  date?: string;
}

interface ReviewsSectionProps {
  content: {
    headline?: string;
    subheadline?: string;
    reviews?: ReviewItem[];
  };
}

export function ReviewsSection({ content }: ReviewsSectionProps) {
  const reviews = content.reviews || [
    {
      name: "তানভীর হাসান",
      city: "ধানমন্ডি, ঢাকা",
      rating: 5,
      comment: "মধুর ঘ্রাণ এবং স্বাদ অসাধারণ! বাজারের প্যাকেটজাত মধুর চেয়ে অনেক ভালো। ডেলিভারিও মাত্র ২৪ ঘণ্টার মধ্যে পেয়েছি।",
      date: "২ দিন আগে",
    },
    {
      name: "ডাঃ ফারহানা কবির",
      city: "পাঁচলাইশ, চট্টগ্রাম",
      rating: 5,
      comment: "আমার পরিবারের জন্য নিয়মিত মধু দরকার হয়। এই মধুর ঘনত্ব ও পিউরিটি এক কথায় চমৎকার। নিশ্চিন্তে সবাই নিতে পারেন।",
      date: "৪ দিন আগে",
    },
    {
      name: "মোঃ রফিকুল ইসলাম",
      city: "উপশহর, সিলেট",
      rating: 5,
      comment: "২টি জারের অফারটি নিয়েছিলাম। ক্যাশ অন ডেলিভারিতে চেক করে নিয়েছি। সার্ভিস খুবই ভালো। ধন্যবাদ App Lagbe টিমকে।",
      date: "১ সপ্তাহ আগে",
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-slate-200/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {content.headline || "গ্রাহকদের সন্তুষ্টি ও রিভিউ"}
          </h2>
          {content.subheadline && (
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              {content.subheadline}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200/80 flex flex-col justify-between space-y-4 hover:shadow-sm transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-slate-300" />
                </div>
                <p className="text-sm text-slate-700 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1">
                    <span>{rev.name}</span>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                  </div>
                  <span className="text-slate-500">{rev.city}</span>
                </div>
                {rev.date && <span className="text-slate-400">{rev.date}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
