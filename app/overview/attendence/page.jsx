"use client";

import { useState } from "react";
import { Search, ListFilter, CalendarClock, ChevronDown } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import TimesheetScreen from "./components/timesheetscreen";
import TodayScreen from "./components/todayscreen";
import SettingDialog from "./components/settingdialog";

export default function TimeClock() {
  const [activeTab, setActiveTab] = useState("TODAY");
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [selectedFirstLevels, setSelectedFirstLevels] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});

  const exportOptions = [
    { value: "as CSV", label: "as CSV" },
    { value: "as XLS", label: "as XLS" },
  ];

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

  const handleToggleMenu = () => setMenuOpen((prev) => !prev);

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

  const isAllSelected =
    selectedFirstLevels.length === firstLevelOptions.length &&
    firstLevelOptions.length > 0;

  const firstLevelLabel = isAllSelected
    ? "All"
    : selectedFirstLevels
      .map((key) => firstLevelOptions.find((item) => item.key === key)?.label)
      .join(", ") || "Select...";

  const totalSecondLevelSelected = selectedFirstLevels.reduce((acc, key) => {
    const count = selectedItems[key]?.length || 0;
    return acc + count;
  }, 0);

  return (
    <div>
      {/* Header */}
      <div className="bg-white rounded-xl mb-3 shadow-md py-6 px-6 border">
        <div className="flex items-center justify-between p-5">
          <a href="/overview/attendence" className="block">
            <div className="flex items-center space-x-3">
              <CalendarClock className="text-[#2998FF]" width={40} height={40} />
              <span className="font-custom text-3xl text-black">Attendence</span>
            </div>
          </a>
          <div className="flex items-center space-x-4">
            <p className="font-custom text-gray-700 text-xs sm:text-sm md:text-md lg:text-md">
              Asset
              <br /> admins
            </p>

            <div className="flex items-center flex-wrap sm:flex-nowrap -space-x-4 sm:-space-x-4 min-w-0">
              {[
                { text: "W", bg: "bg-gray-600" },
                { text: "LH", bg: "bg-lime-400" },
                { text: "SK", bg: "bg-pink-400" },
                { text: "2+", bg: "bg-blue-100", textColor: "text-blue-500" },
              ].map((badge, index) => (
                <div
                  key={index}
                  className={`w-7 h-7 sm:w-8 sm:h-8 md:w-6 md:h-6 lg:w-8 lg:h-8 ${badge.bg
                    } rounded-full flex items-center justify-center border-2 border-white 
           text-xs sm:text-xs md:text-sm lg:text-md font-bold ${badge.textColor || "text-white"
                    }`}
                >
                  {badge.text}
                </div>
              ))}
            </div>
            <SettingDialog />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="relative bg-white rounded-xl shadow-md">
        <div className="flex">
          {["TODAY", "TIMESHEETS"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSearchQuery(""); // reset search
              }}
              className={`flex-1 py-3 font-custom sm:text-md md:text-md lg:text-2xl transition-all ${activeTab === tab
                  ? "bg-white text-blue-500 rounded-t-xl"
                  : "bg-gray-100 text-gray-500 hover:text-gray-700"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Toolbar (Only for TIMESHEETS) */}
        {activeTab === "TIMESHEETS" && (
          <div className="flex flex-wrap justify-between items-center p-4 bg-white border-b gap-4">
            {/* Left: Filter */}
            <div className="relative flex items-center">
              <button
                onClick={handleToggleMenu}
                className="flex items-center justify-between border border-gray-300 rounded-full px-6 py-2 text-blue-400 text-md bg-white hover:bg-gray-100 w-32 md:w-32 lg:w-40 font-custom"
              >
                <ListFilter className="text-gray-500 mr-2" size={18} />
                <span className="truncate flex-1">{firstLevelLabel}</span>
                <ChevronDown className="w-4 h-4 text-gray-500 ml-2" />
              </button>

              {totalSecondLevelSelected > 0 && (
                <span className="ml-4 text-sm text-gray-600 whitespace-nowrap">
                  {totalSecondLevelSelected} selected
                </span>
              )}

              {menuOpen && (
                <div
                  className="absolute top-full left-0 mt-2 z-10 flex"
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {/* First-level dropdown */}
                  <div className="w-48 border border-gray-300 bg-white shadow-lg font-custom rounded-xl">
                    <label className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-blue-500">
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
                        className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-blue-500"
                        onMouseEnter={() => setHoveredItem(item.key)}
                        onClick={() => setHoveredItem(item.key)}
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

                  {/* Second-level dropdown */}
                  {hoveredItem &&
                    selectedFirstLevels.includes(hoveredItem) &&
                    secondLevelData[hoveredItem]?.length > 0 && (
                      <div className="ml-2 w-48 border border-gray-300 bg-white shadow-lg font-custom rounded-xl z-20">
                        {secondLevelData[hoveredItem].map((value) => (
                          <label
                            key={value}
                            className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-blue-500"
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
                </div>
              )}
            </div>

            {/* Right: Search + Export */}
            <div className="flex items-center space-x-4">
              <div className="relative flex items-center w-full sm:w-auto max-w-md">
                <Search className="absolute left-3 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  className="font-custom w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <Select>
                <SelectTrigger className="w-24 font-custom rounded-full">
                  <SelectValue placeholder="Export" />
                </SelectTrigger>
                <SelectContent className="font-custom">
                  {exportOptions.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="p-6 font-custom">
          {activeTab === "TODAY" && <TodayScreen />}
          {activeTab === "TIMESHEETS" && (
            <TimesheetScreen
              searchQuery={searchQuery}
              filters={{ selectedFirstLevels, selectedItems }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
