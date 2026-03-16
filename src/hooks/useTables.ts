"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Table, TableStatus, TableShape, Floor, Reservation, STATUS_ORDER } from "@/types/table";
import { getTables, saveTables, getFloors, saveFloors, getReservations, saveReservations } from "@/lib/storage";

export function useTables() {
  const [tables, setTables] = useState<Table[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [activeFloorId, setActiveFloorId] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const loadedFloors = getFloors();
    const loadedTables = getTables();
    const loadedReservations = getReservations();
    
    setFloors(loadedFloors);
    setTables(loadedTables);
    setReservations(loadedReservations);
    
    if (loadedFloors.length > 0) {
      setActiveFloorId(loadedFloors[0].id);
    }
    
    setIsLoaded(true);
  }, []);

  // Persist on every change
  useEffect(() => {
    if (isLoaded) {
      saveTables(tables);
      saveFloors(floors);
      saveReservations(reservations);
    }
  }, [tables, floors, reservations, isLoaded]);

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
    setTables((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
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
    setFloors((prev) => prev.filter((f) => f.id !== id));
    setTables((prev) => prev.filter((t) => t.floorId !== id)); // Cascade delete
    setReservations((prev) => {
      // Cleanup reservations for deleted tables
      const remainingTableIds = new Set(tables.filter(t => t.floorId !== id).map(t => t.id));
      return prev.filter(r => remainingTableIds.has(r.tableId));
    });
    if (activeFloorId === id) {
      setActiveFloorId("floor-1"); // fallback
    }
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
    updateTablePosition,
    // Floor methods
    addFloor,
    editFloor,
    deleteFloor,
    // Reservation methods
    addReservation,
  };
}
