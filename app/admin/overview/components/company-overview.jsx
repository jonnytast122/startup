"use client";

import { Separator } from "@/components/ui/separator";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { getCompanyOverview } from "@/lib/api/adminOverview";

export default function CompanyOverview() {
  const queryClient = useQueryClient();
  const company = queryClient.getQueryData(["company"]);

  const { data: companyOverview, isLoading } = useQuery({
    queryKey: ["admin-dashboard-company-overview", company?.id],
    queryFn: () => getCompanyOverview(company.id),
    enabled: !!company?.id,
  });

  // Map API data to displayable stats
  const stats = companyOverview?.data
    ? [
        {
          label: "Total Users",
          value: companyOverview.data.employees,
          bg: "bg-gray-200",
          text: "text-gray-700",
        },
        {
          label: "Total Branches",
          value: companyOverview.data.branches,
          bg: "bg-yellow-200",
          text: "text-yellow-700",
        },
        {
          label: "Total Departments",
          value: companyOverview.data.departments,
          bg: "bg-green-200",
          text: "text-green-700",
        },
        {
          label: "Total Leave Policies",
          value: companyOverview.data.leavePolicies,
          bg: "bg-red-200",
          text: "text-red-700",
        },
        {
          label: "Total OT Policies",
          value: companyOverview.data.overtimeSettings,
          bg: "bg-blue-200",
          text: "text-blue-700",
        },
        {
          label: "Total Work Shifts",
          value: companyOverview.data.shifts,
          bg: "bg-stone-200",
          text: "text-stone-700",
        },
      ]
    : [];

  return (
    <div className="bg-white rounded-lg p-5 font-custom h-full">
      {/* Header */}
      <div className="text-xl mb-2 text-black">Company Overview</div>
      <Separator className="mb-4" />

      {/* Box container */}
      <div className="border border-gray-600 rounded-md p-4">
        {isLoading ? (
          <div className="text-center text-gray-500 py-10">Loading...</div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
