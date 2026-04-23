"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Table, TableStatus, TableShape, Floor, Reservation, ReservationSettings, STATUS_ORDER } from "@/types/table";
import { getTables, saveTables, getFloors, saveFloors, getReservations, saveReservations, getReservationSettings, saveReservationSettings, DEFAULT_SETTINGS } from "@/lib/storage";

export function useTables() {
  const [tables, setTables] = useState<Table[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reservationSettings, setReservationSettings] = useState<ReservationSettings>(DEFAULT_SETTINGS);
  const [activeFloorId, setActiveFloorId] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount and setup real-time polling/sync
  useEffect(() => {
    const loadState = () => {
      setFloors(getFloors());
      setTables(getTables());
      setReservations(getReservations());
      setReservationSettings(getReservationSettings());
    };

    loadState();

    const loadedFloors = getFloors();
    if (loadedFloors.length > 0 && !activeFloorId) {
      setActiveFloorId(loadedFloors[0].id);
    }
    setIsLoaded(true);

    // Multi-tab "WebSocket" simulator using storage events
    window.addEventListener("storage", loadState);
    
    // Fallback manual poll for real-time sandbox simulation (every 5s)
    const interval = setInterval(() => {
        // Only pull if we aren't currently overwriting (handled cleanly by React's reference comparisons if data matches)
        // This simulates a live backend ping.
        loadState();
    }, 5000);

    return () => {
      window.removeEventListener("storage", loadState);
      clearInterval(interval);
    }
  }, [activeFloorId]);

  // Persist on every change
  useEffect(() => {
    if (isLoaded) {
      saveTables(tables);
      saveFloors(floors);
      saveReservations(reservations);
      saveReservationSettings(reservationSettings);
    }
  }, [tables, floors, reservations, reservationSettings, isLoaded]);

  // Derived state
  const activeFloorTables = useMemo(
    () => tables.filter((t) => t.floorId === activeFloorId),
    [tables, activeFloorId]
  );

  const stats = useMemo(() => ({
    total: activeFloorTables.length,
    available: activeFloorTables.filter((t) => t.status === "available").length,
    occupied: activeFloorTables.filter((t) => t.status === "occupied").length,
    reserved: activeFloorTables.filter((t) => t.status === "reserved").length,
    cleaning: activeFloorTables.filter((t) => t.status === "cleaning").length,
  }), [activeFloorTables]);

  const activeReservations = useMemo(
    () => reservations
      .filter((r) => {
        const table = tables.find(t => t.id === r.tableId);
        return table && table.status === "reserved";
      })
      .sort((a, b) => a.time.localeCompare(b.time)),
    [reservations, tables]
  );

  // Table actions
  const addTable = useCallback(
    (data: { name: string; capacity: number; status: TableStatus; shape: TableShape; floorId: string }) => {
      const newTable: Table = {
        id: Date.now().toString(),
        x: Math.random() * 400 + 50,
        y: Math.random() * 300 + 50,
        ...data,
      };
      setTables((prev) => [...prev, newTable]);
    },
    []
  );

  const editTable = useCallback(
    (id: string, data: { name: string; capacity: number; status: TableStatus; shape: TableShape; floorId: string }) => {
      setTables((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
    },
    []
  );

  const deleteTable = useCallback((id: string) => {
    setTables((prev) => prev.filter((t) => t.id !== id));
    // Also clean up reservations
    setReservations((prev) => prev.filter((r) => r.tableId !== id));
  }, []);

  const cycleStatus = useCallback((id: string) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const currentIndex = STATUS_ORDER.indexOf(t.status);
        const nextIndex = (currentIndex + 1) % STATUS_ORDER.length;
        return { ...t, status: STATUS_ORDER[nextIndex] };
      })
    );
  }, []);

  const setTableStatus = useCallback((id: string, status: TableStatus) => {
    setTables((prev) => prev.map((t) => {
      if (t.id === id) {
        const update = { ...t, status };
        // Handle Operational Timer logic
        if (status === "occupied" && t.status !== "occupied") {
          update.occupiedSince = Date.now();
        } else if (status !== "occupied" && status !== "cleaning") {
           // Clear payload if it becomes completely available
           if (status === "available") {
             update.occupiedSince = undefined;
             update.guestName = undefined;
             update.currentPax = undefined;
           }
        }
        return update;
      }
      return t;
    }));
  }, []);

  const assignTableGuest = useCallback((id: string, guestName: string, pax: number) => {
    setTables((prev) => prev.map((t) => (t.id === id ? { ...t, status: "occupied", guestName, currentPax: pax, occupiedSince: Date.now() } : t)));
  }, []);

  const updateTablePosition = useCallback((id: string, x: number, y: number) => {
    setTables((prev) => prev.map((t) => (t.id === id ? { ...t, x, y } : t)));
  }, []);

  // Floor actions
  const addFloor = useCallback((name: string) => {
    const newFloor: Floor = { id: `floor-${Date.now()}`, name };
    setFloors((prev) => [...prev, newFloor]);
    setActiveFloorId(newFloor.id);
  }, []);

  const editFloor = useCallback((id: string, name: string) => {
    setFloors((prev) => prev.map((f) => (f.id === id ? { ...f, name } : f)));
  }, []);

  const deleteFloor = useCallback((id: string) => {
    setFloors((prev) => {
      const remaining = prev.filter((f) => f.id !== id);
      // Update active floor to first remaining or empty
      if (activeFloorId === id) {
        setActiveFloorId(remaining.length > 0 ? remaining[0].id : "");
      }
      return remaining;
    });
    setTables((prev) => prev.filter((t) => t.floorId !== id)); // Cascade delete
    setReservations((prev) => {
      const remainingTableIds = new Set(tables.filter(t => t.floorId !== id).map(t => t.id));
      return prev.filter(r => remainingTableIds.has(r.tableId));
    });
  }, [activeFloorId, tables]);

  // Reservation actions
  const addReservation = useCallback((tableId: string, guestName: string, partySize: number, time: string) => {
    const newRes: Reservation = {
      id: `res-${Date.now()}`,
      tableId,
      guestName,
      partySize,
      time,
    };
    setReservations((prev) => [...prev, newRes]);
    // Automatically flag table as reserved
    setTableStatus(tableId, "reserved");
  }, [setTableStatus]);

  return {
    tables: activeFloorTables,
    allTables: tables,
    floors,
    activeFloorId,
    setActiveFloorId,
    reservations: activeReservations,
    isLoaded,
    stats,
    // Table methods
    addTable,
    editTable,
    deleteTable,
    cycleStatus,
    setTableStatus,
    assignTableGuest,
    updateTablePosition,
    // Floor methods
    addFloor,
    editFloor,
    deleteFloor,
    // Reservation methods
    addReservation,
    reservationSettings,
    setReservationSettings
  };
}
