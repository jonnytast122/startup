"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";

export default function ViewEventDialog({ event, onClose }) {
  if (!event) return null;

  // Check if event has time information
  const hasTime = event.startDate && event.startDate.includes("T");
  const startTime = hasTime ? format(new Date(event.startDate), "hh:mm A") : "07:00 AM";
  const endTime = hasTime ? format(new Date(event.endDate), "hh:mm A") : "07:00 AM";

  // Get color
  const eventColor = event.color === "red" ? "#ef4444" : event.color === "blue" ? "#3b82f6" : event.color;

  return (
    <Dialog open={!!event} onOpenChange={onClose}>
      <DialogContent className="w-[500px] space-y-6 font-custom">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Event Details</DialogTitle>
        </DialogHeader>

        {/* Title with color indicator */}
        <div className="flex items-center justify-between gap-4 pb-3 border-b border-gray-200">
          <span className="text-lg font-normal text-gray-900">
            {event.name || event.title}
          </span>
          <div
            className="w-6 h-6 rounded-full flex-shrink-0"
            style={{ backgroundColor: eventColor }}
          />
        </div>

        {/* Time range */}
        <div className="flex border rounded-lg overflow-hidden">
          <div className="flex items-center w-1/2 px-4 py-3 gap-3 border-r">
            <span className="text-sm text-gray-500 font-medium">Start</span>
            <span className="text-sm font-medium text-gray-900">
              {startTime}
            </span>
          </div>
          <div className="flex items-center w-1/2 px-4 py-3 gap-3">
            <span className="text-sm text-gray-500 font-medium">End</span>
            <span className="text-sm font-medium text-gray-900">
              {endTime}
            </span>
          </div>
        </div>

        {/* Require Clock In toggle */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-blue-500 font-medium">
            Require Clock In
          </span>
          <Switch checked={event.isRequireClockInOut || false} disabled />
        </div>
      </DialogContent>
    </Dialog>
  );
}
