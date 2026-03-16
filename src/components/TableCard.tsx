"use client";

import { Table } from "@/types/table";
import StatusBadge from "./StatusBadge";
import TableVisual from "./TableVisual";
import { Clock, UserCheck, Sparkles, AlertCircle, Edit2, Trash2, CalendarPlus } from "lucide-react";

interface TableCardProps {
  table: Table;
  onEdit: (table: Table) => void;
  onDelete: (table: Table) => void;
  onCycleStatus: (id: string) => void;
  onSetStatus: (id: string, status: "available" | "occupied" | "reserved" | "cleaning") => void;
  onReserveClick: (table: Table) => void;
}

export default function TableCard({
  table,
  onEdit,
  onDelete,
  onCycleStatus,
  onSetStatus,
  onReserveClick,
}: TableCardProps) {
  return (
    <div
      className="
        group relative overflow-hidden flex flex-col
        bg-gradient-to-br from-white/[0.07] to-white/[0.02]
        backdrop-blur-xl
        border border-white/[0.08]
        rounded-2xl p-4 sm:p-5
        transition-all duration-500 ease-out
        hover:shadow-2xl hover:shadow-purple-500/5
        hover:border-white/[0.15]
        hover:-translate-y-1
      "
    >
      {/* Gradient hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Settings Menu (Top Right) */}
      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
        <button
          onClick={() => onEdit(table)}
          className="p-1.5 rounded-lg bg-white/[0.1] text-white/60 hover:text-white hover:bg-white/[0.2] transition-colors"
          title="Edit Details"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onDelete(table)}
          className="p-1.5 rounded-lg bg-white/[0.1] text-white/60 hover:text-rose-400 hover:bg-rose-500/20 transition-colors"
          title="Delete Table"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Visual Table + Chairs */}
        <div className="flex justify-center mb-4 mt-2">
          <TableVisual
            shape={table.shape || "square"}
            capacity={table.capacity}
            status={table.status}
            name={table.name}
            size={90}
            showLabel={false}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mt-auto mb-3">
          <div>
            <h3 className="text-base font-semibold text-white/90 group-hover:text-white transition-colors">
              {table.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-white/40">
              <UserCheck className="w-3.5 h-3.5" />
              <span>{table.capacity} seats</span>
            </div>
          </div>
          <StatusBadge
            status={table.status}
            onClick={() => onCycleStatus(table.id)}
          />
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-3" />

        {/* Quick Actions based on status */}
        <div className="grid grid-cols-2 gap-2">
          {table.status === "available" && (
            <>
              <button
                onClick={() => onReserveClick(table)}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all active:scale-[0.97]"
              >
                <CalendarPlus className="w-3.5 h-3.5" /> Reserve
              </button>
              <button
                onClick={() => onSetStatus(table.id, "occupied")}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all active:scale-[0.97]"
              >
                <UserCheck className="w-3.5 h-3.5" /> Seat Guest
              </button>
            </>
          )}

          {table.status === "occupied" && (
            <>
              <button
                onClick={() => onSetStatus(table.id, "cleaning")}
                className="col-span-2 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-500/10 text-slate-300 border border-slate-500/20 hover:bg-slate-500/20 transition-all active:scale-[0.97]"
              >
                <Sparkles className="w-3.5 h-3.5" /> Mark Cleaning
              </button>
            </>
          )}

          {table.status === "reserved" && (
            <>
              <button
                onClick={() => onSetStatus(table.id, "available")}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold bg-white/[0.05] text-white/50 border border-white/[0.1] hover:bg-white/[0.1] transition-all active:scale-[0.97]"
              >
                Cancel
              </button>
              <button
                onClick={() => onSetStatus(table.id, "occupied")}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all active:scale-[0.97]"
              >
                <UserCheck className="w-3.5 h-3.5" /> Arrived
              </button>
            </>
          )}

          {table.status === "cleaning" && (
            <>
              <button
                onClick={() => onSetStatus(table.id, "available")}
                className="col-span-2 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all active:scale-[0.97]"
              >
                <AlertCircle className="w-3.5 h-3.5" /> Clear to Available
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
