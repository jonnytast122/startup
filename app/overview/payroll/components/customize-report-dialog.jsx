"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export default function CustomizeReportDialog({ open, setOpen }) {
    const [options, setOptions] = useState({
        NSSF: false,
        Tax: false,
        IBanking: false,
    });

    const toggleOption = (key) => {
        setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-[500px] h-[350px] py-4 px-4 rounded-xl">
                <DialogHeader>
                    <DialogTitle className="text-center text-lg font-semibold">
                        Customize Report
                    </DialogTitle>
                </DialogHeader>
                <Separator className="w-full" />
                <div className="flex flex-col items-center text-center mb-7">
                    <p className="text-sm text-gray-500 mb-5">
                        Or Select Template Format below
                    </p>

                    <div className="w-full flex flex-col items-start gap-2 pl-12">
                        {Object.keys(options).map((key) => (
                            <label
                                key={key}
                                className="flex items-center gap-2 text-sm"
                            >
                                <Checkbox
                                    checked={options[key]}
                                    onCheckedChange={() => toggleOption(key)}
                                />
                                <span>{key}</span>
                            </label>
                        ))}
                    </div>

                    <Separator className="my-4 w-full" />

                    <Button
                        className="rounded-full px-5 py-1 bg-blue-500 text-white text-sm hover:bg-blue-600"
                        onClick={() => {
                            setOpen(false);
                        }}
                    >
                        Export Report
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
