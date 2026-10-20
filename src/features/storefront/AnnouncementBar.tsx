import React from "react";
import { Sparkles } from "lucide-react";

interface AnnouncementBarProps {
  message?: string;
  isActive?: boolean;
}

export function AnnouncementBar({
  message = "⚡ সারাদেশে ক্যাশ অন ডেলিভারি সুবিধা! হোম ডেলিভারি ৩-৫ কর্মদিবস",
  isActive = true,
}: AnnouncementBarProps) {
  if (!isActive || !message) return null;

  return (
    <div className="bg-brand-primary text-white text-xs sm:text-sm py-2 px-4 text-center font-medium shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 shrink-0 animate-pulse text-amber-300" />
        <span className="tracking-wide">{message}</span>
      </div>
    </div>
  );
}
