"use client";

import React, { useState } from "react";

interface GallerySectionProps {
  content: {
    headline?: string;
    subheadline?: string;
    videoUrl?: string;
  };
  images: { url: string; altText?: string | null }[];
}

export function GallerySection({ content, images }: GallerySectionProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <section className="py-10 sm:py-14 bg-white border-b border-slate-200/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {content.headline || "প্রোডাক্টের বাস্তব ছবি ও প্যাকেজিং"}
          </h2>
          {content.subheadline && (
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              {content.subheadline}
            </p>
          )}
        </div>

        {/* Main Preview */}
        <div className="max-w-xl mx-auto aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-md">
          <img
            src={images[selectedIdx]?.url || images[0]?.url}
            alt={images[selectedIdx]?.altText || "Product photo"}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
        </div>

        {/* Thumbnail switcher */}
        {images.length > 1 && (
          <div className="flex justify-center items-center gap-3 mt-4 overflow-x-auto py-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIdx(idx)}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                  selectedIdx === idx
                    ? "border-brand-primary ring-2 ring-brand-primary/30 scale-105"
                    : "border-slate-200 opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={img.url}
                  alt={img.altText || `Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
