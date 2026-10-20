import React from "react";
import { ShieldCheck, Truck, RotateCcw, Heart } from "lucide-react";
import Link from "next/link";

interface FooterProps {
  storeName: string;
  storeTagline?: string;
  supportPhone: string;
  supportEmail: string;
  officeAddress: string;
}

export function Footer({
  storeName,
  storeTagline,
  supportPhone,
  supportEmail,
  officeAddress,
}: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-24 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-10 border-b border-slate-800 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">১০০% ক্যাশ অন ডেলিভারি</h4>
              <p className="text-xs text-slate-400">পার্সেল দেখে টাকা পরিশোধ</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">সারাদেশে হোম ডেলিভারি</h4>
              <p className="text-xs text-slate-400">২৪-৭২ ঘণ্টার মধ্যে সরবরাহ</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">৭ দিনের সহজ রিটার্ন</h4>
              <p className="text-xs text-slate-400">কোনো সমস্যা হলে তাৎক্ষণিক পরিবর্তন</p>
            </div>
          </div>
        </div>

        {/* Store info & contact */}
        <div className="py-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-lg font-black text-white">{storeName}</h3>
            {storeTagline && <p className="text-xs text-slate-400 mt-1">{storeTagline}</p>}
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              ঠিকানা: {officeAddress}
            </p>
          </div>

          <div className="space-y-2 text-xs sm:text-right">
            <div>
              <span className="text-slate-400">হেল্পলাইন: </span>
              <a href={`tel:${supportPhone}`} className="text-white font-mono font-bold hover:text-emerald-400 transition">
                {supportPhone}
              </a>
            </div>
            <div>
              <span className="text-slate-400">ইমেইল: </span>
              <a href={`mailto:${supportEmail}`} className="text-white hover:text-emerald-400 transition">
                {supportEmail}
              </a>
            </div>
            <div className="pt-2">
              <Link href="/admin/login" className="text-[11px] text-slate-500 hover:text-slate-300 underline">
                Admin Portal
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-slate-800/80 text-center text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} {storeName}. Built with App Lagbe Commerce Starter. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
