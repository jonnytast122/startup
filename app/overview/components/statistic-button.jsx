import { UserCog, UserPlus, ShieldCheck, ShieldX } from "lucide-react";

const statistics = [
  { icon: UserCog, title: "Admins", value: "20", bgColor: "bg-blue-100", iconColor: "text-blue-500", VerticalColor: "bg-blue-500" },
  { icon: UserPlus, title: "New Admins", value: "50", bgColor: "bg-green-100", iconColor: "text-green-500", VerticalColor: "bg-green-500" },
  { icon: ShieldCheck, title: "Attendens", value: "100", bgColor: "bg-yellow-100", iconColor: "text-yellow-500", VerticalColor: "bg-yellow-500" },
  { icon: ShieldX, title: "Absentees", value: "23", bgColor: "bg-red-100", iconColor: "text-red-500", VerticalColor: "bg-red-500" },
];

export default function Dashboard() {
  return (
<div className="grid grid-cols-2 gap-x-6 gap-y-4">
{statistics.map((stat, index) => (
        <StatisticCard key={index} {...stat} />
      ))}
    </div>
  );
}

function StatisticCard({ icon: Icon, title, value, bgColor, iconColor, VerticalColor }) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-5 flex flex-col items-start">
      {/* Icon with Circle Background */}
      <div className={`h-14 w-14 flex items-center justify-center ${bgColor} rounded-full mb-3`}>
        <Icon className={`${iconColor}`} size={32} />
      </div>

      {/* Title */}
      <p className="text-gray-700 text-lg font-semibold">{title}</p>

      {/* Separator & Value Section */}
      <div className="flex justify-between items-center w-full mt-3">
        <div className="w-1/2 flex">
          <div className={`h-10 w-1 ${VerticalColor}`}></div> {/* Vertical Separator */}
        </div>
        <p className={`w-1/2 text-right text-2xl items-center justify-center font-bold ${iconColor}`}>{value}</p>
      </div>
    </div>
  );
}
