"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
    Calendar1,
    User,
    CalendarClock,
    CalendarPlus2,
    LogOut,
    CreditCard,
    Info,
    MoreHorizontal,
    X,
} from "lucide-react";

const mainNavItems = [
    { title: "Attendance", url: "/user/attendance", icon: CalendarClock, alert: 2 },
    { title: "Calendar", url: "/user", icon: Calendar1, alert: 0 },
    { title: "Profile", url: "/user/profile", icon: User, alert: 2 },
];

const moreItems = [
    { title: "Overtime", url: "/user/overtime", icon: CalendarPlus2, alert: 0 },
    { title: "Leaves", url: "/user/leaves", icon: LogOut, alert: 2 },
    { title: "Payroll", url: "/user/payroll", icon: CreditCard, alert: 0 },
    { title: "Help", url: "/user/help", icon: Info, alert: 0 },
];

export function BottomNavigation() {
    const pathname = usePathname();
    const [showMore, setShowMore] = useState(false);
    const moreRef = useRef(null);

    const isMoreActive = moreItems.some((item) => pathname === item.url);

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

    return (
        <>
            {/* Overlay */}
            {showMore && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-40"
                    onClick={() => setShowMore(false)}
                />
            )}

            {/* More Items Modal */}
            {showMore && (
                <div
                    className="fixed bottom-20 left-4 right-4 z-50 bg-white rounded-2xl border border-gray-200 shadow-xl max-w-md mx-auto"
                    // stop events so overlay onClick doesn’t fire
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                        <h3 className="font-custom font-semibold text-gray-900">More Options</h3>
                        <button
                            type="button"
                            onClick={() => setShowMore(false)}
                            className="p-1 hover:bg-gray-100 rounded-full"
                        >
                            <X className="h-5 w-5 text-gray-500" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 p-4" ref={moreRef}>
                        {moreItems.map((item) => {
                            const isActive = pathname === item.url;
                            const IconComponent = item.icon;

                            return (
                                <Link
                                    key={item.title}
                                    href={item.url}
                                    prefetch={false}
                                    onClick={() => setShowMore(false)}
                                    className={`relative flex flex-col items-center justify-center p-4 rounded-xl transition-colors ${isActive
                                        ? "bg-[#5494DA33] text-blue-600"
                                        : "text-gray-600 hover:text-blue-600 hover:bg-[#5494DA33]"
                                        }`}
                                >
                                    <div className="relative mb-2">
                                        <IconComponent className="h-6 w-6" />
                                        {item.alert > 0 && (
                                            <span className="absolute -top-1 -right-1 text-xs font-bold text-white bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                                                {item.alert}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-sm font-custom text-center">
                                        {item.title}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Bottom Navigation Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-2 py-1">
                <div className="flex justify-around items-center max-w-md mx-auto">
                    {/* Main Navigation Items */}
                    {mainNavItems.map((item) => {
                        const isActive = pathname === item.url;
                        const IconComponent = item.icon;

                        return (
                            <Link
                                key={item.title}
                                href={item.url}
                                className={`relative flex flex-col items-center justify-center px-2 py-2 rounded-lg min-w-0 flex-1 transition-colors ${isActive
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

                    {/* More Button */}
                    <button
                        type="button"
                        onClick={() => setShowMore((v) => !v)}
                        className={`relative flex flex-col items-center justify-center px-2 py-2 rounded-lg min-w-0 flex-1 transition-colors ${isMoreActive || showMore
                            ? "bg-[#5494DA33] text-blue-600"
                            : "text-gray-600 hover:text-blue-600 hover:bg-[#5494DA33]"
                            }`}
                    >
                        <div className="relative">
                            <MoreHorizontal className="h-5 w-5 mb-1" />
                            {moreItems.some((item) => item.alert > 0) && (
                                <span className="absolute -top-1 -right-1 text-xs font-bold text-white bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                                    {moreItems.reduce((sum, item) => sum + item.alert, 0)}
                                </span>
                            )}
                        </div>
                        <span className="text-xs font-custom leading-none truncate max-w-full">
                            More
                        </span>
                    </button>
                </div>
            </div>
        </>
    );
}
