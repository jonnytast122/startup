import { ArrowUp, ArrowDown } from "lucide-react";

export default function DailyButton({ icon: Icon, label, number, change }) {
  const isPositive = change >= 0;

  return (
    <div className="flex flex-col items-start justify-start bg-white px-8 py-4 rounded-xl shadow-lg w-auto">
      {/* Icon with Circular Background */}
      <div className="h-10 w-10 flex items-center justify-center bg-blue-100 rounded-full">
        <Icon className="text-blue-500 p-2 " size={38} />
      </div>

      {/* Label Text */}
      <p className="text-gray-700 mt-2 mb-1 text-base font-semibold">{label}</p>

      {/* Number */}
      <p className="text-xl font-bold text-gray-900">{number}</p>

      {/* Percentage Change Box */}
      <div
        className={`flex items-center py-1 px-2 mt-2 rounded-md text-xs font-semibold ${
          isPositive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
        }`}
      >
        {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
        <span className="ml-1">{change}%</span>
      </div>
    </div>
  );
}
