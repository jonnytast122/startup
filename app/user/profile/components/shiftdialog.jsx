"use client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function WorkShiftDialog({
  open,
  onOpenChange,
  profileData = null, // ✅ accept data from profile
}) {
  const [shiftName, setShiftName] = useState("");
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
    if (profileData) {
      setShiftName(profileData.name || "");
      setShiftDays(profileData.shiftDays || []);
      setReminderDays(profileData.reminderDays || []);
      setStartTime(profileData.startTime || "09:00");
      setEndTime(profileData.endTime || "17:00");
      setBreakStart(profileData.breakStart || "12:00");
      setBreakEnd(profileData.breakEnd || "13:00");
      setClockInReminder(profileData.clockInReminder || "08:40");
      setClockOutReminder(profileData.clockOutReminder || "14:40");
      setActiveReminder(profileData.activeReminder ?? true);
    }
  }, [profileData, open]);

  const renderDays = (selectedDays) => (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 w-full">
      {days.map((day) => (
        <button
          key={day}
          disabled
          className={`px-3 py-2 text-sm rounded-xl border text-center
          ${
            selectedDays.includes(day)
              ? "bg-blue-100 text-blue-600 border-blue-300"
              : "bg-white text-gray-600 border-gray-300"
          } opacity-50 cursor-not-allowed`}
        >
          {day}
        </button>
      ))}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-full sm:max-w-4xl lg:max-w-6xl px-6 [&>button:last-child]:hidden"
        onPointerDownOutside={() => onOpenChange(false)} // ✅ close on outside click
        onEscapeKeyDown={() => onOpenChange(false)} // ✅ close on ESC
      >
        <DialogHeader className="flex flex-col items-center text-center">
          <DialogTitle></DialogTitle>
          <h1 className="font-custom text-light-gray text-2xl sm:text-lg md:text-xl lg:text-3xl py-6">
            Work Shift Details
          </h1>
          <div className="w-full h-[1px] bg-[#A6A6A6]"></div>
        </DialogHeader>

        <div className="mx-auto max-w-2xl w-full">
          <div className="space-y-6 text-sm text-[#3F4648]">
            {/* Shift Name */}
            <div className="flex gap-4 items-start">
              <div className="w-1/3 font-custom">Shift name:</div>
              <div className="w-2/3">
                <input
                  type="text"
                  value={shiftName}
                  disabled
                  className="w-full px-3 py-2 border rounded-md font-custom text-sm bg-gray-100"
                />
              </div>
            </div>

            {/* Work Days */}
            <div className="flex gap-4 items-start">
              <div className="w-1/3 font-custom">Work days:</div>
              <div className="w-2/3 font-custom">{renderDays(shiftDays)}</div>
            </div>

            {/* Work Duration */}
            <div className="flex gap-4 items-start">
              <div className="w-1/3 font-custom">Work duration:</div>
              <div className="w-2/3 flex font-custom items-center gap-4 flex-wrap">
                <span>Start at:</span>
                <input
                  type="time"
                  value={startTime}
                  disabled
                  className="border rounded px-2 py-1 bg-gray-100"
                />
                <span>End at:</span>
                <input
                  type="time"
                  value={endTime}
                  disabled
                  className="border rounded px-2 py-1 bg-gray-100"
                />
              </div>
            </div>

            {/* Break */}
            <div className="flex gap-4 items-start">
              <div className="w-1/3 font-custom">Break:</div>
              <div className="w-2/3 flex font-custom items-center gap-4 flex-wrap">
                <span>Start at:</span>
                <input
                  type="time"
                  value={breakStart}
                  disabled
                  className="border rounded px-2 py-1 bg-gray-100"
                />
                <span>End at:</span>
                <input
                  type="time"
                  value={breakEnd}
                  disabled
                  className="border rounded px-2 py-1 bg-gray-100"
                />
              </div>
            </div>

            {/* Active Reminder */}
            <div className="w-full border-t pt-4">
              <div className="flex gap-4 items-start">
                <div className="w-1/3 font-custom">Active Reminder</div>
                <div className="w-2/3 flex items-center gap-4 flex-wrap">
                  <Switch
                    checked={activeReminder}
                    disabled
                    className={
                      activeReminder
                        ? "bg-green-500 data-[state=checked]:bg-green-500"
                        : ""
                    }
                  />
                </div>
              </div>
            </div>

            {/* Reminders */}
            {activeReminder && (
              <>
                <div className="flex gap-4 items-start">
                  <div className="w-1/3 font-custom">Reminders active on:</div>
                  <div className="w-2/3 font-custom">
                    {renderDays(reminderDays)}
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-1/3 font-custom">Employee reminders:</div>
                  <div className="w-2/3 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap font-custom">
                      <span>
                        Remind employees to <strong>clock in</strong> at:
                      </span>
                      <input
                        type="time"
                        value={clockInReminder}
                        disabled
                        className="border rounded px-2 py-1 ml-2 font-custom bg-gray-100"
                      />
                    </div>
                    <div className="flex items-center gap-3 flex-wrap font-custom">
                      <span>
                        Remind employees to <strong>clock out</strong> at:
                      </span>
                      <input
                        type="time"
                        value={clockOutReminder}
                        disabled
                        className="border rounded px-2 py-1 font-custom bg-gray-100"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
