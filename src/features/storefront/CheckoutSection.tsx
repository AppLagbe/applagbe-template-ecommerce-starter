"use client";

import React, { useState, useTransition } from "react";
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertCircle,
  Phone,
  User,
  MapPin,
  FileText,
  Package,
  MessageCircle,
} from "lucide-react";
import { formatBDT, validateBDPhone } from "@/lib/utils";
import { BANGLADESH_DISTRICTS } from "@/lib/districts";
import { placeOrder, PlaceOrderResult } from "@/features/checkout/actions";
import { BundleItem } from "./BundleOfferSection";

interface DeliveryZoneOption {
  code: string;
  name: string;
  charge: number;
}

interface CheckoutSectionProps {
  content: {
    headline?: string;
    subheadline?: string;
    buttonLabel?: string;
  };
  product: {
    id: string;
    name: string;
    basePrice: number;
  };
  bundles: BundleItem[];
  deliveryZones: DeliveryZoneOption[];
  selectedBundleId: string;
  onSelectBundle: (id: string) => void;
  supportPhone: string;
  whatsappNumber: string;
}

export function CheckoutSection({
  content,
  product,
  bundles,
  deliveryZones,
  selectedBundleId,
  onSelectBundle,
  supportPhone,
  whatsappNumber,
}: CheckoutSectionProps) {
  // Form states
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [district, setDistrict] = useState("Dhaka");
  const [fullAddress, setFullAddress] = useState("");
  const [deliveryZoneCode, setDeliveryZoneCode] = useState("inside_dhaka");
  const [notes, setNotes] = useState("");

  const [formError, setFormError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<PlaceOrderResult | null>(null);
  const [isPending, startTransition] = useTransition();

  // Find selected bundle
  const activeBundle = bundles.find((b) => b.id === selectedBundleId) || bundles[0];

  // Active delivery zone
  const activeZone =
    deliveryZones.find((z) => z.code === deliveryZoneCode) ||
    deliveryZones[0] || { code: "inside_dhaka", name: "ঢাকা সিটি", charge: 70 };

  // Calculate pricing client-side for immediate visual response
  const subtotal = activeBundle ? activeBundle.bundlePrice : product.basePrice;
  const isFreeDelivery = activeBundle ? activeBundle.freeDelivery : false;
  const deliveryCharge = isFreeDelivery ? 0 : activeZone.charge;
  const totalAmount = subtotal + deliveryCharge;

  // Phone validation status
  const phoneValidation = validateBDPhone(customerPhone);
  const hasPhoneInput = customerPhone.trim().length > 0;

  // Handle District change & auto-detect default zone
  const handleDistrictChange = (distName: string) => {
    setDistrict(distName);
    const matched = BANGLADESH_DISTRICTS.find(
      (d) => d.nameEn.toLowerCase() === distName.toLowerCase() || d.nameBn === distName
    );
    if (matched) {
      setDeliveryZoneCode(matched.defaultZone);
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!customerName.trim()) {
      setFormError("অনুগ্রহ করে আপনার নাম লিখুন।");
      return;
    }

    if (!phoneValidation.isValid) {
      setFormError("অনুগ্রহ করে ১১ ডিজিটের সঠিক বাংলাদেশী মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)।");
      return;
    }

    if (!fullAddress.trim() || fullAddress.trim().length < 5) {
      setFormError("অনুগ্রহ করে আপনার সম্পূর্ণ বিস্তারিত ঠিকানা (বাড়ি/রোড/এলাকা) লিখুন।");
      return;
    }

    startTransition(async () => {
      const result = await placeOrder({
        customerName,
        customerPhone,
        district,
        fullAddress,
        deliveryZoneCode,
        productId: product.id,
        bundleId: activeBundle ? activeBundle.id : undefined,
        notes,
      });

      if (!result.success) {
        setFormError(result.error || "অর্ডার সম্পন্ন করতে ব্যর্থ হয়েছে।");
      } else {
        setOrderSuccess(result);
      }
    });
  };

  return (
    <section id="checkout" className="py-12 sm:py-20 bg-slate-100 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Order Success Card */}
        {orderSuccess ? (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-emerald-500 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600">
                অর্ডার সফলভাবে গ্রহণ করা হয়েছে
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                ধন্যবাদ, {orderSuccess.customerName}!
              </h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                আপনার অর্ডারটি সফলভাবে ডাটাবেজে রেকর্ড করা হয়েছে। আমাদের কাস্টমার কেয়ার টিম শীঘ্রই ফোন করে অর্ডার কনফার্ম করবে।
              </p>
            </div>

            {/* Order Invoice Snapshot */}
            <div className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-200 text-left space-y-3 max-w-lg mx-auto text-sm">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 font-bold">
                <span className="text-slate-600">অর্ডার নম্বর:</span>
                <span className="font-mono text-brand-primary text-base">
                  {orderSuccess.orderNumber}
                </span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>পণ্য:</span>
                <span className="font-semibold text-right">{orderSuccess.bundleTitle}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>ফোন নম্বর:</span>
                <span className="font-mono">{orderSuccess.customerPhone}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>ঠিকানা:</span>
                <span className="text-right">
                  {orderSuccess.fullAddress}, {orderSuccess.district}
                </span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>ডেলিভারি চার্জ:</span>
                <span>
                  {orderSuccess.deliveryCharge === 0 ? "ফ্রি" : formatBDT(orderSuccess.deliveryCharge || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200 font-extrabold text-base text-slate-900">
                <span>সর্বমোট প্রদেয় মূল্য (ক্যাশ অন ডেলিভারি):</span>
                <span className="text-brand-accent text-lg">
                  {formatBDT(orderSuccess.totalAmount || 0)}
                </span>
              </div>
            </div>

            {/* Support Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=Hello, I have placed order ${orderSuccess.orderNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-brand bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp এ অর্ডার আপডেট জানুন</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setOrderSuccess(null);
                  setCustomerName("");
                  setCustomerPhone("");
                  setFullAddress("");
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-brand bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-sm"
              >
                আরেকটি অর্ডার করুন
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden">
            {/* Header Banner */}
            <div className="bg-brand-primary p-6 sm:p-8 text-white text-center space-y-2">
              <h2 className="text-xl sm:text-3xl font-black">
                {content.headline || "অর্ডার কনফার্ম করতে নিচের ফর্মটি পূরণ করুন"}
              </h2>
              <p className="text-emerald-100 text-xs sm:text-sm max-w-lg mx-auto">
                {content.subheadline ||
                  "কোনো অগ্রিম পেমেন্ট নেই! পণ্য হাতে পেয়ে ডেলিভারিম্যানকে টাকা পরিশোধ করবেন।"}
              </p>
            </div>

            <form onSubmit={handleSubmitOrder} className="p-6 sm:p-8 space-y-6">
              
              {/* Error Alert */}
              {formError && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {/* 1. Bundle Selection in Checkout */}
              {bundles.length > 0 && (
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    ১. আপনার পছন্দের অফারটি নির্বাচন করুন
                  </label>
                  <div className="grid grid-cols-1 gap-2.5">
                    {bundles.map((bundle) => {
                      const isSelected = activeBundle?.id === bundle.id;
                      return (
                        <div
                          key={bundle.id}
                          onClick={() => onSelectBundle(bundle.id)}
                          className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            isSelected
                              ? "border-brand-primary bg-emerald-50/50 shadow-sm"
                              : "border-slate-200 hover:border-slate-300 bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="bundle"
                              checked={isSelected}
                              onChange={() => onSelectBundle(bundle.id)}
                              className="w-4 h-4 text-brand-primary focus:ring-brand-primary"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 text-sm sm:text-base">
                                  {bundle.title}
                                </span>
                                {bundle.badge && (
                                  <span className="text-[10px] sm:text-xs font-extrabold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                                    {bundle.badge}
                                  </span>
                                )}
                              </div>
                              {bundle.freeDelivery && (
                                <span className="text-xs font-semibold text-emerald-600 block mt-0.5">
                                  ✓ ফ্রি ডেলিভারি
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="text-base sm:text-lg font-black text-slate-900 shrink-0">
                            {formatBDT(bundle.bundlePrice)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. Customer Contact Details */}
              <div className="space-y-4 pt-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  ২. আপনার নাম ও ডেলিভারি তথ্য
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      আপনার নাম <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="আপনার পুরো নাম লিখুন"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      মোবাইল নম্বর <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="017XXXXXXXX"
                        maxLength={14}
                        className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                          hasPhoneInput
                            ? phoneValidation.isValid
                              ? "border-emerald-500 ring-2 ring-emerald-100"
                              : "border-rose-400 ring-2 ring-rose-100"
                            : "border-slate-300 focus:ring-brand-primary/20 focus:border-brand-primary"
                        }`}
                      />
                      {hasPhoneInput && (
                        <div className="absolute right-3.5 top-3 flex items-center">
                          {phoneValidation.isValid ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <span className="text-[10px] text-rose-500 font-bold">ভুল নম্বর</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* District Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      জেলা (District) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                      <select
                        value={district}
                        onChange={(e) => handleDistrictChange(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                      >
                        {BANGLADESH_DISTRICTS.map((d) => (
                          <option key={d.nameEn} value={d.nameEn}>
                            {d.nameBn} ({d.nameEn})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Delivery Location Zone (Auto-updated or manually selectable) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      ডেলিভারি এরিয়া <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={deliveryZoneCode}
                      onChange={(e) => setDeliveryZoneCode(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                    >
                      {deliveryZones.map((z) => (
                        <option key={z.code} value={z.code}>
                          {z.name} - {isFreeDelivery ? "ফ্রি" : formatBDT(z.charge)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Full Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    সম্পূর্ণ বিস্তারিত ঠিকানা (বাসা/রোড/এলাকা/থানা){" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={fullAddress}
                    onChange={(e) => setFullAddress(e.target.value)}
                    placeholder="যেমন: বাড়ি নং ১২, রোড নং ৫, ব্লক সি, মিরপুর ১০, ঢাকা"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                  />
                </div>

                {/* Order notes */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    অর্ডার সংক্রান্ত কোনো বিশেষ নির্দেশনা (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="যেমন: বিকেলে ডেলিভারি দিলে ভালো হয়"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 focus:outline-none focus:border-slate-400"
                  />
                </div>
              </div>

              {/* 3. Payment Method */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  ৩. পেমেন্ট মেথড
                </label>
                <div className="p-4 rounded-xl border-2 border-emerald-500 bg-emerald-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-brand-primary flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 text-sm sm:text-base">
                        ক্যাশ অন ডেলিভারি (Cash on Delivery)
                      </span>
                      <p className="text-xs text-slate-600">
                        পণ্য হাতে পেয়ে দেখে মূল্য পরিশোধ করুন।
                      </p>
                    </div>
                  </div>
                  <ShieldCheck className="w-6 h-6 text-brand-primary shrink-0" />
                </div>
              </div>

              {/* 4. Live Order Calculation Summary */}
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 space-y-2.5 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>পণ্যের মূল্য:</span>
                  <span className="font-semibold text-slate-900">{formatBDT(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>ডেলিভারি চার্জ:</span>
                  <span className="font-semibold text-slate-900">
                    {deliveryCharge === 0 ? (
                      <span className="text-emerald-600 font-bold">ফ্রি (০ ৳)</span>
                    ) : (
                      formatBDT(deliveryCharge)
                    )}
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-2.5 flex justify-between items-baseline font-black text-slate-900 text-base sm:text-lg">
                  <span>সর্বমোট প্রদেয় বিল:</span>
                  <span className="text-brand-accent text-xl sm:text-2xl font-black">
                    {formatBDT(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full py-4 rounded-brand bg-brand-accent hover:bg-brand-accent-hover text-white font-black text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all transform active:scale-[0.99] disabled:opacity-75 disabled:cursor-wait flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>অর্ডার প্রসেস হচ্ছে...</span>
                  </>
                ) : (
                  <span>
                    {content.buttonLabel || "অর্ডার সম্পন্ন করুন (ক্যাশ অন ডেলিভারি)"}
                  </span>
                )}
              </button>

              <div className="text-center text-xs text-slate-500 flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>আপনার সকল তথ্য সম্পূর্ণ সুরক্ষিত ও গোপন রাখা হবে</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
