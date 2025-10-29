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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDailyAttendance } from "@/lib/api/adminOverview";

const COLORS_ATTEND = ["#22c55e", "#ef4444"]; // green (on time), red (late)
const COLORS_ABSENT = ["#3b82f6", "#facc15"]; // blue (absent), yellow (on leave)

export default function DailyAttendance() {
  const queryClient = useQueryClient();
  const company = queryClient.getQueryData(["company"]);

  const { data: dailyAttendance } = useQuery({
    queryKey: ["admin-dashboard-daily-attendance", company?.id],
    queryFn: () => getDailyAttendance(company.id),
    enabled: !!company?.id,
  });

  // Extract API data safely
  const stats = dailyAttendance?.data || {
    onTime: 0,
    late: 0,
    onLeave: 0,
    absent: 0,
  };

  // Compute totals
  const totalAttend = stats.onTime + stats.late;
  const totalAbsent = stats.absent + stats.onLeave;

  // Chart data
  const attendanceData = [
    { name: "On Time", value: stats.onTime },
    { name: "Late", value: stats.late },
  ];

  const absentData = [
    { name: "Absent", value: stats.absent },
    { name: "On Leave", value: stats.onLeave },
  ];

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
          <SelectTrigger className="w-25 font-custom rounded-full flex items-center gap-2 relative text-[#5494DA]">
            <ListFilter size={20} />
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent className="font-custom">
            {Filter.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator className="mb-4" />

      <div className="flex justify-center gap-2 mb-5">
        {/* Left Box: Attendance */}
        <div className="border rounded-lg p-4 w-[280px] ml-5">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h3 className="text-2xl text-black">Attend</h3>
            <span className="px-2 py-0.5 rounded-md text-2xl text-blue-500 bg-blue-200">
              {totalAttend}
            </span>
          </div>
          <div className="flex justify-between text-base text-gray-700">
            <div className="flex flex-col items-center">
              <span className="text-base">On Time</span>
              <span className="text-3xl font-bold text-green-500">
                {stats.onTime}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-base">Late</span>
              <span className="text-3xl font-bold text-red-500">
                {stats.late}
              </span>
            </div>
          </div>
          <div className="mt-4 w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                >
                  {attendanceData.map((entry, index) => (
                    <Cell
                      key={`cell-attend-${index}`}
                      fill={COLORS_ATTEND[index % COLORS_ATTEND.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Box: Absent */}
        <div className="border rounded-lg p-4 w-[280px] mr-5">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h3 className="text-2xl text-black">Absent</h3>
            <span className="px-2 py-0.5 rounded-md text-2xl text-red-500 bg-red-200">
              {totalAbsent}
            </span>
          </div>
          <div className="flex justify-between text-base text-gray-700">
            <div className="flex flex-col items-center">
              <span className="text-base">Absent</span>
              <span className="text-3xl font-bold text-blue-500">
                {stats.absent}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-base">On Leave</span>
              <span className="text-3xl font-bold text-yellow-400">
                {stats.onLeave}
              </span>
            </div>
          </div>
          <div className="mt-4 w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={absentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                >
                  {absentData.map((entry, index) => (
                    <Cell
                      key={`cell-absent-${index}`}
                      fill={COLORS_ABSENT[index % COLORS_ABSENT.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
