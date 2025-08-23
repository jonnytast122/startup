"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const LeaveDetailDialog = ({
  open,
  onOpenChange, // preferred: (isOpen:boolean) => void
  onClose, // fallback: () => void
  onSubmit,
  policy,
  isViewMode,
}) => {
  const [policyName, setPolicyName] = useState("");
  const [selectedType, setSelectedType] = useState("paid");
  const [selectedMonth, setSelectedMonth] = useState("January");
  const [days, setDays] = useState([...Array(31).keys()].map((d) => d + 1));
  const [selectedDay, setSelectedDay] = useState(1);
  const [durationType, setDurationType] = useState("month");
  const [timeOffValue, setTimeOffValue] = useState("");
  const [timeOffUnit, setTimeOffUnit] = useState("days");

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

  useEffect(() => {
    if (policy) {
      setPolicyName(policy.name || "");
    } else {
      setPolicyName("");
      setSelectedType("paid");
      setSelectedMonth("January");
      setSelectedDay(1);
      setDurationType("month");
      setTimeOffValue("");
      setTimeOffUnit("days");
      setSelectedFirstLevels([]);
      setSelectedItems({});
    }
  }, [policy]);

  const safeSetOpen = (isOpen) => {
    if (typeof onOpenChange === "function") onOpenChange(isOpen);
    else if (!isOpen && typeof onClose === "function") onClose();
  };

  const handleToggleMenu = () => {
    if (!isViewMode) {
      setMenuOpen((prev) => !prev);
      setHoveredItem(null);
    }
  };

  const handleFirstLevelChange = (key) => {
    let next = [];
    if (key === "all") {
      next =
        selectedFirstLevels.length === firstLevelOptions.length
          ? []
          : firstLevelOptions.map((i) => i.key);
      setHoveredItem(null);
    } else {
      next = selectedFirstLevels.includes(key)
        ? selectedFirstLevels.filter((k) => k !== key)
        : [...selectedFirstLevels, key];
    }
    setSelectedFirstLevels(next);
  };

  const handleSecondLevelChange = (firstKey, value) => {
    setSelectedItems((prev) => {
      const existing = prev[firstKey] || [];
      const has = existing.includes(value);
      return {
        ...prev,
        [firstKey]: has
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

  const handleConfirm = () => {
    if (!policyName.trim()) return;
    onSubmit?.({
      ...policy,
      id: policy?.id ?? Date.now(),
      name: policyName,
      status: "Active",
      createdBy: "Admin",
      createdByProfilePic: "/path/to/profile-default.jpg",
    });
    safeSetOpen(false);
  };

  const isAllSelected =
    selectedFirstLevels.length === firstLevelOptions.length &&
    firstLevelOptions.length > 0;

  const firstLevelLabel =
    (isAllSelected
      ? "All"
      : selectedFirstLevels
          .map((key) => firstLevelOptions.find((i) => i.key === key)?.label)
          .join(", ")) || "Select...";

  const totalSecondLevelSelected = selectedFirstLevels.reduce(
    (acc, key) => acc + (selectedItems[key]?.length || 0),
    0
  );

  return (
    <Dialog open={open} onOpenChange={safeSetOpen}>
      <DialogContent
        // Hide the default shadcn Close (X) that DialogContent renders.
        className="sm:max-w-2xl [&>button:last-child]:hidden"
        // Also close on ESC / outside explicitly
        onEscapeKeyDown={() => safeSetOpen(false)}
        onPointerDownOutside={() => safeSetOpen(false)}
      >
        <DialogHeader className="flex flex-col items-center text-center">
          <DialogTitle></DialogTitle>
          <h1 className="font-custom text-light-gray text-2xl sm:text-lg md:text-xl lg:text-3xl py-6">
            Leave Details
          </h1>
          <div className="w-full h-[1px] bg-[#A6A6A6]"></div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Policy Name */}
          <div className="flex flex-wrap md:flex-nowrap items-center justify-center">
            <label className="w-full md:w-1/3 text-sm font-custom text-[#3F4648]">
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
            <label className="w-full md:w-1/3 text-sm font-custom text-[#3F4648]">
              Leave Type
            </label>
            <div className="flex gap-3 w-full md:w-2/3">
              {["paid", "unpaid"].map((type) => (
                <div
                  key={type}
                  onClick={() => !isViewMode && setSelectedType(type)}
                  className={`flex-1 border rounded-lg text-center transition-colors
    px-3 py-3 sm:py-4 md:py-6 lg:py-8
    ${selectedType === type ? "border-blue-500 bg-blue-300" : "border-gray-300"}
    ${isViewMode ? "pointer-events-none opacity-60" : "cursor-pointer"}`}
                >
                  <span className="text-gray-700 text-sm sm:text-base md:text-lg lg:text-xl">
                    {type === "paid" ? "Paid Leave" : "Unpaid Leave"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex flex-wrap md:flex-nowrap items-center justify-center">
            <label className="w-full md:w-1/3 text-sm font-custom text-[#3F4648]">
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
                  disabled={isViewMode}
                />
                <span className="border border-gray-300 rounded-lg p-2 w-24 text-sm block text-center">
                  days
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
            <label className="w-full md:w-1/3 text-sm font-custom text-[#3F4648]">
              Select Month & Day
            </label>
            <div className="flex gap-3 w-full md:w-2/3">
              <select
                value={selectedMonth}
                onChange={handleMonthChange}
                className="border border-gray-300 rounded-lg p-2 w-1/2 font-custom"
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
                }).map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(Number(e.target.value))}
                className="border border-gray-300 rounded-lg p-2 w-1/2"
                disabled={isViewMode}
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
          <div className="flex flex-wrap md:flex-nowrap items-center justify-center">
            <label className="w-full md:w-1/3 text-sm font-custom text-[#3F4648]">
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
                  disabled={isViewMode}
                />
                <select
                  value={timeOffUnit}
                  onChange={(e) => setTimeOffUnit(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 w-28 text-sm"
                  disabled={isViewMode}
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
            <label className="w-full md:w-1/3 text-sm font-custom text-[#3F4648]">
              Assignment
            </label>
            <div
              className={`w-full md:w-2/3 relative flex items-center ${
                isViewMode ? "pointer-events-none opacity-60" : ""
              }`}
            >
              <button
                onClick={handleToggleMenu}
                className="flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white hover:bg-gray-100 w-full md:w-64"
              >
                <span className="truncate">{firstLevelLabel}</span>
                <ChevronDown className="w-4 h-4 text-gray-500 ml-2" />
              </button>

              {totalSecondLevelSelected > 0 && (
                <span className="ml-4 text-sm text-gray-600 whitespace-nowrap">
                  {totalSecondLevelSelected} selected
                </span>
              )}

              {!isViewMode && menuOpen && (
                <>
                  <div className="absolute top-full left-0 mt-2 w-48 border border-gray-300 bg-white shadow-lg z-10">
                    <label className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={() => handleFirstLevelChange("all")}
                        className="mr-2"
                      />
                      All
                    </label>
                    {firstLevelOptions.map((item) => (
                      <label
                        key={item.key}
                        className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onMouseEnter={() => setHoveredItem(item.key)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedFirstLevels.includes(item.key)}
                          onChange={() => handleFirstLevelChange(item.key)}
                          className="mr-2"
                        />
                        {item.label}
                      </label>
                    ))}
                  </div>

                  {hoveredItem && selectedFirstLevels.includes(hoveredItem) && (
                    <div className="absolute top-full left-52 mt-2 w-48 border border-gray-300 bg-white shadow-lg z-20">
                      <div className="px-3 py-2 font-semibold border-b border-gray-200">
                        {
                          firstLevelOptions.find((o) => o.key === hoveredItem)
                            ?.label
                        }{" "}
                        Options
                      </div>
                      {secondLevelData[hoveredItem].map((value) => (
                        <label
                          key={value}
                          className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={
                              selectedItems[hoveredItem]?.includes(value) ||
                              false
                            }
                            onChange={() =>
                              handleSecondLevelChange(hoveredItem, value)
                            }
                            className="mr-2"
                          />
                          {value}
                        </label>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          {/* Footer */}
          <div className="w-full h-[1px] bg-[#A6A6A6] mt-10" />
          {!isViewMode && (
            <div className="w-full flex justify-end mt-4">
              <Button
                className="w-full sm:w-auto py-3 px-6 text-sm sm:text-md font-custom rounded-full"
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

export default LeaveDetailDialog;
