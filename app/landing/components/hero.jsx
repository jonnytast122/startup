import React from "react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <div className="w-full h-screen bg-primary-blue flex items-center justify-center relative px-4">
      {/* Content Wrapper - Centered Absolutely */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center max-w-[90%]">
        {/* Responsive Heading */}
        <h1 className="text-white font-vietname-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
          Smart Attendance, Accurate
          <br /> Payroll – Simplify Your Workforce
          <br /> Management With ANAN
        </h1>

        {/* Responsive Paragraph */}
        <p className="text-white font-custom mt-6 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto">
          ANAN simplifies workforce management by seamlessly integrating real-
          time attendance tracking with automated payroll processing in one
          user-friendly platform.
        </p>

        {/* Responsive Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-10">
          <Button className="bg-white text-primary-blue font-custom text-lg px-6 py-3 rounded-xl w-full sm:w-auto">
            Try for free
          </Button>
          <Button className="bg-transparent text-white font-custom text-lg px-6 py-3 rounded-xl border-2 border-white w-full sm:w-auto">
            Learn more
          </Button>
        </div>
      </div>
    </div>
  );
}
