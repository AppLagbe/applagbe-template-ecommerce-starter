"use client";

import React, { useState } from "react";
import { HeroSection } from "./HeroSection";
import { GallerySection } from "./GallerySection";
import { BenefitsSection } from "./BenefitsSection";
import { UsageStepsSection } from "./UsageStepsSection";
import { BundleOfferSection, BundleItem } from "./BundleOfferSection";
import { ReviewsSection } from "./ReviewsSection";
import { FAQSection } from "./FAQSection";
import { CheckoutSection } from "./CheckoutSection";
import { StickyMobileBar } from "./StickyMobileBar";

interface SectionConfigData {
  id: string;
  sectionKey: string;
  title?: string | null;
  isEnabled: boolean;
  sortOrder: number;
  publishedContent: string;
  draftContent: string;
}

interface LandingPageRendererProps {
  sections: SectionConfigData[];
  product: any;
  deliveryZones: any[];
  siteSetting: any;
  isPreview?: boolean;
}

export function LandingPageRenderer({
  sections,
  product,
  deliveryZones,
  siteSetting,
  isPreview = false,
}: LandingPageRendererProps) {
  // Sort sections by sortOrder
  const sortedSections = [...sections]
    .filter((s) => (isPreview ? true : s.isEnabled))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  // Default selected bundle (first bundle marked default or first in list)
  const defaultBundle =
    product.bundles?.find((b: any) => b.isDefault) || product.bundles?.[0];
  const [selectedBundleId, setSelectedBundleId] = useState<string>(
    defaultBundle?.id || ""
  );

  const activeBundle = product.bundles?.find(
    (b: any) => b.id === selectedBundleId
  );
  const activePrice = activeBundle
    ? activeBundle.bundlePrice
    : product.basePrice;

  // Helper to safely parse section content
  const parseContent = (section: SectionConfigData) => {
    try {
      const jsonStr = isPreview
        ? section.draftContent || section.publishedContent
        : section.publishedContent;
      return JSON.parse(jsonStr || "{}");
    } catch {
      return {};
    }
  };

  return (
    <main className="min-h-screen">
      {isPreview && (
        <div className="bg-amber-500 text-slate-900 py-2 px-4 text-center font-bold text-xs sticky top-0 z-50 shadow-md">
          ⚠️ প্রিভিউ মোড চালু আছে (Previewing Draft Content)
        </div>
      )}

      {sortedSections.map((sec) => {
        const content = parseContent(sec);

        switch (sec.sectionKey) {
          case "hero":
            return (
              <HeroSection
                key={sec.id}
                content={content}
                product={product}
              />
            );

          case "gallery":
            return (
              <GallerySection
                key={sec.id}
                content={content}
                images={product.images || []}
              />
            );

          case "benefits":
            return <BenefitsSection key={sec.id} content={content} />;

          case "steps":
            return <UsageStepsSection key={sec.id} content={content} />;

          case "bundles":
            return (
              <BundleOfferSection
                key={sec.id}
                content={content}
                bundles={product.bundles || []}
                selectedBundleId={selectedBundleId}
                onSelectBundle={setSelectedBundleId}
              />
            );

          case "reviews":
            return <ReviewsSection key={sec.id} content={content} />;

          case "faq":
            return <FAQSection key={sec.id} content={content} />;

          case "checkout":
            return (
              <CheckoutSection
                key={sec.id}
                content={content}
                product={product}
                bundles={product.bundles || []}
                deliveryZones={deliveryZones}
                selectedBundleId={selectedBundleId}
                onSelectBundle={setSelectedBundleId}
                supportPhone={siteSetting.supportPhone}
                whatsappNumber={siteSetting.whatsappNumber}
              />
            );

          default:
            return null;
        }
      })}

      {/* Floating CTA bar on mobile */}
      <StickyMobileBar price={activePrice} productName={product.name} />
    </main>
  );
}
