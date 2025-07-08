"use client"

import { useState } from "react";
import { CreditCard } from "lucide-react";
import DashboardScreen from "./components/dashboard-screen";
import IntegrationScreen from "./components/integration-screen";
import PayrollScreen from "./components/payroll-screen";

export default function PayrollPage() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <div>
      <div className="bg-white rounded-xl mb-3 shadow-md py-6 px-6 border">
                <div className="flex items-center space-x-3 p-6">
                    <CreditCard className='text-[#2998FF]' width={40} height={40} />
                    <span className="font-custom text-3xl text-black">Payroll</span>
                </div>
      </div>

      {/* Tabs */}
      <div className="relative bg-white min-h-screen rounded-xl shadow-md">
        <div className="flex">
          {["Dashboard", "Integration", "Payroll"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 font-custom text-2xl transition-all ${activeTab === tab
                  ? "bg-white text-blue-500 rounded-t-xl"
                  : "bg-gray-100 text-gray-500 hover:text-gray-700"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 font-custom">
          {activeTab === "Dashboard" && <DashboardScreen setActiveTab={setActiveTab} />}
          {activeTab === "Integration" && <IntegrationScreen />}
          {activeTab === "Payroll" && <PayrollScreen />}
        </div>
      </div>

    </div>
  );
}
