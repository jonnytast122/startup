"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ChevronDown } from "lucide-react";

export default function AddPayrollDialog({ open, setOpen, onAdd }) {
  const [tableName, setTableName] = useState("");
  const [filters, setFilters] = useState({
    Group: [],
    Branch: [],
    Department: [],
    Workshift: [],
  });

  const filterOptions = {
    Group: ["group1", "group2"],
    Branch: ["branch1", "branch2"],
    Department: ["department1", "department2"],
    Workshift: ["workshift1", "workshift2"],
  };

  const toggleMultiSelect = (type, value) => {
    setFilters((prev) => {
      const current = prev[type] || [];
      return {
        ...prev,
        [type]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

  const handleDone = () => {
    if (!tableName.trim()) return;
    onAdd({ name: tableName, filters });
    setTableName("");
    setFilters({
      Group: [],
      Branch: [],
      Department: [],
      Workshift: [],
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[16rem] rounded-xl px-4">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl text-gray-600 font-semibold">
            Payroll Table
          </DialogTitle>
        </DialogHeader>

        <Separator className="my-2" />

        <div className="mt-4 space-y-6">
          {/* Table name */}
          <div className="flex items-center gap-4">
            <label className="w-28 text-sm font-medium text-gray-700">
              Table name:
            </label>
            <Input
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              placeholder="Table name"
              className="flex-1 text-sm py-1.5 px-2"
            />
          </div>

          {/* Filter by */}
          <div>
            <div className="flex items-start gap-4">
              <label className="w-28 pt-2 text-sm font-medium text-gray-700">
                Filter by:
              </label>
              <div className="flex-1 flex flex-wrap gap-3">
                {Object.entries(filterOptions).map(([type, values]) => (
                  <Popover key={type}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="rounded-md w-fit truncate justify-between"
                      >
                        {filters[type].length > 0
                          ? filters[type].join(", ")
                          : type}
                        <ChevronDown className="ml-1 h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-44 bg-white">
                      <div className="flex flex-col gap-2">
                        {values.map((val) => (
                          <label
                            key={val}
                            className="flex items-center space-x-2 text-sm"
                          >
                            <Checkbox
                              checked={filters[type]?.includes(val)}
                              onCheckedChange={() =>
                                toggleMultiSelect(type, val)
                              }
                            />
                            <span>{val}</span>
                          </label>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                ))}
              </div>
            </div>
            <Separator className="mt-5" />
          </div>

          {/* Done button */}
          <div className="flex justify-end pt-2">
            <Button
              className="rounded-full px-6 py-2 bg-blue-500 text-white hover:bg-blue-600"
              onClick={handleDone}
            >
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
