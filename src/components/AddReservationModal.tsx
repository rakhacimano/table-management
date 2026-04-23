"use client";

import { useState, useMemo } from "react";
import { X, Clock, Users } from "lucide-react";
import { Table, Floor, Reservation, ReservationSettings } from "@/types/table";

interface AddReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (tableId: string, guestName: string, partySize: number, time: string) => void;
  floors: Floor[];
  tables: Table[];
  reservations: Reservation[];
  settings: ReservationSettings;
}

// Convert "HH:MM" to total minutes since 00:00 for easy overlap math
function timeToMinutes(timeStr: string) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

export default function AddReservationModal({
  isOpen,
  onClose,
  onAdd,
  floors,
  tables,
  reservations,
  settings,
}: AddReservationModalProps) {
  const [guestName, setGuestName] = useState("");
  const [partySize, setPartySize] = useState<number>(2);
  const [time, setTime] = useState("18:00");
  const [selectedFloorId, setSelectedFloorId] = useState(floors[0]?.id || "");
  const [selectedTableId, setSelectedTableId] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Filter tables by selected room
  const availableTables = useMemo(() => {
    return tables.filter(t => t.floorId === selectedFloorId);
  }, [tables, selectedFloorId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!guestName || !time || !selectedTableId) {
      setError("Please fill all fields");
      return;
    }

    const proposedTimeStr = time;
    const proposedMin = timeToMinutes(proposedTimeStr);

    // Calculate buffer boundaries for proposed block
    const proposedStart = proposedMin - settings.preBufferMin;
    const proposedEnd = proposedMin + settings.diningDurationMin + settings.postBufferMin;

    // Detect collision against existing reservations for the target table
    const targetTableReservations = reservations.filter(r => r.tableId === selectedTableId);
    
    for (const existingRes of targetTableReservations) {
      const existingMin = timeToMinutes(existingRes.time);
      const existingStart = existingMin - settings.preBufferMin;
      const existingEnd = existingMin + settings.diningDurationMin + settings.postBufferMin;

      // Overlap logic: StartA < EndB && EndA > StartB
      if (proposedStart < existingEnd && proposedEnd > existingStart) {
        setError(`Terjadi tumpukan jadwal! Meja sudah dibooking pada ${existingRes.time}. Silakan pilih waktu lain atau meja lain.`);
        return;
      }
    }

    onAdd(selectedTableId, guestName, partySize, time);
    
    // reset form
    setGuestName("");
    setPartySize(2);
    setTime("18:00");
    setSelectedTableId("");
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-grey-950/40 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden animate-slideUp">
        <div className="px-6 py-4 border-b border-grey-100 flex justify-between items-center bg-grey-50/50">
          <h2 className="text-lg font-bold text-grey-900">Tambah Reservasi</h2>
          <button
            onClick={onClose}
            className="p-2 text-grey-400 hover:text-grey-700 hover:bg-grey-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            
            {error && (
              <div className="p-3 mb-2 rounded-xl bg-danger-50 border border-danger-100 text-danger-600 text-sm font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-grey-700 mb-1">
                Nama Pelanggan
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Cth: John Doe"
                className="w-full px-4 py-3 bg-[#fcfcfc] border border-grey-100 rounded-xl text-sm text-grey-900 font-medium placeholder-grey-400 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-grey-700 mb-1">
                  Jumlah Tamu
                </label>
                <div className="relative">
                  <select
                    value={partySize}
                    onChange={(e) => setPartySize(Number(e.target.value))}
                    className="w-full appearance-none px-4 py-3 bg-[#fcfcfc] border border-grey-100 rounded-xl text-sm text-grey-900 font-medium outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20].map((num) => (
                      <option key={num} value={num}>
                        {num} Pax
                      </option>
                    ))}
                  </select>
                  <Users className="w-4 h-4 text-grey-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-grey-700 mb-1">
                  Waktu
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-3 bg-[#fcfcfc] border border-grey-100 rounded-xl text-sm text-grey-900 font-medium outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                  />
                  <Clock className="w-4 h-4 text-grey-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-grey-700 mb-1">
                Pilih Ruangan
              </label>
              <select
                value={selectedFloorId}
                onChange={(e) => setSelectedFloorId(e.target.value)}
                className="w-full appearance-none px-4 py-3 bg-[#fcfcfc] border border-grey-100 rounded-xl text-sm text-grey-900 font-medium outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all mb-4"
              >
                {floors.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-grey-700 mb-1">
                Pilih Meja
              </label>
              <select
                value={selectedTableId}
                onChange={(e) => setSelectedTableId(e.target.value)}
                className="w-full appearance-none px-4 py-3 bg-[#fcfcfc] border border-grey-100 rounded-xl text-sm text-grey-900 font-medium outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              >
                <option value="" disabled>-- Pilih Meja --</option>
                {availableTables.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} (Kapasitas: {t.capacity})
                  </option>
                ))}
              </select>
            </div>

          </div>

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-5 py-3 rounded-xl border border-grey-200 text-grey-700 font-bold hover:bg-grey-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-5 py-3 rounded-xl bg-primary-500 text-white font-bold hover:bg-primary-600 transition-colors drop-shadow-sm"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
