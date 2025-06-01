
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AddWorkShiftDialog({ open, onClose, onSubmit }) {
  const [shiftDays, setShiftDays] = useState(["Mon", "Tue", "Wed", "Thu", "Fri"]);
  const [reminderDays, setReminderDays] = useState(["Mon", "Tue", "Wed", "Thu", "Fri"]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [breakStart, setBreakStart] = useState("12:00");
  const [breakEnd, setBreakEnd] = useState("13:00");
  const [clockInReminder, setClockInReminder] = useState("08:40");
  const [clockOutReminder, setClockOutReminder] = useState("14:40");

  const toggleDay = (state, setter, day) => {
    setter(state.includes(day) ? state.filter(d => d !== day) : [...state, day]);
  };

  const renderDays = (selectedDays, setter) => (
    <div className="flex gap-2 flex-wrap">
      {days.map((day) => (
        <button
          key={day}
          onClick={() => toggleDay(selectedDays, setter, day)}
          className={`px-4 py-1 text-sm rounded-full border ${
            selectedDays.includes(day)
              ? "bg-blue-100 text-blue-600 border-blue-300"
              : "bg-white text-gray-600 border-gray-300"
          }`}
        >
          {day}
        </button>
      ))}
    </div>
  );

  const handleConfirm = () => {
    const newShift = {
      id: Date.now(),
      name: "New Shift",
      status: "Active",
      createdBy: "Admin",
      profilePic: "/path/to/default.jpg",
      shiftDays,
      reminderDays,
      startTime,
      endTime,
      breakStart,
      breakEnd,
      clockInReminder,
      clockOutReminder,
    };
    onSubmit(newShift);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Work shift details</DialogTitle>
          <div className="w-full h-[1px] bg-gray-300 my-4" />
        </DialogHeader>
          <div className="flex justify-center">

        <div className="space-y-6 text-sm text-[#3F4648]">
          {/* Work days */}
          <div className="flex gap-4 items-start">
            <div className="w-1/3 font-medium">Work days:</div>
            <div className="w-2/3">{renderDays(shiftDays, setShiftDays)}</div>
          </div>

          {/* Work duration */}
          <div className="flex gap-4 items-start">
            <div className="w-1/3 font-medium">Work duration:</div>
            <div className="w-2/3 flex items-center gap-4 flex-wrap">
              <span>Start at:</span>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="border rounded px-2 py-1" />
              <span>End at:</span>
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="border rounded px-2 py-1" />
            </div>
          </div>

          {/* Break */}
          <div className="flex gap-4 items-start">
            <div className="w-1/3 font-medium">Break:</div>
            <div className="w-2/3 flex items-center gap-4 flex-wrap">
              <span>Start at:</span>
              <input type="time" value={breakStart} onChange={(e) => setBreakStart(e.target.value)} className="border rounded px-2 py-1" />
              <span>End at:</span>
              <input type="time" value={breakEnd} onChange={(e) => setBreakEnd(e.target.value)} className="border rounded px-2 py-1" />
            </div>
          </div>

          {/* Reminder Days */}
          <div className="flex gap-4 items-start">
            <div className="w-1/3 font-medium">Reminders active on:</div>
            <div className="w-2/3">{renderDays(reminderDays, setReminderDays)}</div>
          </div>

          {/* Employee Reminders */}
          <div className="flex gap-4 items-start">
            <div className="w-1/3 font-medium">Employee reminders:</div>
            <div className="w-2/3 space-y-2">
              <div className="flex items-center gap-3">
                <span>Remind employees to <strong>clock in</strong> at:</span>
                <input type="time" value={clockInReminder} onChange={(e) => setClockInReminder(e.target.value)} className="border rounded px-2 py-1" />
              </div>
              <div className="flex items-center gap-3">
                <span>Remind employees to <strong>clock out</strong> at:</span>
                <input type="time" value={clockOutReminder} onChange={(e) => setClockOutReminder(e.target.value)} className="border rounded px-2 py-1" />
              </div>
            </div>
          </div>

          <div className="w-full h-[1px] bg-gray-300 mt-6" />
          <div className="flex justify-end">
            <Button onClick={handleConfirm} className="mt-4 px-6 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white">
              Confirm
            </Button>
          </div>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
