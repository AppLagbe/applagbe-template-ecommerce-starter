import React from "react";
import { prisma } from "@/lib/db";
import { formatBDT } from "@/lib/utils";
import {
  ShoppingBag,
  DollarSign,
  Clock,
  CheckCircle,
  Truck,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    totalOrders,
    pendingOrders,
    confirmedOrders,
    deliveredOrders,
    recentOrders,
    revenueResult,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { orderStatus: "PENDING" } }),
    prisma.order.count({ where: { orderStatus: "CONFIRMED" } }),
    prisma.order.count({ where: { orderStatus: "DELIVERED" } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
        deliveryDetail: true,
      },
    }),
    prisma.order.aggregate({
      where: {
        orderStatus: {
          notIn: ["CANCELLED", "RETURNED"],
        },
      },
      _sum: {
        totalAmount: true,
      },
    }),
  ]);

  const totalRevenue = revenueResult._sum.totalAmount || 0;

  const stats = [
    {
      title: "Total Revenue",
      value: formatBDT(totalRevenue),
      icon: DollarSign,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
      change: "Active pipeline sales",
    },
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      icon: ShoppingBag,
      color: "text-blue-600 bg-blue-50 border-blue-200",
      change: "All orders placed",
    },
    {
      title: "Pending Confirmation",
      value: pendingOrders.toString(),
      icon: Clock,
      color: "text-amber-600 bg-amber-50 border-amber-200",
      change: "Call needed for COD",
    },
    {
      title: "Delivered",
      value: deliveredOrders.toString(),
      icon: CheckCircle,
      color: "text-purple-600 bg-purple-50 border-purple-200",
      change: "Completed deliveries",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Store Performance Overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time orders, cash-on-delivery tracking, and fulfillment overview.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/orders"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Manage Orders</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {stat.title}
                </span>
                <div className={`p-2 rounded-xl border ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">{stat.value}</div>
              <p className="text-[11px] text-slate-400 font-medium">{stat.change}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Recent Orders */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">Recent Incoming Orders</h3>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 uppercase font-semibold text-[10px]">
                <th className="p-3.5 pl-5">Order #</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">District / Address</th>
                <th className="p-3.5">Item</th>
                <th className="p-3.5">Total Amount</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No orders placed yet. Place a test order from the storefront!
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => {
                  const statusColors: Record<string, string> = {
                    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
                    CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
                    PROCESSING: "bg-indigo-50 text-indigo-700 border-indigo-200",
                    SHIPPED: "bg-purple-50 text-purple-700 border-purple-200",
                    DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
                    CANCELLED: "bg-rose-50 text-rose-700 border-rose-200",
                  };

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/60 transition">
                      <td className="p-3.5 pl-5 font-mono font-bold text-slate-900">
                        {order.orderNumber}
                      </td>
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-900">{order.customerName}</div>
                        <div className="text-slate-400 font-mono text-[11px]">
                          {order.customerPhone}
                        </div>
                      </td>
                      <td className="p-3.5 max-w-[200px] truncate text-slate-600">
                        <span className="font-semibold text-slate-800">
                          {order.deliveryDetail?.district}:
                        </span>{" "}
                        {order.deliveryDetail?.fullAddress}
                      </td>
                      <td className="p-3.5 text-slate-700">
                        {order.items[0]?.productName} ({order.items[0]?.quantity}x)
                      </td>
                      <td className="p-3.5 font-bold text-slate-900">
                        {formatBDT(order.totalAmount)}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            statusColors[order.orderStatus] ||
                            "bg-slate-50 text-slate-600 border-slate-200"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
