"use client";

import { GitCompareArrows, CheckCircle } from "lucide-react";

const IntegrationScreen = () => {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Section: Integration with ABA */}
      <div>
        <h2 className="text-xl font-custom mb-5">Integration with</h2>
        <div className="bg-white shadow-lg rounded-xl p-6 py-10 px-10 flex items-center justify-between h-20">
          {/* ABA Logo & Text */}
          <div className="flex items-center space-x-3">
            <img
              src="/images/aba_logo.png"
              alt="ABA Logo"
              className="w-12 h-12 "
            />
            <div className="py-5">
              <p className="text-base font-semibold">ABA</p>
              <p className="text-xs text-gray-500">Verified</p>
            </div>
          </div>
          {/* Connecting Text */}
          <span className="flex items-center space-x-2 bg-green-100 text-green-600 p-3 rounded-full">
            <CheckCircle size={14} />
            <span className="text-sm font-custom">Connecting</span>
          </span>
        </div>
      </div>

      {/* Right Section: Match Employee */}
      <div>
        <h2 className="text-xl font-custom mb-5">Match Employee</h2>
        <div className="bg-white shadow-lg rounded-xl p-4 px-10 flex items-center justify-between h-20">
          {/* User Matching Button */}
          <div className="flex items-center space-x-3">
            <GitCompareArrows className="text-blue-500" width={30} height={30} />
            <p className="text-lg font-custom">User Matching</p>
          </div>
          {/* Match Status */}
          <span className="flex items-center space-x-2 bg-green-100 text-green-600 p-3 rounded-full">
            <CheckCircle size={14} />
            <span className="text-sm font-custom">Match</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default IntegrationScreen;
