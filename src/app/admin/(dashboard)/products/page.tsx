import React from "react";
import { prisma } from "@/lib/db";
import { ProductEditor } from "@/features/admin/ProductEditor";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const product = await prisma.product.findFirst({
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: true,
      bundles: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!product) {
    return <div>No product found. Please run seed script.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Product & Inventory Control
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage prices, stock levels, bundle packages, and low-inventory alerts.
        </p>
      </div>

      <ProductEditor product={product} />
    </div>
  );
}
