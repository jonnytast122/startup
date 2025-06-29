"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";

const PolicyOvertime = ({ open, onClose, onSubmit }) => {
  const [policyName, setPolicyName] = useState("");
  const [overtimeLimit, setOvertimeLimit] = useState(1);
  const [monthStart, setMonthStart] = useState(1);
  const [multiplier, setMultiplier] = useState(1);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  function getOrdinal(n) {
    if (n === 1) return "st";
    if (n === 2) return "nd";
    if (n === 3) return "rd";
    return "th";
  }

  const handleConfirm = () => {
    if (!policyName.trim()) return;

    const newPolicy = {
      id: Date.now(),
      name: policyName,
      status: "Active",
      createdBy: "Admin",
      createdByProfilePic: "/path/to/profile-default.jpg",
    };

    onSubmit(newPolicy);
    onClose();
    setPolicyName(""); // reset after submit
  };
  const [selectedMonth, setSelectedMonth] = useState(months[0]);
  const [selectedDay, setSelectedDay] = useState(1);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl text-center text-gray-600">Overtime Details</DialogTitle>
          <div className="w-full h-[1px] bg-[#A6A6A6] my-4" />
        </DialogHeader>

        <div className="space-y-6 px-4">
          {/* Policy Name */}
          <div className="flex flex-wrap md:flex-nowrap items-center">
            <label className="w-full md:w-1/3 text-sm font-medium text-[#3F4648]">
              Policy name:
            </label>
            <input
              type="text"
              value={policyName}
              onChange={(e) => setPolicyName(e.target.value)}
              placeholder="Policy name"
              className="border border-gray-300 rounded-lg p-2 w-full md:w-2/3"
            />
          </div>

          {/* Overtime Limit */}
          <div className="flex flex-wrap md:flex-nowrap items-center">
            <label className="w-full md:w-1/3 text-sm font-medium text-[#3F4648]">
              Overtime limit:
            </label>
            <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-2/3">
              <p className="text-sm text-[#3F4648]">
                The amount of hour that will be used
              </p>
              <input
                type="number"
                value={overtimeLimit}
                onChange={(e) => setOvertimeLimit(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-20 text-sm"
              />
              <span className="text-sm text-[#3F4648]">hour per month</span>
            </div>
          </div>

          {/* Beginning of the month */}
          <div className="flex flex-wrap md:flex-nowrap items-center gap-4">
            <label className="w-full md:w-1/3 text-sm font-medium text-[#3F4648]">
              Beginning of the month:
            </label>

            {/* Month Dropdown */}
            <Listbox value={selectedMonth} onChange={setSelectedMonth}>
              <div className="relative w-40">
                <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white border border-gray-300 py-2 pl-3 pr-10 text-left text-sm">
                  <span className="block truncate">{selectedMonth}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white border border-gray-200 py-1 text-sm shadow-lg z-50">
                    {months.map((month) => (
                      <Listbox.Option
                        key={month}
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                          }`
                        }
                        value={month}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${selected ? "font-medium" : "font-normal"
                                }`}
                            >
                              {month}
                            </span>
                            {selected && (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                <Check className="h-4 w-4" aria-hidden="true" />
                              </span>
                            )}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>

            {/* Day Dropdown */}
            <Listbox value={selectedDay} onChange={setSelectedDay}>
              <div className="relative w-32">
                <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white border border-gray-300 py-2 pl-3 pr-10 text-left text-sm">
                  <span className="block truncate">
                    {selectedDay}
                    {getOrdinal(selectedDay)}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white border border-gray-200 py-1 text-sm shadow-lg z-50">
                    {days.map((day) => (
                      <Listbox.Option
                        key={day}
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                          }`
                        }
                        value={day}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${selected ? "font-medium" : "font-normal"
                                }`}
                            >
                              {day}
                              {getOrdinal(day)}
                            </span>
                            {selected && (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                <Check className="h-4 w-4" aria-hidden="true" />
                              </span>
                            )}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>

          {/* Multiplier */}
          <div className="flex flex-wrap md:flex-nowrap items-center">
            <label className="w-full md:w-1/3 text-sm font-medium text-[#3F4648]">
              Multiplier:
            </label>
            <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-2/3">
              <p className="text-sm text-[#3F4648]">
                The amount of multiplier that will be used
              </p>
              <input
                type="number"
                value={multiplier}
                onChange={(e) => setMultiplier(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-20 text-sm"
              />
              <span className="text-sm text-[#3F4648]">time of overtime rate</span>
            </div>
          </div>

          {/* Footer */}
          <div className="w-full h-[1px] bg-[#A6A6A6] mt-6" />
          <div className="w-full flex justify-end mt-4">
            <Button
              className="py-4 px-6 text-lg font-semibold rounded-full"
              onClick={handleConfirm}
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PolicyOvertime;
