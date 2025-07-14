"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
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
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";

export default function SettingPage() {
  const { user, token } = useAuth();
  const [companyData, setCompanyData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [branches, setBranches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [titles, setTitles] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

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

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        if (!user?.company || !token) return;

        const res = await axios.get(
          `http://localhost:3001/v1/companies/${user.company}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCompanyData(res.data);
        setBranches(res.data.branches || []);
        setDepartments(res.data.departments || []);
        setTitles(res.data.titles || []);
      } catch (err) {
        console.error("Failed to fetch company info", err);
      }
    };

    fetchCompany();
  }, [user, token]);

  const openDeleteDialog = (item) => {
    setDeleteItem(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteItem) return;
    setDeleteDialogOpen(false);
    setDeleteItem(null);
  };

  if (!companyData) return <div className="p-10 text-center">Loading...</div>;

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

        <div className="flex flex-wrap sm:flex-nowrap items-center mt-6 justify-center lg:justify-center">
          <label className="font-custom text-[#3F4648] w-full sm:w-1/3 lg:w-1/4 sm:text-left mb-2 sm:mb-0">
            Company Name
          </label>
          <input
            id="company-name"
            type="text"
            value={companyData?.name || ""}
            readOnly
            className="font-custom border border-gray-300 rounded-lg p-2 w-full sm:w-1/2 lg:w-1/3 xl:w-2/4 bg-gray-100"
          />
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center mt-6 justify-center lg:justify-center">
          <label className="font-custom text-[#3F4648] w-full sm:w-1/3 lg:w-1/4 sm:text-left mb-2 sm:mb-0">
            Company Logo
          </label>
          <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-2/4 h-60 border border-gray-300 rounded-xl flex items-center justify-center bg-white">
            <img
              src={selectedFile || companyData?.logo}
              alt="Company Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div className="flex flex-col items-center mt-6 w-full">
          <div className="font-custom flex flex-wrap gap-4 items-center justify-between w-full sm:w-5/6 md:w-5/6 lg:w-5/6 xl:w-3/4">
            <div className="flex flex-row items-center space-x-2 w-full sm:w-auto">
              <label className="text-[#3F4648] w-24">Industry</label>
              <select
                id="industry"
                value={companyData?.industries?.[0] || ""}
                className="border border-gray-300 rounded-lg p-2 w-full sm:w-48 bg-gray-100"
                disabled
              >
                <option value={companyData?.industries?.[0]}>
                  {companyData?.industries?.[0] || "N/A"}
                </option>
              </select>
            </div>

            <div className="flex flex-row items-center space-x-2 w-full sm:w-auto">
              <label className="text-[#3F4648] w-24">Employee</label>
              <input
                type="text"
                value={companyData?.numberOfEmployees || ""}
                readOnly
                className="border border-gray-300 rounded-lg p-2 w-full sm:w-48 bg-gray-100"
              />
            </div>

            <div className="flex flex-row items-center space-x-2 w-full sm:w-auto">
              <label className="text-[#3F4648] w-24">Location</label>
              <input
                type="text"
                value={companyData?.location || ""}
                readOnly
                className="border border-gray-300 rounded-lg p-2 w-full sm:w-48 bg-gray-100"
              />
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
            {branches.map((branch, index) => (
              <div
                key={index}
                className="font-custom border border-gray-300 rounded-lg p-2 flex items-center justify-between flex-wrap sm:flex-nowrap gap-2 w-full sm:w-5/6 md:w-5/6 lg:w-5/6 xl:w-3/4 text-sm sm:text-base mb-3"
              >
                <div className="flex items-center space-x-1 min-w-0">
                  <FiMapPin className="text-gray-500 flex-shrink-0" />
                  <span className="text-[#3F4648] truncate">{branch.name}</span>
                </div>
                <button
                  className="text-grey-400 hover:text-red-700 ml-auto"
                  onClick={() =>
                    openDeleteDialog({
                      id: index,
                      type: "branch",
                      name: branch.name,
                    })
                  }
                  aria-label={`Delete branch ${branch.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
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
            {departments.map((dept, index) => (
              <div
                key={index}
                className="font-custom border border-gray-300 rounded-lg p-3 flex items-center justify-between flex-wrap sm:flex-nowrap gap-2 w-full sm:w-5/6 md:w-5/6 lg:w-5/6 xl:w-3/4 text-sm sm:text-base mb-3"
              >
                <div className="flex items-center space-x-2">
                  <MdPeopleOutline className="text-gray-500" />
                  <span className="text-gray-700 font-medium">{dept.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiMapPin className="text-gray-500" />
                  <span className="text-gray-700 font-medium">
                    {dept.location}
                  </span>
                </div>
                <button
                  className="text-grey-400 hover:text-red-700"
                  onClick={() =>
                    openDeleteDialog({
                      id: index,
                      type: "department",
                      name: dept.name,
                    })
                  }
                  aria-label={`Delete department ${dept.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Title Section */}
        <div className="flex flex-col items-center mt-6 w-full">
          <div className="w-full sm:w-5/6 lg:w-3/5 xl:w-3/4">
            <div className="flex items-center justify-between mb-2">
              <label className="font-custom text-[#3F4648]">Title</label>
              <AddTitleDialog />
            </div>
          </div>

          <div className="flex flex-col items-center w-full">
            {titles.map((title, index) => (
              <div
                key={index}
                className="font-custom border border-gray-300 rounded-lg p-3 flex items-center justify-between flex-wrap sm:flex-nowrap gap-2 w-full sm:w-5/6 md:w-5/6 lg:w-5/6 xl:w-3/4 text-sm sm:text-base mb-3"
              >
                <div className="flex items-center space-x-2">
                  <GoPerson className="text-gray-500" />
                  <span className="text-gray-700 font-medium">
                    {title.name}
                  </span>
                </div>
                <button
                  className="text-grey-400 hover:text-red-700"
                  onClick={() =>
                    openDeleteDialog({
                      id: index,
                      type: "title",
                      name: title.name,
                    })
                  }
                  aria-label={`Delete title ${title.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
