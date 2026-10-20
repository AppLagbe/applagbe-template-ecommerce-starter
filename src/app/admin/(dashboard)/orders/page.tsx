import React from "react";
import { prisma } from "@/lib/db";
import { OrdersTable } from "@/features/admin/OrdersTable";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      deliveryDetail: true,
      statusHistory: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Orders Pipeline
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Filter, verify, update delivery statuses, and assign courier tracking IDs.
        </p>
      </div>

      <OrdersTable orders={orders} />
    </div>
  );
}
