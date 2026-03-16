"use client";

import { useState } from "react";
import { Table, Floor } from "@/types/table";
import { useTables } from "@/hooks/useTables";
import TableCard from "@/components/TableCard";
import FloorPlan from "@/components/FloorPlan";
import AddTableModal from "@/components/AddTableModal";
import EditTableModal from "@/components/EditTableModal";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import ManageFloorsModal from "@/components/ManageFloorsModal";
import AddReservationModal from "@/components/AddReservationModal";
import { Settings, Plus, LayoutGrid, Map, Calendar, User, Clock } from "lucide-react";

type ViewTab = "grid" | "floorplan";

export default function Dashboard() {
  const {
    tables,
    allTables,
    floors,
    activeFloorId,
    setActiveFloorId,
    reservations,
    isLoaded,
    stats,
    addTable,
    editTable,
    deleteTable,
    cycleStatus,
    setTableStatus,
    updateTablePosition,
    addFloor,
    editFloor,
    deleteFloor,
    addReservation,
  } = useTables();

  const [activeTab, setActiveTab] = useState<ViewTab>("grid");
  const [showAddTable, setShowAddTable] = useState(false);
  const [showManageFloors, setShowManageFloors] = useState(false);
  const [reservingTable, setReservingTable] = useState<Table | null>(null);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [deletingTable, setDeletingTable] = useState<Table | null>(null);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-white/40">
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading tables...</span>
        </div>
      </div>
    );
  }

  const activeFloor = floors.find((f) => f.id === activeFloorId);

  return (
    <div className="min-h-screen flex flex-col bg-[#080814]">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0c0c1d]/80 backdrop-blur-xl">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg shadow-purple-500/20">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white/90">Table Manager</h1>
                <p className="text-xs text-white/30 hidden sm:block">Venue Table Management</p>
              </div>
            </div>

            {/* Floor Tabs Selector */}
            {floors.length > 0 && (
              <div className="hidden md:flex p-1 bg-white/[0.04] rounded-xl border border-white/[0.06] overflow-x-auto custom-scrollbar max-w-md mx-4">
                {floors.map((floor) => (
                  <button
                    key={floor.id}
                    onClick={() => setActiveFloorId(floor.id)}
                    className={`
                      px-4 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-300
                      ${activeFloorId === floor.id
                        ? "bg-white/[0.1] text-white shadow-sm"
                        : "text-white/40 hover:text-white/60"
                      }
                    `}
                  >
                    {floor.name}
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowManageFloors(true)}
                className="p-2 rounded-lg bg-white/[0.05] text-white/60 hover:text-white hover:bg-white/[0.1] transition-colors border border-transparent hover:border-white/[0.05]"
                title="Manage Floors"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex w-full max-w-[1440px] mx-auto overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto custom-scrollbar">
          
          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6 shrink-0">
            {[
              { label: "Total", value: stats.total, gradient: "from-purple-500/20 to-blue-500/20", text: "text-purple-300" },
              { label: "Available", value: stats.available, gradient: "from-emerald-500/20 to-green-500/20", text: "text-emerald-300" },
              { label: "Occupied", value: stats.occupied, gradient: "from-rose-500/20 to-red-500/20", text: "text-rose-300" },
              { label: "Reserved", value: stats.reserved, gradient: "from-amber-500/20 to-yellow-500/20", text: "text-amber-300" },
              { label: "Cleaning", value: stats.cleaning, gradient: "from-slate-500/20 to-gray-500/20", text: "text-slate-300" },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`px-4 py-3 rounded-2xl bg-gradient-to-br ${stat.gradient} border border-white/[0.06] backdrop-blur-sm`}
              >
                <p className="text-xs text-white/40 mb-0.5">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.text}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Header + Tabs + Add Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 shrink-0">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-white/80">
                  {activeFloor?.name || "No Floor Selected"}
                </h2>
                <div className="flex items-center gap-4 mt-1">
                  <p className="text-sm text-white/30 hidden md:block">
                    {activeTab === "grid"
                      ? "Use quick actions on cards to update statuses"
                      : "Drag tables to arrange your floor plan"}
                  </p>
                  
                  {/* Tab Switcher - Mobile floor selector fallback */}
                  <select
                    value={activeFloorId}
                    onChange={(e) => setActiveFloorId(e.target.value)}
                    className="md:hidden px-2 py-1 bg-white/[0.05] border border-white/[0.1] rounded-lg text-xs text-white/70"
                  >
                    {floors.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
                </div>
              </div>

              {/* View Switcher */}
              <div className="flex p-1 bg-white/[0.04] rounded-xl border border-white/[0.06]">
                <button
                  onClick={() => setActiveTab("grid")}
                  className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300
                    ${activeTab === "grid"
                      ? "bg-purple-500/20 text-purple-300 shadow-sm"
                      : "text-white/40 hover:text-white/60"
                    }
                  `}
                >
                  <LayoutGrid className="w-3.5 h-3.5" /> Grid
                </button>
                <button
                  onClick={() => setActiveTab("floorplan")}
                  className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300
                    ${activeTab === "floorplan"
                      ? "bg-purple-500/20 text-purple-300 shadow-sm"
                      : "text-white/40 hover:text-white/60"
                    }
                  `}
                >
                  <Map className="w-3.5 h-3.5" /> Floor Plan
                </button>
              </div>
            </div>
            
            <button
              onClick={() => setShowAddTable(true)}
              disabled={floors.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 hover:from-purple-500 hover:to-blue-500 active:scale-[0.97] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> Add Table
            </button>
          </div>

          {/* View Content */}
          {activeTab === "grid" ? (
            floors.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-24">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-4 text-white/15">
                  <Settings className="w-12 h-12" />
                </div>
                <h3 className="text-lg font-semibold text-white/40 mb-1">No floors exist</h3>
                <p className="text-sm text-white/25 mb-6">Create a floor to start accommodating tables.</p>
                <button
                  onClick={() => setShowManageFloors(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.1] text-white hover:bg-white/[0.15] text-sm font-semibold transition-all"
                >
                  Manage Floors
                </button>
              </div>
            ) : tables.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-4 text-white/15">
                  <LayoutGrid className="w-12 h-12" />
                </div>
                <h3 className="text-lg font-semibold text-white/40 mb-1">Floor is empty</h3>
                <p className="text-sm text-white/25 mb-6">Add tables to this floor layout</p>
                <button
                  onClick={() => setShowAddTable(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 active:scale-[0.97] transition-all duration-300"
                >
                  <Plus className="w-4 h-4" /> Add First Table
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-12">
                {tables.map((table) => (
                  <TableCard
                    key={table.id}
                    table={table}
                    onEdit={setEditingTable}
                    onDelete={setDeletingTable}
                    onCycleStatus={cycleStatus}
                    onSetStatus={setTableStatus}
                    onReserveClick={setReservingTable}
                  />
                ))}
              </div>
            )
          ) : (
            <div className="flex-1 min-h-[600px] mb-8">
              <FloorPlan
                tables={tables}
                onUpdatePosition={updateTablePosition}
                onCycleStatus={cycleStatus}
                onEdit={setEditingTable}
                onDelete={setDeletingTable}
              />
            </div>
          )}
        </div>

        {/* Sidebar: Upcoming Reservations */}
        <aside className="hidden lg:flex flex-col w-80 border-l border-white/[0.06] bg-[#0c0c1d]/50 shrink-0 h-[calc(100vh-64px)] overflow-hidden">
          <div className="p-5 border-b border-white/[0.06] flex items-center gap-2 bg-[#121223]">
            <Calendar className="w-5 h-5 text-purple-400" />
            <h2 className="font-bold text-white/90">Upcoming Bookings</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-3">
            {reservations.length === 0 ? (
              <div className="flex flex-col items-center text-center mt-12 opacity-50">
                <Calendar className="w-12 h-12 mb-3 text-white/20" />
                <p className="text-sm text-white/60">No upcoming reservations</p>
                <p className="text-xs text-white/40 mt-1">Reserve a table to see it here</p>
              </div>
            ) : (
              reservations.map((res) => {
                const tableRef = allTables.find(t => t.id === res.tableId);
                return (
                  <div key={res.id} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-colors relative overflow-hidden group">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500/40 group-hover:bg-amber-500 transition-colors" />
                    
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 text-amber-300 font-semibold text-lg">
                        <Clock className="w-4 h-4" /> {res.time}
                      </div>
                      <div className="text-xs font-medium px-2 py-0.5 rounded bg-white/[0.05] text-white/60">
                        {tableRef?.name || "Unknown Table"}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-white/80 truncate pr-2">
                        {res.guestName}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-white/50 shrink-0">
                        <User className="w-3.5 h-3.5" /> {res.partySize} pax
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>
      </main>

      {/* Modals */}
      <ManageFloorsModal
        isOpen={showManageFloors}
        floors={floors}
        onClose={() => setShowManageFloors(false)}
        onAddFloor={addFloor}
        onEditFloor={editFloor}
        onDeleteFloor={deleteFloor}
      />
      <AddTableModal
        isOpen={showAddTable}
        floors={floors}
        activeFloorId={activeFloorId}
        onClose={() => setShowAddTable(false)}
        onAdd={addTable}
      />
      <EditTableModal
        isOpen={!!editingTable}
        table={editingTable}
        floors={floors}
        onClose={() => setEditingTable(null)}
        onEdit={editTable}
      />
      <DeleteConfirmDialog
        isOpen={!!deletingTable}
        tableName={deletingTable?.name || ""}
        onClose={() => setDeletingTable(null)}
        onConfirm={() => {
          if (deletingTable) deleteTable(deletingTable.id);
        }}
      />
      <AddReservationModal
        isOpen={!!reservingTable}
        table={reservingTable}
        onClose={() => setReservingTable(null)}
        onReserve={addReservation}
      />
    </div>
  );
}
