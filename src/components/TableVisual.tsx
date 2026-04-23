"use client";

import { TableShape, TableStatus, STATUS_CONFIG } from "@/types/table";

interface TableVisualProps {
  shape: TableShape;
  capacity: number;
  status: TableStatus;
  name: string;
  size?: number;
  showLabel?: boolean;
}

export default function TableVisual({
  shape,
  capacity,
  status,
  name,
  size = 64,
  showLabel = true,
}: TableVisualProps) {
  const config = STATUS_CONFIG[status];
  const chairColor = config.chairColor;
  const tableBg = config.tableBg;
  const tableBorder = config.tableBorder;

  const getChairPositions = () => {
    const chairs: { top: number; bottom: number; left: number; right: number } = {
      top: 0, bottom: 0, left: 0, right: 0,
    };
    if (capacity <= 2) {
      chairs.top = 1;
      chairs.bottom = 1;
    } else if (capacity <= 4) {
      chairs.top = 2;
      chairs.bottom = 2;
    } else if (capacity <= 6) {
      chairs.top = 3;
      chairs.bottom = 3;
    } else {
      chairs.top = 3;
      chairs.bottom = 3;
      chairs.left = 1;
      chairs.right = 1;
    }
    return chairs;
  };

  const chairs = getChairPositions();
  const isRound = shape === "round";
  const isBooth = shape === "booth";

  const tableW = shape === "rectangle" ? size * 1.1 : size;
  const tableH = isRound ? size : size * 0.5;

  // Approximate label from table name (e.g. "Meja 1" -> "T-01")
  const shortLabel = name.length > 5 ? name.slice(0, 5) : name;

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Top Chairs */}
      <div className="flex items-center justify-between w-full px-2">
        {Array.from({ length: chairs.top }).map((_, i) => (
          <ChairUnit key={`t-${i}`} color={chairColor} />
        ))}
      </div>

      {/* Table row (with side chairs) */}
      <div className="flex items-center gap-1">
        {/* Left chairs */}
        {chairs.left > 0 && (
          <div className="flex flex-col gap-1">
            {Array.from({ length: chairs.left }).map((_, i) => (
              <ChairUnit key={`l-${i}`} color={chairColor} rotated />
            ))}
          </div>
        )}

        {/* Booth backrest */}
        {isBooth && (
          <div
            className="rounded-sm"
            style={{
              width: 4,
              height: tableH,
              backgroundColor: chairColor,
              opacity: 0.6,
            }}
          />
        )}

        {/* Table */}
        <div
          className={`relative flex items-center justify-center ${
            isRound ? "rounded-full" : "rounded-lg"
          }`}
          style={{
            width: tableW,
            height: tableH,
            backgroundColor: tableBg,
            border: `1px solid ${tableBorder}`,
          }}
        >
          {showLabel && (
            <span className="font-semibold text-xs text-grey-950 text-center select-none">
              {shortLabel}
            </span>
          )}
        </div>

        {/* Right chairs */}
        {chairs.right > 0 && (
          <div className="flex flex-col gap-1">
            {Array.from({ length: chairs.right }).map((_, i) => (
              <ChairUnit key={`r-${i}`} color={chairColor} rotated />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Chairs */}
      <div className="flex items-center justify-between w-full px-2">
        {Array.from({ length: chairs.bottom }).map((_, i) => (
          <ChairUnit key={`b-${i}`} color={chairColor} flipped />
        ))}
      </div>
    </div>
  );
}

function ChairUnit({
  color,
  flipped,
  rotated,
}: {
  color: string;
  flipped?: boolean;
  rotated?: boolean;
}) {
  if (rotated) {
    return (
      <div className="flex gap-px items-center">
        <div className="rounded-sm" style={{ width: 3, height: 12, backgroundColor: color }} />
        <div className="rounded-sm" style={{ width: 8, height: 12, backgroundColor: color }} />
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-px items-center ${flipped ? "rotate-180" : ""}`}>
      <div className="rounded-sm" style={{ width: 12, height: 8, backgroundColor: color }} />
      <div className="rounded-sm" style={{ width: 12, height: 3, backgroundColor: color }} />
    </div>
  );
}
