"use client";

import { useState, useEffect, useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addMonths,
  subMonths,
  isToday,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const API_KEY = "pozBd6WMN3FF5ufGppIG8nLCnFGiOtRJ"; // Calendarific

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [holidays, setHolidays] = useState([]);

  const staticEvents = useMemo(() => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    return [
      { date: new Date(y, m, 5), name: "Inventory Audit", color: "red" },
      { date: new Date(y, m, 12), name: "Finance Meeting", color: "blue" },
    ];
  }, [currentDate]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const firstDayOffset = getDay(monthStart);
  const daysInGrid = useMemo(
    () => [...Array(firstDayOffset).fill(null), ...days],
    [firstDayOffset, days]
  );

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const res = await fetch(
          `https://calendarific.com/api/v2/holidays?api_key=${API_KEY}&country=KH&year=${format(
            currentDate,
            "yyyy"
          )}`
        );
        const json = await res.json();
        const allHolidays = json?.response?.holidays || [];
        setHolidays(
          allHolidays.map((h) => ({
            id: `holiday-${h.date.iso.slice(0, 10)}-${h.name.replace(/\s+/g, "-")}`,
            dateStr: h.date.iso.slice(0, 10),
            dateObj: new Date(h.date.iso),
            name: h.name,
            color: h.name.includes("King") ? "red" : "blue",
          }))
        );
      } catch (err) {
        console.error("Failed to fetch holidays:", err);
      }
    };
    fetchHolidays();
  }, [currentDate]);

  const upcomingEvents = useMemo(() => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    const monthPrefix = format(currentDate, "yyyy-MM");

    const holidayThisMonth = holidays
      .filter((h) => h.dateStr.startsWith(monthPrefix))
      .map((h) => ({ date: h.dateObj, name: h.name, color: h.color }));

    const staticThisMonth = staticEvents.filter(
      (e) => e.date.getFullYear() === y && e.date.getMonth() === m
    );

    return [...staticThisMonth, ...holidayThisMonth].sort((a, b) => a.date - b.date);
  }, [holidays, staticEvents, currentDate]);

  const eventsByDate = useMemo(() => {
    const map = {};
    holidays.forEach((h) => {
      if (!map[h.dateStr]) map[h.dateStr] = [];
      map[h.dateStr].push({ name: h.name, color: h.color });
    });
    staticEvents.forEach((e) => {
      const ds = format(e.date, "yyyy-MM-dd");
      if (!map[ds]) map[ds] = [];
      map[ds].push({ name: e.name, color: e.color || "blue" });
    });
    return map;
  }, [holidays, staticEvents]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
      {/* LEFT: Calendar */}
      <div className="bg-white rounded-xl border p-4 flex flex-col overflow-hidden h-[520px] min-h-[520px]">
        <div className="flex items-center justify-between shrink-0">
          <h2 className="text-xl text-black">Calendar</h2>
        </div>
        <Separator className="my-3 shrink-0" />

        <div className="mt-2 mb-2 flex items-center justify-center gap-2 text-sm font-medium shrink-0">
          <button
            className="p-1.5 rounded hover:bg-gray-100"
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="min-w-[160px] text-base text-center">
            {format(currentDate, "MMMM yyyy")}
          </span>
          <button
            className="p-1.5 rounded hover:bg-gray-100"
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Calendar grid */}
        <div className="mx-auto w-full grow min-h-0 max-w-md">
          <div className="grid grid-cols-7 text-center font-medium text-[11px] text-gray-600 mb-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="px-1 truncate">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 bg-[#f7f9fb] rounded-md overflow-hidden">
            {daysInGrid.map((day, idx) => {
              const dateStr = day && format(day, "yyyy-MM-dd");
              const today = day && isToday(day);
              const dayEvents = (dateStr && eventsByDate[dateStr]) || [];

              return (
                <div
                  key={dateStr || `empty-${idx}`}
                  className={[
                    "relative border p-1 overflow-hidden",
                    "h-[52px] sm:h-[60px]", // smaller bump
                    today ? "bg-blue-200" : "",
                    day ? "cursor-default" : "bg-[#f7f9fb]",
                  ].join(" ")}
                >
                  {day && (
                    <div className="absolute top-1 right-1 text-[10px] text-black font-semibold">
                      {format(day, "d")}
                    </div>
                  )}
                  <div className="mt-6 flex flex-col gap-[2px] text-left min-w-0">
                    {dayEvents.slice(0, 2).map((ev, i) => (
                      <div
                        key={`${dateStr}-ev-${i}`}
                        className={[
                          "px-1 py-[1px] rounded-sm text-white truncate w-fit",
                          "max-w-[95%] text-[9px]",
                          ev.color === "red" ? "bg-red-500" : "bg-blue-500",
                        ].join(" ")}
                      >
                        {ev.name}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[9px] text-white w-fit rounded-sm bg-gray-500 px-1">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT: Events */}
      <div className="bg-white rounded-xl border p-4 flex flex-col overflow-hidden h-[520px] min-h-[520px]">
        <div className="flex items-center justify-between shrink-0">
          <h2 className="text-lg text-black">
            Up Coming Events this {format(currentDate, "MMMM yyyy")}
          </h2>
        </div>
        <Separator className="my-3 shrink-0" />

        <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-3">
          {upcomingEvents.length === 0 && (
            <div className="text-sm text-gray-500 px-2 py-1">
              No events this month.
            </div>
          )}

          {upcomingEvents.map((event, index) => (
            <div
              key={`${event.name}-${index}-${event.date.toISOString()}`}
              className="flex justify-between items-center ml-6 mr-6"
            >
              <div className="flex flex-col items-center w-12 mr-10">
                <span className="text-gray-500 text-lg">
                  {format(event.date, "EEE")}
                </span>
                <span className="text-lg">{format(event.date, "d")}</span>
              </div>
              <div className="flex-1 border border-red-500 rounded px-3 py-1.5 ml-2">
                <span className="text-red-500 text-sm">{event.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
