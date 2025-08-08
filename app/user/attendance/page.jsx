"use client";

import { useState } from "react";
import { CalendarClock } from "lucide-react";

export default function Attendance() {
  return (
    <div>
      {/* Header */}
      <div className="bg-white rounded-xl mb-3 shadow-md py-6 px-6 border">
        <div className="flex items-center justify-between p-5">
          <a href="/overview/attendence" className="block">
            <div className="flex items-center space-x-3">
              <CalendarClock
                className="text-[#2998FF]"
                width={40}
                height={40}
              />
              <span className="font-custom text-3xl text-black">
                Attendence
              </span>
            </div>
          </a>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-2">
        <div className="bg-white rounded-xl mb-3 shadow-md py-6 px-6 border w-full md:w-[60%]">
          {/* Left side content goes here */}
          <h2 className="text-xl font-semibold mb-4">Left Side (70%)</h2>
          {/* ...left side content... */}
        </div>

        <div className="bg-white rounded-xl mb-3 shadow-md py-6 px-6 border w-full md:w-[40%]">
          {/* Right side content goes here */}
          <h2 className="text-xl font-semibold mb-4">Right Side (30%)</h2>
          {/* ...right side content... */}
        </div>
      </div>
    </div>
  );
}
