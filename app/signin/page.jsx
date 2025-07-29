"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState, useEffect } from "react"; // Explicitly import React
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css"; // Styles for PhoneInput
import { ArrowLeft } from "lucide-react"; // Import back icon
import { useRouter } from "next/navigation"; // Import useRouter

export default function LoginPage() {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-4xl">
                <LoginForm />
            </div>
        </div>
    );
}

function LoginForm({ className, ...props }) {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [selectedCountry, setSelectedCountry] = useState("");
    const [showOtpScreen, setShowOtpScreen] = useState(false);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [timeLeft, setTimeLeft] = useState(120);
    const router = useRouter(); // Initialize the router

    // Handle form submission to prevent refresh
    const handleSubmit = (event) => {
        event.preventDefault();
        setShowOtpScreen(true);
    };

    // Handle OTP input change
    const handleOtpChange = (e, index) => {
        const value = e.target.value;
        if (value.length <= 1 && !isNaN(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
        }
    };

    // Navigate to the overview page on Verify click
    const handleVerify = (event) => {
        event.preventDefault();
        router.push("/overview"); // Redirect to the /overview route
    };

    useEffect(() => {
        if (timeLeft === 0) return;
        const intervalId = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(intervalId);
    }, [timeLeft]);

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden shadow-lg shadow-gray-300 rounded-[30px]">
                <CardContent className="grid p-0 md:grid-cols-[3fr,2.1fr] min-h-[400px] md:min-h-[600px]">
                    {showOtpScreen ? (
                        // OTP Verification Screen
                        <form className="p-6 md:p-16 flex flex-col justify-center items-center" onSubmit={handleVerify}>
                            <div className="flex flex-col gap-6 items-center">
                                {/* Back Button */}
                                <button
                                    type="button"
                                    className="self-start flex items-start text-gray-600"
                                    onClick={() => setShowOtpScreen(false)}
                                >
                                    <ArrowLeft className="w-5 h-5 mr-2" /> Back
                                </button>

                                {/* OTP Verification Title */}
                                <h1 className="font-vietname text-lg font-medium text-dark-gray mt-5 text-center">
                                    OTP Verification
                                </h1>

                                {/* OTP Instructions */}
                                <h1 className="font-vietname-thin text-xs font-medium text-dark-gray mt-5 text-gray-500 text-center">
                                    Enter the OTP sent to <span className="text-blue-500">+855 123 456</span>
                                </h1>

                                {/* OTP Input */}
                                <div className="flex gap-2 justify-center mt-4">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            value={digit}
                                            onChange={(e) => handleOtpChange(e, index)}
                                            maxLength="1"
                                            className="w-12 h-12 text-center text-2xl border-b-2 border-gray-300 focus:outline-none text-blue"
                                        />
                                    ))}
                                </div>

                                {/* OTP Expiration Text */}
                                <p className="text-xs text-gray-500 mt-3 text-center">
                                    Code expires in{" "}
                                    <span className="text-black font-bold">
                                        {`${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}`}
                                    </span>
                                </p>

                                {/* Verify Button */}
                                <Button type="submit" className="w-full sm:w-56 rounded-full font-vietname text-base mt-5">
                                    Verify
                                </Button>

                                {/* Resend OTP */}
                                <p className="text-xs text-center text-gray-500 mt-2">
                                    Don't receive the OTP?{" "}
                                    <button
                                        type="button"
                                        className="text-blue-500"
                                    >
                                        Resend
                                    </button>
                                </p>
                            </div>
                        </form>

                    ) : (
                        // Login Screen
                        <form className="p-6 md:p-16 flex flex-col justify-center items-center" onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-6 items-center">
                                <h1 className="font-vietname text-2xl font-medium text-black mt-5 text-center">
                                    Welcome back!
                                </h1>
                                <h1 className="font-vietname text-base font-medium text-black mt-1 text-center">
                                    Log in to your company app
                                </h1>
                                <p className="font-vietname-thin text-sm text-center font-medium text-dark-gray mt-2 text-gray-500">
                                    We will send you a code to verify your number
                                </p>

                                {/* Phone Number Input */}
                                <div className="flex items-center border-2 border-gray-300 rounded-xl px-6 py-2 w-full sm:w-3/4">
                                    <PhoneInput
                                        international
                                        defaultCountry={selectedCountry}
                                        value={phoneNumber}
                                        onChange={setPhoneNumber}
                                        className="w-full px-2 py-1 text-base text-gray-700 focus:outline-none"
                                        placeholder="Mobile Phone"
                                    />
                                </div>

                                {/* Get OTP Button */}
                                <Button
                                    type="submit"
                                    className="w-full sm:w-56 rounded-full font-vietname text-base"
                                    disabled={!phoneNumber}
                                >
                                    Get OTP
                                </Button>

                                <div className="text-center text-sm font-vietname-thin text-light-gray mt-4">
                                    Don't have an account?{" "}
                                    <a href="/signup" className="text-blue">
                                        Create one now
                                    </a>
                                </div>
                            </div>
                        </form>

                    )}

                    {/* Logo */}
                    <div className="hidden md:flex items-center justify-center bg-blue-100">
                        <img src="/images/logo.png" alt="Logo" className="w-60 h-60 object-contain" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
