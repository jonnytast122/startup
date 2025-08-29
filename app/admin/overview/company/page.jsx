"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import { FaDownload } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { MdPeopleOutline } from "react-icons/md";
import { GoPerson } from "react-icons/go";
import { useDropzone } from "react-dropzone";
import { Settings, Trash2, Pen } from "lucide-react";

import AddTitleDialog from "./components/add-title-dialog";
import AddDepartmentDialog from "./components/add-department-dialog";
import AddBranchDialog from "./components/add-branch-dialog";
import EditBranchDialog from "./components/edit-branch-dialog";
import DeleteDialog from "./components/delete-dialog";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCompany, updateCompany } from "@/lib/api/company";
import { fetchBranches, updateBranch, deleteBranch } from "@/lib/api/branch";
import { fetchMembers } from "@/lib/api/user";
import {
  fetchPositions,
  deletePosition,
  updatePosition,
} from "@/lib/api/position";
import {
  fetchCompanyDepartments,
  deleteDepartment,
  updateDepartment,
} from "@/lib/api/department";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/config/firebase";

export default function SettingPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [numberOfEmployees, setNumberOfEmployees] = useState("");
  const [country, setCountry] = useState("");
  const [branchManager, setBranchManager] = useState("");

  // Department states
  const [selectedNameDepartment, setSelectedNameDepartment] = useState({});
  const [selectedBranches, setSelectedBranches] = useState({});
  const [selectedManager, setSelectedManagers] = useState({});
  const [selectedPosition, setSelectedPosition] = useState({});

  // Branch states

  const [selectedBranchesDefault, setSelectedBranchesDefault] = useState({});
  const [selectedManagersDefault, setSelectedManagersDefault] = useState({});

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null); // { id, type, name }

  const [progress, setProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState("");

  const queryClient = useQueryClient();

  // Fetch company data
  const { data: company } = useQuery({
    queryKey: ["company"],
    queryFn: fetchCompany,
  });

  useEffect(() => {
    if (company) {
      setCompanyName(company.name || "");
      setIndustry(company.industries?.[0] || "");
      setNumberOfEmployees(company.numberOfEmployees || "");
      setSelectedFile(company.logo);
    }
  }, [company]);

  // Fetch departments
  const { data: departments = [] } = useQuery({
    queryKey: ["departments", company?.id],
    queryFn: () => fetchCompanyDepartments(company?.id),
    enabled: !!company?.id,
  });

  const { data: branches } = useQuery({
    queryKey: ["branches"],
    queryFn: fetchBranches,
  });

  const { data: members } = useQuery({
    queryKey: ["members"],
    queryFn: fetchMembers,
  });

  const { data: positions } = useQuery({
    queryKey: ["positions"],
    queryFn: fetchPositions,
  });

  const deleteDepartmentMutation = useMutation({
    mutationFn: deleteDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries(["departments"]);
    },
  });

  const updateDepartmentMutation = useMutation({
    mutationFn: updateDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries(["departments", company?.id]);
    },
  });

  const updateBranchMutation = useMutation({
    mutationFn: updateBranch,
    onSuccess: () => {
      queryClient.invalidateQueries(["branches"]);
    },
  });

  const deleteBranchMutation = useMutation({
    mutationFn: deleteBranch,
    onSuccess: () => {
      queryClient.invalidateQueries(["branches"]);
    },
  });

  const deletePositionMutation = useMutation({
    mutationFn: deletePosition,
    onSuccess: () => {
      queryClient.invalidateQueries(["positions"]);
    },
  });

  const updatePositionMutation = useMutation({
    mutationFn: updatePosition,
    onSuccess: () => {
      queryClient.invalidateQueries(["positions"]);
    },
  });

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const storageRef = ref(storage, `uploads/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(percent);
      },
      (error) => {
        console.error("Upload failed:", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setSelectedFile(url);
        });
      }
    );
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const openDeleteDialog = (item) => {
    setDeleteItem(item);
    setDeleteDialogOpen(true);
  };

  const openEditDialog = (item) => {
    setEditDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteItem) return;
    const { id, type } = deleteItem;

    if (type === "department") {
      deleteDepartmentMutation.mutate(id);
    } else if (type === "branch") {
      deleteBranchMutation.mutate(id);
    } else if (type === "position") {
      deletePositionMutation.mutate(id);
    }

    setDeleteDialogOpen(false);
    setDeleteItem(null);
  };

  const handleBranchChange = (deptId, branchId) => {
    setSelectedBranches((prev) => ({
      ...prev,
      [deptId]: branchId,
    }));

    updateDepartmentMutation.mutate({
      id: deptId,
      data: { branch: branchId },
    });
  };

  const handleManagerChange = (deptId, managerId) => {
    setSelectedManagers((prev) => ({
      ...prev,
      [deptId]: managerId,
    }));

    updateDepartmentMutation.mutate({
      id: deptId,
      data: { manager: managerId },
    });
  };

  const handleDepartmentNameChange = (deptId, name) => {
    setSelectedNameDepartment((prev) => ({
      ...prev,
      [deptId]: name,
    }));

    updateDepartmentMutation.mutate({
      id: deptId,
      data: { name },
    });
  };

  const handlePositionChange = (deptId, title) => {
    setSelectedPosition((prev) => ({
      ...prev,
      [deptId]: title,
    }));

    updatePositionMutation.mutate({
      id: deptId,
      data: { title },
    });
  };

  const handleBranchDefaultChange = (branchId, name) => {
    setSelectedBranchesDefault((prev) => ({
      ...prev,
      [branchId]: name,
    }));

    updateBranchMutation.mutate({
      id: branchId,
      data: { name },
    });
  };

  const handleBranchManagerChange = (branchId, managerId) => {
    setSelectedManagersDefault((prev) => ({
      ...prev,
      [branchId]: managerId,
    }));

    updateBranchMutation.mutate({
      id: branchId,
      data: { manager: managerId },
    });
  };

  const updateCompanyMutation = useMutation({
    mutationFn: updateCompany,
    onSuccess: () => {
      queryClient.invalidateQueries(["company"]);
    },
  });

  const handleCompanyChange = () => {
    updateCompanyMutation.mutate({
      id: company.id,
      data: {
        logo: selectedFile,
        name: companyName,
        numberOfEmployees,
        industries: [industry],
      },
    });
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

        {/* Company Name Input */}
        <div className="flex flex-wrap sm:flex-nowrap items-center mt-6 justify-center lg:justify-center">
          <label className="font-custom text-[#3F4648] w-full sm:w-1/3 lg:w-1/4 sm:text-left mb-2 sm:mb-0">
            Company Name
          </label>
          <input
            id="company-name"
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Company Name"
            className="font-custom border border-gray-300 rounded-lg p-2 w-full sm:w-1/2 lg:w-1/3 xl:w-2/4"
          />
        </div>

        {/* Logo Upload */}
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
              <>
                <div className="flex w-full items-center justify-center">
                  <FaDownload className="text-gray-400 text-8xl" />
                  <p className="text-gray-500 text-xs font-medium mb-5 ml-3">
                    Drag your logo here <br />
                    Or <span className="text-blue-500">Browse</span>
                  </p>
                </div>
                {progress > 0 && progress < 100 && (
                  <p>Uploading... {progress}%</p>
                )}
              </>
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
                <option value="">Select industry</option>
                <option value="Technology">Technology</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Finance">Finance</option>
                <option value="Education">Education</option>
                <option value="Retail">Retail</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Hospitality">Hospitality</option>
                <option value="Construction">Construction</option>
              </select>
            </div>

            {/* Employee */}
            <div className="flex flex-row items-center space-x-2 w-full sm:w-auto">
              <label className="text-[#3F4648] w-24">Employee</label>
              <select
                id="employee"
                value={numberOfEmployees}
                onChange={(e) => setNumberOfEmployees(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full sm:w-48"
              >
                <option value="">1–10</option>
                <option value="11-50">11–50</option>
                <option value="51-100">51-100</option>
                <option value="101-500">101-500</option>
                <option value="500+">500+</option>
              </select>
            </div>

            {/* Country */}
            {/* <div className="flex flex-row items-center space-x-2 w-full sm:w-auto">
              <label className="text-[#3F4648] w-24">Country</label>
              <select
                id="country"
                value={country || company?.locations?.[0] || ""}
                onChange={(e) => setCountry(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full sm:w-48"
              >
                <option value="">Cambodia</option>
                <option value="anan-group">Anan Group</option>
                <option value="xyz-corp">XYZ Corp</option>
              </select>
            </div> */}
          </div>
        </div>

        {/* Branch Section */}
        <div className="flex flex-col items-center mt-6 w-full">
          <div className="w-full sm:w-5/6 lg:w-3/5 xl:w-3/4">
            <div className="flex items-center justify-between mb-2">
              <label className="font-custom text-[#3F4648]">Branch</label>
              <AddBranchDialog isEdit={false} />
            </div>
          </div>

          <div className="flex flex-col items-center w-full">
            {branches?.results?.map((branch) => (
              <div
                key={branch.id}
                className="font-custom border border-gray-300 rounded-lg p-2 flex items-center justify-between flex-wrap sm:flex-nowrap gap-2 w-full sm:w-5/6 lg:w-3/4 text-sm mb-3"
              >
                <div className="flex items-center space-x-1 min-w-0">
                  <FiMapPin className="text-gray-500 flex-shrink-0" />
                  <input
                    value={selectedBranchesDefault[branch.id] || branch.name}
                    onChange={(e) =>
                      handleBranchDefaultChange(branch.id, e.target.value)
                    }
                    onKeyUp={() => {}}
                    placeholder={branch.name}
                    className="font-custom border border-gray-300 rounded-lg p-2 w-full xl:w-55"
                  />
                </div>
                <div className="flex items-center space-x-2 min-w-0 ml-auto">
                  <span className="text-gray-500 text-sm flex-shrink-0">
                    Manager
                  </span>
                  <select
                    className="border border-gray-300 rounded-lg p-2 w-28 sm:w-32 text-xs sm:text-sm"
                    value={
                      selectedManagersDefault[branch.id] ||
                      branch?.manager?.id ||
                      ""
                    }
                    onChange={(e) =>
                      handleBranchManagerChange(branch.id, e.target.value)
                    }
                  >
                    {members?.results.map((member) => {
                      const lastName = `${
                        member?.employee?.name.split(" ")[0]
                      }`;
                      const firstName = `${
                        member?.employee?.name.split(" ")[1]
                      }`;
                      const fullName = `${lastName} ${firstName}`;
                      return (
                        <option key={member.id} value={member?.employee?.id}>
                          {fullName}
                        </option>
                      );
                    })}
                  </select>

                  <AddBranchDialog isEdit={true} branch={branch} />
                  <button
                    className="text-grey-400 hover:text-red-700"
                    onClick={() =>
                      openDeleteDialog({
                        id: branch.id,
                        type: "branch",
                        name: branch.name,
                      })
                    }
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
            {departments?.results?.map((dept) => (
              <div
                key={dept.id}
                className="font-custom border border-gray-300 rounded-lg p-2 flex items-center justify-between flex-wrap sm:flex-nowrap gap-2 w-full sm:w-5/6 lg:w-3/4 text-sm mb-3"
              >
                <div className="flex items-center space-x-1 min-w-0 flex-1">
                  <MdPeopleOutline className="text-gray-500" />
                  <input
                    value={selectedNameDepartment[dept.id] || dept.name}
                    onChange={(e) =>
                      handleDepartmentNameChange(dept.id, e.target.value)
                    }
                    onKeyUp={() => {}}
                    placeholder={dept.name}
                    className="font-custom border border-gray-300 rounded-lg p-2 w-full xl:w-55"
                  />
                </div>
                <div className="flex items-center space-x-1 justify-center flex-1">
                  <FiMapPin className="text-gray-500" />
                  <select
                    className="border border-gray-300 rounded-lg p-2 w-39 sm:w-39 text-xs sm:text-sm"
                    value={selectedBranches[dept.id] || dept.branch.id}
                    onChange={(e) =>
                      handleBranchChange(dept.id, e.target.value)
                    }
                  >
                    {branches?.results.map((branch) => (
                      <option key={branch?.id} value={branch?.id}>
                        {branch?.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-2 justify-end flex-1">
                  <span className="text-gray-500 text-sm">Manager</span>
                  <select
                    className="border border-gray-300 rounded-lg p-2 w-28 sm:w-32 text-xs sm:text-sm"
                    value={selectedManager[dept.id] || dept?.manager?.id || ""}
                    onChange={(e) =>
                      handleManagerChange(dept.id, e.target.value)
                    }
                  >
                    {!dept?.manager && (
                      <option value={""}>{"Empty User"}</option>
                    )}
                    {members?.results.map((member) => {
                      const lastName = `${
                        member?.employee?.name.split(" ")[0]
                      }`;
                      const firstName = `${
                        member?.employee?.name.split(" ")[1]
                      }`;
                      const fullName = `${lastName} ${firstName}`;
                      return (
                        <option key={member.id} value={member?.employee?.id}>
                          {fullName}
                        </option>
                      );
                    })}
                  </select>
                  <button
                    className="text-gray-400 hover:text-red-700"
                    onClick={() =>
                      openDeleteDialog({ ...dept, type: "department" })
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
              <label className="font-custom text-[#3F4648]">Position</label>
              <AddTitleDialog />
            </div>
          </div>
          {positions?.results?.map((title, i) => {
            return (
              <div
                key={i}
                className="font-custom border border-gray-300 rounded-lg p-3 flex items-center justify-between w-full sm:w-5/6 lg:w-3/4 text-sm mb-3"
              >
                <div className="flex items-center space-x-2">
                  <GoPerson className="text-gray-500" />
                  <input
                    value={selectedPosition[title.id] || title.title}
                    onChange={(e) =>
                      handlePositionChange(title.id, e.target.value)
                    }
                    onKeyUp={() => {}}
                    placeholder={title.title}
                    className="font-custom border border-gray-300 rounded-lg p-2 w-full xl:w-55"
                  />

                  {/* <span className="text-gray-700">{title.title}</span> */}
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    className="text-grey-400 hover:text-red-700"
                    onClick={() =>
                      openDeleteDialog({
                        id: title.id,
                        name: title.title,
                        type: "position",
                      })
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Format */}
        {/* <h1 className="font-custom text-center text-3xl text-[#3F4648]">
          Format
        </h1>
        <div className="flex flex-wrap items-center mt-6 justify-center lg:justify-center">
          <label className="font-custom text-[#3F4648] w-full sm:w-1/3 lg:w-1/4">
            Language:
          </label>
          <select
            id="language"
            className="font-custom border border-gray-300 rounded-lg p-2 w-full sm:w-1/2 lg:w-1/3"
            defaultValue=""
          >
            <option value="">Eng</option>
            <option value="">Kh</option>
          </select>
        </div>
        <div className="flex flex-wrap items-center mt-6 justify-center lg:justify-center">
          <label className="font-custom text-[#3F4648] w-full sm:w-1/3 lg:w-1/4">
            Time zone:
          </label>
          <select
            id="timezone"
            className="font-custom border border-gray-300 rounded-lg p-2 w-full sm:w-1/2 lg:w-1/3"
            defaultValue=""
          >
            <option value="">Asia/Phnom_Penh</option>
          </select>
        </div> */}
        <div className="w-full h-[1px] bg-gray-300 mt-6" />
        <div className="flex justify-end">
          <Button
            onClick={handleCompanyChange}
            className="mt-4 px-6 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            {updateCompanyMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Edit Confirmation Dialog */}
      <EditBranchDialog
        open={editDialogOpen}
        setOpen={() => setEditDialogOpen(false)}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
