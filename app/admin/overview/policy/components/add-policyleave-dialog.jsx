"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { createLeavePolicy, updateLeavePolicy } from "@/lib/api/policy";
import { getEmployee } from "@/lib/api/company";

const months = [
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
];

const days = Array.from({ length: 31 }, (_, i) => i + 1);

const getMonthByNumber = (monthNumber) => months[monthNumber - 1] || "January";
const getMonthNumberByName = (monthName) => months.indexOf(monthName) + 1;

const getDayByNumber = (dayNumber) =>
  days.includes(dayNumber) ? dayNumber : 1;

const PolicyLeave = ({ open, onClose, onSubmit, policy, isViewMode }) => {
  const [policyName, setPolicyName] = useState("");
  const [selectedType, setSelectedType] = useState("paid");
  const [selectedMonth, setSelectedMonth] = useState("January");
  const [days, setDays] = useState([...Array(31).keys()].map((d) => d + 1));
  const [selectedDay, setSelectedDay] = useState(1);

  const [durationType, setDurationType] = useState("month");
  const [durationValue, setDurationValue] = useState(1);
  const [timeOffValue, setTimeOffValue] = useState(1);
  const [timeOffUnit, setTimeOffUnit] = useState("day");
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const firstLevelOptions = [
    { key: "user", label: "User" },
    { key: "department", label: "Department" },
    { key: "group", label: "Group" },
    { key: "branch", label: "Branch" },
  ];

  const secondLevelData = {
    user: ["User 1", "User 2", "User 3"],
    department: ["Dept 1", "Dept 2"],
    group: ["Group 1", "Group 2"],
    branch: ["Branch 1", "Branch 2"],
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedFirstLevels, setSelectedFirstLevels] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [hoveredItem, setHoveredItem] = useState(null);

  const queryClient = useQueryClient();
  const company = queryClient.getQueryData(["company"]);

  const createPolicyMutation = useMutation({
    mutationFn: createLeavePolicy,
    onSuccess: () => {
      queryClient.invalidateQueries(["leavePolicies"]);
    },
    onError: (error) => {
      console.error("Failed to create policy:", error);
    },
  });

  const updatePolicyMutation = useMutation({
    mutationFn: updateLeavePolicy,
    onSuccess: () => {
      queryClient.invalidateQueries(["leavePolicies"]);
    },
    onError: (error) => {
      console.error("Failed to update policy:", error);
    },
  });

  const { data: employees } = useQuery({
    queryKey: ["company-employees", company?.id],
    queryFn: () => getEmployee(company?.id),
    enabled: !!company?.id,
  });

  console.log(employees);

  useEffect(() => {
    if (policy) {
      setPolicyName(policy?.name || "");
      setSelectedType(policy?.type || "paid");

      // Convert numeric month to name
      const monthNumber = policy?.startDate?.month;
      const dayNumber = policy?.startDate?.day;

      setSelectedMonth(monthNumber ? getMonthByNumber(monthNumber) : "January");
      setSelectedDay(dayNumber || 1);

      setDurationType(policy?.leaveQuota?.type || "month");
      setDurationValue(policy?.leaveQuota?.value || 1);
      setTimeOffValue(policy?.leaveNotice?.value || 1);
      setTimeOffUnit(policy?.leaveNotice?.type || "day");
      setSelectedFirstLevels(policy?.firstLevelSelection || []);
      setSelectedItems(policy?.secondLevelSelection || {});

      // Handle employee selection - ensure it's an array of IDs
      if (policy?.employee) {
        setSelectedEmployees(policy.employee);
      } else {
        setSelectedEmployees([]);
      }
    } else {
      setPolicyName("");
      setSelectedType("paid");
      setSelectedMonth("January");
      setSelectedDay(1);
      setDurationType("month");
      setTimeOffValue(1);
      setTimeOffUnit("day");
      setSelectedFirstLevels([]);
      setSelectedItems({});
      setSelectedEmployees([]);
    }
  }, [policy]);

  const handleToggleMenu = () => {
    if (!isViewMode) {
      setMenuOpen((prev) => !prev);
      setHoveredItem(null);
    }
  };

  const handleFirstLevelChange = (key) => {
    let newSelection = [];

    if (key === "all") {
      newSelection =
        selectedFirstLevels.length === firstLevelOptions.length
          ? []
          : firstLevelOptions.map((item) => item.key);
      setHoveredItem(null);
    } else {
      newSelection = selectedFirstLevels.includes(key)
        ? selectedFirstLevels.filter((k) => k !== key)
        : [...selectedFirstLevels, key];
    }
    setSelectedFirstLevels(newSelection);
  };

  const handleSecondLevelChange = (firstKey, value) => {
    setSelectedItems((prev) => {
      const existing = prev[firstKey] || [];
      const alreadyChecked = existing.includes(value);
      return {
        ...prev,
        [firstKey]: alreadyChecked
          ? existing.filter((v) => v !== value)
          : [...existing, value],
      };
    });
  };

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

  const handleEmployeeChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedEmployees(selectedOptions);
  };

  const handleConfirm = () => {
    if (!policyName.trim()) return;

    const newPolicy = {
      company: company?.id,
      name: policyName,
      status: "active",
      type: selectedType,
      startDate: {
        month: getMonthNumberByName(selectedMonth),
        day: selectedDay,
      },
      leaveQuota: {
        type: durationType,
        value: durationValue,
      },
      leaveNotice: {
        type: timeOffUnit,
        value: timeOffValue,
      },
      employee: selectedEmployees.map((emp) => emp.id), // Use the selected employee IDs
    };

    if (policy?.id) {
      updatePolicyMutation.mutate({ id: policy.id, data: newPolicy });
    } else {
      createPolicyMutation.mutate(newPolicy);
    }
    onClose();
  };

  // Check if we're in create mode (no policy provided)
  const isCreateMode = !policy;

  return (
    <Dialog open={open} onOpenChange={onClose} className="font-custom">
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl text-center font-custom">
            {isViewMode
              ? "View Leave Policy"
              : policy
              ? "Edit Leave Policy"
              : "Add Leave Policy"}
          </DialogTitle>
          <div className="w-full h-[1px] bg-[#A6A6A6] my-4" />
        </DialogHeader>

        <div className="space-y-6 font-custom">
          {/* Policy Name */}
          <div className="flex flex-wrap md:flex-nowrap items-center justify-center">
            <label className="w-full md:w-1/3 text-sm font-medium text-[#3F4648]">
              Policy Name
            </label>
            <input
              type="text"
              value={policyName}
              onChange={(e) => setPolicyName(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full md:w-2/3"
              disabled={isViewMode}
            />
          </div>

          {/* Leave Type */}
          <div className="flex flex-wrap md:flex-nowrap items-center justify-center">
            <label className="w-full md:w-1/3 text-sm font-medium text-[#3F4648]">
              Leave Type
            </label>
            <div className="flex gap-3 w-full md:w-2/3">
              {["paid", "unpaid"].map((type) => (
                <div
                  key={type}
                  onClick={() => !isViewMode && setSelectedType(type)}
                  className={`flex-1 border rounded-lg px-2 py-6 text-center transition-colors ${
                    selectedType === type
                      ? "border-blue-500 bg-blue-300"
                      : "border-gray-300"
                  } ${
                    isViewMode
                      ? "pointer-events-none opacity-60"
                      : "cursor-pointer"
                  }`}
                >
                  <span className="text-gray-700 text-xl">
                    {type === "paid" ? "Paid Leave" : "Unpaid Leave"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex flex-wrap md:flex-nowrap items-center justify-center">
            <label className="w-full md:w-1/3 text-sm font-medium text-[#3F4648]">
              Total
            </label>
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-2/3 items-center">
              <p className="text-sm text-[#3F4648]">
                The amount of hours that will be used
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={durationValue}
                  onChange={(e) => setDurationValue(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 w-20 text-sm"
                  placeholder="0"
                  disabled={isViewMode}
                />
                <span className="border border-gray-300 rounded-lg p-2 w-24 text-sm block text-center">
                  day
                </span>
                <select
                  value={durationType}
                  onChange={(e) => setDurationType(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 w-28 text-sm"
                  disabled={isViewMode}
                >
                  <option value="month">per month</option>
                  <option value="year">per year</option>
                </select>
              </div>
            </div>
          </div>

          {/* Month & Day */}
          <div className="flex flex-wrap md:flex-nowrap items-center justify-center">
            <label className="w-full md:w-1/3 text-sm font-medium text-[#3F4648]">
              Select Month & Day
            </label>
            <div className="flex gap-3 w-full md:w-2/3">
              <select
                value={selectedMonth}
                onChange={handleMonthChange}
                className="border border-gray-300 rounded-lg p-2 w-1/2"
                disabled={isViewMode}
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
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(Number(e.target.value))}
                className="border border-gray-300 rounded-lg p-2 w-1/2"
                disabled={isViewMode}
              >
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Time Off Limitation */}
          <div className="flex flex-wrap md:flex-nowrap items-center justify-center">
            <label className="w-full md:w-1/3 text-sm font-medium text-[#3F4648]">
              Time Off Limitation
            </label>
            <div className="flex flex-col md:flex-row gap-2 items-center w-full md:w-2/3">
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
                  disabled={isViewMode}
                />
                <select
                  value={timeOffUnit}
                  onChange={(e) => setTimeOffUnit(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 w-28 text-sm"
                  disabled={isViewMode}
                >
                  <option value="day">days</option>
                  <option value="minute">minutes</option>
                  <option value="hour">hours</option>
                </select>
                <p className="text-sm text-[#3F4648]">before it starts</p>
              </div>
            </div>
          </div>

          {/* Assignment - Fixed select input for employees */}
          {/* Assignment */}
          <div className="flex flex-wrap md:flex-nowrap items-start justify-center">
            <label className="w-full md:w-1/3 text-sm font-medium text-[#3F4648] mt-2">
              Assignment
            </label>

            <div className="w-full md:w-2/3">
              {employees?.length ? (
                <div className="border border-gray-300 rounded-lg p-3 bg-white max-h-40 overflow-y-auto">
                  {employees.map((emp) => {
                    const isChecked = selectedEmployees.some(
                      (e) => e.id === emp.id
                    );
                    return (
                      <label
                        key={emp.id}
                        className="flex items-center gap-2 py-1 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="rounded text-blue-600 focus:ring-blue-500"
                          checked={isChecked}
                          disabled={isViewMode}
                          onChange={() => {
                            if (isViewMode) return;
                            if (isChecked) {
                              // remove
                              setSelectedEmployees((prev) =>
                                prev.filter((e) => e.id !== emp.id)
                              );
                            } else {
                              // add
                              setSelectedEmployees((prev) => [...prev, emp]);
                            }
                          }}
                        />
                        <span className="text-sm text-gray-700">
                          {emp.name}
                        </span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <div className="text-sm text-gray-500 border border-gray-200 rounded-lg p-3 bg-gray-50">
                  No employees found
                </div>
              )}

              {/* Show selected employees */}
              {selectedEmployees.length > 0 ? (
                <div className="mt-3">
                  <div className="text-xs text-gray-600 mb-1">
                    Selected employees ({selectedEmployees.length}):
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedEmployees.map((emp, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {emp.name}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-gray-500 mt-1">
                  No employees selected yet
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="w-full h-[1px] bg-[#A6A6A6] mt-10 font-custom" />
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

export default PolicyLeave;
