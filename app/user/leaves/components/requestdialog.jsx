"use client";

import React, { useState } from "react";
import {
    Drawer,
    DrawerTrigger,
    DrawerContent,
    DrawerFooter,
    DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Smile } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

const overtimeTypes = ["Weekend", "Night", "Holiday", "Special"];

export default function RequestDialog() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);

    const [overtimeType, setOvertimeType] = useState(overtimeTypes[0]);
    const [allDay, setAllDay] = useState(true);

    // All-day ON range
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    // All-day OFF single date + times
    const [oneDayDate, setOneDayDate] = useState(new Date());
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("18:00");

    const [note, setNote] = useState("");

    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [showOneDayPicker, setShowOneDayPicker] = useState(false);

    const handleSubmit = () => {
        // 1) close the drawer
        setDrawerOpen(false);
        // 2) after the close animation, open success dialog
        setTimeout(() => setSuccessOpen(true), 220); // ~200ms is usually smooth
    };

    return (
        <>
            <Drawer direction="right" open={drawerOpen} onOpenChange={setDrawerOpen}>
                <DrawerTrigger asChild>
                    <Button
                        variant="outline"
                        className="text-blue font-custom w-42 h-10 shadow-md border border-gray-400 bg-transparent rounded-full flex items-center hover:bg-blue-500 hover:text-white transition-colors duration-200"
                        onClick={() => setDrawerOpen(true)}
                    >
                        Request Leaves
                    </Button>
                </DrawerTrigger>

                {/* Full-screen, flush-right drawer with forced full height */}
                <DrawerContent className="fixed inset-y-0 right-0 left-auto z-50 w-[400px] md:w-[460px] bg-transparent p-0 border-none outline-none h-screen max-h-screen min-h-screen">
                    {/* Drawer panel with explicit height constraints */}
                    <div className="h-full min-h-screen max-h-screen w-full bg-gray-100 font-custom flex flex-col border-l border-gray-200">
                        {/* Header */}
                        <div className="flex items-center gap-1 px-5 py-4 flex-shrink-0">
                            <DrawerClose asChild>
                                <button
                                    type="button"
                                    aria-label="Close"
                                    className="p-1 rounded-full hover:bg-gray-200"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                            </DrawerClose>
                            <h2 className="text-xl leading-none">New Leave</h2>
                        </div>

                        {/* Scrollable content area - explicitly flex-1 */}
                        <div className="flex-1 min-h-0 overflow-y-auto space-y-4 px-5 pb-2">
                            {/* Overtime type */}
                            <section className="bg-white rounded-md p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Leaves type</span>
                                    <Select value={overtimeType} onValueChange={setOvertimeType}>
                                        <SelectTrigger className="h-9 w-44 rounded-full text-sm">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {overtimeTypes.map((t) => (
                                                <SelectItem key={t} value={t} className="text-sm">
                                                    {t}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </section>

                            {/* All day + date/time */}
                            <section className="bg-white rounded-md p-4">
                                {/* All day row */}
                                <div className="flex items-center justify-between pb-3">
                                    <span className="text-sm font-medium">All day</span>
                                    {/* Make switch green when ON */}
                                    <Switch
                                        checked={allDay}
                                        onCheckedChange={setAllDay}
                                        className="data-[state=checked]:bg-green-500"
                                    />
                                </div>

                                <div className="h-px bg-gray-200 mb-3" />

                                {/* All day ON -> Starts/Ends date pickers */}
                                {allDay ? (
                                    <>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="relative">
                                                <div className="text-xs text-gray-600 mb-1">Starts</div>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setShowStartPicker(true)}
                                                    className="w-full justify-center rounded-full h-9 text-sm"
                                                >
                                                    {format(startDate, "dd/MM/yyyy")}
                                                </Button>
                                                {showStartPicker && (
                                                    <div className="absolute z-50 mt-2">
                                                        <Calendar
                                                            mode="single"
                                                            selected={startDate}
                                                            onSelect={(d) => {
                                                                if (d) setStartDate(d);
                                                                setShowStartPicker(false);
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="relative">
                                                <div className="text-xs text-gray-600 mb-1">Ends</div>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setShowEndPicker(true)}
                                                    className="w-full justify-center rounded-full h-9 text-sm"
                                                >
                                                    {format(endDate, "dd/MM/yyyy")}
                                                </Button>
                                                {showEndPicker && (
                                                    <div className="absolute z-50 mt-2">
                                                        <Calendar
                                                            mode="single"
                                                            selected={endDate}
                                                            onSelect={(d) => {
                                                                if (d) setEndDate(d);
                                                                setShowEndPicker(false);
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Total time row (placeholder) */}
                                        <div className="mt-4 flex items-center justify-between">
                                            <span className="text-sm text-gray-700">Total time leaves</span>
                                            <span className="text-sm">
                                                <span className="font-semibold">24:00</span>{" "}
                                                <span className="text-gray-600">work hours</span>
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    /* All day OFF -> single date + time range */
                                    <>
                                        <div className="mb-3">
                                            <div className="text-sm font-medium mb-1">Date and time leaves</div>
                                            <div className="relative">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setShowOneDayPicker(true)}
                                                    className="w-full justify-center rounded-full h-9 text-sm"
                                                >
                                                    {format(oneDayDate, "dd/MM/yyyy")}
                                                </Button>
                                                {showOneDayPicker && (
                                                    <div className="absolute z-50 mt-2">
                                                        <Calendar
                                                            mode="single"
                                                            selected={oneDayDate}
                                                            onSelect={(d) => {
                                                                if (d) setOneDayDate(d);
                                                                setShowOneDayPicker(false);
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <div className="text-xs text-gray-600 mb-1">Starts</div>
                                                <Input
                                                    type="time"
                                                    step="900"
                                                    value={startTime}
                                                    onChange={(e) => setStartTime(e.target.value)}
                                                    className="h-9 rounded-full text-sm"
                                                />
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-600 mb-1">Ends</div>
                                                <Input
                                                    type="time"
                                                    step="900"
                                                    value={endTime}
                                                    onChange={(e) => setEndTime(e.target.value)}
                                                    className="h-9 rounded-full text-sm"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </section>

                            {/* Note */}
                            <section className="bg-white rounded-md p-4">
                                <div className="rounded-md border border-gray-200 p-0.5">
                                    <textarea
                                        id="note"
                                        rows={4}
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Hi boss, today is my graduation day. I would like to ask for a permission."
                                        className="w-full resize-none rounded-[10px] bg-white p-3 text-sm outline-none"
                                    />
                                </div>
                            </section>
                        </div>

                        {/* Helper text */}
                        <div className="text-xs text-gray-600 text-center mt-1 mb-2 px-5 flex-shrink-0">
                            Your request will be sent for manager's approval
                        </div>

                        {/* Footer */}
                        <DrawerFooter className="pt-0 px-5 pb-4 flex-shrink-0">
                            <Button
                                className="w-full h-11 rounded-full text-base font-semibold"
                                onClick={handleSubmit}
                            >
                                Send for approval
                            </Button>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>

            {/* Success dialog */}
            <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
                <DialogContent
                    className="
      w-[500px] h-[350px]
      text-center flex flex-col justify-center gap-4
      [&>[data-radix-dialog-close]]:hidden
    "
                >
                    <DialogTitle className="text-4xl font-custom text-black mb-4 text-center w-full">
                        Successfully Sent
                    </DialogTitle>
                    <Smile className="w-16 h-16 mx-auto text-green-500 mb-4" />
                    <div className="text-lg text-gray-700">Please wait for the approvals.</div>
                </DialogContent>
            </Dialog>
        </>
    );
}
