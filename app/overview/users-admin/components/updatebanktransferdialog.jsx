// components/UpdateCashDialog.tsx
"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CirclePlus, CircleMinus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UpdateBankTransferDialog({
  open,
  onOpenChange,
  oldCash,
}) {
  const [childCount, setChildCount] = useState(0);

  const increase = () => setChildCount((prev) => prev + 1);
  const decrease = () => setChildCount((prev) => Math.max(0, prev - 1));
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center text-center">
          <DialogTitle></DialogTitle>
          <h1 className="font-custom text-light-gray text-2xl sm:text-lg md:text-xl lg:text-3xl py-6">
            Update Bank Transfer
          </h1>
          <div className="w-full h-[1px] bg-[#A6A6A6]"></div>
        </DialogHeader>
        <div>
          {/* Form Content */}
          <div className="flex flex-wrap md:flex-nowrap items-center mt-6 justify-center lg:justify-center">
            <label className="font-custom text-[#3F4648] w-full md:w-1/3 lg:w-1/6 text-left mb-2 md:mb-0">
              Salary
            </label>
            <input
              id="title-name"
              type="text"
              placeholder={`$${oldCash}`}
              className="font-custom border border-gray-300 rounded-lg p-2 w-full md:w-2/3 lg:w-1/2 xl:w-2/4"
            />
          </div>

          <div className="flex flex-wrap md:flex-nowrap items-center mt-6 justify-center lg:justify-center">
            <label className="font-custom text-[#3F4648] w-full md:w-1/3 lg:w-1/6 text-left mb-2 md:mb-0">
              Relationship
            </label>
            <div className="w-full md:w-2/3 lg:w-1/2 xl:w-2/4 flex flex-wrap gap-4">
              <label className="flex items-center gap-2 font-custom text-md text-gray-700">
                <input
                  type="radio"
                  name="relationship"
                  value="Single"
                  className="accent-blue-500 w-4 h-4"
                />
                Single
              </label>
              <label className="flex items-center gap-2 font-custom text-md text-gray-700">
                <input
                  type="radio"
                  name="relationship"
                  value="Married"
                  className="accent-blue-500 w-4 h-4"
                />
                Married
              </label>
            </div>
          </div>

          <div className="flex flex-wrap md:flex-nowrap items-center mt-6 justify-center lg:justify-center">
            <label className="font-custom text-[#3F4648] w-full md:w-1/3 lg:w-1/6 text-left mb-2 md:mb-0">
              Child
            </label>
            <div className="w-full md:w-2/3 lg:w-1/2 xl:w-2/4 flex items-center gap-4">
              <CircleMinus
                className="w-6 h-6 text-blue-400 cursor-pointer hover:text-blue-600 transition"
                onClick={decrease}
              />
              <span className="text-md font-custom text-gray-700">
                {childCount}
              </span>
              <CirclePlus
                className="w-6 h-6 text-blue-400 cursor-pointer hover:text-blue-600 transition"
                onClick={increase}
              />
            </div>
          </div>

          <div className="flex flex-wrap md:flex-nowrap items-center mt-6 justify-center lg:justify-center">
            <label className="font-custom text-[#3F4648] w-full md:w-1/3 lg:w-1/6 text-left mb-2 md:mb-0">
              Type
            </label>
            <div className="w-full md:w-2/3 lg:w-1/2 xl:w-2/4">
              <Select>
                <SelectTrigger className="w-full font-custom text-md border placeholder:text-gray-400">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="font-custom text-md">
                  <SelectItem value="one">One Children</SelectItem>
                  <SelectItem value="two">Two Children</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap md:flex-nowrap items-center mt-6 justify-center lg:justify-center">
            <label className="font-custom text-[#3F4648] w-full md:w-1/3 lg:w-1/6 text-left mb-2 md:mb-0">
              Amount
            </label>
            <div className="w-full md:w-2/3 lg:w-1/2 xl:w-2/4">
              <input
                id="title-name"
                type="text"
                placeholder="Bank Transfer"
                className="font-custom border border-gray-300 rounded-lg p-2 w-full"
              />
            </div>
          </div>

          <div className="w-full h-[1px] bg-[#A6A6A6] mt-10"></div>
          <div className="w-full flex justify-end px-4 md:px-6 lg:px-32 mt-4">
            <Button className="py-4 px-6 text-lg font-custom rounded-full">
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
