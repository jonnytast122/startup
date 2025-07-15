"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
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
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import ApiRoutes from "@/constants/ApiRoutes";

export default function SettingPage() {
  const { token } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [companyData, setCompanyData] = useState(null);
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
    if (!token) return;

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const fetchData = async () => {
      try {
        const [companyRes, branchRes, deptRes, titleRes] = await Promise.all([
          axios.get(`${ApiRoutes.company.get}/${user.company}`, config), // if company ID still needed here
          axios.get(ApiRoutes.branch.get, config), // no company id
          axios.get(ApiRoutes.department.get, config), // no company id
          axios.get(ApiRoutes.title.get, config), // no company id
        ]);

        setCompanyData(companyRes.data);
        setBranches(branchRes.data);
        setDepartments(deptRes.data);
        setTitles(titleRes.data);
      } catch (error) {
        console.error("❌ Failed to fetch company data", error);
      }
    };

    fetchData();
  }, [token]);

  const openDeleteDialog = (item) => {
    setDeleteItem(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteItem) return;
    const { id, type } = deleteItem;

    if (type === "branch") {
      setBranches((prev) => prev.filter((b) => b._id !== id));
    } else if (type === "department") {
      setDepartments((prev) => prev.filter((d) => d._id !== id));
    } else if (type === "title") {
      setTitles((prev) => prev.filter((t) => t._id !== id));
    }

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

        {/* Company Name */}
        <div className="flex flex-wrap sm:flex-nowrap items-center mt-6 justify-center lg:justify-center">
          <label className="font-custom text-[#3F4648] w-full sm:w-1/3 lg:w-1/4 sm:text-left mb-2 sm:mb-0">
            Company Name
          </label>
          <input
            id="company-name"
            type="text"
            value={companyData.name || ""}
            readOnly
            className="font-custom border border-gray-300 rounded-lg p-2 w-full sm:w-1/2 lg:w-1/3 xl:w-2/4"
          />
        </div>

        {/* Company Logo */}
        <div className="flex flex-wrap sm:flex-nowrap items-center mt-6 justify-center lg:justify-center">
          <label className="font-custom text-[#3F4648] w-full sm:w-1/3 lg:w-1/4 sm:text-left mb-2 sm:mb-0">
            Company Logo
          </label>
          <div className="flex items-center gap-4 w-full sm:w-1/2 lg:w-1/3 xl:w-2/4">
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center cursor-pointer w-full h-32"
            >
              <input {...getInputProps()} />
              {selectedFile ? (
                <img
                  src={selectedFile}
                  alt="Company Logo"
                  className="max-w-full max-h-full"
                />
              ) : companyData.logoUrl ? (
                <img
                  src={companyData.logoUrl}
                  alt="Company Logo"
                  className="max-w-full max-h-full"
                />
              ) : (
                <p className="text-gray-500">Drag and drop logo here</p>
              )}
            </div>
            {(selectedFile || companyData.logoUrl) && (
              <button
                onClick={() => setSelectedFile(null)}
                className="text-red-500 hover:text-red-700"
                aria-label="Remove logo"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
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
                key={branch.id || branch._id}
                className="font-custom border border-gray-300 rounded-lg p-2 flex items-center justify-between flex-wrap sm:flex-nowrap gap-2 w-full sm:w-5/6 md:w-5/6 lg:w-5/6 xl:w-3/4 text-sm sm:text-base mb-3"
              >
                <div className="flex items-center space-x-1 min-w-0">
                  <FiMapPin className="text-gray-500 flex-shrink-0" />
                  <span className="text-[#3F4648] truncate">{branch.name}</span>
                </div>
                <button
                  className="text-grey-400 hover:text-red-700"
                  onClick={() =>
                    openDeleteDialog({
                      id: branch.id || branch._id,
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
            {departments.map((dept) => (
              <div
                key={dept.id || dept._id}
                className="font-custom border border-gray-300 rounded-lg p-2 flex items-center justify-between flex-wrap sm:flex-nowrap gap-2 w-full sm:w-5/6 md:w-5/6 lg:w-5/6 xl:w-3/4 text-sm sm:text-base mb-3"
              >
                <div className="flex items-center space-x-1 min-w-0">
                  <MdPeopleOutline className="text-gray-500 flex-shrink-0" />
                  <span className="text-[#3F4648] truncate">{dept.name}</span>
                </div>
                <button
                  className="text-grey-400 hover:text-red-700"
                  onClick={() =>
                    openDeleteDialog({
                      id: dept.id || dept._id,
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
        <div className="flex flex-col items-center mt-6 w-full mb-10">
          <div className="w-full sm:w-5/6 lg:w-3/5 xl:w-3/4">
            <div className="flex items-center justify-between mb-2">
              <label className="font-custom text-[#3F4648]">Title</label>
              <AddTitleDialog />
            </div>
          </div>

          <div className="flex flex-col items-center w-full">
            {titles.map((title) => (
              <div
                key={title.id || title._id}
                className="font-custom border border-gray-300 rounded-lg p-2 flex items-center justify-between flex-wrap sm:flex-nowrap gap-2 w-full sm:w-5/6 md:w-5/6 lg:w-5/6 xl:w-3/4 text-sm sm:text-base mb-3"
              >
                <div className="flex items-center space-x-1 min-w-0">
                  <GoPerson className="text-gray-500 flex-shrink-0" />
                  <span className="text-[#3F4648] truncate">{title.name}</span>
                </div>
                <button
                  className="text-grey-400 hover:text-red-700"
                  onClick={() =>
                    openDeleteDialog({
                      id: title.id || title._id,
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

        <DeleteDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={confirmDelete}
        />
      </div>
    </div>
  );
}
