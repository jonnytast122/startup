import { useState } from "react";
import { ChevronDown, Calendar, ChartColumnDecreasing, TableProperties, Link } from "lucide-react";
import { DateRange } from "react-date-range";
import { format, isWithinInterval, parse } from "date-fns";
import "react-date-range/dist/styles.css"; // Default styles
import "react-date-range/dist/theme/default.css"; // Theme styles
import PayrollChart from "./payroll-chart";
import NotificationPage from "./notification";
import PaymentCard from "./payment-card";
import SalaryCard from "./salary-card";
import DetailCard from "./detail-card";

const sampleData = [
  { date: "03/10/2025", totalGross: 1800, totalNSSF: 90, totalTaxes: 270, totalNetSalary: 1440 },
  { date: "03/11/2025", totalGross: 1900, totalNSSF: 95, totalTaxes: 285, totalNetSalary: 1520 },
  { date: "03/12/2025", totalGross: 2000, totalNSSF: 100, totalTaxes: 300, totalNetSalary: 1600 },
  { date: "03/13/2025", totalGross: 2100, totalNSSF: 105, totalTaxes: 315, totalNetSalary: 1680 },
  { date: "03/14/2025", totalGross: 2200, totalNSSF: 110, totalTaxes: 330, totalNetSalary: 1760 },
  { date: "03/15/2025", totalGross: 2300, totalNSSF: 115, totalTaxes: 345, totalNetSalary: 1840 },
  { date: "03/16/2025", totalGross: 2400, totalNSSF: 120, totalTaxes: 360, totalNetSalary: 1920 },
  { date: "03/17/2025", totalGross: 2500, totalNSSF: 125, totalTaxes: 375, totalNetSalary: 2000 },
  { date: "03/18/2025", totalGross: 2600, totalNSSF: 130, totalTaxes: 390, totalNetSalary: 2080 },
  { date: "03/19/2025", totalGross: 2700, totalNSSF: 135, totalTaxes: 405, totalNetSalary: 2160 },
  { date: "03/20/2025", totalGross: 2800, totalNSSF: 140, totalTaxes: 420, totalNetSalary: 2240 },
  { date: "03/21/2025", totalGross: 2900, totalNSSF: 145, totalTaxes: 435, totalNetSalary: 2320 },
  { date: "03/22/2025", totalGross: 3000, totalNSSF: 150, totalTaxes: 450, totalNetSalary: 2400 },
  { date: "03/23/2025", totalGross: 3100, totalNSSF: 155, totalTaxes: 465, totalNetSalary: 2480 },
  { date: "03/24/2025", totalGross: 3200, totalNSSF: 160, totalTaxes: 480, totalNetSalary: 2560 },
  { date: "03/25/2025", totalGross: 3300, totalNSSF: 165, totalTaxes: 495, totalNetSalary: 2640 },
  { date: "03/26/2025", totalGross: 3400, totalNSSF: 170, totalTaxes: 510, totalNetSalary: 2720 },
  { date: "03/27/2025", totalGross: 3500, totalNSSF: 175, totalTaxes: 525, totalNetSalary: 2800 },
  { date: "03/28/2025", totalGross: 3600, totalNSSF: 180, totalTaxes: 540, totalNetSalary: 2880 },
  { date: "03/29/2025", totalGross: 3700, totalNSSF: 185, totalTaxes: 555, totalNetSalary: 2960 },
  { date: "03/30/2025", totalGross: 3800, totalNSSF: 190, totalTaxes: 570, totalNetSalary: 3040 },
];


