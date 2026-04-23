"use client";

import { Home, RefreshCw } from "lucide-react";

export default function Header() {
  return (
    <div className="bg-white border-b border-grey-50 flex items-center justify-between px-10 py-5 w-full shrink-0">
      {/* Left — Restaurant Name */}
      <div className="flex gap-2 items-center">
        <Home className="w-6 h-6 text-grey-950" />
        <p className="font-semibold text-base text-grey-950">
          Resto Kaspin Djaya
        </p>
      </div>

      {/* Right — Actions & Profile */}
      <div className="flex gap-4 items-center">
        <button className="p-3 rounded-lg border border-grey-50 bg-white hover:bg-grey-50 transition-colors">
          <RefreshCw className="w-4 h-4 text-grey-500" />
        </button>

        <div className="w-px h-4 bg-grey-100" />

        <div className="flex gap-3 items-center">
          <div className="flex flex-col gap-0.5 items-end">
            <p className="font-semibold text-sm text-grey-950">
              Rimanao Cita Paramitha
            </p>
            <p className="font-normal text-xs text-grey-500">
              Staff UI/UX Designer
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-200 flex items-center justify-center text-white font-semibold text-sm">
            RC
          </div>
        </div>
      </div>
    </div>
  );
}
