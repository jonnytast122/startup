"use client";

import { Separator } from "@/components/ui/separator";
import { ListFilter } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const attendanceData = [
  { name: "On Time", value: 5 },
  { name: "Running Late", value: 1 },
];

const absentData = [
  { name: "No Active", value: 1 },
  { name: "On Leave", value: 3 },
];

const COLORS_ATTEND = ["#22c55e", "#ef4444"]; // green, red
const COLORS_ABSENT = ["#3b82f6", "#facc15"]; // blue, yellow

const totalAttend = attendanceData.reduce((a, c) => a + c.value, 0);
const totalAbsent = absentData.reduce((a, c) => a + c.value, 0);
const onTime = attendanceData.find((d) => d.name === "On Time")?.value || 0;
const runningLate =
  attendanceData.find((d) => d.name === "Running Late")?.value || 0;
const noActive = absentData.find((d) => d.name === "No Active")?.value || 0;
const onLeave = absentData.find((d) => d.name === "On Leave")?.value || 0;

export default function DailyAttendance() {
  const Filter = [
    { value: "Select all", label: "Select all" },
    { value: "All users group", label: "All users group" },
    { value: "Assigned features", label: "Assigned features" },
  ];

  return (
    <div className="bg-white rounded-lg p-5 h-full font-custom">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl text-black">Daily Attendance</h2>
        <Select>
          <SelectTrigger className="w-28 rounded-full flex items-center gap-2 text-[#5494DA]">
            <ListFilter size={18} />
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent className="font-custom">
            {Filter.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator className="mb-4" />

      {/* Outer padding creates left/right margins on md+ */}
      <div className="px-0 md:px-10">
        {/* Two equal columns on md+; single column on small */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-12">
          {/* Attend Card */}
          <div className="border rounded-2xl p-5 w-full">
            {/* Title + pill */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <h3 className="text-[20px] leading-none text-black">Attend</h3>
              <span className="px-2 py-0.5 rounded-md text-[18px] leading-none text-blue-600 bg-blue-100">
                {totalAttend}
              </span>
            </div>

            {/* Labels + numbers */}
            <div className="flex items-start justify-around mt-2 mb-2">
              <div className="flex flex-col items-center">
                <span className="text-sm text-green-600 mb-1">On Time</span>
                <span className="text-4xl font-semibold text-black">
                  {onTime}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-sm text-red-500 mb-1">Running Late</span>
                <span className="text-4xl font-semibold text-black">
                  {runningLate}
                </span>
              </div>
            </div>

            {/* Donut */}
            <div className="mt-3 w-full h-44 md:h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    cornerRadius={6}
                    dataKey="value"
                    stroke="#ffffff"
                    strokeWidth={4}
                  >
                    {attendanceData.map((_, i) => (
                      <Cell
                        key={`attend-${i}`}
                        fill={COLORS_ATTEND[i % COLORS_ATTEND.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Absent Card */}
          <div className="border rounded-2xl p-5 w-full">
            {/* Title + pill */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <h3 className="text-[20px] leading-none text-black">Absent</h3>
              <span className="px-2 py-0.5 rounded-md text-[18px] leading-none text-red-600 bg-red-100">
                {totalAbsent}
              </span>
            </div>

            {/* Labels + numbers */}
            <div className="flex items-start justify-around mt-2 mb-2">
              <div className="flex flex-col items-center">
                <span className="text-sm text-blue-600 mb-1">No Active</span>
                <span className="text-4xl font-semibold text-black">
                  {noActive}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-sm text-yellow-500 mb-1">On Leave</span>
                <span className="text-4xl font-semibold text-black">
                  {onLeave}
                </span>
              </div>
            </div>

            {/* Donut */}
            <div className="mt-3 w-full h-44 md:h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={absentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    cornerRadius={6}
                    dataKey="value"
                    stroke="#ffffff"
                    strokeWidth={4}
                  >
                    {absentData.map((_, i) => (
                      <Cell
                        key={`absent-${i}`}
                        fill={COLORS_ABSENT[i % COLORS_ABSENT.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
