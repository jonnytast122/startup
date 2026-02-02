"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FaSpinner } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createWorkShift, updateWorkShift } from "@/lib/api/work-shift";
import { fetchCompany } from "@/lib/api/company";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toAmPm(timeStr) {
  let [hours, minutes] = timeStr.split(":").map(Number);
  let ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // 0 → 12, 13 → 1, etc.
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")} ${ampm}`;
}

function removeAmPm(time) {
  return time.replace(/\s?(AM|PM)/i, "");
}

export default function WorkShiftDialog({
  open,
  onClose,
  onSubmit,
  shift = null,
  viewOnly = false,
}) {
  const [shiftName, setShiftName] = useState("New Shift");
  const [workingDays, setWorkingDays] = useState(22);
  const [workingDayType, setWorkingDayType] = useState("Standard");
  const [shiftDays, setShiftDays] = useState([]);
  const [reminderDays, setReminderDays] = useState([]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [breakStart, setBreakStart] = useState("12:00");
  const [breakEnd, setBreakEnd] = useState("13:00");
  const [clockInReminder, setClockInReminder] = useState("08:40");
  const [clockOutReminder, setClockOutReminder] = useState("14:40");
  const [activeReminder, setActiveReminder] = useState(true);

  // Flexible schedule - individual times for each day
  const [flexibleSchedule, setFlexibleSchedule] = useState({
    Mon: { startTime: "09:00", endTime: "17:00", breakStart: "12:00", breakEnd: "13:00" },
    Tue: { startTime: "09:00", endTime: "17:00", breakStart: "12:00", breakEnd: "13:00" },
    Wed: { startTime: "09:00", endTime: "17:00", breakStart: "12:00", breakEnd: "13:00" },
    Thu: { startTime: "09:00", endTime: "17:00", breakStart: "12:00", breakEnd: "13:00" },
    Fri: { startTime: "09:00", endTime: "17:00", breakStart: "12:00", breakEnd: "13:00" },
    Sat: { startTime: "09:00", endTime: "17:00", breakStart: "12:00", breakEnd: "13:00" },
    Sun: { startTime: "09:00", endTime: "17:00", breakStart: "12:00", breakEnd: "13:00" },
  });

  const queryClient = useQueryClient();

  const normalizeShiftType = (value) => {
    if (!value) return "Standard";
    const lower = String(value).toLowerCase();
    return lower === "flexible" ? "Flexible" : "Standard";
  };


  useEffect(() => {
    if (shift) {
      setShiftName(shift.name || "New Shift");
      setWorkingDays(shift.workingDays || 22);
      const normalizedType = normalizeShiftType(shift.shiftType);
      setWorkingDayType(normalizedType);
      const scheduleDays = Array.isArray(shift.schedules)
        ? shift.schedules.map((s) => s.day)
        : [];
      setShiftDays(scheduleDays);
      setReminderDays(shift.reminder?.reminderDays || []);

      if (normalizedType === "Standard") {
        const firstSchedule = shift.schedules?.[0];
        setStartTime(removeAmPm(firstSchedule?.workDuration?.start || "09:00"));
        setEndTime(removeAmPm(firstSchedule?.workDuration?.end || "17:00"));
        setBreakStart(removeAmPm(firstSchedule?.break?.start || "12:00"));
        setBreakEnd(removeAmPm(firstSchedule?.break?.end || "13:00"));
      } else if (Array.isArray(shift.schedules)) {
        const nextFlexible = { ...flexibleSchedule };
        shift.schedules.forEach((schedule) => {
          nextFlexible[schedule.day] = {
            startTime: removeAmPm(schedule.workDuration?.start || "09:00"),
            endTime: removeAmPm(schedule.workDuration?.end || "17:00"),
            breakStart: removeAmPm(schedule.break?.start || "12:00"),
            breakEnd: removeAmPm(schedule.break?.end || "13:00"),
          };
        });
        setFlexibleSchedule(nextFlexible);
      }

      setClockInReminder(shift.clockInReminder || "08:40");
      setClockOutReminder(shift.clockOutReminder || "14:40");
      setActiveReminder(shift.activeReminder ?? true);
    } else {
      setShiftName("New Shift");
      setWorkingDays(22);
      setWorkingDayType("Standard");
      setShiftDays([]);
      setReminderDays([]);
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
    setter(
      state.includes(day) ? state.filter((d) => d !== day) : [...state, day]
    );
  };

  const updateFlexibleTime = (day, field, value) => {
    setFlexibleSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
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

  const { data: company } = useQuery({
    queryKey: ["company"],
    queryFn: fetchCompany,
  });

  const uploadWorkShift = useMutation({
    mutationFn: createWorkShift,
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries({ queryKey: ["workShift", company?.id] });
    },
  });

  const updateShift = useMutation({
    mutationFn: updateWorkShift,
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries({ queryKey: ["workShift", company?.id] });
    },
  });

  const onCreate = () => {
    const shiftType = workingDayType === "Flexible" ? "flexible" : "standard";
    const schedules =
      workingDayType === "Standard"
        ? shiftDays.map((day) => ({
            day,
            workDuration: {
              start: toAmPm(startTime),
              end: toAmPm(endTime),
            },
            ...(breakStart && breakEnd
              ? {
                  break: {
                    start: toAmPm(breakStart),
                    end: toAmPm(breakEnd),
                  },
                }
              : {}),
          }))
        : shiftDays.map((day) => ({
            day,
            workDuration: {
              start: toAmPm(flexibleSchedule[day].startTime),
              end: toAmPm(flexibleSchedule[day].endTime),
            },
            ...(flexibleSchedule[day].breakStart &&
            flexibleSchedule[day].breakEnd
              ? {
                  break: {
                    start: toAmPm(flexibleSchedule[day].breakStart),
                    end: toAmPm(flexibleSchedule[day].breakEnd),
                  },
                }
              : {}),
          }));

    uploadWorkShift.mutate({
      name: shiftName,
      shiftType,
      schedules,
      reminder: {
        reminderDays,
        employeeReminders: {
          clockIn: toAmPm(clockInReminder),
          clockOut: toAmPm(clockOutReminder),
        },
      },
    });
  };

  const onUpdate = () => {
    const shiftType = workingDayType === "Flexible" ? "flexible" : "standard";
    const schedules =
      workingDayType === "Standard"
        ? shiftDays.map((day) => ({
            day,
            workDuration: {
              start: toAmPm(startTime),
              end: toAmPm(endTime),
            },
            ...(breakStart && breakEnd
              ? {
                  break: {
                    start: toAmPm(breakStart),
                    end: toAmPm(breakEnd),
                  },
                }
              : {}),
          }))
        : shiftDays.map((day) => ({
            day,
            workDuration: {
              start: toAmPm(flexibleSchedule[day].startTime),
              end: toAmPm(flexibleSchedule[day].endTime),
            },
            ...(flexibleSchedule[day].breakStart &&
            flexibleSchedule[day].breakEnd
              ? {
                  break: {
                    start: toAmPm(flexibleSchedule[day].breakStart),
                    end: toAmPm(flexibleSchedule[day].breakEnd),
                  },
                }
              : {}),
          }));

    updateShift.mutate({
      id: shift._id || shift.id,
      data: {
        name: shiftName,
        shiftType,
        schedules,
        reminder: {
          reminderDays,
          employeeReminders: {
            clockIn: toAmPm(clockInReminder),
            clockOut: toAmPm(clockOutReminder),
          },
        },
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl px-6 font-custom">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            {viewOnly
              ? "Work Shift Details"
              : shift
              ? "Edit Work Shift"
              : "Add Work Shift"}
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
              <div className="w-1/3 font-medium">Working period:</div>
              <div className="w-2/3 flex items-center gap-2">
                <span className="text-sm">The amount of working day that will be used</span>
                <input
                  type="number"
                  value={workingDays}
                  disabled={viewOnly}
                  onChange={(e) => setWorkingDays(e.target.value)}
                  className="w-16 px-3 py-2 border rounded-md text-sm text-center"
                />
                <span className="text-sm">days in a month</span>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-1/3 font-medium">Working day type:</div>
              <div className="w-2/3 flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="workingDayType"
                    value="Standard"
                    checked={workingDayType === "Standard"}
                    disabled={viewOnly}
                    onChange={(e) => setWorkingDayType(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm">Standard</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="workingDayType"
                    value="Flexible"
                    checked={workingDayType === "Flexible"}
                    disabled={viewOnly}
                    onChange={(e) => setWorkingDayType(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm">Flexible</span>
                </label>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-1/3 font-medium">Work days:</div>
              <div className="w-2/3">{renderDays(shiftDays, setShiftDays)}</div>
            </div>

            {/* Standard Type - Single work duration and break for all days */}
            {workingDayType === "Standard" && (
              <>
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
              </>
            )}

            {/* Flexible Type - Individual work duration and break for each selected day */}
            {workingDayType === "Flexible" && (
              <div className="space-y-4">
                {shiftDays.map((day) => (
                  <div key={day} className="space-y-3">
                    {/* Day header */}
                    <div className="bg-blue-100 py-2 text-center font-semibold text-blue-600 rounded">
                      {day.toUpperCase()}
                    </div>

                    {/* Work duration for this day */}
                    <div className="flex gap-4 items-start">
                      <div className="w-1/3 font-medium">Work duration:</div>
                      <div className="w-2/3 flex items-center gap-4 flex-wrap">
                        <span>Start at:</span>
                        <input
                          type="time"
                          value={flexibleSchedule[day].startTime}
                          disabled={viewOnly}
                          onChange={(e) => updateFlexibleTime(day, "startTime", e.target.value)}
                          className="border rounded px-2 py-1"
                        />
                        <span>End at:</span>
                        <input
                          type="time"
                          value={flexibleSchedule[day].endTime}
                          disabled={viewOnly}
                          onChange={(e) => updateFlexibleTime(day, "endTime", e.target.value)}
                          className="border rounded px-2 py-1"
                        />
                      </div>
                    </div>

                    {/* Break for this day */}
                    <div className="flex gap-4 items-start">
                      <div className="w-1/3 font-medium">Break:</div>
                      <div className="w-2/3 flex items-center gap-4 flex-wrap">
                        <span>Start at:</span>
                        <input
                          type="time"
                          value={flexibleSchedule[day].breakStart}
                          disabled={viewOnly}
                          onChange={(e) => updateFlexibleTime(day, "breakStart", e.target.value)}
                          className="border rounded px-2 py-1"
                        />
                        <span>End at:</span>
                        <input
                          type="time"
                          value={flexibleSchedule[day].breakEnd}
                          disabled={viewOnly}
                          onChange={(e) => updateFlexibleTime(day, "breakEnd", e.target.value)}
                          className="border rounded px-2 py-1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* <div className="w-full border-t pt-4">
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
            </div> */}

            {/* {activeReminder && (
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
            )} */}

            {!viewOnly && (
              <>
                <div className="w-full h-[1px] bg-gray-300 mt-6" />
                <div className="flex justify-end">
                  <Button
                    onClick={shift ? onUpdate : onCreate}
                    className="mt-4 px-6 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    {uploadWorkShift.isPending ? (
                      <FaSpinner className="animate-spin text-white text-lg" />
                    ) : (
                      "Save"
                    )}
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
