"use client";

import React, { useState, useTransition } from "react";
import { formatBDT } from "@/lib/utils";
import { updateOrderStatus, updateOrderCourier } from "./order-actions";
import {
  Search,
  Filter,
  Phone,
  MapPin,
  Package,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from "lucide-react";

interface OrderItem {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  notes?: string | null;
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: Date;
  items: {
    id: string;
    productName: string;
    variantTitle?: string | null;
    bundleBadge?: string | null;
    quantity: number;
    subtotal: number;
  }[];
  deliveryDetail?: {
    district: string;
    thana?: string | null;
    fullAddress: string;
    zoneCode: string;
    trackingCode?: string | null;
    courierName?: string | null;
  } | null;
  statusHistory?: {
    id: string;
    toStatus: string;
    note?: string | null;
    createdAt: Date;
  }[];
}

interface OrdersTableProps {
  orders: OrderItem[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [courierName, setCourierName] = useState("");
  const [trackingCode, setTrackingCode] = useState("");
  const [isPending, startTransition] = useTransition();

  const statuses = [
    "ALL",
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      selectedStatus === "ALL" || order.orderStatus === selectedStatus;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchLower) ||
      order.customerName.toLowerCase().includes(searchLower) ||
      order.customerPhone.includes(searchLower) ||
      order.deliveryDetail?.district.toLowerCase().includes(searchLower);

    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = (orderId: string, newStatus: string) => {
    startTransition(async () => {
      await updateOrderStatus(orderId, newStatus);
    });
  };

  const handleSaveCourier = (orderId: string) => {
    startTransition(async () => {
      await updateOrderCourier(orderId, courierName, trackingCode);
      if (selectedOrder) {
        setSelectedOrder({
          ...selectedOrder,
          deliveryDetail: {
            ...selectedOrder.deliveryDetail!,
            courierName,
            trackingCode,
          },
        });
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Search & Status Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by order #, phone, name, district..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          />
        </div>

        {/* Status Tab buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedStatus === st
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st === "ALL" ? "All Orders" : st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
                <th className="p-4 pl-5">Order # / Date</th>
                <th className="p-4">Customer & Phone</th>
                <th className="p-4">Location</th>
                <th className="p-4">Items</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status & Action</th>
                <th className="p-4">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    No matching orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const statusColors: Record<string, string> = {
                    PENDING: "bg-amber-50 text-amber-700 border-amber-300",
                    CONFIRMED: "bg-blue-50 text-blue-700 border-blue-300",
                    PROCESSING: "bg-indigo-50 text-indigo-700 border-indigo-300",
                    SHIPPED: "bg-purple-50 text-purple-700 border-purple-300",
                    DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-300",
                    CANCELLED: "bg-rose-50 text-rose-700 border-rose-300",
                  };

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/60 transition">
                      <td className="p-4 pl-5">
                        <div className="font-mono font-bold text-slate-900 text-sm">
                          {order.orderNumber}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(order.createdAt).toLocaleDateString("en-BD", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-slate-900">
                          {order.customerName}
                        </div>
                        <a
                          href={`tel:${order.customerPhone}`}
                          className="font-mono text-emerald-600 hover:underline flex items-center gap-1 font-semibold"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{order.customerPhone}</span>
                        </a>
                      </td>

                      <td className="p-4 max-w-[180px]">
                        <div className="font-bold text-slate-800">
                          {order.deliveryDetail?.district}
                        </div>
                        <div className="text-slate-500 truncate text-[11px]">
                          {order.deliveryDetail?.fullAddress}
                        </div>
                      </td>

                      <td className="p-4">
                        {order.items.map((it) => (
                          <div key={it.id} className="font-medium text-slate-800">
                            {it.productName}{" "}
                            <span className="font-bold text-emerald-700">
                              × {it.quantity}
                            </span>
                            {it.bundleBadge && (
                              <span className="block text-[10px] text-orange-600">
                                ({it.bundleBadge})
                              </span>
                            )}
                          </div>
                        ))}
                      </td>

                      <td className="p-4">
                        <div className="font-black text-slate-900 text-sm">
                          {formatBDT(order.totalAmount)}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          COD: {order.paymentStatus}
                        </div>
                      </td>

                      <td className="p-4">
                        <select
                          disabled={isPending}
                          value={order.orderStatus}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)
                          }
                          className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border focus:outline-none cursor-pointer ${
                            statusColors[order.orderStatus] ||
                            "bg-slate-100 text-slate-700 border-slate-300"
                          }`}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>

                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOrder(order);
                            setCourierName(order.deliveryDetail?.courierName || "");
                            setTrackingCode(order.deliveryDetail?.trackingCode || "");
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Order Details
                </span>
                <h3 className="text-xl font-black text-slate-900 font-mono">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl space-y-1">
                <span className="font-bold text-slate-400 uppercase text-[10px]">
                  Customer Information
                </span>
                <p className="font-black text-slate-900 text-sm">
                  {selectedOrder.customerName}
                </p>
                <p className="font-mono text-emerald-700 font-semibold">
                  {selectedOrder.customerPhone}
                </p>
                {selectedOrder.notes && (
                  <p className="text-slate-500 italic mt-2">
                    Note: "{selectedOrder.notes}"
                  </p>
                )}
              </div>

              <div className="bg-slate-50 p-4 rounded-xl space-y-1">
                <span className="font-bold text-slate-400 uppercase text-[10px]">
                  Delivery Address
                </span>
                <p className="font-bold text-slate-900">
                  {selectedOrder.deliveryDetail?.district}
                </p>
                <p className="text-slate-600">
                  {selectedOrder.deliveryDetail?.fullAddress}
                </p>
              </div>
            </div>

            {/* Line items */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="bg-slate-50 px-4 py-2 font-bold text-slate-700 border-b border-slate-200 flex justify-between">
                <span>Item</span>
                <span>Subtotal</span>
              </div>
              {selectedOrder.items.map((it) => (
                <div
                  key={it.id}
                  className="px-4 py-3 flex justify-between items-center border-b border-slate-100 last:border-b-0"
                >
                  <div>
                    <span className="font-bold text-slate-900">
                      {it.productName}
                    </span>
                    <span className="text-slate-500 text-xs ml-1">
                      (Qty: {it.quantity})
                    </span>
                    {it.bundleBadge && (
                      <span className="block text-[11px] text-orange-600 font-semibold">
                        {it.bundleBadge}
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-slate-900">
                    {formatBDT(it.subtotal)}
                  </span>
                </div>
              ))}
              <div className="bg-slate-50/50 p-4 space-y-1.5 border-t border-slate-200">
                <div className="flex justify-between text-slate-600">
                  <span>Product Subtotal:</span>
                  <span>{formatBDT(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Charge:</span>
                  <span>{formatBDT(selectedOrder.deliveryCharge)}</span>
                </div>
                <div className="flex justify-between font-black text-slate-900 text-sm pt-1 border-t border-slate-200">
                  <span>Total Due:</span>
                  <span className="text-brand-accent">
                    {formatBDT(selectedOrder.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Courier / Fulfillment assignment */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-3">
              <span className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                Courier & Shipment Tracking
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Courier Service
                  </label>
                  <input
                    type="text"
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    placeholder="e.g. Steadfast / Pathao / RedX"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Tracking ID / Consignment
                  </label>
                  <input
                    type="text"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                    placeholder="e.g. ST-998823"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleSaveCourier(selectedOrder.id)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition"
              >
                Save Tracking Info
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
