import { Button } from "@/components/ui/button";

const ChatbotScreen = ({ goBack }) => {
    return (
        <div className="flex w-full bg-white rounded-lg" style={{ height: "calc(100vh - 13.5rem)" }}>
            {/* Left side: Blue section */}
            <div className="w-1/5 bg-blue-500 p-4 flex flex-col top-0 items-start justify-start rounded-l-xl">
                {/* Back Button on the top left */}
                <Button
                    onClick={goBack}
                    type="primary"
                    className="mb-4 text-white bg-blue-500 hover:bg-blue-500 w-full shadow-none"
                >
                    Back to Main Screen
                </Button>
                
                {/* Storage or Chat history section */}
                <div className="mt-4 text-white">
                    <h2 className="text-lg font-custom">Chat History</h2>
                    <p>Here is where you can see previous conversations.</p>
                    {/* You can add chat history here */}
                </div>
            </div>

            {/* Right side: Chatbot chat section */}
            <div className="w-4/5 p-6">
                {/* Chatbot Interface */}
                <h2 className="text-2xl font-custom mb-4">Chatbot Help</h2>
                <div className="chat-container">
                    {/* Placeholder for Chatbot messages */}
                    <p>Chatbot messages will appear here...</p>
                    {/* You can add the chatbot functionality below */}
                </div>
            </div>
        </div>
    );
};

export default ChatbotScreen;
