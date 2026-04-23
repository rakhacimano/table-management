"use client";

import { STATUS_CONFIG } from "@/types/table";
import { Users } from "lucide-react";

interface InfoRuanganProps {
  stats: {
    total: number;
    available: number;
    occupied: number;
    reserved: number;
    cleaning: number;
  };
}

export default function InfoRuangan({ stats }: InfoRuanganProps) {
  return (
    <div className="w-full flex gap-3 mb-6">
      {/* Pengunjung Card - Primary colored pill */}
      <div className="flex-shrink-0 bg-primary-500 rounded-2xl flex items-center gap-4 px-5 py-3 text-white shadow-sm hover:-translate-y-0.5 transition-transform duration-300">
        <div className="bg-white/20 p-2 rounded-xl">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <p className="text-[11px] font-medium text-white/80 uppercase tracking-wider">Pengunjung</p>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold leading-none">124</span>
            <span className="text-xs font-medium text-white/90">Pax</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-px bg-grey-100 my-2 mx-1" />

      {/* Metric Pills */}
      <div className="flex-1 grid grid-cols-4 gap-3">
        <MetricPill
          label="Tersedia"
          value={stats.available}
          total={stats.total}
          statusKey="available"
        />
        <MetricPill
          label="Terisi"
          value={stats.occupied}
          total={stats.total}
          statusKey="occupied"
        />
        <MetricPill
          label="Di-booking"
          value={stats.reserved}
          total={stats.total}
          statusKey="reserved"
        />
        <MetricPill
          label="Dibersihkan"
          value={stats.cleaning}
          total={stats.total}
          statusKey="cleaning"
        />
      </div>
    </div>
  );
}

function MetricPill({
  label,
  value,
  total,
  statusKey,
}: {
  label: string;
  value: number;
  total: number;
  statusKey: keyof typeof STATUS_CONFIG;
}) {
  const percent = total > 0 ? (value / total) * 100 : 0;
  
  // Use exact Kaspin token colors dynamically based on status
  const conf = STATUS_CONFIG[statusKey];
  const hex = conf.hex;
  const hexLight = conf.hexLight;

  return (
    <div className="bg-white border border-grey-50 rounded-2xl p-3.5 flex flex-col justify-between gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300 cursor-default">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: hex }} />
          <p className="text-xs font-semibold text-grey-500 uppercase tracking-wide">{label}</p>
        </div>
        <p className="text-lg font-bold text-grey-950 leading-none">
          {value}<span className="text-sm font-medium text-grey-300">/{total}</span>
        </p>
      </div>
      
      {/* Progress Bar Container - Only for specific actionable metrics like Tersedia */}
      {statusKey === "available" && (
        <div className="h-1.5 rounded-full w-full overflow-hidden mt-1" style={{ backgroundColor: hexLight }}>
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${Math.min(percent, 100)}%`, backgroundColor: hex }}
          />
        </div>
      )}
    </div>
  );
}
