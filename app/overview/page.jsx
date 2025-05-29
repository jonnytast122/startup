"use client"

import { Check, Bell, Home, Settings, MessageCircle, User, LayoutDashboard, ChevronDown, CalendarDays } from "lucide-react";
import RequestButton from "./components/request-button";
import DailyButton from "./components/daily-button";
import { useState } from "react";
import { DateRangePicker } from "react-date-range"; // Make sure to install `react-date-range`
import "react-date-range/dist/styles.css"; // Main style file
import "react-date-range/dist/theme/default.css"; // Theme file
import EngagementChart from "./components/engagment-chart";
import StatisticCard from "./components/statistic-button";
import Dashboard from "./components/dashboard";

export default function OverviewPage() {
    const [selectedRange, setSelectedRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
    });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState("Daily");
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleSelect = (ranges) => {
        setSelectedRange(ranges.selection);
        setShowDatePicker(false);
    };

    const activities = [
        { name: "John Doe", action: "Clocked out", time: "08:00", img: "/avatar1.jpg" },
        { name: "Jane Smith", action: "Joined", time: "ANAN", img: "/avatar2.jpg" },
        { name: "David Brown", action: "Clocked out", time: "17:45", img: "/avatar3.jpg" },
    ];

    return (
        <div className="space-y-2 scrollbar-hide font-custom">
            {/* Full-width box */}
            <div className="bg-white rounded-xl mb-3 shadow-md py-6 px-6 border">
                <div className="flex items-center space-x-3 p-6">
                    <LayoutDashboard className='text-[#2998FF]' width={40} height={40} />
                    <span className="font-custom text-3xl text-black">Overview</span>
                </div>
            </div>
            {/* Full-width box */}
            <div className="w-full p-5 bg-white rounded-lg">
                {/* Content of the second full-width box */}
                <h2 className="text-2xl font-medium text-black mb-4">Pending requests</h2>
                <div className="p-4 flex gap-4 overflow-x-auto scrollbar-hide">
                    {/* Ensure the sidebar takes up 240px, adjust if the sidebar width changes */}
                    <RequestButton icon={Home} text="Home" notificationCount={2} />
                    <RequestButton icon={MessageCircle} text="Messages" notificationCount={5} />
                    <RequestButton icon={Bell} text="Notifications" notificationCount={3} />
                    <RequestButton icon={User} text="Profile" notificationCount={2} />
                    <RequestButton icon={Settings} text="Settings" notificationCount={1} />
                    <RequestButton icon={Home} text="Home" notificationCount={2} />
                    <RequestButton icon={MessageCircle} text="Messages" notificationCount={5} />
                    <RequestButton icon={Bell} text="Notifications" notificationCount={3} />
                    <RequestButton icon={User} text="Profile" notificationCount={2} />
                    <RequestButton icon={Settings} text="Settings" notificationCount={1} />
                </div>
            </div>

            {/* Split box */}
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-5 gap-4">
                {/* Left side (3 boxes vertically stacked) */}
                <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-4">
                    <div className="w-auto min-h-36 h-auto bg-white rounded-lg p-5 relative">
                        {/* Header Section */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-medium text-black">Daily Overview</h2>

                            <div className="flex gap-2">
                                {/* Dropdown Button */}
                                <div className="relative">
                                    <button
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="flex items-center justify-between w-28 px-3 py-1.5 border rounded-md text-sm bg-white shadow-sm"
                                    >
                                        {selectedPeriod}
                                        <ChevronDown
                                            className={`h-4 w-4 text-gray-500 transition-transform ${dropdownOpen ? "rotate-180" : ""
                                                }`}
                                        />
                                    </button>
                                    {dropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg border rounded-md z-50">
                                            {["Daily", "Weekly", "Monthly", "Yearly"].map((period) => (
                                                <button
                                                    key={period}
                                                    className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                                                    onClick={() => {
                                                        setSelectedPeriod(period);
                                                        setDropdownOpen(false);
                                                    }}
                                                >
                                                    {period}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Date Range Picker Button */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowDatePicker(!showDatePicker)}
                                        className="flex items-center justify-between w-auto px-5 py-1.5 border rounded-md text-sm bg-white shadow-sm"
                                    >
                                        {`${selectedRange.startDate.toLocaleDateString()} to ${selectedRange.endDate.toLocaleDateString()}`}
                                        <ChevronDown
                                            className={`h-4 w-4 ml-2 text-gray-500 transition-transform ${showDatePicker ? "rotate-180" : ""
                                                }`}
                                        />
                                    </button>
                                    {showDatePicker && (
                                        <div className="absolute text-xs right-0 mt-2 bg-white shadow-lg border p-2 rounded-md z-10">
                                            <DateRangePicker
                                                ranges={[selectedRange]}
                                                onChange={handleSelect}
                                                rangeColors={["#3b82f6"]}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Daily Buttons */}
                        <div>
                            <DailyButton />
                        </div>
                    </div>

                    <div className="w-full bg-white rounded-lg p-5">
                        < EngagementChart />
                    </div>

                    <div className="w-full bg-white rounded-lg p-5">
                        <Dashboard />

                    </div>
                </div>

                {/* Right side (long vertically, w-2/5) */}
                <div className="col-span-1 md:col-span-1 lg:col-span-2 h-full bg-white p-7 rounded-lg order-first md:order-none">
                    <h2 className="text-2xl font-medium text-black mb-4">Payment Method</h2>
                    <button className="w-full mt-5 mb-5 flex items-center justify-between px-5 py-2 bg-white shadow-md rounded-lg relative">
                        {/* Left Section: Image & Text */}
                        <div className="flex items-center gap-3 p-5">
                            {/* Picture */}
                            <img src="./images/aba_logo.png" alt="ABA" className="h-12 w-12 mr-2" />
                            {/* Text Section */}
                            <div>
                                <p className="text-lg font-semibold">ABA</p>
                                <p className="text-xs text-gray-500">Verified</p>
                            </div>
                        </div>

                        {/* Right Section: Check Icon & Connected Text */}
                        <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-md">
                            <Check className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-600">Connected</span>
                        </div>
                    </button>
                    <h2 className="text-2xl font-medium text-black mb-4">Statistics</h2>
                    <StatisticCard />
                    <div className="w-full mt-5 mb-5 px-5 py-5 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-medium text-black mb-5">Daily Activity</h2>

      <div className="flex flex-col space-y-6 p-5 relative">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center space-x-4 relative">
            {/* Container for the vertical line and dot */}
            <div className="relative flex items-center justify-center">
              {/* Vertical Line */}
              {index !== activities.length - 1 && (
                <div className="absolute top-5 left-1 h-[calc(100%-10px)] w-0.5 bg-gray-300"></div>
              )}
              {/* Dot */}
              <div className="relative z-10 w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>

            {/* User Activity */}
            <div className="flex items-center space-x-3">
              <img src={activity.img} alt={activity.name} className="w-10 h-10 rounded-full border border-gray-300" />
              <p className="text-gray-700">
                <span className="font-medium text-black">{activity.name}</span> {activity.action} at <span className="font-medium text-blue-500">{activity.time}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
                </div>
            </div>

        </div>
    );
}
