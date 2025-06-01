"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Clock, Users } from "lucide-react";

export default function EventDialog({ date, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("13:00");
  const [end, setEnd] = useState("13:00");
  const [assign, setAssign] = useState("User");
  const [requireClockIn, setRequireClockIn] = useState(false);

  const handleSubmit = () => {
    onSave({
      name: title,
      date,
      start,
      end,
      assign,
      requireClockIn,
    });
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="w-[380px] space-y-4">
        {/* Title */}
        <input
          placeholder="Event Title"
          className="w-full px-3 py-2 border rounded-md font-custom text-sm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Time range row */}
        <div className="flex border rounded-md overflow-hidden">
          <div className="flex items-center w-1/2 px-3 py-2 gap-2 border-r">
            <Clock size={16} className="text-gray-400" />
            <input
              type="time"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="text-sm w-full bg-transparent outline-none"
            />
          </div>
          <div className="flex items-center w-1/2 px-3 py-2 gap-2">
            <span className="text-sm text-gray-500">End</span>
            <input
              type="time"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="text-sm w-full bg-transparent outline-none"
            />
          </div>
        </div>

        {/* Assignment */}
        <div className="flex items-center justify-between px-3 py-2 border rounded-md">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-gray-500" />
            <span className="text-sm">Assign</span>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={assign}
              onChange={(e) => setAssign(e.target.value)}
              className="text-sm border-none bg-blue-50 text-blue-500 px-2 py-1 rounded-md"
            >
              <option value="User">User</option>
              <option value="Group">Group</option>
              <option value="Department">Department</option>
              <option value="Branch">Branch</option>
            </select>
            <span className="text-xs text-gray-400">2 selected</span>
          </div>
        </div>

        {/* Clock in switch */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-blue-500 font-medium">Require Clock In</span>
          <Switch
            checked={requireClockIn}
            onCheckedChange={setRequireClockIn}
          />
        </div>

        <div className="text-right">
          <Button onClick={handleSubmit}>Confirm</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
