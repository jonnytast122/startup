import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { fetchCompany } from "@/lib/api/company";
import { fetchCompanyDepartments, addDepartment } from "@/lib/api/department";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function AddDepartmentDialog() {
  const [open, setOpen] = useState(false);
  const [branchId, setBranchId] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [managerId, setManagerId] = useState("");

  const queryClient = useQueryClient();

  const { data: company } = useQuery({
    queryKey: ["company"],
    queryFn: fetchCompany,
  });

  const { data: departments = [] } = useQuery({
    queryKey: ["departments", company?.id],
    queryFn: () => fetchCompanyDepartments(company?.id),
    enabled: !!company?.id,
  });

  const { mutate: createDepartment, isPending } = useMutation({
    mutationFn: addDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments", company?.id] });
      setOpen(false);
      setBranchId("");
      setDepartmentName("");
      setManagerId("");
    },
  });

  const handleSubmit = () => {
    if (!branchId || !departmentName) return;
    createDepartment({
      name: departmentName,
      branch: branchId,
      manager: managerId || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="font-custom text-blue-500 hover:text-blue-700 text-sm transition duration-200"
          onClick={() => setOpen(true)}
        >
          + Add Department
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center text-center">
          <DialogTitle></DialogTitle>
          <h1 className="font-custom text-light-gray text-2xl sm:text-lg md:text-xl lg:text-3xl py-6">
            Department details
          </h1>
          <div className="w-full h-[1px] bg-[#A6A6A6]"></div>
        </DialogHeader>

        {/* Branch Selection */}
        <div className="flex flex-wrap md:flex-nowrap items-center mt-6 justify-center lg:justify-center">
          <label className="font-custom text-[#3F4648] w-full md:w-1/3 lg:w-1/6 text-left mb-2 md:mb-0">
            From Branch:
          </label>
          <Select onValueChange={setBranchId}>
            <SelectTrigger className="font-custom border border-gray-300 rounded-lg p-2 w-full md:w-2/3 lg:w-1/2 xl:w-2/4">
              <SelectValue placeholder="Select Branch" />
            </SelectTrigger>
            <SelectContent className="font-custom">
              {company?.branches?.length > 0 ? (
                company.branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))
              ) : (
                <div className="p-2 text-gray-500 text-sm">
                  No branches found
                </div>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Department Name */}
        <div className="flex flex-wrap md:flex-nowrap items-center mt-6 justify-center lg:justify-center">
          <label className="font-custom text-[#3F4648] w-full md:w-1/3 lg:w-1/6 text-left mb-2 md:mb-0">
            Department Name:
          </label>
          <Input
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
            placeholder="Department Name"
            className="font-custom border border-gray-300 rounded-lg p-2 w-full md:w-2/3 lg:w-1/2 xl:w-2/4"
          />
        </div>

        {/* Manager (Optional) */}
        <div className="flex flex-wrap md:flex-nowrap items-center mt-6 justify-center lg:justify-center">
          <label className="font-custom text-[#3F4648] w-full md:w-1/3 lg:w-1/6 text-left mb-2 md:mb-0">
            Manager (Optional):
          </label>
          <Select onValueChange={setManagerId}>
            <SelectTrigger className="font-custom border border-gray-300 rounded-lg p-2 w-full md:w-2/3 lg:w-1/2 xl:w-2/4">
              <SelectValue placeholder="Select Manager" />
            </SelectTrigger>
            <SelectContent className="font-custom">
              <SelectItem value="manager-id-1">Name 1</SelectItem>
              <SelectItem value="manager-id-2">Name 2</SelectItem>
              {/* TODO: Replace with dynamic user list */}
            </SelectContent>
          </Select>
        </div>

        {/* Divider & Save Button */}
        <div className="w-full h-[1px] bg-[#A6A6A6] mt-10"></div>
        <div className="w-full flex justify-end px-4 md:px-6 lg:px-32 mt-4">
          <Button
            className="py-4 px-6 text-md font-custom rounded-full"
            onClick={handleSubmit}
            disabled={!branchId || !departmentName || isPending}
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
