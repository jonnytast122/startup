"use client";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Users, Check, ChevronDown } from "lucide-react";
import { useState } from "react";

const assignOptions = {
  User: ["User1", "User2", "User3"],
  Group: ["Group A", "Group B"],
  Department: ["HR", "IT", "Marketing"],
  Branch: ["Phnom Penh", "Siem Reap"],
};


const colorOptions = [
  { value: "blue", colorClass: "bg-blue-500" },
  { value: "red", colorClass: "bg-red-500" },
];

export default function EventDialog({ date, onClose, onSave }) {
  const [leavePolicy, setLeavePolicy] = useState("");
  const [overtimePolicy, setOvertimePolicy] = useState("");
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("13:00");
  const [end, setEnd] = useState("13:00");
  const [assignType, setAssignType] = useState("User");
  const [selectedItems, setSelectedItems] = useState([]);
  const [requireClockIn, setRequireClockIn] = useState(false);
  const [selectedColor, setSelectedColor] = useState("blue"); // ✅ default is blue

  const toggleItem = (item) => {
    setSelectedItems((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  const handleSubmit = () => {
    onSave({
      name: title,
      date,
      start,
      end,
      assignType,
      selectedItems,
      requireClockIn,
      color: selectedColor,
    });
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="w-[380px] space-y-4">
        {/* Title + Markdown Button */}
        <div className="flex items-center justify-between gap-2">
          <input
            placeholder="Event Title"
            className="w-full px-0 py-2 outline-none font-custom text-sm bg-transparent"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Markdown color circle + icon button */}
          <Popover>
            <PopoverTrigger asChild>
              <div className="flex items-center justify-between px-3 py-2 bg-white shadow-sm rounded-md cursor-pointer w-fit">
                <div
                  className={`w-4 h-4 rounded-full ${selectedColor === "blue" ? "bg-blue-500" : "bg-red-500"
                    }`}
                />
                <ChevronDown size={14} className="text-gray-400 ml-2" />
              </div>
            </PopoverTrigger>

            <PopoverContent className="w-fit p-2 bg-white">
              <div className="flex flex-col gap-2">
                {colorOptions.map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => setSelectedColor(opt.value)}
                    className={`w-5 h-5 mr-6 rounded-full cursor-pointer border-2 hover:scale-105 transition ${selectedColor === opt.value
                      ? `${opt.colorClass} border-gray-300`
                      : `${opt.colorClass} border-transparent`
                      }`}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Time range row */}
        <div className="flex border rounded-md overflow-hidden">
          <div className="flex items-center w-1/2 px-3 py-2 gap-2 border-r">
            <span className="text-sm text-gray-500">Start</span>
            <input
              type="time"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="text-sm w-full bg-transparent outline-none"
            />
          </div>
          <div className="flex items-center w-1/2 px-3 py-2 gap-2">
            <span className="text-sm text-gray-500">End</span>
            <input
              type="time"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="text-sm w-full bg-transparent outline-none"
            />
          </div>
        </div>

        {/* Assignment */}
        <Popover>
          <PopoverTrigger asChild>
            <div className="flex items-center justify-between px-3 py-2 border rounded-md cursor-pointer">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-gray-500" />
                <span className="text-sm">Assign</span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={assignType}
                  onChange={(e) => {
                    setAssignType(e.target.value);
                    setSelectedItems([]);
                  }}
                  className="text-sm border-none bg-blue-50 text-blue-500 px-2 py-1 rounded-md"
                >
                  {Object.keys(assignOptions).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <span className="text-xs text-gray-400">
                  {selectedItems.length} selected
                </span>
              </div>
            </div>
          </PopoverTrigger>

          <PopoverContent className="p-2 w-[180px] bg-white">
            <ScrollArea className="h-[150px] pr-2 ">
              {assignOptions[assignType].map((item) => (
                <div
                  key={item}
                  onClick={() => toggleItem(item)}
                  className={`flex items-center justify-between text-sm px-2 py-1 rounded cursor-pointer ${selectedItems.includes(item)
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-gray-100"
                    }`}
                >
                  {item}
                  {selectedItems.includes(item) && <Check size={14} />}
                </div>
              ))}
            </ScrollArea>
          </PopoverContent>
        </Popover>

        {/* Clock in switch */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-blue-500 font-medium">Require Clock In</span>
          <Switch
            checked={requireClockIn}
            onCheckedChange={setRequireClockIn}
            className="data-[state=checked]:bg-green-500"
          />
        </div>

        {/* Conditional Leave/Overtime Options */}
        {requireClockIn && (
          <div className="flex gap-4">
            {/* Leave Policy */}
            <div className="w-1/2">
              <span className="text-xs text-gray-500">Leave Policy</span>
              <select
                value={leavePolicy}
                onChange={(e) => setLeavePolicy(e.target.value)}
                className="w-full mt-1 text-sm border border-gray-300 rounded-md px-2 py-1"
              >
                <option value="">Select</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Annual Leave">Annual Leave</option>
              </select>
            </div>

            {/* Overtime Policy */}
            <div className="w-1/2">
              <span className="text-xs text-gray-500">Overtime Policy</span>
              <select
                value={overtimePolicy}
                onChange={(e) => setOvertimePolicy(e.target.value)}
                className="w-full mt-1 text-sm border border-gray-300 rounded-md px-2 py-1"
              >
                <option value="">Select</option>
                <option value="Morning">Morning</option>
                <option value="Weekend">Weekend</option>
              </select>
            </div>
          </div>
        )}


        {/* Confirm Button */}
        <div className="text-right">
          <Button
            onClick={handleSubmit}
            className="h-8 px-5 text-sm rounded-md"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
