"use client";

import { useSearchParams } from "next/navigation";
import {
  CreditCard,
  Banknote,
  Ellipsis,
  Landmark,
  Percent,
  CirclePlus,
} from "lucide-react";
import { useState } from "react";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import UpdateCashDialog from "../components/updatecashdialog";
import UpdateBankTransferDialog from "../components/updatebanktransferdialog";

export default function UserProfile() {
  const searchParams = useSearchParams();
  const firstname = searchParams.get("firstname") || "";
  const lastname = searchParams.get("lastname") || "";
  const title = searchParams.get("title") || "";
  const profile = searchParams.get("profile");
  const mobile = searchParams.get("phone") || "";
  const email = searchParams.get("email") || "";
  const employmentstartdate = searchParams.get("dateadded") || "";
  const branch = searchParams.get("branch") || "";
  const birthday = searchParams.get("birthday") || "";
  const accountnumber = searchParams.get("banknumber") || "";
  const cash = parseFloat(searchParams.get("cash") || "0");
  const banktransfer = parseFloat(searchParams.get("banktransfer") || "0");
  const single = parseFloat(searchParams.get("single") || "25.00");
  const nochildren = parseFloat(searchParams.get("nochildren") || "0.60");
  const subtotal = banktransfer - (single + nochildren);
  const netsalary = cash + subtotal;

  const firstInitial = firstname.charAt(0).toUpperCase();
  const lastInitial = lastname.charAt(0).toUpperCase();

  const [imageError, setImageError] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const [selectedPolicies, setSelectedPolicies] = useState([
    "Leave Policy",
    "Overtime Policy",
  ]);

  const togglePolicy = (policy) => {
    setSelectedPolicies((prev) =>
      prev.includes(policy)
        ? prev.filter((p) => p !== policy)
        : [...prev, policy]
    );
  };

  const [selectedWorkShift, setSelectedWorkShift] = useState([
    "Morning",
    "Afternoon",
  ]);

  const toggleWorkShift = (shift) => {
    setSelectedWorkShift((prev) =>
      prev.includes(shift) ? prev.filter((s) => s !== shift) : [...prev, shift]
    );
  };

  const [selectedGroup, setSelectedGroup] = useState(["Admin", "HR Manager"]);

  const toggleGroup = (value) => {
    setSelectedGroup((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const [selectedLocation, setSelectedLocation] = useState([
    "Geo Fence",
    "Flexible",
    "GPS",
  ]);

  const toggleLocation = (value) => {
    setSelectedLocation((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const DropdownSection = ({
    title,
    items,
    selectedItems,
    toggleItem,
    dropdownWidth = "w-40",
  }) => (
    <>
      <h2 className="text-2xl font-semibold font-custom mb-2 mt-6">{title}</h2>
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div className="flex flex-wrap gap-4">
          {items.map(
            (item) =>
              selectedItems.includes(item) && (
                <div
                  key={item}
                  className="bg-blue-100 rounded-xl border border-gray-200 p-3 shadow-sm w-auto max-w-full"
                >
                  <h2 className="text-sm font-custom text-blue">{item}</h2>
                </div>
              )
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="mt-2 inline-flex items-center justify-center w-7 h-7 bg-[#E6EFFF] rounded-full hover:bg-[#d0e4ff] focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer transition"
            >
              <span className="relative w-3 h-3">
                <span className="absolute inset-0 w-[2px] h-full bg-blue-500 left-1/2 transform -translate-x-1/2" />
                <span className="absolute inset-0 h-[2px] w-full bg-blue-500 top-1/2 transform -translate-y-1/2" />
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className={`font-custom text-sm ${dropdownWidth} bg-white shadow-md rounded-md`}
          >
            <div className="space-y-1">
              {items.map((item) => (
                <DropdownMenuItem
                  key={item}
                  onClick={() => toggleItem(item)}
                  className={
                    selectedItems.includes(item)
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-blue-50"
                  }
                >
                  {item}
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );

  const InputDisplay = ({ label, value }) => (
    <>
      <label className="text-sm font-custom text-[#3F4648] w-full">
        {label}
      </label>
      <input
        type="text"
        placeholder={value}
        disabled
        className="text-sm font-custom rounded-lg p-3 w-full mt-2 bg-gray-100 text-gray-500 cursor-not-allowed mb-6"
      />
    </>
  );

  const InfoRow = ({ label, value }) => (
    <div className="flex items-center justify-between">
      <p className="text-md font-custom text-light-pearl">{label}</p>
      <p className="font-custom text-md text-dark-blue font-semibold">
        {value}
      </p>
    </div>
  );

  return (
    <>
      <div className="bg-white rounded-xl shadow-md py-6 px-6">
        <div className="flex items-center space-x-3 p-5">
          <CreditCard className="text-[#2998FF]" width={40} height={40} />
          <span className="font-custom text-3xl text-black">Profile</span>
        </div>
      </div>

      <div className="bg-gray-100 rounded-xl mb-3 shadow-md py-6 sm:px-6 md:px-6 lg:px-16">
        <div className="font-custom text-xl font-semibold px-6 text-[#3E435D]">
          Hello, {firstname}
        </div>
        <p className="font-custom text-sm text-gray-400 px-6 mt-2">
          Good morning!
        </p>

        {/* Profile Holder Container with fallback initials */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mt-6 flex items-center space-x-4 px-6">
          <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-xl text-white font-semibold overflow-hidden">
            {profile && !imageError ? (
              <img
                src={profile}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <span className="text-gray-700">
                {firstInitial}
                {lastInitial}
              </span>
            )}
          </div>
          <div>
            <div className="text-2xl font-bold font-custom">
              {firstname} {lastname}
            </div>
            <div className="text-sm font-custom text-gray-500">admin</div>
          </div>
        </div>

        {/* Two-column layout: left has container, right has text */}
        <div className="mt-4 flex flex-col md:flex-row gap-4">
          {/* Left container */}
          <div className="w-full md:w-[40%] bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-semibold font-custom mb-2">
              Personal details
            </h2>

            <InputDisplay label="First Name" value={firstname} />
            <InputDisplay label="Last Name" value={lastname} />
            <InputDisplay label="Mobile Phone" value={mobile} />
            <InputDisplay label="Birthday" value={birthday} />

            <h2 className="text-2xl font-semibold font-custom mb-2">
              Company details
            </h2>

            <InputDisplay label="Branch" value={branch} />
            <InputDisplay label="Department" value="Junior Marketing" />
            <InputDisplay label="Title" value={title} />
            <InputDisplay
              label="Employment Start Date"
              value={employmentstartdate}
            />

            <DropdownSection
              title="Policies"
              items={["Leave Policy", "Overtime Policy"]}
              selectedItems={selectedPolicies}
              toggleItem={togglePolicy}
              dropdownWidth="w-38"
            />

            <DropdownSection
              title="Work Shift"
              items={["Morning", "Afternoon", "Full Day"]}
              selectedItems={selectedWorkShift}
              toggleItem={toggleWorkShift}
            />

            <DropdownSection
              title="Group"
              items={["Admin", "HR Manager", "Employee"]}
              selectedItems={selectedGroup}
              toggleItem={toggleGroup}
              dropdownWidth="w-44"
            />

            <DropdownSection
              title="Location"
              items={["Geo Fence", "Flexible", "GPS"]}
              selectedItems={selectedLocation}
              toggleItem={toggleLocation}
            />
          </div>

          {/* Right container with text aligned left */}
          <div className="w-full md:w-[60%] p-6">
            <div className="text-md font-custom text-light-pearl w-full space-y-2">
              <h2 className="text-xl font-semibold font-custom text-[#0F3F62] mb-2">
                Payroll Info
              </h2>

              <InfoRow
                label="Employee Name"
                value={`${firstname} ${lastname}`}
              />
              <InfoRow label="Employee ID" value="#1234565" />
              <InfoRow label="Bank Name" value="--------------" />
              <InfoRow label="Account Number" value={accountnumber} />
            </div>

            <div className="relative">
              {/* 3-dot dropdown outside the container */}
              <div className="absolute -top-8 right-0 z-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="m-2 focus:outline-none">
                      <Ellipsis className="text-gray-600 w-6 h-6 cursor-pointer hover:text-gray-900 transition-colors" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="font-custom text-sm w-48 bg-white shadow-md rounded-md"
                  >
                    <DropdownMenuItem onClick={() => setDialogOpen(true)}>
                      Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => {}}>
                      Arhieve
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {}}
                      className="text-red-500"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <UpdateCashDialog
                  open={isDialogOpen}
                  onOpenChange={setDialogOpen}
                  oldCash={cash}
                />
              </div>

              {/* Card container */}
              <div className="flex items-center justify-between mt-8 bg-white shadow-md rounded-lg p-4">
                <div className="flex items-center">
                  <Banknote className="text-blue w-12 h-12 mr-6" />
                  <p className="font-custom text-md font-semibold">Cash</p>
                </div>

                <p className="text-dark-blue font-custom text-md font-semibold">
                  ${cash}
                </p>
              </div>
            </div>

            <div className="relative">
              {/* 3-dot dropdown outside the container */}
              <div className="absolute -top-8 right-0 z-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="m-2 focus:outline-none">
                      <Ellipsis className="text-gray-600 w-6 h-6 cursor-pointer hover:text-gray-900 transition-colors" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="font-custom text-sm w-48 bg-white shadow-md rounded-md"
                  >
                    <DropdownMenuItem onClick={() => setDialogOpen(true)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {}}>
                      Archieve
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {}}
                      className="text-red-500"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <UpdateBankTransferDialog
                  open={isDialogOpen}
                  onOpenChange={setDialogOpen}
                  oldCash={cash}
                />
              </div>

              {/* Card container */}
              <div className="mt-8 bg-white shadow-md rounded-lg p-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Landmark className="text-blue w-10 h-10 mr-6" />
                    <p className="font-custom text-md font-semibold">
                      Bank Transfer
                    </p>
                  </div>
                  <p className="text-dark-blue font-custom text-md font-semibold">
                    ${banktransfer}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center ml-10">
                    <Percent className="text-blue w-8 h-8 mr-6" />
                    <div>
                      <p className="font-custom text-md font-semibold">
                        Single
                      </p>
                      <p className="text-xs text-gray-500 font-custom">Tax</p>
                    </div>
                  </div>
                  <p className="text-dark-blue font-custom text-md font-semibold">
                    ${single}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center ml-10">
                    <CreditCard className="text-blue w-8 h-8 mr-6" />
                    <div>
                      <p className="font-custom text-md font-semibold">
                        No Children
                      </p>
                      <p className="text-xs text-gray-500 font-custom">NSSF</p>
                    </div>
                  </div>
                  <p className="text-dark-blue font-custom text-md font-semibold">
                    ${nochildren}
                  </p>
                </div>

                <div className="border-t border-blue-500 my-2"></div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center ml-10">
                    <Banknote className="text-blue w-8 h-8 mr-6" />
                    <p className="font-custom text-md font-semibold">
                      Sub total Salary
                    </p>
                  </div>
                  <p className="text-dark-blue font-custom text-md font-semibold">
                    ${subtotal}
                  </p>
                </div>
              </div>
              {/* Card container */}
              <div className="mt-8 bg-white shadow-md rounded-lg p-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <p className="font-custom text-lg font-semibold">
                      Estimated
                    </p>
                  </div>
                </div>
                <hr className="border-t border-blue-500" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center ml-10">
                    <Banknote className="text-blue w-8 h-8 mr-6" />
                    <div>
                      <p className="font-custom text-md font-semibold">Cash</p>
                    </div>
                  </div>
                  <p className="text-dark-blue font-custom text-md font-semibold">
                    ${cash}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center ml-10">
                    <Banknote className="text-blue w-8 h-8 mr-6" />
                    <div>
                      <p className="font-custom text-md font-semibold">
                        Bank Transfer
                      </p>
                    </div>
                  </div>
                  <p className="text-dark-blue font-custom text-md font-semibold">
                    ${subtotal}
                  </p>
                </div>

                <div className="border-t border-blue-500"></div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <p className="font-custom text-lg font-semibold">
                      Net Salary
                    </p>
                  </div>
                  <p className="text-dark-blue font-custom text-md font-semibold">
                    ${netsalary}
                  </p>
                </div>
              </div>
              <h2 className="text-2xl font-semibold font-custom text-black mt-6">
                Attachment
                <button
                  type="button"
                  className="inline-flex items-center justify-center w-7 h-7 bg-[#E6EFFF] rounded-full hover:bg-[#d0e4ff] focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer transition ml-4"
                >
                  <span className="relative w-3 h-3">
                    {/* Vertical Line */}
                    <span className="absolute inset-0 w-[2px] h-full bg-blue-500 left-1/2 transform -translate-x-1/2"></span>
                    {/* Horizontal Line */}
                    <span className="absolute inset-0 h-[2px] w-full bg-blue-500 top-1/2 transform -translate-y-1/2"></span>
                  </span>
                </button>
              </h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
