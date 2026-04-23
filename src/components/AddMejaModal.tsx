"use client";

import { useState, useEffect } from "react";
import { TableStatus, TableShape, Floor, STATUS_CONFIG, SHAPE_CONFIG } from "@/types/table";
import { X } from "lucide-react";

interface AddMejaModalProps {
  isOpen: boolean;
  floors: Floor[];
  activeFloorId: string;
  onClose: () => void;
  onAdd: (data: {
    name: string;
    capacity: number;
    status: TableStatus;
    shape: TableShape;
    floorId: string;
  }) => void;
}

export default function AddMejaModal({
  isOpen,
  floors,
  activeFloorId,
  onClose,
  onAdd,
}: AddMejaModalProps) {
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState(4);
  const [status, setStatus] = useState<TableStatus>("available");
  const [shape, setShape] = useState<TableShape>("square");
  const [floorId, setFloorId] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      setFloorId(activeFloorId);
    }
  }, [isOpen, activeFloorId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !floorId) return;
    onAdd({ name: name.trim(), capacity, status, shape, floorId });
    setName("");
    setCapacity(4);
    setStatus("available");
    setShape("square");
    setFloorId(activeFloorId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn" />
      <div
        className="relative w-full max-w-md bg-white border border-grey-100 rounded-3xl p-7 shadow-[0_10px_40px_rgb(0,0,0,0.1)] animate-slideUp max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-grey-950 tracking-tight">Tambah Meja</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-grey-50 text-grey-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField label="Nama Meja">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="contoh: Meja 1"
              required
              className="w-full px-4 py-3.5 rounded-xl bg-[#fcfcfc] border border-grey-100 text-grey-950 text-sm font-medium placeholder-grey-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all outline-none"
            />
          </FormField>

          <FormField label="Kapasitas (Orang)">
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(Math.max(1, parseInt(e.target.value) || 1))}
              min={1}
              required
              className="w-full px-4 py-3.5 rounded-xl bg-[#fcfcfc] border border-grey-100 text-grey-950 text-sm font-medium focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all outline-none"
            />
          </FormField>

          <FormField label="Bentuk Meja">
            <div className="grid grid-cols-4 gap-2">
              {(Object.entries(SHAPE_CONFIG) as [TableShape, { label: string; labelId: string; icon: string }][]).map(
                ([key, val]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setShape(key)}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all text-xs font-medium ${
                      shape === key
                        ? "border-primary-500 bg-primary-50 text-primary-500"
                        : "border-grey-100 bg-grey-50 text-grey-500 hover:border-grey-200"
                    }`}
                  >
                    <ShapePreview shape={key} selected={shape === key} />
                    <span>{val.labelId}</span>
                  </button>
                )
              )}
            </div>
          </FormField>

          <FormField label="Ruangan">
            <div className="w-full px-4 py-3.5 rounded-xl bg-grey-50 border border-grey-100 text-grey-500 text-sm font-bold flex items-center justify-between cursor-not-allowed">
              <span>{floors.find(f => f.id === floorId)?.name || "—"}</span>
              <span className="text-[10px] uppercase font-bold text-grey-400 px-2 py-0.5 rounded-md border border-grey-200">Locked</span>
            </div>
          </FormField>

          <FormField label="Status Meja">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TableStatus)}
              className="w-full px-4 py-3.5 rounded-xl bg-[#fcfcfc] border border-grey-100 text-grey-950 text-sm font-medium focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all appearance-none cursor-pointer outline-none"
            >
              {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.labelId}
                </option>
              ))}
            </select>
          </FormField>

          <button
            type="submit"
            className="w-full py-4 rounded-xl font-bold text-sm bg-primary-500 text-white shadow-md shadow-primary-500/20 hover:bg-primary-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all mt-4"
          >
            Simpan Meja
          </button>
        </form>
      </div>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-grey-500 mb-2">{label}</label>
      {children}
    </div>
  );
}

function ShapePreview({ shape, selected }: { shape: TableShape; selected: boolean }) {
  const color = selected ? "#284B63" : "#76777A";
  const fill = selected ? "#EFF6FC" : "#F5F5F6";

  return (
    <svg width="28" height="28" viewBox="0 0 32 32">
      {shape === "square" && (
        <>
          <rect x="6" y="6" width="20" height="20" rx="3" fill={fill} stroke={color} strokeWidth="1.5" />
          <rect x="12" y="2" width="8" height="3" rx="1.5" fill={color} opacity="0.4" />
          <rect x="12" y="27" width="8" height="3" rx="1.5" fill={color} opacity="0.4" />
        </>
      )}
      {shape === "rectangle" && (
        <>
          <rect x="3" y="8" width="26" height="16" rx="3" fill={fill} stroke={color} strokeWidth="1.5" />
          <rect x="8" y="3" width="6" height="3" rx="1.5" fill={color} opacity="0.4" />
          <rect x="18" y="3" width="6" height="3" rx="1.5" fill={color} opacity="0.4" />
          <rect x="8" y="26" width="6" height="3" rx="1.5" fill={color} opacity="0.4" />
          <rect x="18" y="26" width="6" height="3" rx="1.5" fill={color} opacity="0.4" />
        </>
      )}
      {shape === "round" && (
        <>
          <circle cx="16" cy="16" r="10" fill={fill} stroke={color} strokeWidth="1.5" />
          <rect x="14" y="2" width="4" height="3" rx="1.5" fill={color} opacity="0.4" />
          <rect x="14" y="27" width="4" height="3" rx="1.5" fill={color} opacity="0.4" />
          <rect x="2" y="14" width="3" height="4" rx="1.5" fill={color} opacity="0.4" />
          <rect x="27" y="14" width="3" height="4" rx="1.5" fill={color} opacity="0.4" />
        </>
      )}
      {shape === "booth" && (
        <>
          <rect x="3" y="4" width="4" height="24" rx="2" fill={color} opacity="0.2" />
          <rect x="9" y="6" width="18" height="20" rx="3" fill={fill} stroke={color} strokeWidth="1.5" />
          <rect x="28" y="10" width="3" height="4" rx="1.5" fill={color} opacity="0.4" />
          <rect x="28" y="18" width="3" height="4" rx="1.5" fill={color} opacity="0.4" />
        </>
      )}
    </svg>
  );
}
