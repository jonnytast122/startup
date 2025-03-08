import { Bell, Home, Settings, MessageCircle, User, LayoutDashboard, CreditCard } from "lucide-react";
import RequestButton from "./components/request-button";
import DailyButton from "./components/daily-button";

export default function OverviewPage() {
    return (
        <div className="space-y-2 scrollbar-hide">
            {/* Full-width box */}
            <div className="w-full bg-white rounded-lg">
                {/* Content of the first full-width box */}
                <div className="flex items-center space-x-3 p-5">
                    <LayoutDashboard className="m-2 ml-3" size={50} color="#5494da" />
                    <span className="text-2xl font-vietname-thin text-gray-800">Overview</span>
                </div>
            </div>

            {/* Full-width box */}
            <div className="w-full p-5 bg-white rounded-lg">
                {/* Content of the second full-width box */}
                <h2 className="text-lg font-vietname-thin text-gray-700 mb-4">Pending requests</h2>
                <div className="p-4 flex gap-4 overflow-x-auto scrollbar-hide">
                    {/* Ensure the sidebar takes up 240px, adjust if the sidebar width changes */}
                    <RequestButton icon={Home} text="Home" notificationCount={2} />
                    <RequestButton icon={MessageCircle} text="Messages" notificationCount={5} />
                    <RequestButton icon={Bell} text="Notifications" notificationCount={3} />
                    <RequestButton icon={User} text="Profile" notificationCount={2} />
                    <RequestButton icon={Settings} text="Settings" notificationCount={1} />

                </div>
            </div>

            {/* Split box */}
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-5 gap-4">
                {/* Left side (3 boxes vertically stacked) */}
                <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-4">
                    <div className="w-auto min-h-36 h-auto bg-white rounded-lg p-5">
                    <h2 className="text-lg font-vietname-thin text-gray-700 mb-4">Daily Overview</h2>
                        <div className="flex gap-4">
                            <DailyButton icon={Home} label="Early" number={25} change={5.2} />
                            <DailyButton icon={Settings} label="Late" number={12} change={-3.4} />
                            <DailyButton icon={Bell} label="On Time" number={18} change={2.1} />
                            <DailyButton icon={Home} label="Early" number={25} change={5.2} />

                        </div>

                    </div>
                    <div className="w-full h-24 bg-gray-500 rounded-lg">
                        <p className="p-4">Left Box 2</p>
                    </div>
                    <div className="w-full h-24 bg-gray-600 rounded-lg">
                        <p className="p-4">Left Box 3</p>
                    </div>
                </div>

                {/* Right side (long vertically, w-2/5) */}
                <div className="col-span-1 md:col-span-1 lg:col-span-2 h-full bg-gray-700 rounded-lg order-first md:order-none">
                    <p className="p-4 text-white">Right Long Box</p>
                </div>
            </div>

        </div>
    );
}
