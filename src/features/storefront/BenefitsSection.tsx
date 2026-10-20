import React from "react";
import { CheckCircle2, ShieldCheck, HeartHandshake, Sparkles, Award, Zap } from "lucide-react";

interface BenefitItem {
  title: string;
  desc: string;
  icon?: string;
}

interface BenefitsSectionProps {
  content: {
    headline?: string;
    subheadline?: string;
    items?: BenefitItem[];
  };
}

const iconMap: Record<string, React.ElementType> = {
  CheckCircle2,
  ShieldCheck,
  HeartHandshake,
  Sparkles,
  Award,
  Zap,
};

export function BenefitsSection({ content }: BenefitsSectionProps) {
  const items = content.items || [
    {
      title: "১০০% প্রাকৃতিক ও খাঁটি",
      desc: "কোনো কৃত্রিম ফ্লেভার, প্রিজারভেটিভ বা চিনি মেশানো হয় না।",
      icon: "CheckCircle2",
    },
    {
      title: "রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি",
      desc: "ন্যাচারাল এনজাইম ও অ্যান্টিঅক্সিডেন্ট শরীরের ইমিউনো সিস্টেম শক্তিশালী করে।",
      icon: "ShieldCheck",
    },
    {
      title: "সর্দি-কাশি ও গলার উপশম",
      desc: "সকালে হালকা গরম পানির সাথে বা তুলসী পাতার সাথে সেবন অত্যন্ত কার্যকর।",
      icon: "HeartHandshake",
    },
    {
      title: "সরাসরি মৌয়ালদের সংগ্রহ",
      desc: "মাঝখানে কোনো মধ্যস্বত্বভোগী নেই, তাই সেরা মানের নিশ্চয়তা।",
      icon: "Sparkles",
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {content.headline || "কেন আমাদের পণ্যটি সেরা?"}
          </h2>
          {content.subheadline && (
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              {content.subheadline}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => {
            const IconComponent = (item.icon && iconMap[item.icon]) || CheckCircle2;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow duration-200 text-center sm:text-left space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-brand-primary flex items-center justify-center mx-auto sm:mx-0">
                  <IconComponent className="w-6 h-6 text-brand-primary" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
