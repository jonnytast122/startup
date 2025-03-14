import { ArrowUp, ArrowDown, Clock, AlertCircle, Briefcase, Calendar, DollarSign, TrendingUp } from "lucide-react";

export default function DailyButtons() {
  const buttons = [
    { label: "Early", value: 10, change: 5, icon: Clock, bgColor: "bg-blue-100", iconColor: "text-blue-500" },
    { label: "Late", value: 8, change: -3, icon: AlertCircle, bgColor: "bg-red-100", iconColor: "text-red-500" },
    { label: "Time Off", value: 12, change: 2, icon: Briefcase, bgColor: "bg-yellow-100", iconColor: "text-yellow-500" },
    { label: "Request Leave", value: 5, change: -1, icon: Calendar, bgColor: "bg-purple-100", iconColor: "text-purple-500" },
    { label: "Unpaid Leave", value: 3, change: -4, icon: DollarSign, bgColor: "bg-gray-100", iconColor: "text-gray-500" },
    { label: "OT", value: 15, change: 7, icon: TrendingUp, bgColor: "bg-green-100", iconColor: "text-green-500" },
  ];

  return (
    <div className="overflow-x-auto p-4">
      <div className="flex items-start space-x-4 w-max">
        {buttons.map(({ label, value, change, icon: Icon, bgColor, iconColor }, index) => {
          const isPositive = change >= 0;
          return (
            <div
              key={index}
              className="flex flex-col items-start bg-white px-5 py-4 rounded-xl shadow-md relative"
            >
              {/* Icon with Background Circle */}
              <div className={`absolute top-2 left-4 h-10 w-10 flex items-center justify-center ${bgColor} rounded-full`}>
                <Icon className={`${iconColor}`} size={24} />
              </div>
              
              {/* Title */}
              <p className="text-gray-700 text-base font-semibold mt-12">{label}</p>
              
              {/* Value */}
              <p className="text-xl font-bold text-gray-900">{value}</p>
              
              {/* Change Indicator */}
              <div
                className={`flex items-center py-1 px-2 rounded-md text-xs font-semibold mt-2 ${
      isPositive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                }`}
              >
                {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                <span className="ml-1">{change}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
