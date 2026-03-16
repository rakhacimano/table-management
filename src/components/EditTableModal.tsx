"use client";

import { useState, useEffect } from "react";
import { Table, TableStatus, TableShape, Floor, STATUS_CONFIG, SHAPE_CONFIG } from "@/types/table";

interface EditTableModalProps {
  isOpen: boolean;
  table: Table | null;
  floors: Floor[];
  onClose: () => void;
  onEdit: (
    id: string,
    data: { name: string; capacity: number; status: TableStatus; shape: TableShape; floorId: string }
  ) => void;
}

export default function EditTableModal({
  isOpen,
  table,
  floors,
  onClose,
  onEdit,
}: EditTableModalProps) {
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState(4);
  const [status, setStatus] = useState<TableStatus>("available");
  const [shape, setShape] = useState<TableShape>("square");
  const [floorId, setFloorId] = useState<string>("");

  useEffect(() => {
    if (table) {
      setName(table.name);
      setCapacity(table.capacity);
      setStatus(table.status);
      setShape(table.shape || "square");
      setFloorId(table.floorId);
    }
  }, [table]);

  if (!isOpen || !table) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !floorId) return;
    onEdit(table.id, { name: name.trim(), capacity, status, shape, floorId });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" />
      <div
        className="
          relative w-full max-w-md
          bg-gradient-to-br from-[#1a1a2e] to-[#16162a]
          border border-white/[0.08]
          rounded-3xl p-6 shadow-2xl
          animate-slideUp
          max-h-[90vh] overflow-y-auto
        "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white/90">Edit Table</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/[0.05] text-white/40 hover:bg-white/[0.1] hover:text-white/80 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-white/50 mb-2">Table Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Table 10"
              required
              className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white/90 placeholder-white/25 focus:outline-none focus:border-purple-500/40 focus:bg-white/[0.07] transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/50 mb-2">Capacity</label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(Math.max(1, parseInt(e.target.value) || 1))}
              min={1}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white/90 placeholder-white/25 focus:outline-none focus:border-purple-500/40 focus:bg-white/[0.07] transition-all duration-300"
            />
          </div>

          {/* Shape Selector */}
          <div>
            <label className="block text-sm font-medium text-white/50 mb-2">Table Shape</label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.entries(SHAPE_CONFIG) as [TableShape, { label: string; icon: string }][]).map(
                ([key, val]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setShape(key)}
                    className={`
                      flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all duration-300
                      ${
                        shape === key
                          ? "border-purple-500/60 bg-purple-500/10 text-purple-300"
                          : "border-white/[0.08] bg-white/[0.03] text-white/40 hover:border-white/[0.15] hover:text-white/60"
                      }
                    `}
                  >
                    <ShapePreview shape={key} selected={shape === key} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      {val.label}
                    </span>
                  </button>
                )
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/50 mb-2">Floor</label>
            <select
              value={floorId}
              onChange={(e) => setFloorId(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white/90 focus:outline-none focus:border-purple-500/40 focus:bg-white/[0.07] transition-all duration-300 appearance-none cursor-pointer"
            >
              {floors.map((f) => (
                <option key={f.id} value={f.id} className="bg-[#1a1a2e] text-white">
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/50 mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TableStatus)}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white/90 focus:outline-none focus:border-purple-500/40 focus:bg-white/[0.07] transition-all duration-300 appearance-none cursor-pointer"
            >
              {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                <option key={key} value={key} className="bg-[#1a1a2e] text-white">
                  {val.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 hover:from-purple-500 hover:to-blue-500 active:scale-[0.98] transition-all duration-300"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

function ShapePreview({ shape, selected }: { shape: TableShape; selected: boolean }) {
  const color = selected ? "#a78bfa" : "#64748b";
  const fill = selected ? "#a78bfa20" : "#64748b15";

  return (
    <svg width="32" height="32" viewBox="0 0 32 32">
      {shape === "square" && (
        <>
          <rect x="6" y="6" width="20" height="20" rx="3" fill={fill} stroke={color} strokeWidth="1.5" />
          <rect x="12" y="2" width="8" height="3" rx="1.5" fill={color} opacity="0.5" />
          <rect x="12" y="27" width="8" height="3" rx="1.5" fill={color} opacity="0.5" />
        </>
      )}
      {shape === "rectangle" && (
        <>
          <rect x="3" y="8" width="26" height="16" rx="3" fill={fill} stroke={color} strokeWidth="1.5" />
          <rect x="8" y="3" width="6" height="3" rx="1.5" fill={color} opacity="0.5" />
          <rect x="18" y="3" width="6" height="3" rx="1.5" fill={color} opacity="0.5" />
          <rect x="8" y="26" width="6" height="3" rx="1.5" fill={color} opacity="0.5" />
          <rect x="18" y="26" width="6" height="3" rx="1.5" fill={color} opacity="0.5" />
        </>
      )}
      {shape === "round" && (
        <>
          <circle cx="16" cy="16" r="10" fill={fill} stroke={color} strokeWidth="1.5" />
          <rect x="14" y="2" width="4" height="3" rx="1.5" fill={color} opacity="0.5" />
          <rect x="14" y="27" width="4" height="3" rx="1.5" fill={color} opacity="0.5" />
          <rect x="2" y="14" width="3" height="4" rx="1.5" fill={color} opacity="0.5" />
          <rect x="27" y="14" width="3" height="4" rx="1.5" fill={color} opacity="0.5" />
        </>
      )}
      {shape === "booth" && (
        <>
          <rect x="3" y="4" width="4" height="24" rx="2" fill={color} opacity="0.3" />
          <rect x="9" y="6" width="18" height="20" rx="3" fill={fill} stroke={color} strokeWidth="1.5" />
          <rect x="28" y="10" width="3" height="4" rx="1.5" fill={color} opacity="0.5" />
          <rect x="28" y="18" width="3" height="4" rx="1.5" fill={color} opacity="0.5" />
        </>
      )}
    </svg>
  );
}
