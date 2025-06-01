"use client";

import Image from "next/image";
import { useState } from "react";
import { FaDownload } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { MdPeopleOutline } from "react-icons/md";
import { GoPerson } from "react-icons/go";
import { useDropzone } from "react-dropzone";
import { Settings } from "lucide-react";
import AddTitleDialog from "./components/addtitledialog";
import AddDepartmentDialog from "./components/adddepartmentdialog";
import AddBranchDialog from "./components/addbranchdialog";

export default function SettingPage() {
  const [selectedFile, setSelectedFile] = useState(null);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(URL.createObjectURL(acceptedFiles[0]));
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] }, // Only allow images
    multiple: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFile) {
      onNextStep();
    }
  };
  return (
    <div>
      <div className="bg-white rounded-xl mb-3 shadow-md py-6 px-6 border">
        <div className="flex items-center space-x-3 p-6">
          <Settings className="text-[#2998FF]" width={40} height={40} />
          <span className="font-custom text-3xl text-black">Company</span>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-md py-6 px-6">
        <h1 className="font-custom text-center text-3xl text-[#3F4648]">
          Company Details
        </h1>
        {/* Company Name */}
        <div className="flex flex-wrap sm:flex-nowrap items-center mt-6 justify-center lg:justify-center">
          <label className="font-custom text-[#3F4648] w-full sm:w-1/3 lg:w-1/4 sm:text-left mb-2 sm:mb-0">
            Company Name
          </label>
          <input
            id="company-name"
            type="text"
            placeholder="Anan Group"
            className="font-custom border border-gray-300 rounded-lg p-2 w-full sm:w-1/2 lg:w-1/3 xl:w-2/4"
          />
        </div>

        {/* Company Logo */}
        <div className="flex flex-wrap sm:flex-nowrap items-center mt-6 justify-center lg:justify-center">
          <label className="font-custom text-[#3F4648] w-full sm:w-1/3 lg:w-1/4 sm:text-left mb-2 sm:mb-0">
            Company Logo
          </label>
          <div
            {...getRootProps()}
            className="w-full sm:w-1/2 lg:w-1/3 xl:w-2/4 h-60 border border-gray-300 rounded-xl flex items-center justify-center cursor-pointer bg-white hover:bg-gray-100 transition"
          >
            <input {...getInputProps()} />
            {selectedFile ? (
              <img
                src={selectedFile}
                alt="Uploaded Logo"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex w-full items-center justify-center">
                {/* Download Icon on the left */}
                <FaDownload className="text-gray-400 text-8xl" />
                {/* Text on the right */}
                <p className="text-gray-500 text-xs font-medium mb-5 ml-3">
                  Drag your logo here <br />
                  Or <span className="text-blue-500">Browse</span>
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center mt-6 w-full">
          <div className="font-custom flex flex-wrap gap-4 items-center justify-between w-full sm:w-5/6 md:w-5/6 lg:w-5/6 xl:w-3/4">
            {/* Industry */}
            <div className="flex flex-row items-center space-x-2 w-full sm:w-auto">
              <label className="text-[#3F4648] w-24">Industry</label>
              <select
                id="industry"
                className="border border-gray-300 rounded-lg p-2 w-full sm:w-48"
              >
                <option value="">Others</option>
                <option value="anan-group">Anan Group</option>
                <option value="xyz-corp">XYZ Corp</option>
                <option value="abc-ltd">ABC Ltd</option>
              </select>
            </div>

            {/* Employee */}
            <div className="flex flex-row items-center space-x-2 w-full sm:w-auto">
              <label className="text-[#3F4648] w-24">Employee</label>
              <select
                id="employee"
                className="border border-gray-300 rounded-lg p-2 w-full sm:w-48"
              >
                <option value="">1–10</option>
                <option value="anan-group">Anan Group</option>
                <option value="xyz-corp">XYZ Corp</option>
                <option value="abc-ltd">ABC Ltd</option>
              </select>
            </div>

            {/* Country */}
            <div className="flex flex-row items-center space-x-2 w-full sm:w-auto">
              <label className="text-[#3F4648] w-24">Country</label>
              <select
                id="country"
                className="border border-gray-300 rounded-lg p-2 w-full sm:w-48"
              >
                <option value="">Cambodia</option>
                <option value="anan-group">Anan Group</option>
                <option value="xyz-corp">XYZ Corp</option>
                <option value="abc-ltd">ABC Ltd</option>
              </select>
            </div>
          </div>
        </div>

        {/* Branch Section */}
        <div className="flex flex-col items-center mt-6 w-full">
          <div className="w-full sm:w-5/6 lg:w-3/5 xl:w-3/4">
            <div className="flex items-center justify-between mb-2">
              <label className="font-custom text-[#3F4648]">Branch</label>
              <AddBranchDialog />{" "}
              {/* This renders the button + dialog trigger */}
            </div>
          </div>

          <div className="flex flex-col items-center w-full">
            <div className="font-custom border border-gray-300 rounded-lg p-2 flex items-center justify-between flex-wrap sm:flex-nowrap gap-2 w-full sm:w-5/6 md:w-5/6 lg:w-5/6 xl:w-3/4 text-sm sm:text-base">
              <div className="flex items-center space-x-1 min-w-0">
                <MdPeopleOutline className="text-gray-500 flex-shrink-0" />
                <span className="text-[#3F4648] truncate">Marketing</span>
              </div>

              <div className="flex items-center space-x-2 min-w-0 ml-auto">
                <span className="text-gray-500 text-sm flex-shrink-0">
                  Manager
                </span>
                <select className="border border-gray-300 rounded-lg p-2 w-28 sm:w-32 text-xs sm:text-sm">
                  <option value="" disabled selected hidden>
                    Default
                  </option>
                  <option value="ro-channyka">Ro Channyka</option>
                  <option value="john-doe">John Doe</option>
                  <option value="jane-smith">Jane Smith</option>
                </select>
                <button className="text-red-500 hover:text-red-700">
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Department Section */}
        <div className="flex flex-col items-center mt-6 w-full">
          <div className="w-full sm:w-5/6 lg:w-3/5 xl:w-3/4">
            <div className="flex items-center justify-between mb-2">
              <label className="font-custom text-[#3F4648]">Department</label>
              <AddDepartmentDialog />{" "}
              {/* This renders the button + dialog trigger */}
            </div>
          </div>

          <div className="flex flex-col items-center w-full">
            <div className="font-custom border border-gray-300 rounded-lg p-2 flex items-center justify-between flex-wrap sm:flex-nowrap gap-2 w-full sm:w-5/6 md:w-5/6 lg:w-5/6 xl:w-3/4 text-sm sm:text-base">
              {/* Left: Industry */}
              <div className="flex items-center space-x-1 min-w-0">
                <MdPeopleOutline className="text-gray-500 flex-shrink-0" />
                <span className="text-[#3F4648] truncate">Marketing</span>
              </div>

              {/* Center: Location */}
              <div className="flex items-center space-x-1 min-w-0 mx-auto">
                <FiMapPin className="text-gray-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium truncate">
                  The Box Office
                </span>
              </div>

              {/* Right: Manager */}
              <div className="flex items-center space-x-2 min-w-0 ml-auto">
                <span className="text-gray-500 text-sm flex-shrink-0">
                  Manager
                </span>
                <select className="border border-gray-300 rounded-lg p-2 w-28 sm:w-32 text-xs sm:text-sm">
                  <option value="" disabled selected hidden>
                    Default
                  </option>
                  <option value="ro-channyka">Ro Channyka</option>
                  <option value="john-doe">John Doe</option>
                  <option value="jane-smith">Jane Smith</option>
                </select>
                <button className="text-red-500 hover:text-red-700">
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center mt-3 w-full">
            <div className="font-custom border border-gray-300 rounded-lg p-2 flex items-center justify-between flex-wrap sm:flex-nowrap gap-2 w-full sm:w-5/6 md:w-5/6 lg:w-5/6 xl:w-3/4 text-sm sm:text-base">
              {/* Left: Industry */}
              <div className="flex items-center space-x-1 min-w-0">
                <MdPeopleOutline className="text-gray-500 flex-shrink-0" />
                <span className="text-[#3F4648] truncate">Marketing</span>
              </div>

              {/* Center: Location */}
              <div className="flex items-center space-x-1 min-w-0 mx-auto">
                <FiMapPin className="text-gray-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium truncate">
                  The Box Office
                </span>
              </div>

              {/* Right: Manager */}
              <div className="flex items-center space-x-2 min-w-0 ml-auto">
                <span className="text-gray-500 text-sm flex-shrink-0">
                  Manager
                </span>
                <select className="border border-gray-300 rounded-lg p-2 w-28 sm:w-32 text-xs sm:text-sm">
                  <option value="" disabled selected hidden>
                    Default
                  </option>
                  <option value="ro-channyka">Ro Channyka</option>
                  <option value="john-doe">John Doe</option>
                  <option value="jane-smith">Jane Smith</option>
                </select>
                <button className="text-red-500 hover:text-red-700">
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center mt-3 w-full">
            <div className="font-custom border border-gray-300 rounded-lg p-2 flex items-center justify-between flex-wrap sm:flex-nowrap gap-2 w-full sm:w-5/6 md:w-5/6 lg:w-5/6 xl:w-3/4 text-sm sm:text-base">
              {/* Left: Industry */}
              <div className="flex items-center space-x-1 min-w-0">
                <MdPeopleOutline className="text-gray-500 flex-shrink-0" />
                <span className="text-[#3F4648] truncate">Marketing</span>
              </div>

              {/* Center: Location */}
              <div className="flex items-center space-x-1 min-w-0 mx-auto">
                <FiMapPin className="text-gray-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium truncate">
                  The Box Office
                </span>
              </div>

              {/* Right: Manager */}
              <div className="flex items-center space-x-2 min-w-0 ml-auto">
                <span className="text-gray-500 text-sm flex-shrink-0">
                  Manager
                </span>
                <select className="border border-gray-300 rounded-lg p-2 w-28 sm:w-32 text-xs sm:text-sm">
                  <option value="" disabled selected hidden>
                    Default
                  </option>
                  <option value="ro-channyka">Ro Channyka</option>
                  <option value="john-doe">John Doe</option>
                  <option value="jane-smith">Jane Smith</option>
                </select>
                <button className="text-red-500 hover:text-red-700">
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Title Section */}
        <div className="flex flex-col items-center mt-6 w-full mb-10">
          <div className="w-full sm:w-5/6 lg:w-3/5 xl:w-3/4">
            <div className="flex items-center justify-between mb-2">
              <label className="font-custom text-[#3F4648]">Title:</label>
              <AddTitleDialog />{" "}
              {/* This renders the button + dialog trigger */}
            </div>
          </div>

          <div className="font-custom border border-gray-300 rounded-lg p-3 flex items-center justify-between flex-wrap sm:flex-nowrap gap-2 w-full sm:w-5/6 md:w-5/6 lg:w-5/6 xl:w-3/4 text-sm sm:text-base mb-3">
            <div className="flex items-center space-x-2">
              <GoPerson className="text-gray-500" />
              <span className="text-gray-700 font-medium">CTO</span>
            </div>

            <div className="flex items-center space-x-4">
              <button className="text-red-500 hover:text-red-700">
                <FaTrashAlt />
              </button>
            </div>
          </div>
          <div className="font-custom border border-gray-300 rounded-lg p-3 flex items-center justify-between flex-wrap sm:flex-nowrap gap-2 w-full sm:w-5/6 md:w-5/6 lg:w-5/6 xl:w-3/4 text-sm sm:text-base mb-3">
            <div className="flex items-center space-x-2">
              <MdPeopleOutline className="text-gray-500" />
              <span className="text-gray-700 font-medium">Manager</span>
            </div>

            <div className="flex items-center space-x-4">
              <button className="text-red-500 hover:text-red-700">
                <FaTrashAlt />
              </button>
            </div>
          </div>
          <div className="font-custom border border-gray-300 rounded-lg p-3 flex items-center justify-between flex-wrap sm:flex-nowrap gap-2 w-full sm:w-5/6 md:w-5/6 lg:w-5/6 xl:w-3/4 text-sm sm:text-base">
            <div className="flex items-center space-x-2">
              <MdPeopleOutline className="text-gray-500" />
              <span className="text-gray-700 font-medium">The Box Office</span>
            </div>

            <div className="flex items-center space-x-4">
              <button className="text-red-500 hover:text-red-700">
                <FaTrashAlt />
              </button>
            </div>
          </div>
        </div>

        <h1 className="font-custom text-center text-3xl text-[#3F4648]">
          Format
        </h1>

        <div className="flex flex-wrap sm:flex-nowrap items-center mt-6 justify-center lg:justify-center">
          <label className="font-custom text-[#3F4648] w-full sm:w-1/3 lg:w-1/4 sm:text-left mb-2 sm:mb-0">
            Language:
          </label>
          <select
            id="company-name"
            className="font-custom border border-gray-300 rounded-lg p-2 w-full sm:w-1/2 lg:w-1/3 xl:w-2/4"
          >
            <option value="">English</option>
          </select>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap items-center mt-6 justify-center lg:justify-center">
          <label className="font-custom text-[#3F4648] w-full sm:w-1/3 lg:w-1/4 sm:text-left mb-2 sm:mb-0">
            Time zone:
          </label>
          <select
            id="company-name"
            className="font-custom border border-gray-300 rounded-lg p-2 w-full sm:w-1/2 lg:w-1/3 xl:w-2/4"
          >
            <option value="">Asia/Phnom_Penh</option>
          </select>
        </div>
      </div>
    </div>
  );
}
