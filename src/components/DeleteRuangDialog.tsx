"use client";

import { AlertTriangle, X } from "lucide-react";

interface DeleteRuangDialogProps {
  isOpen: boolean;
  roomName: string;
  tableCount: number;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteRuangDialog({
  isOpen,
  roomName,
  tableCount,
  onClose,
  onConfirm,
}: DeleteRuangDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn" />
      <div
        className="relative w-full max-w-sm bg-white border border-grey-100 rounded-3xl p-7 shadow-[0_10px_40px_rgb(0,0,0,0.1)] animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl hover:bg-grey-50 text-grey-300 hover:text-grey-900 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center mt-2">
          <div className="w-16 h-16 rounded-full bg-danger-50 flex items-center justify-center mb-5 shadow-sm shadow-danger-100">
            <AlertTriangle className="w-7 h-7 text-danger-500" />
          </div>

          <h3 className="text-xl font-bold text-grey-950 mb-2">Hapus Ruangan?</h3>
          <p className="text-sm text-grey-500 mb-6 leading-relaxed">
            Apakah kamu yakin ingin menghapus <strong className="text-grey-950">{roomName}</strong>?
            {tableCount > 0 && (
              <span className="block mt-2 font-semibold text-danger-500">
                Ruang ini memiliki {tableCount} meja. Hapus semua meja juga?
              </span>
            )}
          </p>

          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 py-3.5 rounded-xl font-bold text-sm bg-white border border-grey-200 text-grey-700 hover:bg-grey-50 active:scale-95 transition-all"
            >
              Batal
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 py-3.5 rounded-xl font-bold text-sm bg-danger-500 text-white shadow-md shadow-danger-500/20 hover:bg-[#e01e4a] hover:-translate-y-0.5 active:scale-95 transition-all"
            >
              Hapus Semua
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
