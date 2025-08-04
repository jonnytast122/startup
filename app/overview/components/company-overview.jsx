"use client";

import { Separator } from "@/components/ui/separator";

const stats = [
  { label: "Total User", value: 124, bg: "bg-gray-200", text: "text-gray-700" },
  { label: "Total Branch", value: 18, bg: "bg-yellow-200", text: "text-yellow-700" },
  { label: "Total Department", value: 9, bg: "bg-green-200", text: "text-green-700" },
  { label: "Total Leave Policy", value: 7, bg: "bg-red-200", text: "text-red-700" },
  { label: "Total OT Policy", value: 5, bg: "bg-blue-200", text: "text-blue-700" },
  { label: "Total Work Shift", value: 6, bg: "bg-stone-200", text: "text-stone-700" },
];

export default function CompanyOverview() {
  return (
    <div className="bg-white rounded-lg p-5 font-custom h-full">
      {/* Header */}
      <div className="text-xl mb-2 text-black">Company Overview</div>
      <Separator className="mb-4" />

      {/* Box container */}
      <div className="border border-gray-600 rounded-md p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mt-3 ml-10 mr-10">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className={`${item.bg} rounded-lg px-6 py-4 flex flex-col items-center justify-center h-[120px]`}
            >
              <div className={`text-4xl ${item.text}`}>{item.value}</div>
              <div className={`text-xl ${item.text}`}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
