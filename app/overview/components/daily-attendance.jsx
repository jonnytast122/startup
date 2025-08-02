import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ListFilter } from "lucide-react";
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

const COLORS_ATTEND = ["#22c55e", "#ef4444"];
const COLORS_ABSENT = ["#3b82f6", "#facc15"];

const totalAttend = attendanceData.reduce((acc, cur) => acc + cur.value, 0);
const totalAbsent = absentData.reduce((acc, cur) => acc + cur.value, 0);
const onTime = attendanceData.find(d => d.name === "On Time")?.value || 0;
const runningLate = attendanceData.find(d => d.name === "Running Late")?.value || 0;
const noActive = absentData.find(d => d.name === "No Active")?.value || 0;
const onLeave = absentData.find(d => d.name === "On Leave")?.value || 0;

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
            <span className="px-2 py-0.5 rounded-md text-2xl text-blue-500 bg-blue-200">{totalAttend}</span>
          </div>
          <div className="flex justify-between text-base text-gray-700">
            <div className="flex flex-col items-center">
              <span className="text-base">On Time</span>
              <span className="text-3xl font-bold text-green-500">{onTime}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-base">Running Late</span>
              <span className="text-3xl font-bold text-red-500">{runningLate}</span>
            </div>
          </div>
          <div className="mt-4 w-full h-48"> {/* increased from h-40 to h-72 */}
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}      // slightly larger inner radius
                  outerRadius={80}      // increased outer radius
                  dataKey="value"
                >
                  {attendanceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
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
            <span className="px-2 py-0.5 rounded-md text-2xl text-red-500 bg-red-200">{totalAbsent}</span>
          </div>
          <div className="flex justify-between text-base text-gray-700">
            <div className="flex flex-col items-center">
              <span className="text-base">No Active</span>
              <span className="text-3xl font-bold text-blue-500">{noActive}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-base">On Leave</span>
              <span className="text-3xl font-bold text-yellow-400">{onLeave}</span>
            </div>
          </div>
          <div className="mt-4 w-full h-48"> {/* increased from h-40 to h-72 */}
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
                    <Cell key={`cell-${index}`} fill={COLORS_ABSENT[index % COLORS_ABSENT.length]} />
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