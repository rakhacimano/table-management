"use client";

import { useState } from "react";
import { Floor } from "@/types/table";
import { X, Plus, Trash2, Edit2, Check } from "lucide-react";

interface ManageFloorsModalProps {
  isOpen: boolean;
  floors: Floor[];
  onClose: () => void;
  onAddFloor: (name: string) => void;
  onEditFloor: (id: string, name: string) => void;
  onDeleteFloor: (id: string) => void;
}

export default function ManageFloorsModal({
  isOpen,
  floors,
  onClose,
  onAddFloor,
  onEditFloor,
  onDeleteFloor,
}: ManageFloorsModalProps) {
  const [newFloorName, setNewFloorName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFloorName.trim()) return;
    onAddFloor(newFloorName.trim());
    setNewFloorName("");
  };

  const startEdit = (floor: Floor) => {
    setEditingId(floor.id);
    setEditName(floor.name);
  };

  const saveEdit = () => {
    if (editingId && editName.trim()) {
      onEditFloor(editingId, editName.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" />
      <div
        className="relative w-full max-w-md bg-gradient-to-br from-[#1a1a2e] to-[#16162a] border border-white/[0.08] rounded-3xl p-6 shadow-2xl animate-slideUp max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white/90">Manage Floors</h2>
            <p className="text-xs text-white/40 mt-1">Add, rename, or remove floors</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/[0.05] text-white/40 hover:bg-white/[0.1] hover:text-white/80 transition-all duration-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Add Floor Form */}
        <form onSubmit={handleAdd} className="flex gap-2 mb-6 shrink-0">
          <input
            type="text"
            value={newFloorName}
            onChange={(e) => setNewFloorName(e.target.value)}
            placeholder="New floor name..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white/90 placeholder-white/25 focus:outline-none focus:border-purple-500/40 focus:bg-white/[0.07] transition-all duration-300 text-sm"
          />
          <button
            type="submit"
            disabled={!newFloorName.trim()}
            className="px-4 py-2.5 rounded-xl font-medium text-sm bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </form>

        {/* Floors List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {floors.map((floor) => (
            <div
              key={floor.id}
              className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.04] hover:bg-white/[0.05] transition-colors"
            >
              {editingId === floor.id ? (
                <div className="flex-1 flex items-center gap-2 mr-2">
                  <input
                    type="text"
                    autoFocus
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#0c0c1d] border border-white/[0.1] text-white/90 text-sm focus:outline-none focus:border-purple-500/50"
                  />
                  <button
                    onClick={saveEdit}
                    className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <span className="text-sm font-medium text-white/80 flex-1 truncate">{floor.name}</span>
              )}

              {editingId !== floor.id && (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => startEdit(floor)}
                    className="p-2 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.1] transition-all"
                    title="Rename Floor"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${floor.name}" and ALL tables on it? This cannot be undone.`)) {
                        onDeleteFloor(floor.id);
                      }
                    }}
                    disabled={floors.length <= 1}
                    className="p-2 rounded-lg text-white/40 hover:text-rose-400 hover:bg-rose-500/15 transition-all disabled:opacity-30 disabled:hover:text-white/40 disabled:hover:bg-transparent"
                    title={floors.length <= 1 ? "Cannot delete the last floor" : "Delete Floor"}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
