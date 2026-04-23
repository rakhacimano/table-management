"use client";

import { AlertTriangle, X } from "lucide-react";

interface DeleteMejaDialogProps {
  isOpen: boolean;
  tableName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteMejaDialog({
  isOpen,
  tableName,
  onClose,
  onConfirm,
}: DeleteMejaDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fadeIn" />
      <div
        className="relative w-full max-w-sm bg-white border border-grey-100 rounded-2xl p-6 shadow-xl animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-grey-50 text-grey-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-danger-50 flex items-center justify-center mb-4">
            <AlertTriangle className="w-7 h-7 text-danger-500" />
          </div>

          <h3 className="text-lg font-semibold text-grey-950 mb-2">Hapus Meja?</h3>
          <p className="text-sm text-grey-500 mb-6">
            Apakah kamu yakin ingin menghapus <strong className="text-grey-950">{tableName}</strong>? Tindakan ini tidak bisa dibatalkan.
          </p>

          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-medium text-sm border border-grey-100 text-grey-700 hover:bg-grey-50 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 py-3 rounded-xl font-medium text-sm bg-danger-500 text-white hover:bg-[#e01e4a] transition-colors"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
