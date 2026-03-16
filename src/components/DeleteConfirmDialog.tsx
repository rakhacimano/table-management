"use client";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  tableName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmDialog({
  isOpen,
  tableName,
  onClose,
  onConfirm,
}: DeleteConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" />

      {/* Dialog */}
      <div
        className="
          relative w-full max-w-sm
          bg-gradient-to-br from-[#1a1a2e] to-[#16162a]
          border border-white/[0.08]
          rounded-3xl p-6 shadow-2xl
          animate-slideUp
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Warning Icon */}
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20">
            <svg
              className="w-8 h-8 text-rose-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
        </div>

        <h3 className="text-lg font-bold text-white/90 text-center mb-2">
          Delete Table
        </h3>
        <p className="text-sm text-white/40 text-center mb-6">
          Are you sure you want to delete{" "}
          <span className="text-white/70 font-medium">{tableName}</span>? This
          action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="
              flex-1 py-3 rounded-xl font-semibold text-sm
              bg-white/[0.05] text-white/60
              border border-white/[0.06]
              hover:bg-white/[0.1] hover:text-white/80
              transition-all duration-300
              active:scale-[0.97]
            "
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="
              flex-1 py-3 rounded-xl font-semibold text-sm
              bg-gradient-to-r from-rose-600 to-red-600
              text-white shadow-lg shadow-rose-500/20
              hover:shadow-xl hover:shadow-rose-500/30
              hover:from-rose-500 hover:to-red-500
              active:scale-[0.97]
              transition-all duration-300
            "
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
