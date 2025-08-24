"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function UpdateBankTransferDialog({
  open,
  onOpenChange,
  oldCash,
}) {
  const [salary, setSalary] = useState("");
  const [relationship, setRelationship] = useState("Single");
  const [childCount, setChildCount] = useState(0);
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    setSalary(oldCash?.toString() || "");
  }, [oldCash]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        onPointerDownOutside={() => onOpenChange(false)} // ✅ close on outside click
        onEscapeKeyDown={() => onOpenChange(false)} // ✅ close on ESC
      >
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
              <label className="font-custom text-[#3F4648] mb-2 block">
                Salary
              </label>
              <input
                type="text"
                value={salary}
                disabled // ✅ read-only
                className="font-custom border border-gray-300 rounded-lg p-3 w-full text-gray-800 bg-gray-100"
              />
            </div>

            {/* Relationship */}
            <div className="mb-6">
              <label className="font-custom text-[#3F4648] mb-2 block">
                Relationship
              </label>
              <div className="flex gap-6">
                {["Single", "Married"].map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center gap-2 font-custom text-md text-gray-700"
                  >
                    <input
                      type="radio"
                      name="relationship"
                      value={opt}
                      checked={relationship === opt}
                      disabled // ✅ read-only
                      className="accent-blue-500 w-4 h-4"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>

            {/* Child Counter */}
            <div className="mb-2">
              <label className="font-custom text-[#3F4648] mb-2 block">
                Child
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  readOnly
                  value={childCount}
                  className="w-12 text-center font-custom border border-gray-300 rounded-md text-gray-800 bg-gray-100"
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
              <label className="font-custom text-[#3F4648] mb-2 block">
                Type
              </label>
              <select
                value={type}
                disabled // ✅ read-only
                className="w-full font-custom text-md border rounded-lg px-3 py-2 bg-gray-100"
              >
                <option value="">Select type</option>
                <option value="one">One Children</option>
                <option value="two">Two Children</option>
              </select>
            </div>

            {/* Amount Input */}
            <div className="mb-2">
              <label className="font-custom text-[#3F4648] mb-2 block">
                Amount
              </label>
              <input
                type="text"
                value={amount}
                disabled // ✅ read-only
                className="font-custom border border-gray-300 rounded-lg p-3 w-full text-gray-800 bg-gray-100"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
