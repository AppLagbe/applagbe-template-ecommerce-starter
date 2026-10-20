"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateDeliveryZoneRate(
  zoneId: string,
  charge: number,
  estimatedDays: string,
  isActive: boolean
) {
  try {
    await prisma.deliveryZone.update({
      where: { id: zoneId },
      data: {
        charge,
        estimatedDays,
        isActive,
      },
    });

    revalidatePath("/admin/delivery");
    revalidatePath("/");
    revalidatePath("/preview");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
