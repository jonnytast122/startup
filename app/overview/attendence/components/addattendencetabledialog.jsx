import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AddAttendanceTableDialog = ({ open, onOpenChange, onConfirm }) => {
  const [note, setNote] = useState(""); // ✅ added
  const [selectedFilters, setSelectedFilters] = useState({}); // ✅ to store dropdown selections

  const filterOptions = [
    {
      label: "Branch",
      options: ["Phnom Penh", "Siem Reap", "Battambang"],
    },
    {
      label: "Group",
      options: ["Morning", "Evening", "Weekend"],
    },
    {
      label: "Department",
      options: ["HR", "Sales", "Kitchen"],
    },
    {
      label: "Workshift",
      options: ["Shift A", "Shift B", "Shift C"],
    },
  ];

  const handleSelectChange = (label, value) => {
    setSelectedFilters((prev) => ({ ...prev, [label]: value }));
  };

  const handleDone = () => {
    const payload = {
      tableName: note,
      filters: Object.entries(selectedFilters).map(([label, value]) => ({
        label,
        value,
      })),
    };
    if (onConfirm) onConfirm(payload); // ✅ safeguard
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl font-custom">
        <DialogHeader className="flex flex-col items-center text-center">
          <DialogTitle />
          <h1 className="font-custom text-light-gray text-2xl lg:text-3xl py-6">
            Table
          </h1>
          <div className="w-full h-[1px] bg-[#A6A6A6]" />
        </DialogHeader>

        <div className="w-full flex flex-col items-center px-4 py-6">
          <div className="w-full md:w-4/5 lg:w-2/3 xl:w-1/2 space-y-6">
            {/* Table Name */}
            <div className="flex items-start gap-4">
              <label className="text-sm text-[#3F4648] w-1/3 pt-1">
                Table name:
              </label>
              <Input
                placeholder="Type here"
                className="resize-none w-2/3"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            {/* Filter By */}
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <label className="text-sm text-[#3F4648] w-full sm:w-1/3 pt-2">
                Filter by:
              </label>

              <div className="w-full sm:w-4/6 flex flex-col">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {filterOptions.map((filter, i) => (
                    <Select
                      key={i}
                      onValueChange={(value) =>
                        handleSelectChange(filter.label, value)
                      }
                    >
                      <SelectTrigger className="w-full rounded-xl border-gray-300 text-sm">
                        <SelectValue placeholder={filter.label} />
                      </SelectTrigger>
                      <SelectContent className="font-custom">
                        {filter.options.map((opt, j) => (
                          <SelectItem key={j} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-[1px] bg-[#A6A6A6] mt-10" />
        <div className="w-full flex justify-end px-4 md:px-6 lg:px-32 mt-4">
          <Button
            className="py-4 px-6 text-lg font-custom rounded-full"
            onClick={handleDone}
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddAttendanceTableDialog;
