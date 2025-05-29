// components/FaqsScreen.js
import { Button } from "antd";

const FaqsScreen = ({ goBack }) => {
    return (
        <div className="flex flex-col items-center justify-center w-full p-5 space-y-4 font-custom">
            <Button onClick={goBack} type="primary" className="mb-4">
                Back to Main Screen
            </Button>

            <h2 className="text-2xl font-custom">FAQs</h2>
            <p>Here are some frequently asked questions...</p>
        </div>
    );
};

export default FaqsScreen;
