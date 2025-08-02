import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ListFilter, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import React, { useState, useRef, useEffect } from "react";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

const topEmployees = [
    {
        name: "Lucy Trevo",
        avatar: "/avatars/ralph.png",
        leave: 6,
        ot: 2
    },
    {
        name: "John Mark",
        avatar: "/avatars/john.png",
        leave: 5,
        ot: 4
    },
    {
        name: "Sarah Chan",
        avatar: "/avatars/sarah.png",
        leave: 4,
        ot: 6
    },
    {
        name: "David Long",
        avatar: "/avatars/david.png",
        leave: 3,
        ot: 3
    }
];

export default function LeaveOt() {
    const Filter = [
        { value: "Select all", label: "Select all" },
        { value: "All users group", label: "All users group" },
        { value: "Assigned features", label: "Assigned features" },
    ];
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedRange, setSelectedRange] = useState({
        startDate: new Date(2025, 6, 11),
        endDate: new Date(2025, 6, 11),
        key: "selection",
    });

    const datePickerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                datePickerRef.current &&
                !datePickerRef.current.contains(event.target)
            ) {
                setShowDatePicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="bg-white rounded-lg p-5 h-full font-custom">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl text-black">Leave and OT</h2>
                <div className="relative flex gap-2">
                    <button
                        onClick={() => setShowDatePicker(!showDatePicker)}
                        className="px-4 py-2 border rounded-full text-sm bg-white border-gray-400 shadow-sm font-custom"
                    >
                        <ChevronLeft className="inline-block w-4 h-4 mb-1 mr-3" />
                        {format(selectedRange.startDate, "MMM dd")} - {format(selectedRange.endDate, "MMM dd")}
                        <ChevronRight className="inline-block w-4 h-4 mb-1 ml-3" />
                    </button>

                    {showDatePicker && (
                        <div
                            ref={datePickerRef}
                            className="absolute top-full mt-2 bg-white shadow-lg border p-2 rounded-md z-50 left-5 translate-x-[-150px]"
                        >
                            <DateRange
                                ranges={[selectedRange]}
                                onChange={(ranges) => {
                                    const newRange = ranges.selection;
                                    setSelectedRange(newRange);

                                    const start = newRange.startDate;
                                    const end = newRange.endDate;
                                    if (start && end && start.getTime() !== end.getTime()) {
                                        setShowDatePicker(false);
                                    }
                                }}
                                rangeColors={["#3b82f6"]}
                            />
                        </div>
                    )}


                    <Select>
                        <SelectTrigger className="w-25 font-custom rounded-full flex items-center gap-2 relative text-[#5494DA]">
                            <ListFilter size={20} />
                            <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent className="font-custom">
                            {Filter.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

            </div>

            <Separator className="mb-4" />

            {/* Horizontal Container */}
            {/* Responsive Grid Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 m-5">
                {/* Box 1 - Most Used */}
                <div className="flex flex-col">
                    <div className="bg-gray-200 px-4 py-2 text-center text-lg text-gray-700 rounded-t-md mb-2">
                        Most Used
                    </div>
                    <div className="border border-gray-300 rounded-md p-4 flex gap-4 h-full">
                        <div className="flex-1 bg-red-200 rounded-lg py-3 px-6 text-center flex flex-col justify-between">
                            <div>
                                <h3 className="text-lg text-red-500 mb-1">Total Leave</h3>
                                <p className="text-4xl">12</p>
                                <p className="text-xl text-gray-700">days taken</p>
                            </div>
                            <img src="/images/LeaveLine.png" alt="Leave Line" className="w-28 h-auto mx-auto" />
                        </div>
                        <div className="flex-1 bg-blue-200 rounded-lg py-3 px-6 text-center flex flex-col justify-between">
                            <div>
                                <h3 className="text-lg text-blue-500 mb-1">Total OT</h3>
                                <p className="text-4xl">18</p>
                                <p className="text-xl text-gray-700">hours earned</p>
                            </div>
                            <img src="/images/OTLine.png" alt="OT Line" className="w-28 h-auto mx-auto" />
                        </div>
                    </div>
                </div>

                {/* Box 2 - Top Leave */}
                <div className="flex flex-col">
                    <div className="bg-gray-200 px-4 py-2 text-center text-lg text-gray-700 rounded-t-md mb-2">
                        Top Leave
                    </div>
                    <div className="border border-gray-300 rounded-md p-4 flex-grow">
                        {topEmployees.map((emp, idx) => (
                            <div key={idx} className="mb-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img src={emp.avatar} className="w-9 h-9 rounded-full" alt="avatar" />
                                        <span className="text-base font-medium text-gray-800">{emp.name}</span>
                                    </div>
                                    <span className="text-base">{emp.leave} days</span>
                                </div>
                                <Separator className="my-2" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Box 3 - Top OT */}
                <div className="flex flex-col">
                    <div className="bg-gray-200 px-4 py-2 text-center text-lg text-gray-700 rounded-t-md mb-2">
                        Top OT
                    </div>
                    <div className="border border-gray-300 rounded-md p-4 flex-grow">
                        {topEmployees.map((emp, idx) => (
                            <div key={idx} className="mb-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img src={emp.avatar} className="w-9 h-9 rounded-full" alt="avatar" />
                                        <span className="text-base font-medium text-gray-800">{emp.name}</span>
                                    </div>
                                    <span className="text-base">{emp.ot} days</span>
                                </div>
                                <Separator className="my-2" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}
