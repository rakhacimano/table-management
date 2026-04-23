import { Table, Floor, Reservation, ReservationSettings } from "@/types/table";

const TABLES_KEY = "kaspin-table-manager-tables";
const FLOORS_KEY = "kaspin-table-manager-floors";
const RESERVATIONS_KEY = "kaspin-table-manager-reservations";
const SETTINGS_KEY = "kaspin-table-manager-settings";

export function getFloors(): Floor[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(FLOORS_KEY);
    if (stored) return JSON.parse(stored) as Floor[];
    return [];
  } catch {
    return [];
  }
}

export function saveFloors(floors: Floor[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(FLOORS_KEY, JSON.stringify(floors));
  } catch {
    console.error("Failed to save floors");
  }
}

export function getTables(): Table[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(TABLES_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Table[];
      return parsed;
    }
    return [];
  } catch {
    return [];
  }
}

export function saveTables(tables: Table[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TABLES_KEY, JSON.stringify(tables));
  } catch {
    console.error("Failed to save tables");
  }
}

export function getReservations(): Reservation[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(RESERVATIONS_KEY);
    if (stored) return JSON.parse(stored) as Reservation[];
    return [];
  } catch {
    return [];
  }
}

export function saveReservations(reservations: Reservation[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations));
  } catch {
    console.error("Failed to save reservations");
  }
}

export const DEFAULT_SETTINGS: ReservationSettings = {
  preBufferMin: 30,
  diningDurationMin: 90,
  postBufferMin: 15
};

export function getReservationSettings(): ReservationSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) return JSON.parse(stored) as ReservationSettings;
    return DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveReservationSettings(settings: ReservationSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    console.error("Failed to save settings");
  }
}