export default function DashboardScreen({ setActiveTab }) {
  // Dropdown states
  const [showDailyDropdown, setShowDailyDropdown] = useState(false);
  const [selectedDaily, setSelectedDaily] = useState("Daily");

  const [showPayrollDropdown, setShowPayrollDropdown] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState("Payroll Type");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedRange, setSelectedRange] = useState({
    startDate: new Date(2025, 2, 20),
    endDate: new Date(2025, 2, 22),
    key: "selection",
  });

  const handleDateSelect = (ranges) => {
    setSelectedRange(ranges.selection);
    setShowDatePicker(false); // Close picker after selection
  };

  // Filter data based on selected date range
  const filteredData = sampleData.filter((item) => {
    const itemDate = parse(item.date, "MM/dd/yyyy", new Date());
    return isWithinInterval(itemDate, { start: selectedRange.startDate, end: selectedRange.endDate });
  });

  // Calculate total values based on selected date range
  const totals = filteredData.reduce(
    (acc, curr) => {
      acc.totalGross += curr.totalGross;
      acc.totalNSSF += curr.totalNSSF;
      acc.totalTaxes += curr.totalTaxes;
      acc.totalNetSalary += curr.totalNetSalary;
      return acc;
    },
    { totalGross: 0, totalNSSF: 0, totalTaxes: 0, totalNetSalary: 0 }
  );

  return (
    <div className="p-4">
      <div className="flex justify-end space-x-2 mb-4 relative">
        {/* Daily Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDailyDropdown(!showDailyDropdown)}
            className="flex items-center justify-between w-28 px-3 py-1.5 border rounded-md text-sm bg-white shadow-sm"
          >
            {selectedDaily}
            <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${showDailyDropdown ? "rotate-180" : ""}`} />
          </button>

          {showDailyDropdown && (
            <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg border rounded-md z-50">
              {["Daily", "Weekly", "Monthly", "Yearly"].map((period) => (
                <button
                  key={period}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                  onClick={() => {
                    setSelectedDaily(period);
                    setShowDailyDropdown(false);
                  }}
                >
                  {period}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Payroll Type Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowPayrollDropdown(!showPayrollDropdown)}
            className="flex items-center justify-between w-28 px-3 py-1.5 border rounded-md text-sm bg-white shadow-sm"
          >
            {selectedPayroll}
            <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${showPayrollDropdown ? "rotate-180" : ""}`} />
          </button>

          {showPayrollDropdown && (
            <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg border rounded-md z-50">
              {["Hourly", "Salary"].map((type) => (
                <button
                  key={type}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                  onClick={() => {
                    setSelectedPayroll(type);
                    setShowPayrollDropdown(false);
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date Range Picker */}
        <div className="relative">
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="flex items-center justify-between px-5 py-1.5 border rounded-md text-sm bg-white shadow-sm"
          >
            {/* Show full date text on medium+ screens, show only icon on small screens */}
            <span className="hidden md:block">
              {`${format(selectedRange.startDate, "MM/dd/yyyy")} to ${format(selectedRange.endDate, "MM/dd/yyyy")}`}
            </span>
            <Calendar className="md:hidden h-5 w-5 text-gray-500" /> {/* Calendar icon on small screens */}
            <ChevronDown className={`h-4 w-4 ml-2 text-gray-500 transition-transform ${showDatePicker ? "rotate-180" : ""}`} />
          </button>

          {/* Date Picker Popup */}
          {showDatePicker && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg border p-2 rounded-md z-10">
              <DateRange
                ranges={[selectedRange]}
                onChange={handleDateSelect}
                rangeColors={["#3b82f6"]}
              />
            </div>
          )}
        </div>

        {/* Navigation Button */}
        <button
          onClick={() => setActiveTab("Integration")}
          className="flex items-center px-4 py-1.5 border rounded-full text-sm bg-white text-white shadow-sm space-x-3"
        >
          {/* ABA Logo */}
          <img src="/images/aba_logo.png" alt="ABA Logo" className="w-10 h-10 rounded-full p-1" />


          {/* Title and Verified */}
          <div className="text-left">
            <p className="text-sm text-black font-medium">ABA</p>
            <p className="text-xs text-gray-500">Verified</p>
          </div>

          {/* Link Icon */}
          <Link className="w-5 h-5 text-green-500" />
        </button>
      </div>
      <h2 className="text-xl font-custom">Summary</h2>
      <div className="mt-5 grid grid-cols-1 font-custom sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white shadow-md text-center rounded-lg">
          <h3 className="text-lg text-gray-700 flex items-center justify-center space-x-2 mb-5">
            <Calendar className="h-5 w-5 text-gray-500" /> {/* Icon on the left */}
            <span>Total Gross</span>
          </h3>
          <p className="text-3xl">${totals.totalGross}</p>
        </div>

        <div className="p-4 bg-white shadow-md rounded-lg text-center">
          <h3 className="text-lg text-gray-700 flex items-center justify-center space-x-2 mb-5">
            <Calendar className="h-5 w-5 text-gray-500" /> {/* Icon on the left */}
            <span>Total NFFS</span>
          </h3>
          <p className="text-3xl">${totals.totalNSSF}</p>
        </div>

        <div className="p-4 bg-white shadow-md rounded-lg text-center">
          <h3 className="text-lg text-gray-700 flex items-center justify-center space-x-2 mb-5">
            <ChartColumnDecreasing className="h-5 w-5 text-gray-500" /> {/* Icon on the left */}
            <span>Total Taxes</span>
          </h3>
          <p className="text-3xl">${totals.totalTaxes}</p>
        </div>

        <div className="p-4 bg-white shadow-md rounded-lg text-center">
          <h3 className="text-lg text-gray-700 flex items-center justify-center space-x-2 mb-5">
            <Calendar className="h-5 w-5 text-gray-500" /> {/* Icon on the left */}
            <span>Total Net Salary</span>
          </h3>
          <p className="text-3xl">${totals.totalNetSalary}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-5 gap-4 mt-2">
        {/* Left side (3 boxes vertically stacked) */}
        <div className="col-span-1 shadow-lg h-full rounded-md mt-3 bg-white md:col-span-2 lg:col-span-3 space-y-4">
          <PayrollChart />
        </div>

        {/* Right side (long vertically, w-2/5) */}
        <div className="col-span-1 font-custom bg-white shadow-lg mt-3 md:col-span-1 lg:col-span-2 h-full p-7 rounded-lg order-first md:order-none">
          {/* Top Button - Previous Payroll */}
          <button className="w-full border p-4 rounded-lg bg-white flex flex-col items-start text-left">
            {/* Top Section: Icon, Title & Date */}
            <div className="w-full flex justify-between items-center">
              {/* Left - Icon & Text */}
              <div className="flex items-center space-x-2">
                <ChartColumnDecreasing className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700 font-medium">Previous Payroll</span>
              </div>
              {/* Right - Date */}
              <span className="text-gray-600 text-sm">March 21, 2025</span>
            </div>

            {/* Bottom Section: Amount & Payment Status */}
            <div className="w-full flex justify-between items-center mt-5 ml-5">
              {/* Left - Amount */}
              <span className="text-3xl text-black">$580</span>

              {/* Right - Paid Status */}
              <div className="flex items-center bg-green-200 px-2 py-1 rounded-md space-x-1 mr-5">
                <span className="h-2 w-2 bg-green-500 rounded-full"></span> {/* Green Status Dot */}
                <span className=" text-green-500 text-xs">PAID</span>
              </div>
            </div>
          </button>

          {/* Bottom Button - Placeholder for Another Action */}
          <button className="w-full border p-4 mt-4 rounded-lg bg-white text-gray-700 font-medium">
            {/* Top Section: Icon, Title & Date */}
            <div className="w-full flex justify-between items-center">
              {/* Left - Icon & Text */}
              <div className="flex items-center space-x-2">
                <TableProperties className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700 font-medium">Upcoming Payroll</span>
              </div>
              {/* Right - Date */}
              <span className="text-gray-600 text-sm">March 21, 2025</span>
            </div>

            {/* Bottom Section: Amount & Payment Status */}
            <div>
              {[{ amount: "$580", status: "PENDING", statusColor: "orange" },
              { amount: "$720", status: "PENDING", statusColor: "orange" },
              { amount: "$910", status: "PENDING", statusColor: "orange" }].map((item, index) => (
                <div key={index} className="w-full flex justify-between items-center mt-5 ml-5">
                  {/* Left - Amount */}
                  <span className="text-3xl text-black">{item.amount}</span>

                  {/* Right - Status */}
                  <div className={`flex items-center bg-${item.statusColor}-200 px-2 py-1 rounded-md space-x-1 mr-5`}>
                    <span className={`h-2 w-2 bg-${item.statusColor}-500 rounded-full`}></span>
                    <span className={`text-${item.statusColor}-500 text-xs`}>{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-5 gap-4 mt-2">
        {/* Left side (split into two equal boxes) */}
        <div className="col-span-1 h-full mt-3 md:col-span-2 lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            <div className="bg-white rounded-md shadow-lg h-full p-4">
              <PaymentCard />
            </div>
            <div className="bg-white rounded-md shadow-lg h-full p-4">
              <SalaryCard />
            </div>
          </div>
        </div>
        {/* Right side (long vertically, w-2/5) */}
        <div className="col-span-1 font-custom bg-white shadow-lg mt-3 md:col-span-1 lg:col-span-2 h-full p-4 rounded-lg order-first md:order-none">
          {/* Top Button - Previous Payroll */}
          <NotificationPage />
        </div>
      </div>
      <DetailCard />
    </div>
  );
};
