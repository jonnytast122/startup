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
import DeleteDialog from "./components/deletedialog";
import LeaveDetailDialog from "./components/leavedetaildialog";
import AddOTDialog from "./components/otdetaildialog";
import WorkShiftDialog from "./components/shiftdialog";
import BranchDetail from "./components/branchdetail";
import AddUserDialog from "./components/groupsettingdialog";

import { useQuery } from "@tanstack/react-query";
import { getMyDetails } from "@/lib/api/user";

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
	const { data: user_data } = useQuery({
		queryKey: ["my-details"],
		queryFn: getMyDetails,
	});

	console.log("my d: ", user_data);
	const [firstname] = useState(user.firstname);
	const [lastname] = useState(user.lastname);
	const [mobile] = useState(user.phone);
	const [birthday] = useState(user.birthday);
	const [branch] = useState(user.branch);
	const [department] = useState(user.department);
	const [title] = useState(user.title);
	const [employmentstartdate] = useState(user.dateadded);
	const [cash, setCash] = useState(user.cash);

	const profile = user.profile;
	const accountnumber = user.banknumber;
	const AccessLevel = user.accessLevel;
	const banktransfer = user.banktransfer;
	const single = user.single;
	const nochildren = user.nochildren;

	const maritalStatus = user_data?.isMarried ? "Married" : "Single";
	const childrenCount = `${user_data?.numberOfChildren || 0}`;

	const subtotal = banktransfer - (single + nochildren);
	const netsalary = cash + subtotal;

	const firstInitial = firstname.charAt(0).toUpperCase();
	const lastInitial = lastname.charAt(0).toUpperCase();

	const [imageError, setImageError] = useState(false);
	const [isLeaveDetailOpen, setIsLeaveDetailOpen] = useState(false);
	const [isOTDetailOpen, setIsOTDetailOpen] = useState(false);
	const [isShiftDialogOpen, setIsShiftDialogOpen] = useState(false);
	const [isBranchDetailOpen, setIsBranchDetailOpen] = useState(false);
	const [isAddUserOpen, setIsAddUserOpen] = useState(false);

	const [dialogStates, setDialogStates] = useState({
		cash: false,
		bank: false,
		delete: false,
		deleteContext: null,
	});

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

	const [selectedPolicies, setSelectedPolicies] = useState(["Leaves", "OT"]);
	const [selectedWorkShift, setSelectedWorkShift] = useState([
		"Morning",
		"Afternoon",
	]);
	const [selectedGroup, setSelectedGroup] = useState(["Admin", "HR Manager"]);
	const [selectedLocation, setSelectedLocation] = useState([
		"Geo Fence",
		"Flexible",
		"GPS",
	]);

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

	const handleArchive = useCallback(() => {
		console.log("Archive clicked");
	}, []);

	const DropdownSection = ({ title, items, onItemClick }) => (
		<>
			<h2 className="text-2xl font-semibold font-custom mb-2 mt-6">{title}</h2>
			<div className="flex flex-wrap gap-2">
				{items.map((item, index) => (
					<button
						key={index}
						type="button"
						onClick={() => onItemClick?.(item)}
						className="bg-blue-100 rounded-xl border border-blue-200 p-3 shadow-sm w-auto max-w-full
                 text-sm font-custom text-blue-700"
					>
						{item}
					</button>
				))}
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

	return (
		<>
			<div className="hidden lg:block bg-white rounded-xl shadow-md py-6 px-6 mb-1">
				<div className="flex items-center space-x-3 p-5">
					<User className="text-[#2998FF]" width={40} height={40} />
					<span className="font-custom text-3xl text-black">Profile</span>
				</div>
			</div>

			<div className="bg-gray-100 rounded-xl mb-3 shadow-md py-6 sm:px-6 md:px-6 lg:px-16">
				<div className="font-custom text-xl font-semibold px-6 text-[#3E435D]">
					Hello, {user_data?.employee?.name}!
				</div>
				{/* Profile Holder */}
				<div className="bg-white rounded-2xl p-4 shadow-sm mt-6 flex items-center space-x-4 px-6">
					{user_data?.profileImg ? (
						<img
							src={user_data.profileImg}
							alt="Profile"
							className="w-12 h-12 rounded-full border-2 border-gray-200 object-cover"
						/>
					) : (
						<div className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-gray-200 bg-gray-300 text-gray-700 font-semibold text-lg">
							{user_data?.employee?.name
								?.split(" ")
								.map((n) => n[0])
								.join("")
								.toUpperCase()}
						</div>
					)}

					<div className="font-custom text-left">
						<div className="font-semibold text-lg text-gray-900">
							{user_data?.employee?.name}
						</div>
						<div className="text-sm text-gray-500">
							{user_data?.job || "No Job Title"}
						</div>
					</div>
				</div>

				{/* Two-column layout */}
				<div className="mt-4 flex flex-col md:flex-row gap-4">
					{/* Left */}
					<div className="w-full md:w-[40%] bg-white rounded-2xl p-6 shadow-sm">
						<h2 className="text-2xl font-semibold font-custom mb-2">
							Personal details
						</h2>

						<label className="text-sm font-custom text-[#3F4648] w-full">
							First Name
						</label>
						<input
							type="text"
							value={user_data?.employee?.name.split(" ")[0]}
							disabled
							className="text-sm font-custom rounded-lg p-3 w-full mt-2 mb-6 bg-gray-100 border border-gray-300 text-black"
						/>

						<label className="text-sm font-custom text-[#3F4648] w-full">
							Last Name
						</label>
						<input
							type="text"
							value={user_data?.employee?.name.split(" ")[1]}
							disabled
							className="text-sm font-custom rounded-lg p-3 w-full mt-2 mb-6 bg-gray-100 border border-gray-300 text-black"
						/>

						<label className="text-sm font-custom text-[#3F4648] w-full">
							Mobile Phone
						</label>
						<input
							type="text"
							value={user_data?.employee?.phoneNumber || "N/A"}
							disabled
							className="text-sm font-custom rounded-lg p-3 w-full mt-2 mb-6 bg-gray-100 border border-gray-300 text-black"
						/>

						<label className="text-sm font-custom text-[#3F4648] w-full">
							Birthday
						</label>
						<input
							type="date"
							value={
								user_data?.dateOfBirth
									? new Date(user_data?.dateOfBirth).toISOString().split("T")[0]
									: ""
							}
							disabled
							className="text-sm font-custom rounded-lg p-3 w-full mt-2 mb-6 bg-gray-100 border border-gray-300 text-black"
						/>

						<h2 className="text-2xl font-semibold font-custom mb-2">
							Company details
						</h2>

						<label className="text-sm font-custom text-[#3F4648] w-full">
							Branch
						</label>
						<input
							type="text"
							value={user_data?.branch?.name || "N/A"}
							disabled
							className="text-sm font-custom rounded-lg p-3 w-full mt-2 mb-6 bg-gray-100 border border-gray-300 text-black"
						/>

						<label className="text-sm font-custom text-[#3F4648] w-full">
							Department
						</label>
						<input
							type="text"
							value={user_data?.department?.name || "N/A"}
							disabled
							className="text-sm font-custom rounded-lg p-3 w-full mt-2 mb-6 bg-gray-100 border border-gray-300 text-black"
						/>

						<label className="text-sm font-custom text-[#3F4648] w-full">
							Position
						</label>
						<input
							type="text"
							value={user_data?.position?.title || "N/A"}
							disabled
							className="text-sm font-custom rounded-lg p-3 w-full mt-2 mb-6 bg-gray-100 border border-gray-300 text-black"
						/>

						<label className="text-sm font-custom text-[#3F4648] w-full">
							Employment Start Date
						</label>
						<input
							type="date"
							value={
								user_data?.startDate
									? new Date(user_data?.startDate).toISOString().split("T")[0]
									: ""
							}
							disabled
							className="text-sm font-custom rounded-lg p-3 w-full mt-2 mb-6 bg-gray-100 border border-gray-300 text-black"
						/>

						<DropdownSection
							title="Leave Policies"
							items={
								user_data?.leavePolicies?.length
									? user_data.leavePolicies.map((p) => p.name)
									: ["N/A"]
							}
							onItemClick={() => setIsLeaveDetailOpen(true)}
						/>

						<DropdownSection
							title="Shift Type"
							items={
								user_data?.shiftType?.name
									? [user_data.shiftType.name]
									: ["N/A"]
							}
							onItemClick={() => setIsShiftDialogOpen(true)}
						/>

						<DropdownSection
							title="Groups"
							items={
								user_data?.groups?.length
									? user_data.groups.map((g) => g.name)
									: ["N/A"]
							}
							onItemClick={() => setIsAddUserOpen(true)}
						/>

						<DropdownSection
							title="Location"
							items={[
								<span key="location">
									{user_data?.allowedRemoteCheckIn ? "Flexible" : "Geofencing"}
								</span>,
							]}
						/>
					</div>

					{/* Right */}
					<div className="w-full md:w-[60%] p-6">
						<div className="text-md font-custom text-light-pearl w-full space-y-2">
							<h2 className="text-xl font-semibold font-custom text-[#0F3F62] mb-2">
								Payroll Info
							</h2>
							<InfoRow
								label="Employee Name"
								value={user_data?.employee?.name}
							/>
							{/* <InfoRow label="Employee ID" value="#1234565" /> */}
							<InfoRow
								label="Bank Name"
								value={
									user_data?.employee?.finance?.bankDetails?.bankProvider ||
									"N/A"
								}
							/>
							<InfoRow
								label="Account Number"
								value={
									user_data?.employee?.finance?.bankDetails?.accountNumber ||
									"N/A"
								}
							/>
						</div>

						{/* Cash Section */}
						<div className="relative">
							{/* <div className="absolute -top-8 right-0 z-10">
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
							</div> */}

							<div className="flex items-center justify-between mt-8 bg-white shadow-md rounded-lg p-4">
								<div className="flex items-center">
									<Banknote className="text-blue w-12 h-12 mr-6" />
									<p className="font-custom text-md font-semibold">Cash</p>
								</div>
								<p className="text-dark-blue font-custom text-md font-semibold">
									$
									{user_data?.employee?.finance?.paymentMethod
										?.cashPercentage || "N/A"}
								</p>
							</div>
						</div>

						{/* Bank Transfer Section */}
						<div className="relative">
							{/* <div className="absolute -top-8 right-0 z-10">
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
							</div> */}

							<div className="mt-8 bg-white shadow-md rounded-lg p-4 flex flex-col gap-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center">
										<Landmark className="text-blue w-10 h-10 mr-6" />
										<p className="font-custom text-md font-semibold">
											Bank Transfer
										</p>
									</div>
									<p className="text-dark-blue font-custom text-md font-semibold">
										$
										{user_data?.employee?.finance?.paymentMethod
											?.ibankingPercentage || "N/A"}
									</p>
								</div>

								<div className="flex items-center justify-between">
									<div className="flex items-center ml-10">
										<Percent className="text-blue w-8 h-8 mr-6" />
										<div>
											<p className="font-custom text-md font-semibold">Tax</p>
											<p className="text-xs text-gray-500 font-custom">
												{maritalStatus} / Children{" "}
												<span className="text-blue">{childrenCount} </span>
											</p>
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
											<p className="font-custom text-md font-semibold">NSSF</p>
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
											Estimated{" "}
											<span className="text-blue-600">
												{new Date().toLocaleString("en-US", { month: "long" })}
											</span>
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
												{/* <Trash2
													className="w-5 h-5 text-red-500 hover:text-red-700 cursor-pointer"
													onClick={() => handleDelete(idx)}
												/> */}
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* ✅ Save button REMOVED */}

			{/* Dialogs */}
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
						console.log("Updated bank transfer data:", data);
						closeDialog("bank");
					}}
				/>
			)}
			{dialogStates.delete && (
				<DeleteDialog
					open={dialogStates.delete}
					setOpen={(isOpen) => !isOpen && closeDialog("delete")}
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
			{isLeaveDetailOpen && (
				<LeaveDetailDialog
					open={isLeaveDetailOpen}
					onOpenChange={setIsLeaveDetailOpen}
					profileData={{
						policyName: "Annual Leave",
						leaveType: "paid",
						leaveMonth: "July",
						leaveDay: 10,
						durationType: "year",
						timeOffValue: "3",
						timeOffUnit: "days",
					}}
				/>
			)}
			{isOTDetailOpen && (
				<AddOTDialog
					open={isOTDetailOpen}
					onOpenChange={setIsOTDetailOpen}
					profileData={{
						otTitle: "Weekend OT",
						otType: "holiday",
						users: [
							{ id: 1, name: "Doe Ibrahim" },
							{ id: 2, name: "Lucy Trevo" },
						],
						allDay: false,
						date: "2025-08-24",
						startTime: "09:00",
						endTime: "14:00",
						note: "Handled weekend workload",
					}}
				/>
			)}
			{isShiftDialogOpen && (
				<WorkShiftDialog
					open={isShiftDialogOpen}
					onOpenChange={setIsShiftDialogOpen}
					profileData={{
						name: "Morning Shift",
						shiftDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
						reminderDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
						startTime: "08:00",
						endTime: "16:00",
						breakStart: "12:00",
						breakEnd: "13:00",
						clockInReminder: "07:45",
						clockOutReminder: "15:45",
						activeReminder: true,
					}}
				/>
			)}

			{isBranchDetailOpen && (
				<BranchDetail
					open={isBranchDetailOpen}
					onOpenChange={setIsBranchDetailOpen}
					branchData={{
						branch,
						siteAddress: "Phnom Penh, Cambodia",
						fenceSize: 300,
						coords: { lat: 11.56786, lng: 104.89005 },
					}}
				/>
			)}
			<AddUserDialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen} />
		</>
	);
}
