"use client";

import { useState } from "react";
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

export default function UserProfileSection({ employee, onClose }) {
  const [showPicker, setShowPicker] = useState(false);
  const [payPeriod, setPayPeriod] = useState({
    startDate: new Date(2025, 6, 26),
    endDate: new Date(2025, 7, 25),
    key: "selection",
  });

  const exportOptions = [
    { value: "as CSV", label: "as CSV" },
    { value: "as XLS", label: "as XLS" },
  ];

  if (!employee) return null;

  return (
    <div className="bg-white rounded-xl shadow-md py-6 px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <img src={employee.profile} alt="Avatar" className="w-12 h-12 rounded-full" />
          <div className="flex items-center gap-32">
            <p className="font-semibold text-lg whitespace-nowrap">
              {employee.firstname} {employee.lastname}
            </p>
            <div className="relative">
              <span className="mr-2 text-sm text-gray-500">OT period:</span>
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

      {/* Summary */}
      <hr className="border-gray-200 mb-3" />
      <div className="flex justify-between mb-4">
        <p className="text-sm">
          <span className="ml-6 font-semibold">Total OT Hours: </span>18.5 hours
          <span className="ml-6 font-semibold">Total Approved: </span>16 hours
        </p>
      </div>
      <hr className="border-gray-200 mb-4" />

      {/* Table */}
      <div className="overflow-x-auto border border-gray-300 rounded-lg">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr className="text-sm text-gray-700 bg-gray-100">
              <th className="text-center px-3 py-2">
                <div className="w-4 h-4 rounded-full border border-gray-400 bg-white mx-auto" />
              </th>
              <th className="text-left px-3 py-2">Date</th>
              <th className="text-left px-3 py-2">Jobs</th>
              <th className="text-left px-3 py-2">Status</th>
              <th className="text-left px-3 py-2">Request / Assigned</th>
              <th className="text-left px-3 py-2">OT Type</th>
              <th className="text-left px-3 py-2">Start</th>
              <th className="text-left px-3 py-2">End</th>
              <th className="text-left px-3 py-2">Total Hours</th>
              <th className="text-left px-3 py-2">Daily Total</th>
              <th className="text-left px-3 py-2">Weekly Total</th>
              <th className="text-left px-3 py-2">Employee note</th>
              <th className="text-left px-3 py-2">Manager note</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td colSpan={12} className="py-2">
                <button className="px-4 py-1 text-sm rounded-full border border-gray-300 text-gray-700 bg-white">
                  Aug 18 - Aug 23
                </button>
              </td>
            </tr>
            {[
              {
                date: "Mon 19/08",
                status: "Approved",
                req: "Request",
                otType: "Weekend",
                start: "08:00",
                end: "10:30",
                total: "07:03",
                daily: "07:03",
                weekly: "07:03",
              },
              {
                date: "Tue 20/08",
                status: "Pending",
                req: "Assigned",
                otType: "Weekday",
                start: "18:00",
                end: "20:00",
                total: "07:03",
                daily: "07:03",
                weekly: "07:03",
              },
              {
                date: "Wed 21/08",
                status: "Declined",
                req: "Request",
                otType: "Holiday",
                start: "10:00",
                end: "14:00",
                total: "07:03",
                daily: "07:03",
                weekly: "07:03",
              },
              {
                date: "Thu 22/08",
                status: "Approved",
                req: "Assigned",
                otType: "Weekday",
                start: "17:30",
                end: "20:00",
                total: "07:03",
                daily: "07:03",
                weekly: "07:03",
              },
            ].map((entry, idx, arr) => (
              <>
                <tr key={idx} className="text-sm text-center">
                  <td className="px-3 py-2"></td>
                  <td className="px-3 py-2">{entry.date}</td>
                  <td className="px-3 py-2">
                    <span className="border border-blue-400 text-blue-500 px-3 py-1 rounded-full text-xs">
                      {employee.job}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-medium">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${entry.status === "Approved"
                          ? "bg-green-100 text-green-600"
                          : entry.status === "Declined"
                            ? "bg-red-100 text-red-500"
                            : "bg-gray-100 text-gray-500"
                        }`}
                    >
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-3 py-2">{entry.req}</td>
                  <td className="px-3 py-2">{entry.otType}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1 justify-start">
                      <span>{entry.start}</span>
                      <MapPin className="w-4 h-4 text-gray-600" />
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1 justify-start">
                      <span>{entry.end}</span>
                      <MapPin className="w-4 h-4 text-gray-600" />
                    </div>
                  </td>
                  <td className="px-3 py-2">{entry.total}</td>
                  <td className="px-3 py-2">{entry.daily}</td>
                  <td className="px-3 py-2">{entry.weekly}</td>
                  <td className="px-3 py-2 text-gray-400 italic">—</td>
                  <td className="px-3 py-2 text-gray-400 italic">—</td>
                </tr>
                {idx !== arr.length - 1 && (
                  <tr>
                    <td colSpan={13}>
                      <div className="border-b border-gray-200 mx-3"></div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
