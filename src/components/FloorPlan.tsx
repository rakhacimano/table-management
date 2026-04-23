"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Table, TableStatus } from "@/types/table";
import TableVisual from "./TableVisual";
import DetailMeja from "./DetailMeja";

interface FloorPlanProps {
  tables: Table[];
  onUpdatePosition: (id: string, x: number, y: number) => void;
  onCycleStatus: (id: string) => void;
  onEdit: (table: Table) => void;
  onDelete: (table: Table) => void;
  onUpdateStatus: (id: string, status: TableStatus) => void;
  onAssignGuest: (id: string, guestName: string, pax: number) => void;
  selectedTableId?: string | null;
  onSelectTable?: (table: Table | null) => void;
  floorName: string;
}

export default function FloorPlan({
  tables,
  onUpdatePosition,
  onCycleStatus,
  onEdit,
  onDelete,
  onUpdateStatus,
  onAssignGuest,
  selectedTableId,
  onSelectTable,
  floorName,
}: FloorPlanProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, table: Table) => {
      e.preventDefault();
      e.stopPropagation();
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setDragging(table.id);
      setOffset({
        x: e.clientX - rect.left - table.x,
        y: e.clientY - rect.top - table.y,
      });
    },
    []
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width - 80, e.clientX - rect.left - offset.x));
      const y = Math.max(0, Math.min(rect.height - 60, e.clientY - rect.top - offset.y));
      onUpdatePosition(dragging, x, y);
    },
    [dragging, offset, onUpdatePosition]
  );

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [dragging, handleMouseMove, handleMouseUp]);

  // Touch support analogous to mouse dragging setup...
  const handleTouchStart = useCallback((e: React.TouchEvent, table: Table) => {
    const touch = e.touches[0];
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setDragging(table.id);
    setOffset({ x: touch.clientX - rect.left - table.x, y: touch.clientY - rect.top - table.y });
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!containerRef.current) return;
      const touch = e.touches[0];
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width - 80, touch.clientX - rect.left - offset.x));
      const y = Math.max(0, Math.min(rect.height - 60, touch.clientY - rect.top - offset.y));
      onUpdatePosition(dragging, x, y);
    };
    const onTouchEnd = () => setDragging(null);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [dragging, offset, onUpdatePosition]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[500px] border border-grey-100 rounded-3xl overflow-hidden bg-grid-pattern bg-[#fafbfc] transition-all"
      style={{ cursor: dragging ? "grabbing" : "default" }}
      onClick={() => onSelectTable?.(null)}
    >
      {/* Floating panel rendering seamlessly inside the canvas */}
      <DetailMeja 
        table={tables.find(t => t.id === selectedTableId) || null} 
        floorName={floorName}
        onEdit={onEdit}
        onDelete={onDelete}
        onClose={() => onSelectTable?.(null)}
        onUpdateStatus={onUpdateStatus}
        onAssignGuest={onAssignGuest}
      />

      {tables.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-grey-400">
          <p className="text-sm font-medium">Belum ada meja</p>
          <p className="text-xs mt-1 text-grey-300">Tambah meja untuk melihat susunan</p>
        </div>
      )}

      {/* Sparse canvas hint to guide users */}
      {tables.length > 0 && tables.length <= 4 && !selectedTableId && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/70 backdrop-blur-sm border border-grey-100 rounded-full shadow-sm text-[11px] font-bold text-grey-400 pointer-events-none animate-fadeIn">
          Pilih meja untuk melihat detail, atau geser untuk mengatur letak.
        </div>
      )}

      {tables.map((table) => {
        const isSelected = selectedTableId === table.id;
        return (
          <div
            key={table.id}
            className={`absolute transition-shadow duration-300 select-none ${
              isSelected ? "ring-4 ring-primary-500/20 rounded-2xl bg-white/50 backdrop-blur-sm shadow-xl" : "drop-shadow-sm hover:drop-shadow-md"
            }`}
            style={{
              left: table.x,
              top: table.y,
              cursor: dragging === table.id ? "grabbing" : "grab",
              zIndex: dragging === table.id ? 50 : isSelected ? 40 : 10,
              padding: isSelected ? '12px' : '8px'
            }}
            onMouseDown={(e) => handleMouseDown(e, table)}
            onTouchStart={(e) => handleTouchStart(e, table)}
            onClick={(e) => {
              e.stopPropagation();
              onSelectTable?.(table);
            }}
            onDoubleClick={() => onCycleStatus(table.id)}
          >
            <TableVisual
              shape={table.shape}
              capacity={table.capacity}
              status={table.status}
              name={table.name}
              size={64}
              showLabel={true}
            />
          </div>
        );
      })}
    </div>
  );
}
