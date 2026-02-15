"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Smile, AlertTriangle } from "lucide-react";
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

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyPolicies, requestLeave } from "@/lib/api/userLeave";

export default function RequestDialog() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [selectedPolicy, setSeletedPolicy] = useState({});
  const [allDay, setAllDay] = useState(true);
  const [selectedType, setSelectedType] = useState("morning");

  // All-day ON range (default today)
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // All-day OFF single date + session
  const [oneDayDate, setOneDayDate] = useState(new Date());

  const [note, setNote] = useState("");

  // Controlled popovers (so only one opens at a time)
  const [openStartPop, setOpenStartPop] = useState(false);
  const [openEndPop, setOpenEndPop] = useState(false);
  const [openOneDayPop, setOpenOneDayPop] = useState(false);

  const queryClient = useQueryClient();

  const { data: policies } = useQuery({
    queryKey: ["user-leave-policies"],
    queryFn: getMyPolicies,
  });
  const requestLeaveMutation = useMutation({
    mutationFn: requestLeave,
    onSuccess: () => {
      queryClient.invalidateQueries(["user-leave-requests"]);
    },
  });

  useEffect(() => {
    if (policies) {
      setSeletedPolicy(policies[0]);
    }
  }, [policies]);

  const closeAllCalendars = () => {
    setOpenStartPop(false);
    setOpenEndPop(false);
    setOpenOneDayPop(false);
  };

  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const normalizedStartDate = new Date(startDate);
  normalizedStartDate.setHours(0, 0, 0, 0);
  const normalizedEndDate = new Date(endDate);
  normalizedEndDate.setHours(0, 0, 0, 0);

  const inclusiveDays =
    normalizedEndDate >= normalizedStartDate
      ? Math.floor((normalizedEndDate - normalizedStartDate) / MS_PER_DAY) + 1
      : 0;

  const totalLeaveDays = allDay ? inclusiveDays : 0.5;

  const handleSubmit = async () => {
    // Validation
    if (!policies || policies.length === 0) {
      alert("No leave policies available. Please contact your administrator.");
      return;
    }

    if (!selectedPolicy?._id) {
      alert("Please select a leave policy.");
      return;
    }

    if (allDay && endDate < startDate) {
      alert("End date must be on or after start date.");
      return;
    }

    // Build dateTime array
    let dateTimes = [];
    if (allDay) {
      let d = new Date(startDate);
      while (d <= endDate) {
        dateTimes.push({
          start_time: new Date(d.setHours(0, 0, 0, 0)).toISOString(),
          end_time: new Date(d.setHours(23, 59, 59, 999)).toISOString(),
        });
        d = new Date(d);
        d.setDate(d.getDate() + 1);
      }
    } else {
      const start = new Date(oneDayDate);
      const end = new Date(oneDayDate);

      if (selectedType === "afternoon") {
        start.setHours(13, 0, 0, 0);
        end.setHours(17, 0, 0, 0);
      } else {
        start.setHours(8, 0, 0, 0);
        end.setHours(12, 0, 0, 0);
      }

      dateTimes.push({
        start_time: start.toISOString(),
        end_time: end.toISOString(),
      });
    }

    // Build payload
    const payload = {
      company: policies[0]?.company || selectedPolicy?.company, // replace with actual company ID
      type: selectedPolicy?._id,
      dateTime: dateTimes,
      startDate: dateTimes[0]?.start_time,
      endDate: dateTimes[dateTimes.length - 1]?.end_time,
      totalLeave: totalLeaveDays,
      note,
    };

    requestLeaveMutation.mutate(payload, {
      onSuccess: (data) => {
        setDrawerOpen(false);
        setTimeout(() => {
          const msg = data?.message || "Successfully sent";
          setSuccessMessage(msg);
          setSuccessOpen(true);
          setTimeout(() => {
            setSuccessOpen(false);
          }, 600);
        }, 220);
      },
      onError: (err) => {
        const serverMsg =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to request leave";
        setErrorMessage(serverMsg);
        setErrorOpen(true);
      },
    });
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
            className="text-blue font-custom w-auto lg:w-42 h-10 shadow-md border border-gray-400 bg-transparent rounded-full flex items-center hover:bg-blue-500 hover:text-white transition-colors duration-200"
            onClick={() => setDrawerOpen(true)}
          >
            Request Leave
          </Button>
        </DrawerTrigger>

        <DrawerContent className="fixed inset-y-0 right-0 left-auto z-50 w-full lg:w-[420px] md:w-[480px] bg-transparent p-0 border-none outline-none h-screen max-h-screen min-h-screen">
          <DialogTitle></DialogTitle>
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
              <h2 className="text-xl leading-none">New Leave</h2>
            </div>

            {/* Body */}
            <div className="flex-1 min-h-0 overflow-y-auto space-y-4 px-5 pb-2">
              {/* Leave type */}
              <section className="bg-white rounded-md p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium whitespace-nowrap">
                    Leave Policies
                  </span>
                  <Select
                    value={selectedPolicy?._id || ""}
                    onValueChange={(id) => {
                      const policy = policies.find((p) => p._id === id);
                      setSeletedPolicy(policy);
                    }}
                  >
                    <SelectTrigger className="h-9 min-w-[120px] max-w-[180px] rounded-full text-sm">
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent
                      className="max-w-[250px] z-[100] text-custom"
                      position="popper"
                      sideOffset={5}
                    >
                      {policies && policies.length > 0 ? (
                        policies.map((policy) => (
                          <SelectItem
                            key={policy._id}
                            value={policy._id}
                            className="text-sm capitalize font-custom"
                          >
                            {policy.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-2 py-1.5 text-sm text-gray-500">
                          No leave policies available
                        </div>
                      )}
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
                      if (!v) setOneDayDate(startDate);
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
                      Total leave balance used: {totalLeaveDays} day(s)
                    </div>
                  </>
                ) : (
                  /* All day OFF -> single date + time range */
                  <>
                    <div className="mb-3">
                      <div className="text-sm font-medium mb-1">
                        Date and time
                      </div>
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
                    <div className="grid grid-cols-2 gap-3 items-center">
                      <div className="flex gap-3 w-full md:w-2/3">
                        {["morning", "afternoon"].map((type) => (
                          <div
                            key={type}
                            onClick={() => setSelectedType(type)}
                            className={`flex-1 border rounded-lg px-2 py-2 text-center transition-colors ${
                              selectedType === type
                                ? "border-blue-500 bg-blue-300"
                                : "border-gray-300"
                            } cursor-pointer`}
                          >
                            <span className="text-gray-700">
                              {type === "morning" ? "Morning" : "Afternoon"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Duration preview */}
                    <div className="mt-3 text-xs text-gray-700">
                      Total leave balance used:{" "}
                      <span className="font-semibold">0.5 day</span>
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
                    placeholder="Note"
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
                className="w-full h-11 rounded-full "
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
            Successfully Sent
          </DialogTitle>
          <Smile className="w-16 h-16 mx-auto text-green-500 mb-2" />
          <div className="text-lg text-gray-700">
            {successMessage || "Please wait for the approvals."}
          </div>
        </DialogContent>
      </Dialog>

      {/* Error dialog */}
      <Dialog open={errorOpen} onOpenChange={setErrorOpen}>
        <DialogContent className="w-[500px] text-center flex flex-col justify-center gap-3 bg-red-50 border border-red-200">
          <AlertTriangle className="w-10 h-10 mx-auto text-red-600" />
          <DialogTitle className="text-2xl font-custom text-red-700 mb-1">
            Request Failed
          </DialogTitle>
          <div className="text-base text-red-700">{errorMessage}</div>
        </DialogContent>
      </Dialog>
    </>
  );
}
