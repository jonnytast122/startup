"use client";

import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

const API_KEY = "OIsoHpHETdSNj2W0pZ5cDYbOz7lrXEP6";
const country = "KH";
const year = new Date().getFullYear();
const month = new Date().getMonth() + 1;

export default function UpcomingEvent() {
  const [events, setEvents] = useState([
    { date: new Date(year, month - 1, 3), name: "CEO's Birthday" },
    { date: new Date(year, month - 1, 4), name: "Staff Appreciation Day" },
    { date: new Date(year, month - 1, 5), name: "Inventory Audit" },
    { date: new Date(year, month - 1, 6), name: "Finance Meeting" },
    { date: new Date(year, month - 1, 7), name: "Marketing Campaign Launch" },
    { date: new Date(year, month - 1, 8), name: "Customer Feedback Session" },
    { date: new Date(year, month - 1, 9), name: "Safety Drill" },
    { date: new Date(year, month - 1, 10), name: "IT System Upgrade" },
    { date: new Date(year, month - 1, 11), name: "Branch Inspection" },
    { date: new Date(year, month - 1, 12), name: "New Menu Testing" },
    { date: new Date(year, month - 1, 13), name: "Training Workshop" },
    { date: new Date(year, month - 1, 14), name: "Operations Sync" },
    { date: new Date(year, month - 1, 15), name: "Annual Strategy Meeting" },
    { date: new Date(year, month - 1, 16), name: "Partnership Meeting" },
    { date: new Date(year, month - 1, 17), name: "Hiring Panel" },
    { date: new Date(year, month - 1, 18), name: "Team Photoshoot" },
    { date: new Date(year, month - 1, 19), name: "Social Media Day" },
    { date: new Date(year, month - 1, 20), name: "Equipment Maintenance" },
    { date: new Date(year, month - 1, 21), name: "Product Brainstorm" },
    { date: new Date(year, month - 1, 22), name: "Team Building Day" },
    { date: new Date(year, month - 1, 23), name: "Budget Review" }
  ]);

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
            name: item.name
          }));
          setEvents((prev) => [...prev, ...formatted]);
        }
      } catch (err) {
        console.error("Failed to fetch events", err);
      }
    };

    fetchEvents();
  }, []);

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
        {events.map((event, index) => (
          <div key={index} className="flex justify-between items-center ml-7 mr-8">
            <div className="flex flex-col items-center w-14 mr-12">
              <span className="text-gray-500 text-xl">
                {format(event.date, "EEE")}
              </span>
              <span className="text-xl">
                {format(event.date, "d")}
              </span>
            </div>
            <div className="flex-1 border border-red-500 rounded px-4 py-2 ml-3">
              <span className="text-red-500 text-base">
                {event.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
