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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCalendar,
  addCalendar,
  updateCalendar,
  deleteCalendar,
} from "@/lib/api/calendar";

const API_KEY = "pozBd6WMN3FF5ufGppIG8nLCnFGiOtRJ";

export default function CambodiaHolidayCalendar() {
  const queryClient = useQueryClient();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [holidays, setHolidays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [viewEvent, setViewEvent] = useState(null);
  const [editEvent, setEditEvent] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [openMore, setOpenMore] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const firstDayOffset = getDay(monthStart);
  const daysInGrid = useMemo(
    () => [...Array(firstDayOffset).fill(null), ...days],
    [firstDayOffset, days]
  );

  // --- Fetch calendar from backend ---
  const { data: calendar } = useQuery({
    queryKey: ["calendar"],
    queryFn: fetchCalendar,
  });

  // --- Fetch Cambodian holidays ---
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
        allHolidays.map((h) => {
          const type = (h.type?.[0] || "").toLowerCase();
          const isHoliday = type.includes("holiday");

          return {
            color: isHoliday ? "#F1C40F" : "#72B0AB",
            startDate: h.date.iso,
            endDate: h.date.iso,
            isRequireClockInOut: false,
            leavePolicies: null,
            overtimeType: null,
            title: h.name,
            isHoliday,
            source: "holiday",
          };
        })
      );
    } catch (err) {
      console.error("Failed to fetch holidays:", err);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, [currentDate]);

  // --- Format backend events into daily events ---
  const formattedCalendar =
    calendar?.map((item) => ({
      id: item.id || item.id,
      assignee: item.assignee || [],
      color: item.color || "#2998FF",
      startDate: item.startDate,
      endDate: item.endDate,
      isRequireClockInOut: item.isRequireClockInOut ?? false,
      leavePolicies: item.leavePolicies ?? null,
      overtimeType: item.overtimeType ?? null,
      title: item.title,
    })) || [];

  /// --- Derived maps ---
  const mergedByDate = useMemo(() => {
    const acc = {};
    [...holidays, ...formattedCalendar].forEach((ev) => {
      const key = ev.startDate.slice(0, 10); // normalize date key
      if (!acc[key]) acc[key] = [];
      acc[key].push(ev);
    });
    return acc;
  }, [holidays, formattedCalendar]);

  const monthlyList = useMemo(() => {
    const yymm = format(currentDate, "yyyy-MM");
    return [...holidays, ...formattedCalendar]
      .filter((item) => item.startDate.startsWith(yymm))
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  }, [holidays, formattedCalendar, currentDate]);
  // --- Mutations ---
  const addEventMutation = useMutation({
    mutationFn: addCalendar,
    onSuccess: () => queryClient.invalidateQueries(["calendar"]),
    onError: (err) => console.error(err),
  });

  const updateEventMutation = useMutation({
    mutationFn: ({ id, payload }) => updateCalendar({ id, data: payload }),
    onSuccess: () => {
      queryClient.invalidateQueries(["calendar"]);
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: (id) => deleteCalendar(id),
    onSuccess: () => queryClient.invalidateQueries(["calendar"]),
    onError: (err) => console.error(err),
  });

  // --- Handlers ---
  const handleSaveEvent = (event) => {
    const payload = {
      title: event.title, // <- use title
      startDate: event.startDate,
      endDate: event.endDate,
      color: event.color || "blue",
      assignee: event.assignee || [],
      isRequireClockInOut: event.isRequireClockInOut || false,
      leavePolicies: event.leavePolicies || null,
      overtimeType: event.overtimeType || null,
    };
    if (editEvent) {
      updateEventMutation.mutate({ id: editEvent.id, payload });
    } else {
      addEventMutation.mutate(payload);
    }
    resetAllDialogStates();
  };

  const handleDeleteEvent = (event) => {
    deleteEventMutation.mutate(event.id);
    resetAllDialogStates();
  };

  const resetAllDialogStates = () => {
    setSelectedDate(null);
    setSelectedDateEvents([]);
    setViewEvent(null);
    setEditEvent(null);
    setConfirmDelete(null);
    setCreatingEvent(false);
    setOpenMenuId(null);
  };

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

      <div className="flex flex-col lg:flex-row justify-between gap-6">
        {/* Calendar Grid Panel */}
        <div className="bg-white rounded-lg shadow w-full lg:w-3/2 p-2 sm:p-4 h-screen">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <button
              className="p-1 sm:p-2 rounded hover:bg-gray-100"
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <h2 className="text-base sm:text-lg font-semibold">
              {format(currentDate, "MMMM yyyy")}
            </h2>
            <button
              className="p-1 sm:p-2 rounded hover:bg-gray-100"
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 text-center font-medium text-[10px] sm:text-sm text-gray-600 mb-1 sm:mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="px-1 truncate">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar cells */}
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
                  className={`relative border p-1 sm:p-1.5 cursor-pointer hover:bg-blue-50 overflow-hidden h-24 sm:h-28 md:h-32 ${
                    today ? "bg-blue-200" : ""
                  }`}
                >
                  {day && (
                    <div className="absolute top-1 right-1 text-[10px] sm:text-xs text-black font-semibold">
                      {format(day, "d")}
                    </div>
                  )}
                  <div className="mt-6 sm:mt-7 flex flex-col gap-[2px] text-left min-w-0">
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div
                        key={`${dateStr}-${ev.title}-${idx}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          resetAllDialogStates();
                          setViewEvent(ev);
                        }}
                        className="px-1 rounded-tr-2xl text-white truncate max-w-[95%] sm:max-w-[90%] text-[10px] sm:text-[11px]"
                        style={{
                          backgroundColor: ev.color,
                        }}
                        aria-label={ev.name}
                      >
                        <div>
                          {ev.title}
                          {ev.source !== "holiday" && (
                            <div className="block text-[10px] text-gray-700">
                              {format(new Date(ev.startDate), "HH:mm")} -{" "}
                              {format(new Date(ev.endDate), "HH:mm")}
                            </div>
                          )}
                        </div>
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
                          setOpenMore(true); // 🔑 open dialog
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
        <div className="bg-white rounded-lg shadow w-full lg:w-1/4 p-4 border">
          <h3 className="text-md font-semibold mb-2">
            Events in {format(currentDate, "MMMM")}
          </h3>
          <div className="border-t pt-3 space-y-2 max-h-screen overflow-auto">
            {Object.entries(
              monthlyList.reduce((acc, item) => {
                const key = item.startDate.slice(0, 10);
                if (!acc[key]) acc[key] = [];
                acc[key].push(item);
                return acc;
              }, {})
            ).map(([date, items]) => {
              const dateObj = new Date(date);
              return (
                <div key={date} className="space-y-1">
                  {/* Date Header */}
                  <div className="flex items-center gap-2 px-2 font-semibold">
                    <div className="text-center text-sm w-10">
                      <div className="text-gray-500">
                        {format(dateObj, "EEE")}
                      </div>
                      <div>{format(dateObj, "d")}</div>
                    </div>
                    <span className="text-gray-700">
                      {format(dateObj, "MMMM yyyy")}
                    </span>
                  </div>

                  {/* Events for that date */}
                  {items.map((item, idx) => (
                    <div
                      key={item.id || item.id || `${date}-${idx}`}
                      className="flex items-center justify-between gap-2 px-3 py-1 text-xs rounded-md font-medium text-center border"
                      style={{
                        borderColor: item.color,
                        color: item.color,
                      }}
                    >
                      {/* Title */}
                      <span>{item.title}</span>

                      {/* Dropdown Actions */}
                      {item.source !== "holiday" && (
                        <DropdownMenu
                          open={openMenuId === `${date}-${idx}`}
                          onOpenChange={(o) =>
                            setOpenMenuId(o ? `${date}-${idx}` : null)
                          }
                        >
                          <DropdownMenuTrigger asChild>
                            <button className="p-1 rounded hover:bg-gray-100">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-white font-custom"
                          >
                            <DropdownMenuItem
                              onSelect={(e) => {
                                e.preventDefault();
                                setOpenMenuId(null);
                                resetAllDialogStates();
                                setEditEvent(item);
                                setSelectedDate(date);
                              }}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={(e) => {
                                e.preventDefault();
                                setOpenMenuId(null);
                                setTimeout(() => setConfirmDelete(item), 0);
                              }}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Dialogs */}
        {selectedDateEvents.length > 0 && (
          <Dialog open={openMore} onOpenChange={setOpenMore}>
            {selectedDateEvents.length > 0 && (
              <DialogContent className="bg-white w-fit">
                <DialogHeader>
                  <DialogTitle>Events on {selectedDate}</DialogTitle>
                </DialogHeader>

                <div className="space-y-2 mt-4">
                  {selectedDateEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="px-1 rounded-r-sm text-white truncate max-w-[95%] sm:max-w-[90%] text-[10px] sm:text-[11px]"
                      style={{ backgroundColor: ev.color }}
                      onClick={() => {
                        resetAllDialogStates();
                        setViewEvent(ev);
                      }}
                    >
                      <div>
                        {ev.title}
                        {ev.source !== "holiday" && (
                          <div className="block text-[10px] text-gray-700">
                            {format(new Date(ev.startDate), "HH:mm")} -{" "}
                            {format(new Date(ev.endDate), "HH:mm")}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            )}
          </Dialog>
        )}

        {viewEvent && (
          <ViewEventDialog
            modal={false}
            event={viewEvent}
            onClose={() => setViewEvent(null)}
          />
        )}

        {selectedDate && creatingEvent && (
          <EditEventDialog
            modal={false}
            date={selectedDate}
            onClose={resetAllDialogStates}
            onSave={handleSaveEvent}
            event={null}
          />
        )}

        {editEvent && selectedDate && (
          <EditEventDialog
            modal={false}
            date={selectedDate}
            onClose={resetAllDialogStates}
            onSave={handleSaveEvent}
            event={editEvent}
          />
        )}

        {confirmDelete && (
          <Dialog
            open={true}
            onOpenChange={(open) => {
              if (!open) setConfirmDelete(null);
            }}
          >
            <DialogContent
              className="w-[400px] bg-white p-8 rounded-xl flex flex-col items-center text-center"
              onPointerDownOutside={(e) => e.preventDefault()}
              onInteractOutside={(e) => e.preventDefault()}
            >
              <CircleX className="w-12 h-12 text-red-500" strokeWidth={1.5} />
              <DialogHeader>
                <DialogTitle>
                  Do you want to delete this event {confirmDelete.title}?
                </DialogTitle>
              </DialogHeader>

              <div className="flex items-center gap-4 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setConfirmDelete(null)}
                >
                  Cancel
                </Button>
                <Button
                  style={{ backgroundColor: "#fb5f59", color: "white" }}
                  onClick={() => handleDeleteEvent(confirmDelete)}
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
