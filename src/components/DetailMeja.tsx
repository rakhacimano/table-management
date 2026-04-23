"use client";

import { useState, useEffect } from "react";
import { Table, STATUS_CONFIG, TableStatus } from "@/types/table";
import { Edit2, Trash2, X, Timer, CheckCircle, SprayCan, ArrowRightLeft, UserCircle } from "lucide-react";

interface DetailMejaProps {
  table: Table | null;
  floorName: string;
  onEdit: (table: Table) => void;
  onDelete: (table: Table) => void;
  onClose: () => void;
  onUpdateStatus: (id: string, status: TableStatus) => void;
  onAssignGuest: (id: string, guestName: string, pax: number) => void;
}

export default function DetailMeja({ table, floorName, onEdit, onDelete, onClose, onUpdateStatus, onAssignGuest }: DetailMejaProps) {
  const [durationStr, setDurationStr] = useState<string>("");
  const [showAssignMode, setShowAssignMode] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [paxCount, setPaxCount] = useState(table?.capacity ?? 1);

  // Live Timer Polling Loop
  useEffect(() => {
    if (!table || table.status !== "occupied" || !table.occupiedSince) {
      setDurationStr("");
      return;
    }

    const updateTimer = () => {
      const ms = Date.now() - (table.occupiedSince || Date.now());
      const m = Math.floor(ms / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      const h = Math.floor(m / 60);
      if (h > 0) {
        setDurationStr(`${h}h ${m%60}m`);
      } else {
        setDurationStr(`${m}m ${s}s`);
      }
    };
    
    updateTimer(); // fire immediately
    const int = setInterval(updateTimer, 1000);
    return () => clearInterval(int);
  }, [table?.status, table?.occupiedSince, table]);

  if (!table) return null;

  const statusConf = STATUS_CONFIG[table.status];

  const handleAssign = () => {
    if (!guestName.trim()) return;
    onAssignGuest(table.id, guestName.trim(), paxCount);
    setShowAssignMode(false);
  };

  return (
    <div className="absolute top-4 right-4 z-40 w-[240px] bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-2xl p-5 flex flex-col gap-4 animate-scaleIn">
      {/* Header & Close */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <p className="font-bold text-lg text-grey-950">{table.name}</p>
          <p className="text-[11px] font-medium text-grey-500 bg-grey-50 px-2 py-0.5 rounded-md w-fit mt-1">
            {floorName}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-grey-400 hover:text-grey-900 hover:bg-grey-100/50 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Table Visual Preview */}
      <div className="bg-[#fcfcfc] rounded-xl border border-grey-50 py-4 flex items-center justify-center inset-shadow-sm">
        <MiniTablePreview shape={table.shape} status={table.status} />
      </div>

      {/* Info Section */}
      <div className="flex flex-col gap-3">
        <DetailRow label="Kapasitas" value={`${table.capacity} Pax`} />
        {table.status === "occupied" && table.guestName && (
          <div className="flex items-center justify-between text-xs w-full">
            <p className="font-medium text-grey-500">Pelanggan</p>
            <div className="flex gap-2 items-center text-grey-900 font-bold">
              <UserCircle className="w-4 h-4 text-primary-500" />
              {table.guestName} ({table.currentPax} pax)
            </div>
          </div>
        )}
        
        {table.status === "occupied" && durationStr && (
          <div className="flex items-center justify-between text-xs w-full">
            <p className="font-medium text-grey-500">Durasi Terisi</p>
            <div className="flex gap-1.5 items-center text-warning-600 font-bold bg-warning-50 px-2 py-1 rounded-md">
              <Timer className="w-3.5 h-3.5" />
              {durationStr}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-xs w-full">
          <p className="font-medium text-grey-500">Status</p>
          <div
            className="px-2.5 py-1 rounded-full flex items-center gap-1.5"
            style={{ backgroundColor: statusConf.hexLight, color: statusConf.hex }}
          >
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusConf.hex }} />
            <span className="font-bold text-[10px] uppercase tracking-wider">{statusConf.labelId}</span>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-grey-50" />

      {/* Operational Quick Actions Contextual */}
      <div className="flex flex-col gap-2 w-full">
        <p className="text-[10px] font-bold text-grey-400 uppercase tracking-wider mb-0.5">Quick Actions</p>
        
        {showAssignMode ? (
          <div className="flex flex-col gap-2 p-3 bg-primary-50/50 border border-primary-100 rounded-xl animate-fadeIn">
            <input type="text" autoFocus placeholder="Nama Pelanggan" value={guestName} onChange={e=>setGuestName(e.target.value)} className="text-xs px-3 py-2 rounded-lg border border-primary-200 outline-none focus:border-primary-500" />
            <div className="flex gap-2 items-center">
               <span className="text-xs text-grey-500 font-medium whitespace-nowrap">Jml Pax:</span>
               <input type="number" min="1" max={table.capacity} value={paxCount} onChange={e=>setPaxCount(Number(e.target.value))} className="text-xs px-2 py-1.5 w-16 rounded-lg border border-primary-200 outline-none focus:border-primary-500" />
            </div>
            <div className="flex gap-2 mt-1">
              <button onClick={() => setShowAssignMode(false)} className="flex-1 text-[10px] font-bold text-grey-500 py-1.5">Batal</button>
              <button onClick={handleAssign} disabled={!guestName.trim()} className="flex-1 bg-primary-500 text-white rounded-md text-[10px] font-bold py-1.5 shadow-sm disabled:opacity-50">Simpan</button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {table.status === "available" && (
              <button onClick={() => setShowAssignMode(true)} className="flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary-50/60 text-primary-600 hover:bg-primary-100/60 active:scale-95 transition-all text-[10px] font-bold">
                 <CheckCircle className="w-4 h-4" />
                 Tandai Terisi
              </button>
            )}
            
            {table.status === "occupied" && (
              <>
                 <button onClick={() => onUpdateStatus(table.id, "cleaning")} className="flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-xl bg-orange-50 text-orange-500 hover:bg-orange-100 active:scale-95 transition-all text-[10px] font-bold">
                    <SprayCan className="w-4 h-4" />
                    Bersihkan
                 </button>
                 <button onClick={() => alert("Pilih meja tujuan di mode khusus (WIP)")} className="flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-50 text-blue-500 hover:bg-blue-100 active:scale-95 transition-all text-[10px] font-bold">
                    <ArrowRightLeft className="w-4 h-4" />
                    Pindah Meja
                 </button>
              </>
            )}
            
            {table.status === "cleaning" && (
              <button onClick={() => onUpdateStatus(table.id, "available")} className="col-span-2 flex items-center justify-center gap-2 py-3 rounded-xl bg-success-50 text-success-600 hover:bg-success-100 active:scale-95 transition-all text-xs font-bold">
                 <CheckCircle className="w-4 h-4" />
                 Selesai Dibersihkan (Available)
              </button>
            )}
            
            {table.status === "reserved" && (
              <button onClick={() => setShowAssignMode(true)} className="col-span-2 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary-50 text-primary-600 hover:bg-primary-100 active:scale-95 transition-all text-xs font-bold">
                 <CheckCircle className="w-4 h-4" />
                 Tamu Tiba (Tandai Terisi)
              </button>
            )}
          </div>
        )}
      </div>

      <div className="h-px w-full bg-grey-50" />

      {/* Admin Action Buttons */}
      <div className="flex gap-2 w-full mt-2">
        <button
          onClick={() => onEdit(table)}
          className="flex-1 flex gap-1.5 items-center justify-center py-2.5 rounded-xl bg-warning-50 text-warning-500 font-semibold text-xs hover:bg-warning-100 active:scale-95 transition-all"
        >
          <Edit2 className="w-3.5 h-3.5" />
          Edit
        </button>
        <button
          onClick={() => onDelete(table)}
          className="flex-1 flex gap-1.5 items-center justify-center py-2.5 rounded-xl bg-danger-50 text-danger-500 font-semibold text-xs hover:bg-danger-100 active:scale-95 transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Hapus
        </button>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-xs w-full">
      <p className="font-medium text-grey-500">{label}</p>
      <p className="font-bold text-grey-900">{value}</p>
    </div>
  );
}

function MiniTablePreview({ shape, status }: { shape: string; status: string }) {
  const conf = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
  const chairColor = conf?.chairColor || "#C9C9CB";
  const tableBg = conf?.tableBg || "#F5F5F6";
  const tableBorder = conf?.tableBorder || "#E6E6E7";

  const isRound = shape === "round";

  return (
    <div className="flex flex-col items-center gap-1.5 drop-shadow-sm">
      <div className="flex gap-1.5 px-2"><Chair color={chairColor} /></div>
      <div
        className={`flex items-center justify-center shadow-inner ${isRound ? "rounded-full w-9 h-9" : "rounded-xl w-9 h-9"}`}
        style={{ backgroundColor: tableBg, border: `1.5px solid ${tableBorder}` }}
      />
      <div className="flex gap-1.5 px-2"><Chair color={chairColor} flipped /></div>
    </div>
  );
}

function Chair({ color, flipped }: { color: string; flipped?: boolean }) {
  return (
    <div className={`flex flex-col gap-0.5 items-center ${flipped ? "rotate-180" : ""}`}>
      <div className="w-3.5 h-2 rounded-sm" style={{ backgroundColor: color }} />
      <div className="w-3.5 h-1 rounded-sm opacity-80" style={{ backgroundColor: color }} />
    </div>
  );
}
