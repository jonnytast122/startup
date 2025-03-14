// components/MainScreen.js
import { Button } from "antd";
import { Search, BotMessageSquareIcon, HelpCircle } from "lucide-react";
import { Card } from "@/components/ui/card"

const MainScreen = ({ navigateToDetail }) => {
    return (
        <div className="flex flex-col items-center text-center justify-center w-full p-5 space-y-4 bg-white rounded-lg font-custom">
            <span className="text-2xl font-custom font-semibold w-full">
                Welcome to Anan Support
            </span>

            {/* Search Input */}
            <div className="flex justify-center w-full mt-5 max-w-md mx-auto">
                <form className="relative w-full">
                    {/* Search Icon on the left */}
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <Search className="w-4 h-4" />
                    </div>

                    {/* Input Field */}
                    <input
                        type="text"
                        placeholder="How can we help you?"
                        className="font-custom text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 pl-10 pr-12 py-1.5 w-full"
                    />
                </form>

                {/* Search Button */}
                <Button type="primary" className="ml-2">
                    Search
                </Button>
            </div>

            {/* Support Image */}
            <img
                src="/images/support.png"
                alt="Support"
                className="mt-4 mb-4 h-auto max-w-full object-contain"
                style={{ maxHeight: '350px' }}
            />

            <span className="text-xl font-custom mt-16 text-light-gray">Choose a category to find help you need</span>

            {/* Buttons for Chatbot and FAQs */}
            <div className="flex justify-evenly space-x-4 mt-4 w-full">
                {/* Chatbot Card */}
                <Card
                    onClick={() => navigateToDetail("chatbot")}
                    className="flex flex-col items-center justify-center px-20 py-6 bg-white text-black rounded-xl shadow-md cursor-pointer"
                >
                    <BotMessageSquareIcon className="text-black mb-8" size={75} />
                    <span className="text-blue-600 font-medium font-custom text-lg">Chatbot</span>
                </Card>

                {/* FAQs Card */}
                <Card
                    onClick={() => navigateToDetail("faqs")}
                    className="flex flex-col items-center justify-center px-20 py-6 bg-white text-black rounded-xl shadow-md cursor-pointer"
                >
                    <HelpCircle className="text-black mb-8" size={75} />
                    <span className="text-blue-600 font-medium font-custom text-lg">FAQs</span>
                </Card>
            </div>
        </div>
    );
};

export default MainScreen;
