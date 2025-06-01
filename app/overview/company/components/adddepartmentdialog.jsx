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

export default function AddDepartmentDialog() {
  const [open, setOpen] = useState(false);

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
            Title Details
          </h1>
          <div className="w-full h-[1px] bg-[#A6A6A6]"></div>
        </DialogHeader>
        <div>
          {/* Form Content */}
          <div className="flex flex-wrap md:flex-nowrap items-center mt-6 justify-center lg:justify-center">
            <label className="font-custom text-[#3F4648] w-full md:w-1/3 lg:w-1/6 text-left mb-2 md:mb-0">
              From Branch:
            </label>
            <Select>
              <SelectTrigger className="font-custom border border-gray-300 rounded-lg p-2 w-full md:w-2/3 lg:w-1/2 xl:w-2/4">
                <SelectValue placeholder="Branch Name" />
              </SelectTrigger>
              <SelectContent className="font-custom">
                <SelectItem value="leave-policy">Branch 1</SelectItem>
                <SelectItem value="working-hours">Branch 2</SelectItem>
                <SelectItem value="code-of-conduct">Branch 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap md:flex-nowrap items-center mt-6 justify-center lg:justify-center">
            <label className="font-custom text-[#3F4648] w-full md:w-1/3 lg:w-1/6 text-left mb-2 md:mb-0">
              Department Name:
            </label>
            <input
              id="description-name"
              type="text"
              placeholder="Department Name"
              className="font-custom border border-gray-300 rounded-lg p-2 w-full md:w-2/3 lg:w-1/2 xl:w-2/4"
            />
          </div>

          <div className="flex flex-wrap md:flex-nowrap items-center mt-6 justify-center lg:justify-center">
            <label className="font-custom text-[#3F4648] w-full md:w-1/3 lg:w-1/6 text-left mb-2 md:mb-0">
              Manager ( Optional ):
            </label>
            <Select>
              <SelectTrigger className="font-custom border border-gray-300 rounded-lg p-2 w-full md:w-2/3 lg:w-1/2 xl:w-2/4">
                <SelectValue placeholder="Branch Name" />
              </SelectTrigger>
              <SelectContent className="font-custom">
                <SelectItem value="leave-policy">Name 1</SelectItem>
                <SelectItem value="working-hours">Name 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full h-[1px] bg-[#A6A6A6] mt-10"></div>
          <div className="w-full flex justify-end px-4 md:px-6 lg:px-32 mt-4">
            <Button className="py-4 px-6 text-lg font-custom rounded-full">
              Next
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
