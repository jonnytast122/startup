"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ChevronDown, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createOvertimeForEmployee } from "@/lib/api/adminOvertime";
import { fetchCompanyOverTimeSetting } from "@/lib/api/policy";
import { getEmployee } from "@/lib/api/company";

function useLocalToast() {
  const [toast, setToast] = useState(null);

  const show = (type, message) => {
    setToast({ type, message });
    window.clearTimeout(useLocalToast._tid);
    useLocalToast._tid = window.setTimeout(() => setToast(null), 3000);
  };

  const showSuccess = (message) => show("success", message);
  const showError = (message) => show("error", message);

  const ToastPortal = toast
    ? createPortal(
        <div className="fixed bottom-6 right-6 z-[1000]">
          <div
            className={`min-w-[280px] max-w-[380px] rounded-lg shadow-lg px-4 py-3 text-white flex items-start gap-3 ${
              toast.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            <div className="mt-0.5">{toast.type === "success" ? "✅" : "⚠️"}</div>
            <div className="font-custom text-sm whitespace-pre-line">{toast.message}</div>
          </div>
        </div>,
        document.body
      )
    : null;

  return { showSuccess, showError, ToastPortal };
}


const AddOTDialog = ({ open, onOpenChange, onConfirm }) => {
  const queryClient = useQueryClient();
  const company = queryClient.getQueryData(["company"]);

  const { showSuccess, showError, ToastPortal } = useLocalToast();

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedOvertimeType, setSelectedOvertimeType] = useState("");
  const [allDay, setAllDay] = useState(false);
  const [date, setDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [openSingleDatePop, setOpenSingleDatePop] = useState(false);
  const [openStartDatePop, setOpenStartDatePop] = useState(false);
  const [openEndDatePop, setOpenEndDatePop] = useState(false);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("18:00");
  const [note, setNote] = useState("");

  const { data: overtimeSettings } = useQuery({
    queryKey: ["overtimeSettings", company?.id],
    queryFn: () => fetchCompanyOverTimeSetting(company?.id),
    enabled: !!company?.id,
  });

  const { data: employees } = useQuery({
    queryKey: ["company-employees", company?.id],
    queryFn: () => getEmployee(company?.id),
    enabled: !!company?.id,
  });

  const employeeOptions = useMemo(() => {
    const raw = employees?.data ?? employees ?? [];
    console.log(raw)
    return Array.isArray(raw)
      ? raw.map((e) => ({
          id: e.id ?? e.userId ?? e._id,
          name:
            e.name||
            e.username ||
            e.email ||
            String(e.id ?? e.userId ?? e._id),
        }))
      : [];
  }, [employees]);

  const addOvertimeMutation = useMutation({
    mutationFn: createOvertimeForEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["overtime"] });
      showSuccess("Overtime created successfully");
      onOpenChange(false);
    },
    onError: (err) => {
      console.error(err);
      const msg = err?.response?.data?.message || err?.message || "Failed to add overtime";
      showError(msg);
    },
  });

  const closeAllCalendars = () => {
    setOpenStartDatePop(false);
    setOpenEndDatePop(false);
    setOpenSingleDatePop(false);
  };

  const handleToggleUser = (user) => {
    setSelectedUsers((prev) =>
      prev.some((u) => u.id === user.id)
        ? prev.filter((u) => u.id !== user.id)
        : [...prev, user]
    );
  };

  const calculateHours = () => {
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);
    const start = new Date(0, 0, 0, startH, startM);
    const end = new Date(0, 0, 0, endH, endM);
    const diffMs = end - start;
    return diffMs > 0 ? (diffMs / (1000 * 60 * 60)).toFixed(2) : "0.00";
  };

  const handleDone = () => {
    if (!selectedOvertimeType) {
      showError("Please select an overtime policy.");
      return;
    }
    if (selectedUsers.length === 0) {
      showError("Please select at least one employee.");
      return;
    }
    if (!allDay) {
      const [sh, sm] = startTime.split(":").map(Number);
      const [eh, em] = endTime.split(":").map(Number);
      if (eh * 60 + em <= sh * 60 + sm) {
        showError("End time must be after start time.");
        return;
      }
    }

    const payloadDate = format(date, "yyyy-MM-dd");
    const data = {
      overtimeType: selectedOvertimeType,
      date: payloadDate,
      startTime: allDay ? "00:00" : startTime,
      endTime: allDay ? "23:59" : endTime,
      description: note,
    };
    const employeeList = selectedUsers.map((u) => u.id);

    addOvertimeMutation.mutate({ employeeList, data });
  };

  const handleSaveDraft = () => {
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {ToastPortal}
      <DialogContent className="max-w-xl font-custom">
        <DialogHeader className="flex flex-col items-center text-center">
          <DialogTitle></DialogTitle>
          <h1 className="font-custom text-light-gray text-2xl sm:text-lg md:text-xl lg:text-3xl py-6">
            Add Overtime
          </h1>
          <div className="w-full h-[1px] bg-[#A6A6A6]"></div>
        </DialogHeader>

        <div className="w-full flex flex-col items-center px-4 py-6">
          <div className="w-full md:w-4/5 lg:w-2/3 xl:w-1/2 space-y-6">
            <div className="flex items-start gap-4">
              <label className="text-sm text-[#3F4648] w-1/3 pt-1">
                OT title:
              </label>
              <Input placeholder="Type here" className="resize-none w-2/3" />
            </div>

            <div className="flex items-start justify-between gap-4">
              <label className="text-sm text-[#3F4648] w-1/3 pt-2">
                OT type:
              </label>

              <div className="resize-none w-2/3">
                <Select value={selectedOvertimeType} onValueChange={setSelectedOvertimeType}>
                  <SelectTrigger className="w-48 text-gray-500">
                    <SelectValue placeholder="Select OT policy" />
                  </SelectTrigger>
                  <SelectContent className="font-custom">
                    {overtimeSettings?.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Select Users */}
            <div className="flex items-start justify-between gap-4">
              <label className="text-sm text-[#3F4648] w-1/3 pt-2">
                Select users:
              </label>
              <div className="flex flex-wrap gap-2 border p-3 rounded-2xl w-2/3">
                {selectedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 flex items-center gap-2 text-sm"
                  >
                    {user.name}
                    <X
                      size={14}
                      className="cursor-pointer"
                      onClick={() =>
                        setSelectedUsers((prev) =>
                          prev.filter((u) => u.id !== user.id)
                        )
                      }
                    />
                  </div>
                ))}
                <Select
                  onValueChange={(val) => {
                    const found = employeeOptions.find((u) => String(u.id) === String(val));
                    if (found) handleToggleUser(found);
                  }}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent className="font-custom">
                    {employeeOptions.map((user) => (
                      <SelectItem key={user.id} value={String(user.id)}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* All Day */}
            <div className="flex items-center justify-between gap-4">
              <label className="text-sm text-[#3F4648] w-1/3">
                All day time off:
              </label>
              <div className="w-2/3">
                <Switch checked={allDay} onCheckedChange={setAllDay} />
              </div>
            </div>

            {/* Conditional Date and Time Display */}
            {allDay ? (
              // ALL DAY = ON → Single Date only
              <div className="flex items-start gap-4">
                <label className="text-sm text-[#3F4648] w-1/3 pt-2">
                  Date:
                </label>
                <div className="w-2/3">
                  <Popover
                    modal={false}
                    open={openSingleDatePop}
                    onOpenChange={(o) => {
                      setOpenSingleDatePop(o);
                      if (o) {
                        setOpenStartDatePop(false);
                        setOpenEndDatePop(false);
                      }
                    }}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="rounded-xl px-4 py-2 text-sm w-[140px] border border-gray-300"
                      >
                        {format(date, "dd/MM/yyyy")}
                        <ChevronDown className="w-4 h-4 opacity-50 ml-2" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      side="bottom"
                      align="center"
                      sideOffset={8}
                      className="w-auto p-0 bg-white pointer-events-auto z-[80]"
                    >
                      <Calendar
                        mode="single"
                        selected={date}
                        defaultMonth={date}
                        initialFocus
                        onSelect={(d) => {
                          if (d) {
                            setDate(d);
                            setOpenSingleDatePop(false);
                          }
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            ) : (
              <>
                {/* ALL DAY = OFF → Date + Time */}
                {/* Date Row */}
                <div className="flex items-start gap-4">
                  <label className="text-sm text-[#3F4648] w-1/3 pt-2">
                    Date:
                  </label>
                  <div className="w-2/3">
                    <Popover
                      modal={false}
                      open={openSingleDatePop}
                      onOpenChange={(o) => {
                        setOpenSingleDatePop(o);
                        if (o) {
                          setOpenStartDatePop(false);
                          setOpenEndDatePop(false);
                        }
                      }}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="rounded-xl px-4 py-2 text-sm w-[140px] border border-gray-300"
                        >
                          {format(date, "dd/MM/yyyy")}
                          <ChevronDown className="w-4 h-4 opacity-50 ml-2" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        side="bottom"
                        align="center"
                        sideOffset={8}
                        className="w-auto p-0 bg-white pointer-events-auto z-[80]"
                      >
                        <Calendar
                          mode="single"
                          selected={date}
                          defaultMonth={date}
                          initialFocus
                          onSelect={(d) => {
                            if (d) {
                              setDate(d);
                              setOpenSingleDatePop(false);
                            }
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Time Row */}
                <div className="flex items-start gap-4">
                  <label className="text-sm text-[#3F4648] w-1/3 pt-2">
                    Time:
                  </label>
                  <div className="flex flex-wrap items-center gap-4 w-2/3">
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-[#3F4648]">Start:</label>
                      <Input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="rounded-full px-4 py-2 text-sm w-[120px] border border-gray-300"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-sm text-[#3F4648]">End:</label>
                      <Input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="rounded-full px-4 py-2 text-sm w-[120px] border border-gray-300"
                      />
                    </div>

                    <div className="text-sm font-semibold whitespace-nowrap ml-auto">
                      {calculateHours()}{" "}
                      <span className="font-normal">hours</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Note */}
            <div className="flex items-start gap-4">
              <label className="text-sm text-[#3F4648] w-1/3 pt-1">Note:</label>
              <Textarea
                placeholder="Type here"
                className="resize-none w-2/3"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="w-full h-[1px] bg-[#A6A6A6] mt-10"></div>
        <div className="w-full flex justify-end gap-4 px-4 md:px-6 lg:px-32 mt-4">
          <Button
            variant="outline"
            className="py-4 px-6 text-md font-custom rounded-full border border-blue-500 text-blue-500"
            onClick={handleSaveDraft}
          >
            Save Draft
          </Button>
          <Button
            className="py-4 px-6 text-md font-custom rounded-full"
            onClick={handleDone}
            disabled={addOvertimeMutation.isPending}
          >
            {addOvertimeMutation.isPending ? "Submitting..." : "Publish"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddOTDialog;
