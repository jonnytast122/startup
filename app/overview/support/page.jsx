"use client";

import { useState } from "react";
import { Card } from "antd";
import MainScreen from "./components/main";
import ChatbotScreen from "./components/chatbot";
import FaqsScreen from "./components/faqs";
import { Lightbulb } from "lucide-react";

export default function SupportPage() {
    const [showDetail, setShowDetail] = useState(null); // State to manage the current screen

    const navigateToDetail = (category) => {
        setShowDetail(category); // Update state to show the detail screen
    };

    const goBack = () => {
        setShowDetail(null); // Go back to the main screen
    };

    return (
        <div className="font-custom">
            <div className="bg-white rounded-xl mb-3 shadow-md py-6 px-6">
                <div className="flex items-center space-x-3 p-5">
                    <Lightbulb className="text-[#2998FF]" width={40} height={40} />
                    <span className="font-custom text-3xl text-black">Support</span>
                </div>
            </div>
            {!showDetail ? (
                <MainScreen navigateToDetail={navigateToDetail} />
            ) : showDetail === "chatbot" ? (
                <ChatbotScreen goBack={goBack} />
            ) : showDetail === "faqs" ? (
                <FaqsScreen goBack={goBack} />
            ) : null}
        </div>
    );
}
