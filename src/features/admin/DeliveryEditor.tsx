"use client";

import React, { useState, useTransition } from "react";
import { formatBDT } from "@/lib/utils";
import { updateDeliveryZoneRate } from "./delivery-actions";
import { Truck, CheckCircle2, Save } from "lucide-react";

interface DeliveryZone {
  id: string;
  code: string;
  name: string;
  charge: number;
  estimatedDays: string;
  isActive: boolean;
}

interface DeliveryEditorProps {
  zones: DeliveryZone[];
}

export function DeliveryEditor({ zones }: DeliveryEditorProps) {
  const [zoneStates, setZoneStates] = useState(zones);
  const [isPending, startTransition] = useTransition();
  const [successMsg, setSuccessMsg] = useState(false);

  const handleRateChange = (id: string, field: string, val: any) => {
    setZoneStates((prev) =>
      prev.map((z) => (z.id === id ? { ...z, [field]: val } : z))
    );
  };

  const handleSave = (zone: DeliveryZone) => {
    startTransition(async () => {
      const res = await updateDeliveryZoneRate(
        zone.id,
        Number(zone.charge),
        zone.estimatedDays,
        zone.isActive
      );
      if (res.success) {
        setSuccessMsg(true);
        setTimeout(() => setSuccessMsg(false), 3000);
      }
    });
  };

  return (
    <div className="space-y-6">
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Delivery rates updated and synced with checkout!</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {zoneStates.map((zone) => (
          <div
            key={zone.id}
            className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">{zone.name}</h3>
              </div>
              <span className="font-mono text-[10px] text-slate-400">
                {zone.code}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Delivery Charge (৳)
                </label>
                <input
                  type="number"
                  value={zone.charge}
                  onChange={(e) =>
                    handleRateChange(zone.id, "charge", parseFloat(e.target.value) || 0)
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Estimated Delivery Time
                </label>
                <input
                  type="text"
                  value={zone.estimatedDays}
                  onChange={(e) =>
                    handleRateChange(zone.id, "estimatedDays", e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-700"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id={`active-${zone.id}`}
                  checked={zone.isActive}
                  onChange={(e) =>
                    handleRateChange(zone.id, "isActive", e.target.checked)
                  }
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label
                  htmlFor={`active-${zone.id}`}
                  className="text-xs font-medium text-slate-700 cursor-pointer"
                >
                  Zone Active & Selectable
                </label>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleSave(zone)}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Rate</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
