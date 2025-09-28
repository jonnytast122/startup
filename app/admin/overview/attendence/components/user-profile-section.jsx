"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, MapPin } from "lucide-react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { getEmployeeAttendance } from "@/lib/api/adminAttendance";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}


function formatTime(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function formatWorkHours(hours) {
  if (!hours) return "0h";
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m}m`;
}



export default function UserProfileSection({ employee, onClose }) {
  const [showPicker, setShowPicker] = useState(false);
  const [payPeriod, setPayPeriod] = useState({
    startDate: new Date(2025, 4, 26),
    endDate: new Date(2025, 11, 25),
    key: "selection",
  });

  const datePickerRef = useRef(null);

  // close picker if click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const exportOptions = [
    { value: "as CSV", label: "as CSV" },
    { value: "as XLS", label: "as XLS" },
  ];

  if (!employee) return null;
  console.log(employee);

  const { data: attendances } = useQuery({
    queryKey: ["employee-attendances", employee.id],
    queryFn: () =>
      getEmployeeAttendance(
        employee.employee._id,
        formatDate(payPeriod.startDate),
        formatDate(payPeriod.endDate)
      ),
  });

  // transform API response
  const transformed = useMemo(() => {
    if (!attendances) return [];
    return attendances.map((record) => {
      const checkIns = record.transactions.filter((t) => t.type === "checkIn");
      const checkOuts = record.transactions.filter(
        (t) => t.type === "checkOut"
      );
      const firstIn = checkIns[0]?.time || null;
      const lastOut = checkOuts[checkOuts.length - 1]?.time || null;

      return {
        id: record._id,
        date: record.date,
        status: record.status,
        job: record.jobTitle || "Unknown",
        workHours: record.workHours,
        firstIn,
        lastOut,
      };
    });
  }, [attendances]);

  return (
    <div className="bg-white">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <img
            src={employee.profile}
            alt="Avatar"
            className="w-12 h-12 rounded-full"
          />
          <div className="flex items-center gap-32">
            <p className="font-semibold text-lg whitespace-nowrap">
              {employee.firstname} {employee.lastname}
            </p>
            <div className="relative" ref={datePickerRef}>
              <span className="mr-2 text-sm text-gray-500">Pay period:</span>
              <button
                onClick={() => setShowPicker(!showPicker)}
                className="text-sm text-gray-600 border px-3 py-1 rounded-md inline-flex items-center gap-2"
              >
                {`${payPeriod.startDate.toLocaleDateString()} to ${payPeriod.endDate.toLocaleDateString()}`}
                <ChevronDown className="w-4 h-4" />
              </button>
              {showPicker && (
                <div className="absolute z-10 mt-2 bg-white shadow-lg border p-2 rounded-md">
                  <DateRangePicker
                    ranges={[payPeriod]}
                    onChange={(ranges) => setPayPeriod(ranges.selection)}
                    rangeColors={["#3b82f6"]}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Select>
            <SelectTrigger className="w-24 font-custom rounded-full">
              <SelectValue placeholder="Export" />
            </SelectTrigger>
            <SelectContent className="font-custom">
              {exportOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <hr className="border-gray-200 mb-3" />
      <div className="flex justify-between mb-4">
        <p className="text-sm">
          <span className="ml-6 font-semibold">Total Working Day: </span>
          {transformed.length}
          <span className="ml-6 font-semibold">
            {" "}
            Total Regular Hour:{" "}
            {transformed
              .reduce((sum, r) => sum + (r.workHours || 0), 0)
              .toFixed(2)}
            h
          </span>
        </p>
      </div>
      <hr className="border-gray-200 mb-4" />

      {/* TABLE */}
      <div className="overflow-x-auto border border-gray-300 rounded-lg">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr className="text-sm text-gray-700 bg-gray-100">
              <th className="text-center px-3 py-2"></th>
              <th className="text-left px-3 py-2">Date</th>
              <th className="text-left px-3 py-2">Jobs</th>
              <th className="text-left px-3 py-2">Status</th>
              <th className="text-left px-3 py-2">Start</th>
              <th className="text-left px-3 py-2">End</th>
              <th className="text-left px-3 py-2">Total hours</th>
              <th className="text-left px-3 py-2">Daily Totals</th>
              <th className="text-left px-3 py-2">Employee Note</th>
              <th className="text-left px-3 py-2">Manager Note</th>
            </tr>
          </thead>
          <tbody>
            {transformed.map((rec, idx) => (
              <tr
                key={rec.id}
                className={`text-sm text-center ${
                  idx < transformed.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                <td className="px-3 py-2"></td>
                <td className="px-3 py-2">{formatDate(rec.date)}</td>
                <td className="px-3 py-2">{rec.job}</td>
                <td className="px-3 py-2">{rec.status}</td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1 justify-start">
                    <span>{formatTime(rec.firstIn)}</span>
                    {rec.firstIn && (
                      <MapPin className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1 justify-start">
                    <span>{formatTime(rec.lastOut)}</span>
                    {rec.lastOut && (
                      <MapPin className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                </td>
                <td className="px-3 py-2">{formatWorkHours(rec.workHours)}</td>
                <td className="px-3 py-2">{rec.dailyTotals || "-"}</td>
                <td className="px-3 py-2">{rec.employeeNote || "-"}</td>
                <td className="px-3 py-2">{rec.managerNote || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
