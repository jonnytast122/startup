"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const PolicyOvertime = ({ open, onClose, onSubmit }) => {
  const [policyName, setPolicyName] = useState("");
  const [overtimeLimit, setOvertimeLimit] = useState(1);
  const [monthStart, setMonthStart] = useState(1);
  const [multiplier, setMultiplier] = useState(1);

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
    setPolicyName(""); // reset after submit
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl text-center text-gray-600">Overtime Details</DialogTitle>
          <div className="w-full h-[1px] bg-[#A6A6A6] my-4" />
        </DialogHeader>

        <div className="space-y-6 px-4">
          {/* Policy Name */}
          <div className="flex flex-wrap md:flex-nowrap items-center">
            <label className="w-full md:w-1/3 text-sm font-medium text-[#3F4648]">
              Policy name:
            </label>
            <input
              type="text"
              value={policyName}
              onChange={(e) => setPolicyName(e.target.value)}
              placeholder="Policy name"
              className="border border-gray-300 rounded-lg p-2 w-full md:w-2/3"
            />
          </div>

          {/* Overtime Limit */}
          <div className="flex flex-wrap md:flex-nowrap items-center">
            <label className="w-full md:w-1/3 text-sm font-medium text-[#3F4648]">
              Overtime limit:
            </label>
            <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-2/3">
              <p className="text-sm text-[#3F4648]">
                The amount of hour that will be used
              </p>
              <input
                type="number"
                value={overtimeLimit}
                onChange={(e) => setOvertimeLimit(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-20 text-sm"
              />
              <span className="text-sm text-[#3F4648]">hour per month</span>
            </div>
          </div>

          {/* Beginning of the month */}
          <div className="flex flex-wrap md:flex-nowrap items-center">
            <label className="w-full md:w-1/3 text-sm font-medium text-[#3F4648]">
              Beginning of the month:
            </label>
            <input
              type="number"
              min={1}
              max={31}
              value={monthStart}
              onChange={(e) => setMonthStart(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-20 text-sm"
            />
          </div>

          {/* Multiplier */}
          <div className="flex flex-wrap md:flex-nowrap items-center">
            <label className="w-full md:w-1/3 text-sm font-medium text-[#3F4648]">
              Multiplier:
            </label>
            <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-2/3">
              <p className="text-sm text-[#3F4648]">
                The amount of multiplier that will be used
              </p>
              <input
                type="number"
                value={multiplier}
                onChange={(e) => setMultiplier(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-20 text-sm"
              />
              <span className="text-sm text-[#3F4648]">time of overtime rate</span>
            </div>
          </div>

          {/* Footer */}
          <div className="w-full h-[1px] bg-[#A6A6A6] mt-6" />
          <div className="w-full flex justify-end mt-4">
            <Button
              className="py-4 px-6 text-lg font-semibold rounded-full"
              onClick={handleConfirm}
            >
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PolicyOvertime;
