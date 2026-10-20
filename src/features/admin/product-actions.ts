"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateProductDetails(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const basePrice = parseFloat(formData.get("basePrice") as string);
    const comparePrice = formData.get("comparePrice")
      ? parseFloat(formData.get("comparePrice") as string)
      : null;
    const stockQuantity = parseInt(formData.get("stockQuantity") as string, 10);
    const lowStockAlert = parseInt(formData.get("lowStockAlert") as string, 10);

    await prisma.product.update({
      where: { id },
      data: {
        name,
        basePrice,
        comparePrice,
        stockQuantity,
        lowStockAlert,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/preview");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateBundleOffer(
  bundleId: string,
  bundlePrice: number,
  regularPrice: number | null
) {
  try {
    await prisma.bundleOffer.update({
      where: { id: bundleId },
      data: {
        bundlePrice,
        regularPrice,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/preview");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
