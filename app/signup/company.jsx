"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FaAngleLeft } from "react-icons/fa";
import { FaCheck } from "react-icons/fa"; // For the checkmark inside completed circles

export default function Company({ onNextStep, onBackStep, currentStep }) {
  const [formData, setFormData] = useState({
    CompanyName: "",
    JobTitle: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNextStep(); // Move to next step after submitting
  };

  // Function to render the progress circles dynamically
  const renderStepCircles = () => {
    const steps = 5;
    return Array.from({ length: steps }, (_, index) => {
      const stepNumber = index + 2;
      const isCompleted = currentStep > stepNumber;
      const isActive = currentStep === stepNumber;

      return (
        <div className="flex items-center" key={stepNumber}>
          {/* Circle */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center border-2
              ${isCompleted ? "bg-blue-500" : "bg-transparent"} 
              ${isCompleted || isActive ? "border-blue-500" : "border-gray-300"}`}
          >
            {isCompleted && (
              <FaCheck className="text-white" size={16} /> // Checkmark icon
            )}
          </div>

          {/* Straight Line */}
          {index < steps - 1 && (
            <div className="w-8 h-0 border-t-2 border-gray-300 mx-2"></div> // Solid line
          )}
        </div>
      );
    });
  };

  return (
    <div className="bg-white flex items-center justify-center h-full p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <Card className="overflow-hidden shadow-lg shadow-gray-300 rounded-[30px]">
          <CardContent className="p-14 md:p-16 flex flex-col justify-center relative">
            {/* Back Button */}
            <button
              type="button"
              onClick={onBackStep}
              className="flex items-center absolute top-4 left-4 p-2 rounded-full text-dark-gray hover:bg-gray-200"
            >
              <FaAngleLeft size={20} />
              <p className="font-vietname text-xs font-medium text-dark-gray ml-2">
                Back
              </p>
            </button>

            {/* Step Circles */}
            <div className="flex justify-center gap-2 mb-6">
              {renderStepCircles()}
            </div>

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center">
                  <h1 className="font-vietname text-2xl font-medium text-dark-gray">
                    Customize your company.
                  </h1>
                </div>
                <p className="font-vietname text-xs font-medium text-dark-gray">
                  What's your company name?
                </p>
                <div className="grid gap-2">
                  <Input
                    className="font-custom"
                    id="CompanyName"
                    type="text"
                    placeholder="Company Name"
                    value={formData.CompanyName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <p className="font-vietname text-xs font-medium text-dark-gray">
                  What's your role in the company?
                </p>
                <div className="grid gap-2">
                  <Input
                    className="font-custom"
                    id="JobTitle"
                    type="text"
                    placeholder="Job Title"
                    value={formData.JobTitle}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex justify-center">
                  <Button type="submit" className="w-56 rounded-full mt-4 font-vietname text-2sm">
                    Next step
                  </Button>
                </div>
                <div className="text-center text-2sm font-vietname-thin text-light-gray">
                  Already had an account?{" "}
                  <a href="#" className="text-blue">
                    Sign in
                  </a>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
