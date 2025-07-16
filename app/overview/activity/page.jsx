"use client"

import { ChartNoAxesGantt, Clock, Calendar, Users, LogOut } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format, isWithinInterval } from "date-fns";
import { Separator } from "@/components/ui/separator";

const categoryIcons = {
  "Clocked": <Clock className="text-white" size={20} />,
  "Schedule": <Calendar className="text-white" size={20} />,
  "Role": <Users className="text-white" size={20} />,
  "Export": <LogOut className="text-white" size={20} />
};

const categoryBackgrounds = {
  "Clocked": "bg-blue-500",
  "Schedule": "bg-orange-500",
  "Role": "bg-yellow-500",
  "Export": "bg-red-500"
};

const generateStaticActivity = () => {
  return [
    { date: "10/03/2025", time: "14:44", users: ["Pechmoleka Sareth", "Hai Lina"], activity: "has been auto clocked in", category: "Clocked" },
    { date: "10/03/2025", time: "14:44", users: ["Veiy Sokheng"], activity: "scheduled a meeting", category: "Schedule" },
    { date: "11/03/2025", time: "10:30", users: ["John Doe", "Teu Chomrong"], activity: "updated user role", category: "Role" },
    { date: "12/03/2025", time: "09:15", users: ["Jane Smith", "Alice Brown", "Veiy Sokheng"], activity: "exported a report", category: "Export" },
    { date: "12/03/2025", time: "11:20", users: ["Teu Chomrong"], activity: "has been auto clocked in", category: "Clocked" },
    { date: "13/03/2025", time: "16:50", users: ["Alice Brown", "Hai Lina"], activity: "scheduled a meeting", category: "Schedule" },
    { date: "14/03/2025", time: "12:20", users: ["Bob White", "Veiy Sokheng"], activity: "updated user role", category: "Role" },
    { date: "14/03/2025", time: "13:50", users: ["Hai Lina"], activity: "exported a report", category: "Export" },
    { date: "15/03/2025", time: "09:00", users: ["Teu Chomrong", "Pechmoleka Sareth"], activity: "has been auto clocked in", category: "Clocked" },
    { date: "16/03/2025", time: "10:00", users: ["Veiy Sokheng", "John Doe"], activity: "scheduled a meeting", category: "Schedule" },
    { date: "17/03/2025", time: "14:30", users: ["Teu Chomrong", "Jane Smith"], activity: "updated user role", category: "Role" },
    { date: "18/03/2025", time: "13:00", users: ["Veiy Sokheng"], activity: "exported a report", category: "Export" },
    { date: "19/03/2025", time: "15:20", users: ["Alice Brown", "Hai Lina", "Teu Chomrong"], activity: "has been auto clocked in", category: "Clocked" },
    { date: "20/03/2025", time: "08:10", users: ["Bob White", "Veiy Sokheng"], activity: "scheduled a meeting", category: "Schedule" }
  ];
};

export default function ActivityPage() {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedRange, setSelectedRange] = useState({
    startDate: new Date(2025, 2, 10),
    endDate: new Date(2025, 2, 30),
    key: "selection",
  });
  const [activityData] = useState(generateStaticActivity());

  const handleSelect = (ranges) => {
    setSelectedRange(ranges.selection);
  };

  const filteredActivities = activityData.filter((item) => {
    const activityDate = new Date(item.date.split("/").reverse().join("-"));
    return isWithinInterval(activityDate, {
      start: selectedRange.startDate,
      end: selectedRange.endDate,
    });
  });

  // Group activities by date
  const groupedActivities = filteredActivities.reduce((acc, item) => {
    const date = item.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});

  return (
    <div>
      <div className="bg-white rounded-xl mb-3 shadow-md py-6 px-6">
        <div className="flex items-center space-x-3 p-5">
          <ChartNoAxesGantt className='text-[#2998FF]' width={40} height={40} />
          <span className="font-custom text-3xl text-black">Activity</span>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-md py-6 px-6 relative">
        <h1 className="font-custom text-lg text-[#3F4648] inline-block mr-2">Date range:</h1>
        <button
          onClick={() => setShowDatePicker(!showDatePicker)}
          className="px-4 py-2 border rounded-md text-sm bg-white shadow-sm font-custom"
        >
          {format(selectedRange.startDate, "dd/MM/yyyy")}
          <span className="mx-2">to</span>
          {format(selectedRange.endDate, "dd/MM/yyyy")}
        </button>
        {showDatePicker && (
          <div className="font-custom absolute mt-2 bg-white shadow-lg border p-2 rounded-md z-50">
            <DateRange
              ranges={[selectedRange]}
              onChange={handleSelect}
              rangeColors={["#3b82f6"]}
            />
          </div>
        )}
        <Separator orientation="horizontal" className="my-2 w-full mb-4 mt-2" />

        {Object.keys(groupedActivities).length > 0 ? (
          Object.keys(groupedActivities).map((date, index) => (
            <div key={index} className="mb-4">
              <div className="font-custom bg-gray-200 text-gray-800 px-4 py-2 rounded-md inline-block mb-2 text-sm">
                {format(new Date(date.split("/").reverse().join("-")), "EEE dd/MM/yyyy")}
              </div>
              {groupedActivities[date].map((item, activityIndex) => (
                <div key={activityIndex} className="flex items-center space-x-4 p-2">
                  {/* Small circle indicator */}
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>

                  {/* Category icon */}
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full ${categoryBackgrounds[item.category]}`}>
                    {categoryIcons[item.category]}
                  </div>

                  {/* Overlapping user profiles */}
                  <div className="flex -space-x-4">
                    {item.users.slice(0, 3).map((user, userIndex) => (
                      <div
                        key={userIndex}
                        className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm text-white"
                        style={{ zIndex: item.users.length - userIndex }}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs text-white ${userIndex === 0 ? "bg-blue-500" : "bg-gray-400"
                          }`}>
                          {user[0]} {/* Displaying first letter of the user's name */}
                        </div>
                      </div>
                    ))}
                    {item.users.length > 3 && (
                      <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-xs text-white">
                        +{item.users.length - 3} {/* Showing the remaining users */}
                      </div>
                    )}
                  </div>

                  {/* Activity description */}
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {item.users.join(" & ")} {item.activity}
                    </p>
                    <p className="text-xs text-gray-500">on {item.date} at {item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No activities found for the selected date range.</p>
        )}
      </div>
    </div>
  );
}
