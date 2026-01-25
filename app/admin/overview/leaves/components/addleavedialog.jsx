"use client";

import React, { useMemo, useState } from "react";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getEmployee } from "@/lib/api/company";
import { fetchCompanyLeavePolicy } from "@/lib/api/policy";
import { createLeaveForEmployee } from "@/lib/api/adminLeave";

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

const AddLeaveDialog = ({ open, onOpenChange, onConfirm }) => {
  const queryClient = useQueryClient();
  const company = queryClient.getQueryData(["company"]);

  const { showSuccess, showError, ToastPortal } = useLocalToast();

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedLeavePolicy, setSelectedLeavePolicy] = useState("");
  const [allDay, setAllDay] = useState(false);
  const [date, setDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("18:00");
  const [note, setNote] = useState("");
  const [openDatePop, setOpenDatePop] = useState(false);
  const [openStartDatePop, setOpenStartDatePop] = useState(false);
  const [openEndDatePop, setOpenEndDatePop] = useState(false);

  const { data: employees } = useQuery({
    queryKey: ["company-employees", company?.id],
    queryFn: () => getEmployee(company?.id),
    enabled: !!company?.id,
  });

  const { data: leavePolicies } = useQuery({
    queryKey: ["leavePolicies", company?.id],
    queryFn: () => fetchCompanyLeavePolicy(company?.id),
    enabled: !!company?.id,
  });

  const employeeOptions = useMemo(() => {
    const raw = employees?.data ?? employees ?? [];
    return Array.isArray(raw)
      ? raw.map((e) => ({
          id: e.id ?? e.userId ?? e._id,
          name:
            e.name || e.username || e.email || String(e.id ?? e.userId ?? e._id),
        }))
      : [];
  }, [employees]);

  const addLeaveMutation = useMutation({
    mutationFn: createLeaveForEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leave"] });
      showSuccess("Leave created successfully");
      onOpenChange(false);
    },
    onError: (err) => {
      console.error(err);
      const msg = err?.response?.data?.message || err?.message || "Failed to add leave";
      showError(msg);
    },
  });

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
    if (!selectedLeavePolicy) {
      showError("Please select a leave policy.");
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

    // Validate date range
    const start = allDay ? startDate : startDate;
    const end = allDay ? endDate : endDate;
    if (end < start) {
      showError("End date must be on or after start date.");
      return;
    }

    // Build dateTime array with per-day start/end ISO datetimes
    const buildDateTimeArray = () => {
      const dates = [];
      const s = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
      const e = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

      const [sh, sm] = (allDay ? "00:00" : startTime).split(":").map(Number);
      const [eh, em] = (allDay ? "23:59" : endTime).split(":").map(Number);

      for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
        const startDt = new Date(d.getFullYear(), d.getMonth(), d.getDate(), sh || 0, sm || 0, 0, 0);
        const endDt = new Date(d.getFullYear(), d.getMonth(), d.getDate(), eh || 0, em || 0, 0, 0);
        dates.push({ start_time: startDt.toISOString(), end_time: endDt.toISOString() });
      }
      return dates;
    };

    const data = {
      type: selectedLeavePolicy,
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd"),
      dateTime: buildDateTimeArray(),
      note: note,
    };
    const employeeList = selectedUsers.map((u) => u.id);

    addLeaveMutation.mutate({ employeeList, data });
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {ToastPortal}
      <DialogContent className="max-w-xl font-custom">
        <DialogHeader className="flex flex-col items-center text-center">
          <DialogTitle></DialogTitle>
          <h1 className="font-custom text-light-gray text-2xl sm:text-lg md:text-xl lg:text-3xl py-6">
            Add Leave
          </h1>
          <div className="w-full h-[1px] bg-[#A6A6A6]"></div>
        </DialogHeader>

        <div className="w-full flex flex-col items-center px-4 py-6">
          <div className="w-full md:w-4/5 lg:w-2/3 xl:w-1/2 space-y-6">
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

            <div className="flex items-start justify-between gap-4">
              <label className="text-sm text-[#3F4648] w-1/3 pt-2">
                Leave type:
              </label>

              <div className="w-2/3">
                <Select value={selectedLeavePolicy} onValueChange={setSelectedLeavePolicy}>
                  <SelectTrigger className="w-48 text-gray-500">
                    <SelectValue placeholder="Select leave policy" />
                  </SelectTrigger>
                  <SelectContent className="font-custom">
                    {leavePolicies?.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
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
              // ALL DAY = ON → Start/End Date
              <div className="flex items-start gap-4">
                <label className="text-sm text-[#3F4648] w-1/3 pt-2">
                  Date:
                </label>
                <div className="flex items-center gap-6 flex-wrap">
                  {/* Start Date */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-[#3F4648]">Start:</label>
                    <Popover modal={false} open={openStartDatePop} onOpenChange={(o)=>{
                      setOpenStartDatePop(o);
                      if(o){ setOpenEndDatePop(false); setOpenDatePop(false);} 
                    }}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="rounded-xl px-4 py-2 text-sm w-[140px] border border-gray-300">
                          {format(startDate, "dd/MM/yyyy")}
                          <ChevronDown className="w-4 h-4 opacity-50 ml-2" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent side="bottom" align="center" sideOffset={8} className="w-auto p-0 bg-white pointer-events-auto z-[80]">
                        <Calendar mode="single" selected={startDate} defaultMonth={startDate} initialFocus onSelect={(d)=>{ if(d){ setStartDate(d); setOpenStartDatePop(false);} }} />
                      </PopoverContent>
                    </Popover>
                  </div>
                  {/* End Date */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-[#3F4648]">End:</label>
                    <Popover modal={false} open={openEndDatePop} onOpenChange={(o)=>{
                      setOpenEndDatePop(o);
                      if(o){ setOpenStartDatePop(false); setOpenDatePop(false);} 
                    }}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="rounded-xl px-4 py-2 text-sm w-[140px] border border-gray-300">
                          {format(endDate, "dd/MM/yyyy")}
                          <ChevronDown className="w-4 h-4 opacity-50 ml-2" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent side="bottom" align="end" alignOffset={-16} sideOffset={8} className="w-auto p-0 bg-white pointer-events-auto z-[80]">
                        <Calendar mode="single" selected={endDate} defaultMonth={endDate} initialFocus onSelect={(d)=>{ if(d){ setEndDate(d); setOpenEndDatePop(false);} }} />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* ALL DAY = OFF → Date + Time */}
                {/* Date Row */}
                <div className="flex items-start gap-4">
                  <label className="text-sm text-[#3F4648] w-1/3 pt-2">
                    Start date:
                  </label>
                  <div className="w-2/3">
                    <Popover modal={false} open={openStartDatePop} onOpenChange={(o)=>{ setOpenStartDatePop(o); if(o){ setOpenEndDatePop(false); } }}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="rounded-xl px-4 py-2 text-sm w-[140px] border border-gray-300"
                        >
                          {format(startDate, "dd/MM/yyyy")}
                          <ChevronDown className="w-4 h-4 opacity-50 ml-2" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent side="bottom" align="center" sideOffset={8} className="w-auto p-0 bg-white pointer-events-auto z-[80]">
                        <Calendar mode="single" selected={startDate} defaultMonth={startDate} initialFocus onSelect={(d)=>{ if(d){ setStartDate(d); setOpenStartDatePop(false);} }} />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* End Date Row */}
                <div className="flex items-start gap-4">
                  <label className="text-sm text-[#3F4648] w-1/3 pt-2">
                    End date:
                  </label>
                  <div className="w-2/3">
                    <Popover modal={false} open={openEndDatePop} onOpenChange={(o)=>{ setOpenEndDatePop(o); if(o){ setOpenStartDatePop(false); } }}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="rounded-xl px-4 py-2 text-sm w-[140px] border border-gray-300"
                        >
                          {format(endDate, "dd/MM/yyyy")}
                          <ChevronDown className="w-4 h-4 opacity-50 ml-2" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent side="bottom" align="center" sideOffset={8} className="w-auto p-0 bg-white pointer-events-auto z-[80]">
                        <Calendar mode="single" selected={endDate} defaultMonth={endDate} initialFocus onSelect={(d)=>{ if(d){ setEndDate(d); setOpenEndDatePop(false);} }} />
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
        <div className="w-full flex justify-end px-4 md:px-6 lg:px-32 mt-4">
          <Button
            className="py-4 px-6 text-lg font-custom rounded-full"
            onClick={handleDone}
          >
            Publish
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddLeaveDialog;
