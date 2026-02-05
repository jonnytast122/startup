"use client";

import {
  LayoutDashboard,
  CalendarClock,
  CalendarPlus2,
  LogOut,
  CreditCard,
  Settings,
  BookCheck,
  Lightbulb,
  User,
  Users,
  Info,
} from "lucide-react";
import { NavMain } from "./nav-main";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCompany } from "@/lib/api/company";
import { getMyDetails } from "@/lib/api/user";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/config/firebase";

const userFixedPermissions = [
  "createOrUpdateAttendance",
  "requestRemoteAttendance",
  "viewAttendance",
  "requestLeave",
  "viewLeaveBalance",
  "createOvertimeRequest",
  "updateOvertimeRequest",
  "deleteOvertimeRequest",
  "getOvertimeRequest",
  "getMyOvertimeSettings",
  "updateOvertimeRequestStatus",
  "unclaimingOvertimeRequest",
  "getCompanies",
  "getMyDetail",
  "getMyCalendars",
  "viewDashboard",
];

// This is sample data.
const data = {
  navMain: [
    {
      title: "Main",
      items: [
        {
          title: "Overview",
          url: "/admin/overview",
          icon: LayoutDashboard,
          alert: 0,
          permissions: ["viewDashboard"],
        },
      ],
    },
    {
      title: "Operation",
      items: [
        {
          title: "Attendance",
          url: "/admin/overview/attendence",
          icon: CalendarClock,
          alert: 0,
          permissions: ["viewAttendance"],
        },
        {
          title: "Overtime",
          url: "/admin/overview/overtime",
          icon: CalendarPlus2,
          alert: 0,
          permissions: ["getOvertimeRequest"],
        },
        {
          title: "Leaves",
          url: "/admin/overview/leaves",
          icon: LogOut,
          alert: 0,
          permissions: ["getLeaveRequests"],
        },
        {
          title: "Payroll",
          url: "/admin/overview/payroll",
          icon: CreditCard,
          alert: 0,
          permissions: ["viewPayroll"],
        },
      ],
    },
    {
      title: "Setting",
      items: [
        {
          title: "Company",
          url: "/admin/overview/company",
          icon: Settings,
          alert: 0,
          permissions: ["getCompanies"],
        },
        {
          title: "Policy",
          url: "/admin/overview/policy",
          icon: Lightbulb,
          alert: 0,
          permissions: ["getLeavePolicies", "getOvertimeSettings"],
        },
        {
          title: "Workshift",
          url: "/admin/overview/workshift",
          icon: BookCheck,
          alert: 0,
          permissions: ["getShifts", "getAllShifts"],
        },
        {
          title: "Users & Admin",
          url: "/admin/overview/users-admin",
          icon: User,
          alert: 0,
          permissions: ["getUsers", "manageUsers"],
        },
        {
          title: "Groups",
          url: "/admin/overview/groups",
          icon: Users,
          alert: 0,
          permissions: ["getGroups"],
        },
      ],
    },
    {
      title: "Support",
      items: [
        { title: "Help", url: "/admin/overview/help", icon: Info, alert: 0 },
      ],
    },
  ],
};

export function AppSidebar(props) {
  const [imageUrl, setImageUrl] = useState("");
  const { collapsed } = useSidebar();

  // Don't render footer if sidebar is collapsed
  if (collapsed) return null;

  const { data: company } = useQuery({
    queryKey: ["company"],
    queryFn: fetchCompany,
  });

  useQuery({
    queryKey: ["my-details"],
    queryFn: getMyDetails,
  });

  // useEffect(() => {
  //   if (company) {
  //     const imageRef = ref(storage, `uploads/${company.logo}`);

  //     getDownloadURL(imageRef)
  //       .then((url) => {
  //         setImageUrl(url);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching image:", error);
  //       });
  //   }
  // }, [company]);

  return (
    <Sidebar collapsible="icon" className="z-50 bg-white" {...props}>
      <SidebarHeader className="items-center bg-white">
        <img
          src={
            company?.logo ||
            "https://firebasestorage.googleapis.com/v0/b/anan-image.appspot.com/o/ANAN-text.png?alt=media&token=f696243c-b9fe-42a4-9292-09823548fedc"
          }
          defaultValue={
            "https://firebasestorage.googleapis.com/v0/b/anan-image.appspot.com/o/ANAN-text.png?alt=media&token=f696243c-b9fe-42a4-9292-09823548fedc"
          }
          alt="Logo"
          className="w-28 h-auto"
        />
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="bg-white">
        <Separator className="mb-2" />
        <span className="text-xs text-blue-600 text-center font-custom">
          Powered by ANAN
        </span>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
