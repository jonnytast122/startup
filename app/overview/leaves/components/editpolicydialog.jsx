import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const EditPolicyDialog = ({ onClose }) => {
  const [selected, setSelected] = useState("choice1");

  const [selectedMonth, setSelectedMonth] = useState("January");
  const [days, setDays] = useState([...Array(31).keys()].map((d) => d + 1));

  const handleMonthChange = (e) => {
    const month = e.target.value;
    setSelectedMonth(month);

    const daysInMonth = {
      January: 31,
      February: 28,
      March: 31,
      April: 30,
      May: 31,
      June: 30,
      July: 31,
      August: 31,
      September: 30,
      October: 31,
      November: 30,
      December: 31,
    };

    setDays([...Array(daysInMonth[month]).keys()].map((d) => d + 1));
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center text-center">
          <DialogTitle></DialogTitle>
          <h1 className="font-custom text-light-gray text-2xl sm:text-lg md:text-xl lg:text-3xl py-6">
            Editing All Employees
          </h1>
          <div className="w-full h-[1px] bg-[#A6A6A6]"></div>
        </DialogHeader>
        <div>
          {/* Company Name */}
          <div className="flex flex-wrap md:flex-nowrap items-center mt-6 justify-center lg:justify-center">
            <label className="font-custom text-[#3F4648] w-full md:w-1/3 lg:w-1/6 text-left mb-2 md:mb-0">
              Policy Name
            </label>
            <input
              id="policy-name"
              type="text"
              placeholder="Policy Name"
              className="font-custom border border-gray-300 rounded-lg p-2 w-full md:w-2/3 lg:w-1/2 xl:w-2/4"
            />
          </div>

          <div className="flex flex-wrap md:flex-nowrap items-center mt-6 justify-center lg:justify-center">
            {/* Label */}
            <label className="font-custom text-[#3F4648] w-full md:w-1/3 lg:w-1/6 text-left mb-2 md:mb-0">
              Choose an Option
            </label>

            {/* Selectable Containers */}
            <div className="flex items-center w-full md:w-2/3 lg:w-1/2 xl:w-2/4 gap-3">
              {/* Choice 1 */}
              <div
                onClick={() => setSelected("choice1")}
                className={`flex flex-col items-start font-custom border rounded-lg px-6 py-3 cursor-pointer w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 transition-colors ${
                  selected === "choice1" ? "border-blue-500" : "border-gray-300"
                }`}
              >
                <span className="text-gray-700 sm:text-lg md:text-md lg:text-lg xl:text-xl">
                  Fixed amount
                </span>
                <span className="text-[#5494DA] text-[0.625rem] sm:text-xs md:text-xs lg:text-xs xl:text-xs">
                  e.g. 150 hours per month
                </span>
              </div>

              {/* Choice 2 */}
              <div
                onClick={() => setSelected("choice2")}
                className={`flex flex-col items-start font-custom border rounded-lg px-6 py-3 cursor-pointer w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 transition-colors ${
                  selected === "choice2" ? "border-blue-500" : "border-gray-300"
                }`}
              >
                <span className="text-gray-700 sm:text-lg md:text-md lg:text-lg xl:text-xl">
                  Earned per hour
                </span>
                <span className="text-[#5494DA] text-[0.625rem] sm:text-xs md:text-xs lg:text-xs xl:text-xs">
                  e.g. 1 hour earned per 15 hours worked
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap md:flex-nowrap items-center mt-6 justify-center lg:justify-center">
            <label className="font-custom text-[#3F4648] w-full md:w-1/3 lg:w-1/6 text-left mb-2 md:mb-0">
              Total per month
            </label>
            {/* Container for text, input, select, and per month */}
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 w-full md:w-2/3 lg:w-1/2 xl:w-2/4">
              <p className="font-custom text-[#3F4648] w-full md:w-auto text-sm md:text-base">
                The amount of hours that will be earned each year
              </p>
              {/* Input, Select, and 'per month' in one row */}
              <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
                <input
                  id="day"
                  className="font-custom border border-gray-300 rounded-lg p-2 w-1/3 md:w-20 lg:w-24 text-sm"
                  type="number"
                  placeholder="0"
                />
                <select
                  id="type"
                  className="font-custom border border-gray-300 rounded-lg p-2 w-1/3 md:w-24 lg:w-28 text-sm"
                >
                  <option value="days">days</option>
                  <option value="months">minutes</option>
                  <option value="years">hours</option>
                </select>
                <p className="font-custom text-[#3F4648] text-sm md:text-base">
                  per month
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap md:flex-nowrap items-center mt-6 justify-center lg:justify-center">
            <label className="font-custom text-[#3F4648] w-full md:w-1/3 lg:w-1/6 text-left mb-2 md:mb-0">
              Select Month & Day
            </label>
            <div className="flex items-center w-full md:w-2/3 lg:w-1/2 xl:w-2/4 gap-3">
              {/* Month Dropdown */}
              <select
                className="font-custom border border-gray-300 rounded-lg p-2 w-1/3 md:w-1/4 lg:w-1/6"
                value={selectedMonth}
                onChange={handleMonthChange}
              >
                {Object.keys({
                  January: 31,
                  February: 28,
                  March: 31,
                  April: 30,
                  May: 31,
                  June: 30,
                  July: 31,
                  August: 31,
                  September: 30,
                  October: 31,
                  November: 30,
                  December: 31,
                }).map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>

              {/* Day Dropdown */}
              <select className="font-custom border border-gray-300 rounded-lg p-2 w-1/3 md:w-1/4 lg:w-1/6">
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap md:flex-nowrap items-center mt-6 justify-center lg:justify-center">
            <label className="font-custom text-[#3F4648] w-full md:w-1/3 lg:w-1/6 text-left mb-2 md:mb-0">
              Time off limitation
            </label>
            {/* Container for text, input, select, and per month */}
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 w-full md:w-2/3 lg:w-1/2 xl:w-2/4">
              <p className="font-custom text-[#3F4648] w-full md:w-auto text-sm md:text-base">
                A time off can be requested no less than
              </p>
              {/* Input, Select, and 'per month' in one row */}
              <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
              <input
                  id="day"
                  className="font-custom border border-gray-300 rounded-lg p-2 w-1/3 md:w-20 lg:w-24 text-sm"
                  type="number"
                  placeholder="0"
                />
                <select
                  id="type"
                  className="font-custom border border-gray-300 rounded-lg p-2 w-1/3 md:w-24 lg:w-28 text-sm"
                >
                  <option value="days">days</option>
                  <option value="months">minutes</option>
                  <option value="years">hours</option>
                </select>
                <p className="font-custom text-[#3F4648] text-sm md:text-base">
                  before it starts
                </p>
              </div>
            </div>
          </div>
          <div className="w-full h-[1px] bg-[#A6A6A6] mt-10"></div>
          <div className="w-full flex justify-end px-4 md:px-6 lg:px-32 mt-4">
            <Button className="py-4 px-6 text-lg font-custom rounded-full">
              Next
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPolicyDialog;
