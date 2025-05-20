"use client";

import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Info, CircleCheck, Check } from "lucide-react"; // Changed to CircleCheck

function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  const pricingPlans = [
    // {
    //   name: "Basic",
    //   monthly: "$14.99",
    //   yearly: "$100",
    //   smallText1: "Up to 5 users included",
    //   smallText2: "$0.5 / month per additional user",
    //   features: [
    //     "Basic Reporting",
    //     "Notifications & Alerts",
    //     "Basic Customization dashboards with basic themes, widgets, and branch",
    //     "Export data in basic formats like CSV",
    //     "Simple tools for tracking holidays and managing holiday requests",
    //     "Do payroll manually",
    //     "Claiming Open Shifts",
    //     "Time Tracking includes all report types, GPS tracking, and management of unlimited jobs.",
    //     "Shift information manage shift details such as location, notes, media, and files",
    //   ],
    // },
    // {
    //   name: "Advanced",
    //   monthly: "$24.99",
    //   yearly: "$200",
    //   highlight: true,
    //   smallText1: "Up to 15 users included",
    //   smallText2: "$1.5 / month per additional user",
    //   features: [
    //     "Advanced Reporting & Analytics for attendance, productivity, and payroll",
    //     "Geofence for Time Clock",
    //     "Auto Clock Out",
    //     "Recurring Shifts and Templates for easy scheduling",
    //     "Payroll integration limitation with bank",
    //     "Lock Days in Timesheets",
    //     "Basic API access for custom integrations and data exchange with Google Sheet"
    //   ],
    // },
    {
      name: "Expert",
      monthly: "$34.99",
      yearly: "$300",
      smallText1: "Up to 30 users included",
      smallText2: "$3 / month per additional user",
      features: [
        "View & Edit Personal Profile",
        "Automatically Assign Shifts",
        "Multi-Branch/Location Management",
        "Live GPS Tracking ",
        "Process Automation",
        "AI-Powered Scheduling",
        "Advanced Security Features",
        "Full Analytics Suite",
        "Advanced Payroll Management",
        "Conflicts alerts",
      ],
    },
    {
      name: "Free Trial",
      monthly: "$0",
      yearly: "$0",
      smallText1: "No limit users",
      features: [
        "Free for 3 months!",
        "Access to all available features during the trial period",
        "Everything needs to manage employees!",
        "Trial Feedback",
        "Onboarding Tutorials",
      ],
    },
  ];

  return (
    <div id="pricing" className="max-container font-custom font-bold text-center px-6 py-10">
      <h2 className="font-custom text-[#0B3858] text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
        Choose Plan
        <br />
        That's Right For You
      </h2>
      <p className="font-vietname text-sm sm:text-md md:text-lg lg:text-xl text-gray-400 mt-2">
        Pay only for what you need, when you need it
      </p>
      <div className="flex flex-col items-center gap-1 mt-10">
        <div className="flex items-center gap-6 sm:gap-3 md:gap-4 lg:gap-6">
          <span
            className={`font-vietname text-md sm:text-lg md:text-lg lg:text-2xl transition-colors duration-300 ${
              !isYearly ? "text-[#0B3858]" : "text-gray-400"
            }`}
          >
            Monthly
          </span>
          <Switch
            checked={isYearly}
            onCheckedChange={setIsYearly}
            className="scale-[1.2] sm:scale-[1.0] md:scale-[1.2] lg:scale-[1.4] data-[state=checked]:bg-[#0B3858] data-[state=checked]:border-[#0B3858]"
          />
          <span
            className={`font-vietname text-md sm:text-lg md:text-lg lg:text-2xl transition-colors duration-300 ${
              isYearly ? "text-[#0B3858]" : "text-gray-400"
            }`}
          >
            Yearly
          </span>
        </div>
        <p className="font-vietname text-sm sm:text-sm md:text-md lg:text-lg text-[#0B3858] mt-2 flex items-center gap-2">
          Pay yearly and save 18%
          <Info className="w-5 h-5 text-[#0B3858]" />
        </p>
        <p className="font-vietname text-sm sm:text-md md:text-lg lg:text-xl text-light-gray">
          Prices are in USD
        </p>
      </div>

      <div
        className="shadow-lg rounded-xl p-6 mt-12 relative"
        style={{
          background: "linear-gradient(to bottom, #0B3858 20%, #ffffff 20%)",
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative border border-gray-300 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 text-left ${
                plan.highlight ? "bg-[#EBF6FF]" : "bg-white"
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-[-20px] left-[15px] bg-yellow-400 text-black text-xl font-bold px-4 py-2 rounded-2xl">
                  Popular
                </div>
              )}
              <h3 className="text-custom text-4xl sm:text:2xl md:text:3xl lg:text:4xl font-bold text-[#0B3858]">
                {plan.name}
              </h3>
              <div className="mt-2 flex items-end gap-1">
                <span
                  className={`font-custom text-6xl sm:text-6xl md:text-6xl lg:text-4xl xl:text-7xl font-extrabold ${
                    plan.name === "Free Trial"
                      ? "text-[#5CCD38]"
                      : "text-[#0B3858]"
                  }`}
                >
                  {plan.name === "Free Trial"
                    ? "$0"
                    : isYearly
                    ? plan.yearly
                    : plan.monthly}
                </span>

                {plan.name === "Free Trial" ? (
                  <span className="font-vietname text-lg sm:text-md text-light-gray">
                    for 3 months
                  </span>
                ) : (
                  <span className="font-vietname text-lg sm:text-md text-light-gray">
                    / {isYearly ? "year" : "month"}
                  </span>
                )}
              </div>
              <p className="font-custom mt-2 text-sm text-dark-gray">
                {plan.smallText1}
              </p>
              <p className="font-vietname text-sm text-light-gray">
                {plan.smallText2}
              </p>
              <Button
                className={`mt-4 w-full py-3 text-lg font-bold rounded-xl border-2 transition duration-300 ${
                  plan.name === "Advanced"
                    ? "bg-[#5494DA] text-white hover:bg-[#4683C0]"
                    : plan.name === "Free Trial"
                    ? "bg-white text-[#75D645] border-[#75D645] hover:bg-[#75D645]"
                    : "bg-white text-[#152C5B] border-[#152C5B] hover:bg-[#F0F3FA]"
                }`}
              >
                Select Plan
              </Button>
              <h4 className="mt-6 text-xl font-bold text-[#0B3858]">
                Plan Highlights
              </h4>
              {(plan.name === "Advanced" || plan.name === "Expert") && (
                <p className="font-custom text-Lg text-[#5494DA] mt-2">
                  Everything in Basic plan, plus:
                </p>
              )}

              <ul className="mt-2 space-y-2">
                {plan.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-[#0B3858]"
                  >
                    <div className="w-5 h-5 flex items-center justify-center bg-[#0B3858] rounded-full mt-1">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex-1">
                      {" "}
                      {/* Ensures text wraps properly */}
                      <span className="font-vietname">{feature}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Pricing;
