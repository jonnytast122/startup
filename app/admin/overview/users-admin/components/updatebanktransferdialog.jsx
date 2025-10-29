"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CirclePlus, CircleMinus } from "lucide-react";

export default function UpdateBankTransferDialog({
  open,
  onOpenChange,
  ibanking,
  spouse,
  numberOfChildren,
  onSubmit,
}) {
  // ✅ use local state with different variable names to avoid shadowing
  const [localSpouse, setLocalSpouse] = useState(spouse);
  const [localChildren, setLocalChildren] = useState(numberOfChildren);
  const [localIbanking, setLocalIbanking] = useState(ibanking);

  // ✅ Sync props to local state when dialog opens
  useEffect(() => {
    if (open) {
      setLocalSpouse(spouse);
      setLocalChildren(numberOfChildren);
      setLocalIbanking(ibanking);
    }
  }, [open, spouse, numberOfChildren, ibanking]);

  const increase = () => setLocalChildren((prev) => prev + 1);
  const decrease = () => setLocalChildren((prev) => Math.max(0, prev - 1));

  const handleSave = () => {
    onSubmit?.({
      ibanking: Number(localIbanking),
      spouse: localSpouse,
      children: localChildren,
    });
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
          <div className="w-full h-[1px] bg-[#A6A6A6]" />
        </DialogHeader>

        <div className="px-6 max-w-xl mx-auto">
          <h2 className="text-xl font-semibold font-custom mb-3 text-gray-800">
            Tax
          </h2>

          {/* IBanking */}
          <div className="mb-6">
            <label className="font-custom text-[#3F4648] mb-2 block">
              IBanking
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={localIbanking}
              onChange={(e) => setLocalIbanking(e.target.value)}
              placeholder={`$${ibanking}`}
              className="font-custom border border-gray-300 rounded-lg p-2 w-full md:w-2/3 lg:w-1/2 xl:w-2/4"
            />
          </div>

          {/* Spoused */}
          <div className="mb-6">
            <label className="font-custom text-[#3F4648] mb-2 block">
              Spoused
            </label>
            <div className="flex gap-6">
              {[
                { label: "Yes", value: true },
                { label: "No", value: false },
              ].map((opt) => (
                <label
                  key={opt.label}
                  className="flex items-center gap-2 font-custom text-md text-gray-700"
                >
                  <input
                    type="radio"
                    name="spouse"
                    value={String(opt.value)}
                    checked={localSpouse === opt.value}
                    onChange={() => setLocalSpouse(opt.value)}
                    className="accent-blue-500 w-4 h-4"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* Children Counter */}
          <div className="mb-2">
            <label className="font-custom text-[#3F4648] mb-2 block">
              Children
            </label>
            <div className="flex items-center gap-4">
              <CircleMinus
                className="w-5 h-5 text-blue-400 cursor-pointer hover:text-blue-600 transition"
                onClick={decrease}
              />
              <input
                type="text"
                readOnly
                value={localChildren}
                className="w-12 text-center font-custom border border-gray-300 rounded-md text-gray-800"
              />
              <CirclePlus
                className="w-5 h-5 text-blue-400 cursor-pointer hover:text-blue-600 transition"
                onClick={increase}
              />
            </div>
          </div>

          <div className="w-full h-[1px] bg-[#A6A6A6] mt-4"></div>

          {/* Save Button */}
          <div className="w-full flex justify-end px-4 md:px-6 lg:px-32 mt-4">
            <Button
              onClick={handleSave}
              className="py-4 px-6 text-lg font-custom rounded-full"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
