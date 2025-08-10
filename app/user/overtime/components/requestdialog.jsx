"use client";

import React, { useState } from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Smile } from "lucide-react";
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

const overtimeTypes = ["Weekend", "Night", "Holiday", "Special"];

export default function RequestDialog() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const [overtimeType, setOvertimeType] = useState(overtimeTypes[0]);
  const [allDay, setAllDay] = useState(true);

  // All-day ON range
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

  const handleSubmit = () => {
    setDrawerOpen(false);
    setTimeout(() => {
      setSuccessOpen(true);
      setTimeout(() => {
        setSuccessOpen(false);
      }, 500); // your last duration
    }, 220); // allow drawer close animation
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

        <DrawerContent className="fixed inset-y-0 right-0 left-auto z-50 w-[400px] md:w-[460px] bg-transparent p-0 border-none outline-none h-screen max-h-screen min-h-screen">
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
                            className="bg-white rounded-md shadow border p-2 w-auto"
                          >
                            <Calendar
                              mode="single"
                              selected={startDate}
                              onSelect={(d) => {
                                if (d) setStartDate(d);
                                setOpenStartPop(false);
                              }}
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
                            align="end"        // keep it attached to the right
                            alignOffset={-16}  // nudge left so it doesn’t get cut off
                            sideOffset={8}
                            className="bg-white rounded-md shadow border p-2 w-auto"
                          >
                            <Calendar
                              mode="single"
                              selected={endDate}
                              onSelect={(d) => {
                                if (d) setEndDate(d);
                                setOpenEndPop(false);
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    {/* Total time row (placeholder) */}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm text-gray-700">Total time leaves</span>
                      <span className="text-sm">
                        <span className="font-semibold">24:00</span>{" "}
                        <span className="text-gray-600">work hours</span>
                      </span>
                    </div>
                  </>
                ) : (
                  /* All day OFF -> single date + time range */
                  <>
                    <div className="mb-3">
                      <div className="text-sm font-medium mb-1">Date and time leaves</div>
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
                          className="bg-white rounded-md shadow border p-2 w-auto"
                        >
                          <Calendar
                            mode="single"
                            selected={oneDayDate}
                            onSelect={(d) => {
                              if (d) setOneDayDate(d);
                              setOpenOneDayPop(false);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Native time inputs (clock icon clickable) */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Starts</div>
                        <input
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="border rounded px-2 py-1 w-full h-9 text-sm"
                        />
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Ends</div>
                        <input
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="border rounded px-2 py-1 w-full h-9 text-sm"
                        />
                      </div>
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
                    placeholder="Hi boss, today is my graduation day. I would like to ask for a permission."
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
        <DialogContent className="w-[500px] h-[350px] text-center flex flex-col justify-center gap-4 [&>[data-radix-dialog-close]]:hidden">
          <DialogTitle className="text-4xl font-custom text-black mb-4 text-center w-full">
            Successfully Sent
          </DialogTitle>
          <Smile className="w-16 h-16 mx-auto text-green-500 mb-4" />
          <div className="text-lg text-gray-700">Please wait for the approvals.</div>
        </DialogContent>
      </Dialog>
    </>
  );
}
