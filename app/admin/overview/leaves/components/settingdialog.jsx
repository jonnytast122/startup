import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Settings, Ellipsis } from "lucide-react";
import EditPolicydialog from "./editpolicydialog";
import EditPolicyAssignmentDialog from "./editpolicyassignmentdialog";

function useLocalToast() {
  const [toast, setToast] = useState(null);

  const show = (type, message) => {
    setToast({ type, message });
    window.clearTimeout(useLocalToast._tid);
    useLocalToast._tid = window.setTimeout(() => setToast(null), 3000);
  };

  const showSuccess = (message) => show("success", message);
  const showError = (message) => show("error", message);

  const ToastPortal = toast
    ? createPortal(
        <div className="fixed bottom-6 right-6 z-[1000]">
          <div
            className={`min-w-[280px] max-w-[380px] rounded-lg shadow-lg px-4 py-3 text-white flex items-start gap-3 ${
              toast.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            <div className="mt-0.5">
              {toast.type === "success" ? "✅" : "⚠️"}
            </div>
            <div className="font-custom text-sm whitespace-pre-line">
              {toast.message}
            </div>
          </div>
        </div>,
        document.body,
      )
    : null;

  return { showSuccess, showError, ToastPortal };
}

const SettingDialog = () => {
  const [isEditPolicyOpen, setEditPolicyOpen] = useState(false);
  const [isEditPolicyAssignmentOpen, setEditPolicyAssignmentOpen] =
    useState(false);

  const { showSuccess, ToastPortal } = useLocalToast();

  return (
    <>
      {ToastPortal}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="text-blue font-custom w-42 h-12 border border-gray-400 bg-transparent rounded-full flex items-center px-6 hover:bg-blue-500 hover:text-white transition-colors duration-200">
            <Settings />
            <span>Setting</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex flex-col items-center text-center">
            <DialogTitle></DialogTitle>
            <h1 className="font-custom text-2xl sm:text-lg md:text-xl lg:text-3xl py-6">
              Leave setting
            </h1>
            <div className="w-full h-[1px] bg-[#A6A6A6]"></div>
          </DialogHeader>

          {/* Policies Section */}
          <div className="flex flex-col md:flex-row justify-between items-start mt-6 px-4 md:px-6 lg:px-32">
            <label className="font-custom text-lg text-[#3F4648] text-left w-full md:w-1/3 mb-3 md:mb-0 md:mt-28 lg:mt-28">
              Paid Policies:
            </label>
            <div className="w-full md:w-2/3 space-y-3">
              <BorderedBox
                title="Time off"
                titleBg="bg-blue-100"
                titleText="text-blue-500"
                setEditPolicyOpen={setEditPolicyOpen}
                setEditPolicyAssignmentOpen={setEditPolicyAssignmentOpen}
              />
              <BorderedBox
                title="Sick leave"
                titleBg="bg-[#FF9A6C33]"
                titleText="text-[#FF9A6C]"
                setEditPolicyOpen={setEditPolicyOpen}
                setEditPolicyAssignmentOpen={setEditPolicyAssignmentOpen}
              />
            </div>
          </div>

          {/* Unpaid Policies */}
          <div className="flex flex-col md:flex-row justify-between items-start mt-6 px-4 md:px-6 lg:px-32">
            <label className="font-custom text-lg text-[#3F4648] text-left w-full md:w-1/3 mb-3 md:mb-0 md:mt-12 lg:mt-16">
              Unpaid Policies:
            </label>
            <div className="w-full md:w-2/3 pb-10">
              <BorderedBox
                title="Unpaid leave"
                titleBg="bg-[#FB5F5933]"
                titleText="text-[#FB5F59]"
                setEditPolicyOpen={setEditPolicyOpen}
                setEditPolicyAssignmentOpen={setEditPolicyAssignmentOpen}
              />
            </div>
          </div>

          <div className="w-full h-[1px] bg-[#A6A6A6]"></div>
          <div className="w-full flex justify-end px-4 md:px-6 lg:px-32 mt-4">
            <Button className="mt-4 px-6 py-2 rounded-full font-custom bg-blue-500 hover:bg-blue-600 text-white">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Render Edit Policy Dialog when needed */}
      {isEditPolicyOpen && (
        <EditPolicydialog onClose={() => setEditPolicyOpen(false)} />
      )}
      {isEditPolicyAssignmentOpen && (
        <EditPolicyAssignmentDialog
          onClose={() => setEditPolicyAssignmentOpen(false)}
        />
      )}
    </>
  );
};

const BorderedBox = ({
  title,
  titleBg,
  titleText,
  setEditPolicyOpen,
  setEditPolicyAssignmentOpen,
}) => {
  return (
    <div className="flex flex-col items-start">
      {/* Small Title Box */}
      <div
        className={`${titleBg} border ${titleText} font-custom text-xs sm:text-sm md:text-md px-4 py-1 rounded-xl mb-2`}
      >
        {title}
      </div>

      {/* Policy Container */}
      <div className="font-custom border border-gray-300 rounded-lg p-4 w-full bg-white text-gray-700 flex items-center justify-between whitespace-nowrap overflow-hidden">
        {/* Left Side: Two Stacked Texts */}
        <div className="flex flex-col min-w-0">
          <span className="font-custom sm:text-sm md:text-md lg:text-lg text-gray truncate">
            All Employees
          </span>
          <span className="font-custom text-sm text-green truncate">
            Default policy
          </span>
        </div>

        {/* Overlapping Circular Badges */}
        <div className="flex items-center flex-wrap sm:flex-nowrap -space-x-3 sm:-space-x-4 min-w-0">
          {[
            { text: "W", bg: "bg-gray-600" },
            { text: "LH", bg: "bg-lime-400" },
            { text: "SK", bg: "bg-pink-400" },
            { text: "2+", bg: "bg-blue-100", textColor: "text-blue-500" },
          ].map((badge, index) => (
            <div
              key={index}
              className={`w-7 h-7 sm:w-8 sm:h-8 md:w-8 md:h-8 lg:w-10 lg:h-10 ${
                badge.bg
              } 
              rounded-full flex items-center justify-center border-2 border-white 
              text-xs sm:text-sm md:text-base lg:text-lg font-bold ${
                badge.textColor || "text-white"
              }`}
            >
              {badge.text}
            </div>
          ))}
        </div>

        {/* Middle: Users Count */}
        <span className="sm:text-sm md:text-md lg:text-lg text-gray font-medium min-w-0 truncate">
          5 Users
        </span>

        {/* Right Side: Clickable Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="focus:outline-none">
              <Ellipsis className="text-gray-600 w-6 h-6 cursor-pointer hover:text-gray-900 transition-colors" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="font-custom text-xl w-30 bg-white shadow-md rounded-md"
          >
            <DropdownMenuItem onClick={() => setEditPolicyOpen(true)}>
              Edit policy
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setEditPolicyAssignmentOpen(true)}>
              Edit policy assignment
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => showSuccess("Delete Policy")}
              className="text-red-500"
            >
              Delete policy
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default SettingDialog;
