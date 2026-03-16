"use client";

import { useState } from "react";
import { Table } from "@/types/table";
import { X, Clock, Users, User } from "lucide-react";

interface AddReservationModalProps {
  isOpen: boolean;
  table: Table | null;
  onClose: () => void;
  onReserve: (tableId: string, guestName: string, partySize: number, time: string) => void;
}

export default function AddReservationModal({
  isOpen,
  table,
  onClose,
  onReserve,
}: AddReservationModalProps) {
  const [guestName, setGuestName] = useState("");
  const [partySize, setPartySize] = useState("");
  const [time, setTime] = useState("");

  // Auto-fill party size when opened based on capacity
  useState(() => {
    if (table) setPartySize(table.capacity.toString());
  });

  if (!isOpen || !table) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !partySize || !time) return;
    
    onReserve(table.id, guestName.trim(), parseInt(partySize, 10), time);
    
    // Reset
    setGuestName("");
    setPartySize("");
    setTime("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" />
      <div
        className="relative w-full max-w-md bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-white/[0.08] rounded-3xl p-6 shadow-2xl animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white/90">New Reservation</h2>
            <p className="text-xs text-white/40 mt-1">Reserving {table.name} (Capacity: {table.capacity})</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/[0.05] text-white/40 hover:bg-white/[0.1] hover:text-white/80 transition-all duration-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/50 mb-2 flex items-center gap-1.5">
              <User className="w-4 h-4" /> Guest Name
            </label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="e.g. John Doe"
              required
              className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white/90 placeholder-white/25 focus:outline-none focus:border-amber-500/40 focus:bg-white/[0.07] transition-all duration-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/50 mb-2 flex items-center gap-1.5">
                <Users className="w-4 h-4" /> Party Size
              </label>
              <input
                type="number"
                value={partySize}
                onChange={(e) => setPartySize(e.target.value)}
                min={1}
                max={table.capacity + 2} // allow slight overbooking for demo
                required
                className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white/90 placeholder-white/25 focus:outline-none focus:border-amber-500/40 focus:bg-white/[0.07] transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/50 mb-2 flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> Time
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white/90 focus:outline-none focus:border-amber-500/40 focus:bg-white/[0.07] transition-all duration-300 color-scheme-dark"
                style={{ colorScheme: "dark" }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 hover:from-amber-500 hover:to-orange-500 active:scale-[0.98] transition-all duration-300"
          >
            Confirm Reservation
          </button>
        </form>
      </div>
    </div>
  );
}
