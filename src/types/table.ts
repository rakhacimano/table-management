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

export interface ReservationSettings {
  preBufferMin: number;
  diningDurationMin: number;
  postBufferMin: number;
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
  guestName?: string;
  currentPax?: number;
  occupiedSince?: number;
}

export const STATUS_CONFIG: Record<
  TableStatus,
  {
    label: string;
    labelId: string;
    color: string;
    bg: string;
    border: string;
    hex: string;
    hexLight: string;
    chairColor: string;
    tableBg: string;
    tableBorder: string;
  }
> = {
  available: {
    label: "Available",
    labelId: "Tersedia",
    color: "text-info-500",
    bg: "bg-info-50",
    border: "border-info-100",
    hex: "#1B84FF",
    hexLight: "#E6F7FF",
    chairColor: "#A8D2FF",
    tableBg: "#E6F7FF",
    tableBorder: "#D2EBFF",
  },
  occupied: {
    label: "Occupied",
    labelId: "Terisi",
    color: "text-primary-500",
    bg: "bg-primary-50",
    border: "border-primary-100",
    hex: "#284B63",
    hexLight: "#EFF6FC",
    chairColor: "#A8BAC7",
    tableBg: "#EFF6FC",
    tableBorder: "#D7E2EA",
  },
  reserved: {
    label: "Reserved",
    labelId: "Di-booking",
    color: "text-warning-500",
    bg: "bg-warning-50",
    border: "border-warning-100",
    hex: "#F6B101",
    hexLight: "#FFF3DD",
    chairColor: "#FEDEA8",
    tableBg: "#FFF3DD",
    tableBorder: "#FFECCB",
  },
  cleaning: {
    label: "Cleaning",
    labelId: "Dibersihkan",
    color: "text-grey-500",
    bg: "bg-grey-50",
    border: "border-grey-100",
    hex: "#76777A",
    hexLight: "#F5F5F6",
    chairColor: "#C9C9CB",
    tableBg: "#F5F5F6",
    tableBorder: "#E6E6E7",
  },
};

export const SHAPE_CONFIG: Record<
  TableShape,
  { label: string; labelId: string; icon: string }
> = {
  square: { label: "Square", labelId: "Persegi", icon: "□" },
  rectangle: { label: "Rectangle", labelId: "Persegi Panjang", icon: "▭" },
  round: { label: "Round", labelId: "Bulat", icon: "○" },
  booth: { label: "Booth", labelId: "Booth", icon: "⊏" },
};

export const STATUS_ORDER: TableStatus[] = [
  "available",
  "occupied",
  "reserved",
  "cleaning",
];

export function autoShape(capacity: number): TableShape {
  if (capacity <= 2) return "square";
  if (capacity <= 4) return "square";
  if (capacity <= 6) return "rectangle";
  return "round";
}
