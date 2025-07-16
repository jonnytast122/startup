import { useState } from "react";
import { ArrowUpDown, Building2 } from "lucide-react";

export default function NotificationPage() {
    const [sortOrder, setSortOrder] = useState("asc");

    // Sample notification data
    const data = [
        { id: 1, profile: "/profile1.jpg", name: "Alice Johnson", date: "2025-03-25", time: "10:30", value: -10 },
        { id: 2, profile: "/profile2.jpg", name: "Bob Smith", date: "2025-03-24", time: "14:45", value: -50 },
        { id: 3, profile: "/profile3.jpg", name: "Charlie Doe", date: "2025-03-23", time: "18:15", value: -30 },
        { id: 4, profile: "/profile4.jpg", name: "David Brown", date: "2025-03-22", time: "09:00", value: -20 },
        { id: 5, profile: "taxes", name: "Taxes", date: "2025-03-21", time: "12:00", value: -100 }, // Taxes entry
    ];

    // Sort data based on value (low to high by default)
    const sortedData = [...data].sort((a, b) => (sortOrder === "asc" ? a.value - b.value : b.value - a.value));

    return (
        <div className="bg-white font-custom">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl">Notifications</h2>
                <button onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                    <ArrowUpDown className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            {/* Recent Label */}
            <p className="text-sm text-gray-400 mt-1">Recent</p>

            {/* Notification List */}
            <div className="mt-3 ">
                {sortedData.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3">
                        {/* Profile Section */}
                        {item.profile === "taxes" ? (
                            <div className="w-10 h-10 flex items-center justify-center bg-blue-50 rounded-full">
                                <Building2 className="w-5 h-5 text-blue-600" />
                            </div>
                        ) : (
                            <img src={item.profile} alt={item.name} className="w-10 h-10 rounded-full" />
                        )}

                        {/* Name & Date */}
                        <div className="flex-1 ml-3">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.date}, {item.time}</p>
                        </div>

                        {/* Value */}
                        <p className={`font-semibold ${item.value < 0 ? "" : ""}`}>
                            {item.value < 0 ? `-$${Math.abs(item.value)}` : `$${item.value}`}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
