"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function WorkShiftDialog({
  open,
  onClose,
  onSubmit,
  shift = null,
  viewOnly = false,
}) {
  const [shiftName, setShiftName] = useState("New Shift");
  const [shiftDays, setShiftDays] = useState([]);
  const [reminderDays, setReminderDays] = useState([]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [breakStart, setBreakStart] = useState("12:00");
  const [breakEnd, setBreakEnd] = useState("13:00");
  const [clockInReminder, setClockInReminder] = useState("08:40");
  const [clockOutReminder, setClockOutReminder] = useState("14:40");
  const [activeReminder, setActiveReminder] = useState(true);

  useEffect(() => {
    if (shift) {
      setShiftName(shift.name || "New Shift");
      setShiftDays(shift.shiftDays || []);
      setReminderDays(shift.reminderDays || []);
      setStartTime(shift.startTime || "09:00");
      setEndTime(shift.endTime || "17:00");
      setBreakStart(shift.breakStart || "12:00");
      setBreakEnd(shift.breakEnd || "13:00");
      setClockInReminder(shift.clockInReminder || "08:40");
      setClockOutReminder(shift.clockOutReminder || "14:40");
      setActiveReminder(shift.activeReminder ?? true);
    } else {
      setShiftName("New Shift");
      setShiftDays(["Mon", "Tue", "Wed", "Thu", "Fri"]);
      setReminderDays(["Mon", "Tue", "Wed", "Thu", "Fri"]);
      setStartTime("09:00");
      setEndTime("17:00");
      setBreakStart("12:00");
      setBreakEnd("13:00");
      setClockInReminder("08:40");
      setClockOutReminder("14:40");
      setActiveReminder(true);
    }
  }, [shift, open]);

  const toggleDay = (state, setter, day) => {
    if (viewOnly) return;
    setter(state.includes(day) ? state.filter(d => d !== day) : [...state, day]);
  };

  const renderDays = (selectedDays, setter) => (
    <div className="flex gap-2 w-full flex-nowrap">
      {days.map((day) => (
        <button
          key={day}
          disabled={viewOnly}
          onClick={() => toggleDay(selectedDays, setter, day)}
          className={`min-w-[60px] px-3 py-2 text-sm rounded-xl border text-center ${
            selectedDays.includes(day)
              ? "bg-blue-100 text-blue-600 border-blue-300"
              : "bg-white text-gray-600 border-gray-300"
          } ${viewOnly ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {day}
        </button>
      ))}
    </div>
  );

  const handleConfirm = () => {
    const updatedShift = {
      ...(shift || {}),
      id: shift?.id || Date.now(),
      name: shiftName,
      status: shift?.status || "Active",
      createdBy: shift?.createdBy || "Admin",
      profilePic: shift?.profilePic || "/path/to/default.jpg",
      shiftDays,
      reminderDays,
      startTime,
      endTime,
      breakStart,
      breakEnd,
      clockInReminder,
      clockOutReminder,
      activeReminder,
    };
    onSubmit(updatedShift);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl px-6">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            {viewOnly ? "Work Shift Details" : shift ? "Edit Work Shift" : "Add Work Shift"}
          </DialogTitle>
          <div className="w-full h-[1px] bg-gray-300 my-4" />
        </DialogHeader>

        <div className="mx-auto max-w-2xl w-full">
          <div className="space-y-6 text-sm text-[#3F4648]">
            <div className="flex gap-4 items-start">
              <div className="w-1/3 font-medium">Shift name:</div>
              <div className="w-2/3">
                <input
                  type="text"
                  value={shiftName}
                  disabled={viewOnly}
                  onChange={(e) => setShiftName(e.target.value)}
                  placeholder="Enter shift name"
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-1/3 font-medium">Work days:</div>
              <div className="w-2/3">{renderDays(shiftDays, setShiftDays)}</div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-1/3 font-medium">Work duration:</div>
              <div className="w-2/3 flex items-center gap-4 flex-wrap">
                <span>Start at:</span>
                <input
                  type="time"
                  value={startTime}
                  disabled={viewOnly}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="border rounded px-2 py-1"
                />
                <span>End at:</span>
                <input
                  type="time"
                  value={endTime}
                  disabled={viewOnly}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="border rounded px-2 py-1"
                />
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-1/3 font-medium">Break:</div>
              <div className="w-2/3 flex items-center gap-4 flex-wrap">
                <span>Start at:</span>
                <input
                  type="time"
                  value={breakStart}
                  disabled={viewOnly}
                  onChange={(e) => setBreakStart(e.target.value)}
                  className="border rounded px-2 py-1"
                />
                <span>End at:</span>
                <input
                  type="time"
                  value={breakEnd}
                  disabled={viewOnly}
                  onChange={(e) => setBreakEnd(e.target.value)}
                  className="border rounded px-2 py-1"
                />
              </div>
            </div>

            <div className="w-full border-t pt-4">
              <div className="flex gap-4 items-start">
                <div className="w-1/3 font-medium">Active Reminder</div>
                <div className="w-2/3 flex items-center gap-4 flex-wrap">
                  <Switch
                    checked={activeReminder}
                    onCheckedChange={setActiveReminder}
                    disabled={viewOnly}
                    className={
                      activeReminder
                        ? "bg-green-500 data-[state=checked]:bg-green-500"
                        : ""
                    }
                  />
                </div>
              </div>
            </div>

            {activeReminder && (
              <>
                <div className="flex gap-4 items-start">
                  <div className="w-1/3 font-medium">Reminders active on:</div>
                  <div className="w-2/3">{renderDays(reminderDays, setReminderDays)}</div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-1/3 font-medium">Employee reminders:</div>
                  <div className="w-2/3 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span>Remind employees to <strong>clock in</strong> at:</span>
                      <input
                        type="time"
                        value={clockInReminder}
                        disabled={viewOnly}
                        onChange={(e) => setClockInReminder(e.target.value)}
                        className="border rounded px-2 py-1 ml-2"
                      />
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span>Remind employees to <strong>clock out</strong> at:</span>
                      <input
                        type="time"
                        value={clockOutReminder}
                        disabled={viewOnly}
                        onChange={(e) => setClockOutReminder(e.target.value)}
                        className="border rounded px-2 py-1"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {!viewOnly && (
              <>
                <div className="w-full h-[1px] bg-gray-300 mt-6" />
                <div className="flex justify-end">
                  <Button
                    onClick={handleConfirm}
                    className="mt-4 px-6 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Save Changes
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
