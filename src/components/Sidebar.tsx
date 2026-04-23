"use client";

import { LayoutGrid, ChevronLeft, Paintbrush, Settings, CalendarClock } from "lucide-react";

export type SidebarView = "daftar_meja" | "daftar_ruangan" | "reservasi";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  activeView: SidebarView;
  onNavigate: (view: SidebarView) => void;
}

export default function Sidebar({ collapsed, onToggle, activeView, onNavigate }: SidebarProps) {
  if (collapsed) {
    return (
      <div className="bg-white border-r border-grey-50 flex flex-col items-center py-6 px-2 shrink-0 w-[60px] h-screen sticky top-0 shadow-[2px_0_10px_rgba(0,0,0,0.02)] z-10 transition-all">
        <button
          onClick={onToggle}
          className="p-2 rounded-lg border border-grey-50 hover:bg-grey-50 transition-colors mb-6 shadow-sm"
        >
          <ChevronLeft className="w-4 h-4 text-grey-500 rotate-180" />
        </button>
        <div className="flex flex-col gap-2 items-center">
          <button onClick={() => onNavigate("daftar_meja")} className={`p-2 rounded-xl transition-all ${activeView === "daftar_meja" ? "bg-primary-50 text-primary-500 shadow-sm shadow-primary-100" : "text-grey-400 hover:bg-grey-50"}`}>
            <Paintbrush className="w-5 h-5" />
          </button>
          <button onClick={() => onNavigate("daftar_ruangan")} className={`p-2 rounded-xl transition-all ${activeView === "daftar_ruangan" ? "bg-primary-50 text-primary-500 shadow-sm shadow-primary-100" : "text-grey-400 hover:bg-grey-50"}`}>
            <Settings className="w-5 h-5" />
          </button>
          <button onClick={() => onNavigate("reservasi")} className={`p-2 rounded-xl transition-all ${activeView === "reservasi" ? "bg-primary-50 text-primary-500 shadow-sm shadow-primary-100" : "text-grey-400 hover:bg-grey-50"}`}>
            <CalendarClock className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white flex flex-col gap-5 items-start shrink-0 w-[280px] h-screen sticky top-0 overflow-y-auto shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 transition-all border-r border-grey-50/50">
      {/* Head */}
      <div className="flex items-center justify-between p-6 w-full">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-primary-500 shadow-md shadow-primary-500/20">
            <LayoutGrid className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-[16px] text-grey-950 tracking-tight">
            Kaspin Table
          </span>
        </div>
        <button
          onClick={onToggle}
          className="p-2 rounded-xl border border-grey-50 hover:bg-grey-50 transition-all active:scale-95 shadow-sm text-grey-400"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Menu */}
      <div className="flex flex-col gap-2.5 items-start px-5 w-full">
        {/* Dashboard link */}
        <div className="flex gap-3 items-center py-3 w-full cursor-pointer group px-2 rounded-xl hover:bg-grey-50/50 transition-colors">
          <LayoutGrid className="w-5 h-5 text-grey-400 group-hover:text-primary-500 transition-colors" />
          <p className="flex-1 font-semibold text-sm text-grey-600 group-hover:text-grey-950 transition-colors">
            Dashboards
          </p>
        </div>

        {/* Activity Section */}
        <div className="flex flex-col gap-3 items-start w-full mt-4">
          <div className="flex items-center justify-between w-full px-2">
            <p className="font-bold text-[10px] text-grey-400 tracking-wider uppercase">
              Table Management
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-1 items-start w-full">
            <button
              onClick={() => onNavigate("daftar_meja")}
              className={`flex gap-3 h-12 items-center pl-3 rounded-xl w-full transition-all active:scale-95 ${
                activeView === "daftar_meja"
                  ? "bg-primary-50 text-primary-500 shadow-sm shadow-primary-500/10"
                  : "bg-transparent text-grey-500 hover:bg-grey-50"
              }`}
            >
              <Paintbrush className="w-5 h-5" />
              <p className="flex-1 font-semibold text-sm text-left">Daftar Meja</p>
            </button>

            <button
              onClick={() => onNavigate("daftar_ruangan")}
              className={`flex gap-3 h-12 items-center pl-3 rounded-xl w-full transition-all active:scale-95 ${
                activeView === "daftar_ruangan"
                  ? "bg-primary-50 text-primary-500 shadow-sm shadow-primary-500/10"
                  : "bg-transparent text-grey-500 hover:bg-grey-50"
              }`}
            >
              <Settings className="w-5 h-5" />
              <p className="flex-1 font-semibold text-sm text-left">Daftar Ruangan</p>
            </button>

            <div className="w-full h-px bg-grey-50 my-1" />

            <button
              onClick={() => onNavigate("reservasi")}
              className={`flex gap-3 h-12 items-center pl-3 rounded-xl w-full transition-all active:scale-95 ${
                activeView === "reservasi"
                  ? "bg-primary-50 text-primary-500 shadow-sm shadow-primary-500/10"
                  : "bg-transparent text-grey-500 hover:bg-grey-50"
              }`}
            >
              <CalendarClock className="w-5 h-5" />
              <p className="flex-1 font-semibold text-sm text-left">Reservasi</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
