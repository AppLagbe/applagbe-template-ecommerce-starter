"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, newStatus: string, note?: string) {
  try {
    const existing = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!existing) {
      return { success: false, error: "Order not found" };
    }

    // Auto-update paymentStatus if status is DELIVERED for Cash on Delivery
    let newPaymentStatus = existing.paymentStatus;
    if (newStatus === "DELIVERED" && existing.paymentMethod === "COD") {
      newPaymentStatus = "PAID";
    }

    await prisma.$transaction([
      prisma.order.update({
        where: { id: orderId },
        data: {
          orderStatus: newStatus,
          paymentStatus: newPaymentStatus,
        },
      }),
      prisma.orderStatusHistory.create({
        data: {
          orderId,
          fromStatus: existing.orderStatus,
          toStatus: newStatus,
          note: note || `Status changed from ${existing.orderStatus} to ${newStatus}`,
          changedBy: "Admin",
        },
      }),
    ]);

    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (err: any) {
    console.error("Failed to update status", err);
    return { success: false, error: err.message };
  }
}

export async function updateOrderCourier(
  orderId: string,
  courierName: string,
  trackingCode: string
) {
  try {
    await prisma.deliveryDetail.update({
      where: { orderId },
      data: {
        courierName,
        trackingCode,
      },
    });

    revalidatePath("/admin/orders");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
