"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Users, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchCompanyOverTimeSetting,
  fetchCompanyLeavePolicy,
} from "@/lib/api/policy";
import { fetchCompany } from "@/lib/api/company";
import { fetchMembers } from "@/lib/api/user";

// First and second level options
const firstLevelOptions = [
  { key: "User", label: "User" },
  { key: "Department", label: "Department" },
  { key: "Group", label: "Group" },
  { key: "Branch", label: "Branch" },
];

const colorOptions = [
  { value: "blue", colorClass: "bg-blue-500", hex: "#2998FF" },
  { value: "red", colorClass: "bg-red-500", hex: "#FF5733" },
];

export default function EditEventDialog({ date, onClose, onSave, event }) {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("08:00");
  const [end, setEnd] = useState("17:00");
  const [assignee, setAssignee] = useState([]);
  const [requireClockIn, setRequireClockIn] = useState(false);
  const [leavePolicies, setLeavePolicies] = useState("");
  const [overtimeType, setOvertimeType] = useState("");
  const [selectedColor, setSelectedColor] = useState("blue");

  const [errors, setErrors] = useState({});

  // Fetch company data
  const { data: company } = useQuery({
    queryKey: ["company"],
    queryFn: fetchCompany,
  });

  const { data: overtimeSettings, isLoading: overtimeLoading } = useQuery({
    queryKey: ["overtimeSettings", company?.id],
    queryFn: () => fetchCompanyOverTimeSetting(company?.id),
    enabled: !!company?.id,
  });

  const { data: leaveSettings, isLoading: leaveLoading } = useQuery({
    queryKey: ["leaveSettings", company?.id],
    queryFn: () => fetchCompanyLeavePolicy(company?.id),
    enabled: !!company?.id,
  });

  const { data } = useQuery({
    queryKey: ["members"],
    queryFn: fetchMembers,
  });

  // Assign menu
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [selectedFirstLevels, setSelectedFirstLevels] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});

  // Color popover
  const [colorOpen, setColorOpen] = useState(false);

  // Initialize dialog state
  useEffect(() => {
    if (event) {
      setTitle(event.title || "");
      setStart(event.startDate?.slice(11, 16) || "08:00");
      setEnd(event.endDate?.slice(11, 16) || "17:00");
      setRequireClockIn(!!event.isRequireClockInOut);
      setLeavePolicies(event.leavePolicies || "");
      setOvertimeType(event.overtimeType || "");
      setSelectedColor(
        colorOptions.find((c) => c.hex === event.color)?.value || "blue"
      );
      setSelectedFirstLevels(event.assign?.selectedFirstLevels || []);
      setSelectedItems(event.assign?.selectedItems || {});
    } else {
      setTitle("");
      setStart("08:00");
      setEnd("17:00");
      setAssignee([]);
      setRequireClockIn(false);
      setLeavePolicies("");
      setOvertimeType("");
      setSelectedColor("blue");
      setSelectedFirstLevels([]);
      setSelectedItems({});
    }
    setErrors({});
  }, [event]);

  // Toggle Assign menu
  const toggleMenu = () => {
    setColorOpen(false);
    setMenuOpen((prev) => !prev);
    setHoveredItem(null);
  };

  // Handle first-level selection
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

  // Handle second-level selection
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

  // Submit handler with validation
  const handleSubmit = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = "Title is required.";
    }
    if (requireClockIn && !leavePolicies && !overtimeType) {
      newErrors.clockIn =
        "Select at least one Leave Policy or Overtime Policy.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const startDateTime = new Date(`${date}T${start}`);
    const endDateTime = new Date(`${date}T${end}`);
    const colorHex = colorOptions.find((c) => c.value === selectedColor)?.hex;

    const body = {
      title,
      color: colorHex,
      startDate: startDateTime.toISOString(),
      endDate: endDateTime.toISOString(),
      assignee: assignee || [],
      isRequireClockInOut: requireClockIn,
      leavePolicies: leavePolicies || null,
      overtimeType: overtimeType || null,
    };
    onSave?.(body);
    onClose?.();
  };

  // Prevent dialog closing when interacting with popovers
  const ignoreIfPopover = (e) => {
    const el = e.target;
    if (el instanceof HTMLElement && el.closest("[data-radix-popover-content]"))
      e.preventDefault();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent
        className="w-[400px] space-y-4 font-custom"
        onPointerDownOutside={ignoreIfPopover}
        onInteractOutside={ignoreIfPopover}
      >
        <DialogHeader>
          <DialogTitle>{event ? "Edit Event" : "Create Event"}</DialogTitle>
        </DialogHeader>

        {/* Title + Color */}
        <div className="flex items-start justify-between gap-2">
          <div className="w-full">
            <input
              placeholder="Event Title"
              className="w-full px-0 py-2 outline-none font-custom text-sm bg-transparent border-b border-gray-300"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && (
              <p className="text-xs text-red-500 mt-1">{errors.title}</p>
            )}
          </div>

          <Popover
            open={colorOpen}
            onOpenChange={(o) => {
              if (o) setMenuOpen(false);
              setColorOpen(o);
            }}
          >
            <PopoverTrigger asChild>
              <button className="relative z-[60] flex items-center justify-between px-3 py-2 bg-white shadow-sm rounded-md cursor-pointer w-fit">
                <span
                  className="w-4 h-4 rounded-full"
                  style={{
                    backgroundColor:
                      selectedColor === "blue" ? "#2998FF" : "#FF5733",
                  }}
                />
                <ChevronDown size={14} className="text-gray-400 ml-2" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="z-[1000] pointer-events-auto w-fit p-2 bg-white rounded-md shadow border">
              <div className="flex gap-2">
                {colorOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setSelectedColor(opt.value);
                      setColorOpen(false);
                    }}
                    className="w-5 h-5 rounded-full border-2 transition hover:scale-105"
                    style={{
                      backgroundColor: opt.hex,
                      borderColor:
                        selectedColor === opt.value ? "#ccc" : "transparent",
                    }}
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
        {/* <div className="flex items-center justify-between px-3 py-2 border rounded-md">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-gray-500" />
            <span className="text-sm">Assign</span>
          </div>
          <div className="relative w-[220px]">
            <button
              onClick={() => {
                setColorOpen(false);
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
            )}
          </div>
        </div> */}

        {/* Clock In */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-blue-500 font-medium">
            Require Clock In
          </span>
          <Switch
            checked={requireClockIn}
            onCheckedChange={setRequireClockIn}
            className="data-[state=checked]:bg-green-500"
          />
        </div>
        {errors.clockIn && (
          <p className="text-xs text-red-500">{errors.clockIn}</p>
        )}

        {requireClockIn && (
          <div className="flex gap-4">
            {/* Leave Policy */}
            <div className="w-1/2">
              <span className="text-xs text-gray-500">Leave Policy</span>
              <select
                value={leavePolicies}
                onChange={(e) => setLeavePolicies(e.target.value)}
                className="w-full mt-1 text-sm border border-gray-300 rounded-md px-2 py-1"
                disabled={leaveLoading}
              >
                <option value="">Select</option>
                {leaveSettings?.map((policy) => (
                  <option key={policy.id} value={policy.id}>
                    {policy.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Overtime Policy */}
            <div className="w-1/2">
              <span className="text-xs text-gray-500">Overtime Policy</span>
              <select
                value={overtimeType}
                onChange={(e) => setOvertimeType(e.target.value)}
                className="w-full mt-1 text-sm border border-gray-300 rounded-md px-2 py-1"
                disabled={overtimeLoading}
              >
                <option value="">Select</option>
                {overtimeSettings?.map((policy) => (
                  <option key={policy.id} value={policy.id}>
                    {policy.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="text-right">
          <Button
            onClick={handleSubmit}
            className="h-8 px-5 text-sm rounded-md"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
