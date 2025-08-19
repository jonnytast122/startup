"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
    User,
    Home,
    SquareKanban,
    Info,
} from "lucide-react";

const mainNavItems = [
    { title: "Home", url: "/user/attendance", icon: Home, alert: 2 },
    { title: "Report", url: "/user", icon: SquareKanban, alert: 0 },
    { title: "Profile", url: "/user/profile", icon: User, alert: 2 },
    { title: "Help", url: "/user/help", icon: Info, alert: 0 }
];

// Define home-related routes
const homeRoutes = [
    "/user/attendance",
    "/user/leaves",
    "/user/overtime", 
    "/user/payroll"
];

export function BottomNavigation() {
    const pathname = usePathname();
    const [showMore, setShowMore] = useState(false);
    const moreRef = useRef(null);

    // Close more menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (moreRef.current && !moreRef.current.contains(event.target)) {
                setShowMore(false);
            }
        }
        if (showMore) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showMore]);

    // Function to check if a nav item should be active
    const isNavItemActive = (item) => {
        if (item.title === "Home") {
            // For Home button, check if current path is any of the home routes
            return homeRoutes.includes(pathname);
        } else {
            // For other buttons, use exact match
            return pathname === item.url;
        }
    };

    return (
        <>
            {/* Bottom Navigation Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-2 py-1">
                <div className="flex justify-around items-center max-w-md mx-auto">
                    {/* Main Navigation Items */}
                    {mainNavItems.map((item) => {
                        const isActive = isNavItemActive(item);
                        const IconComponent = item.icon;

                        return (
                            <Link
                                key={item.title}
                                href={item.url}
                                className={`relative flex flex-col m-1 items-center justify-center px-2 py-2 rounded-lg min-w-0 flex-1 transition-colors ${isActive
                                    ? "bg-[#5494DA33] text-blue-600"
                                    : "text-gray-600 hover:text-blue-600 hover:bg-[#5494DA33]"
                                    }`}
                            >
                                <div className="relative">
                                    <IconComponent className="h-5 w-5 mb-1" />
                                    {item.alert > 0 && (
                                        <span className="absolute -top-1 -right-1 text-xs font-bold text-white bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                                            {item.alert}
                                        </span>
                                    )}
                                </div>
                                <span className="text-xs font-custom leading-none truncate max-w-full">
                                    {item.title}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </>
    );
}