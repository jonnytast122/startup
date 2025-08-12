"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CreditCard, ChevronDown } from "lucide-react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format, parseISO, getISOWeek, isWithinInterval } from "date-fns";

/* helpers */
const pad = (n) => String(n).padStart(2, "0");
const minToHHMM = (m) =>
  m == null ? "--" : `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
const usdToComma = (n) =>
  n == null ? "--" : `$ ${n.toFixed(2).replace(".", ",")}`;

function DayRow({ date, workMin, breakMin, paidUsd, noteLeft, noteRight }) {
  const d = parseISO(date);
  return (
    <div className="grid grid-cols-[64px_1fr] items-center gap-4">
      <div className="text-center">
        <div className="text-[18px] leading-none text-gray-700 font-custom">
          {format(d, "d")}
        </div>
        <div className="text-xs text-gray-500 font-custom -mt-0.5">
          {format(d, "EEE")}
        </div>
      </div>

      {noteLeft || noteRight ? (
        <div className="py-1 text-sm font-custom">
          <span className="text-blue-500">{noteLeft}</span>
          {noteRight && (
            <span className="float-right text-blue-500">{noteRight}</span>
          )}
        </div>
      ) : (
        <div className="rounded-2xl bg-gray-100 px-6 py-4">
          <div className="grid grid-cols-3 text-center gap-3">
            <div>
              <div className="text-gray-500 text-sm font-custom">
                Work hours
              </div>
              <div className="text-[18px] font-semibold text-gray-800 font-custom">
                {minToHHMM(workMin)}
              </div>
            </div>
            <div>
              <div className="text-gray-500 text-sm font-custom">
                Break hours
              </div>
              <div className="text-[18px] font-semibold text-gray-800 font-custom">
                {minToHHMM(breakMin)}
              </div>
            </div>
            <div>
              <div className="text-gray-500 text-sm font-custom">
                Total paid
              </div>
              <div className="text-[18px] font-semibold text-gray-800 font-custom">
                {usdToComma(paidUsd)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const WeekTotal = ({ minutes }) => (
  <div className="text-center my-2">
    <span className="font-custom text-gray-500">
      Week total{" "}
      <span className="text-gray-700 font-semibold">{minToHHMM(minutes)}</span>
    </span>
  </div>
);

export default function Payroll() {
  // demo summary (unchanged)
  const monthlyRate = 350;
  const hourlyRate = 1.45;
  const workedHours = 120;
  const targetHours = 240;
  const earnings = 174;
  const earningsTarget = 350;
  const monthlyTaxPct = 10;
  const monthlyTaxUSD = 3.5;
  const nssfUSD = 12;

  // date range (your picker)
  const [selectedRange, setSelectedRange] = useState({
    startDate: new Date(2025, 7, 1),
    endDate: new Date(2025, 9, 30),
    key: "selection",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target))
        setShowDatePicker(false);
    };
    if (showDatePicker) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [showDatePicker]);

  const periodLabel = useMemo(() => {
    const f = selectedRange.startDate?.toLocaleDateString("en-GB");
    const t = selectedRange.endDate?.toLocaleDateString("en-GB");
    return f && t ? `${f} to ${t}` : "Select period";
  }, [selectedRange]);

  const allRows = useMemo(() => {
    const today = new Date();

    const formatDate = (date) => date.toISOString().split("T")[0];

    const addDays = (date, days) => {
      const d = new Date(date);
      d.setDate(d.getDate() + days);
      return d;
    };

    const rows = [];
    const totalRecords = 55; // between 50–60

    for (let i = 0; i < totalRecords; i++) {
      const currentDate = addDays(today, i);

      // Random realistic values
      const workHours = Math.floor(Math.random() * 5) + 4; // 4–8 hours
      const workMinutes = Math.floor(Math.random() * 60); // 0–59 mins
      const breakMinutes = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
      const paidUsd = parseFloat(
        (
          (workHours + workMinutes / 60) *
          (0.75 + Math.random() * 1.25)
        ).toFixed(2)
      );

      rows.push({
        date: formatDate(currentDate),
        workMin: workHours * 60 + workMinutes,
        breakMin: breakMinutes,
        paidUsd,
        // Occasionally add a note
        noteBefore:
          Math.random() < 0.15
            ? {
                left: "Time off",
                right: `${String(Math.floor(Math.random() * 3) + 6).padStart(
                  2,
                  "0"
                )}:00 (paid)`,
              }
            : undefined,
      });
    }

    return rows;
  }, []);

  // FILTER by selected range
  const filteredRows = useMemo(() => {
    const { startDate, endDate } = selectedRange;
    if (!startDate || !endDate) return allRows;
    return allRows.filter((r) =>
      isWithinInterval(parseISO(r.date), { start: startDate, end: endDate })
    );
  }, [allRows, selectedRange]);

  // GROUP by ISO week + totals (sorted weeks asc, days desc)
  const weekGroups = useMemo(() => {
    const m = new Map();
    filteredRows.forEach((r) => {
      const wk = getISOWeek(parseISO(r.date));
      if (!m.has(wk)) m.set(wk, []);
      m.get(wk).push(r);
    });
    return [...m.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([week, days]) => ({
        week,
        days: days.sort((a, b) => parseISO(b.date) - parseISO(a.date)),
        totalMinutes: days.reduce((sum, d) => sum + (d.workMin || 0), 0),
      }));
  }, [filteredRows]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl mb-3 shadow-md py-6 px-6 border">
        <div className="flex items-center space-x-3 p-5">
          <CreditCard className="text-[#2998FF]" width={40} height={40} />
          <span className="font-custom text-3xl text-black">Payroll</span>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left big card */}
          <div className="flex-1">
            <div className="bg-[#4F8BDB] text-white rounded-2xl p-8 min-h-[260px] flex flex-col justify-center">
              <div className="mx-auto mb-8 h-28 w-28 rounded-full bg-white/15 flex items-center justify-center">
                <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center">
                  <div className="h-12 w-12 rounded-xl border-2 border-[#4F8BDB] flex items-center justify-center">
                    <div className="h-0.5 w-6 bg-[#4F8BDB]" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-white/80 text-sm font-custom mb-1">
                    Monthly rate
                  </div>
                  <div className="text-2xl font-semibold font-custom tracking-wide">
                    {monthlyRate} USD
                  </div>
                </div>
                <div>
                  <div className="text-white/80 text-sm font-custom mb-1">
                    Hourly rate
                  </div>
                  <div className="text-2xl font-semibold font-custom tracking-wide">
                    {hourlyRate.toFixed(2)} USD
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex-[1.2] flex flex-col gap-6">
            {/* Pay period picker */}
            <div className="flex items-start justify-between gap-4">
              <div className="text-[#3E435D] font-custom pt-2">Pay period:</div>
              <div className="relative">
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="flex items-center font-custom justify-between px-4 py-2 border rounded-md text-sm bg-white shadow-sm w-full sm:w-auto"
                >
                  {periodLabel}
                  <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
                </button>
                {showDatePicker && (
                  <div
                    ref={datePickerRef}
                    className="absolute right-0 font-custom z-10 mt-2 bg-white shadow-lg border p-2 rounded-md"
                  >
                    <DateRangePicker
                      ranges={[selectedRange]}
                      onChange={(ranges) => {
                        const next = ranges.selection;
                        setSelectedRange(next);
                        if (
                          next.startDate &&
                          next.endDate &&
                          next.startDate.getTime() !== next.endDate.getTime()
                        ) {
                          setShowDatePicker(false);
                        }
                      }}
                      moveRangeOnFirstSelection={false}
                      showMonthAndYearPickers
                      showSelectionPreview
                      rangeColors={["#3b82f6"]}
                      months={2}
                      direction="horizontal"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="rounded-2xl bg-gray-100 px-8 py-6 text-center">
                <div className="text-[44px] leading-none font-light font-custom text-[#3B8AFF]">
                  {workedHours}
                </div>
                <div className="text-gray-500 font-custom text-lg -mt-1">
                  / {targetHours}
                </div>
              </div>
              <div className="rounded-2xl bg-gray-100 px-8 py-6 text-center">
                <div className="text-[44px] leading-none font-light font-custom text-[#FF8A4A]">
                  {earnings}
                </div>
                <div className="text-gray-500 font-custom text-lg -mt-1">
                  / {earningsTarget}
                </div>
              </div>
            </div>

            {/* Others */}
            <div className="mt-2">
              <div className="font-custom text-[#3E435D] mb-3">Others</div>
              <div className="divide-y">
                <div className="py-3 grid grid-cols-[1fr_auto_auto] gap-3 items-center">
                  <div className="text-gray-600 font-custom">Monthly tax</div>
                  <div className="text-gray-500 font-custom text-sm justify-self-end">
                    {monthlyTaxPct}%
                  </div>
                  <div className="text-gray-700 font-custom justify-self-end">
                    {monthlyTaxUSD} USD
                  </div>
                </div>
                <div className="py-3 grid grid-cols-[1fr_auto_auto] gap-3 items-center">
                  <div className="text-gray-600 font-custom">NSSF</div>
                  <div className="text-gray-500 font-custom text-sm justify-self-end" />
                  <div className="text-gray-700 font-custom justify-self-end">
                    {nssfUSD} USD
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment sheets — filtered by date range */}
        <div className="mt-10">
          <h2 className="text-center font-custom text-xl text-gray-700 mb-5">
            Payment sheets
          </h2>
          <div className="rounded-2xl border border-gray-200 p-4">
            {weekGroups.length === 0 ? (
              <div className="text-center text-gray-500 font-custom py-8">
                No entries in this period.
              </div>
            ) : (
              weekGroups.map((g, gi) => (
                <div key={g.week} className={gi > 0 ? "mt-4" : ""}>
                  {g.days.map((d, i) => (
                    <div key={`${d.date}-${i}`} className={i > 0 ? "mt-3" : ""}>
                      {d.noteBefore ? (
                        <DayRow
                          date={d.date}
                          noteLeft={d.noteBefore.left}
                          noteRight={d.noteBefore.right}
                        />
                      ) : null}
                      <DayRow
                        date={d.date}
                        workMin={d.workMin}
                        breakMin={d.breakMin}
                        paidUsd={d.paidUsd}
                      />
                    </div>
                  ))}
                  <WeekTotal minutes={g.totalMinutes} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
