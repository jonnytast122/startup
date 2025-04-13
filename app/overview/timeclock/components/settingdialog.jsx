import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Settings, Ellipsis } from "lucide-react";
import EditSiteDialog from "./editsitedialog";

const SettingDialog = () => {
  const [selectedDay, setSelectedDay] = useState("Sun");

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="text-blue font-custom w-42 h-12 border border-gray-400 bg-transparent rounded-full flex items-center px-6 hover:bg-blue-500 hover:text-white transition-colors duration-200">
            <Settings />
            <span>Setting</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex flex-col items-center text-center">
            <DialogTitle></DialogTitle>
            <h1 className="font-custom text-light-gray text-2xl sm:text-lg md:text-xl lg:text-3xl py-6">
              Editing All Employees
            </h1>
            <div className="w-full h-[1px] bg-[#A6A6A6]"></div>
          </DialogHeader>

          {/* Work days */}
          <div className="flex flex-wrap md:flex-nowrap items-center mt-6 justify-center lg:justify-center">
            <label className="font-custom text-[#3F4648] w-full md:w-1/3 lg:w-1/6 text-left mb-2 md:mb-0">
              Work days
            </label>

            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 w-full md:w-2/3 lg:w-1/2 xl:w-2/4">
              <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-7 gap-4 w-full">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="flex w-[80px] overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm cursor-pointer hover:bg-gray-300 transition-colors duration-200"
                    >
                      <span className="font-custom text-[#3F4648] text-xs sm:text-xs lg:text-sm text-center w-1/2 py-2 border-r border-gray-300">
                        {day}
                      </span>
                      <input
                        type="number"
                        placeholder="0"
                        min="0"
                        max="24"
                        onInput={(e) => {
                          const value = parseInt(e.target.value);
                          if (value < 0) e.target.value = 0;
                          if (value > 24) e.target.value = 24;
                        }}
                        className="font-custom text-sm text-center w-1/2 py-2 outline-none pl-2"
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Geolocation */}
          <div className="flex flex-wrap md:flex-nowrap items-start mt-6 justify-center lg:justify-center">
            <label className="font-custom text-[#3F4648] w-full md:w-1/3 lg:w-1/6 text-left mb-2 md:mb-0">
              Geolocation
            </label>

            <div className="flex flex-col gap-3 w-full md:w-2/3 lg:w-1/2 xl:w-2/4">
              <p className="font-custom text-[#3F4648] text-sm md:text-base">
                Ensure your users can clock in and out only when they’re
                physically in the work location.
              </p>

              {/* Container and Button in same row */}
              <div className="flex justify-between items-center gap-3">
                {/* Info Container */}
                <div className="flex items-center justify-between bg-gray-100 border border-gray-300 rounded-lg p-4 text-sm text-gray-700 w-full">
                  <span className="font-custom">
                    This feature uses GPS to verify employees' locations before
                    allowing them to clock in or out.
                  </span>
                  <Switch className="scale-[1.2] sm:scale-[1.0] md:scale-[1.2] lg:scale-[1.2] data-[state=checked]:bg-[#3cadfd] data-[state=checked]:border-[#3eaeff]" />
                </div>

                {/* link to EditSiteDialog */}
                <EditSiteDialog />
              </div>
            </div>
          </div>

          {/* Reminder Active on */}
          <div className="flex flex-wrap md:flex-nowrap items-center mt-6 justify-center lg:justify-center">
            {/* Label */}
            <label className="font-custom text-[#3F4648] w-full md:w-1/3 lg:w-1/6 text-left mb-2 md:mb-0">
              Reminder Active on
            </label>

            {/* Selectable Day Containers */}
            <div className="flex flex-wrap gap-2 sm:justify-start sm:w-full md:w-2/3 lg:w-1/2 xl:w-2/4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`font-custom border rounded-full w-[60px] h-[35px] flex items-center justify-center text-xs  cursor-pointer transition-colors ${
                    selectedDay === day
                      ? "bg-blue-100 border-blue-500 text-blue"
                      : "border-gray-300 bg-white text-gray-700"
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* Employee Reminder */}
          <div className="flex flex-wrap md:flex-nowrap items-center mt-6 justify-center lg:justify-center">
            <label className="font-custom text-[#3F4648] w-full md:w-1/3 lg:w-1/6 text-left mb-2 md:mb-0">
              Employee reminder
            </label>

            {/* Container for Clock In and Clock Out */}
            <div className="flex flex-col gap-3 w-full md:w-2/3 lg:w-1/2 xl:w-2/4">
              {/* Clock In */}
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                <p className="font-custom text-[#3F4648] w-full md:w-auto text-sm md:text-base">
                  Remind employees to clock in at:
                </p>
                <input
                  type="time"
                  className="font-custom border border-gray-300 rounded-lg p-2 w-full md:w-32 lg:w-36 text-sm"
                  step="60"
                />
              </div>

              {/* Clock Out */}
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                <p className="font-custom text-[#3F4648] w-full md:w-auto text-sm md:text-base">
                  Remind employees to clock out at:
                </p>
                <input
                  type="time"
                  className="font-custom border border-gray-300 rounded-lg p-2 w-full md:w-32 lg:w-36 text-sm"
                  step="60"
                />
              </div>
            </div>
          </div>
          <div className="w-full h-[1px] bg-[#A6A6A6] mt-10"></div>
          <div className="w-full flex justify-end px-4 md:px-6 lg:px-32 mt-4">
            <Button className="py-4 px-6 text-lg font-custom rounded-full">
              Next
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SettingDialog;
