import React from "react";
import { Phone, MessageCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  storeName: string;
  storeTagline?: string;
  logoUrl?: string;
  supportPhone: string;
  whatsappNumber: string;
}

export function Header({
  storeName,
  storeTagline,
  logoUrl,
  supportPhone,
  whatsappNumber,
}: HeaderProps) {
  const whatsappClean = whatsappNumber.replace(/[^0-9]/g, "");

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand logo / name */}
        <Link href="/" className="flex items-center gap-3 group">
          {logoUrl ? (
            <img src={logoUrl} alt={storeName} className="h-9 sm:h-11 w-auto object-contain" />
          ) : (
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-brand bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-primary font-bold text-lg sm:text-xl">
              {storeName.slice(0, 1)}
            </div>
          )}
          <div>
            <h1 className="text-base sm:text-xl font-extrabold text-slate-900 group-hover:text-brand-primary transition-colors leading-tight">
              {storeName}
            </h1>
            {storeTagline && (
              <p className="text-[11px] sm:text-xs text-slate-500 hidden sm:block">
                {storeTagline}
              </p>
            )}
          </div>
        </Link>

        {/* Quick Contact & Trust */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>১০০% ক্যাশ অন ডেলিভারি</span>
          </div>

          <a
            href={`https://wa.me/${whatsappClean}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-xs"
            title="WhatsApp এ কথা বলুন"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden xs:inline">WhatsApp</span>
          </a>

          <a
            href={`tel:${supportPhone}`}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-full bg-slate-100 text-slate-800 hover:bg-slate-200 transition"
            title="সরাসরি কল করুন"
          >
            <Phone className="w-3.5 h-3.5 text-brand-primary" />
            <span className="font-mono">{supportPhone}</span>
          </a>
        </div>
      </div>
    </header>
  );
}
