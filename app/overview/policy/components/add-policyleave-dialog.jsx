"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const PolicyLeave = ({ open, onClose, onSubmit }) => {
  const [policyName, setPolicyName] = useState("");
  const [selectedType, setSelectedType] = useState("paid");
  const [selectedMonth, setSelectedMonth] = useState("January");
  const [days, setDays] = useState([...Array(31).keys()].map((d) => d + 1));
  const [unit, setUnit] = useState("days");
  const [durationType, setDurationType] = useState("month");
  const [timeOffValue, setTimeOffValue] = useState("");
  const [timeOffUnit, setTimeOffUnit] = useState("days");
  const [assignment, setAssignment] = useState("all");

  const handleMonthChange = (e) => {
    const month = e.target.value;
    setSelectedMonth(month);

    const daysInMonth = {
      January: 31, February: 28, March: 31, April: 30, May: 31,
      June: 30, July: 31, August: 31, September: 30,
      October: 31, November: 30, December: 31,
    };

    setDays([...Array(daysInMonth[month]).keys()].map((d) => d + 1));
  };

  const handleConfirm = () => {
    if (!policyName.trim()) return;

    const newPolicy = {
      id: Date.now(),
      name: policyName,
      status: "Active",
      createdBy: "Admin",
      createdByProfilePic: "/path/to/profile-default.jpg",
    };

    onSubmit(newPolicy);
    onClose();
    setPolicyName(""); // reset for reuse
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl text-center">Leave Details</DialogTitle>
          <div className="w-full h-[1px] bg-[#A6A6A6] my-4" />
        </DialogHeader>

        <div className="space-y-6">
          {/* Policy Name */}
          <div className="flex flex-wrap md:flex-nowrap items-center justify-center">
            <label className="w-full md:w-1/3 text-sm font-medium text-[#3F4648] mb-2 md:mb-0">
              Policy Name
            </label>
            <input
              type="text"
              value={policyName}
              onChange={(e) => setPolicyName(e.target.value)}
              placeholder="Policy Name"
              className="border border-gray-300 rounded-lg p-2 w-full md:w-2/3"
            />
          </div>

          {/* Leave Type */}
          <div className="flex flex-wrap md:flex-nowrap items-center justify-center">
            <label className="w-full md:w-1/3 text-sm font-medium text-[#3F4648] mb-2 md:mb-0">
              Leave Type
            </label>
            <div className="flex gap-3 w-full md:w-2/3">
              {["paid", "unpaid"].map((type) => (
                <div
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`flex-1 border rounded-lg px-6 py-3 cursor-pointer transition-colors ${selectedType === type ? "border-blue-500" : "border-gray-300"
                    }`}
                >
                  <span className="text-gray-700 text-base">
                    {type === "paid" ? "Paid Leave" : "Unpaid Leave"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total per Duration */}
          <div className="flex flex-wrap md:flex-nowrap items-center justify-center">
            <label className="w-full md:w-1/3 text-sm font-medium text-[#3F4648] mb-2 md:mb-0">
              Total
            </label>
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-2/3">
              <p className="text-sm text-[#3F4648]">
                The amount of hours that will be used
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="border border-gray-300 rounded-lg p-2 w-20 text-sm"
                  placeholder="0"
                />
                <span className="border border-gray-300 rounded-lg p-2 w-24 text-sm block text-center">
                  days
                </span>
                <select
                  value={durationType}
                  onChange={(e) => setDurationType(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 w-28 text-sm"
                >
                  <option value="month">per month</option>
                  <option value="year">per year</option>
                </select>
              </div>
            </div>
          </div>

          {/* Month & Day */}
          <div className="flex flex-wrap md:flex-nowrap items-center justify-center">
            <label className="w-full md:w-1/3 text-sm font-medium text-[#3F4648] mb-2 md:mb-0">
              Select Month & Day
            </label>
            <div className="flex gap-3 w-full md:w-2/3">
              <select
                value={selectedMonth}
                onChange={handleMonthChange}
                className="border border-gray-300 rounded-lg p-2 w-1/2"
              >
                {Object.keys({
                  January: 31, February: 28, March: 31, April: 30, May: 31,
                  June: 30, July: 31, August: 31, September: 30,
                  October: 31, November: 30, December: 31,
                }).map((month) => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
              <select className="border border-gray-300 rounded-lg p-2 w-1/2">
                {days.map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Time Off Limitation */}
          <div className="flex flex-wrap md:flex-nowrap items-center justify-center">
            <label className="w-full md:w-1/3 text-sm font-medium text-[#3F4648] mb-2 md:mb-0">
              Time Off Limitation
            </label>
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-2/3">
              <p className="text-sm text-[#3F4648]">
                A leave can be requested no less than
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={timeOffValue}
                  onChange={(e) => setTimeOffValue(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 w-20 text-sm"
                  placeholder="0"
                />
                <select
                  value={timeOffUnit}
                  onChange={(e) => setTimeOffUnit(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 w-28 text-sm"
                >
                  <option value="days">days</option>
                  <option value="minutes">minutes</option>
                  <option value="hours">hours</option>
                </select>
                <p className="text-sm text-[#3F4648]">before it starts</p>
              </div>
            </div>
          </div>

          {/* Assignment */}
          <div className="flex flex-wrap md:flex-nowrap items-center justify-center">
            <label className="w-full md:w-1/3 text-sm font-medium text-[#3F4648] mb-2 md:mb-0">
              Assignment
            </label>
            <div className="w-full md:w-2/3">
              <select
                value={assignment}
                onChange={(e) => setAssignment(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full text-sm"
              >
                <option value="all">All</option>
                <option value="user">User</option>
                <option value="department">Department</option>
                <option value="group">Group</option>
                <option value="branch">Branch</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="w-full h-[1px] bg-[#A6A6A6] mt-10" />
          <div className="w-full flex justify-end mt-4">
            <Button
              className="py-4 px-6 text-lg font-semibold rounded-full"
              onClick={handleConfirm}
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PolicyLeave;
