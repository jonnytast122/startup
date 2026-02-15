"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import * as XLSX from "xlsx";

import { Button } from "@/components/ui/button";
import { ChevronDown, MapPin } from "lucide-react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { getOvertimeByEmployee } from "@/lib/api/adminOvertime";
import { useQuery } from "@tanstack/react-query";
import { formatWorkHours } from "@/lib/helper/dateTimeConveter";

const calculateHours = (start, end) => {
  if (!start || !end) return 0;
  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);
  if (
    Number.isNaN(startH) ||
    Number.isNaN(startM) ||
    Number.isNaN(endH) ||
    Number.isNaN(endM)
  ) {
    return 0;
  }
  let hours = endH - startH + (endM - startM) / 60;
  if (hours < 0) hours += 24;
  return hours;
};

const getEntryTotalHours = (entry) => {
  const apiHours = Number(entry?.totalHours);
  if (Number.isFinite(apiHours) && apiHours >= 0) {
    return apiHours;
  }
  return calculateHours(entry?.startTime, entry?.endTime);
};


const exportToCsv = (headers, rows, fileName) => {
  const escape = (value) => {
    const text = value === null || value === undefined ? "" : String(value);
    if (text.includes('"') || text.includes(",") || text.includes("\n")) {
      return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
  };

  const csv =
    [
      headers.map(escape).join(","),
      ...rows.map((r) => r.map(escape).join(",")),
    ].join("\n") + "\n";

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(link.href);
};

export default function UserProfileSection({ employee, onClose }) {
  const [showPicker, setShowPicker] = useState(false);
  const today = useMemo(() => new Date(), []);
  const [payPeriod, setPayPeriod] = useState(() => {
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return {
      startDate: startOfMonth,
      endDate: today,
      key: "selection",
    };
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
    { value: "overtime_csv", label: "as CSV" },
    { value: "overtime_xlsx", label: "as XLSX" },
  ];

  if (!employee) return null;

  const employeeId =
    employee?.employee?.id ||
    employee?.employee?._id ||
    employee?.employeeId ||
    employee?.id ||
    employee?._id ||
    "";
  const displayName =
    employee?.fullname ||
    employee?.employee?.name ||
    `${employee?.firstname || ""} ${employee?.lastname || ""}`.trim() ||
    "--";

  const { data: overtime } = useQuery({
    queryKey: [
      "employee-overtime",
      employeeId,
      payPeriod.startDate.toISOString().split("T")[0],
      payPeriod.endDate.toISOString().split("T")[0],
    ],
    queryFn: () =>
      getOvertimeByEmployee({
        id: employeeId,
        startDate: payPeriod.startDate.toISOString().split("T")[0],
        endDate: payPeriod.endDate.toISOString().split("T")[0],
      }),
    enabled: !!employeeId,
  });

  const ProfileCell = ({ profileImg, employeeName }) => {
    const [imageError, setImageError] = useState(false);
    const nameParts = employeeName.split(" ");
    const firstNameInitial = nameParts[0]?.charAt(0)?.toUpperCase() ?? "";
    const lastNameInitial = nameParts[1]?.charAt(0)?.toUpperCase() ?? "";

    return (
      <div className="flex justify-center items-center w-20 h-20 rounded-full bg-gray-300 overflow-hidden">
        {profileImg && !imageError ? (
          <img
            src={profileImg}
            alt="Profile"
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="text-2xl text-gray-600 font-medium">
            {firstNameInitial}
            {lastNameInitial}
          </span>
        )}
      </div>
    );
  };

  const overtimeRows = Array.isArray(overtime)
    ? overtime
    : Array.isArray(overtime?.data)
      ? overtime.data
      : [];

  const exportHeaders = [
    "Date",
    "Jobs",
    "Status",
    "Request / Assigned",
    "OT Type",
    "Start",
    "End",
    "Total Hours",
    "Daily Total",
    "Notes",
    "Attachment",
  ];

  const exportRows = overtimeRows.map((entry) => {
    const createdById = entry?.createdBy?._id || entry?.createdBy?.id || "";
    const employeeRowId = entry?.employee?._id || entry?.employee?.id || "";
    const requestType =
      createdById && employeeRowId && createdById === employeeRowId
        ? "Request"
        : "Assigned";

    return [
      entry?.date ? entry.date.split("T")[0] : "--",
      employee?.job || "--",
      entry?.status || "--",
      requestType,
      entry?.overtimeType?.name || "--",
      entry?.startTime || "--",
      entry?.endTime || "--",
      formatWorkHours(getEntryTotalHours(entry)) || "--",
      entry?.daily || "--",
      entry?.description || "--",
      entry?.attachment || "--",
    ];
  });

  const handleExport = (value) => {
    if (value === "overtime_csv") {
      exportToCsv(exportHeaders, exportRows, "overtime-records.csv");
      return;
    }

    if (value === "overtime_xlsx") {
      const worksheet = XLSX.utils.aoa_to_sheet([exportHeaders, ...exportRows]);
      worksheet["!cols"] = exportHeaders.map(() => ({ wch: 20 }));
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Overtime");
      XLSX.writeFile(workbook, "overtime-records.xlsx");
    }
  };

  return (
    <div className=" bg-white p-6 font-custom rounded-xl shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <ProfileCell
            profileImg={employee.profile}
            employeeName={displayName}
          />
          <div className="flex items-center gap-32">
            <p className="font-semibold text-lg whitespace-nowrap">
              {displayName}
            </p>
            <div className="relative" ref={datePickerRef}>
              <span className="mr-2 ">Overtime period:</span>
              <button
                onClick={() => setShowPicker(!showPicker)}
                className="px-4 py-2 border rounded-full text-sm bg-white border-gray-400 shadow-sm font-custom"
              >
                <ChevronLeft className="inline-block w-4 h-4 mb-1 mr-3" />
                {`${payPeriod.startDate.toLocaleDateString()} - ${payPeriod.endDate.toLocaleDateString()}`}
                <ChevronRight className="inline-block w-4 h-4 mb-1 ml-3" />
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
          <Select onValueChange={handleExport}>
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
      <hr className="border-gray-200 mb-4" />
      {/* Table */}
      <div className="overflow-auto border border-gray-300 rounded-lg">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr className="text-sm text-gray-700 bg-gray-100">
              <th className="text-center px-3 py-2">Date</th>
              <th className="text-center px-3 py-2">Jobs</th>
              <th className="text-center px-3 py-2">Status</th>
              <th className="text-center px-3 py-2">Request / Assigned</th>
              <th className="text-center px-3 py-2">OT Type</th>
              <th className="text-center px-3 py-2">Start</th>
              <th className="text-center px-3 py-2">End</th>
              <th className="text-center px-3 py-2">Total Hours</th>
              <th className="text-center px-3 py-2">Daily Total</th>
              <th className="text-center px-3 py-2">Notes</th>
              <th className="text-center px-3 py-2">Attachment</th>
            </tr>
          </thead>
          <tbody>
            {overtimeRows.map((entry, idx, arr) => (
              <React.Fragment
                key={entry._id || entry.id || `${entry.date}-${idx}`}
              >
                <tr className="text-sm text-center">
                  <td className="px-3 py-2">{entry.date.split("T")[0]}</td>
                  <td className="px-3 py-2">
                    <span className="px-5 py-1.5 text-md font-custom rounded-full border inline-flex items-center gap-1 border-[#5494DA] text-blue">
                      {employee.job}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-medium">
                    {(() => {
                      const status = entry.status || "Request for overtime";
                      return (
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold${
                            status === "approved"
                              ? "text-blue-500 bg-blue-100"
                              : status === "rejected"
                                ? "text-red-500 bg-red-100"
                                : "text-yellow-500 bg-yellow-100"
                          }`}
                        >
                          {status}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="px-3 py-2">{entry.createdBy.name || "--"}</td>
                  <td className="px-3 py-2">
                    {entry.overtimeType.name || "--"}
                  </td>
                  <td className="px-3 py-2">
                    <div className="text-center">
                      <span>{entry.startTime}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="text-center">
                      <span>{entry.endTime}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    {formatWorkHours(getEntryTotalHours(entry)) || "--"}
                  </td>
                  <td className="px-3 py-2">{entry.daily || "--"}</td>
                  <td className="px-3 py-2"> {entry.description || "--"}</td>
                  <td className="px-3 py-2 "></td>
                </tr>
                {idx !== arr.length - 1 && (
                  <tr>
                    <td colSpan={13}>
                      <div className="border-b border-gray-200 mx-3"></div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
