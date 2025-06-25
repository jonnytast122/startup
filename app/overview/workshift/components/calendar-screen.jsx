"use client";

import { useState, useEffect } from "react";
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
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import EventDialog from "./event-dialog";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const API_KEY = "OIsoHpHETdSNj2W0pZ5cDYbOz7lrXEP6";

export default function CambodiaHolidayCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [holidays, setHolidays] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editEvent, setEditEvent] = useState(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const firstDayOffset = getDay(monthStart);
  const daysInGrid = [...Array(firstDayOffset).fill(null), ...days];

  const isHoliday = (date) => {
    const d = format(date, "yyyy-MM-dd");
    return holidays.find((h) => h.date === d);
  };

  useEffect(() => {
    async function fetchHolidays() {
      try {
        const res = await fetch(
          `https://calendarific.com/api/v2/holidays?&api_key=${API_KEY}&country=KH&year=${format(
            currentDate,
            "yyyy"
          )}`
        );
        const json = await res.json();
        const allHolidays = json.response.holidays || [];
        setHolidays(
          allHolidays.map((h) => ({
            date: h.date.iso.slice(0, 10),
            name: h.name,
            isCustom: false,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch holidays:", err);
      }
    }
    fetchHolidays();
  }, [currentDate]);

  const addEvent = (event) => {
    if (editEvent) {
      setEvents((prev) =>
        prev.map((e) => (e === editEvent ? { ...event, isCustom: true } : e))
      );
      setEditEvent(null);
    } else {
      setEvents((prev) => [...prev, { ...event, isCustom: true }]);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="bg-white rounded-lg shadow w-full lg:w-2/3 p-4">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
            <ChevronLeft />
          </button>
          <h2 className="text-lg font-semibold">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <button onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
            <ChevronRight />
          </button>
        </div>

        <div className="grid grid-cols-7 text-center font-medium text-sm text-gray-600 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 text-sm text-center bg-[#f7f9fb] rounded-md overflow-hidden">
          {daysInGrid.map((day, idx) => {
            const holiday = day && isHoliday(day);
            const today = day && isToday(day);
            return (
              <div
                key={idx}
                onClick={() =>
                  day && setSelectedDate(format(day, "yyyy-MM-dd"))
                }
                className={`border h-20 p-1 flex justify-center items-start cursor-pointer hover:bg-blue-50 ${
                  today ? "bg-blue-200" : ""
                }`}
              >
                {day && (
                  <span
                    className={`text-xs ${
                      holiday ? "text-red-500 font-semibold" : ""
                    }`}
                  >
                    {format(day, "d")}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow w-full lg:w-1/3 p-4 border">
        <h3 className="text-md font-semibold mb-2">
          Upcoming event this {format(currentDate, "MMMM")}
        </h3>
        <div className="border-t pt-3 space-y-2 max-h-[520px] overflow-auto">
          {[...holidays, ...events]
            .filter((item) =>
              item.date.startsWith(format(currentDate, "yyyy-MM"))
            )
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((item, idx) => {
              const dateObj = new Date(item.date);
              const isKing = item.name.includes("King");

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-2 px-2"
                >
                  <div className="text-center text-sm w-10">
                    <div className="text-gray-500">
                      {format(dateObj, "EEE")}
                    </div>
                    <div>{format(dateObj, "d")}</div>
                  </div>
                  <div
                    className={`flex-1 text-xs rounded-md px-3 py-1 font-medium text-center ${
                      item.isCustom
                        ? "border border-blue-400 text-blue-500"
                        : isKing
                        ? "border border-red-400 text-red-500"
                        : "border border-blue-400 text-blue-500"
                    }`}
                  >
                    {item.name}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 rounded hover:bg-gray-100">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white">
                      {item.isCustom ? (
                        <>
                          <DropdownMenuItem
                            onClick={() => {
                              setEditEvent(item);
                              setSelectedDate(item.date);
                            }}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              setEvents((prev) =>
                                prev.filter((e) => e !== item)
                              )
                            }
                          >
                            Delete
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <>
                          <DropdownMenuItem disabled>Edit</DropdownMenuItem>
                          <DropdownMenuItem disabled>Delete</DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })}
        </div>
      </div>

      {(selectedDate || editEvent) && (
        <EventDialog
          date={selectedDate}
          onClose={() => {
            setSelectedDate(null);
            setEditEvent(null);
          }}
          onSave={addEvent}
          event={editEvent}
        />
      )}
    </div>
  );
}
