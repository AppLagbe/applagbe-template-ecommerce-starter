"use client";

import React from "react";
import { ArrowDown, ShoppingBag } from "lucide-react";
import { formatBDT } from "@/lib/utils";

interface StickyMobileBarProps {
  price: number;
  productName: string;
}

export function StickyMobileBar({ price, productName }: StickyMobileBarProps) {
  const scrollToCheckout = () => {
    const el = document.getElementById("checkout");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-floating px-4 py-2.5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <span className="text-[11px] text-slate-500 font-semibold block leading-none">
            শুরু মাত্র
          </span>
          <span className="text-xl font-black text-brand-primary">
            {formatBDT(price)}
          </span>
        </div>

        <button
          onClick={scrollToCheckout}
          className="flex-1 max-w-[210px] py-3 px-4 rounded-xl bg-brand-accent hover:bg-brand-accent-hover text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>অর্ডার করুন</span>
        </button>
      </div>
    </div>
  );
}
