import React from "react";
import { prisma } from "@/lib/db";
import { DeliveryEditor } from "@/features/admin/DeliveryEditor";

export const dynamic = "force-dynamic";

export default async function AdminDeliveryPage() {
  const zones = await prisma.deliveryZone.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Delivery Zones & Rates
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Set Inside Dhaka, Outside Dhaka, and Sub-city delivery rates with delivery timelines.
        </p>
      </div>

      <DeliveryEditor zones={zones} />
    </div>
  );
}
