"use client";

import Image from "next/image";
import { useState } from "react";
import { FaDownload } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { MdPeopleOutline } from "react-icons/md";
import { GoPerson } from "react-icons/go";
import { useDropzone } from "react-dropzone";
import { Settings, Trash2 } from "lucide-react";
import AddTitleDialog from "./components/addtitledialog";
import AddDepartmentDialog from "./components/adddepartmentdialog";
import AddBranchDialog from "./components/addbranchdialog";
import DeleteDialog from "./components/deletedialog";

export default function SettingPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [employee, setEmployee] = useState("");
  const [country, setCountry] = useState("");
  const [branchManager, setBranchManager] = useState("");
  const [departmentManager, setDepartmentManager] = useState("");

  // We'll maintain arrays for Branches, Departments, Titles so we can delete from them
  const [branches, setBranches] = useState([
    { id: 1, name: "The box office", manager: branchManager },
  ]);

  const [departments, setDepartments] = useState([
    {
      id: 1,
      name: "Marketing",
      location: "The Box Office",
      manager: departmentManager,
    },
    {
      id: 2,
      name: "Sales",
      location: "The Box Office",
      manager: departmentManager,
    },
    {
      id: 3,
      name: "Support",
      location: "The Box Office",
      manager: departmentManager,
    },
  ]);

  const [titles, setTitles] = useState([
    { id: 1, name: "CTO" },
    { id: 2, name: "Manager" },
    { id: 3, name: "The Box Office" },
  ]);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null); // { id, type, name }

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(URL.createObjectURL(acceptedFiles[0]));
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  // Open delete dialog for selected item
  const openDeleteDialog = (item) => {
    setDeleteItem(item);
    setDeleteDialogOpen(true);
  };

  // Confirm deletion
  const confirmDelete = () => {
    if (!deleteItem) return;
    const { id, type } = deleteItem;

    if (type === "branch") {
      setBranches((prev) => prev.filter((b) => b.id !== id));
    } else if (type === "department") {
      setDepartments((prev) => prev.filter((d) => d.id !== id));
    } else if (type === "title") {
      setTitles((prev) => prev.filter((t) => t.id !== id));
    }

    setDeleteDialogOpen(false);
    setDeleteItem(null);
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
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
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
                <FaDownload className="text-gray-400 text-8xl" />
                <p className="text-gray-500 text-xs font-medium mb-5 ml-3">
                  Drag your logo here <br />
                  Or <span className="text-blue-500">Browse</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Select Inputs */}
        <div className="flex flex-col items-center mt-6 w-full">
          <div className="font-custom flex flex-wrap gap-4 items-center justify-between w-full sm:w-5/6 md:w-5/6 lg:w-5/6 xl:w-3/4">
            {/* Industry */}
            <div className="flex flex-row items-center space-x-2 w-full sm:w-auto">
              <label className="text-[#3F4648] w-24">Industry</label>
              <select
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full sm:w-48"
              >
                <option value="">Others</option>
                <option value="anan-group">Anan Group</option>
                <option value="xyz-corp">XYZ Corp</option>
              </select>
            </div>

            {/* Employee */}
            <div className="flex flex-row items-center space-x-2 w-full sm:w-auto">
              <label className="text-[#3F4648] w-24">Employee</label>
              <select
                id="employee"
                value={employee}
                onChange={(e) => setEmployee(e.target.value)}
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
                value={country}
                onChange={(e) => setCountry(e.target.value)}
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
              <AddBranchDialog />
            </div>
          </div>

          <div className="flex flex-col items-center w-full">
            {branches.map((branch) => (
              <div
                key={branch.id}
                className="font-custom border border-gray-300 rounded-lg p-2 flex items-center justify-between flex-wrap sm:flex-nowrap gap-2 w-full sm:w-5/6 md:w-5/6 lg:w-5/6 xl:w-3/4 text-sm sm:text-base mb-3"
              >
                <div className="flex items-center space-x-1 min-w-0">
                  <FiMapPin className="text-gray-500 flex-shrink-0" />
                  <span className="text-[#3F4648] truncate">{branch.name}</span>
                </div>

                <div className="flex items-center space-x-2 min-w-0 ml-auto">
                  <span className="text-gray-500 text-sm flex-shrink-0">
                    Manager
                  </span>
                  <select
                    className="border border-gray-300 rounded-lg p-2 w-28 sm:w-32 text-xs sm:text-sm"
                    value={branchManager}
                    onChange={(e) => setBranchManager(e.target.value)}
                  >
                    <option value="" disabled hidden>
                      Default
                    </option>
                    <option value="ro-channyka">Ro Channyka</option>
                    <option value="john-doe">John Doe</option>
                    <option value="jane-smith">Jane Smith</option>
                  </select>
                  <button
                    className="text-grey-400 hover:text-red-700"
                    onClick={() =>
                      openDeleteDialog({
                        id: branch.id,
                        type: "branch",
                        name: branch.name,
                      })
                    }
                    aria-label={`Delete branch ${branch.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Section */}
        <div className="flex flex-col items-center mt-6 w-full">
          <div className="w-full sm:w-5/6 lg:w-3/5 xl:w-3/4">
            <div className="flex items-center justify-between mb-2">
              <label className="font-custom text-[#3F4648]">Department</label>
              <AddDepartmentDialog />
            </div>
          </div>

          <div className="flex flex-col items-center w-full">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className="font-custom border border-gray-300 rounded-lg p-2 flex items-center justify-between flex-wrap sm:flex-nowrap gap-2 w-full sm:w-5/6 md:w-5/6 lg:w-5/6 xl:w-3/4 text-sm sm:text-base mb-3"
              >
                <div className="flex items-center space-x-1 min-w-0">
                  <MdPeopleOutline className="text-gray-500 flex-shrink-0" />
                  <span className="text-[#3F4648] truncate">{dept.name}</span>
                </div>

                <div className="flex items-center space-x-1 min-w-0 mx-auto">
                  <FiMapPin className="text-gray-500 flex-shrink-0" />
                  <span className="text-gray-700 font-medium truncate">
                    {dept.location}
                  </span>
                </div>

                <div className="flex items-center space-x-2 min-w-0 ml-auto">
                  <span className="text-gray-500 text-sm flex-shrink-0">
                    Manager
                  </span>
                  <select
                    className="border border-gray-300 rounded-lg p-2 w-28 sm:w-32 text-xs sm:text-sm"
                    value={departmentManager}
                    onChange={(e) => setDepartmentManager(e.target.value)}
                  >
                    <option value="" disabled hidden>
                      Default
                    </option>
                    <option value="ro-channyka">Ro Channyka</option>
                    <option value="john-doe">John Doe</option>
                    <option value="jane-smith">Jane Smith</option>
                  </select>
                  <button
                    className="text-grey-400 hover:text-red-700"
                    onClick={() =>
                      openDeleteDialog({
                        id: dept.id,
                        type: "department",
                        name: dept.name,
                      })
                    }
                    aria-label={`Delete department ${dept.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Title Section */}
        <div className="flex flex-col items-center mt-6 w-full mb-10">
          <div className="w-full sm:w-5/6 lg:w-3/5 xl:w-3/4">
            <div className="flex items-center justify-between mb-2">
              <label className="font-custom text-[#3F4648]">Title:</label>
              <AddTitleDialog />
            </div>
          </div>

          {titles.map((title) => (
            <div
              key={title.id}
              className="font-custom border border-gray-300 rounded-lg p-3 flex items-center justify-between flex-wrap sm:flex-nowrap gap-2 w-full sm:w-5/6 md:w-5/6 lg:w-5/6 xl:w-3/4 text-sm sm:text-base mb-3"
            >
              <div className="flex items-center space-x-2">
                <GoPerson className="text-gray-500" />
                <span className="text-gray-700 font-medium">{title.name}</span>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  className="text-grey-400 hover:text-red-700"
                  onClick={() =>
                    openDeleteDialog({
                      id: title.id,
                      type: "title",
                      name: title.name,
                    })
                  }
                  aria-label={`Delete title ${title.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <h1 className="font-custom text-center text-3xl text-[#3F4648]">
          Format
        </h1>

        <div className="flex flex-wrap sm:flex-nowrap items-center mt-6 justify-center lg:justify-center">
          <label className="font-custom text-[#3F4648] w-full sm:w-1/3 lg:w-1/4 sm:text-left mb-2 sm:mb-0">
            Language:
          </label>
          <select
            id="language"
            className="font-custom border border-gray-300 rounded-lg p-2 w-full sm:w-1/2 lg:w-1/3 xl:w-2/4"
            defaultValue=""
          >
            <option value="">Eng</option>
            <option value="">Kh</option>
          </select>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap items-center mt-6 justify-center lg:justify-center">
          <label className="font-custom text-[#3F4648] w-full sm:w-1/3 lg:w-1/4 sm:text-left mb-2 sm:mb-0">
            Time zone:
          </label>
          <select
            id="timezone"
            className="font-custom border border-gray-300 rounded-lg p-2 w-full sm:w-1/2 lg:w-1/3 xl:w-2/4"
            defaultValue=""
          >
            <option value="">Asia/Phnom_Penh</option>
          </select>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
