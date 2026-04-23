"use client";

import { TableStatus, STATUS_CONFIG } from "@/types/table";

interface StatusBadgeProps {
  status: TableStatus;
  onClick?: () => void;
}

export default function StatusBadge({ status, onClick }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <button
      onClick={onClick}
      className="border border-grey-50 rounded-lg px-2 py-1 bg-white hover:bg-grey-50 transition-colors"
      title={`Status: ${config.labelId}. Click to cycle.`}
    >
      <div className="flex items-center gap-1.5">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: config.hex }}
        />
        <span className="font-medium text-xs text-grey-500">
          {config.labelId}
        </span>
      </div>
    </button>
  );
}
