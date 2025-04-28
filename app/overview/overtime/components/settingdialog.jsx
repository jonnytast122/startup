import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings } from "lucide-react";

const SettingDialog = () => {
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
            <h1 className="font-custom text-light-gray text-2xl sm:text-lg md:text-xl lg:text-3xl lg:py-6">
              Editing All Employees
            </h1>
            <div className="w-full h-[1px] bg-[#A6A6A6]"></div>
          </DialogHeader>

          {/* Weeks */}
          <div className="flex flex-wrap md:flex-nowrap items-center md:mt-6 lg:mt-6 justify-center lg:justify-center">
            <label className="font-custom font-semibold text-[#3F4648] w-full md:w-1/3 lg:w-1/6 text-left mb-2 md:mb-0">
              Weeks
            </label>

            {/* Container for Clock In and Clock Out */}
            <div className="flex flex-col gap-3 w-full md:w-2/3 lg:w-1/2 xl:w-2/4">
              {/* Clock In */}
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-custom text-[#3F4648] text-sm md:text-base">
                  Week start
                </p>
                <select
                  id="type"
                  className="font-custom border border-gray-300 rounded-lg p-2 w-1/3 md:w-24 lg:w-28 text-sm"
                >
                  <option value="monday">Monday</option>
                  <option value="tuesday">Tuesday</option>
                  <option value="wednesday">Wednesday</option>
                  <option value="thursday">Thursday</option>
                  <option value="friday">Friday</option>
                  <option value="saturday">Saturday</option>
                  <option value="sunday">Sunday</option>
                </select>
              </div>

              {/* Work hours */}
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-custom text-[#3F4648] text-sm md:text-base">
                  Work hours
                </p>
                <input
                  type="time"
                  className="font-custom border border-gray-300 rounded-lg p-2 w-1/3 md:w-24 lg:w-28 text-sm"
                  step="60"
                />
                <p className="font-custom text-[#3F4648] text-sm">to</p>
                <input
                  type="time"
                  className="font-custom border border-gray-300 rounded-lg p-2 w-28 text-sm"
                  step="60"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <p className="font-custom text-[#3F4648] text-sm md:text-base">
                  Default OT length
                </p>
                <select
                  id="type"
                  className="font-custom border border-gray-300 rounded-lg p-2 w-28 text-sm"
                >
                  <option value="10 hours">10 hours</option>
                  <option value="15 hours">15 hours</option>
                </select>
              </div>
            </div>
          </div>

          {/* User Limitation */}
          <div className="flex flex-wrap md:flex-nowrap items-center md:mt-6 lg:mt-6 justify-center lg:justify-center">
            <label className="font-custom font-semibold text-[#3F4648] w-full md:w-1/3 lg:w-1/6 text-left mb-2 md:mb-0">
              User Limitation
            </label>

            {/* Container for Clock In and Clock Out */}
            <div className="flex flex-col gap-3 w-full md:w-2/3 lg:w-1/2 xl:w-2/4">
              {/* Clock In */}
              <div className="flex flex-wrap items-center gap-2">
                <Checkbox className="w-4 h-4 inline-block" />
                <p className="font-custom text-[#3F4648] text-sm md:text-base">
                  Users can't reject a shift less than
                </p>
                <input
                  id="day"
                  className="font-custom border border-gray-300 rounded-lg p-2 w-1/6 md:w-12 lg:w-14 text-sm"
                  type="number"
                  placeholder="0"
                />
                <select
                  id="type"
                  className="font-custom border border-gray-300 rounded-lg p-2 w-1/3 md:w-24 lg:w-28 text-sm"
                >
                  <option value="months">minutes</option>
                  <option value="years">hours</option>
                </select>
                <p className="font-custom text-[#3F4648] text-sm md:text-base">
                  before it starts
                </p>
              </div>

              {/* Work hours */}
              <div className="flex flex-wrap items-center gap-2">
                <Checkbox className="w-4 h-4 inline-block" />
                <p className="font-custom text-[#3F4648] text-sm md:text-base">
                  Users can't un-claim a shift less than
                </p>
                <input
                  id="day"
                  className="font-custom border border-gray-300 rounded-lg p-2 w-1/6 md:w-12 lg:w-14 text-sm"
                  type="number"
                  placeholder="0"
                />
                <select
                  id="type"
                  className="font-custom border border-gray-300 rounded-lg p-2 w-1/3 md:w-24 lg:w-28 text-sm"
                >
                  <option value="months">minutes</option>
                  <option value="years">hours</option>
                </select>
                <p className="font-custom text-[#3F4648] text-sm md:text-base">
                  before it starts
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Checkbox className="w-4 h-4 inline-block" />
                <p className="font-custom text-[#3F4648] text-sm md:text-base">
                  Users can only check-in to a shift up to
                </p>
                <input
                  id="day"
                  className="font-custom border border-gray-300 rounded-lg p-2 w-1/6 md:w-12 lg:w-14 text-sm"
                  type="number"
                  placeholder="0"
                />
                <select
                  id="type"
                  className="font-custom border border-gray-300 rounded-lg p-2 w-1/3 md:w-24 lg:w-28 text-sm"
                >
                  <option value="months">minutes</option>
                  <option value="years">hours</option>
                </select>
                <p className="font-custom text-[#3F4648] text-sm md:text-base">
                  before it starts
                </p>
              </div>
            </div>
          </div>

          {/* User Limitation */}
          <div className="flex flex-wrap md:flex-nowrap md:mt-6 lg:mt-6 items-center justify-center lg:justify-center">
            <label className="font-custom font-semibold text-[#3F4648] w-full md:w-1/3 lg:w-1/6 text-left">
              Scheduler limitations
            </label>

            {/* Container for Clock In and Clock Out */}
            <div className="flex flex-col gap-3 w-full md:w-2/3 lg:w-1/2 xl:w-2/4">
              {/* Clock In */}
              <div className="flex flex-wrap items-center gap-2">
                <Checkbox className="w-4 h-4 inline-block" />
                <p className="font-custom text-[#3F4648] text-sm md:text-base">
                  Max work hours per user per week
                </p>
                <input
                  id="day"
                  className="font-custom border border-gray-300 rounded-lg p-2 w-1/6 md:w-12 lg:w-14 text-sm"
                  type="number"
                  placeholder="0"
                />
                <p className="font-custom text-[#3F4648] text-sm md:text-base">
                  shifts
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Checkbox className="w-4 h-4 inline-block" />
                <p className="font-custom text-[#3F4648] text-sm md:text-base">
                  Max number of shifts per user per week
                </p>
                <input
                  id="day"
                  className="font-custom border border-gray-300 rounded-lg p-2 w-1/6 md:w-12 lg:w-14 text-sm"
                  type="number"
                  placeholder="0"
                />
                <p className="font-custom text-[#3F4648] text-sm md:text-base">
                  shifts
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Checkbox className="w-4 h-4 inline-block" />
                <p className="font-custom text-[#3F4648] text-sm md:text-base">
                  Max work hours per user per day
                </p>
                <input
                  id="day"
                  className="font-custom border border-gray-300 rounded-lg p-2 w-1/6 md:w-12 lg:w-14 text-sm"
                  type="number"
                  placeholder="0"
                />
                <p className="font-custom text-[#3F4648] text-sm md:text-base">
                  shifts
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Checkbox className="w-4 h-4 inline-block" />
                <p className="font-custom text-[#3F4648] text-sm md:text-base">
                  Max number of shifts per user per day
                </p>
                <input
                  id="day"
                  className="font-custom border border-gray-300 rounded-lg p-2 w-1/6 md:w-12 lg:w-14 text-sm"
                  type="number"
                  placeholder="0"
                />
                <p className="font-custom text-[#3F4648] text-sm md:text-base">
                  shifts
                </p>
              </div>
            </div>
          </div>

          <div className="w-full h-[1px] bg-[#A6A6A6] lg:mt-10"></div>
          <div className="w-full flex justify-end px-4 md:px-6 lg:px-32 lg:mt-4">
            <Button className="py-2 px-4 text-sm md:py-4 md:px-6 md:text-lg font-custom rounded-full">
              Next
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SettingDialog;
