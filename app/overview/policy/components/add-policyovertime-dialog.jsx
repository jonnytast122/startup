"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOvertimeSetting, updateOvertimeSetting } from "@/lib/api/policy";

const PolicyOvertime = ({ open, onClose, onSubmit, policy, isViewMode }) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const getMonthByNumber = (monthNumber) => months[monthNumber - 1] || "January";
  const getMonthNumberByName = (monthName) => months.indexOf(monthName) + 1;

  const getDayByNumber = (dayNumber) => days.includes(dayNumber) ? dayNumber : 1;

  const [policyName, setPolicyName] = useState("");
  const [overtimeLimit, setOvertimeLimit] = useState(1);
  const [multiplier, setMultiplier] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState("January");
  const [selectedDay, setSelectedDay] = useState(1);

  const queryClient = useQueryClient();
  const company = queryClient.getQueryData(["company"]);

  const createPolicyMutation = useMutation({
    mutationFn: createOvertimeSetting,
    onSuccess: () => {
      queryClient.invalidateQueries(["overtimeSettings"]);
    },
    onError: (error) => {
      console.error("Failed to create policy:", error);
    },
  });

  const updatePolicyMutation = useMutation({
    mutationFn: updateOvertimeSetting,
    onSuccess: () => {
      queryClient.invalidateQueries(["overtimeSettings"]);
    },
    onError: (error) => {
      console.error("Failed to update policy:", error);
    },
  });

  useEffect(() => {
    if (policy) {
      setPolicyName(policy?.name || "");
      setOvertimeLimit(policy?.maxHourPerMonth || 1);
      setMultiplier(policy?.multiplier || 1);
      setSelectedMonth(getMonthByNumber(policy?.startDate?.month) || "January");
      setSelectedDay(getDayByNumber(policy?.startDate?.day) || 1);
    }
  }, [policy]);

  const handleConfirm = async () => {
    if (!policyName.trim()) return;

    const newPolicy = {
      companyId: company?.id,
      name: policyName,
      status: "active",
      maxHourPerMonth: overtimeLimit,
      startDate: {
        month: getMonthNumberByName(selectedMonth),
        day: selectedDay,
      },
      multiplier: multiplier,
    };

    if(policy.id){
      updatePolicyMutation.mutate({ id: policy.id, data: newPolicy });
    } else {
      createPolicyMutation.mutate(newPolicy);
    }
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
                  onChange={(e) => setOvertimeLimit(Number(e.target.value))}
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
                  onChange={(e) => setMultiplier(Number(e.target.value))}
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
