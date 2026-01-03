"use client";

import { LogOut } from "lucide-react";
import RequestDialog from "./components/requestdialog";
import HistoryTable from "./components/historytable";
import { getMyBalance } from "@/lib/api/userLeave";
import { getMyDetails } from "@/lib/api/user";
import { useQuery } from "@tanstack/react-query";
import { FaSpinner } from "react-icons/fa";

export default function Leaves() {
  // Fetch my details
  const { data: myDetails, isLoading: detailsLoading } = useQuery({
    queryKey: ["my-details"],
    queryFn: getMyDetails,
  });

  // Fetch balance after details are loaded
  const { data: balance, isLoading: balanceLoading } = useQuery({
    queryKey: ["my-balance", myDetails?.employee?.id],
    queryFn: () => getMyBalance(myDetails.employee.id),
    enabled: !!myDetails?.employee?.id,
  });

  if (detailsLoading || balanceLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full py-10">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
      </div>
    );
  }

  console.log(balance);

  return (
    <div>
      {/* Top Bar */}
      <div className="bg-white rounded-xl mb-3 shadow-md py-1 px-1 border">
        <div className="flex items-center justify-between p-5">
          <a href="/user/Leaves" className="block">
            <div className="flex items-center space-x-3">
              <LogOut className="text-[#2998FF]" width={36} height={36} />
              <span className="font-custom text-3xl text-black">Leaves</span>
            </div>
          </a>
          <div className="flex items-center space-x-4">
            <RequestDialog />
          </div>
        </div>
      </div>

      {/* Leave Balance */}
      <div className="bg-white rounded-xl mb-3 shadow-md py-6 px-6 border">
        <h2 className="text-2xl font-custom font-semibold mb-6">
          Leave Balance
        </h2>

        <div className="flex justify-center gap-6 flex-wrap">
          {balance?.map((policy, index) => (
            <div
              key={index}
              className="bg-blue-100 rounded-lg shadow-sm w-48 h-32 flex flex-col items-center justify-center p-4"
            >
              <span className="text-sm font-custom">
                {policy.leavePolicy.name}
              </span>
              <div className="w-2/3 h-px bg-gray-500 my-2"></div>
              <span className="text-base font-custom">
                {policy.balance.remainingBalance !== 0
                  ? `${policy.balance.remainingBalance} days`
                  : "--"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <HistoryTable />
      </div>
    </div>
  );
}
