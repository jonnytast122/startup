"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect, useRef, useMemo } from "react";
import { UserMinus, UserPlus, ChevronDown } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  promoteToAdmin,
  demoteToUser,
  updateAdminPermissions,
} from "@/lib/api/userRoles";

export default function PromoteDemoteDialog({
  open,
  setOpen,
  type,
  user,
  onConfirm,
  showSuccess,
  showError,
}) {
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [imageError, setImageError] = useState(false);
  const [menuBranchOpen, setMenuBranchOpen] = useState(false);
  const [menuFeatureOpen, setMenuFeatureOpen] = useState(false);

  const ProfileCell = ({ profileImg, employeeName }) => {
    const [imageError, setImageError] = useState(false);
    const nameParts = employeeName.split(" ");
    const firstNameInitial = nameParts[0]?.charAt(0)?.toUpperCase() ?? "";
    const lastNameInitial = nameParts[1]?.charAt(0)?.toUpperCase() ?? "";

    return (
      <div className="flex justify-center items-center w-20 h-20 rounded-full bg-gray-300 overflow-hidden">
        {profileImg && !imageError ? (
          <img
            src={profileImg}
            alt="Profile"
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="text-2xl text-gray-600 font-medium">
            {firstNameInitial}
            {lastNameInitial}
          </span>
        )}
      </div>
    );
  };

  const allFeatures = useMemo(
    () => [
      {
        label: "Manage Users",
        value: "manageUsers",
        permissions: ["manageUsers"],
      },
      {
        label: "Manage Company",
        value: "manageCompany",
        permissions: [
          "manageCompanies",
          "manageBranches",
          "manageDepartments",
          "managePositions",
        ],
      },
      {
        label: "Manage Work Shift",
        value: "manageWorkShift",
        permissions: ["manageShifts", "manageCalendars"],
      },
      {
        label: "Manage Policies",
        value: "managePolicies",
        permissions: [
          "manageLeavePolicies",
          "manageOvertimeSettings",
          "manageLeaveRequests",
          "manageOvertimeRequests",
        ],
      },
      {
        label: "Manage Group Sections",
        value: "manageGroupSections",
        permissions: ["manageGroupSections"],
      },
      {
        label: "Manage Attendance",
        value: "manageAttendance",
        permissions: ["manageAttendance"],
      },
      {
        label: "Manage Payroll",
        value: "managePayroll",
        permissions: ["managePayroll"],
      },
    ],
    [],
  );

  const branchRef = useRef(null);
  const featureRef = useRef(null);
  const queryClient = useQueryClient();

  const employee = user?.employee || user || {};
  const displayName = employee?.name
    ? employee.name
    : [employee?.firstname, employee?.lastname].filter(Boolean).join(" ");
  const profileImg = employee?.profileImg || employee?.profile || user?.profile;
  const isAdmin =
    (employee?.role || user?.role || "").toLowerCase() === "admin";

  const toggleSelection = (item, setFn, selected) => {
    setFn((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  const allFeatureValues = useMemo(
    () => allFeatures.map((feature) => feature.value),
    [allFeatures],
  );

  const isAllSelected =
    allFeatureValues.length > 0 &&
    allFeatureValues.every((value) => selectedFeatures.includes(value));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedFeatures([]);
      return;
    }
    setSelectedFeatures(allFeatureValues);
  };

  const resolveSelectedPermissions = () => {
    const permissions = new Set();
    selectedFeatures.forEach((featureValue) => {
      const feature = allFeatures.find((item) => item.value === featureValue);
      if (feature) {
        feature.permissions.forEach((perm) => permissions.add(perm));
      }
    });
    return Array.from(permissions);
  };

  const promoteMutation = useMutation({
    mutationFn: promoteToAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSuccess?.(`${displayName || "User"} promoted to admin`);
      onConfirm?.("admin", selectedBranches, selectedFeatures);
      setOpen(false);
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to promote user";
      showError?.(msg);
    },
  });

  const demoteMutation = useMutation({
    mutationFn: demoteToUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSuccess?.(`${displayName || "User"} demoted to user`);
      onConfirm?.("user", selectedBranches, selectedFeatures);
      setOpen(false);
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to demote user";
      showError?.(msg);
    },
  });

  const updatePermissionsMutation = useMutation({
    mutationFn: ({ userId, payload }) =>
      updateAdminPermissions(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSuccess?.("Permissions updated");
      onConfirm?.("admin", selectedBranches, selectedFeatures);
      setOpen(false);
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update permissions";
      showError?.(msg);
    },
  });

  const handleConfirm = () => {
    const userId = employee?._id || employee?.id || user?._id || user?.id;
    if (!userId) {
      showError?.("User not found");
      return;
    }

    if (type === "demote") {
      demoteMutation.mutate(userId);
      return;
    }

    if (isAdmin) {
      const existing = Array.isArray(employee?.permissions)
        ? employee.permissions
        : [];
      const desired = resolveSelectedPermissions();
      const add = desired.filter((perm) => !existing.includes(perm));
      const remove = existing.filter((perm) => !desired.includes(perm));
      updatePermissionsMutation.mutate({ userId, payload: { add, remove } });
      return;
    }

    promoteMutation.mutate({
      userId,
      permissions: resolveSelectedPermissions(),
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (branchRef.current && !branchRef.current.contains(event.target)) {
        setMenuBranchOpen(false);
      }
      if (featureRef.current && !featureRef.current.contains(event.target)) {
        setMenuFeatureOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const perms = new Set(
      Array.isArray(employee?.permissions) ? employee.permissions : [],
    );
    const selected = allFeatures
      .filter((feature) => feature.permissions.every((perm) => perms.has(perm)))
      .map((feature) => feature.value);
    setSelectedFeatures(selected);
  }, [open, employee, allFeatures]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="font-custom w-[460px]">
        {type === "promote" ? (
          <>
            <div className="flex flex-col items-center space-y-2 pt-4 relative">
              <div className="relative w-20 h-20">
                <ProfileCell
                  profileImg={profileImg}
                  employeeName={displayName}
                />
                <UserPlus className="absolute -bottom-0 -right-0 w-6 h-6 bg-white rounded-full p-1 text-blue-600 border shadow-sm" />
              </div>

              <p className="text-center text-md font-custom">
                Promote{" "}
                <span className="text-blue-600 font-semibold">
                  {displayName}
                </span>{" "}
                to admin?
              </p>
            </div>

            <Separator className="my-4" />

            {/* Assign Branch */}
            {/* <div className="flex justify-between items-center mb-4 relative" ref={branchRef}>
              <p className="text-sm font-medium">Assign Branch:</p>
              <div className="w-40">
                <button
                  onClick={() => setMenuBranchOpen(!menuBranchOpen)}
                  className="w-full flex justify-between items-center border rounded px-3 py-2 text-sm bg-white hover:bg-gray-100"
                >
                  <span className="truncate">
                    {selectedBranches.length > 0
                      ? `${selectedBranches.length} selected`
                      : "Select branches"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                {menuBranchOpen && (
                  <div className="absolute right-0 mt-1 w-46 bg-white border rounded shadow-md z-10">
                    {allBranches.map((branch) => (
                      <label
                        key={branch}
                        className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedBranches.includes(branch)}
                          onChange={() =>
                            toggleSelection(branch, setSelectedBranches, selectedBranches)
                          }
                          className="mr-2"
                        />
                        {branch}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div> */}

            {/* Assign Feature */}
            <div
              className="flex justify-between items-center relative"
              ref={featureRef}
            >
              <p className="text-sm font-medium">Assign Features:</p>
              <div className="w-40">
                <button
                  onClick={() => setMenuFeatureOpen(!menuFeatureOpen)}
                  className="w-full flex justify-between items-center border rounded px-3 py-2 text-sm bg-white hover:bg-gray-100"
                >
                  <span className="truncate">
                    {selectedFeatures.length > 0
                      ? `${selectedFeatures.length} selected`
                      : "Select features"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                {menuFeatureOpen && (
                  <div className="absolute right-0 mt-1 w-46 bg-white border rounded shadow-md z-10">
                    <label className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer border-b">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={toggleSelectAll}
                        className="mr-2"
                      />
                      Select All
                    </label>
                    {allFeatures.map((feature) => (
                      <label
                        key={feature.value}
                        className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFeatures.includes(feature.value)}
                          onChange={() =>
                            toggleSelection(
                              feature.value,
                              setSelectedFeatures,
                              selectedFeatures,
                            )
                          }
                          className="mr-2"
                        />
                        {feature.label}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Separator className="mt-6" />

            <div className="flex justify-end pt-2">
              <Button
                onClick={handleConfirm}
                className="font-custom px-6"
                disabled={
                  promoteMutation.isLoading ||
                  demoteMutation.isLoading ||
                  updatePermissionsMutation.isLoading
                }
              >
                Promote
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center space-y-4 pt-6 pb-2">
              <UserMinus className="w-12 h-12 text-orange-500" />
              <p className="text-2xl font-custom text-center">
                Do you want to demote
                <br />
                <span className="text-blue-600 font-semibold">
                  {displayName}
                </span>
                ?
              </p>
            </div>
            <div className="flex justify-end pt-2">
              <Button
                onClick={handleConfirm}
                className="font-custom px-6"
                disabled={demoteMutation.isLoading}
              >
                Demote
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
