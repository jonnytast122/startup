"use client";

import Image from "next/image";
import { useState } from "react";
import { FaDownload } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { MdPeopleOutline } from "react-icons/md";
import { GoPerson } from "react-icons/go";
import { useDropzone } from "react-dropzone";

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
      <div className="bg-white rounded-xl mb-3 shadow-md py-6 px-6">
        <div className="flex items-center space-x-3 p-5">
          <Image src="/images/setting.png" alt="" width={40} height={40} />
          <span className="font-custom text-3xl text-black">Setting</span>
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
            className="font-custom border border-gray-300 rounded-lg p-2 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4"
          />
        </div>

        {/* Company Logo */}
        <div className="flex flex-wrap sm:flex-nowrap items-center mt-6 justify-center lg:justify-center">
          <label className="font-custom text-[#3F4648] w-full sm:w-1/3 lg:w-1/4 sm:text-left mb-2 sm:mb-0">
            Company Logo
          </label>
          <div
            {...getRootProps()}
            className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 h-60 border border-gray-300 rounded-xl flex items-center justify-center cursor-pointer bg-white hover:bg-gray-100 transition"
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
        <div className="flex flex-wrap sm:flex-nowrap items-center mt-6 justify-center lg:justify-center">
          <label className="font-custom text-[#3F4648] w-full sm:w-1/3 lg:w-1/4 sm:text-left mb-2 sm:mb-0">
            Industry
          </label>
          <select
            id="company-name"
            className="font-custom border border-gray-300 rounded-lg p-2 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4"
          >
            <option value="">Others</option>
            <option value="anan-group">Anan Group</option>
            <option value="xyz-corp">XYZ Corp</option>
            <option value="abc-ltd">ABC Ltd</option>
          </select>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap items-center mt-6 justify-center lg:justify-center">
          <label className="font-custom text-[#3F4648] w-full sm:w-1/3 lg:w-1/4 sm:text-left mb-2 sm:mb-0">
            Employee
          </label>
          <select
            id="company-name"
            className="font-custom border border-gray-300 rounded-lg p-2 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4"
          >
            <option value="">1-10</option>
            <option value="anan-group">Anan Group</option>
            <option value="xyz-corp">XYZ Corp</option>
            <option value="abc-ltd">ABC Ltd</option>
          </select>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap items-center mt-6 justify-center lg:justify-center">
          <label className="font-custom text-[#3F4648] w-full sm:w-1/3 lg:w-1/4 sm:text-left mb-2 sm:mb-0">
            Country
          </label>
          <select
            id="company-name"
            className="font-custom border border-gray-300 rounded-lg p-2 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4"
          >
            <option value="">Cambodia</option>
            <option value="anan-group">Anan Group</option>
            <option value="xyz-corp">XYZ Corp</option>
            <option value="abc-ltd">ABC Ltd</option>
          </select>
        </div>
        {/* Branch Section */}
        <div className="flex flex-col items-center mt-6 w-full">
          <div className="w-full sm:w-5/6 lg:w-3/5 xl:w-1/2">
            <label className="font-custom text-[#3F4648] mb-2 block">
              Branch:
            </label>
          </div>

          <div className="font-custom border border-gray-300 rounded-lg p-3 flex items-center justify-between w-full sm:w-5/6 lg:w-3/5 xl:w-1/2">
            <div className="flex items-center space-x-2">
              <FiMapPin className="text-gray-500" />
              <span className="text-gray-700 font-medium">The Box Office</span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-500 text-sm">Manager</span>
              <select className="border border-gray-300 rounded-lg p-2 w-32">
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

        {/* Department Section */}
        <div className="flex flex-col items-center mt-6 w-full">
          <div className="w-full sm:w-5/6 lg:w-3/5 xl:w-1/2">
            <div className="flex items-center justify-between mb-2">
              {/* Left Label */}
              <label className="font-custom text-[#3F4648]">Department:</label>

              {/* Right "Add Department" Text with Hover Effect */}
              <button className="font-custom text-blue-500 hover:text-blue-700 text-sm transition duration-200">
                + Add Department
              </button>
            </div>
          </div>

          <div className="font-custom border mb-2 border-gray-300 rounded-lg p-3 flex items-center justify-between w-full sm:w-5/6 lg:w-3/5 xl:w-1/2">
            <div className="flex items-center space-x-2">
              <MdPeopleOutline className="text-gray-500" />
              <span className="text-gray-700 font-medium">The Box Office</span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-500 text-sm">Manager</span>
              <select className="border border-gray-300 rounded-lg p-2 w-32">
                <option value="ro-channyka">Ro Channyka</option>
                <option value="john-doe">John Doe</option>
                <option value="jane-smith">Jane Smith</option>
              </select>
              <button className="text-red-500 hover:text-red-700">
                <FaTrashAlt />
              </button>
            </div>
          </div>
          <div className="font-custom border mb-2 border-gray-300 rounded-lg p-3 flex items-center justify-between w-full sm:w-5/6 lg:w-3/5 xl:w-1/2">
            <div className="flex items-center space-x-2">
              <MdPeopleOutline className="text-gray-500" />
              <span className="text-gray-700 font-medium">The Box Office</span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-500 text-sm">Manager</span>
              <select className="border border-gray-300 rounded-lg p-2 w-32">
                <option value="ro-channyka">Ro Channyka</option>
                <option value="john-doe">John Doe</option>
                <option value="jane-smith">Jane Smith</option>
              </select>
              <button className="text-red-500 hover:text-red-700">
                <FaTrashAlt />
              </button>
            </div>
          </div>
          <div className="font-custom border mb-2 border-gray-300 rounded-lg p-3 flex items-center justify-between w-full sm:w-5/6 lg:w-3/5 xl:w-1/2">
            <div className="flex items-center space-x-2">
              <MdPeopleOutline className="text-gray-500" />
              <span className="text-gray-700 font-medium">The Box Office</span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-500 text-sm">Manager</span>
              <select className="border border-gray-300 rounded-lg p-2 w-32">
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

        {/* Title Section */}
        <div className="flex flex-col items-center mt-6 w-full mb-10">
          <div className="w-full sm:w-5/6 lg:w-3/5 xl:w-1/2">
            <div className="flex items-center justify-between mb-2">
              {/* Left Label */}
              <label className="font-custom text-[#3F4648]">Title:</label>

              {/* Right "Add Department" Text with Hover Effect */}
              <button className="font-custom text-blue-500 hover:text-blue-700 text-sm transition duration-200">
                + Add Title
              </button>
            </div>
          </div>

          <div className="font-custom border border-gray-300 rounded-lg p-3 flex items-center justify-between w-full sm:w-5/6 lg:w-3/5 xl:w-1/2">
            <div className="flex items-center space-x-2">
              <GoPerson className="text-gray-500" />
              <span className="text-gray-700 font-medium">Software Engineer</span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-500 text-sm">Manager</span>
              <select className="border border-gray-300 rounded-lg p-2 w-32">
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
    </div>
  );
}
