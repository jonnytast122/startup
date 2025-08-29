import React, { useState } from "react";
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

const users = [
  { id: 1, name: "Doe Ibrahim" },
  { id: 2, name: "Lucy Trevo" },
  { id: 3, name: "John Mark" },
];

const AddOTDialog = ({ open, onOpenChange, onConfirm }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [allDay, setAllDay] = useState(false);
  const [date, setDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("18:00");
  const [note, setNote] = useState("");

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
    const payload = {
      users: selectedUsers,
      allDay,
      date,
      startTime,
      endTime,
      hours: calculateHours(),
      note,
    };
    onConfirm(payload);
    onOpenChange(false);
  };

  const handleSaveDraft = () => {
    // your save draft logic here
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                <Select>
                  <SelectTrigger className="w-48 text-gray-500">
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
                    const found = users.find((u) => u.name === val);
                    if (found) handleToggleUser(found);
                  }}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent className="font-custom">
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.name}>
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
              // ALL DAY = ON → Start/End Date only
              <div className="flex items-start gap-4">
                <label className="text-sm text-[#3F4648] w-1/3 pt-2">
                  Date:
                </label>
                <div className="flex items-center gap-6 flex-wrap">
                  {/* Start Date */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-[#3F4648]">Start:</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="rounded-xl px-4 py-2 text-sm w-[140px] border border-gray-300"
                        >
                          {format(startDate, "dd/MM/yyyy")}
                          <ChevronDown className="w-4 h-4 opacity-50 ml-2" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        align="start"
                        className="w-auto p-0 bg-white"
                      >
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* End Date */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-[#3F4648]">End:</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="rounded-xl px-4 py-2 text-sm w-[140px] border border-gray-300"
                        >
                          {format(endDate, "dd/MM/yyyy")}
                          <ChevronDown className="w-4 h-4 opacity-50 ml-2" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        align="start"
                        className="w-auto p-0 bg-white"
                      >
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                        />
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
                    Date:
                  </label>
                  <div className="w-2/3">
                    <Popover>
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
                        align="start"
                        className="w-auto p-0 bg-white"
                      >
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
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
          >
            Publish
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddOTDialog;
