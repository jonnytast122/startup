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
import { FaSpinner } from "react-icons/fa";
import { useState, useCallback, useRef, useEffect } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/config/firebase";
import { useDropzone } from "react-dropzone";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import UpdateCashDialog from "../components/updatecashdialog";
import UpdateBankTransferDialog from "../components/updatebanktransferdialog";
import { Button } from "react-scroll";
import DeleteDialog from "../components/deletedialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchWorkShift } from "@/lib/api/work-shift";
import { getMyDetails, updateUser } from "@/lib/api/user";
import { fetchBranches } from "@/lib/api/branch";
import { fetchPositions } from "@/lib/api/position";
import { fetchCompany } from "@/lib/api/company";
import { fetchSections } from "@/lib/api/group";
import { fetchCompanyDepartments } from "@/lib/api/department";
import { fetchCompanyLeavePolicy } from "@/lib/api/policy";

export default function UserProfile({ user }) {
  console.log("User profile data:", user);
  const queryClient = useQueryClient();

  const { data: company } = useQuery({
    queryKey: ["company"],
    queryFn: fetchCompany,
  });

  const { data: myDetails } = useQuery({
    queryKey: ["my-details"],
    queryFn: getMyDetails,
  });

  const { data: workshift } = useQuery({
    queryKey: ["workShift", company?.id],
    queryFn: () => fetchWorkShift(company?.id),
    enabled: !!company?.id,
  });

  const { data: departments = [] } = useQuery({
    queryKey: ["departments", company?.id],
    queryFn: () => fetchCompanyDepartments(company?.id),
    enabled: !!company?.id,
  });

  const { data: branches } = useQuery({
    queryKey: ["branches"],
    queryFn: fetchBranches,
  });

  // Fetch sections (with nested groups)
  const { data: sections = [], isLoading } = useQuery({
    queryKey: ["sections"],
    queryFn: fetchSections,
  });

  const { data: positions } = useQuery({
    queryKey: ["positions"],
    queryFn: fetchPositions,
  });

  const { data: leaveSettings, isLoading: leaveLoading } = useQuery({
    queryKey: ["leaveSettings", company?.id],
    queryFn: () => fetchCompanyLeavePolicy(company?.id),
    enabled: !!company?.id,
  });
  const [isSaving, setIsSaving] = useState(false);
  const formatDateForInput = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };
  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const storageRef = ref(storage, `uploads/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(percent);
      },
      (error) => {
        console.error("Upload failed:", error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setSelectedFile(url);
        });
      }
    );
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
    noClick: true,
  });

  const profileImage = selectedFile || user?.profileImg;

  const role = (myDetails?.role || myDetails?.employee?.role || "").toLowerCase();
  const permissions = Array.isArray(myDetails?.permissions)
    ? myDetails.permissions
    : Array.isArray(myDetails?.employee?.permissions)
      ? myDetails.employee.permissions
      : [];
  const canManageUsers = role === "owner" || permissions.includes("manageUsers");

  const [companyId, setCompanyId] = useState(
    user?.employee?.companyIdentifier || ""
  );
  const [firstname, setFirstname] = useState(
    user?.employee?.name ? user.employee.name.split(" ")[0] : ""
  );
  const [lastname, setLastname] = useState(
    user?.employee?.name ? user.employee.name.split(" ").slice(1).join(" ") : ""
  );
  const [otherName, setOtherName] = useState(user?.otherName || "N/A");
  const [idCardNumber, setIdCardNumber] = useState(user?.idCardNumber || "N/A");
  const [gender, setGender] = useState(user?.gender || "");
  const [requiredAttendance, setRequiredAttendance] = useState(
    user?.isRequiredToCheckIn ?? false
  );

  const attendanceOptions = [
    { label: "YES", value: true },
    { label: "NO", value: false },
  ];
  const [salaryType, setSalaryType] = useState(
    user?.employee?.finance?.salaryInfo?.salaryType || ""
  );
  const [phoneNumber, setPhoneNumber] = useState(
    user?.employee?.phoneNumber || ""
  );
  const [job, setJob] = useState(user?.job || "");
  const [dateOfBirth, setDateOfBirth] = useState(
    formatDateForInput(user?.dateOfBirth) || ""
  );
  const [branch, setBranch] = useState(user?.branch?.id || "");
  const [department, setDepartment] = useState(user?.department?.id || "");
  const [title, setTitle] = useState(user?.position?.id || "");
  const [startDate, setStartDate] = useState(
    formatDateForInput(user?.startDate) || ""
  );
  const [nssfId, setNssfId] = useState(user?.nssfId || "N/A");
  const [numberOfChildren, setNumberOfChildren] = useState(
    user?.numberOfChildren || 0
  );
  const [spoused, setSpoused] = useState(user?.spoused || false);
  const [bankProvider, setBankProvider] = useState(
    user?.employee?.finance?.bankDetails?.bankProvider || "N/A"
  );
  const [accountNumber, setAccountNumber] = useState(
    user?.employee?.finance?.bankDetails?.accountNumber || "N/A"
  );
  const [cashPercentage, setCashPercentage] = useState(
    user?.employee?.finance?.paymentMethod?.cashPercentage || 0
  );
  const [ibankingPercentage, setIbankingPercentage] = useState(
    user?.employee?.finance?.paymentMethod?.ibankingPercentage || 0
  );
  const [baseSalary, setBaseSalary] = useState(
    user?.employee?.finance?.salaryInfo?.baseSalary || 0
  );
  const [dailyRate, setDailyRate] = useState(
    user?.employee?.finance?.salaryInfo?.dailyRate || 0
  );

  const [hourlyRate, setHourlyRate] = useState(
    user?.employee?.finance?.salaryInfo?.hourlyRate || 0
  );
  const [currencyType, setCurrencyType] = useState(
    user?.employee?.finance?.salaryInfo?.currencyType || ""
  );

  const [leaveSubPolicies, setLeaveSubPolicies] = useState([]);
  const [files, setFiles] = useState([]);

  // Multi-select for work shifts
  const [selectedWorkShift, setSelectedWorkShift] = useState([]);

  // Multi-select for groups
  const [selectedGroup, setSelectedGroup] = useState([]);

  const [allGroups, setAllGroups] = useState([]);

  useEffect(() => {
    if (!sections || sections.length === 0) return;
    // Flatten all groups and normalize ids to strings
    const all = sections
      .flatMap((s) => s.groups ?? [])
      .map((g) => ({
        ...g,
        id: String(g.id ?? g._id),
      }));
    setAllGroups(all);
    // Initialize selected groups
    if (user?.groups) {
      const groupIds = user.groups.map((g) => String(g.id ?? g._id));
      setSelectedGroup(groupIds);
    }
  }, [sections, JSON.stringify(user?.groups || [])]);

  const toggleWorkShift = (shift) => {
    const id = String(shift.id);
    setSelectedWorkShift((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleGroup = (group) => {
    const id = String(group.id);
    setSelectedGroup((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const [selectedLocation, setSelectedLocation] = useState(
    user?.allowedRemoteCheckIn ?? false
  );

  const checkInOptions = [
    { label: "Flexible", value: true },
    { label: "Geofencing", value: false },
  ];
  const [dialogStates, setDialogStates] = useState({
    cash: false,
    bank: false,
    delete: false,
    deleteContext: null,
  });

  const bankProviders = [
    {
      value: "aba",
      label: "ABA Bank",
      icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtY2aqkYA54jTqgCQmP2Zl0W7BwjM_XQ7vjg&s",
    },
    {
      value: "acleda",
      label: "ACLEDA Bank",
      icon: "https://www.acledasecurities.com.kh/as/assets/listed_company/ABC/logo.png",
    },
    {
      value: "canadia",
      label: "Canadia Bank",
      icon: "https://play-lh.googleusercontent.com/hZhdx8AuJsmnZyy6rSLi3fZsWeOJ3qD5LRy2KmKOaXf8uWtsvrYScl_lxyhBsyan2-c",
    },
    {
      value: "ftb",
      label: "FTB Bank",
      icon: "https://play-lh.googleusercontent.com/dBXpI2QOfWndhjQKboqdt6sOdSeeGk_pxeXqVC8hHD-xCDQIKoD_MLHhVH51gb25F1rY",
    },
    {
      value: "wing",
      label: "Wing Bank",
      icon: "https://play-lh.googleusercontent.com/A8bangMCdTPS1Xa9hbuc4pcXxUspKpJhDHWW3QSw3OB-VMtUv6NCnqAd7pUv2C-2OnjJHn0Xmv1cs6c2hFUZMw",
    },
    {
      value: "phillip",
      label: "Phillip Bank",
      icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTl5AQ8pKBWNSLy2jNDa3-4ie1RudZ81DUXgg&s",
    },
    {
      value: "sathapana",
      label: "Sathapana Bank",
      icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRttioRPdS1xu-MygwdD1Qb7wTmRAxAo4s0pg&s",
    },
    {
      value: "chipmong",
      label: "Chip Mong Bank",
      icon: "https://play-lh.googleusercontent.com/IwZLaZnWhlINs7AoIg7m7qNR-JNLInrme1xtrXkYoNxWwdTlWZozZnIligkyjUhiO0Q5",
    },
  ];

  const processingRef = useRef(false);

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

  const handleDelete = (index) => setFiles(files.filter((_, i) => i !== index));

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

  useEffect(() => {
    // Initialize selected work shifts
    if (Array.isArray(user?.shiftType) && user.shiftType.length > 0) {
      const shiftIds = user.shiftType.map((s) => String(s.id));
      setSelectedWorkShift(shiftIds);
    }
  }, [user?.shiftType, user?.groups]);
  const DropdownSection = ({
    title,
    items,
    selectedItems,
    toggleItem,
    renderItem = (item) => item,
    dropdownWidth = "w-40",
  }) => {
    return (
      <div className="mb-6">
        <h2 className="text-2xl font-semibold font-custom mb-2 mt-6">
          {title}
        </h2>

        {/* Selected items display */}
        <div className="flex flex-wrap gap-4 mb-2">
          {items.map(
            (item) =>
              selectedItems.includes(String(item.id || item)) && (
                <div
                  key={item.id || item}
                  className="bg-blue-100 rounded-xl border border-gray-200 p-3 shadow-sm w-auto max-w-full"
                >
                  <h2 className="text-sm font-custom text-blue">
                    {renderItem(item)}
                  </h2>
                </div>
              )
          )}
        </div>

        {/* Dropdown menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center justify-center w-7 h-7 bg-[#E6EFFF] rounded-full hover:bg-[#d0e4ff] focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer transition"
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
            {items.map((item, index) => {
              const key = item?.id ? String(item.id) : `${title}-${index}`;
              const itemId = String(item.id || item);
              const isSelected = selectedItems.includes(itemId);

              return (
                <DropdownMenuItem
                  key={key}
                  onSelect={() => toggleItem(item)}
                  className={
                    isSelected
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-blue-50"
                  }
                >
                  {renderItem(item)}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };

  useEffect(() => {
    if (leaveSettings && user?.leavePolicies) {
      const selectedIds = user.leavePolicies
        .map((p) => String(p.id))
        .filter((id) => leaveSettings.some((ls) => String(ls.id) === id));

      setLeaveSubPolicies(selectedIds);
    }
  }, [leaveSettings, user?.leavePolicies]);

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      setIsSaving(false);
    },
    onError: (error, variables) => {
      setIsSaving(false);
      console.error(
        "Error updating user:",
        variables.id,
        error,
        variables.data
      );
    },
  });

  const pickChangedFields = (original, updated) => {
    const diff = {};

    Object.keys(updated).forEach((key) => {
      const originalValue = original?.[key];
      const updatedValue = updated[key];

      // Deep compare arrays
      if (Array.isArray(updatedValue)) {
        if (
          !Array.isArray(originalValue) ||
          JSON.stringify(originalValue) !== JSON.stringify(updatedValue)
        ) {
          diff[key] = updatedValue;
        }
        return;
      }

      // Deep compare objects
      if (
        typeof updatedValue === "object" &&
        updatedValue !== null &&
        !Array.isArray(updatedValue)
      ) {
        const nestedDiff = pickChangedFields(originalValue || {}, updatedValue);
        if (Object.keys(nestedDiff).length > 0) {
          diff[key] = nestedDiff;
        }
        return;
      }

      // Primitive comparison
      if (updatedValue !== originalValue) {
        diff[key] = updatedValue;
      }
    });

    return diff;
  };

  const handleSave = () => {
    setIsSaving(true);

    const payload = {};

    /* ================= USER ================= */
    const fullName = `${firstname} ${lastname}`.trim();
    if (fullName !== user.employee.name) {
      payload.name = fullName;
    }

    const normalizedPhone = phoneNumber.startsWith("855")
      ? phoneNumber
      : `855${phoneNumber}`;

    if (normalizedPhone !== user.employee.phoneNumber) {
      payload.phoneNumber = normalizedPhone;
    }

    if (companyId !== user.employee.companyIdentifier) {
      payload.companyIdentifier = companyId;
    }

    /* ============== EMPLOYEE INFO ============== */
    if (profileImage !== user.profileImg) {
      payload.profileImg = profileImage;
    }

    if (otherName !== user.otherName) {
      payload.otherName = otherName || null;
    }

    if (job !== user.job) {
      payload.job = job || null;
    }

    if (
      dateOfBirth &&
      new Date(dateOfBirth).toISOString() !== user.dateOfBirth
    ) {
      payload.dateOfBirth = new Date(dateOfBirth).toISOString();
    }

    if (startDate && new Date(startDate).toISOString() !== user.startDate) {
      payload.startDate = new Date(startDate).toISOString();
    }

    if (branch && branch !== user.branch?.id) {
      payload.branch = branch;
    }

    if (department !== (user.department?.id || null)) {
      payload.department = department || null;
    }

    if (title !== (user.position?.id || null)) {
      payload.position = title || null;
    }

    if (
      JSON.stringify(selectedWorkShift) !==
      JSON.stringify(user.shiftType?.map((s) => String(s.id)) || [])
    ) {
      payload.shiftType = selectedWorkShift;
    }

    if (
      JSON.stringify(selectedGroup) !==
      JSON.stringify(user.groups?.map((g) => String(g.id)) || [])
    ) {
      payload.groups = selectedGroup;
    }

    if (
      JSON.stringify(leaveSubPolicies) !==
      JSON.stringify(user.leavePolicies?.map((p) => String(p.id)) || [])
    ) {
      payload.leavePolicies = leaveSubPolicies;
    }

    if (spoused !== user.spoused) {
      payload.spoused = spoused;
    }

    if (Number(numberOfChildren) !== user.numberOfChildren) {
      payload.numberOfChildren = Number(numberOfChildren);
    }

    if (nssfId !== user.nssfId) {
      payload.nssfId = nssfId || null;
    }

    if (selectedLocation !== user.allowedRemoteCheckIn) {
      payload.allowedRemoteCheckIn = selectedLocation;
    }

    if (requiredAttendance !== user.isRequiredToCheckIn) {
      payload.isRequiredToCheckIn = requiredAttendance;
    }

    /* ============== FINANCIAL INFO ============== */
    if (
      bankProvider !== user.employee.finance?.bankDetails?.bankProvider ||
      accountNumber !== user.employee.finance?.bankDetails?.accountNumber
    ) {
      payload.bankDetails = {
        bankProvider: bankProvider || null,
        accountNumber: accountNumber || null,
      };
    }

    if (
      cashPercentage !== user.employee.finance?.paymentMethod?.cashPercentage ||
      ibankingPercentage !==
        user.employee.finance?.paymentMethod?.ibankingPercentage
    ) {
      payload.paymentMethod = {
        cashPercentage: Number(cashPercentage),
        ibankingPercentage: Number(ibankingPercentage),
      };
    }

    if (
      baseSalary !== user.employee.finance?.salaryInfo?.baseSalary ||
      salaryType !== user.employee.finance?.salaryInfo?.salaryType ||
      dailyRate !== user.employee.finance?.salaryInfo?.dailyRate ||
      hourlyRate !== user.employee.finance?.salaryInfo?.hourlyRate ||
      currencyType !== user.employee.finance?.salaryInfo?.currencyType
    ) {
      payload.salaryInfo = {
        baseSalary: Number(baseSalary),
        salaryType,
        dailyRate: Number(dailyRate),
        hourlyRate: Number(hourlyRate),
        currencyType,
      };
    }

    /* ============== SEND ONLY IF CHANGED ============== */
    if (Object.keys(payload).length === 0) {
      setIsSaving(false);
      return;
    }

    updateUserMutation.mutate(
      {
        id: user.employee.id,
        data: payload,
      },
      {
        onSettled: () => setIsSaving(false),
      }
    );
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
          Hello, {user?.employee?.name}
        </div>

        {/* Profile Holder Container with fallback initials */}
        <div
          {...getRootProps()}
          className="bg-white rounded-2xl p-4 shadow-sm mt-6 flex items-center space-x-4 px-6"
        >
          <input {...getInputProps()} />

          {/* Clickable profile section */}
          <div
            className="cursor-pointer relative group"
            onClick={open} // manually trigger file dialog
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-12 h-12 rounded-full border-2 border-gray-200 object-cover"
              />
            ) : (
              <div className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-gray-200 bg-gray-300 text-gray-700 font-semibold text-lg">
                {user?.employee?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition">
              <span className="text-white text-xs font-medium">Upload</span>
            </div>
          </div>

          <div className="font-custom text-left">
            <div className="font-semibold text-lg text-gray-900">
              {user?.employee?.name}
            </div>
            <div className="text-sm text-gray-500">
              {user?.job || "No Job Title"}
            </div>
          </div>

          {progress > 0 && progress < 100 && (
            <span className="text-sm text-gray-500 ml-auto">
              {" "}
              <FaSpinner className="animate-spin text-blue text-lg" />
              {progress}%
            </span>
          )}
        </div>

        {/* Two-column layout: left has container, right has text */}
        <div className="mt-4 flex flex-col md:flex-row gap-4">
          {/* Left container */}
          <div className="w-full md:w-[40%] bg-white rounded-2xl p-6 shadow-sm">
            <label className="text-sm font-custom text-[#3F4648] w-full">
              Company ID
            </label>
            <input
              type="text"
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              className="text-sm font-custom rounded-lg p-3 w-full mt-2 mb-6 bg-white border border-gray-300 text-black"
            />
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
              Other Name
            </label>
            <input
              type="text"
              value={otherName}
              onChange={(e) => setOtherName(e.target.value)}
              className="text-sm font-custom rounded-lg p-3 w-full mt-2 mb-6 bg-white border border-gray-300 text-black"
            />
            {/* Gender dropdown */}

            <div>
              <label className="text-sm font-custom text-[#3F4648] w-full">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="text-sm font-custom rounded-lg p-3 w-full mt-2 mb-6 bg-white border border-gray-300 text-black"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <label className="text-sm font-custom text-[#3F4648] w-full">
              Mobile Phone
            </label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="text-sm font-custom rounded-lg p-3 w-full mt-2 mb-6 bg-white border border-gray-300 text-black"
            />
            <label className="text-sm font-custom text-[#3F4648] w-full">
              Job
            </label>
            <input
              type="text"
              value={job}
              onChange={(e) => {
                setJob(e.target.value);
              }}
              className="text-sm font-custom rounded-lg p-3 w-full mt-2 mb-6 bg-white border border-gray-300 text-black"
            />
            <label className="text-sm font-custom text-[#3F4648] w-full">
              Birthday
            </label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="text-sm font-custom rounded-lg p-3 w-full mt-2 mb-6 bg-white border border-gray-300 text-black"
            />
            <label className="text-sm font-custom text-[#3F4648] w-full">
              ID Card Number
            </label>
            <input
              type="text"
              value={idCardNumber}
              onChange={(e) => setIdCardNumber(e.target.value)}
              className="text-sm font-custom rounded-lg p-3 w-full mt-2 mb-6 bg-white border border-gray-300 text-black"
            />
            <h2 className="text-2xl font-semibold font-custom mb-2">
              Company details
            </h2>
            <div className="font-custom flex flex-wrap gap-4 items-center justify-between w-full sm:w-5/6 md:w-5/6 lg:w-5/6 xl:w-3/4">
              {/* Branch dropdown */}
              <div className="flex flex-row items-center space-x-2 w-full sm:w-auto">
                <label className="text-sm text-[#3F4648] w-full">Branch</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 w-full sm:w-48"
                >
                  <option value="">Select branch</option>
                  {branches?.results?.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department dropdown */}
              <div className="flex flex-row items-center space-x-2 w-full sm:w-auto">
                <label className="text-sm text-[#3F4648] w-full">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 w-full sm:w-48"
                >
                  <option value="">Select department</option>
                  {departments?.results?.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Position dropdown */}
              <div className="flex flex-row items-center space-x-2 w-full sm:w-auto">
                <label className="text-sm text-[#3F4648] w-full">
                  Position
                </label>
                <select
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 w-full sm:w-48"
                >
                  <option value="">Select position</option>
                  {positions?.results?.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <label className="text-sm text-[#3F4648] w-full">
                Employment Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-sm font-custom rounded-lg p-3 w-full mt-2 mb-6 bg-white border border-gray-300 text-black"
              />
            </div>
            {!leaveLoading && leaveSettings && leaveSettings.length > 0 && (
              <DropdownSection
                title="Leave Policies"
                items={leaveSettings}
                selectedItems={leaveSubPolicies}
                toggleItem={(policy) => {
                  setLeaveSubPolicies((prev) =>
                    prev.includes(String(policy.id))
                      ? prev.filter((id) => id !== String(policy.id))
                      : [...prev, String(policy.id)]
                  );
                }}
                renderItem={(policy) => policy.name}
              />
            )}

            <DropdownSection
              title="Work Shift"
              items={workshift?.results?.results || []}
              selectedItems={selectedWorkShift}
              toggleItem={toggleWorkShift}
              renderItem={(shift) => shift.name}
            />

            <DropdownSection
              title="Group"
              items={allGroups}
              selectedItems={selectedGroup}
              toggleItem={toggleGroup}
              renderItem={(g) => g.name}
            />

            <DropdownSection
              title="Location"
              items={checkInOptions.map((opt) => opt.label)} // display YES / NO
              selectedItems={[
                checkInOptions.find((opt) => opt.value === selectedLocation)
                  ?.label,
              ]}
              toggleItem={(label) => {
                const selected = checkInOptions.find(
                  (opt) => opt.label === label
                );
                setSelectedLocation(selected?.value ?? false); // store boolean
              }}
              renderItem={(item) => item}
              dropdownWidth="w-44"
            />

            <DropdownSection
              title="Required Attendance"
              items={attendanceOptions.map((opt) => opt.label)} // display YES / NO
              selectedItems={[
                attendanceOptions.find(
                  (opt) => opt.value === requiredAttendance
                )?.label,
              ]}
              toggleItem={(label) => {
                const selected = attendanceOptions.find(
                  (opt) => opt.label === label
                );
                setRequiredAttendance(selected?.value ?? false); // store boolean
              }}
              renderItem={(item) => item}
              dropdownWidth="w-44"
            />
          </div>

          {/* Right container with text aligned left */}
          <div className="w-full md:w-[60%] p-6">
            <div className="text-md font-custom text-light-pearl w-full space-y-2">
              <h2 className="text-xl font-semibold font-custom text-[#0F3F62] mb-2">
                Payroll Info
              </h2>

              <label className="text-sm font-custom text-[#3F4648] w-full">
                NSSF ID
              </label>
              <input
                type="string"
                value={nssfId}
                onChange={(e) => setNssfId(e.target.value)}
                className="text-sm font-custom rounded-lg p-3 w-full mt-2 mb-6 bg-white border border-gray-300 text-black"
              />
              <label className="text-sm font-custom text-[#3F4648] w-full">
                Account Number
              </label>
              <input
                type="string"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="text-sm font-custom rounded-lg p-3 w-full mt-2 mb-6 bg-white border border-gray-300 text-black"
              />
              <label className="text-sm font-custom text-[#3F4648] w-full">
                Base Salary
              </label>
              <input
                type="string"
                value={baseSalary}
                onChange={(e) => setBaseSalary(e.target.value)}
                className="text-sm font-custom rounded-lg p-3 w-full mt-2 mb-6 bg-white border border-gray-300 text-black"
              />
              <label className="text-sm font-custom text-[#3F4648] w-full">
                Daily Rate
              </label>
              <input
                type="string"
                value={dailyRate}
                onChange={(e) => setDailyRate(e.target.value)}
                className="text-sm font-custom rounded-lg p-3 w-full mt-2 mb-6 bg-white border border-gray-300 text-black"
              />
              <label className="text-sm font-custom text-[#3F4648] w-full">
                Hourly Rate
              </label>
              <input
                type="string"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="text-sm font-custom rounded-lg p-3 w-full mt-2 mb-6 bg-white border border-gray-300 text-black"
              />
              <div className="flex flex-row items-center space-x-2 w-full sm:w-auto">
                <label className="text-sm text-[#3F4648] w-full">
                  Bank Provider
                </label>
                <select
                  value={bankProvider}
                  onChange={(e) => setBankProvider(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 w-full sm:w-48"
                >
                  <option value="">Select Bank Provider</option>
                  {bankProviders.map((bank) => (
                    <option key={bank.value} value={bank.value}>
                      {bank.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-row items-center space-x-2 w-full justify-between sm:w-auto">
                <label className="text-sm text-[#3F4648] w-full">
                  Currency Type
                </label>
                <select
                  value={currencyType}
                  onChange={(e) => setCurrencyType(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 w-full sm:w-48"
                >
                  <option value="">Select Currency Type</option>
                  <option value="USD">USD</option>
                  <option value="KHR">KHR</option>
                </select>
              </div>

              {/* Salary type dropdown */}
              <div className="flex flex-row items-center space-x-2 w-full justify-between sm:w-auto">
                <label className="text-sm text-[#3F4648] w-full">
                  Salary Type
                </label>
                <select
                  value={salaryType}
                  onChange={(e) => setSalaryType(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 w-full sm:w-48"
                >
                  <option value="">Select Salary Type</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
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
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center justify-between mt-8 bg-white shadow-md rounded-lg p-4">
                <div className="flex items-center">
                  <Banknote className="text-blue w-12 h-12 mr-6" />
                  <p className="font-custom text-md font-semibold">Cash</p>
                </div>
                <p className="text-dark-blue font-custom text-md font-semibold">
                  ${cashPercentage || "N/A"}
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
                    ${ibankingPercentage || "N/A"}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center ml-10">
                    <Percent className="text-blue w-8 h-8 mr-6" />
                    <div>
                      <p className="font-custom text-md font-semibold">Tax</p>
                      <p className="text-xs text-gray-500 font-custom">
                        {spoused ? "Married" : "Single"} / Children{" "}
                        <span className="text-blue">
                          {numberOfChildren || "0"}{" "}
                        </span>
                      </p>
                    </div>
                  </div>
                  <p className="text-red font-custom text-md font-semibold">
                    $7
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center ml-10">
                    <CreditCard className="text-blue w-8 h-8 mr-6" />
                    <div>
                      <p className="font-custom text-md font-semibold">NSSF</p>
                    </div>
                  </div>
                  <p className="text-red font-custom text-md font-semibold">
                    $7
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
                    ${baseSalary || "N/A"}
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
        {canManageUsers ? (
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="mt-4 bg-blue-400 text-white font-custom px-6 py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-70"
          >
            {isSaving ? (
              <FaSpinner className="animate-spin text-white text-lg" />
            ) : (
              "Save Changes"
            )}
          </Button>
        ) : (
          <div className="relative group">
            <Button
              disabled
              // Disable save if admin doesn't have manageUsers permission.
              className="mt-4 bg-blue-400 text-white font-custom px-6 py-2 rounded-lg opacity-60 cursor-not-allowed"
            >
              Save Changes
            </Button>
            <div className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white opacity-0 shadow-md transition group-hover:opacity-100">
              You have no permission
            </div>
          </div>
        )}
      </div>

      {/* Dialogs - Only render when needed */}
      {dialogStates.cash && (
        <UpdateCashDialog
          open={true}
          oldCash={cashPercentage}
          onOpenChange={() => closeDialog("cash")}
          onSubmit={(newCash) => {
            setCashPercentage(newCash);
            closeDialog("cash");
          }}
        />
      )}

      {dialogStates.bank && (
        <UpdateBankTransferDialog
          open={true}
          spouse={spoused}
          numberOfChildren={numberOfChildren}
          ibanking={ibankingPercentage}
          onOpenChange={() => closeDialog("bank")}
          onSubmit={(data) => {
            setIbankingPercentage(data.ibanking);
            setSpoused(data.spouse);
            setNumberOfChildren(data.children);
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
