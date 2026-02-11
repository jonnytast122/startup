"use client";
import * as XLSX from "xlsx";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, ListFilter, Search } from "lucide-react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import {
  getCompanyPayrollDate,
  finalizePayrollSummary,
  getDailyPayrollSummary,
} from "@/lib/api/adminPayroll";
import { FaSpinner } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const Filter = [
  { value: "Select all", label: "Select all" },
  { value: "All users group", label: "All users group" },
  { value: "Assigned features", label: "Assigned features" },
];

const exportOptions = [
  { value: "payroll_xls", label: "Payroll (XLSX)" },
  { value: "payroll_csv", label: "Payroll (CSV)" },
  { value: "ibanking_xls", label: "IBanking (XLSX)" },
  { value: "ibanking_csv", label: "IBanking (CSV)" },
  { value: "nssf_xls", label: "NSSF (XLSX)" },
  { value: "nssf_csv", label: "NSSF (CSV)" },
];

const exportPayrollToExcel = (data, fileName = "payroll.xlsx") => {
  const headers = [
    "Company ID",
    "Fullname",
    "Base Salary",
    "Cash",
    "IBanking",
    "Bonus",
    "OT",
    "NSSF Rate",
    "Tax Rate",
    "Unpaid Leave",
    "NSSF Expense",
    "Tax Rate (%)",
    "Tax Expense",
    "Net Pay",
  ];

  const rows = data.map((row) => [
    row.companyIdentifier ?? "--",
    row.name ?? "--",
    row.baseSalary ?? 0,
    row.cash ?? 0,
    row.ibanking ?? 0,
    row.bonus ?? 0,
    row.ot ?? 0,
    row.nssfRate ?? "--",
    row.taxRate ?? "--",
    row.unpaidLeave ?? 0,
    row.nssfExpense ?? 0,
    row.taxRatePercent ?? "--",
    row.taxExpense ?? 0,
    row.netSalary ?? 0,
  ]);

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  worksheet["!cols"] = headers.map(() => ({ wch: 18 }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Payroll");
  XLSX.writeFile(workbook, fileName);
};

const exportIbankingToExcel = (data, fileName = "ibanking.xlsx") => {
  const headers = [
    "Name",
    "Employee Id",
    "Account Number",
    "Amount",
    "Remarks",
  ];
  const rows = data.map((row) => [
    row.name ?? "--",
    row.companyIdentifier ?? "--",
    row.accountNumber ?? "--",
    row.netSalary ?? 0,
    "",
  ]);
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  worksheet["!cols"] = headers.map(() => ({ wch: 20 }));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "IBanking");
  XLSX.writeFile(workbook, fileName);
};

const exportNssfToExcel = (data, fileName = "nssf.xlsx") => {
  const headers = [
    "ល.រ No.",
    "អត្ត.បុគ្គលិករបស់សហគ្រាស (Employee ID)",
    "អត្ត.សមាជិកប.ស.ស. (NSSF Member ID)",
    "គោតនាម នាម Name in Khmer",
    "គោតនាម នាមឡាតាំង Name in English",
    "ភេទ Gender",
    "ថ្ងៃខែឆ្នាំកំណើត Date of birth",
    "ប្រាក់បៀវត្ស(រៀល) Salary",
    "ប្រាក់បៀវត្ស(ដុល្លារ) Salary",
    "ស្ថានភាព Status",
  ];

  const rows = data.map((row, index) => [
    index + 1,
    row.companyIdentifier ?? "--",
    row.nssfMemberId ?? "--",
    row.nameKhmer ?? "--",
    row.name ?? "--",
    row.gender === "male" ? "M" : row.gender === "female" ? "F" : "--",
    row.dateOfBirth && !Number.isNaN(new Date(row.dateOfBirth).getTime())
      ? format(new Date(row.dateOfBirth), "dd-MMM-yyyy").toUpperCase()
      : "--",
    row.salaryKhr ?? 0,
    row.baseSalary ?? 0,
    row.status ?? "--",
  ]);

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  worksheet["!cols"] = headers.map(() => ({ wch: 22 }));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "NSSF");
  XLSX.writeFile(workbook, fileName);
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

const columns = [
  {
    accessorKey: "profile",
    header: "",
    cell: ({ row }) => {
      const [imageError, setImageError] = React.useState(false);
      const profile = row.original.profile;
      const name = row.original.name || "";
      const initials = name
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0].toUpperCase())
        .slice(0, 2)
        .join("");

      return (
        <div className="flex justify-center items-center w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
          {profile && !imageError ? (
            <img
              src={profile}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <span className="text-xs text-gray-600 font-medium">
              {initials}
            </span>
          )}
        </div>
      );
    },
  },
  { accessorKey: "name", header: "Fullname" },
  { accessorKey: "companyIdentifier", header: "Company ID" },
  { accessorKey: "profileImg", header: "" },
  {
    accessorKey: "isRequiredToCheckIn",
    header: "Check-in",
    cell: ({ row }) => {
      const val = row.original.isRequiredToCheckIn;
      const isYes = val === "Yes";
      return (
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
            isYes ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
          }`}
        >
          {val}
        </span>
      );
    },
  },

  { accessorKey: "baseSalary", header: "Base Salary" },
  { accessorKey: "cash", header: "Cash" },
  { accessorKey: "ibanking", header: "IBanking" },
  { accessorKey: "bonus", header: "Bonus" },
  { accessorKey: "ot", header: "OT" },
  {
    accessorKey: "nssfRate",
    header: "NSSF Rate",
  },
  { accessorKey: "taxRate", header: "Tax Rate" },
  { accessorKey: "unpaidLeave", header: "Unpaid Leave" },
  {
    accessorKey: "nssfExpense",
    header: "NSSF Expense",
    cell: ({ row }) => {
      const val = row.original.nssfExpense;
      return (
        <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-semibold">
          {val}
        </span>
      );
    },
  },
  { accessorKey: "taxRatePercent", header: "Tax Rate (%)" },
  {
    accessorKey: "taxExpense",
    header: "Tax Expense",
    cell: ({ row }) => {
      const val = row.original.taxExpense;
      return (
        <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-semibold">
          {val}
        </span>
      );
    },
  },
  { accessorKey: "estimatedNetPay", header: "Estimated Net Pay" },
  { accessorKey: "netSalary", header: "Net Pay" },
];

const PayrollDatePicker = React.memo(function PayrollDatePicker({
  open,
  anchorRef,
  initialRange,
  minDate,
  maxDate,
  onApply,
}) {
  const [draftRange, setDraftRange] = useState(initialRange);

  useEffect(() => {
    if (open) setDraftRange(initialRange);
  }, [open, initialRange]);

  if (!open) return null;

  return (
    <div
      ref={anchorRef}
      className="absolute mt-2 bg-white shadow-lg border p-2 rounded-md z-10 font-custom"
    >
      <DateRange
        ranges={[draftRange]}
        minDate={minDate}
        maxDate={maxDate}
        onChange={(ranges) => {
          const nextRange = ranges.selection;
          setDraftRange(nextRange);
          const start = nextRange?.startDate;
          const end = nextRange?.endDate;
          if (start && end && start.getTime() !== end.getTime()) {
            onApply(nextRange);
          }
        }}
        rangeColors={["#3b82f6"]}
      />
    </div>
  );
});

const PayrollDataTable = React.memo(function PayrollDataTable({
  rows,
  isLoading,
  payrollError,
}) {
  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="rounded-md border mt-6 overflow-x-auto">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="bg-gray-200 text-dark-blue"
            >
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="whitespace-nowrap px-2 min-w-[50px] w-[50px] text-md"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="py-10">
                <div className="flex items-center justify-center w-full">
                  <FaSpinner className="animate-spin text-blue-500 text-4xl" />
                </div>
              </TableCell>
            </TableRow>
          ) : payrollError?.message ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center text-sm text-red-500"
              >
                {payrollError.message}
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center text-sm text-gray-500"
              >
                No payroll records.
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="font-custom text-md whitespace-nowrap overflow-hidden text-ellipsis"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
});

export default function PayrollTable({
  onRangeChange,
  taxExchangeRate,
  nssfExchangeRate,
}) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [page, setPage] = useState(0);
  const [useCustomRange, setUseCustomRange] = useState(false);
  const [isFinalized, setIsFinalized] = useState(false);
  const queryClient = useQueryClient();
  const cambodiaNow = useMemo(
    () =>
      new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Phnom_Penh" }),
      ),
    [],
  );

  const { data: companyPayrollDate } = useQuery({
    queryKey: ["companyPayrollDate"],
    queryFn: () => getCompanyPayrollDate(),
  });

  const formatDateKey = useMemo(
    () => (date) =>
      new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Phnom_Penh",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(date),
    [],
  );

  const [selectedRange, setSelectedRange] = useState({
    startDate: cambodiaNow,
    endDate: cambodiaNow,
    key: "selection",
  });
  const [cycleStartDate, setCycleStartDate] = useState(null);
  const [defaultRange, setDefaultRange] = useState({
    startDate: cambodiaNow,
    endDate: cambodiaNow,
    key: "selection",
  });

  const getCycleStartDate = (date, startDay) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    let targetYear = year;
    let targetMonth = month;
    if (day < startDay) {
      targetMonth -= 1;
      if (targetMonth < 0) {
        targetMonth = 11;
        targetYear -= 1;
      }
    }

    const daysInTargetMonth = new Date(
      targetYear,
      targetMonth + 1,
      0,
    ).getDate();
    const startDayClamped = Math.min(startDay, daysInTargetMonth);
    return new Date(targetYear, targetMonth, startDayClamped);
  };

  useEffect(() => {
    const startDay = Number(companyPayrollDate?.startDay);
    if (!startDay) return;
    const referenceDate = new Date(cambodiaNow);
    if (referenceDate.getDate() === startDay) {
      referenceDate.setDate(referenceDate.getDate() - 1);
    }
    const cycleStart = getCycleStartDate(referenceDate, startDay);
    setCycleStartDate(cycleStart);
    setDefaultRange({
      startDate: cycleStart,
      endDate: cambodiaNow,
      key: "selection",
    });
    setSelectedRange((prev) => ({
      ...prev,
      startDate: cycleStart,
      endDate: cambodiaNow,
    }));
  }, [companyPayrollDate, cambodiaNow]);

  const effectiveRange = useMemo(
    () => (useCustomRange ? selectedRange : defaultRange),
    [defaultRange, selectedRange, useCustomRange],
  );

  useEffect(() => {
    if (!onRangeChange) return;
    if (!effectiveRange.startDate || !effectiveRange.endDate) return;
    onRangeChange({
      startDate: effectiveRange.startDate,
      endDate: effectiveRange.endDate,
    });
    setIsFinalized(false);
  }, [effectiveRange.endDate, effectiveRange.startDate, onRangeChange]);

  const rangeStartKey = effectiveRange.startDate
    ? formatDateKey(effectiveRange.startDate)
    : "";
  const rangeEndKey = effectiveRange.endDate
    ? formatDateKey(effectiveRange.endDate)
    : "";

  const {
    data: payrollSummary,
    isLoading,
    error: payrollError,
  } = useQuery({
    queryKey: ["dailyPayrollSummary", rangeStartKey, rangeEndKey],
    queryFn: () => getDailyPayrollSummary(rangeStartKey, rangeEndKey),
    enabled: Boolean(rangeStartKey && rangeEndKey),
  });
  const rows = useMemo(() => {
    const records = Array.isArray(payrollSummary?.records)
      ? payrollSummary.records
      : [];
    return records.map((record, index) => ({
      id: record.employee?._id || index,
      companyIdentifier: record.employee?.companyIdentifier || "--",
      profile: record.employee?.profileImg || "",
      name: record.employee?.name || "--",
      nameKhmer: record.employee?.otherName || "--",
      isRequiredToCheckIn: record.employee?.isRequiredToCheckIn ? "Yes" : "No",
      nssfMemberId: record.employee?.nssfId || "--",
      gender: record.employee?.gender || "--",
      dateOfBirth: record.employee?.dateOfBirth || "--",
      status: record.employee?.isActive === false ? "Inactive" : "Active",
      accountNumber: record.bankDetails?.accountNumber || "--",
      baseSalary: record.baseSalary ?? 0,
      salaryKhr:
        record.baseSalary && record.nssfExchangeRate
          ? record.baseSalary * record.nssfExchangeRate
          : 0,
      cash: record.cashAmount ?? 0,
      ibanking: record.ibankingAmount ?? 0,
      bonus: 0,
      ot: record.overtimePay ?? 0,
      nssfRate: record.nssfExchangeRate ?? "--",
      taxRate: record.taxExchangeRate ?? "--",
      unpaidLeave: record.leaveDeduction ?? 0,
      nssfExpense: record.nssfAmount ?? 0,
      taxRatePercent: "--",
      taxExpense: record.taxAmount ?? 0,
      estimatedNetPay: record.netDaily ?? 0,
      netSalary: isFinalized ? (record.netSalary ?? 0) : "--",
    }));
  }, [isFinalized, payrollSummary]);

  const finalizeMutation = useMutation({
    mutationFn: finalizePayrollSummary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dailyPayrollSummary"] });
      setIsFinalized(true);
    },
  });

  const datePickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const usersPerPage = 8;
  const paginatedRows = rows.slice(
    page * usersPerPage,
    (page + 1) * usersPerPage,
  );

  return (
    <div className="bg-white">
      {/* Header Controls */}
      <div className="flex justify-between items-center my-4">
        {/* Left: Groups Select */}
        <div className="flex w-full sm:w-auto gap-4">
          {/* <Select>
            <SelectTrigger className="w-25 font-custom rounded-full flex items-center gap-2 relative">
              <ListFilter className="text-blue-500" size={20} />
              <SelectValue className="text-blue-500" placeholder="Filter" />
            </SelectTrigger>
            <SelectContent className="font-custom">
              {Filter.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}

          <div className="relative flex items-center gap-3">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="px-4 py-2 border rounded-full text-sm bg-white border-gray-400 shadow-sm font-custom"
            >
              <ChevronLeft className="inline-block w-4 h-4 mb-1 mr-3" />
              {format(selectedRange.startDate, "MMM dd")} -{" "}
              {format(selectedRange.endDate, "MMM dd")}
              <ChevronRight className="inline-block w-4 h-4 mb-1 ml-3" />
            </button>

            <PayrollDatePicker
              open={showDatePicker}
              anchorRef={datePickerRef}
              initialRange={selectedRange}
              minDate={undefined}
              maxDate={undefined}
              onClose={() => setShowDatePicker(false)}
              onApply={(nextRange) => {
                const nextStart =
                  nextRange?.startDate || selectedRange.startDate;
                const nextEnd = nextRange?.endDate || selectedRange.endDate;
                setSelectedRange({
                  startDate: nextStart,
                  endDate: nextEnd,
                  key: "selection",
                });
                setUseCustomRange(true);
                setShowDatePicker(false);
              }}
            />
            <Button
              onClick={() => {
                const today = new Date(
                  new Date().toLocaleString("en-US", {
                    timeZone: "Asia/Phnom_Penh",
                  }),
                );
                const startDay = Number(companyPayrollDate?.startDay);
                const referenceDate = new Date(today);
                if (startDay && referenceDate.getDate() === startDay) {
                  referenceDate.setDate(referenceDate.getDate() - 1);
                }
                const cycleStart = startDay
                  ? getCycleStartDate(referenceDate, startDay)
                  : today;
                setCycleStartDate(cycleStart);
                setDefaultRange({
                  startDate: cycleStart,
                  endDate: today,
                  key: "selection",
                });
                setSelectedRange({
                  startDate: cycleStart,
                  endDate: today,
                  key: "selection",
                });
                setUseCustomRange(false);
              }}
            >
              Today
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-gray-400 font-custom"
              disabled={
                !rangeStartKey || !rangeEndKey || finalizeMutation.isPending
              }
              onClick={() => {
                finalizeMutation.mutate({
                  startDate: rangeStartKey,
                  endDate: rangeEndKey,
                  taxExchangeRate: taxExchangeRate
                    ? Number(taxExchangeRate)
                    : undefined,
                  nssfExchangeRate: nssfExchangeRate
                    ? Number(nssfExchangeRate)
                    : undefined,
                });
              }}
            >
              {finalizeMutation.isPending ? (
                <FaSpinner className="animate-spin text-blue-500 text-lg" />
              ) : (
                "Calculate"
              )}
            </Button>
          </div>
        </div>

        {/* Right: Search, Team, Export */}
        <div className="flex items-center space-x-2">
          {/* Search Input */}
          <div className="relative flex items-center ml-auto w-full sm:w-auto flex-1 max-w-md">
            <Search className="absolute left-3 text-gray-400" size={20} />
            <input
              type="text"
              value={""}
              className="font-custom w-full pl-10 text-sm border rounded-lg focus:outline-none focus:ring-1 font-custom focus:ring-blue-500 pr-12 py-2 px-3"
              placeholder="Search..."
            />
          </div>

          <Separator orientation="vertical" className="mr-2 h-10" />
          <Select
            onValueChange={(value) => {
              if (value === "payroll_xls") {
                exportPayrollToExcel(rows, "payroll.xlsx");
              } else if (value === "payroll_csv") {
                const headers = [
                  "Company ID",
                  "Fullname",
                  "Base Salary",
                  "Cash",
                  "IBanking",
                  "Bonus",
                  "OT",
                  "NSSF Rate",
                  "Tax Rate",
                  "Unpaid Leave",
                  "NSSF Expense",
                  "Tax Rate (%)",
                  "Tax Expense",
                  "Net Pay",
                ];
                const rowsData = rows.map((row) => [
                  row.companyIdentifier ?? "--",
                  row.name ?? "--",
                  row.baseSalary ?? 0,
                  row.cash ?? 0,
                  row.ibanking ?? 0,
                  row.bonus ?? 0,
                  row.ot ?? 0,
                  row.nssfRate ?? "--",
                  row.taxRate ?? "--",
                  row.unpaidLeave ?? 0,
                  row.nssfExpense ?? 0,
                  row.taxRatePercent ?? "--",
                  row.taxExpense ?? 0,
                  row.netSalary ?? 0,
                ]);
                exportToCsv(headers, rowsData, "payroll.csv");
              } else if (value === "ibanking_xls") {
                exportIbankingToExcel(rows, "ibanking.xlsx");
              } else if (value === "ibanking_csv") {
                const headers = [
                  "Name",
                  "Employee Id",
                  "Account Number",
                  "Amount",
                  "Remarks",
                ];
                const rowsData = rows.map((row) => [
                  row.name ?? "--",
                  row.companyIdentifier ?? "--",
                  row.accountNumber ?? "--",
                  row.netSalary ?? 0,
                  "",
                ]);
                exportToCsv(headers, rowsData, "ibanking.csv");
              } else if (value === "nssf_xls") {
                exportNssfToExcel(rows, "nssf.xlsx");
              } else if (value === "nssf_csv") {
                const headers = [
                  "ល.រ No.",
                  "អត្ត.បុគ្គលិករបស់សហគ្រាស (Employee ID)",
                  "អត្ត.សមាជិកប.ស.ស. (NSSF Member ID)",
                  "គោតនាម នាម Name in Khmer",
                  "គោតនាម នាមឡាតាំង Name in English",
                  "ភេទ Gender",
                  "ថ្ងៃខែឆ្នាំកំណើត Date of birth",
                  "ប្រាក់បៀវត្ស(រៀល) Salary",
                  "ប្រាក់បៀវត្ស(ដុល្លារ) Salary",
                  "ស្ថានភាព Status",
                ];
                const rowsData = rows.map((row, index) => [
                  index + 1,
                  row.companyIdentifier ?? "--",
                  row.nssfMemberId ?? "--",
                  row.nameKhmer ?? "--",
                  row.name ?? "--",
                  row.gender === "male"
                    ? "M"
                    : row.gender === "female"
                      ? "F"
                      : "--",
                  row.dateOfBirth &&
                  !Number.isNaN(new Date(row.dateOfBirth).getTime())
                    ? format(
                        new Date(row.dateOfBirth),
                        "dd-MMM-yyyy",
                      ).toUpperCase()
                    : "--",
                  row.salaryKhr ?? 0,
                  row.baseSalary ?? 0,
                  row.status ?? "--",
                ]);
                exportToCsv(headers, rowsData, "nssf.csv");
              }
            }}
          >
            <SelectTrigger className="w-32 font-custom rounded-full placeholder:text-blue-500">
              <SelectValue placeholder="Export" />
            </SelectTrigger>
            <SelectContent className="w-32 font-custom">
              {exportOptions.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Export Button */}
          {/* <Select>
            <SelectTrigger className="w-32 font-custom rounded-full">
              <SelectValue placeholder="Report" />
            </SelectTrigger>
            <SelectContent className="w-32 font-custom">
              {reportOptions.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}
        </div>
      </div>

      <Separator orientation="horizontal" className="w-full mb-5 bg-black" />
      <PayrollDataTable
        rows={paginatedRows}
        isLoading={isLoading}
        payrollError={payrollError}
      />

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
        >
          Previous
        </Button>
        <span className="font-custom text-gray-400">
          Page {page + 1} of {Math.ceil(rows.length / usersPerPage) || 1}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={(page + 1) * usersPerPage >= rows.length}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
