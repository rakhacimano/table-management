"use client";

import { Table, Reservation, ReservationSettings } from "@/types/table";

interface ReservasiTimelineProps {
  tables: Table[];
  reservations: Reservation[];
  settings: ReservationSettings;
}

const START_HOURS = 10;
const END_HOURS = 22;
const TOTAL_MINUTES = (END_HOURS - START_HOURS) * 60;

function timeToMinutes(timeStr: string) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

export default function ReservasiTimeline({ tables, reservations, settings }: ReservasiTimelineProps) {
  
  const hours = Array.from({ length: END_HOURS - START_HOURS + 1 }, (_, i) => START_HOURS + i);

  // Filter tables to only those that have reservations (or show all? The prompt said "a horizontal timeline per table", so let's show all tables in this room)
  // The parent passes `tables`, so we show all tables passed.

  return (
    <div className="w-full h-full bg-white rounded-3xl border border-grey-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col overflow-hidden">
      
      {/* Header Axis */}
      <div className="flex border-b border-grey-100 bg-[#fcfcfc] sticky top-0 z-10 sticky-header">
        <div className="w-32 shrink-0 border-r border-grey-100 p-4 flex items-center justify-center font-bold text-sm text-grey-500">
          Meja
        </div>
        <div className="flex-1 relative flex">
          {hours.slice(0, -1).map((h) => (
            <div key={h} className="flex-1 border-r border-grey-100/50 p-2 text-xs font-bold text-grey-400 text-center relative">
              {h}:00
              {/* Tick mark */}
              <div className="absolute bottom-0 left-1/2 w-px h-1 bg-grey-200" />
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Rows */}
      <div className="flex-1 overflow-y-auto">
        {tables.length === 0 ? (
          <div className="p-10 text-center text-grey-400 font-medium">Belum ada meja di ruangan ini</div>
        ) : (
          tables.map(table => {
            const tableRes = reservations.filter(r => r.tableId === table.id);
            
            return (
              <div key={table.id} className="flex border-b border-grey-50 hover:bg-grey-50/30 transition-colors group">
                {/* Table Label */}
                <div className="w-32 shrink-0 border-r border-grey-100 p-4 flex items-center gap-3 bg-white group-hover:bg-grey-50/50 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-grey-50 border border-grey-100 flex items-center justify-center font-bold text-xs text-grey-700">
                    {table.name}
                  </div>
                  <span className="text-xs font-semibold text-grey-500">{table.capacity} Pax</span>
                </div>

                {/* Timeline Track */}
                <div className="flex-1 relative min-h-[60px] bg-[url('/timeline-grid-pattern.svg')]">
                  
                  {/* Render hour dividers for the track */}
                  <div className="absolute inset-0 flex pointer-events-none">
                    {hours.slice(0, -1).map((h) => (
                      <div key={h} className="flex-1 border-r border-grey-100/20" />
                    ))}
                  </div>

                  {/* Render Reservations */}
                  {tableRes.map(res => {
                    const centerMin = timeToMinutes(res.time);
                    const startMin = centerMin - settings.preBufferMin;
                    const durationTotal = settings.preBufferMin + settings.diningDurationMin + settings.postBufferMin;
                    
                    const leftPercent = Math.max(0, ((startMin - (START_HOURS * 60)) / TOTAL_MINUTES) * 100);
                    const widthPercent = Math.min(100 - leftPercent, (durationTotal / TOTAL_MINUTES) * 100);

                    // Calculations for inner segments (Pre/Dining/Post) relative to the block width
                    const prePct = (settings.preBufferMin / durationTotal) * 100;
                    const diningPct = (settings.diningDurationMin / durationTotal) * 100;
                    const postPct = (settings.postBufferMin / durationTotal) * 100;

                    return (
                      <div 
                        key={res.id} 
                        className="absolute h-10 top-1/2 -translate-y-1/2 rounded-lg flex overflow-hidden shadow-sm hover:shadow-md transition-shadow hover:-translate-y-[1px]"
                        style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
                        title={`${res.guestName} - ${res.time} (${res.partySize} Pax)`}
                      >
                        {/* Pre Buffer */}
                        <div className="bg-warning-100/50 h-full border-y border-l border-warning-200/50" style={{ width: `${prePct}%` }} />
                        
                        {/* Dining Block */}
                        <div className="bg-primary-500 h-full flex flex-col justify-center px-2 text-white overflow-hidden whitespace-nowrap border border-primary-600" style={{ width: `${diningPct}%` }}>
                           <span className="text-[10px] font-bold leading-tight truncate">{res.guestName}</span>
                           <span className="text-[9px] font-medium text-primary-100 truncate">{res.time} • {res.partySize} Pax</span>
                        </div>

                        {/* Post Buffer */}
                        <div className="bg-danger-50 h-full border-y border-r border-danger-200/50 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIGZpbGw9IiNmY2E1YTUiIGZpbGwtb3BhY2l0eT0iMC40IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBINHY0SDB6Ii8+PC9nPjwvc3ZnPg==')]" style={{ width: `${postPct}%` }} />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
