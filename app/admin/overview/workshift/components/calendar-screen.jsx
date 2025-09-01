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
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  CircleX,
  Calendar1,
} from "lucide-react";
import EditEventDialog from "./edit-event-dialog";
import ViewEventDialog from "./view-event-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const API_KEY = "pozBd6WMN3FF5ufGppIG8nLCnFGiOtRJ";

export default function CambodiaHolidayCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [holidays, setHolidays] = useState([]);
  const [events, setEvents] = useState([]);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [viewEvent, setViewEvent] = useState(null);
  const [editEvent, setEditEvent] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [creatingEvent, setCreatingEvent] = useState(false);

  // Track which dropdown is open (by event id) so we can force-close it before opening dialogs
  const [openMenuId, setOpenMenuId] = useState(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const firstDayOffset = getDay(monthStart);
  const daysInGrid = useMemo(
    () => [...Array(firstDayOffset).fill(null), ...days],
    [firstDayOffset, days]
  );

  const resetAllDialogStates = () => {
    setSelectedDate(null);
    setSelectedDateEvents([]);
    setViewEvent(null);
    setEditEvent(null);
    setConfirmDelete(null);
    setCreatingEvent(false);
    setOpenMenuId(null);
  };

  const fetchHolidays = async () => {
    try {
      const res = await fetch(
        `https://calendarific.com/api/v2/holidays?&api_key=${API_KEY}&country=KH&year=${format(
          currentDate,
          "yyyy"
        )}`
      );
      const json = await res.json();
      const allHolidays = json?.response?.holidays || [];
      setHolidays(
        allHolidays.map((h) => ({
          id: `holiday-${h.date.iso.slice(0, 10)}-${h.name.replace(
            /\s+/g,
            "-"
          )}`,
          date: h.date.iso.slice(0, 10),
          name: h.name,
          isCustom: false,
          color: h.name.includes("King") ? "red" : "blue",
        }))
      );
    } catch (err) {
      console.error("Failed to fetch holidays:", err);
    }
  };

  useEffect(() => {
    fetchHolidays();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate]);

  const addEvent = (event) => {
    setEvents((prev) => {
      const hasId = !!event.id;
      const eventWithId = {
        ...event,
        id: hasId
          ? event.id
          : `ev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      };
      if (editEvent) {
        // update
        return prev.map((e) => (e.id === editEvent.id ? eventWithId : e));
      }
      // create
      return [...prev, eventWithId];
    });
    resetAllDialogStates();
  };

  const deleteEvent = (event) => {
    setEvents((prev) => prev.filter((e) => e.id !== event.id));
    resetAllDialogStates();
  };

  // Derived map for calendar cells
  const mergedByDate = useMemo(() => {
    const acc = {};
    [...holidays, ...events].forEach((ev) => {
      if (!acc[ev.date]) acc[ev.date] = [];
      acc[ev.date].push(ev);
    });
    return acc;
  }, [holidays, events]);

  // Monthly list for right panel (stable sort & stable keys)
  const monthlyList = useMemo(() => {
    const yymm = format(currentDate, "yyyy-MM");
    return [...holidays, ...events]
      .filter((item) => item.date.startsWith(yymm))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [holidays, events, currentDate]);

  return (
    <div>
      {/* Header */}
      <div className="bg-white rounded-xl mb-3 shadow-md py-6 px-6 border">
        <div className="flex items-center justify-between p-5">
          <a href="/overview/attendence" className="block">
            <div className="flex items-center space-x-3">
              <Calendar1 className="text-[#2998FF]" width={40} height={40} />
              <span className="font-custom text-3xl text-black">Calendar</span>
            </div>
          </a>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Calendar Panel */}
        {/* Calendar Panel (responsive-only) */}
        <div className="bg-white rounded-lg shadow w-full lg:w-2/3 p-2 sm:p-4">
          {/* Month nav */}
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <button
              className="p-1 sm:p-2 rounded hover:bg-gray-100"
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <h2 className="text-base sm:text-lg font-semibold">
              {format(currentDate, "MMMM yyyy")}
            </h2>
            <button
              className="p-1 sm:p-2 rounded hover:bg-gray-100"
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Weekday header */}
          <div className="grid grid-cols-7 text-center font-medium text-[10px] sm:text-sm text-gray-600 mb-1 sm:mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="px-1 truncate">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 bg-[#f7f9fb] rounded-md overflow-hidden">
            {daysInGrid.map((day, idx) => {
              const dateStr = day && format(day, "yyyy-MM-dd");
              const today = day && isToday(day);
              const dayEvents = (dateStr && mergedByDate[dateStr]) || [];

              return (
                <div
                  key={dateStr || `empty-${idx}`}
                  onClick={() => {
                    if (day) {
                      resetAllDialogStates();
                      setSelectedDate(dateStr);
                      setCreatingEvent(true);
                    }
                  }}
                  className={[
                    "relative border p-1 sm:p-1.5 cursor-pointer hover:bg-blue-50 overflow-hidden",
                    "h-24 sm:h-28 md:h-32", // responsive cell heights
                    today ? "bg-blue-200" : "",
                  ].join(" ")}
                >
                  {day && (
                    <div className="absolute top-1 right-1 text-[10px] sm:text-xs text-black font-semibold">
                      {format(day, "d")}
                    </div>
                  )}

                  <div className="mt-6 sm:mt-7 flex flex-col gap-[2px] text-left min-w-0">
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          resetAllDialogStates();
                          setViewEvent(ev);
                        }}
                        className={[
                          "px-1 py-[2px] rounded-sm text-white truncate w-fit",
                          "max-w-[95%] sm:max-w-[90%]",
                          "text-[10px] sm:text-[11px]",
                          ev.color === "red" ? "bg-red-500" : "bg-blue-500",
                        ].join(" ")}
                        title={ev.name}
                        aria-label={ev.name}
                      >
                        {ev.name}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div
                        className="text-[10px] sm:text-[11px] text-white w-fit rounded-sm bg-gray-500 px-1 cursor-pointer hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          resetAllDialogStates();
                          setSelectedDate(dateStr);
                          setSelectedDateEvents(dayEvents);
                        }}
                      >
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Event List Panel */}
        <div className="bg-white rounded-lg shadow w-full lg:w-1/3 p-4 border">
          <h3 className="text-md font-semibold mb-2">
            Events in {format(currentDate, "MMMM")}
          </h3>
          <div className="border-t pt-3 space-y-2 max-h-[520px] overflow-auto">
            {monthlyList.map((item) => {
              const dateObj = new Date(item.date);
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2 px-2"
                >
                  <div className="text-center text-sm w-10">
                    <div className="text-gray-500">
                      {format(dateObj, "EEE")}
                    </div>
                    <div>{format(dateObj, "d")}</div>
                  </div>
                  <div
                    className={`flex-1 text-xs rounded-md px-3 py-1 font-medium text-center border ${
                      item.color === "red"
                        ? "border-red-400 text-red-500"
                        : "border-blue-400 text-blue-500"
                    }`}
                  >
                    {item.name}
                  </div>

                  <DropdownMenu
                    open={openMenuId === item.id}
                    onOpenChange={(o) => setOpenMenuId(o ? item.id : null)}
                  >
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 rounded hover:bg-gray-100">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white">
                      <DropdownMenuItem
                        // Use onSelect to ensure Radix closes the menu BEFORE we open a dialog
                        onSelect={(e) => {
                          e.preventDefault();
                          setOpenMenuId(null);
                          resetAllDialogStates();
                          setEditEvent(item);
                          setSelectedDate(item.date);
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={(e) => {
                          e.preventDefault(); // stop Radix from auto-closing then re-opening
                          setOpenMenuId(null); // close the menu first
                          // defer opening the dialog to the next tick so focus is stable
                          setTimeout(() => setConfirmDelete(item), 0);
                        }}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })}
          </div>
        </div>

        {/* +N More Dialog */}
        {selectedDateEvents.length > 0 && (
          <Dialog open modal={false} onOpenChange={resetAllDialogStates}>
            <DialogContent className="bg-white w-fit">
              <DialogHeader>
                <DialogTitle>Events on {selectedDate}</DialogTitle>
              </DialogHeader>
              <div className="space-y-2 mt-4">
                {selectedDateEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className={`cursor-pointer text-white px-3 py-1 rounded text-sm ${
                      ev.color === "red" ? "bg-red-500" : "bg-blue-500"
                    }`}
                    onClick={() => {
                      resetAllDialogStates();
                      setViewEvent(ev);
                    }}
                  >
                    {ev.name}
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* View-only dialog (make non-modal to avoid focus trap conflicts) */}
        {viewEvent && (
          <ViewEventDialog
            modal={false}
            event={viewEvent}
            onClose={() => setViewEvent(null)}
          />
        )}

        {/* Add Event Dialog */}
        {selectedDate && creatingEvent && (
          <EditEventDialog
            modal={false}
            date={selectedDate}
            onClose={resetAllDialogStates}
            onSave={addEvent}
            event={null}
          />
        )}

        {/* Edit Event Dialog */}
        {editEvent && selectedDate && (
          <EditEventDialog
            modal={false}
            date={selectedDate}
            onClose={resetAllDialogStates}
            onSave={addEvent}
            event={editEvent}
          />
        )}

        {/* Confirm Delete Dialog */}
        {confirmDelete && (
          <Dialog
            open={true}
            onOpenChange={(open) => {
              if (!open) setConfirmDelete(null); // only close when we explicitly say so
            }}
          >
            <DialogContent
              className="w-[400px] bg-white p-8 rounded-xl flex flex-col items-center text-center"
              onPointerDownOutside={(e) => e.preventDefault()} // don't auto-close on outside click
              onInteractOutside={(e) => e.preventDefault()} // don't auto-close while dropdown finishes
            >
              <CircleX className="w-12 h-12 text-red-500" strokeWidth={1.5} />
              <h2 className="text-lg font-semibold text-gray-900 mt-5">
                Do you want to delete this event?
              </h2>
              <div className="flex items-center gap-4 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setConfirmDelete(null)}
                >
                  Cancel
                </Button>
                <Button
                  style={{ backgroundColor: "#fb5f59", color: "white" }}
                  onClick={() => {
                    deleteEvent(confirmDelete); // this will update state and then clear dialog
                  }}
                >
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
