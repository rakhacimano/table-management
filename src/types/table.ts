export type TableStatus = "available" | "occupied" | "reserved" | "cleaning";
export type TableShape = "square" | "rectangle" | "round" | "booth";

export interface Floor {
  id: string;
  name: string;
}

export interface Reservation {
  id: string;
  tableId: string;
  guestName: string;
  partySize: number;
  time: string; // e.g., "18:00"
}

export interface Table {
  id: string;
  name: string;
  capacity: number;
  status: TableStatus;
  shape: TableShape;
  floorId: string;
  x: number;
  y: number;
}

export const STATUS_CONFIG: Record<
  TableStatus,
  {
    label: string;
    color: string;
    bg: string;
    border: string;
    glow: string;
    hex: string;
    hexLight: string;
  }
> = {
  available: {
    label: "Available",
    color: "text-emerald-400",
    bg: "bg-emerald-500/15",
    border: "border-emerald-500/30",
    glow: "shadow-emerald-500/20",
    hex: "#34d399",
    hexLight: "#34d39930",
  },
  occupied: {
    label: "Occupied",
    color: "text-rose-400",
    bg: "bg-rose-500/15",
    border: "border-rose-500/30",
    glow: "shadow-rose-500/20",
    hex: "#fb7185",
    hexLight: "#fb718530",
  },
  reserved: {
    label: "Reserved",
    color: "text-amber-400",
    bg: "bg-amber-500/15",
    border: "border-amber-500/30",
    glow: "shadow-amber-500/20",
    hex: "#fbbf24",
    hexLight: "#fbbf2430",
  },
  cleaning: {
    label: "Cleaning",
    color: "text-slate-400",
    bg: "bg-slate-500/15",
    border: "border-slate-500/30",
    glow: "shadow-slate-500/20",
    hex: "#94a3b8",
    hexLight: "#94a3b830",
  },
};

export const SHAPE_CONFIG: Record<
  TableShape,
  { label: string; icon: string }
> = {
  square: { label: "Square", icon: "□" },
  rectangle: { label: "Rectangle", icon: "▭" },
  round: { label: "Round", icon: "○" },
  booth: { label: "Booth", icon: "⊏" },
};

export const STATUS_ORDER: TableStatus[] = [
  "available",
  "occupied",
  "reserved",
  "cleaning",
];

function autoShape(capacity: number): TableShape {
  if (capacity <= 2) return "square";
  if (capacity <= 4) return "square";
  if (capacity <= 6) return "rectangle";
  return "round";
}

export const DEFAULT_FLOORS: Floor[] = [
  { id: "floor-1", name: "Main Floor" },
  { id: "floor-2", name: "Second Floor / VIP" },
];

export const DEFAULT_TABLES: Table[] = [
  // Main Floor
  { id: "1", name: "Table 1", capacity: 4, status: "available", shape: "square", floorId: "floor-1", x: 100, y: 100 },
  { id: "2", name: "Table 2", capacity: 2, status: "occupied", shape: "square", floorId: "floor-1", x: 300, y: 100 },
  { id: "3", name: "Table 3", capacity: 6, status: "reserved", shape: "rectangle", floorId: "floor-1", x: 500, y: 100 },
  { id: "4", name: "Table 4", capacity: 4, status: "cleaning", shape: "booth", floorId: "floor-1", x: 100, y: 300 },
  { id: "5", name: "Table 5", capacity: 4, status: "available", shape: "booth", floorId: "floor-1", x: 300, y: 300 },
  // Second Floor
  { id: "6", name: "VIP 1", capacity: 8, status: "available", shape: "round", floorId: "floor-2", x: 200, y: 200 },
  { id: "7", name: "VIP 2", capacity: 8, status: "available", shape: "round", floorId: "floor-2", x: 500, y: 200 },
];

export { autoShape };
