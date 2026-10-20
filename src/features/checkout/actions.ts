"use server";

import { prisma } from "@/lib/db";
import { validateBDPhone } from "@/lib/utils";
import crypto from "crypto";

export interface PlaceOrderInput {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  district: string;
  thana?: string;
  fullAddress: string;
  deliveryZoneCode: string; // "inside_dhaka" | "sub_dhaka" | "outside_dhaka"
  productId: string;
  bundleId?: string;
  variantId?: string;
  notes?: string;
}

export interface PlaceOrderResult {
  success: boolean;
  error?: string;
  orderNumber?: string;
  totalAmount?: number;
  deliveryCharge?: number;
  customerName?: string;
  customerPhone?: string;
  district?: string;
  fullAddress?: string;
  productName?: string;
  bundleTitle?: string;
}

export async function placeOrder(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  try {
    // 1. Validate required fields
    if (!input.customerName || input.customerName.trim().length < 2) {
      return { success: false, error: "অনুগ্রহ করে আপনার সঠিক নাম লিখুন।" };
    }

    const phoneValidation = validateBDPhone(input.customerPhone);
    if (!phoneValidation.isValid) {
      return {
        success: false,
        error: "অনুগ্রহ করে ১১ ডিজিটের সঠিক বাংলাদেশী মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)।",
      };
    }
    const cleanPhone = phoneValidation.normalized;

    if (!input.district || input.district.trim().length === 0) {
      return { success: false, error: "অনুগ্রহ করে আপনার জেলা নির্বাচন করুন।" };
    }

    if (!input.fullAddress || input.fullAddress.trim().length < 5) {
      return { success: false, error: "অনুগ্রহ করে আপনার সম্পূর্ণ বিস্তারিত ঠিকানা লিখুন।" };
    }

    // 2. Duplicate order prevention check
    // Generate key hash using phone + productId + bundleId + 5-minute time window
    const timeBucket = Math.floor(Date.now() / (1000 * 60 * 3)); // 3 minutes window
    const hashData = `${cleanPhone}_${input.productId}_${input.bundleId || "none"}_${timeBucket}`;
    const idempotencyHash = crypto.createHash("sha256").update(hashData).digest("hex");

    const existingIdempotency = await prisma.idempotencyRecord.findUnique({
      where: { keyHash: idempotencyHash },
    });

    if (existingIdempotency) {
      const existingOrder = await prisma.order.findUnique({
        where: { id: existingIdempotency.orderId },
      });
      return {
        success: false,
        error: `আপনার অর্ডারটি ইতিমধ্যে গ্রহণ করা হয়েছে! অর্ডার নম্বর: ${existingOrder?.orderNumber || ""}. আমাদের প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবেন।`,
      };
    }

    // 3. Fetch Product & validate existence and active status
    const product = await prisma.product.findUnique({
      where: { id: input.productId },
      include: {
        bundles: true,
        variants: true,
      },
    });

    if (!product || !product.isActive) {
      return { success: false, error: "নির্বাচিত পণ্যটি বর্তমানে বিক্রির জন্য উপলব্ধ নেই।" };
    }

    // 4. Determine bundle or variant and calculate pricing server-side
    let orderQuantity = 1;
    let subtotal = product.basePrice;
    let selectedBundle = null;
    let selectedVariant = null;
    let isFreeDelivery = false;
    let bundleBadge = undefined;
    let bundleTitle = undefined;

    if (input.bundleId) {
      selectedBundle = product.bundles.find((b) => b.id === input.bundleId);
      if (selectedBundle) {
        orderQuantity = selectedBundle.itemQuantity;
        subtotal = selectedBundle.bundlePrice;
        isFreeDelivery = selectedBundle.freeDelivery;
        bundleBadge = selectedBundle.badge;
        bundleTitle = selectedBundle.title;
      }
    } else if (input.variantId) {
      selectedVariant = product.variants.find((v) => v.id === input.variantId);
      if (selectedVariant) {
        subtotal = selectedVariant.price;
      }
    }

    // 5. Stock validation
    if (product.stockQuantity < orderQuantity) {
      return {
        success: false,
        error: `দুঃখিত, আমাদের স্টকে পর্যাপ্ত পণ্য নেই। বর্তমান স্টক: ${product.stockQuantity}টি।`,
      };
    }

    if (selectedVariant && selectedVariant.stockQuantity < orderQuantity) {
      return {
        success: false,
        error: `দুঃখিত, নির্বাচিত ভ্যারিয়েন্টের পর্যাপ্ত স্টক নেই। বর্তমান স্টক: ${selectedVariant.stockQuantity}টি।`,
      };
    }

    // 6. Server-side delivery charge calculation
    let deliveryCharge = 130.0; // default outside dhaka
    const zone = await prisma.deliveryZone.findFirst({
      where: {
        code: input.deliveryZoneCode,
        isActive: true,
      },
    });

    if (zone) {
      deliveryCharge = zone.charge;
    }

    // If bundle has free delivery privilege
    if (isFreeDelivery) {
      deliveryCharge = 0;
    }

    const totalAmount = subtotal + deliveryCharge;

    // 7. Generate friendly human order number: AL-YYMMDD-XXXX
    const datePrefix = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `AL-${datePrefix}-${randomSuffix}`;

    // 8. Execute Database Transaction: Stock reduction & order creation
    const newOrder = await prisma.$transaction(async (tx) => {
      // Reduce product stock
      await tx.product.update({
        where: { id: product.id },
        data: {
          stockQuantity: {
            decrement: orderQuantity,
          },
        },
      });

      // Reduce variant stock if variant chosen
      if (selectedVariant) {
        await tx.productVariant.update({
          where: { id: selectedVariant.id },
          data: {
            stockQuantity: {
              decrement: orderQuantity,
            },
          },
        });
      }

      // Create Order
      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          customerName: input.customerName.trim(),
          customerPhone: cleanPhone,
          customerEmail: input.customerEmail || null,
          notes: input.notes || null,
          subtotal,
          deliveryCharge,
          discountAmount: 0,
          totalAmount,
          orderStatus: "PENDING",
          paymentStatus: "PENDING_COD",
          paymentMethod: "COD",
          items: {
            create: [
              {
                productId: product.id,
                variantId: selectedVariant?.id || null,
                bundleId: selectedBundle?.id || null,
                productName: product.name,
                variantTitle: selectedVariant?.title || null,
                bundleBadge: bundleBadge || null,
                unitPrice: subtotal / orderQuantity,
                quantity: orderQuantity,
                subtotal: subtotal,
              },
            ],
          },
          deliveryDetail: {
            create: {
              recipientName: input.customerName.trim(),
              recipientPhone: cleanPhone,
              district: input.district,
              thana: input.thana || null,
              fullAddress: input.fullAddress.trim(),
              zoneCode: input.deliveryZoneCode,
              deliveryNotes: input.notes || null,
            },
          },
          payments: {
            create: [
              {
                provider: "COD",
                amount: totalAmount,
                status: "PENDING",
              },
            ],
          },
          statusHistory: {
            create: [
              {
                toStatus: "PENDING",
                note: "Customer placed order via website (Cash on Delivery)",
                changedBy: "Customer (Web)",
              },
            ],
          },
        },
      });

      // Register idempotency record
      await tx.idempotencyRecord.create({
        data: {
          keyHash: idempotencyHash,
          orderId: createdOrder.id,
        },
      });

      return createdOrder;
    });

    return {
      success: true,
      orderNumber: newOrder.orderNumber,
      totalAmount: newOrder.totalAmount,
      deliveryCharge: newOrder.deliveryCharge,
      customerName: newOrder.customerName,
      customerPhone: newOrder.customerPhone,
      district: input.district,
      fullAddress: input.fullAddress,
      productName: product.name,
      bundleTitle: bundleTitle || `${product.name} (১টি)`,
    };
  } catch (err: any) {
    console.error("Order placement error:", err);
    return {
      success: false,
      error: "অর্ডার সম্পন্ন করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন বা সরাসরি কল করুন।",
    };
  }
}
