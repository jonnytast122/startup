"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Users } from "lucide-react";
import { format } from "date-fns";

export default function ViewEventDialog({ event, onClose }) {
  if (!event) return null;

  const startTime = format(new Date(event.startDate), "HH:mm");
  const endTime = format(new Date(event.endDate), "HH:mm");

  return (
    <Dialog open={!!event} onOpenChange={onClose}>
      <DialogContent className="w-[400px] space-y-4">
        <DialogHeader>
          <DialogTitle>Event Details</DialogTitle>
        </DialogHeader>

        {/* Title */}
        <div className="flex items-center justify-between gap-2">
          <input
            disabled
            value={event.title}
            className="w-full px-0 py-2 outline-none font-custom text-sm bg-transparent border-b border-gray-300"
          />
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: event.color }}
          />
        </div>

        {/* Time range */}
        <div className="flex border rounded-md overflow-hidden">
          <div className="flex items-center w-1/2 px-3 py-2 gap-2 border-r">
            <span className="text-sm text-gray-500">Start</span>
            <input
              disabled
              type="time"
              value={startTime}
              className="text-sm w-full bg-transparent outline-none"
            />
          </div>
          <div className="flex items-center w-1/2 px-3 py-2 gap-2">
            <span className="text-sm text-gray-500">End</span>
            <input
              disabled
              type="time"
              value={endTime}
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

          <div className="flex items-center gap-1">
            {event.assignee?.length ? (
              event.assignee.map((a) => {
                const [first, ...rest] = a.name.split(" ");
                const last = rest.length ? rest[rest.length - 1] : "";
                const initials = (first?.[0] || "") + (last?.[0] || "");

                return (
                  <div
                    key={a.id}
                    className="flex items-center gap-1 text-xs text-gray-600"
                  >
                    {a.profile?.imageUrl ? (
                      <img
                        src={a.profile.imageUrl}
                        alt={a.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-[10px] font-medium text-white">
                        {initials.toUpperCase()}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <span className="text-xs text-gray-600">No assignees</span>
            )}
          </div>
        </div>

        {/* Clock-in toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-blue-500 font-medium">
            Require Clock In
          </span>
          <Switch checked={event.isRequireClockInOut} disabled />
        </div>

        {event.isRequireClockInOut && (
          <div className="flex gap-4">
            {/* Leave Policy */}
            <div className="w-1/2">
              <span className="text-xs text-gray-500">Leave Policy</span>
              <select className="w-full mt-1 text-sm border border-gray-300 rounded-md px-2 py-1">
                {event.leavePolicies ? (
                  <option value="">{event.leavePolicies.name}</option>
                ) : (
                  <option value="">None</option>
                )}
              </select>
            </div>

            {/* Overtime Policy */}
            <div className="w-1/2">
              <span className="text-xs text-gray-500">Overtime Policy</span>
              <select className="w-full mt-1 text-sm border border-gray-300 rounded-md px-2 py-1">
                {event.overtimeType ? (
                  <option value="">{event.overtimeType.name}</option>
                ) : (
                  <option value="">None</option>
                )}
              </select>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
