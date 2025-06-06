import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Settings } from "lucide-react";

const SettingDialog = () => {
  const [weekStart, setWeekStart] = useState("Monday");
  const [workHourStart, setWorkHourStart] = useState("08:00");
  const [workHourEnd, setWorkHourEnd] = useState("17:00");
  const [defaultShiftLength, setDefaultShiftLength] = useState("8");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-blue font-custom w-42 h-12 border border-gray-400 bg-transparent rounded-full flex items-center gap-2 px-6 hover:bg-blue-500 hover:text-white transition-colors duration-200">
          <Settings className="w-5 h-5" />
          <span>Setting</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-auto max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-col items-center text-center">
          <DialogTitle />
          <h1 className="font-custom text-2xl sm:text-lg md:text-xl lg:text-3xl py-6">
            Schedule Setting
          </h1>
          <Separator className="bg-[#A6A6A6]" />
        </DialogHeader>

        <div className="font-custom space-y-4">
          {/* Grid container */}
          <div className="grid grid-cols-[150px_1fr] gap-x-6 gap-y-8">

            {/* --- Week Section --- */}
            <div className="font-semibold text-lg flex items-start">Week</div>
            <div className="space-y-2">
              <div className="space-y-2">
                <label className="text-sm">Week Start</label>
                <Select value={weekStart} onValueChange={setWeekStart}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm">Workhour</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={workHourStart}
                    onChange={(e) => setWorkHourStart(e.target.value)}
                    className="w-32"
                  />
                  <span>to</span>
                  <Input
                    type="time"
                    value={workHourEnd}
                    onChange={(e) => setWorkHourEnd(e.target.value)}
                    className="w-32"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm">Default shift length</label>
                <Select value={defaultShiftLength} onValueChange={setDefaultShiftLength}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select Length" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(12)].map((_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1} hour{(i + 1) > 1 && "s"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* --- User Limitation Section --- */}
            <div className="font-semibold text-lg flex items-start">User Limitation</div>
            <div className="space-y-3">
              {[
                "User can't reject a shift less than",
                "User can't un-claim a shift less than",
                "User can only check-in to a shift up to",
              ].map((label, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Checkbox />
                  <span className="whitespace-nowrap">{label}</span>
                  <div className="flex items-center gap-2 ml-auto">
                    <Input type="number" min="0" max="99" className="w-16" defaultValue={0}/>
                    <Select>
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="Minutes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minutes">Minutes</SelectItem>
                        <SelectItem value="hours">Hours</SelectItem>
                        <SelectItem value="days">Days</SelectItem>
                      </SelectContent>
                    </Select>
                    <span>before it start</span>
                  </div>
                </div>
              ))}
            </div>

            {/* --- Schedule Limitation Section --- */}
            <div className="font-semibold text-lg flex items-start">Schedule Limitation</div>
            <div className="space-y-3">
              {[
                { label: "Max work hours per user per week", unit: "hours" },
                { label: "Max member of shifts per user per week", unit: "shifts" },
                { label: "Max work hours per user per day", unit: "hours" },
                { label: "Max member of shifts per user per day", unit: "shifts" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Checkbox />
                  <span className="whitespace-nowrap">{item.label}</span>
                  <div className="flex items-center gap-2 ml-auto">
                    <Input type="number" min="0" max="99" className="w-16" defaultValue={0}/>
                    <span>{item.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Button className="hover:bg-blue-600 text-white font-custom rounded-full px-8 h-10">
              Save changes
            </Button>
          </div>
        </div>
      </DialogContent>

    </Dialog>
  );
};

export default SettingDialog;
