import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight, ListFilter } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

const leaveData = [
    { policy: "Annual Leave", taken: 101 },
    { policy: "Sick Leave", taken: 101 },
    { policy: "Unpaid Leave", taken: 101 },
];

export default function LeavePolicy() {
    const Filter = [
        { value: "Select all", label: "Select all" },
        { value: "All users group", label: "All users group" },
        { value: "Assigned features", label: "Assigned features" },
    ];
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedRange, setSelectedRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
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
            {/* Header with title and controls */}
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl text-black">Leave Policy</h2>
                <div className="relative flex gap-2">
                    <button
                        onClick={() => setShowDatePicker(!showDatePicker)}
                        className="px-4 py-2 border rounded-full text-sm bg-white border-gray-400 shadow-sm font-custom"
                    >
                        <ChevronLeft className="inline-block w-4 h-4 mb-1 mr-3" />
                        {format(selectedRange.startDate, "MMM dd")} -{" "}
                        {format(selectedRange.endDate, "MMM dd")}
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
                                    if (
                                        newRange.startDate &&
                                        newRange.endDate &&
                                        newRange.startDate.getTime() !== newRange.endDate.getTime()
                                    ) {
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

            {/* Separator under title */}
            <Separator className="mb-4" />

            {/* Bordered table container */}
            <div className="border border-gray-400 rounded-md overflow-hidden p-4 pb-10">
                <Table>
                    <TableHeader className="bg-gray-100">
                        <TableRow>
                            <TableHead className="text-gray-600 text-sm">Leave Policy</TableHead>
                            <TableHead className="text-right text-gray-600 text-sm">Taken Rate</TableHead>
                        </TableRow>
                    </TableHeader>
                    <Separator />
                    <TableBody>
                        {leaveData.map((item, idx) => (
                            <TableRow key={idx}>
                                <TableCell className="text-sm">{item.policy}</TableCell>
                                <TableCell className="text-right text-sm text-gray-800">
                                    {item.taken} days
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
