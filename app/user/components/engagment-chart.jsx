import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, LogOut } from "lucide-react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format, isWithinInterval } from "date-fns";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const EngagementChart = () => {
  const [role, setRole] = useState("All Users");
  const [selectedPeriod, setSelectedPeriod] = useState("Daily");
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [periodDropdownOpen, setPeriodDropdownOpen] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [selectedRange, setSelectedRange] = useState({
    startDate: new Date(2025, 2, 10),
    endDate: new Date(2025, 2, 20),
    key: "selection",
  });

  const handleSelect = (ranges) => {
    setSelectedRange(ranges.selection);
  };

  // Sample Data for Chart with Date Format dd/MM/yyyy
  const data = [
    { date: "09/03/2025", users: 120 },
    { date: "10/03/2025", users: 200 },
    { date: "11/03/2025", users: 180 },
    { date: "12/03/2025", users: 120 },
    { date: "13/03/2025", users: 200 },
    { date: "14/03/2025", users: 180 },
    { date: "15/03/2025", users: 220 },
    { date: "16/03/2025", users: 150 },
    { date: "17/03/2025", users: 300 },
    { date: "18/03/2025", users: 250 },
    { date: "19/03/2025", users: 120 },
    { date: "20/03/2025", users: 200 },
    { date: "21/03/2025", users: 180 },
    { date: "22/03/2025", users: 220 },
    { date: "23/03/2025", users: 150 },
    { date: "24/03/2025", users: 300 },
    { date: "25/03/2025", users: 250 },
  ];

  // Filter Data Based on Selected Date Range
  const filteredData = data.filter((d) => {
    const dDate = new Date(d.date.split("/").reverse().join("-"));
    return isWithinInterval(dDate, {
      start: selectedRange.startDate,
      end: selectedRange.endDate,
    });
  });

  return (
    <div>
      <h2 className="text-2xl font-custom font-medium mb-4 text-black">Engagement</h2>
      <div className="flex justify-between items-center mb-4 relative">
        <div className="relative">
          <button
            onClick={() => {
              setRoleDropdownOpen(!roleDropdownOpen);
              setPeriodDropdownOpen(false);
            }}
            className="flex items-center justify-between w-32 px-3 py-1.5 border rounded-md text-sm bg-white shadow-sm"
          >
            {role}
            <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${roleDropdownOpen ? "rotate-180" : ""}`} />
          </button>
          {roleDropdownOpen && (
            <div className="absolute left-0 mt-2 w-32 bg-white shadow-lg border rounded-md z-50">
              {["All Users", "All Admin"].map((r) => (
                <button
                  key={r}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                  onClick={() => {
                    setRole(r);
                    setRoleDropdownOpen(false);
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => {
                setPeriodDropdownOpen(!periodDropdownOpen);
                setRoleDropdownOpen(false);
              }}
              className="flex items-center justify-between w-28 px-3 py-1.5 border rounded-md text-sm bg-white shadow-sm"
            >
              {selectedPeriod}
              <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${periodDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {periodDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg border rounded-md z-50">
                {["Daily", "Weekly", "Monthly", "Yearly"].map((period) => (
                  <button
                    key={period}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                    onClick={() => {
                      setSelectedPeriod(period);
                      setPeriodDropdownOpen(false);
                    }}
                  >
                    {period}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setShowDatePicker(!showDatePicker);
                setRoleDropdownOpen(false);
                setPeriodDropdownOpen(false);
              }}
              className="flex items-center justify-between w-auto px-5 py-1.5 border rounded-md text-sm bg-white shadow-sm"
            >
              {`${format(selectedRange.startDate, "dd/MM/yyyy")} to ${format(selectedRange.endDate, "dd/MM/yyyy")}`}
              <ChevronDown className={`h-4 w-4 ml-2 text-gray-500 transition-transform ${showDatePicker ? "rotate-180" : ""}`} />
            </button>
            {showDatePicker && (
              <div className="absolute text-xs right-0 mt-2 bg-white shadow-lg border p-2 rounded-md z-50">
                <DateRange ranges={[selectedRange]} onChange={handleSelect} rangeColors={["#3b82f6"]} />
              </div>
            )}
          </div>
        </div>
      </div>

      <CardContent className="h-80 bg-white rounded-lg p-4 relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
            <XAxis dataKey="date" stroke="#000000" tick={{ fontSize: 12 }} />
            <YAxis stroke="#000000" tick={{ fontSize: 12 }}/>
            <Tooltip />
            <CartesianGrid strokeDasharray="3 3" />
            <Line type="monotone" dataKey="users" stroke="#4F46E5" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </div>
  );
};

export default EngagementChart;
