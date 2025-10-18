"use client";

import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { format, addMonths } from "date-fns";
import { getUpcomingEvent } from "@/lib/api/adminOverview";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const API_KEY = "OIsoHpHETdSNj2W0pZ5cDYbOz7lrXEP6";
const country = "KH";
const year = new Date().getFullYear();
const month = new Date().getMonth() + 1;

export default function UpcomingEvent() {
  const [events, setEvents] = useState([]);

  // Fetch from Calendarific (Public Holidays)
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(
          `https://calendarific.com/api/v2/holidays?api_key=${API_KEY}&country=${country}&year=${year}&month=${month}`
        );
        const data = await res.json();

        if (data?.response?.holidays?.length) {
          const formatted = data.response.holidays.map((item) => ({
            date: new Date(item.date.iso),
            name: item.name,
          }));
          setEvents((prev) => [...prev, ...formatted]);
        }
      } catch (err) {
        console.error("Failed to fetch public holidays", err);
      }
    };

    fetchEvents();
  }, []);

  const queryClient = useQueryClient();
  const company = queryClient.getQueryData(["company"]);

  // Set date range for upcoming events (today → next month)
  const today = new Date();
  const startDate = format(today, "yyyy-MM-dd");
  const endDate = format(addMonths(today, 1), "yyyy-MM-dd");

  // Fetch company events from API
  const { data: upcomingEvents } = useQuery({
    queryKey: ["admin-dashboard-upcoming-events", company?.id],
    queryFn: () =>
      getUpcomingEvent({
        id: company.id,
        startDate,
        endDate,
      }),
    enabled: !!company?.id,
  });

  // Merge all event sources
  const mergedEvents = [
    ...events,
    ...(upcomingEvents?.data?.map((event) => ({
      date: new Date(event.startDate),
      name: event.title,
      color: event.color,
    })) || []),
  ].sort((a, b) => a.date - b.date);

  return (
    <div className="bg-white rounded-lg p-5 h-full font-custom">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 mt-2">
        <h2 className="text-xl text-black flex items-center gap-2">
          Upcoming Event
        </h2>
      </div>

      <Separator className="mb-4" />

      {/* Scrollable Event List */}
      <div className="space-y-4 overflow-y-auto max-h-[300px] pr-2">
        {mergedEvents.map((event, index) => (
          <div
            key={index}
            className="flex justify-between items-center ml-7 mr-8"
          >
            {/* Date */}
            <div className="flex flex-col items-center w-14 mr-12">
              <span className="text-gray-500 text-sm">
                {format(event.date, "EEE")}
              </span>
              <span className="text-lg font-semibold">
                {format(event.date, "d")}
              </span>
            </div>

            {/* Event name */}
            <div
              className="flex-1 rounded px-4 py-2 ml-3 border"
              style={{
                borderColor: event.color || "#ef4444",
              }}
            >
              <span
                className="text-base font-medium"
                style={{
                  color: event.color || "#ef4444",
                }}
              >
                {event.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
