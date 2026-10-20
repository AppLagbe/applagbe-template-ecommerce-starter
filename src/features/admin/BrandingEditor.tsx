"use client";

import React, { useState, useTransition } from "react";
import { updateBrandingSettings } from "./branding-actions";
import { Palette, Phone, MapPin, Sparkles, Save, CheckCircle2 } from "lucide-react";

interface SiteSettingData {
  storeName: string;
  storeTagline: string;
  logoUrl: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  supportPhone: string;
  whatsappNumber: string;
  supportEmail: string;
  officeAddress: string;
  announcementBar: string;
  isAnnouncementActive: boolean;
}

interface BrandingEditorProps {
  setting: SiteSettingData;
}

export function BrandingEditor({ setting }: BrandingEditorProps) {
  const [primaryColor, setPrimaryColor] = useState(setting.primaryColor);
  const [accentColor, setAccentColor] = useState(setting.accentColor);
  const [isPending, startTransition] = useTransition();
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSavedSuccess(false);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await updateBrandingSettings(formData);
      if (res.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    });
  };

  const presetThemes = [
    { name: "Emerald & Orange (Current)", primary: "#059669", accent: "#ea580c" },
    { name: "Royal Blue & Amber", primary: "#2563eb", accent: "#d97706" },
    { name: "Crimson & Gold", primary: "#dc2626", accent: "#ca8a04" },
    { name: "Midnight Teal & Coral", primary: "#0d9488", accent: "#f97316" },
    { name: "Indigo & Pink", primary: "#4f46e5", accent: "#db2777" },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Branding and theme tokens updated! View live site to see changes.</span>
        </div>
      )}

      {/* Quick Theme Presets */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          One-Click Client Theme Presets
        </span>
        <div className="flex flex-wrap gap-2.5">
          {presetThemes.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => {
                setPrimaryColor(preset.primary);
                setAccentColor(preset.accent);
              }}
              className="px-3 py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 text-xs font-medium flex items-center gap-2 transition"
            >
              <div className="flex -space-x-1">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-white"
                  style={{ backgroundColor: preset.primary }}
                />
                <span
                  className="w-3.5 h-3.5 rounded-full border border-white"
                  style={{ backgroundColor: preset.accent }}
                />
              </div>
              <span className="text-slate-800 font-semibold">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Visual Brand Colors */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Palette className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">Design Tokens & Theme Colors</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Primary Brand Color (Buttons, Badges, Highlights)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-12 h-10 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                />
                <input
                  type="text"
                  name="primaryColor"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Accent / CTA Color (Urgent Buttons, Offer Badges)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-12 h-10 rounded-lg cursor-pointer border border-slate-300 p-0.5"
                />
                <input
                  type="text"
                  name="accentColor"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs uppercase"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Identity & Contact Details */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Phone className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">Identity & Contact Channels</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Store / Client Name
              </label>
              <input
                type="text"
                name="storeName"
                required
                defaultValue={setting.storeName}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tagline / Slogan
              </label>
              <input
                type="text"
                name="storeTagline"
                defaultValue={setting.storeTagline}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Helpline Phone
              </label>
              <input
                type="text"
                name="supportPhone"
                defaultValue={setting.supportPhone}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                WhatsApp Number (880...)
              </label>
              <input
                type="text"
                name="whatsappNumber"
                defaultValue={setting.whatsappNumber}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Support Email
              </label>
              <input
                type="email"
                name="supportEmail"
                defaultValue={setting.supportEmail}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Office / Warehouse Address
              </label>
              <input
                type="text"
                name="officeAddress"
                defaultValue={setting.officeAddress}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Announcement Bar */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">Top Announcement Bar</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Announcement Message
              </label>
              <input
                type="text"
                name="announcementBar"
                defaultValue={setting.announcementBar}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isAnnouncementActive"
                id="isAnnouncementActive"
                defaultChecked={setting.isAnnouncementActive}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <label
                htmlFor="isAnnouncementActive"
                className="text-xs font-medium text-slate-700 cursor-pointer"
              >
                Display top banner across storefront
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2 disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            <span>Save Branding & Theme Tokens</span>
          </button>
        </div>
      </form>
    </div>
  );
}
