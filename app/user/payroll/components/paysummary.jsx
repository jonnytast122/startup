"use client";

import { useMemo } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
export default function PaySummary() {
  const summary = {
    year: 2024,
    totalWorkingDays: "147.5 days",
    totalGross: "10,890$",
    tax: "1,140$",
    nssf: "600$",
    totalPay: "9,525$",
  };

  const exportOptions = [
    { value: "as CSV", label: "as CSV" },
    { value: "as XLS", label: "as XLS" },
  ];

  const months = useMemo(
    () => [
      { month: "January", workingDay: "29.5 day", gross: "2178$", tax: "178$", nssf: "50$", total: "1905$" },
      { month: "February", workingDay: "---", gross: "---", tax: "---", nssf: "---", total: "---" },
      { month: "March", workingDay: "---", gross: "---", tax: "---", nssf: "---", total: "---" },
      { month: "April", workingDay: "29.5 day", gross: "2178$", tax: "178$", nssf: "50$", total: "1905$" },
      { month: "May", workingDay: "29.5 day", gross: "2178$", tax: "178$", nssf: "50$", total: "1905$" },
      { month: "June", workingDay: "---", gross: "---", tax: "---", nssf: "---", total: "---" },
      { month: "July", workingDay: "29.5 day", gross: "2178$", tax: "178$", nssf: "50$", total: "1905$" },
      { month: "August", workingDay: "---", gross: "---", tax: "---", nssf: "---", total: "---" },
      { month: "September", workingDay: "29.5 day", gross: "2178$", tax: "178$", nssf: "50$", total: "1905$" },
      { month: "October", workingDay: "29.5 day", gross: "2178$", tax: "178$", nssf: "50$", total: "1905$" },
      { month: "November", workingDay: "29.5 day", gross: "2178$", tax: "178$", nssf: "50$", total: "1905$" },
      { month: "December", workingDay: "29.5 day", gross: "2178$", tax: "178$", nssf: "50$", total: "1905$" },
    ],
    []
  );

  return (
    <div className="bg-gray-100 md:bg-white min-h-screen rounded-md">
      <div className="mx-auto max-w-6xl py-4">
        {/* ---------- TITLE (Desktop only) ---------- */}
        <h1 className="hidden md:block text-center text-2xl sm:text-3xl font-semibold tracking-tight mb-4 md:mb-6">
          {summary.year} Pay Summary
        </h1>

        {/* ---------- MOBILE SUMMARY (<= md) ---------- */}
        <div className="md:hidden mb-6">
          <div className="border rounded-lg shadow-sm bg-white">
            <div className="p-4">
              <div className="text-2xl font-semibold mb-3">{summary.year} Pay Summary</div>

              <div className="space-y-3">
                {/* Total Working Days and Gross Salary on same row */}
                <div className="grid grid-cols-2 gap-3">
                  <StackMetric label="Total Working Days" value={summary.totalWorkingDays} />
                  <StackMetric label="Gross Salary" value={summary.totalGross} />
                </div>

                {/* Tax and NSSF on same row */}
                <div className="grid grid-cols-2 gap-3">
                  <StackMetric label="Tax" value={summary.tax} valueClass="text-red-500" />
                  <StackMetric label="NSSF" value={summary.nssf} valueClass="text-red-500" />
                </div>
              </div>

              <div className="border-t my-4"></div>

              <div className="flex items-center justify-between">
                <div className="text-xl font-medium text-gray-600">Total Pay :</div>
                <div className="text-xl text-green-500 font-semibold">{summary.totalPay}</div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- DESKTOP KPI ROW (>= md) ---------- */}
        <div className="hidden md:flex justify-center mb-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-5xl w-full">
            <Kpi label="Total Working Days" value={summary.totalWorkingDays} />
            <Kpi label="Total Gross Salary" value={summary.totalGross} />
            <Kpi label="TAX" value={summary.tax} valueClass="text-red-500" />
            <Kpi label="NSSF" value={summary.nssf} valueClass="text-red-500" />
            <Kpi label="Total Pay" value={summary.totalPay} valueClass="text-green-500" />
          </div>
        </div>

        {/* ---------- EXPORT (shared) ---------- */}
        <div className="flex justify-end mb-5">
          <div className="relative inline-block text-left">
            <div className="ml-auto">
              <Select>
                <SelectTrigger className="w-28 font-custom rounded-full shrink-0 bg-white">
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
        </div>

        {/* ---------- TABLES ---------- */}

        {/* Mobile table */}
        <div className="md:hidden">
          <div className="rounded-lg shadow-sm bg-white border-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="w-1/3 px-3 py-2 text-center font-medium">Working Days</th>
                  <th className="w-1/3 px-3 py-2 text-center font-medium">Gross Salary</th>
                  <th className="w-1/3 px-3 py-2 text-center font-medium">Total Pay</th>
                </tr>
              </thead>
              <tbody>
                {months.map((m, i) => (
                  <MobileMonthBlock key={i} {...m} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block">
          <div className="rounded-lg shadow-sm bg-white border">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="w-[96px] min-w-[96px]"></th>
                  <th className="w-1/5 min-w-[160px] px-4 py-3 text-center font-medium">Total Working Day</th>
                  <th className="w-1/5 min-w-[140px] px-4 py-3 text-center font-medium">Total Gross Salary</th>
                  <th className="w-1/5 min-w-[120px] px-4 py-3 text-center font-medium">Tax</th>
                  <th className="w-1/5 min-w-[120px] px-4 py-3 text-center font-medium">NSSF</th>
                  <th className="w-1/5 min-w-[140px] px-4 py-3 text-center font-medium">Total Pay</th>
                  <th className="w-[96px] min-w-[96px]"></th>
                </tr>
              </thead>
              <tbody>
                {months.map((m, i) => (
                  <DesktopMonthBlock key={i} {...m} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= Pieces ================= */

function Kpi({ label, value, valueClass = "" }) {
  return (
    <div className="border-0 shadow-none rounded-2xl bg-white">
      <div className="py-4 text-center">
        <div className="text-xs uppercase tracking-wide text-gray-600">{label}</div>
        <div className={`mt-1 text-lg sm:text-xl font-semibold ${valueClass}`}>{value}</div>
      </div>
    </div>
  );
}

function StackMetric({ label, value, valueClass = "" }) {
  return (
    <div>
      <div className="text-sm font-medium text-gray-600">{label}</div>
      <div className={`text-base font-semibold ${valueClass}`}>{value}</div>
    </div>
  );
}

/* ---- Desktop month rows ---- */
function DesktopMonthBlock({ month, workingDay, gross, tax, nssf, total }) {
  const isBlank = workingDay === "---";
  return (
    <>
      <tr className="bg-gray-100">
        <td colSpan={7} className="py-2 text-center text-sm font-medium text-gray-600">
          {month}
        </td>
      </tr>
      <tr className="hover:bg-gray-100 text-center border-b">
        <td className="py-3 w-[96px] min-w-[96px]"></td>
        <td className="py-3">{isBlank ? "---" : workingDay}</td>
        <td className="py-3">{isBlank ? "---" : gross}</td>
        <td className={`py-3 ${isBlank ? "" : "text-red-500"}`}>{isBlank ? "---" : tax}</td>
        <td className={`py-3 ${isBlank ? "" : "text-red-500"}`}>{isBlank ? "---" : nssf}</td>
        <td className="py-3">{isBlank ? "---" : total}</td>
        <td className="py-3 w-[96px] min-w-[96px]"></td>
      </tr>
    </>
  );
}

/* ---- Mobile month blocks ---- */
function MobileMonthBlock({ month, workingDay, gross, tax, nssf, total }) {
  const isBlank = workingDay === "---";
  return (
    <>
      {/* Big month row */}
      <tr className="bg-gray-100">
        <td colSpan={3} className="py-2 text-center text-sm font-semibold text-gray-600">
          {month}
        </td>
      </tr>
      {/* Main value row - no border */}
      <tr className="text-center border-0">
        <td className="py-3 border-0">{isBlank ? "---" : workingDay}</td>
        <td className="py-3 border-0">{isBlank ? "---" : gross}</td>
        <td className="py-3 border-0">{isBlank ? "---" : total}</td>
      </tr>
      {/* Sub-row: Tax & NSSF - only border at bottom */}
      <tr className="border-b border-t-0">
        <td colSpan={3} className="py-2 border-0">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div>
              <div className="text-xs font-medium text-gray-600">Tax</div>
              <div className={`text-sm font-semibold ${isBlank ? "" : "text-red-500"}`}>
                {isBlank ? "---" : tax}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-600">NSSF</div>
              <div className={`text-sm font-semibold ${isBlank ? "" : "text-red-500"}`}>
                {isBlank ? "---" : nssf}
              </div>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}