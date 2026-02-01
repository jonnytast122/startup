"use client";

import { CreditCard } from "lucide-react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import PayrollTable from "./components/payroll-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import {
  createCompanyPayrollDate,
  getCompanyPayrollDate,
} from "@/lib/api/adminPayroll";
import { FaSpinner } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function PayrollPage() {
  const queryClient = useQueryClient();
  const [startDay, setStartDay] = useState("");
  const [taxRate, setTaxRate] = useState("");
  const [nssfRate, setNssfRate] = useState("");
  const [selectedRange, setSelectedRange] = useState({
    startDate: null,
    endDate: null,
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

  const { data: companyPayrollDate } = useQuery({
    queryKey: ["companyPayrollDate"],
    queryFn: () => getCompanyPayrollDate(),
  });

  useEffect(() => {
    if (!companyPayrollDate) return;
    setStartDay(
      companyPayrollDate.startDay !== undefined
        ? String(companyPayrollDate.startDay)
        : "",
    );
    setTaxRate(
      companyPayrollDate.taxExchangeRate !== undefined
        ? String(companyPayrollDate.taxExchangeRate)
        : "",
    );
    setNssfRate(
      companyPayrollDate.nssfExchangeRate !== undefined
        ? String(companyPayrollDate.nssfExchangeRate)
        : "",
    );
    const startDayValue =
      companyPayrollDate.startDay !== undefined
        ? Number(companyPayrollDate.startDay)
        : null;
    if (!startDayValue) return;
    const now = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Phnom_Penh" }),
    );
    const referenceDate = new Date(now);
    if (referenceDate.getDate() === startDayValue) {
      referenceDate.setDate(referenceDate.getDate() - 1);
    }
    let targetYear = referenceDate.getFullYear();
    let targetMonth = referenceDate.getMonth();
    if (referenceDate.getDate() < startDayValue) {
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
    const startDayClamped = Math.min(startDayValue, daysInTargetMonth);
    const cycleStart = new Date(targetYear, targetMonth, startDayClamped);
    setSelectedRange((prev) =>
      prev.startDate && prev.endDate
        ? prev
        : { startDate: cycleStart, endDate: now },
    );
  }, [companyPayrollDate]);

  const updateCompanyPayrollDate = useMutation({
    mutationFn: createCompanyPayrollDate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyPayrollDate"] });
      queryClient.invalidateQueries({ queryKey: ["dailyPayrollSummary"] });
    },
  });

  const handleSave = async () => {
    const payload = {
      startDay: Number(startDay),
      taxExchangeRate: taxRate ? Number(taxRate) : undefined,
      nssfExchangeRate: nssfRate ? Number(nssfRate) : undefined,
    };
    await updateCompanyPayrollDate.mutateAsync(payload);
  };

  return (
    <div>
      <div className="bg-white flex flex-row justify-between rounded-xl mb-3 shadow-md py-6 px-6 border">
        <div className="flex items-center justify-between p-5">
          <a href="/overview/payroll" className="block">
            <div className="flex items-center space-x-3 cursor-pointer">
              <CreditCard className="text-[#2998FF]" width={40} height={40} />
              <span className="font-custom text-3xl text-black">Payroll</span>
            </div>
          </a>
        </div>

        <div className="text-gray-600 font-custom text-sm md:text-md lg:text-md px-5">
          <div className="flex items-start gap-3">
            <div className="flex flex-wrap items-center gap-4 w-2/3">
              <div className="flex items-center gap-2">
                <label className="text-sm text-[#3F4648]">NSSF Rate:</label>
                <Input
                  className="rounded-full px-4 py-2 text-sm w-[120px] border border-gray-300"
                  value={nssfRate}
                  onChange={(e) => setNssfRate(e.target.value)}
                  inputMode="numeric"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-[#3F4648]">Tax Rate:</label>
                <Input
                  className="rounded-full px-4 py-2 text-sm w-[120px] border border-gray-300"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  inputMode="numeric"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-[#3F4648]">Start Day:</label>
                <Input
                  className="rounded-full px-4 py-2 text-sm w-[50px] border border-gray-300"
                  value={startDay}
                  onChange={(e) => setStartDay(e.target.value)}
                  inputMode="numeric"
                />
                <span>th</span>
              </div>
              <Button
                className="rounded-full px-6"
                onClick={handleSave}
                disabled={!startDay || updateCompanyPayrollDate.isPending}
              >
                {updateCompanyPayrollDate.isPending ? (
                  <FaSpinner className="animate-spin text-white text-xl" />
                ) : (
                  "Update"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md py-6 px-6 font-custom">
        <PayrollTable
          onRangeChange={setSelectedRange}
          taxExchangeRate={taxRate}
          nssfExchangeRate={nssfRate}
        />
      </div>
    </div>
  );
}
