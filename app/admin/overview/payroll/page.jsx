"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { CreditCard, Settings, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
import CustomizeReportDialog from "./components/customize-report-dialog";
import UserProfileSection from "./components/user-profile-section";
import PayrollTable from "./components/payroll-table";
import {
  getCompanyPayrollDate,
  getDailyPayrollSummary,
} from "@/lib/api/adminPayroll";
import { useQuery } from "@tanstack/react-query";

export default function PayrollPage() {
  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Phnom_Penh",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
    [],
  );
  const formatDateKey = useCallback(
    (date) => formatter.format(date),
    [formatter],
  );

  const today = new Date();
  const [selectedRange, setSelectedRange] = useState({
    startDate: today,
    endDate: today,
    key: "selection",
  });
  const [selectedDateKey, setSelectedDateKey] = useState(formatDateKey(today));

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCustomizeDialog, setShowCustomizeDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const handleRowClick = (emp) => {
    setSelectedEmployee(emp);
  };

  const {
    data: payrollSummary,
    isLoading: isLoadingPayroll,
    error: payrollError,
    Paid,
  } = useQuery({
    queryKey: [
      "dailyPayrollSummary",
      selectedRange.startDate,
      selectedRange.endDate,
    ],
    queryFn: () =>
      getDailyPayrollSummary(
        formatDateKey(selectedRange.startDate),
        formatDateKey(selectedRange.endDate),
      ),
    enabled: Boolean(selectedRange.startDate && selectedRange.endDate),
  });

  const { data: companyPayrollDate } = useQuery({
    queryKey: ["companyPayrollDate"],
    queryFn: () => getCompanyPayrollDate(),
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
    const cambodiaNow = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Phnom_Penh" }),
    );
    const referenceDate = new Date(cambodiaNow);
    if (referenceDate.getDate() === startDay) {
      referenceDate.setDate(referenceDate.getDate() - 1);
    }
    const cycleStart = getCycleStartDate(referenceDate, startDay);
    setSelectedRange((prev) => {
      const prevStart = prev.startDate?.getTime?.() || 0;
      const prevEnd = prev.endDate?.getTime?.() || 0;
      if (
        prevStart === cycleStart.getTime() &&
        prevEnd === cambodiaNow.getTime()
      ) {
        return prev;
      }
      return { startDate: cycleStart, endDate: cambodiaNow, key: "selection" };
    });
    setSelectedDateKey(formatDateKey(cambodiaNow));
  }, [companyPayrollDate, formatDateKey]);

  const payrollRows = useMemo(() => {
    const records = Array.isArray(payrollSummary?.records)
      ? payrollSummary.records
      : [];
    return records.map((record, index) => {
      return {
        id: record.employee?._id || index,
        companyIdentifier: record.employee?.companyIdentifier || "--",
        profileImage: record.employee?.profileImg || "",
        name: record.employee?.name || "--",
        profile: record.employee?.profileImg || "",
        baseSalary: record.baseSalary ?? 0,
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
        netSalary: record.netSalary ?? 0,
      };
    });
  }, [payrollSummary]);

  const Filter = [
    { value: "Select all", label: "Select all" },
    { value: "All users group", label: "All users group" },
    { value: "Assigned features", label: "Assigned features" },
  ];

  return (
    <div>
      <div className="bg-white rounded-xl mb-3 shadow-md py-6 px-6 border">
        <div className="flex items-center justify-between p-5">
          <a href="/overview/payroll" className="block">
            <div className="flex items-center space-x-3 cursor-pointer">
              <CreditCard className="text-[#2998FF]" width={40} height={40} />
              <span className="font-custom text-3xl text-black">Payroll</span>
            </div>
          </a>
        </div>
      </div>

      {!selectedEmployee ? (
        <div className="bg-white rounded-xl shadow-md py-6 px-6 font-custom">
          {/* <div className="mb-4 relative">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center justify-between px-4 py-2 border text-sm bg-white shadow-sm rounded-full w-auto focus:outline-none"
            >
              {`${selectedRange.startDate.toLocaleDateString()} to ${selectedRange.endDate.toLocaleDateString()}`}
              <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
            </button>
            {showDatePicker && (
              <div className="absolute z-10 mt-2 bg-white shadow-lg border p-2 rounded-md">
                <DateRangePicker
                  ranges={[selectedRange]}
                  onChange={(ranges) => {
                    const newRange = ranges.selection;
                    setSelectedRange(newRange);
                    if (newRange?.startDate) {
                      setSelectedDateKey(formatDateKey(newRange.startDate));
                    }

                    const start = newRange.startDate;
                    const end = newRange.endDate;
                    if (start && end && start.getTime() !== end.getTime()) {
                      setShowDatePicker(false);
                    }
                  }}
                  rangeColors={["#3b82f6"]}
                />
              </div>
            )}
          </div> */}

          <PayrollTable
            rows={payrollRows}
            isLoading={isLoadingPayroll}
            errorMessage={payrollError?.message || ""}
          />

          {/* <div className="flex justify-center">
            <Button
              onClick={() => setDialogOpen(true)}
              className="mt-4 px-6 py-2 rounded-full bg-[#5494DA] shadow-lg hover:bg-blue-600 text-white"
            >
              + Add Payroll Table
            </Button>
          </div> */}
        </div>
      ) : (
        <UserProfileSection
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}
      <CustomizeReportDialog
        open={showCustomizeDialog}
        setOpen={setShowCustomizeDialog}
      />
    </div>
  );
}
