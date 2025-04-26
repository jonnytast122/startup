import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const AddTimeOffDialog = ({ open, onOpenChange }) => {
    const [allDay, setAllDay] = useState(false);
    const [timeOffData, setTimeOffData] = useState({
        user: "Doe Ibrahim",
        type: "Time off",
        date: new Date(),
        start: "08:00",
        end: "18:00",
        note: "",
    });
    const [note, setNote] = useState("");

    const switchStyles = {
        backgroundColor: allDay ? 'green' : 'grey', // Green when on, grey when off
    };

    const handleChange = (field, value) => {
        setTimeOffData({ ...timeOffData, [field]: value });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-auto max-w-sm p-4 sm:p-6">
                <DialogHeader>
                    <DialogTitle className="text-center text-lg sm:text-xl">Add time off</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm">Select users:</label>
                        <Select value={timeOffData.user} onValueChange={(val) => handleChange("user", val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select user" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Doe Ibrahim">Doe Ibrahim</SelectItem>
                                <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm">Time off type:</label>
                        <Select value={timeOffData.type} onValueChange={(val) => handleChange("type", val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Time off">Time off</SelectItem>
                                <SelectItem value="Sick leave">Sick leave</SelectItem>
                                <SelectItem value="Vacation">Vacation</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="text-sm">All day time off:</label>
                        <Switch
                            checked={allDay}
                            onCheckedChange={setAllDay}
                            style={switchStyles}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm">Date and time of time off:</label>
                        <div className="flex flex-wrap items-center gap-2">
                            <Input
                                type="date"
                                value={timeOffData.date.toISOString().substring(0, 10)}
                                onChange={(e) => handleChange("date", new Date(e.target.value))}
                                className="w-40"
                            />
                            <div className="flex gap-2">
                                <div className="flex items-center space-x-1">
                                    <span className="text-sm">Start:</span>
                                    <Input
                                        type="time"
                                        value={timeOffData.start}
                                        onChange={(e) => handleChange("start", e.target.value)}
                                        className="w-28"
                                        disabled={allDay} // Disable when "All day" is selected
                                    />
                                </div>
                                <div className="flex items-center space-x-1">
                                    <span className="text-sm">End:</span>
                                    <Input
                                        type="time"
                                        value={timeOffData.end}
                                        onChange={(e) => handleChange("end", e.target.value)}
                                        className="w-28"
                                        disabled={allDay} // Disable when "All day" is selected
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm mb-1 block">Note</label>
                        <Textarea
                            placeholder="Write notes here..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={5}
                        />
                    </div>

                    <div className="flex justify-end gap-4 border-t pt-2">
                        <Button
                            variant="outline"
                            className="h-9 w-32 rounded-3xl border-blue-500 text-blue-500 hover:bg-blue-50 font-custom"
                            onClick={() => onOpenChange(false)}
                        >
                            Save Draft
                        </Button>
                        <Button
                            className="h-9 w-32 rounded-3xl hover:bg-blue-700 text-white font-custom"
                        >
                            Publish
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddTimeOffDialog;
