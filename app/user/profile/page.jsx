"use client";

import {
  CreditCard,
  Banknote,
  Ellipsis,
  Landmark,
  Percent,
  Trash2,
  Download,
  User,
} from "lucide-react";
import { useState, useCallback, useRef } from "react";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import UpdateCashDialog from "./components/updatecashdialog";
import UpdateBankTransferDialog from "./components/updatebanktransferdialog";
import { Button } from "react-scroll";
import DeleteDialog from "./components/deletedialog";

// 1. All user data is here:
const user = {
  firstname: "John",
  lastname: "Doe",
  avatar: "/avatars/cameron.png",
  role: "Owner",
  accessLevel: "Admin",
  phone: "012345678",
  birthday: "1990-01-01",
  branch: "Main Branch",
  department: "HR",
  title: "Manager",
  dateadded: "2022-01-01",
  cash: 123,
  profile: "/avatars/cameron.png",
  banknumber: "12345678",
  banktransfer: 100,
  single: 25,
  nochildren: 0.6,
};

export default function UserProfile() {
  // 2. State is initialized from user
  const [firstname, setFirstname] = useState(user.firstname);
  const [lastname, setLastname] = useState(user.lastname);
  const [mobile, setMobile] = useState(user.phone);
  const [birthday, setBirthday] = useState(user.birthday);
  const [branch, setBranch] = useState(user.branch);
  const [department, setDepartment] = useState(user.department);
  const [title, setTitle] = useState(user.title);
  const [employmentstartdate, setEmploymentStartDate] = useState(
    user.dateadded
  );
  const [cash, setCash] = useState(user.cash);
  const profile = user.profile;
  const accountnumber = user.banknumber;
  const AccessLevel = user.accessLevel;
  const banktransfer = user.banktransfer;
  const single = user.single;
  const nochildren = user.nochildren;

  const subtotal = banktransfer - (single + nochildren);
  const netsalary = cash + subtotal;

  const firstInitial = firstname.charAt(0).toUpperCase();
  const lastInitial = lastname.charAt(0).toUpperCase();

  const [imageError, setImageError] = useState(false);

  // Dialog states - using refs to prevent re-render loops
  const [dialogStates, setDialogStates] = useState({
    cash: false,
    bank: false,
    delete: false,
    deleteContext: null,
  });

  // Use refs to track if we're already processing
  const processingRef = useRef(false);

  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      ["application/pdf", "image/png", "image/jpeg", "image/jpg"].includes(
        file.type
      )
    ) {
      const newFile = {
        name: file.name,
        type: file.type,
        size: (file.size / 1024).toFixed(1) + " KB",
        date: new Date().toLocaleDateString(),
        file: URL.createObjectURL(file),
      };
      setFiles((prev) => [...prev, newFile]);
    }
  };

  const handleDelete = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const [selectedPolicies, setSelectedPolicies] = useState([
    "Leave Policy",
    "Overtime Policy",
  ]);

  const [selectedWorkShift, setSelectedWorkShift] = useState([
    "Morning",
    "Afternoon",
  ]);

  const toggleWorkShift = (shift) => {
    setSelectedWorkShift((prev) =>
      prev.includes(shift) ? prev.filter((s) => s !== shift) : [...prev, shift]
    );
  };

  const [selectedGroup, setSelectedGroup] = useState(["Admin", "HR Manager"]);

  const toggleGroup = (value) => {
    setSelectedGroup((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const [selectedLocation, setSelectedLocation] = useState([
    "Geo Fence",
    "Flexible",
    "GPS",
  ]);

  const toggleLocation = (value) => {
    setSelectedLocation((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  // Simplified dialog handlers - prevent multiple calls
  const openDialog = useCallback((type, context = null) => {
    if (processingRef.current) return;
    processingRef.current = true;

    setTimeout(() => {
      setDialogStates((prev) => ({
        ...prev,
        [type]: true,
        deleteContext: context,
      }));
      processingRef.current = false;
    }, 0);
  }, []);

  const closeDialog = useCallback((type) => {
    if (processingRef.current) return;
    processingRef.current = true;

    setTimeout(() => {
      setDialogStates((prev) => ({
        ...prev,
        [type]: false,
        deleteContext: type === "delete" ? null : prev.deleteContext,
      }));
      processingRef.current = false;
    }, 0);
  }, []);

  // Simplified menu handlers
  const handleCashEdit = useCallback(() => openDialog("cash"), [openDialog]);
  const handleCashDelete = useCallback(
    () => openDialog("delete", "cash"),
    [openDialog]
  );
  const handleBankEdit = useCallback(() => openDialog("bank"), [openDialog]);
  const handleBankDelete = useCallback(
    () => openDialog("delete", "bank"),
    [openDialog]
  );

  const handleArchive = useCallback(() => {
    console.log("Archive clicked");
    // Add your archive logic here
  }, []);

  const DropdownSection = ({
    title,
    items,
    selectedItems,
    toggleItem,
    dropdownWidth = "w-40",
  }) => (
    <>
      <h2 className="text-2xl font-semibold font-custom mb-2 mt-6">{title}</h2>
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div className="flex flex-wrap gap-4">
          {items.map(
            (item) =>
              selectedItems.includes(item) && (
                <div
                  key={item}
                  className="bg-blue-100 rounded-xl border border-gray-200 p-3 shadow-sm w-auto max-w-full"
                >
                  <h2 className="text-sm font-custom text-blue">{item}</h2>
                </div>
              )
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="mt-2 inline-flex items-center justify-center w-7 h-7 bg-[#E6EFFF] rounded-full hover:bg-[#d0e4ff] focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer transition"
            >
              <span className="relative w-3 h-3">
                <span className="absolute inset-0 w-[2px] h-full bg-blue-500 left-1/2 transform -translate-x-1/2" />
                <span className="absolute inset-0 h-[2px] w-full bg-blue-500 top-1/2 transform -translate-y-1/2" />
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className={`font-custom text-sm ${dropdownWidth} bg-white shadow-md rounded-md`}
          >
            <div className="space-y-1">
              {items.map((item) => (
                <DropdownMenuItem
                  key={item}
                  onSelect={() => toggleItem(item)}
                  className={
                    selectedItems.includes(item)
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-blue-50"
                  }
                >
                  {item}
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );

  const InfoRow = ({ label, value }) => (
    <div className="flex items-center justify-between">
      <p className="text-md font-custom text-light-pearl">{label}</p>
      <p className="font-custom text-md text-dark-blue font-semibold">
        {value}
      </p>
    </div>
  );

  const [showFirstMenu, setShowFirstMenu] = useState(false);
  const [openSecondLayerFor, setOpenSecondLayerFor] = useState("");

  const [leaveSubPolicies, setLeaveSubPolicies] = useState(["Annual Leave"]);
  const [overtimeSubPolicies, setOvertimeSubPolicies] = useState([]);

  const toggleLeaveSubPolicy = (opt) => {
    setLeaveSubPolicies(
      (prev) =>
        prev.includes(opt)
          ? prev.filter((item) => item !== opt) // Remove if already exists
          : [...prev, opt] // Add if doesn't exist
    );
    // Close both menus after selection
    setShowFirstMenu(false);
    setOpenSecondLayerFor("");
  };

  const toggleOvertimeSubPolicy = (opt) => {
    setOvertimeSubPolicies(
      (prev) =>
        prev.includes(opt)
          ? prev.filter((item) => item !== opt) // Remove if already exists
          : [...prev, opt] // Add if doesn't exist
    );
    // Close both menus after selection
    setShowFirstMenu(false);
    setOpenSecondLayerFor("");
  };

  const handleSave = () => {
    const updatedProfile = {
      firstname,
      lastname,
      mobile,
      birthday,
      branch,
      department,
      title,
      employmentstartdate,
    };

    console.log("✅ Saving profile:", updatedProfile);
    alert("Changes saved successfully!");
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-md py-6 px-6 mb-1">
        <div className="flex items-center space-x-3 p-5">
          <User className="text-[#2998FF]" width={40} height={40} />
          <span className="font-custom text-3xl text-black">Profile</span>
        </div>
      </div>

      <div className="bg-gray-100 rounded-xl mb-3 shadow-md py-6 sm:px-6 md:px-6 lg:px-16">
        <div className="font-custom text-xl font-semibold px-6 text-[#3E435D]">
          Hello, {firstname}
        </div>
        <p className="font-custom text-sm text-gray-400 px-6 mt-2">
          Good morning!
        </p>

        {/* Profile Holder Container with fallback initials */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mt-6 flex items-center space-x-4 px-6">
          <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-xl text-white font-semibold overflow-hidden">
            {profile && !imageError ? (
              <img
                src={profile}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <span className="text-gray-700">
                {firstInitial}
                {lastInitial}
              </span>
            )}
          </div>
          <div>
            <div className="text-2xl font-bold font-custom">
              {firstname} {lastname}
            </div>
            <div className="text-sm font-custom text-gray-500">
              {AccessLevel}
            </div>
          </div>
        </div>

        {/* Two-column layout: left has container, right has text */}
        <div className="mt-4 flex flex-col md:flex-row gap-4">
          {/* Left container */}
          <div className="w-full md:w-[40%] bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-semibold font-custom mb-2">
              Personal details
            </h2>

            <label className="text-sm font-custom text-[#3F4648] w-full">
              First Name
            </label>
            <input
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="text-sm font-custom rounded-lg p-3 w-full mt-2 mb-6 bg-white border border-gray-300 text-black"
            />

            <label className="text-sm font-custom text-[#3F4648] w-full">
              Last Name
            </label>
            <input
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="text-sm font-custom rounded-lg p-3 w-full mt-2 mb-6 bg-white border border-gray-300 text-black"
            />

            <label className="text-sm font-custom text-[#3F4648] w-full">
              Mobile Phone
            </label>
            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="text-sm font-custom rounded-lg p-3 w-full mt-2 mb-6 bg-white border border-gray-300 text-black"
            />

            <label className="text-sm font-custom text-[#3F4648] w-full">
              Birthday
            </label>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="text-sm font-custom rounded-lg p-3 w-full mt-2 mb-6 bg-white border border-gray-300 text-black"
            />

            <h2 className="text-2xl font-semibold font-custom mb-2">
              Company details
            </h2>

            <label className="text-sm font-custom text-[#3F4648] w-full">
              Branch
            </label>
            <input
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="text-sm font-custom rounded-lg p-3 w-full mt-2 mb-6 bg-white border border-gray-300 text-black"
            />

            <label className="text-sm font-custom text-[#3F4648] w-full">
              Department
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="text-sm font-custom rounded-lg p-3 w-full mt-2 mb-6 bg-white border border-gray-300 text-black"
            />

            <label className="text-sm font-custom text-[#3F4648] w-full">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-sm font-custom rounded-lg p-3 w-full mt-2 mb-6 bg-white border border-gray-300 text-black"
            />

            <label className="text-sm font-custom text-[#3F4648] w-full">
              Employment Start Date
            </label>
            <input
              type="date"
              value={employmentstartdate}
              onChange={(e) => setEmploymentStartDate(e.target.value)}
              className="text-sm font-custom rounded-lg p-3 w-full mt-2 mb-6 bg-white border border-gray-300 text-black"
            />

            <h2 className="text-2xl font-semibold font-custom mb-2 mt-6">
              Policies
            </h2>
            <div className="relative flex justify-between items-start flex-wrap gap-4">
              {/* Display Selected Tags */}
              <div className="flex flex-wrap gap-4">
                {leaveSubPolicies.map((item) => (
                  <div
                    key={item}
                    className="bg-blue-100 rounded-xl border border-gray-200 p-3 shadow-sm"
                  >
                    <h2 className="text-sm font-custom text-blue">
                      Leave - {item}
                    </h2>
                  </div>
                ))}
                {overtimeSubPolicies.map((item) => (
                  <div
                    key={item}
                    className="bg-blue-100 rounded-xl border border-gray-200 p-3 shadow-sm"
                  >
                    <h2 className="text-sm font-custom text-blue">
                      Overtime - {item}
                    </h2>
                  </div>
                ))}
              </div>

              {/* + Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowFirstMenu((prev) => !prev);
                    setOpenSecondLayerFor(""); // Reset second layer when reopening first
                  }}
                  className="mt-2 inline-flex items-center justify-center w-7 h-7 bg-[#E6EFFF] rounded-full hover:bg-[#d0e4ff] focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer transition"
                >
                  <span className="relative w-3 h-3">
                    <span className="absolute inset-0 w-[2px] h-full bg-blue-500 left-1/2 transform -translate-x-1/2" />
                    <span className="absolute inset-0 h-[2px] w-full bg-blue-500 top-1/2 transform -translate-y-1/2" />
                  </span>
                </button>

                {/* First Menu */}
                {showFirstMenu && (
                  <div className="absolute top-10 left-0 z-50 font-custom text-sm w-40 bg-white shadow-md rounded-md">
                    {["Leave Policy", "Overtime Policy"].map((item) => (
                      <div
                        key={item}
                        onClick={() => setOpenSecondLayerFor(item)}
                        className="px-4 py-2 cursor-pointer hover:bg-blue-50"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                )}

                {/* Second Menu */}
                {openSecondLayerFor === "Leave Policy" && showFirstMenu && (
                  <div className="absolute top-10 left-[180px] z-50 font-custom text-sm w-48 bg-white shadow-md rounded-md">
                    {["Sick Leave", "Annual Leave"].map((opt) => (
                      <div
                        key={opt}
                        onClick={() => toggleLeaveSubPolicy(opt)}
                        className={`px-4 py-2 cursor-pointer rounded ${
                          leaveSubPolicies.includes(opt)
                            ? "bg-blue-100 text-blue-700"
                            : "hover:bg-blue-50"
                        }`}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}

                {openSecondLayerFor === "Overtime Policy" && showFirstMenu && (
                  <div className="absolute top-10 left-[180px] z-50 font-custom text-sm w-48 bg-white shadow-md rounded-md">
                    {["Morning", "Weekend"].map((opt) => (
                      <div
                        key={opt}
                        onClick={() => toggleOvertimeSubPolicy(opt)}
                        className={`px-4 py-2 cursor-pointer rounded ${
                          overtimeSubPolicies.includes(opt)
                            ? "bg-blue-100 text-blue-700"
                            : "hover:bg-blue-50"
                        }`}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <DropdownSection
              title="Work Shift"
              items={["Morning", "Afternoon", "Full Day"]}
              selectedItems={selectedWorkShift}
              toggleItem={toggleWorkShift}
            />

            <DropdownSection
              title="Group"
              items={["Admin", "HR Manager", "Employee"]}
              selectedItems={selectedGroup}
              toggleItem={toggleGroup}
              dropdownWidth="w-44"
            />

            <DropdownSection
              title="Location"
              items={["Geo Fence", "Flexible", "GPS"]}
              selectedItems={selectedLocation}
              toggleItem={toggleLocation}
            />
          </div>

          {/* Right container with text aligned left */}
          <div className="w-full md:w-[60%] p-6">
            <div className="text-md font-custom text-light-pearl w-full space-y-2">
              <h2 className="text-xl font-semibold font-custom text-[#0F3F62] mb-2">
                Payroll Info
              </h2>

              <InfoRow
                label="Employee Name"
                value={`${firstname} ${lastname}`}
              />
              <InfoRow label="Employee ID" value="#1234565" />
              <InfoRow label="Bank Name" value="--------------" />
              <InfoRow label="Account Number" value={accountnumber} />
            </div>

            {/* Cash Section - SIMPLIFIED */}
            <div className="relative">
              <div className="absolute -top-8 right-0 z-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="m-2 focus:outline-none" type="button">
                      <Ellipsis className="text-gray-600 w-6 h-6 cursor-pointer hover:text-gray-900 transition-colors" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="font-custom text-sm w-48 bg-white shadow-md rounded-md"
                  >
                    <DropdownMenuItem onSelect={handleCashEdit}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={handleArchive}>
                      Archive
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={handleCashDelete}
                      className="text-red-500"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center justify-between mt-8 bg-white shadow-md rounded-lg p-4">
                <div className="flex items-center">
                  <Banknote className="text-blue w-12 h-12 mr-6" />
                  <p className="font-custom text-md font-semibold">Cash</p>
                </div>
                <p className="text-dark-blue font-custom text-md font-semibold">
                  ${cash}
                </p>
              </div>
            </div>

            {/* Bank Transfer Section - SIMPLIFIED */}
            <div className="relative">
              <div className="absolute -top-8 right-0 z-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="m-2 focus:outline-none" type="button">
                      <Ellipsis className="text-gray-600 w-6 h-6 cursor-pointer hover:text-gray-900 transition-colors" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="font-custom text-sm w-48 bg-white shadow-md rounded-md"
                  >
                    <DropdownMenuItem onSelect={handleBankEdit}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={handleArchive}>
                      Archive
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={handleBankDelete}
                      className="text-red-500"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mt-8 bg-white shadow-md rounded-lg p-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Landmark className="text-blue w-10 h-10 mr-6" />
                    <p className="font-custom text-md font-semibold">
                      Bank Transfer
                    </p>
                  </div>
                  <p className="text-dark-blue font-custom text-md font-semibold">
                    ${banktransfer}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center ml-10">
                    <Percent className="text-blue w-8 h-8 mr-6" />
                    <div>
                      <p className="font-custom text-md font-semibold">
                        Single
                      </p>
                      <p className="text-xs text-gray-500 font-custom">Tax</p>
                    </div>
                  </div>
                  <p className="text-dark-blue font-custom text-md font-semibold">
                    ${single}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center ml-10">
                    <CreditCard className="text-blue w-8 h-8 mr-6" />
                    <div>
                      <p className="font-custom text-md font-semibold">
                        No Children
                      </p>
                      <p className="text-xs text-gray-500 font-custom">NSSF</p>
                    </div>
                  </div>
                  <p className="text-dark-blue font-custom text-md font-semibold">
                    ${nochildren}
                  </p>
                </div>

                <div className="border-t border-blue-500 my-2"></div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center ml-10">
                    <Banknote className="text-blue w-8 h-8 mr-6" />
                    <p className="font-custom text-md font-semibold">
                      Sub total Salary
                    </p>
                  </div>
                  <p className="text-dark-blue font-custom text-md font-semibold">
                    ${subtotal}
                  </p>
                </div>
              </div>

              {/* Estimated Section */}
              <div className="mt-8 bg-white shadow-md rounded-lg p-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <p className="font-custom text-lg font-semibold">
                      Estimated
                    </p>
                  </div>
                </div>
                <hr className="border-t border-blue-500" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center ml-10">
                    <Banknote className="text-blue w-8 h-8 mr-6" />
                    <div>
                      <p className="font-custom text-md font-semibold">Cash</p>
                    </div>
                  </div>
                  <p className="text-dark-blue font-custom text-md font-semibold">
                    ${cash}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center ml-10">
                    <Banknote className="text-blue w-8 h-8 mr-6" />
                    <div>
                      <p className="font-custom text-md font-semibold">
                        Bank Transfer
                      </p>
                    </div>
                  </div>
                  <p className="text-dark-blue font-custom text-md font-semibold">
                    ${subtotal}
                  </p>
                </div>

                <div className="border-t border-blue-500"></div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <p className="font-custom text-lg font-semibold">
                      Net Salary
                    </p>
                  </div>
                  <p className="text-dark-blue font-custom text-md font-semibold">
                    ${netsalary}
                  </p>
                </div>
              </div>

              {/* Attachment Section */}
              <div>
                <h2 className="text-2xl font-semibold font-custom text-black mt-6 flex items-center">
                  Attachment
                  <label
                    htmlFor="pdf-upload"
                    className="ml-4 inline-flex items-center justify-center w-7 h-7 bg-[#E6EFFF] rounded-full hover:bg-[#d0e4ff] focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer transition"
                  >
                    <span className="relative w-3 h-3">
                      <span className="absolute inset-0 w-[2px] h-full bg-blue-500 left-1/2 transform -translate-x-1/2"></span>
                      <span className="absolute inset-0 h-[2px] w-full bg-blue-500 top-1/2 transform -translate-y-1/2"></span>
                    </span>
                    <input
                      id="pdf-upload"
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </h2>

                <div className="mt-4 flex flex-col items-start gap-3">
                  {files.map((f, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        {f.type === "application/pdf" ? (
                          <img
                            src="/images/Pdf_icon.png"
                            alt="PDF Icon"
                            className="h-10 w-auto object-contain"
                          />
                        ) : (
                          <img
                            src={f.file}
                            alt={f.name}
                            className="h-10 w-10 rounded object-cover"
                          />
                        )}

                        <div>
                          <p className="font-medium text-gray-800">{f.name}</p>
                          <p className="text-sm text-gray-500">
                            {f.size} • {f.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-6">
                        <a href={f.file} download={f.name}>
                          <Download className="w-5 h-5 text-blue-600 hover:text-blue-800 cursor-pointer" />
                        </a>
                        <Trash2
                          className="w-5 h-5 text-red-500 hover:text-red-700 cursor-pointer"
                          onClick={() => handleDelete(idx)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={handleSave}
          className="mt-4 bg-blue-400 text-white font-custom px-6 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Save Changes
        </Button>
      </div>

      {/* Dialogs - Only render when needed */}
      {dialogStates.cash && (
        <UpdateCashDialog
          open={true}
          onOpenChange={() => closeDialog("cash")}
          oldCash={cash}
          onSubmit={(newAmount) => {
            setCash(newAmount);
            closeDialog("cash");
          }}
        />
      )}

      {dialogStates.bank && (
        <UpdateBankTransferDialog
          open={true}
          onOpenChange={() => closeDialog("bank")}
          oldCash={cash}
          onSubmit={(data) => {
            console.log("🧾 Updated bank transfer data:", data);
            closeDialog("bank");
          }}
        />
      )}

      {dialogStates.delete && (
        <DeleteDialog
          open={dialogStates.delete}
          setOpen={(isOpen) => {
            if (!isOpen) {
              closeDialog("delete");
            }
          }}
          context={dialogStates.deleteContext}
          onConfirm={() => {
            if (dialogStates.deleteContext === "cash") {
              console.log("Deleting cash record");
            } else if (dialogStates.deleteContext === "bank") {
              console.log("Deleting bank record");
            }
            closeDialog("delete");
          }}
        />
      )}
    </>
  );
}
