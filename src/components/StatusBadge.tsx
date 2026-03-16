"use client";

import { TableStatus, STATUS_CONFIG } from "@/types/table";

interface StatusBadgeProps {
  status: TableStatus;
  onClick?: () => void;
}

export default function StatusBadge({ status, onClick }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
        ${config.bg} ${config.color} ${config.border} border
        transition-all duration-300 ease-out
        hover:scale-105 hover:shadow-lg ${config.glow}
        active:scale-95
        cursor-pointer select-none
      `}
      title="Click to change status"
    >
      <span className="relative flex h-2 w-2">
        <span
          className={`
            animate-ping absolute inline-flex h-full w-full rounded-full opacity-75
            ${status === "available" ? "bg-emerald-400" : ""}
            ${status === "occupied" ? "bg-rose-400" : ""}
            ${status === "reserved" ? "bg-amber-400" : ""}
            ${status === "cleaning" ? "bg-slate-400" : ""}
          `}
        />
        <span
          className={`
            relative inline-flex rounded-full h-2 w-2
            ${status === "available" ? "bg-emerald-400" : ""}
            ${status === "occupied" ? "bg-rose-400" : ""}
            ${status === "reserved" ? "bg-amber-400" : ""}
            ${status === "cleaning" ? "bg-slate-400" : ""}
          `}
        />
      </span>
      {config.label}
    </button>
  );
}
