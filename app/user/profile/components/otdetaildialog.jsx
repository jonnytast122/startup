"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

const users = [
  { id: 1, name: "Doe Ibrahim" },
  { id: 2, name: "Lucy Trevo" },
  { id: 3, name: "John Mark" },
];

const AddOTDialog = ({ open, onOpenChange, profileData }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [allDay, setAllDay] = useState(false);
  const [date, setDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("18:00");
  const [note, setNote] = useState("");
  const [otTitle, setOtTitle] = useState("");
  const [otType, setOtType] = useState("");

  // initialize from profile data
  useEffect(() => {
    if (profileData) {
      setOtTitle(profileData.otTitle || "Overtime");
      setOtType(profileData.otType || "compensatory");
      setSelectedUsers(profileData.users || []);
      setAllDay(profileData.allDay || false);
      setDate(profileData.date ? new Date(profileData.date) : new Date());
      setStartDate(
        profileData.startDate ? new Date(profileData.startDate) : new Date()
      );
      setEndDate(
        profileData.endDate ? new Date(profileData.endDate) : new Date()
      );
      setStartTime(profileData.startTime || "08:00");
      setEndTime(profileData.endTime || "18:00");
      setNote(profileData.note || "");
    }
  }, [profileData]);

  const calculateHours = () => {
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);
    const start = new Date(0, 0, 0, startH, startM);
    const end = new Date(0, 0, 0, endH, endM);
    const diffMs = end - start;
    return diffMs > 0 ? (diffMs / (1000 * 60 * 60)).toFixed(2) : "0.00";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl font-custom">
        <DialogHeader className="flex flex-col items-center text-center">
          <DialogTitle></DialogTitle>
          <h1 className="font-custom text-light-gray text-2xl sm:text-lg md:text-xl lg:text-3xl py-6">
            Overtime Details
          </h1>
          <div className="w-full h-[1px] bg-[#A6A6A6]"></div>
        </DialogHeader>

        <div className="w-full flex flex-col items-center px-4 py-6">
          <div className="w-full md:w-4/5 lg:w-2/3 xl:w-1/2 space-y-6">
            {/* OT Title */}
            <div className="flex items-start gap-4">
              <label className="text-sm text-[#3F4648] w-1/3 pt-1">
                OT title:
              </label>
              <Input
                value={otTitle}
                disabled
                className="resize-none w-2/3 bg-gray-100"
              />
            </div>

            {/* OT Type */}
            <div className="flex items-start justify-between gap-4">
              <label className="text-sm text-[#3F4648] w-1/3 pt-2">
                OT type:
              </label>
              <div className="resize-none w-2/3">
                <Select value={otType} disabled>
                  <SelectTrigger className="w-48 text-gray-500 bg-gray-100">
                    <SelectValue placeholder="Select OT type" />
                  </SelectTrigger>
                  <SelectContent className="font-custom">
                    <SelectItem value="compensatory">Compensatory</SelectItem>
                    <SelectItem value="holiday">Holiday</SelectItem>
                    <SelectItem value="sick">Sick</SelectItem>
                    <SelectItem value="vacation">Vacation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Selected Users */}
            <div className="flex items-start justify-between gap-4">
              <label className="text-sm text-[#3F4648] w-1/3 pt-2">
                Users:
              </label>
              <div className="flex flex-wrap gap-2 border p-3 rounded-2xl w-2/3 bg-gray-100">
                {selectedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 flex items-center gap-2 text-sm"
                  >
                    {user.name}
                  </div>
                ))}
              </div>
            </div>

            {/* All Day */}
            <div className="flex items-center justify-between gap-4">
              <label className="text-sm text-[#3F4648] w-1/3">
                All day time off:
              </label>
              <div className="w-2/3">
                <Switch checked={allDay} disabled />
              </div>
            </div>

            {/* Dates and Times */}
            {allDay ? (
              <div className="flex items-start gap-4">
                <label className="text-sm text-[#3F4648] w-1/3 pt-2">
                  Date:
                </label>
                <div className="flex items-center gap-6 flex-wrap">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-[#3F4648]">Start:</label>
                    <Input
                      value={format(startDate, "dd/MM/yyyy")}
                      disabled
                      className="bg-gray-100"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-[#3F4648]">End:</label>
                    <Input
                      value={format(endDate, "dd/MM/yyyy")}
                      disabled
                      className="bg-gray-100"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start gap-4">
                  <label className="text-sm text-[#3F4648] w-1/3 pt-2">
                    Date:
                  </label>
                  <Input
                    value={format(date, "dd/MM/yyyy")}
                    disabled
                    className="bg-gray-100 w-2/3"
                  />
                </div>

                <div className="flex items-start gap-4">
                  <label className="text-sm text-[#3F4648] w-1/3 pt-2">
                    Time:
                  </label>
                  <div className="flex flex-wrap items-center gap-4 w-2/3">
                    <Input
                      type="time"
                      value={startTime}
                      disabled
                      className="bg-gray-100 w-[120px]"
                    />
                    <Input
                      type="time"
                      value={endTime}
                      disabled
                      className="bg-gray-100 w-[120px]"
                    />
                    <div className="text-sm font-semibold whitespace-nowrap ml-auto">
                      {calculateHours()} <span className="font-normal">hours</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Note */}
            <div className="flex items-start gap-4">
              <label className="text-sm text-[#3F4648] w-1/3 pt-1">Note:</label>
              <Textarea
                value={note}
                disabled
                className="resize-none w-2/3 bg-gray-100"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddOTDialog;
