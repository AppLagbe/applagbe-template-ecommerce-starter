"use client";

import React from "react";
import { Check, Sparkles, Truck } from "lucide-react";
import { formatBDT } from "@/lib/utils";

export interface BundleItem {
  id: string;
  badge: string;
  title: string;
  description?: string | null;
  itemQuantity: number;
  bundlePrice: number;
  regularPrice?: number | null;
  freeDelivery: boolean;
  isDefault: boolean;
}

interface BundleOfferSectionProps {
  content: {
    headline?: string;
    subheadline?: string;
  };
  bundles: BundleItem[];
  selectedBundleId: string;
  onSelectBundle: (bundleId: string) => void;
}

export function BundleOfferSection({
  content,
  bundles,
  selectedBundleId,
  onSelectBundle,
}: BundleOfferSectionProps) {
  if (!bundles || bundles.length === 0) return null;

  const handleSelect = (id: string) => {
    onSelectBundle(id);
    const checkoutEl = document.getElementById("checkout");
    if (checkoutEl) {
      checkoutEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="bundles" className="py-12 sm:py-16 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>স্পেশাল প্যাকেজ অফার</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {content.headline || "আপনার পছন্দের অফারটি বেছে নিন"}
          </h2>
          {content.subheadline && (
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              {content.subheadline}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {bundles.map((bundle) => {
            const isSelected = selectedBundleId === bundle.id;
            const savings = bundle.regularPrice
              ? Math.round(bundle.regularPrice - bundle.bundlePrice)
              : 0;

            return (
              <div
                key={bundle.id}
                onClick={() => handleSelect(bundle.id)}
                className={`relative rounded-2xl cursor-pointer p-6 flex flex-col justify-between transition-all duration-200 border-2 ${
                  isSelected
                    ? "border-brand-primary bg-emerald-50/40 shadow-xl ring-2 ring-brand-primary/20 scale-[1.02]"
                    : "border-slate-200 bg-white hover:border-slate-300 shadow-sm"
                }`}
              >
                {/* Top Badge */}
                {bundle.badge && (
                  <div
                    className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-bold shadow-xs whitespace-nowrap ${
                      isSelected
                        ? "bg-brand-primary text-white"
                        : "bg-slate-800 text-white"
                    }`}
                  >
                    {bundle.badge}
                  </div>
                )}

                <div className="space-y-4 pt-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      {bundle.title}
                    </h3>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? "border-brand-primary bg-brand-primary text-white"
                          : "border-slate-300"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-3" />}
                    </div>
                  </div>

                  {bundle.description && (
                    <p className="text-xs sm:text-sm text-slate-600">
                      {bundle.description}
                    </p>
                  )}

                  {/* Pricing */}
                  <div className="pt-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                        {formatBDT(bundle.bundlePrice)}
                      </span>
                      {bundle.regularPrice && (
                        <span className="text-sm text-slate-400 line-through">
                          {formatBDT(bundle.regularPrice)}
                        </span>
                      )}
                    </div>

                    {savings > 0 && (
                      <p className="text-xs font-bold text-emerald-600 mt-1">
                        সাশ্রয়: {formatBDT(savings)}
                      </p>
                    )}
                  </div>

                  {/* Free delivery perk */}
                  {bundle.freeDelivery && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-semibold">
                      <Truck className="w-3.5 h-3.5 text-emerald-700" />
                      <span>ফ্রি ডেলিভারি প্রযোজ্য</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all ${
                      isSelected
                        ? "bg-brand-primary text-white shadow-md"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {isSelected ? "✓ নির্বাচিত প্যাকেজ" : "এই প্যাকেজটি নিন"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
