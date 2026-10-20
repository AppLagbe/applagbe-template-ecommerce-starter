"use client";

import React, { useState, useTransition } from "react";
import { formatBDT } from "@/lib/utils";
import { updateProductDetails, updateBundleOffer } from "./product-actions";
import { Package, AlertTriangle, Save, CheckCircle2 } from "lucide-react";

interface ProductEditorProps {
  product: any;
}

export function ProductEditor({ product }: ProductEditorProps) {
  const [isPending, startTransition] = useTransition();
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSavedSuccess(false);
    const formData = new FormData(e.currentTarget);
    formData.append("id", product.id);

    startTransition(async () => {
      const res = await updateProductDetails(formData);
      if (res.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    });
  };

  const handleBundleSave = (bId: string, bPrice: number, regPrice: number) => {
    startTransition(async () => {
      await updateBundleOffer(bId, bPrice, regPrice);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    });
  };

  const isLowStock = product.stockQuantity <= product.lowStockAlert;

  return (
    <div className="space-y-6">
      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Product and inventory changes saved successfully!</span>
        </div>
      )}

      {/* Main Product Info Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-5"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Core Product & Inventory
            </h3>
          </div>
          {isLowStock && (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
              <span>Low Stock Warning</span>
            </span>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Product Title / Headline
            </label>
            <input
              type="text"
              name="name"
              required
              defaultValue={product.name}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Base Selling Price (৳)
              </label>
              <input
                type="number"
                name="basePrice"
                required
                step="any"
                defaultValue={product.basePrice}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Compare Price / Strike (৳)
              </label>
              <input
                type="number"
                name="comparePrice"
                step="any"
                defaultValue={product.comparePrice || ""}
                placeholder="Optional strike-through"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Stock Quantity (Units)
              </label>
              <input
                type="number"
                name="stockQuantity"
                required
                defaultValue={product.stockQuantity}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-bold ${
                  isLowStock
                    ? "border-rose-400 bg-rose-50/50 text-rose-800"
                    : "border-slate-300 text-slate-900"
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Low Stock Threshold
              </label>
              <input
                type="number"
                name="lowStockAlert"
                required
                defaultValue={product.lowStockAlert}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 disabled:opacity-60"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Product Changes</span>
          </button>
        </div>
      </form>

      {/* Bundle Offers Manager */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base">Bundle Offers & Tier Pricing</h3>
          <p className="text-xs text-slate-500">
            Configure multi-item bundles, discounts, and free shipping triggers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {product.bundles?.map((bundle: any) => (
            <div
              key={bundle.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3"
            >
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-slate-900 text-xs">
                  {bundle.title}
                </span>
                {bundle.badge && (
                  <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full">
                    {bundle.badge}
                  </span>
                )}
              </div>

              <div className="text-xs space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Quantity Included:</span>
                  <span className="font-bold text-slate-900">{bundle.itemQuantity} pcs</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Free Delivery:</span>
                  <span className="font-bold text-emerald-600">
                    {bundle.freeDelivery ? "Yes (Free)" : "Standard Charge"}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Current Price:</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {formatBDT(bundle.bundlePrice)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
