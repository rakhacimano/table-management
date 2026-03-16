"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Table } from "@/types/table";
import TableVisual from "./TableVisual";
import StatusBadge from "./StatusBadge";

interface FloorPlanProps {
  tables: Table[];
  onUpdatePosition: (id: string, x: number, y: number) => void;
  onCycleStatus: (id: string) => void;
  onEdit: (table: Table) => void;
  onDelete: (table: Table) => void;
}

export default function FloorPlan({
  tables,
  onUpdatePosition,
  onCycleStatus,
  onEdit,
  onDelete,
}: FloorPlanProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<{
    id: string;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, table: Table) => {
      e.preventDefault();
      e.stopPropagation();
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const offsetX = (e.clientX - rect.left) / zoom - table.x;
      const offsetY = (e.clientY - rect.top) / zoom - table.y;

      setDragging({ id: table.id, offsetX, offsetY });
      setSelectedId(table.id);
    },
    [zoom]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging || !canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const x = Math.max(0, (e.clientX - rect.left) / zoom - dragging.offsetX);
      const y = Math.max(0, (e.clientY - rect.top) / zoom - dragging.offsetY);

      onUpdatePosition(dragging.id, Math.round(x), Math.round(y));
    },
    [dragging, zoom, onUpdatePosition]
  );

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains("floor-grid")) {
      setSelectedId(null);
    }
  }, []);

  useEffect(() => {
    const handleGlobalMouseUp = () => setDragging(null);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  const selectedTable = tables.find((t) => t.id === selectedId);

  return (
    <div className="relative flex-1 flex rounded-2xl overflow-hidden border border-white/[0.06]">
      {/* Canvas */}
      <div
        ref={canvasRef}
        className="flex-1 relative overflow-auto cursor-crosshair bg-[#0d0d20]"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleCanvasClick}
        style={{
          backgroundSize: `${40 * zoom}px ${40 * zoom}px`,
          backgroundImage:
            "radial-gradient(circle, rgba(139, 92, 246, 0.08) 1px, transparent 1px)",
        }}
      >
        <div
          className="floor-grid relative"
          style={{
            width: `${1200 * zoom}px`,
            height: `${800 * zoom}px`,
            minWidth: "100%",
            minHeight: "100%",
          }}
        >
          {/* Floor plan boundary */}
          <div
            className="absolute border-2 border-dashed border-white/[0.06] rounded-3xl"
            style={{
              left: `${20 * zoom}px`,
              top: `${20 * zoom}px`,
              width: `${1160 * zoom}px`,
              height: `${760 * zoom}px`,
            }}
          />

          {/* Tables */}
          {tables.map((table) => (
            <div
              key={table.id}
              className={`
                absolute cursor-grab active:cursor-grabbing
                transition-shadow duration-200 flex items-center justify-center
                ${selectedId === table.id ? "z-20" : "z-10"}
                ${dragging?.id === table.id ? "opacity-90" : ""}
              `}
              style={{
                left: `${(table.x || 0) * zoom}px`,
                top: `${(table.y || 0) * zoom}px`,
                width: `${90 * zoom}px`,
                height: `${90 * zoom}px`,
              }}
              onMouseDown={(e) => handleMouseDown(e, table)}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedId(table.id);
              }}
            >
              {/* Selection ring */}
              {selectedId === table.id && (
                <div className="absolute -inset-6 border-2 border-purple-500/50 rounded-2xl bg-purple-500/5 pointer-events-none animate-fadeIn" />
              )}
              {/* Scale the SVG based on zoom */}
              <div style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}>
                <TableVisual
                  shape={table.shape || "square"}
                  capacity={table.capacity}
                  status={table.status}
                  name={table.name}
                  size={90}
                  showLabel={false}
                />
              </div>
            </div>
          ))}

          {/* Entrance marker */}
          <div
            className="absolute flex flex-col items-center gap-1"
            style={{
              bottom: `${10 * zoom}px`,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <div
              className="bg-purple-500 rounded-full"
              style={{
                width: `${80 * zoom}px`,
                height: `${4 * zoom}px`,
              }}
            />
            <span
              className="text-purple-400 font-bold uppercase tracking-[0.2em]"
              style={{ fontSize: `${10 * zoom}px` }}
            >
              Entrance
            </span>
          </div>
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 z-30 flex flex-col gap-2">
        <div className="flex flex-col bg-[#1a1a2e] rounded-xl shadow-lg border border-white/[0.08] overflow-hidden">
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.1, 2))}
            className="p-2.5 hover:bg-white/[0.05] text-white/50 hover:text-white/80 transition-colors border-b border-white/[0.06]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
          <div className="px-2 py-1.5 text-center bg-white/[0.02]">
            <span className="text-[10px] font-bold text-white/40">
              {Math.round(zoom * 100)}%
            </span>
          </div>
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.1, 0.3))}
            className="p-2.5 hover:bg-white/[0.05] text-white/50 hover:text-white/80 transition-colors border-t border-white/[0.06]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
            </svg>
          </button>
        </div>
        <button
          onClick={() => setZoom(1)}
          className="p-2.5 bg-[#1a1a2e] rounded-xl shadow-lg border border-white/[0.08] text-white/50 hover:text-white/80 transition-colors"
          title="Reset zoom"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
          </svg>
        </button>
      </div>

      {/* Selected Table Properties Panel */}
      {selectedTable && (
        <div className="w-64 border-l border-white/[0.06] bg-[#0c0c1d]/95 backdrop-blur-xl flex flex-col animate-fadeIn shrink-0">
          <div className="p-4 border-b border-white/[0.06]">
            <h3 className="font-bold text-white/80 text-sm mb-0.5">Properties</h3>
            <p className="text-[10px] text-white/30">
              Selected: {selectedTable.name}
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {/* Visual Preview */}
            <div className="flex justify-center py-2">
              <TableVisual
                shape={selectedTable.shape || "square"}
                capacity={selectedTable.capacity}
                status={selectedTable.status}
                name={selectedTable.name}
                size={80}
                showLabel={true}
              />
            </div>

            {/* Info */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-white/30">
                Table Info
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/40">Name</span>
                  <span className="text-xs text-white/70 font-medium">
                    {selectedTable.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/40">Capacity</span>
                  <span className="text-xs text-white/70 font-medium">
                    {selectedTable.capacity} seats
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/40">Shape</span>
                  <span className="text-xs text-white/70 font-medium capitalize">
                    {selectedTable.shape || "square"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/40">Position</span>
                  <span className="text-xs text-white/70 font-medium">
                    {selectedTable.x}, {selectedTable.y}
                  </span>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-white/30">
                Status
              </h4>
              <StatusBadge
                status={selectedTable.status}
                onClick={() => onCycleStatus(selectedTable.id)}
              />
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => onEdit(selectedTable)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold bg-white/[0.05] text-white/60 border border-white/[0.06] hover:bg-white/[0.1] hover:text-white/80 transition-all duration-300"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
                Edit Table
              </button>
              <button
                onClick={() => onDelete(selectedTable)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/15 hover:bg-rose-500/20 transition-all duration-300"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
                Remove Table
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
