"use client";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Clock, Users } from "lucide-react";

export default function ViewEventDialog({ event, onClose }) {
  if (!event) return null;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="w-[400px] space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Event Details</h2>

        {/* Title */}
        <div className="flex items-center justify-between gap-2">
          <input
            disabled
            value={event.name}
            className="w-full px-0 py-2 outline-none font-custom text-sm bg-transparent border-b border-gray-300"
          />
          <div
            className={`w-4 h-4 rounded-full ${event.color === "red"
              ? "bg-red-500"
              : "bg-blue-500"
            }`}
          />
        </div>

        {/* Time range */}
        <div className="flex border rounded-md overflow-hidden">
          <div className="flex items-center w-1/2 px-3 py-2 gap-2 border-r">
            <span className="text-sm text-gray-500">Start</span>
            <input
              disabled
              type="time"
              value={event.start}
              className="text-sm w-full bg-transparent outline-none"
            />
          </div>
          <div className="flex items-center w-1/2 px-3 py-2 gap-2">
            <span className="text-sm text-gray-500">End</span>
            <input
              disabled
              type="time"
              value={event.end}
              className="text-sm w-full bg-transparent outline-none"
            />
          </div>
        </div>

        {/* Assignment */}
        <div className="flex items-center justify-between px-3 py-2 border rounded-md cursor-default">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-gray-500" />
            <span className="text-sm">Assigned To</span>
          </div>
          <div className="text-xs text-gray-600 text-right">
            {(event.assign?.selectedFirstLevels || [])
              .map((type) => {
                const items = event.assign?.selectedItems?.[type] || [];
                return `${type}: ${items.join(", ")}`;
              })
              .join(" • ")}
          </div>
        </div>

        {/* Clock-in toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-blue-500 font-medium">Require Clock In</span>
          <Switch checked={event.requireClockIn} disabled />
        </div>

        {/* Policies */}
        {event.requireClockIn && (
          <div className="flex gap-4">
            <div className="w-1/2">
              <span className="text-xs text-gray-500">Leave Policy</span>
              <select
                disabled
                value={event.leavePolicy}
                className="w-full mt-1 text-sm border border-gray-300 rounded-md px-2 py-1 bg-gray-100 text-gray-700"
              >
                <option value="">None</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Annual Leave">Annual Leave</option>
              </select>
            </div>
            <div className="w-1/2">
              <span className="text-xs text-gray-500">Overtime Policy</span>
              <select
                disabled
                value={event.overtimePolicy}
                className="w-full mt-1 text-sm border border-gray-300 rounded-md px-2 py-1 bg-gray-100 text-gray-700"
              >
                <option value="">None</option>
                <option value="Morning">Morning</option>
                <option value="Weekend">Weekend</option>
              </select>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
