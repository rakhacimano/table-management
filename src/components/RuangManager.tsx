"use client";

import { useState } from "react";
import { Floor } from "@/types/table";
import { X, Plus, Edit2, Trash2, Check } from "lucide-react";

interface RuangManagerProps {
  isOpen: boolean;
  floors: Floor[];
  onClose: () => void;
  onAddFloor: (name: string) => void;
  onEditFloor: (id: string, name: string) => void;
  onDeleteFloor: (id: string) => void;
}

export default function RuangManager({
  isOpen,
  floors,
  onClose,
  onAddFloor,
  onEditFloor,
  onDeleteFloor,
}: RuangManagerProps) {
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!newName.trim()) return;
    onAddFloor(newName.trim());
    setNewName("");
  };

  const handleStartEdit = (floor: Floor) => {
    setEditingId(floor.id);
    setEditName(floor.name);
  };

  const handleSaveEdit = () => {
    if (editingId && editName.trim()) {
      onEditFloor(editingId, editName.trim());
      setEditingId(null);
      setEditName("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fadeIn" />
      <div
        className="relative w-full max-w-md bg-white border border-grey-100 rounded-2xl p-6 shadow-xl animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-grey-950">Kelola Ruangan</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-grey-50 text-grey-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Add new */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Nama ruangan baru..."
            className="flex-1 px-4 py-2.5 rounded-lg bg-grey-50 border border-grey-100 text-grey-950 text-sm placeholder-grey-300 focus:border-primary-500 transition-colors"
          />
          <button
            onClick={handleAdd}
            disabled={!newName.trim()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-300 disabled:opacity-40 transition-all"
          >
            <Plus className="w-4 h-4" />
            Tambah
          </button>
        </div>

        {/* Floor List */}
        <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
          {floors.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-grey-300 mb-1">Belum ada ruangan</p>
              <p className="text-xs text-grey-200">Tambah ruangan pertama untuk mulai</p>
            </div>
          ) : (
            floors.map((floor) => (
              <div
                key={floor.id}
                className="flex items-center justify-between gap-2 px-4 py-3 rounded-lg border border-grey-50 hover:bg-grey-50 transition-colors group"
              >
                {editingId === floor.id ? (
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-primary-200 text-grey-950 text-sm focus:border-primary-500 transition-colors"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveEdit}
                      className="p-1.5 rounded-lg bg-success-50 text-success-500 hover:bg-success-500 hover:text-white transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1.5 rounded-lg bg-grey-50 text-grey-500 hover:bg-grey-100 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-sm font-medium text-grey-950">{floor.name}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleStartEdit(floor)}
                        className="p-1.5 rounded-lg hover:bg-warning-50 text-grey-300 hover:text-warning-500 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteFloor(floor.id)}
                        className="p-1.5 rounded-lg hover:bg-danger-50 text-grey-300 hover:text-danger-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
