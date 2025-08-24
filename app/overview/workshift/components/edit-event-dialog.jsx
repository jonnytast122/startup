"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Users, ChevronDown } from "lucide-react";

const firstLevelOptions = [
  { key: "User", label: "User" },
  { key: "Department", label: "Department" },
  { key: "Group", label: "Group" },
  { key: "Branch", label: "Branch" },
];

const secondLevelData = {
  User: ["User 1", "User 2", "User 3"],
  Department: ["Dept 1", "Dept 2"],
  Group: ["Group 1", "Group 2"],
  Branch: ["Branch 1", "Branch 2"],
};

const colorOptions = [
  { value: "blue", colorClass: "bg-blue-500" },
  { value: "red",  colorClass: "bg-red-500"  },
];

export default function EditEventDialog({ date, onClose, onSave, event }) {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("13:00");
  const [end, setEnd] = useState("13:00");
  const [requireClockIn, setRequireClockIn] = useState(false);
  const [leavePolicy, setLeavePolicy] = useState("");
  const [overtimePolicy, setOvertimePolicy] = useState("");
  const [selectedColor, setSelectedColor] = useState("blue");

  // Assign menu
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [selectedFirstLevels, setSelectedFirstLevels] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});

  // Color popover (controlled so we can close menus)
  const [colorOpen, setColorOpen] = useState(false);

  useEffect(() => {
    if (event) {
      setTitle(event.name || "");
      setStart(event.start || "13:00");
      setEnd(event.end || "13:00");
      setRequireClockIn(!!event.requireClockIn);
      setLeavePolicy(event.leavePolicy || "");
      setOvertimePolicy(event.overtimePolicy || "");
      setSelectedColor(event.color || "blue");
      setSelectedFirstLevels(event.assign?.selectedFirstLevels || []);
      setSelectedItems(event.assign?.selectedItems || {});
    } else {
      setTitle("");
      setStart("13:00");
      setEnd("13:00");
      setRequireClockIn(false);
      setLeavePolicy("");
      setOvertimePolicy("");
      setSelectedColor("blue");
      setSelectedFirstLevels([]);
      setSelectedItems({});
    }
  }, [event]);

  const toggleMenu = () => {
    setColorOpen(false);            // close color when opening menu
    setMenuOpen((prev) => !prev);
    setHoveredItem(null);
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
      const exists = selectedFirstLevels.includes(key);
      newSelection = exists
        ? selectedFirstLevels.filter((k) => k !== key)
        : [...selectedFirstLevels, key];
    }
    const newSelectedItems = {};
    for (const k of newSelection) newSelectedItems[k] = selectedItems[k] || [];
    setSelectedFirstLevels(newSelection);
    setSelectedItems(newSelectedItems);
  };

  const handleSecondLevelChange = (firstKey, value) => {
    const existing = selectedItems[firstKey] || [];
    const updated = existing.includes(value)
      ? existing.filter((v) => v !== value)
      : [...existing, value];
    setSelectedItems({ ...selectedItems, [firstKey]: updated });
  };

  const totalSecondLevelSelected = selectedFirstLevels.reduce(
    (acc, key) => acc + (selectedItems[key]?.length || 0),
    0
  );

  const isAllSelected =
    selectedFirstLevels.length === firstLevelOptions.length &&
    firstLevelOptions.length > 0;

  const firstLevelLabel =
    (isAllSelected
      ? "All"
      : selectedFirstLevels
          .map((key) => firstLevelOptions.find((i) => i.key === key)?.label)
          .join(", ")) || "Select...";

  const handleSubmit = () => {
    const effectiveDate = event?.date ?? date;
    onSave?.({
      name: title,
      date: effectiveDate,
      start,
      end,
      assign: { selectedFirstLevels, selectedItems },
      requireClockIn,
      color: selectedColor,
      leavePolicy,
      overtimePolicy,
    });
    onClose?.();
  };

  // IMPORTANT: allow clicks on portaled popovers by telling Dialog
  // not to treat them as "outside" interactions
  const ignoreIfPopover = (e) => {
    const el = e.target;
    if (el instanceof HTMLElement && el.closest("[data-radix-popover-content]")) {
      e.preventDefault();
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent
        className="w-[400px] space-y-4"
        onPointerDownOutside={ignoreIfPopover}
        onInteractOutside={ignoreIfPopover}
      >
        <h2 className="text-lg font-semibold text-gray-700">
          {event ? "Edit Event" : "Create Event"}
        </h2>

        {/* Title + Color */}
        <div className="flex items-center justify-between gap-2">
          <input
            placeholder="Event Title"
            className="w-full px-0 py-2 outline-none font-custom text-sm bg-transparent border-b border-gray-300"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Popover
            open={colorOpen}
            onOpenChange={(o) => {
              if (o) setMenuOpen(false);  // close Assign when opening color
              setColorOpen(o);
            }}
          >
            <PopoverTrigger asChild>
              <button
                type="button"
                className="relative z-[60] flex items-center justify-between px-3 py-2 bg-white shadow-sm rounded-md cursor-pointer w-fit"
              >
                <span
                  className={`w-4 h-4 rounded-full ${
                    selectedColor === "blue" ? "bg-blue-500" : "bg-red-500"
                  }`}
                />
                <ChevronDown size={14} className="text-gray-400 ml-2" />
              </button>
            </PopoverTrigger>

            <PopoverContent
              side="bottom"
              align="end"
              sideOffset={6}
              className="z-[1000] pointer-events-auto w-fit p-2 bg-white rounded-md shadow border"
            >
              <div className="flex gap-2">
                {colorOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setSelectedColor(opt.value);
                      setColorOpen(false);
                    }}
                    className={`w-5 h-5 rounded-full border-2 transition hover:scale-105 ${opt.colorClass} ${
                      selectedColor === opt.value
                        ? "border-gray-300"
                        : "border-transparent"
                    }`}
                    aria-label={opt.value}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Time range */}
        <div className="flex border rounded-md overflow-hidden">
          <div className="flex items-center w-1/2 px-3 py-2 gap-2 border-r">
            <span className="text-sm text-gray-500">Start</span>
            <input
              type="time"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="text-sm w-full bg-transparent outline-none"
            />
          </div>
          <div className="flex items-center w-1/2 px-3 py-2 gap-2">
            <span className="text-sm text-gray-500">End</span>
            <input
              type="time"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="text-sm w-full bg-transparent outline-none"
            />
          </div>
        </div>

        {/* Assign */}
        <div className="flex items-center justify-between px-3 py-2 border rounded-md">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-gray-500" />
            <span className="text-sm">Assign</span>
          </div>

          <div className="relative w-[220px]">
            <button
              onClick={() => {
                setColorOpen(false);      // close color when opening Assign
                toggleMenu();
              }}
              className="flex items-center justify-between w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white hover:bg-gray-100"
            >
              <span className="truncate text-gray-700">{firstLevelLabel}</span>
              <div className="flex items-center gap-2">
                {totalSecondLevelSelected > 0 && (
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {totalSecondLevelSelected} selected
                  </span>
                )}
                <ChevronDown size={14} className="text-gray-400" />
              </div>
            </button>

            {menuOpen && (
              <>
                <div className="absolute z-20 top-full left-0 mt-2 w-48 border border-gray-300 bg-white shadow rounded">
                  <label
                    className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onMouseEnter={() => setHoveredItem(null)}
                  >
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

                {hoveredItem && selectedFirstLevels.includes(hoveredItem) && (
                  <div className="absolute z-30 top-full left-52 mt-2 w-48 border border-gray-300 bg-white shadow rounded">
                    <div className="px-3 py-2 text-sm font-semibold border-b border-gray-200">
                      {firstLevelOptions.find((o) => o.key === hoveredItem)?.label} Options
                    </div>
                    {secondLevelData[hoveredItem].map((value) => (
                      <label
                        key={value}
                        className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={selectedItems[hoveredItem]?.includes(value) || false}
                          onChange={() => handleSecondLevelChange(hoveredItem, value)}
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

        {/* Clock In */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-blue-500 font-medium">Require Clock In</span>
          <Switch
            checked={requireClockIn}
            onCheckedChange={setRequireClockIn}
            className="data-[state=checked]:bg-green-500"
          />
        </div>

        {requireClockIn && (
          <div className="flex gap-4">
            <div className="w-1/2">
              <span className="text-xs text-gray-500">Leave Policy</span>
              <select
                value={leavePolicy}
                onChange={(e) => setLeavePolicy(e.target.value)}
                className="w-full mt-1 text-sm border border-gray-300 rounded-md px-2 py-1"
              >
                <option value="">Select</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Annual Leave">Annual Leave</option>
              </select>
            </div>
            <div className="w-1/2">
              <span className="text-xs text-gray-500">Overtime Policy</span>
              <select
                value={overtimePolicy}
                onChange={(e) => setOvertimePolicy(e.target.value)}
                className="w-full mt-1 text-sm border border-gray-300 rounded-md px-2 py-1"
              >
                <option value="">Select</option>
                <option value="Morning">Morning</option>
                <option value="Weekend">Weekend</option>
              </select>
            </div>
          </div>
        )}

        <div className="text-right">
          <Button onClick={handleSubmit} className="h-8 px-5 text-sm rounded-md">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
