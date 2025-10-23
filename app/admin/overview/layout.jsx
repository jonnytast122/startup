"use client";

import { useState, useEffect, useRef } from "react";
import { AppSidebar } from "./components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { Bell, ChevronDown, Globe, User, LogOut } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import ReactQueryProvider from "./../../react-query-provider";
import { useQuery } from "@tanstack/react-query";
import { getMyDetails } from "@/lib/api/user";

export default function Layout({ children }) {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef(null);
	const { user, logout } = useAuth();
	const router = useRouter();
	const [lang, setLang] = useState("en");

	const flags = {
		en: "🇬🇧",
		kh: "🇰🇭",
	};

	const { data: user_data } = useQuery({
		queryKey: ["my-details"],
		queryFn: getMyDetails,
	});

	console.log("my de: ", user_data);

	const handleLogout = () => {
		logout();
		router.push("/signin");
	};

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsDropdownOpen(false);
			}
		}
		if (isDropdownOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [isDropdownOpen]);

	return (
		<ReactQueryProvider>
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset className="flex flex-col h-screen overflow-hidden">
					{/* Sticky Header */}
					<header className="sticky top-0 z-50 flex h-16 items-center justify-between px-4 border-b bg-white">
						{/* Left section */}
						<div className="flex items-center gap-3">
							<SidebarTrigger />
							<Separator orientation="vertical" className="h-6" />
							<form className="relative">
								<input
									type="text"
									placeholder="Search anything..."
									className="text-sm border rounded-lg focus:outline-none focus:ring-1 font-custom focus:ring-blue-500 pr-12 py-2 px-3"
								/>
							</form>
						</div>

						{/* Right section */}
						<div className="flex items-center gap-2">
							{/* Notifications */}
							{/* <button
                className="relative p-2 rounded-full hover:bg-gray-100"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
              </button> */}

							<Separator orientation="vertical" className="h-6" />

							{/* User Dropdown */}
							<div className="relative" ref={dropdownRef}>
								<div
									onClick={() => setIsDropdownOpen(!isDropdownOpen)}
									className="flex items-center gap-2 cursor-pointer select-none px-2 py-1 rounded-md hover:bg-gray-100"
									aria-haspopup="true"
									aria-expanded={isDropdownOpen}
									role="button"
									tabIndex={0}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											e.preventDefault();
											setIsDropdownOpen(!isDropdownOpen);
										}
										if (e.key === "Escape") {
											setIsDropdownOpen(false);
										}
									}}
								>
									{user_data?.profileImg ? (
										<img
											src={user_data.profileImg}
											alt="Profile"
											className="w-9 h-9 rounded-full border-2 border-gray-200 object-cover"
										/>
									) : (
										<div className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-gray-200 bg-gray-300 text-gray-700 font-semibold text-lg">
											{user_data?.employee?.name
												?.split(" ")
												.map((n) => n[0])
												.join("")
												.toUpperCase()}
										</div>
									)}
									<span className="text-sm font-custom font-medium text-blue-400 hidden sm:inline">
										{user?.name || "User"}
									</span>
									<ChevronDown className="h-4 w-4 text-gray-600 hidden sm:inline" />
								</div>

								{isDropdownOpen && (
									<div
										className="absolute right-0 z-50 mt-2 w-64 rounded-xl border bg-white py-2 shadow-lg"
										role="menu"
										aria-label="User menu"
									>
										{/* Profile Summary */}
										<div className="mx-3 flex items-center gap-3 px-2 py-2 rounded-xl bg-blue-100">
											{user_data?.profileImg ? (
												<img
													src={user_data.profileImg}
													alt="Profile"
													className="w-9 h-9 rounded-full border-2 border-gray-200 object-cover"
												/>
											) : (
												<div className="w-9 h-9 flex items-center justify-center rounded-full border-2 border-gray-200 bg-gray-300 text-gray-700 font-semibold text-lg">
													{user_data?.employee?.name
														?.split(" ")
														.map((n) => n[0])
														.join("")
														.toUpperCase()}
												</div>
											)}
											<div>
												<div className="font-custom text-md font-medium">
													{user?.name || "User"}
												</div>
												<div className="font-custom text-xs font-medium text-gray-500">
													{user?.role || "Role"}
												</div>
											</div>
										</div>
										<div className="border-b my-2"></div>

										{/* Actions */}
										<button
											className="w-full px-4 py-2 font-custom text-sm text-left text-gray-700 hover:bg-gray-100"
											onClick={() => {
												setIsDropdownOpen(false);
												router.push("/user");
											}}
											role="menuitem"
										>
											<User className="inline-block mr-2 h-4 w-4" />
											Switch to user's view
										</button>
										<button
											className="w-full px-4 py-2 font-custom text-sm text-left text-red-600 hover:bg-gray-100"
											onClick={handleLogout}
											role="menuitem"
										>
											<LogOut className="inline-block mr-2 h-4 w-4" />
											Sign Out
										</button>
									</div>
								)}
							</div>

							{/* Language Selector */}

							<Select value={lang} onValueChange={setLang}>
								<SelectTrigger className="w-[95px] font-custom border-none shadow-none focus:ring-0 focus:outline-none flex items-center justify-between gap-2">
									<div className="flex items-center gap-1">
										<SelectValue placeholder="EN" />
									</div>
								</SelectTrigger>

								<SelectContent className="font-custom">
									<SelectItem value="en">
										<div className="flex items-center justify-between w-full">
											<span className="mr-2">EN</span>
											<span>🇬🇧</span>
										</div>
									</SelectItem>
									<SelectItem value="kh">
										<div className="flex items-center justify-between w-full">
											<span className="mr-2">KH</span>
											<span>🇰🇭</span>
										</div>
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</header>

					{/* Scrollable content */}
					<div className="flex-1 overflow-y-auto p-4 bg-gray-100">
						{children}
					</div>
				</SidebarInset>
			</SidebarProvider>
		</ReactQueryProvider>
	);
}
