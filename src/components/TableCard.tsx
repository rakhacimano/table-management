"use client";

import { Table, STATUS_CONFIG } from "@/types/table";
import TableVisual from "./TableVisual";
import { UserCheck, Edit2, Trash2, ArrowRight } from "lucide-react";

interface TableCardProps {
  table: Table;
  floorName: string;
  onEdit: (table: Table) => void;
  onDelete: (table: Table) => void;
  onCycleStatus: (id: string) => void;
}

export default function TableCard({
  table,
  floorName,
  onEdit,
  onDelete,
  onCycleStatus,
}: TableCardProps) {
  const statusConf = STATUS_CONFIG[table.status];

  return (
    <div
      className="
        group relative flex flex-col bg-white border border-grey-50 rounded-2xl p-5
        transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]
        shadow-[0_2px_10px_rgba(0,0,0,0.02)]
        hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] hover:border-grey-100 hover:-translate-y-1
      "
    >
      {/* Settings Menu Overlay (Fades in on hover) */}
      <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
        <button
          onClick={() => onEdit(table)}
          className="p-2 rounded-xl bg-white border border-warning-100 text-warning-500 hover:bg-warning-50 hover:border-warning-200 active:scale-95 transition-all shadow-sm"
          title="Edit"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onDelete(table)}
          className="p-2 rounded-xl bg-white border border-danger-100 text-danger-500 hover:bg-danger-50 hover:border-danger-200 active:scale-95 transition-all shadow-sm"
          title="Hapus"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Visual representation container */}
      <div className="flex justify-center mb-6 mt-3 relative pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-grey-50/50 to-transparent blur-md -z-10 scale-150" />
        <TableVisual
          shape={table.shape || "square"}
          capacity={table.capacity}
          status={table.status}
          name={table.name}
          size={80}
          showLabel={true}
        />
      </div>

      {/* Actionable Status Button */}
      <button
        onClick={() => onCycleStatus(table.id)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-transparent hover:border-grey-100 hover:bg-grey-50 active:scale-95 transition-all mb-3 group/btn"
        title={`Status: ${statusConf.labelId}. Click to cycle.`}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full shadow-inner" style={{ backgroundColor: statusConf.hex }} />
          <span className="font-bold text-[10px] uppercase tracking-wider text-grey-500 group-hover/btn:text-grey-700 transition-colors">
            {statusConf.labelId}
          </span>
        </div>
        <ArrowRight className="w-3 h-3 text-grey-300 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
      </button>

      {/* Header Info */}
      <div className="flex items-end justify-between mt-auto">
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-bold text-grey-950 truncate max-w-[120px]">
            {table.name}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-grey-400 font-medium">
            <UserCheck className="w-3.5 h-3.5 text-grey-300" />
            <span>Kapasitas {table.capacity}</span>
            <span className="w-1 h-1 rounded-full bg-grey-200" />
            <span className="truncate max-w-[80px]">{floorName}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
