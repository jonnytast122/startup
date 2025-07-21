"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const PolicyOvertime = ({ open, onClose, onSubmit, policy, isViewMode }) => {
  const [policyName, setPolicyName] = useState("");
  const [overtimeLimit, setOvertimeLimit] = useState(policy?.overtimeLimit || 1);
  const [monthStart, setMonthStart] = useState(policy?.monthStart || 1);
  const [multiplier, setMultiplier] = useState(policy?.multiplier || 1);
  const [selectedMonth, setSelectedMonth] = useState(policy?.selectedMonth || "January");
  const [selectedDay, setSelectedDay] = useState(policy?.selectedDay || 1);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  useEffect(() => {
    if (policy) {
      setPolicyName(policy.name || "");
    }
  }, [policy]);

  const handleConfirm = () => {
    if (!policyName.trim()) return;
    const newPolicy = {
      ...policy,
      id: policy?.id ?? Date.now(),
      name: policyName,
      status: "Active",
      createdBy: "Admin",
      createdByProfilePic: "/path/to/profile-default.jpg",
    };
    onSubmit(newPolicy);
    onClose();
  };

  const getOrdinal = (n) => {
    if (n === 1) return "st";
    if (n === 2) return "nd";
    if (n === 3) return "rd";
    return "th";
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl text-center text-gray-600">
            {isViewMode ? "View Overtime Policy" : "Overtime Details"}
          </DialogTitle>
          <div className="w-full h-[1px] bg-[#A6A6A6] my-4" />
        </DialogHeader>

        <div className={`space-y-6 px-4 ${isViewMode ? "pointer-events-none opacity-60" : ""}`}>
          {/* Policy Name */}
          <div className="flex flex-wrap md:flex-nowrap items-center">
            <label className="w-full md:w-1/3 text-sm font-medium text-[#3F4648]">Policy name:</label>
            <input
              type="text"
              value={policyName}
              onChange={(e) => setPolicyName(e.target.value)}
              placeholder="Policy name"
              className="border border-gray-300 rounded-lg p-2 w-full md:w-2/3"
              disabled={isViewMode}
            />
          </div>

          {/* Overtime Limit */}
          <div className="flex flex-wrap md:flex-nowrap items-center">
            <label className="w-full md:w-1/3 text-sm font-medium text-[#3F4648]">Overtime limit:</label>
            <div className="flex flex-col md:flex-row items-start gap-2 w-full md:w-2/3">
              <p className="text-sm text-[#3F4648]">
                The amount of hour that will be used
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={overtimeLimit}
                  onChange={(e) => setOvertimeLimit(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 w-20 text-sm"
                  disabled={isViewMode}
                />
                <span className="text-sm text-[#3F4648]">hour per month</span>
              </div>
            </div>
          </div>

          {/* Month & Day */}
          <div className="flex flex-wrap md:flex-nowrap items-center gap-4">
            <label className="w-full md:w-1/3 text-sm font-medium text-[#3F4648]">Beginning of the month:</label>
            <div className="flex gap-3">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="border border-gray-300 rounded-lg py-2 px-3 w-40"
                disabled={isViewMode}
              >
                {months.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>

              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(Number(e.target.value))}
                className="border border-gray-300 rounded-lg p-2 w-32"
                disabled={isViewMode}
              >
                {days.map((d) => (
                  <option key={d} value={d}>
                    {d}{getOrdinal(d)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Multiplier */}
          <div className="flex flex-wrap md:flex-nowrap items-center">
            <label className="w-full md:w-1/3 text-sm font-medium text-[#3F4648]">Multiplier:</label>
            <div className="flex flex-col md:flex-row items-start gap-2 w-full md:w-2/3">
              <p className="text-sm text-[#3F4648]">
                The amount of multiplier that will be used
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={multiplier}
                  onChange={(e) => setMultiplier(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 w-20 text-sm"
                  disabled={isViewMode}
                />
                <span className="text-sm text-[#3F4648]">time of overtime rate</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="w-full h-[1px] bg-[#A6A6A6] mt-6" />
          {!isViewMode && (
            <div className="w-full flex justify-end mt-4">
              <Button
                className="py-4 px-6 text-lg font-semibold rounded-full"
                onClick={handleConfirm}
              >
                Save
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PolicyOvertime;
