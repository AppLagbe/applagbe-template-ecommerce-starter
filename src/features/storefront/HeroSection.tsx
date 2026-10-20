"use client";

import React from "react";
import { Star, ShieldCheck, Truck, Clock, ArrowDown } from "lucide-react";
import { formatBDT } from "@/lib/utils";

interface HeroSectionProps {
  content: {
    headline?: string;
    highlightText?: string;
    subheadline?: string;
    ctaButtonText?: string;
    badgeText?: string;
    stockLeftText?: string;
    guaranteeBadge?: string;
  };
  product: {
    name: string;
    basePrice: number;
    comparePrice?: number | null;
    images: { url: string; altText?: string | null }[];
  };
}

export function HeroSection({ content, product }: HeroSectionProps) {
  const scrollToCheckout = () => {
    const el = document.getElementById("checkout");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const primaryImage =
    product.images[0]?.url ||
    "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80";

  const discountAmount = product.comparePrice
    ? Math.round(product.comparePrice - product.basePrice)
    : 0;
  const discountPercentage = product.comparePrice
    ? Math.round(((product.comparePrice - product.basePrice) / product.comparePrice) * 100)
    : 0;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-white py-8 sm:py-14 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left order-2 lg:order-1">
            {/* Offer badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/80 border border-orange-200 text-brand-accent text-xs sm:text-sm font-bold">
              <span className="flex h-2 w-2 rounded-full bg-brand-accent animate-ping" />
              <span>{content.badgeText || "🔥 আজকের বিশেষ অফার চলছে"}</span>
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight sm:leading-tight">
              {content.headline || product.name}{" "}
              {content.highlightText && (
                <span className="text-brand-primary underline decoration-brand-accent/40 decoration-wavy decoration-2">
                  {content.highlightText}
                </span>
              )}
            </h1>

            {/* Subheadline */}
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {content.subheadline ||
                "১০০% খাঁটি ও নির্ভেজাল পণ্য। ঘরে বসে অর্ডার করুন এবং ডেলিভারিম্যানের কাছ থেকে বুঝে পেয়ে মূল্য পরিশোধ করুন।"}
            </p>

            {/* Social Proof Star Ratings */}
            <div className="flex items-center justify-center lg:justify-start gap-2 pt-1">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                ))}
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-700">
                ৪.৯/৫ (৪,৮৫০+ ভেরিফাইড রিভিউ)
              </span>
            </div>

            {/* Price Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-emerald-100 shadow-brand flex flex-wrap items-baseline justify-center lg:justify-start gap-3 sm:gap-4">
              <span className="text-3xl sm:text-4xl font-extrabold text-brand-primary">
                {formatBDT(product.basePrice)}
              </span>
              {product.comparePrice && (
                <span className="text-lg sm:text-xl text-slate-400 line-through">
                  {formatBDT(product.comparePrice)}
                </span>
              )}
              {discountPercentage > 0 && (
                <span className="bg-rose-100 text-rose-700 text-xs sm:text-sm font-bold px-2.5 py-1 rounded-md border border-rose-200">
                  {discountPercentage}% ছাড় (সাশ্রয় {formatBDT(discountAmount)})
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <button
                onClick={scrollToCheckout}
                className="w-full sm:w-auto px-8 py-4 rounded-brand bg-brand-accent hover:bg-brand-accent-hover text-white font-extrabold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-2"
              >
                <span>{content.ctaButtonText || "অর্ডার করতে ক্লিক করুন"}</span>
                <ArrowDown className="w-5 h-5 animate-bounce" />
              </button>

              <div className="text-xs sm:text-sm text-slate-500 flex items-center justify-center gap-1.5 font-medium">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>{content.stockLeftText || "মাত্র ১৮টি স্টক বাকি আছে!"}</span>
              </div>
            </div>

            {/* Guarantees mini checklist */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-3 border-t border-slate-200/60 text-xs font-medium text-slate-700">
              <div className="flex items-center gap-1.5 justify-center lg:justify-start">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>ক্যাশ অন ডেলিভারি</span>
              </div>
              <div className="flex items-center gap-1.5 justify-center lg:justify-start">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>দ্রুত হোম ডেলিভারি</span>
              </div>
              <div className="flex items-center gap-1.5 justify-center lg:justify-start col-span-2 sm:col-span-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                <span>১০০% খাঁটি পণ্যের গ্যারান্টি</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Image */}
          <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 group">
              <img
                src={primaryImage}
                alt={product.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-emerald-600 text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>অরিজিনাল প্রোডাক্ট</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
