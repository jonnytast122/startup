"use client";

import { useState } from "react";
import { Fragment } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
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

import { getLeave } from "@/lib/api/adminLeave";
import { useQuery } from "@tanstack/react-query";

export default function UserProfileSection({ employee, onClose }) {
  const [showPicker, setShowPicker] = useState(false);
  const [payPeriod, setPayPeriod] = useState({
    startDate: new Date(2025, 4, 26),
    endDate: new Date(2025, 10, 25),
    key: "selection",
  });

  const exportOptions = [
    { value: "as CSV", label: "as CSV" },
    { value: "as XLS", label: "as XLS" },
  ];

  if (!employee) return null;
  console.log(employee)

  const { data: leave } = useQuery({
    queryKey: ["employee-leave", employee.employee._id],
    queryFn: () =>
      getLeave(
        {
          employeeId: employee.employee._id,
          startDate: payPeriod.startDate.toISOString().split("T")[0],
          endDate: payPeriod.endDate.toISOString().split("T")[0],
        }
      ),
    enabled: !!employee?.employee?._id,
  });

  console.log(leave)


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
              <span className="mr-2 text-sm text-gray-500">Leave period:</span>
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
          <span className="ml-6 font-semibold">Total Paid Leave: </span>5 days
          <span className="ml-6 font-semibold">Total Leave Days: </span>15 days
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
              <th className="text-left px-3 py-2">Leave Type</th>
              <th className="text-left px-3 py-2">Status</th>
              <th className="text-left px-3 py-2">Shift Type</th>
              <th className="text-left px-3 py-2">Start Date</th>
              <th className="text-left px-3 py-2">End Date</th>
              <th className="text-left px-3 py-2">Employee note</th>
              <th className="text-left px-3 py-2">Manager note</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td colSpan={9} className="py-2">
                <button className="px-4 py-1 text-sm rounded-full border border-gray-300 text-gray-700 bg-white">
                  Aug 18 - Aug 23
                </button>
              </td>
            </tr>
            {leave?.map((entry, idx, arr) => (
              <Fragment key={idx}>
                <tr key={idx} className="text-sm text-center">
                  <td className="px-3 py-2"></td>
                  <td className="px-3 py-2">{entry.date}</td>
                  <td className="px-3 py-2">
                    <span className="border border-blue-400 text-blue-500 px-3 py-1 rounded-full text-xs">
                      {employee.job}
                    </span>
                  </td>
                  <td className="px-3 py-2">{entry.type.name}</td>
                  <td className="px-3 py-2 font-medium">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        entry.status === "Approved"
                          ? "bg-green-100 text-green-600"
                          : entry.status === "Declined"
                          ? "bg-red-100 text-red-500"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-3 py-2">{entry.shift}</td>
                  <td className="px-3 py-2">{entry.startDate.split("T")[0]}</td>
                  <td className="px-3 py-2">{entry.endDate.split("T")[0]}</td>
                  <td className="px-3 py-2 text-gray-400 italic">{entry.note || "-"}</td>
                  <td className="px-3 py-2 text-gray-400 italic">{entry.response || "-"}</td>
                </tr>
                {idx !== arr.length - 1 && (
                  <tr>
                    <td colSpan={10}>
                      <div className="border-b border-gray-200 mx-3"></div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
