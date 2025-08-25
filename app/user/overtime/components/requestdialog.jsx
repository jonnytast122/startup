"use client";

import React, { useRef, useState } from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Smile, Clock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

/* --------- inline TimeInput with scoped CSS to hide native icon --------- */
function TimeInput({ label, value, onChange, disabled = false, step = 60 }) {
  const ref = useRef(null);
  return (
    <div>
      {label && <div className="text-xs text-gray-600 mb-1">{label}</div>}
      <div className="relative">
        <input
          ref={ref}
          type="time"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="time-input-hide-native border rounded px-2 pr-10 py-1 w-full h-9 text-sm appearance-none cursor-pointer"
          step={step}
          inputMode="numeric"
          style={{ WebkitAppearance: "none", MozAppearance: "textfield" }}
        />
        <button
          type="button"
          onClick={() => {
            try {
              ref.current?.showPicker?.();
            } catch {}
            ref.current?.focus();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100 pointer-events-auto z-10"
          aria-label="Open time picker"
          disabled={disabled}
        >
          <Clock className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* SCOPED styles: hide ONLY this input's native icon */}
      <style jsx>{`
        .time-input-hide-native::-webkit-calendar-picker-indicator {
          display: none;
          -webkit-appearance: none;
        }
        .time-input-hide-native::-webkit-clear-button,
        .time-input-hide-native::-webkit-inner-spin-button,
        .time-input-hide-native::-webkit-outer-spin-button {
          display: none;
          -webkit-appearance: none;
        }
        .time-input-hide-native {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}

const overtimeTypes = ["Weekend", "Night", "Holiday", "Special"];

export default function RequestDialog() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const [overtimeType, setOvertimeType] = useState(overtimeTypes[0]);
  const [allDay, setAllDay] = useState(true);

  // All-day ON range (default today)
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // All-day OFF single date + times
  const [oneDayDate, setOneDayDate] = useState(new Date());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");

  const [note, setNote] = useState("");

  // Controlled popovers (so only one opens at a time)
  const [openStartPop, setOpenStartPop] = useState(false);
  const [openEndPop, setOpenEndPop] = useState(false);
  const [openOneDayPop, setOpenOneDayPop] = useState(false);

  const closeAllCalendars = () => {
    setOpenStartPop(false);
    setOpenEndPop(false);
    setOpenOneDayPop(false);
  };

  const toMin = (t) => {
    if (!t || !t.includes(":")) return 0;
    const [h, m] = t.split(":").map(Number);
    return h * 60 + (m || 0);
  };

  const timeDiff = (start, end) => {
    const s = toMin(start);
    const e = toMin(end);
    return Math.max(0, e - s);
  };

  const totalWorkMins = timeDiff(startTime, endTime);
  const totalH = Math.floor(totalWorkMins / 60);
  const totalM = String(totalWorkMins % 60).padStart(2, "0");

  const handleSubmit = () => {
    if (!allDay && toMin(endTime) <= toMin(startTime)) {
      alert("End time must be after start time.");
      return;
    }
    setDrawerOpen(false);
    setTimeout(() => {
      setSuccessOpen(true);
      setTimeout(() => {
        setSuccessOpen(false);
      }, 600);
    }, 220);
  };

  return (
    <>
      <Drawer
        direction="right"
        open={drawerOpen}
        onOpenChange={(o) => {
          setDrawerOpen(o);
          if (!o) closeAllCalendars();
        }}
      >
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="text-blue font-custom w-42 h-10 shadow-md border border-gray-400 bg-transparent rounded-full flex items-center hover:bg-blue-500 hover:text-white transition-colors duration-200"
            onClick={() => setDrawerOpen(true)}
          >
            Request Overtime
          </Button>
        </DrawerTrigger>

        <DrawerContent className="fixed inset-y-0 right-0 left-auto z-50 w-[420px] md:w-[480px] bg-transparent p-0 border-none outline-none h-screen max-h-screen min-h-screen">
          <div className="h-full min-h-screen max-h-screen w-full bg-gray-100 font-custom flex flex-col border-l border-gray-200">
            {/* Header */}
            <div className="flex items-center gap-1 px-5 py-4 flex-shrink-0">
              <DrawerClose asChild>
                <button
                  type="button"
                  aria-label="Close"
                  className="p-1 rounded-full hover:bg-gray-200"
                  onClick={closeAllCalendars}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </DrawerClose>
              <h2 className="text-xl leading-none">New Overtime</h2>
            </div>

            {/* Body */}
            <div className="flex-1 min-h-0 overflow-y-auto space-y-4 px-5 pb-2">
              {/* Overtime type */}
              <section className="bg-white rounded-md p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overtime type</span>
                  <Select value={overtimeType} onValueChange={setOvertimeType}>
                    <SelectTrigger className="h-9 w-44 rounded-full text-sm">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {overtimeTypes.map((t) => (
                        <SelectItem key={t} value={t} className="text-sm">
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </section>

              {/* All day + date/time */}
              <section className="bg-white rounded-md p-4">
                {/* All day row */}
                <div className="flex items-center justify-between pb-3">
                  <span className="text-sm font-medium">All day</span>
                  <Switch
                    checked={allDay}
                    onCheckedChange={(v) => {
                      setAllDay(v);
                      closeAllCalendars();
                    }}
                    className="data-[state=checked]:bg-green-500"
                  />
                </div>

                <div className="h-px bg-gray-200 mb-3" />

                {/* All day ON -> Starts/Ends date pickers via Popover */}
                {allDay ? (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Starts */}
                      <div className="relative">
                        <div className="text-xs text-gray-600 mb-1">Starts</div>
                        <Popover
                          open={openStartPop}
                          onOpenChange={(o) => {
                            setOpenStartPop(o);
                            if (o) {
                              setOpenEndPop(false);
                              setOpenOneDayPop(false);
                            }
                          }}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full justify-center rounded-full h-9 text-sm"
                            >
                              {format(startDate, "dd/MM/yyyy")}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            side="bottom"
                            align="center"
                            sideOffset={8}
                            className="z-[80] bg-white rounded-md shadow border p-2 w-auto pointer-events-auto"
                          >
                            <Calendar
                              mode="single"
                              selected={startDate}
                              defaultMonth={startDate}
                              onSelect={(d) => {
                                if (d) setStartDate(d);
                                setOpenStartPop(false);
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      {/* Ends */}
                      <div className="relative">
                        <div className="text-xs text-gray-600 mb-1">Ends</div>
                        <Popover
                          open={openEndPop}
                          onOpenChange={(o) => {
                            setOpenEndPop(o);
                            if (o) {
                              setOpenStartPop(false);
                              setOpenOneDayPop(false);
                            }
                          }}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full justify-center rounded-full h-9 text-sm"
                            >
                              {format(endDate, "dd/MM/yyyy")}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            side="bottom"
                            align="end"
                            alignOffset={-16}
                            sideOffset={8}
                            className="z-[80] bg-white rounded-md shadow border p-2 w-auto pointer-events-auto"
                          >
                            <Calendar
                              mode="single"
                              selected={endDate}
                              defaultMonth={endDate}
                              onSelect={(d) => {
                                if (d) setEndDate(d);
                                setOpenEndPop(false);
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    {/* Info row */}
                    <div className="mt-4 text-xs text-gray-600">
                      Total time leaves: 24 hours
                    </div>
                  </>
                ) : (
                  /* All day OFF -> single date + time range */
                  <>
                    <div className="mb-3">
                      <div className="text-sm font-medium mb-1">Date and time</div>
                      <Popover
                        open={openOneDayPop}
                        onOpenChange={(o) => {
                          setOpenOneDayPop(o);
                          if (o) {
                            setOpenStartPop(false);
                            setOpenEndPop(false);
                          }
                        }}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-center rounded-full h-9 text-sm"
                          >
                            {format(oneDayDate, "dd/MM/yyyy")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          side="bottom"
                          align="center"
                          sideOffset={8}
                          className="z-[80] bg-white rounded-md shadow border p-2 w-auto pointer-events-auto"
                        >
                          <Calendar
                            mode="single"
                            selected={oneDayDate}
                            defaultMonth={oneDayDate}
                            onSelect={(d) => {
                              if (d) setOneDayDate(d);
                              setOpenOneDayPop(false);
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Reliable time pickers (native icon hidden, custom icon shown) */}
                    <div className="grid grid-cols-2 gap-3">
                      <TimeInput
                        label="Starts"
                        value={startTime}
                        onChange={setStartTime}
                        disabled={false}
                      />
                      <TimeInput
                        label="Ends"
                        value={endTime}
                        onChange={setEndTime}
                        disabled={false}
                      />
                    </div>

                    {/* Duration preview */}
                    <div className="mt-3 text-xs text-gray-700">
                      Total time leaves: <span className="font-semibold">{totalH}:{totalM}</span> hours
                    </div>
                  </>
                )}
              </section>

              {/* Note */}
              <section className="bg-white rounded-md p-4">
                <div className="rounded-md border border-gray-200 p-0.5">
                  <textarea
                    id="note"
                    rows={4}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Hi boss, today is my graduation day. I would like to ask for permission."
                    className="w-full resize-none rounded-[10px] bg-white p-3 text-sm outline-none"
                  />
                </div>
              </section>
            </div>

            {/* Helper text */}
            <div className="text-xs text-gray-600 text-center mt-1 mb-2 px-5 flex-shrink-0">
              Your request will be sent for manager's approval
            </div>

            {/* Footer */}
            <DrawerFooter className="pt-0 px-5 pb-4 flex-shrink-0">
              <Button
                className="w-full h-11 rounded-full text-base font-semibold"
                onClick={handleSubmit}
              >
                Send for approval
              </Button>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Success dialog */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="w-[500px] h-[350px] text-center flex flex-col justify-center gap-4 bg-gray-100 [&_[data-radix-dialog-close]]:hidden">
          <DialogTitle className="text-4xl font-custom text-black mb-2">
            Successfully Sent?
          </DialogTitle>
          <Smile className="w-16 h-16 mx-auto text-green-500 mb-2" />
          <div className="text-lg text-gray-700">Please wait for the approvals.</div>
        </DialogContent>
      </Dialog>
    </>
  );
}
