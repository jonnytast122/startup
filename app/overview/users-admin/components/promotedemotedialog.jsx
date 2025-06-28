"use client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { UserMinus, UserPlus } from "lucide-react";

export default function PromoteDemoteDialog({
    open,
    setOpen,
    type,
    user,
    onConfirm,
}) {
    const [branch, setBranch] = useState("");
    const [feature, setFeature] = useState("");
    const [imageError, setImageError] = useState(false);

    const handleConfirm = () => {
        const newRole = type === "promote" ? "admin" : "user";
        onConfirm(newRole, branch, feature);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="font-custom w-[460px]">
                {type === "promote" ? (
                    <>
                        <div className="flex flex-col items-center justify-center space-y-2 pt-4 relative">
                            <div className="relative w-20 h-20">
                                <div className="w-full h-full rounded-full bg-gray-300 flex justify-center items-center overflow-hidden">
                                    {user.profile && !imageError ? (
                                        <img
                                            src={user.profile}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                            onError={() => setImageError(true)}
                                        />
                                    ) : (
                                        <span className="text-lg text-gray-700 font-medium">
                                            {user.firstname?.charAt(0).toUpperCase()}
                                            {user.lastname?.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <UserPlus
                                    className="absolute -bottom-0 -right-0 w-6 h-6 bg-white rounded-full p-1 text-blue-600 border shadow-sm"
                                    title="Promote"
                                />
                            </div>

                            <p className="text-center text-md font-custom">
                                Promote{" "}
                                <span className="text-blue-600 font-semibold">
                                    {user.firstname} {user.lastname}
                                </span>{" "}
                                to admin?
                            </p>
                        </div>

                        <Separator className="my-4" />

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <p className="text-sm font-medium">Assign Branch:</p>
                                <Select value={branch} onValueChange={setBranch}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Select branch" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="BKK1">BKK1</SelectItem>
                                        <SelectItem value="BKK2">BKK2</SelectItem>
                                        <SelectItem value="BKK3">BKK3</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex justify-between items-center">
                                <p className="text-sm font-medium">Assign Feature:</p>
                                <Select value={feature} onValueChange={setFeature}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Select feature" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Dashboard">Dashboard</SelectItem>
                                        <SelectItem value="User Management">User Management</SelectItem>
                                        <SelectItem value="Reports">Reports</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <Separator className="mt-6" />

                        <div className="flex justify-end pt-2">
                            <Button onClick={handleConfirm} className="font-custom px-6">
                                Promote
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex flex-col items-center justify-center space-y-4 pt-6 pb-2">
                            <UserMinus className="w-12 h-12 text-orange-500" />
                            <p className="text-2xl font-custom text-center">
                                Do you want to demote?
                            </p>
                        </div>
                        <div className="flex justify-center pb-4">
                            <Button onClick={handleConfirm} className="font-custom px-14">
                                Demote
                            </Button>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
