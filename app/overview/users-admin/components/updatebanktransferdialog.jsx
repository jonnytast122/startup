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
  onSubmit,
}) {
  const [salary, setSalary] = useState(oldCash?.toString() || "");
  const [relationship, setRelationship] = useState("Single");
  const [childCount, setChildCount] = useState(0);
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");

  const increase = () => setChildCount((prev) => prev + 1);
  const decrease = () => setChildCount((prev) => Math.max(0, prev - 1));

  const handleSave = () => {
    const result = {
      salary: parseFloat(salary),
      relationship,
      childCount,
      type,
      amount: parseFloat(amount),
    };

    if (isNaN(result.salary) || isNaN(result.amount)) {
      alert("Please enter valid numeric values for Salary and Amount.");
      return;
    }

    onSubmit?.(result);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center text-center">
          <DialogTitle />
          <h1 className="font-custom text-light-gray text-2xl sm:text-lg md:text-xl lg:text-3xl py-6">
            Update Bank Transfer
          </h1>
          <div className="w-full h-[1px] bg-[#A6A6A6]"></div>
        </DialogHeader>

        <div>
          {/* Tax Section */}
          <div className="px-6 max-w-xl mx-auto">
            <h2 className="text-xl font-semibold font-custom mb-3 text-gray-800">
              Tax
            </h2>

            {/* Salary Input */}
            <div className="mb-6">
              <label className="font-custom text-[#3F4648] mb-2 block">Salary</label>
              <input
                type="text"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder={`$ ${oldCash}`}
                className="font-custom border border-gray-300 rounded-lg p-3 w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Relationship Radio */}
            <div className="mb-6">
              <label className="font-custom text-[#3F4648] mb-2 block">Relationship</label>
              <div className="flex gap-6">
                {["Single", "Married"].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 font-custom text-md text-gray-700">
                    <input
                      type="radio"
                      name="relationship"
                      value={opt}
                      checked={relationship === opt}
                      onChange={() => setRelationship(opt)}
                      className="accent-blue-500 w-4 h-4"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>

            {/* Child Counter */}
            <div className="mb-2">
              <label className="font-custom text-[#3F4648] mb-2 block">Child</label>
              <div className="flex items-center gap-4">
                <CircleMinus
                  className="w-5 h-5 text-blue-400 cursor-pointer hover:text-blue-600 transition"
                  onClick={decrease}
                />
                <input
                  type="text"
                  readOnly
                  value={childCount}
                  className="w-12 text-center font-custom border border-gray-300 rounded-md text-gray-800"
                />
                <CirclePlus
                  className="w-5 h-5 text-blue-400 cursor-pointer hover:text-blue-600 transition"
                  onClick={increase}
                />
              </div>
            </div>
          </div>

          {/* Payment Info Section */}
          <div className="px-6 py-4 max-w-xl mx-auto mt-6">
            <h2 className="text-xl font-semibold font-custom mb-3 text-gray-800">
              Nssf
            </h2>

            {/* Type Select */}
            <div className="mb-6">
              <label className="font-custom text-[#3F4648] mb-2 block">Type</label>
              <Select onValueChange={setType}>
                <SelectTrigger className="w-full font-custom text-md border rounded-lg px-3 py-2 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="font-custom text-md">
                  <SelectItem value="one">One Children</SelectItem>
                  <SelectItem value="two">Two Children</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Amount Input */}
            <div className="mb-2">
              <label className="font-custom text-[#3F4648] mb-2 block">Amount</label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Bank Transfer"
                className="font-custom border border-gray-300 rounded-lg p-3 w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="w-full h-[1px] bg-[#A6A6A6] mt-4"></div>
          <div className="w-full flex justify-end px-4 md:px-6 lg:px-32 mt-4">
            <Button onClick={handleSave} className="py-4 px-6 text-lg font-custom rounded-full">
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
