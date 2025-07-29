"use client";

import { Check, CalendarDays, CalendarClock } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

function FeaturesComparison() {
  const plans = ["Standard", "Free Trial"];

  const schedule = [
    { name: "Customize Payroll", availability: [true, true] },
    { name: "Limit Shift", availability: [true, true] },
    { name: "Time Limitation", availability: [true, true] },
    { name: "Limitation of Work Hours", availability: ["Up to 6", "Single"] },
    { name: "Number of Sub Jobs", availability: ["Unlimited", "Unlimited"] },
    { name: "In Shift Clock In/Out Ability", availability: [true, true] },
    { name: "Claiming Open Shift", availability: ["Up to 6", "Single"] },
    { name: "Open Shifts Approval", availability: [true, true] },
    { name: "In Shift Status Tracking", availability: ["Comprehensive Tracking with automation", "Unlimited"] },
    { name: "Dedicated In Shifts Tasks", availability: ["Unlimited", "Unlimited"] },
    { name: "Search Schedule", availability: [true, true] },
    { name: "Export Schedule Filter", availability: [true, true] },
    { name: "Basic Schedule Filter", availability: [true, true] },
    { name: "Decide if Users Can See Each Other’s Schedules", availability: [true, true] },
    { name: "Shift Replacements", availability: [true, true] },
    { name: "Import Shifts from CSV", availability: [true, true] },
    { name: "Repeating Shitfs", availability: [true, true] },
    { name: "Push Notification Customization", availability: [true, true] },
    { name: "Share Live Scheduled Link", availability: [true, true] },
    { name: "Add Shortcut to a Shift", availability: [true, true] },
    { name: "Add More Date Layout", availability: [true, true] },
    { name: "Create Smart Crop", availability: ["Up to 5", "Single"] },
  ];

  const time_clock = [
    { name: "Claiming Open Shift", availability: ["Unlimited", "Unlimited"] },
    { name: "Claiming Open Shift", availability: ["Up to 5", "Unlimited"] },
    { name: "Open Shifts Approval", availability: [true, true] },
    { name: "Open Shifts Approval", availability: [true, true] },
    { name: "Claiming Open Shift", availability: ["Up to 5", "Single"] },
    { name: "Open Shifts Approval", availability: [true, true] },
    { name: "Open Shifts Approval", availability: [true, true] },
    { name: "Open Shifts Approval", availability: [true, true] },
    { name: "Open Shifts Approval", availability: [true, true] },
    { name: "Open Shifts Approval", availability: [true, true] },
    { name: "In Shift Status Tracking", availability: ["Available with live tracking + history", "Single"] },
    { name: "Dedicated In Shifts Tasks", availability: ["Unlimited", "Unlimited"] },
    { name: "Search Schedule", availability: [true, true] },
    { name: "Export Schedule Filter", availability: [true, true] },
    { name: "Dedicated In Shifts Tasks", availability: ["Up to 5", "Single"] },
    { name: "Export Schedule Filter", availability: [true, true] },
    { name: "Dedicated In Shifts Tasks", availability: ["Up to 5", "Up to 3"] },
  ];

  return (
    <div id="feature" className="max-container mx-auto px-6 py-10">
      {/* Title */}
      <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-bold text-[#0B3858]">
        Compare All Features
      </h2>

      {/* First Table Card */}
      <div className="mt-10 overflow-x-auto rounded-xl shadow-xl mx-auto max-container border-2 border-gray p-4">
        <Table className="w-full rounded-lg overflow-hidden">
          {/* Table Header */}
          <TableHeader className="bg-[#ffffff] text-[#0B3858]">
            <TableRow className="first:rounded-t-lg">
              <TableHead className="p-6 text-left text-md">
                <CalendarDays className="w-4 h-4 inline-block mr-2 mb-1" />
                Employee Scheduling
              </TableHead>
              {plans.map((plan, index) => (
                <TableHead
                  key={index}
                  className="p-4 text-center text-md text-[#0B3858]"
                >
                  {plan}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody>
            {schedule.map((feature, index) => (
              <TableRow
                key={index}
                className={`text-center transition ${
                  index % 2 === 0
                    ? "bg-[#F9F9F9] hover:bg-gray-300"
                    : "bg-[#EBF6FF] hover:bg-blue-200"
                }`}
              >
                <TableCell className="p-4 font-custom text-md text-left">
                  {feature.name}
                </TableCell>
                {feature.availability.map((available, i) => (
                  <TableCell key={i} className="p-4 font-custom">
                    {typeof available === "boolean" ? (
                      available ? (
                        <div className="w-5 h-5 flex items-center justify-center mx-auto bg-[#0B3858] rounded-full">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      ) : (
                        "-"
                      )
                    ) : (
                      available
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Second Table Card */}
      <div className="mt-10 overflow-x-auto rounded-lg shadow-xl border-2 border-gray p-4">
        <Table className="w-full rounded-lg overflow-hidden">
          {/* Table Header */}
          <TableHeader className="bg-[#ffffff] text-[#0B3858]">
            <TableRow className="first:rounded-t-lg">
              <TableHead className="p-6 text-left text-md">
                <CalendarClock className="w-4 h-4 inline-block mr-2 mb-1" />
                Advanced Scheduling
              </TableHead>
              {plans.map((plan, index) => (
                <TableHead
                  key={index}
                  className="p-4 text-center text-md text-[#0B3858]"
                >
                  {plan}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody>
            {time_clock.map((feature, index) => (
              <TableRow
                key={index}
                className={`text-center transition ${
                  index % 2 === 0
                    ? "bg-[#F9F9F9] hover:bg-gray-300"
                    : "bg-[#EBF6FF] hover:bg-blue-200"
                }`}
              >
                <TableCell className="p-4 font-custom text-md text-left">
                  {feature.name}
                </TableCell>
                {feature.availability.map((available, i) => (
                  <TableCell key={i} className="p-4 font-custom">
                    {typeof available === "boolean" ? (
                      available ? (
                        <div className="w-5 h-5 flex items-center justify-center mx-auto bg-[#0B3858] rounded-full">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      ) : (
                        "-"
                      )
                    ) : (
                      available
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default FeaturesComparison;
