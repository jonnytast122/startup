"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const LeaveDetailDialog = ({
  open,
  onOpenChange,
  onClose,
  policy,
  profileData, // ⬅️ pass from profile.jsx
}) => {
  const [policyName, setPolicyName] = useState("");
  const [selectedType, setSelectedType] = useState("paid");
  const [selectedMonth, setSelectedMonth] = useState("January");
  const [days] = useState([...Array(31).keys()].map((d) => d + 1));
  const [selectedDay, setSelectedDay] = useState(1);
  const [durationType, setDurationType] = useState("month");
  const [timeOffValue, setTimeOffValue] = useState("");
  const [timeOffUnit, setTimeOffUnit] = useState("days");

  useEffect(() => {
    if (policy) {
      setPolicyName(policy.name || "");
      setSelectedType(policy.type || "paid");
      setSelectedMonth(policy.month || "January");
      setSelectedDay(policy.day || 1);
      setDurationType(policy.durationType || "month");
      setTimeOffValue(policy.timeOffValue || "");
      setTimeOffUnit(policy.timeOffUnit || "days");
    } else if (profileData) {
      setPolicyName(profileData.policyName || "Annual Leave");
      setSelectedType(profileData.leaveType || "paid");
      setSelectedMonth(profileData.leaveMonth || "January");
      setSelectedDay(profileData.leaveDay || 1);
      setDurationType(profileData.durationType || "month");
      setTimeOffValue(profileData.timeOffValue || "2");
      setTimeOffUnit(profileData.timeOffUnit || "days");
    }
  }, [policy, profileData]);

  const safeSetOpen = (isOpen) => {
    if (typeof onOpenChange === "function") onOpenChange(isOpen);
    else if (!isOpen && typeof onClose === "function") onClose();
  };

  return (
    <Dialog open={open} onOpenChange={safeSetOpen}>
      <DialogContent
        className="max-w-full sm:max-w-2xl font-custom [&>button:last-child]:hidden"
        onEscapeKeyDown={() => safeSetOpen(false)}
        onPointerDownOutside={() => safeSetOpen(false)}
      >
        <DialogHeader className="flex flex-col items-center text-center">
          <DialogTitle />
          <h1 className="font-custom text-light-gray text-2xl sm:text-lg md:text-xl lg:text-3xl py-6">
            Leave Details
          </h1>
          <div className="w-full h-[1px] bg-[#A6A6A6]" />
        </DialogHeader>

        {/* 🔹 Form content */}
        <div className="w-full flex flex-col items-center px-4 py-6">
          <div className="w-full md:w-4/5 lg:w-2/3 xl:w-1/2 space-y-6">
            {/* Policy Name */}
            <div className="flex flex-wrap md:flex-nowrap items-center">
              <label className="w-full md:w-1/3 text-sm text-[#3F4648]">
                Policy Name
              </label>
              <input
                type="text"
                value={policyName}
                className="border border-gray-300 rounded-lg p-2 w-full md:w-2/3 bg-gray-100"
                disabled
              />
            </div>

            {/* Leave Type */}
            <div className="flex flex-wrap md:flex-nowrap items-center">
              <label className="w-full md:w-1/3 text-sm text-[#3F4648]">
                Leave Type
              </label>
              <div className="flex gap-3 w-full md:w-2/3">
                {["paid", "unpaid"].map((type) => (
                  <div
                    key={type}
                    className={`flex-1 border rounded-lg text-center px-3 py-3 sm:py-4 md:py-6 lg:py-8
                      ${selectedType === type ? "border-blue-500 bg-blue-300" : "border-gray-300"}
                      pointer-events-none opacity-60`}
                  >
                    <span className="text-gray-700 text-sm sm:text-base md:text-lg lg:text-xl">
                      {type === "paid" ? "Paid Leave" : "Unpaid Leave"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="flex flex-wrap md:flex-nowrap items-center">
              <label className="w-full md:w-1/3 text-sm text-[#3F4648]">
                Total
              </label>
              <div className="flex flex-col md:flex-row gap-2 w-full md:w-2/3">
                <p className="text-sm text-[#3F4648]">
                  The amount of hours that will be used
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={timeOffValue}
                    className="border border-gray-300 rounded-lg p-2 w-20 text-sm bg-gray-100"
                    disabled
                  />
                  <span className="border border-gray-300 rounded-lg p-2 w-24 text-sm block text-center">
                    days
                  </span>
                  <select
                    value={durationType}
                    className="border border-gray-300 rounded-lg p-2 w-28 text-sm bg-gray-100"
                    disabled
                  >
                    <option value="month">per month</option>
                    <option value="year">per year</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Month & Day */}
            <div className="flex flex-wrap md:flex-nowrap items-center">
              <label className="w-full md:w-1/3 text-sm text-[#3F4648]">
                Select Month & Day
              </label>
              <div className="flex gap-3 w-full md:w-2/3">
                <select
                  value={selectedMonth}
                  className="border border-gray-300 rounded-lg p-2 w-1/2 bg-gray-100"
                  disabled
                >
                  {[
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ].map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedDay}
                  className="border border-gray-300 rounded-lg p-2 w-1/2 bg-gray-100"
                  disabled
                >
                  {days.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Time Off Limitation */}
            <div className="flex flex-wrap md:flex-nowrap items-center">
              <label className="w-full md:w-1/3 text-sm text-[#3F4648]">
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
                    className="border border-gray-300 rounded-lg p-2 w-20 text-sm bg-gray-100"
                    disabled
                  />
                  <select
                    value={timeOffUnit}
                    className="border border-gray-300 rounded-lg p-2 w-28 text-sm bg-gray-100"
                    disabled
                  >
                    <option value="days">days</option>
                    <option value="minutes">minutes</option>
                    <option value="hours">hours</option>
                  </select>
                  <p className="text-sm text-[#3F4648]">before it starts</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 🔹 Save button removed */}
      </DialogContent>
    </Dialog>
  );
};

export default LeaveDetailDialog;
