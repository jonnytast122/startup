"use client";

import { CreditCard} from "lucide-react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import PaySummary from "./components/paysummary";

export default function Payroll() {

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl mb-3 shadow-md py-1 px-1 border">
        <div className="flex items-center space-x-3 p-5">
          <CreditCard className="text-[#2998FF]" width={36} height={36} />
          <span className="font-custom text-3xl text-black">Payroll</span>
        </div>
      </div>

      {/* Summary */}
        <PaySummary />
    </div>
  );
}
