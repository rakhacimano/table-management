"use client";

import { TableStatus, TableShape, STATUS_CONFIG } from "@/types/table";

interface TableVisualProps {
  shape: TableShape;
  capacity: number;
  status: TableStatus;
  name?: string;
  size?: number; // overall size in px
  showLabel?: boolean;
}

export default function TableVisual({
  shape,
  capacity,
  status,
  name,
  size = 120,
  showLabel = true,
}: TableVisualProps) {
  const statusColor = STATUS_CONFIG[status].hex;
  const statusLight = STATUS_CONFIG[status].hexLight;
  const chairColor = statusColor;
  const chairSize = Math.max(size * 0.1, 8);

  // Generate chair positions based on shape and capacity
  const chairs = getChairPositions(shape, capacity, size, chairSize);

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        width={size + chairSize * 3}
        height={size + chairSize * 3}
        viewBox={`${-chairSize * 1.5} ${-chairSize * 1.5} ${size + chairSize * 3} ${size + chairSize * 3}`}
        className="drop-shadow-sm"
      >
        {/* Chairs */}
        {chairs.map((chair, i) => (
          <rect
            key={i}
            x={chair.x}
            y={chair.y}
            width={chair.w}
            height={chair.h}
            rx={chair.w / 2}
            fill={chairColor}
            opacity="0.5"
          />
        ))}

        {/* Table surface */}
        {shape === "round" ? (
          <ellipse
            cx={size / 2}
            cy={size / 2}
            rx={size / 2 - 2}
            ry={size / 2 - 2}
            fill={statusLight}
            stroke={statusColor}
            strokeWidth="2"
          />
        ) : shape === "booth" ? (
          <>
            {/* Booth back */}
            <rect
              x={0}
              y={0}
              width={size * 0.15}
              height={size}
              rx={4}
              fill={statusColor}
              opacity="0.3"
            />
            {/* Booth table */}
            <rect
              x={size * 0.2}
              y={size * 0.1}
              width={size * 0.75}
              height={size * 0.8}
              rx={6}
              fill={statusLight}
              stroke={statusColor}
              strokeWidth="2"
            />
          </>
        ) : (
          <rect
            x={shape === "rectangle" ? 0 : size * 0.1}
            y={shape === "rectangle" ? size * 0.1 : 0}
            width={shape === "rectangle" ? size : size * 0.8}
            height={shape === "rectangle" ? size * 0.8 : size}
            rx={8}
            fill={statusLight}
            stroke={statusColor}
            strokeWidth="2"
          />
        )}

        {/* Table name centered */}
        {showLabel && name && (
          <text
            x={size / 2}
            y={size / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fill={statusColor}
            fontSize={Math.max(size * 0.13, 10)}
            fontWeight="700"
            fontFamily="'Google Sans', sans-serif"
          >
            {name}
          </text>
        )}
      </svg>
      {showLabel && (
        <span className="text-[10px] font-bold uppercase tracking-wider text-white/30">
          {capacity} {capacity === 1 ? "seat" : "seats"}
        </span>
      )}
    </div>
  );
}

interface ChairPos {
  x: number;
  y: number;
  w: number;
  h: number;
}

function getChairPositions(
  shape: TableShape,
  capacity: number,
  size: number,
  cs: number
): ChairPos[] {
  const chairs: ChairPos[] = [];
  const gap = 3;

  if (shape === "round") {
    // Chairs arranged in a circle around the table
    const radius = size / 2 + cs / 2 + gap;
    for (let i = 0; i < capacity; i++) {
      const angle = (2 * Math.PI * i) / capacity - Math.PI / 2;
      chairs.push({
        x: size / 2 + Math.cos(angle) * radius - cs / 2,
        y: size / 2 + Math.sin(angle) * radius - cs * 0.35,
        w: cs,
        h: cs * 0.7,
      });
    }
  } else if (shape === "booth") {
    // Chairs only on the right side of the booth
    const tableRight = size * 0.2 + size * 0.75 + gap;
    const tableTop = size * 0.1;
    const tableH = size * 0.8;
    const spacing = tableH / capacity;
    for (let i = 0; i < capacity; i++) {
      chairs.push({
        x: tableRight,
        y: tableTop + spacing * i + (spacing - cs * 0.7) / 2,
        w: cs,
        h: cs * 0.7,
      });
    }
  } else {
    // Square/Rectangle: distribute chairs on all 4 sides
    const isRect = shape === "rectangle";
    const tableX = isRect ? 0 : size * 0.1;
    const tableY = isRect ? size * 0.1 : 0;
    const tableW = isRect ? size : size * 0.8;
    const tableH = isRect ? size * 0.8 : size;

    // Distribute evenly: top, bottom, left, right
    const sides: { side: "top" | "bottom" | "left" | "right"; count: number }[] = [];
    const remaining = capacity;

    if (remaining >= 2) {
      // Divide evenly between top/bottom and left/right based on shape
      // For rectangle (wider than tall), prioritize top/bottom
      // For square, distribute evenly
      
      let topBottomTotal = 0;
      let leftRightTotal = 0;
      
      if (isRect) {
         // rough heuristic: 2 on sides, rest on top/bot
         leftRightTotal = Math.min(2, remaining);
         topBottomTotal = remaining - leftRightTotal;
         
         // If capacity is 6, we want 2 top, 2 bot, 1 left, 1 right
         if (remaining >= 6) {
           leftRightTotal = 2; // 1 per side
           topBottomTotal = remaining - 2;
         } else if (remaining === 4) {
           // 2 top, 2 bot, 0 sides
           topBottomTotal = 4;
           leftRightTotal = 0;
         }
      } else {
         // Square: divide evenly. e.g. 4 -> 1 on each side
         topBottomTotal = Math.ceil(remaining / 2);
         if (topBottomTotal % 2 !== 0 && topBottomTotal > 1) {
             topBottomTotal -= 1; // Make it even so top/bot have same amount
         }
         leftRightTotal = remaining - topBottomTotal;
      }

      const top = Math.ceil(topBottomTotal / 2);
      const bottom = topBottomTotal - top;
      if (top > 0) sides.push({ side: "top", count: top });
      if (bottom > 0) sides.push({ side: "bottom", count: bottom });

      const left = Math.ceil(leftRightTotal / 2);
      const right = leftRightTotal - left;
      if (left > 0) sides.push({ side: "left", count: left });
      if (right > 0) sides.push({ side: "right", count: right });

    } else if (remaining === 1) {
      sides.push({ side: "top", count: 1 });
    }

    for (const { side, count } of sides) {
      for (let i = 0; i < count; i++) {
        if (side === "top") {
          const spacing = tableW / count;
          chairs.push({
            x: tableX + spacing * i + (spacing - cs) / 2,
            y: tableY - cs * 0.7 - gap,
            w: cs,
            h: cs * 0.7,
          });
        } else if (side === "bottom") {
          const spacing = tableW / count;
          chairs.push({
            x: tableX + spacing * i + (spacing - cs) / 2,
            y: tableY + tableH + gap,
            w: cs,
            h: cs * 0.7,
          });
        } else if (side === "left") {
          const spacing = tableH / count;
          chairs.push({
            x: tableX - cs - gap,
            y: tableY + spacing * i + (spacing - cs * 0.7) / 2,
            w: cs,
            h: cs * 0.7,
          });
        } else {
          const spacing = tableH / count;
          chairs.push({
            x: tableX + tableW + gap,
            y: tableY + spacing * i + (spacing - cs * 0.7) / 2,
            w: cs,
            h: cs * 0.7,
          });
        }
      }
    }
  }

  return chairs;
}
