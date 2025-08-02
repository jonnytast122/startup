import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isToday } from "date-fns";
import { Separator } from "@/components/ui/separator";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const renderDays = () => {
    return dayNames.map((day, idx) => (
      <div
        key={idx}
        className={`text-center font-medium text-base ${day === "Sun" || day === "Sat" ? "text-blue-500" : "text-gray-700"}`}
      >
        {day}
      </div>
    ));
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isTodayDate = isToday(day);

        days.push(
          <div
            key={day.toString()}
            className="text-center text-base py-2 h-10 flex items-center justify-center"
          >
            {isCurrentMonth ? (
              <span className={`rounded-full px-2 ${isTodayDate ? "text-blue-500 font-semibold" : "text-gray-800"}`}>
                {format(day, "d")}
              </span>
            ) : (
              <span className="text-gray-300"> </span>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }
    return <div className="space-y-1 mt-2">{rows}</div>;
  };

  return (
    <div className="bg-white rounded-lg p-5 h-full font-custom">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl text-black">Calendar</h2>
      </div>
      <Separator />

      {/* Month & Controls */}
      <div className="m-5 shadow-md rounded-lg">
      <div className="flex items-center justify-between mt-5 m-3 mb-5">
        <button onClick={handlePrevMonth}>
          <ChevronLeft className="w-5 h-5 text-gray-600 hover:text-black" />
        </button>
        <h3 className="text-lg font-semibold text-gray-800">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <button onClick={handleNextMonth}>
          <ChevronRight className="w-5 h-5 text-gray-600 hover:text-black" />
        </button>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 mt-3 mb-5">
        {renderDays()}
      </div>

      {/* Calendar Dates */}
      {renderCells()}
      </div>
    </div>
  );
}