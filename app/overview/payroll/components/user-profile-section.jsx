"use client";

import { useState } from "react";
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
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <img src={employee.profile} alt="Avatar" className="w-12 h-12 rounded-full" />
                    <div className="flex items-center gap-32">
                        <p className="font-semibold text-lg whitespace-nowrap">
                            {employee.firstName} {employee.lastName}
                        </p>
                        <div className="relative">
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
                    <Button
                        variant="outline"
                        className="rounded-full px-4 text-sm"
                        onClick={onClose}
                    >
                        Back
                    </Button>
                </div>
            </div>

            <hr className="border-gray-200 mb-3" />
            <div className="flex justify-between mb-4">
                <p className="text-sm">
                    <span className="ml-6 font-semibold">Total Working Day: </span>29.5 day <span className="ml-6 font-semibold">Total Pay: 1905$</span>
                </p>
            </div>
            <hr className="border-gray-200 mb-4" />

 <div className="overflow-x-auto border border-gray-300 rounded-lg">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr className="text-sm text-gray-700 bg-gray-100">
              <th className="text-center px-3 py-2">
                <div className="w-4 h-4 rounded-full border border-gray-400 bg-white mx-auto" />
              </th>
              <th className="text-left px-3 py-2">Date</th>
              <th className="text-left px-3 py-2">Jobs</th>
              <th className="text-left px-3 py-2">Regular hour</th>
              <th className="text-left px-3 py-2">Hourly Rate</th>
              <th className="text-left px-3 py-2">Regular pay</th>
              <th className="text-left px-3 py-2">Overtime pay</th>
              <th className="text-left px-3 py-2">Gross Salary</th>
              <th className="text-left px-3 py-2">Tax</th>
              <th className="text-left px-3 py-2">NSSF</th>
              <th className="text-left px-3 py-2">Net salary</th>
              <th className="text-left px-3 py-2">Employee note</th>
              <th className="text-left px-3 py-2">Manager note</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td colSpan={6} className="py-2">
                <button className="px-4 py-1 text-sm rounded-full border border-gray-300 text-gray-700 bg-white">
                  Aug 18 - Aug 23
                </button>
              </td>
            </tr>
            {["Mon 23/08", "Tue 20/08", "Wed 21/08", "Thu 22/08", "Fri 23/08", "Sat 24/08"].map((date, idx, arr) => (
              <>
                <tr key={idx} className="text-sm text-center">
                  <td className="px-3 py-2"></td>
                  <td className="px-3 py-2">{date}</td>
                  <td className="px-3 py-2">
                    <span className="border border-blue-400 text-blue-500 px-3 py-1 rounded-full text-xs">
                      {employee.job}
                    </span>
                  </td>
                  <td className="px-3 py-2">{employee.regularHour}</td>
                  <td className="px-3 py-2">${employee.dailyRate}</td>
                  <td className="px-3 py-2">${employee.regularPay}</td>
                  <td className="px-3 py-2">${employee.overtimePay}</td>
                  <td className="px-3 py-2 font-semibold text-black">{idx === 2 ? "$2178" : ""}</td>
                  <td className="px-3 py-2 text-red-500">{idx === 2 ? "$178" : ""}</td>
                  <td className="px-3 py-2 text-red-500">{idx === 2 ? "$50" : ""}</td>
                  <td className="px-3 py-2 font-medium">{idx === 2 ? "$1950" : ""}</td>
                  <td className="px-3 py-2 text-gray-400 italic"></td>
                  <td className="px-3 py-2 text-gray-400 italic"></td>
                </tr>
                {idx !== arr.length - 1 && (
                  <tr>
                    <td colSpan={7}>
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