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
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  CircleX,
} from "lucide-react";
import EditEventDialog from "./edit-event-dialog";
import ViewEventDialog from "./view-event-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [viewEvent, setViewEvent] = useState(null);
  const [editEvent, setEditEvent] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [creatingEvent, setCreatingEvent] = useState(false); // ✅ new state

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const firstDayOffset = getDay(monthStart);
  const daysInGrid = [...Array(firstDayOffset).fill(null), ...days];

  const fetchHolidays = async () => {
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
          color: h.name.includes("King") ? "red" : "blue",
        }))
      );
    } catch (err) {
      console.error("Failed to fetch holidays:", err);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, [currentDate]);

  const addEvent = (event) => {
    setEvents((prev) => {
      const isEditing = prev.some(
        (e) => e.date === event.date && e.name === event.name
      );
      if (isEditing) {
        return prev.map((e) =>
          e.date === event.date && e.name === event.name ? event : e
        );
      } else {
        return [...prev, event];
      }
    });
  };

  const deleteEvent = (event) => {
    setEvents((prev) => prev.filter((e) => e !== event));
  };

  const mergedEvents = [...holidays, ...events].reduce((acc, ev) => {
    if (!acc[ev.date]) acc[ev.date] = [];
    acc[ev.date].push(ev);
    return acc;
  }, {});

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Calendar Panel */}
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

        <div className="grid grid-cols-7 bg-[#f7f9fb] rounded-md overflow-hidden">
          {daysInGrid.map((day, idx) => {
            const dateStr = day && format(day, "yyyy-MM-dd");
            const today = day && isToday(day);
            const dayEvents = mergedEvents[dateStr] || [];

            return (
              <div
                key={idx}
                onClick={() => {
                  if (day) {
                    setSelectedDate(dateStr);
                    setEditEvent(null);
                    setCreatingEvent(true); // ✅ mark as add-event
                  }
                }}
                className={`relative border h-28 p-1 cursor-pointer hover:bg-blue-50 overflow-hidden ${
                  today ? "bg-blue-200" : ""
                }`}
              >
                {day && (
                  <div className="absolute top-1 right-1 text-xs text-black font-semibold">
                    {format(day, "d")}
                  </div>
                )}

                <div className="mt-6 flex flex-col gap-[2px] text-left">
                  {dayEvents.slice(0, 2).map((ev, i) => (
                    <div
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewEvent(ev);
                      }}
                      className={`text-[11px] px-1 py-[2px] rounded-sm text-white truncate w-fit cursor-pointer ${
                        ev.color === "red" ? "bg-red-500" : "bg-blue-500"
                      }`}
                    >
                      {ev.name}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div
                      className="text-[11px] text-white w-fit rounded-sm bg-gray-500 px-1 cursor-pointer hover:underline"
                      onClick={(e) => {
                        e.stopPropagation(); // ✅ prevent triggering day click
                        setSelectedDate(dateStr);
                        setSelectedDateEvents(dayEvents);
                        setCreatingEvent(false); // ✅ cancel add dialog
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
          {[...holidays, ...events]
            .filter((item) =>
              item.date.startsWith(format(currentDate, "yyyy-MM"))
            )
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((item, idx) => {
              const dateObj = new Date(item.date);
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
                    className={`flex-1 text-xs rounded-md px-3 py-1 font-medium text-center border ${
                      item.color === "red"
                        ? "border-red-400 text-red-500"
                        : "border-blue-400 text-blue-500"
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
                      <DropdownMenuItem
                        onClick={() => {
                          setEditEvent(item);
                          setSelectedDate(item.date);
                          setCreatingEvent(false); // prevent add
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setConfirmDelete(item)}
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
        <Dialog open={true} onOpenChange={() => setSelectedDateEvents([])}>
          <DialogContent className="bg-white w-fit">
            <DialogHeader>
              <DialogTitle>Events on {selectedDate}</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 mt-4">
              {selectedDateEvents.map((ev, i) => (
                <div
                  key={i}
                  className={`cursor-pointer text-white px-3 py-1 rounded text-sm ${
                    ev.color === "red" ? "bg-red-500" : "bg-blue-500"
                  }`}
                  onClick={() => setViewEvent(ev)}
                >
                  {ev.name}
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* View-only dialog */}
      {viewEvent && (
        <ViewEventDialog event={viewEvent} onClose={() => setViewEvent(null)} />
      )}

      {/* Add Event Dialog */}
      {selectedDate && creatingEvent && (
        <EditEventDialog
          date={selectedDate}
          onClose={() => {
            setSelectedDate(null);
            setCreatingEvent(false);
          }}
          onSave={(data) => {
            addEvent(data);
            setCreatingEvent(false);
          }}
          event={null}
        />
      )}

      {/* Edit Event Dialog */}
      {editEvent && (
        <EditEventDialog
          date={selectedDate}
          onClose={() => {
            setEditEvent(null);
            setSelectedDate(null);
          }}
          onSave={addEvent}
          event={editEvent}
        />
      )}

      {/* Confirm Delete Dialog */}
      {confirmDelete && (
        <Dialog open={true} onOpenChange={() => setConfirmDelete(null)}>
          <DialogContent className="w-[400px] bg-white p-8 rounded-xl flex flex-col items-center text-center">
            <CircleX className="w-12 h-12 text-red-500" strokeWidth={1.5} />
            <h2 className="text-lg font-semibold text-gray-900 mt-5">
              Do you want to delete this event?
            </h2>
            <div className="flex items-center gap-4 mt-8">
              <Button variant="outline" onClick={() => setConfirmDelete(null)}>
                Cancel
              </Button>
              <Button
                style={{ backgroundColor: "#fb5f59", color: "white" }}
                onClick={() => {
                  deleteEvent(confirmDelete);
                  setConfirmDelete(null);
                }}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
