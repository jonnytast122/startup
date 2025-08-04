import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CalendarX } from "lucide-react"; // Importing the CalendarX icon from Lucide React

const ClearWeekDialog = ({ open, onOpenChange }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-auto max-w-md p-6">
                <DialogHeader>
                    <div className="text-center">
                        <CalendarX className="text-red-500 mx-auto" width={60} height={60} /> {/* Bigger red calendar icon */}
                        <DialogTitle className="text-lg mt-4 text-black font-custom">Are you sure you want to clear all overtime shifts from this week?</DialogTitle>
                        <p className="mt-2 text-lg text-black font-custom">This action cannot be undone</p>
                    </div>
                </DialogHeader>

                <Separator className="mt-3 bg-red-500" /> {/* Red line separator */}

                <div className="space-y-4 text-center">
                    <p className="text-lg text-black font-custom">Total shifts to be cleared: <span className="font-semibold text-red-500">12</span></p>
                    <Button variant="destructive" className="w-auto h-12 text-sm rounded-full bg-red-500">
                        Clear Shifts
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ClearWeekDialog;
