"use client";

import { useSearchParams } from "next/navigation";
import {
  CreditCard,
  Banknote,
  Ellipsis,
  Landmark,
  Percent,
} from "lucide-react";
import { useState } from "react";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

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

  return (
    <>
      <div className="bg-white rounded-xl shadow-md py-6 px-6">
        <div className="flex items-center space-x-3 p-5">
          <CreditCard className="text-[#2998FF]" width={40} height={40} />
          <span className="font-custom text-3xl text-black">Payroll</span>
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
            <label className="text-sm font-custom text-[#3F4648] w-full">
              First Name
            </label>
            <input
              id="firstname"
              type="text"
              placeholder={firstname}
              disabled
              className="text-sm font-custom rounded-lg p-3 w-full mt-2 bg-gray-100 text-gray-500 cursor-not-allowed mb-6"
            />
            <label className="text-sm font-custom text-[#3F4648] w-full">
              Last Name
            </label>
            <input
              id="lastname"
              type="text"
              placeholder={lastname}
              disabled
              className="text-sm font-custom rounded-lg p-3 w-full mt-2 bg-gray-100 text-gray-500 cursor-not-allowed mb-6"
            />
            <label className="text-sm font-custom text-[#3F4648] w-full">
              Mobile Phone
            </label>
            <input
              id="mobilephone"
              type="text"
              placeholder={mobile}
              disabled
              className="text-sm font-custom rounded-lg p-3 w-full mt-2 bg-gray-100 text-gray-500 cursor-not-allowed mb-6"
            />
            <label className="text-sm font-custom text-[#3F4648] w-full">
              Email
            </label>
            <input
              id="email"
              type="text"
              placeholder={email}
              disabled
              className="text-sm font-custom rounded-lg p-3 w-full mt-2 bg-gray-100 text-gray-500 cursor-not-allowed mb-6"
            />
            <h2 className="text-2xl font-semibold font-custom mb-2">
              Company details
            </h2>
            <label className="text-sm font-custom text-[#3F4648] w-full">
              Title
            </label>
            <input
              id="title"
              type="text"
              placeholder={title}
              disabled
              className="text-sm font-custom rounded-lg p-3 w-full mt-2 bg-gray-100 text-gray-500 cursor-not-allowed mb-6"
            />
            <label className="text-sm font-custom text-[#3F4648] w-full">
              Employment Start Date
            </label>
            <input
              id="employmentstartdate"
              type="text"
              placeholder={employmentstartdate}
              disabled
              className="text-sm font-custom rounded-lg p-3 w-full mt-2 bg-gray-100 text-gray-500 cursor-not-allowed mb-6"
            />
            <label className="text-sm font-custom text-[#3F4648] w-full">
              Team
            </label>
            <input
              id="team"
              type="text"
              placeholder="Office"
              disabled
              className="text-sm font-custom rounded-lg p-3 w-full mt-2 bg-gray-100 text-gray-500 cursor-not-allowed mb-6"
            />
            <label className="text-sm font-custom text-[#3F4648] w-full">
              Department
            </label>
            <input
              id="department"
              type="text"
              placeholder="Junior Marketing"
              disabled
              className="text-sm font-custom rounded-lg p-3 w-full mt-2 bg-gray-100 text-gray-500 cursor-not-allowed mb-6"
            />
            <label className="text-sm font-custom text-[#3F4648] w-full">
              Branch
            </label>
            <input
              id="department"
              type="text"
              placeholder={branch}
              disabled
              className="text-sm font-custom rounded-lg p-3 w-full mt-2 bg-gray-100 text-gray-500 cursor-not-allowed mb-6"
            />
            <label className="text-sm font-custom text-[#3F4648] w-full">
              Birthday
            </label>
            <input
              id="department"
              type="text"
              placeholder={birthday}
              disabled
              className="text-sm font-custom rounded-lg p-3 w-full mt-2 bg-gray-100 text-gray-500 cursor-not-allowed mb-6"
            />
            <label className="text-sm font-custom text-[#3F4648] w-full">
              Signature
            </label>
            <input
              id="department"
              type="text"
              placeholder=""
              disabled
              className="text-sm font-custom rounded-lg p-12 w-full mt-2 bg-gray-100 text-gray-500 cursor-not-allowed mb-6"
            />
          </div>

          {/* Right container with text aligned left */}
          <div className="w-full md:w-[60%] p-6">
            <h2 className="text-xl font-semibold font-custom text-[#0F3F62] mb-2">
              Employee Card
            </h2>

            {/* Card and text side-by-side */}
            <div className="flex items-start justify-start mt-4 gap-6 w-full">
              {/* Credit Card */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-6 sm:p-8 lg:p-10 xl:p-8 rounded-xl w-80 sm:w-[300px] md:w-[400px] lg:w-[400px] xl:w-[400px] xl:h-[200px] shadow-lg font-custom transition-all duration-300">
                <div className="flex justify-between items-center mb-6">
                  <div className="text-lg md:text-xl font-semibold">
                    Employee Card
                  </div>
                  <div className="text-xs md:text-sm">12/25</div>
                </div>
                <div className="text-xl md:text-2xl tracking-widest mb-4">
                  •••• •••• •••• 1234
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm md:text-base">
                    {firstname} {lastname}
                  </div>
                  <div className="text-sm md:text-base">CVC: 123</div>
                </div>
              </div>

              {/* Info next to card - full width side */}
              <div className="flex flex-col justify-center space-y-6 flex-1">
                <p className="text-xl font-semibold font-custom text-dark-blue">
                  Information on card
                </p>

                <div className="flex items-center justify-between">
                  <p className="text-md font-custom text-light-pearl">
                    1st info layer
                  </p>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-md font-custom text-light-pearl">
                    2nd info layer
                  </p>
                  <Switch />
                </div>
              </div>
            </div>

            {/* Text under the card and info section */}
            <div className="mt-4 text-md font-custom text-light-pearl w-full">
              <h2 className="text-xl font-semibold font-custom text-[#0F3F62] mb-2">
                QR code
              </h2>
              <div className="flex items-center justify-between">
                <p className="text-md font-custom text-light-pearl">
                  Add QR codes to employee cards for quick, secure access to
                  digital information and resources
                </p>
                <Switch />
              </div>
              {/* Button moved to the right */}
              <div className="mt-4 flex justify-end">
                <button className="bg-white text-light-blue shadow-md py-2 px-8 rounded-full hover:bg-blue-600 hover:text-white transform hover:scale-105 transition-all duration-300">
                  Save
                </button>
              </div>
            </div>

            <div className="mt-4 text-md font-custom text-light-pearl w-ful space-y-2">
              <h2 className="text-xl font-semibold font-custom text-[#0F3F62] mb-2">
                Payroll Info
              </h2>
              <div className="flex items-center justify-between">
                <p className="text-md font-custom text-light-pearl">
                  Employee Name
                </p>
                <p className="font-custom text-md text-dark-blue font-semibold">
                  {firstname} {lastname}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-md font-custom text-light-pearl">
                  Employee ID
                </p>
                <p className="font-custom text-md text-dark-blue font-semibold">
                  #1234565
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-md font-custom text-light-pearl">
                  Account Number
                </p>
                <p className="font-custom text-md text-dark-blue font-semibold">
                  {accountnumber}
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
                    <DropdownMenuItem onClick={() => {}}>
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
                    <DropdownMenuItem onClick={() => {}}>
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
                    <p className="font-custom text-md font-semibold">
                      Estimated
                    </p>
                  </div>
                </div>
                <hr className="border-t border-blue-500 my-4" />
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
                        No Children
                      </p>
                    </div>
                  </div>
                  <p className="text-dark-blue font-custom text-md font-semibold">
                    ${subtotal}
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
                    ${netsalary}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
