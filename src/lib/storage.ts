import { Table, Floor, Reservation, DEFAULT_TABLES, DEFAULT_FLOORS } from "@/types/table";

const TABLES_KEY = "table-manager-tables";
const FLOORS_KEY = "table-manager-floors";
const RESERVATIONS_KEY = "table-manager-reservations";

export function getFloors(): Floor[] {
  if (typeof window === "undefined") return DEFAULT_FLOORS;
  try {
    const stored = localStorage.getItem(FLOORS_KEY);
    if (stored) return JSON.parse(stored) as Floor[];
    saveFloors(DEFAULT_FLOORS);
    return DEFAULT_FLOORS;
  } catch {
    return DEFAULT_FLOORS;
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
  if (typeof window === "undefined") return DEFAULT_TABLES;

  try {
    const stored = localStorage.getItem(TABLES_KEY);
    if (stored) {
      // Migrate old tables missing floorId
      const parsed = JSON.parse(stored) as Table[];
      let needsMigration = false;
      const migrated = parsed.map(t => {
        if (!t.floorId) {
          needsMigration = true;
          return { ...t, floorId: "floor-1" };
        }
        return t;
      });
      if (needsMigration) saveTables(migrated);
      return migrated;
    }
    saveTables(DEFAULT_TABLES);
    return DEFAULT_TABLES;
  } catch {
    return DEFAULT_TABLES;
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
