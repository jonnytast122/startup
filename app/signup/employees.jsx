"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FaAngleLeft, FaCheck } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Employee({
  onNextStep,
  onBackStep,
  currentStep,
  formData,
  setFormData,
}) {
  // Correctly initialize state
  const [selectedEmployees, setSelectedEmployees] = useState(
    formData.company?.numberOfEmployees || ""
  );
  const [selectedIndustry, setSelectedIndustry] = useState(
    formData.company?.industries?.[0] || ""
  );

  const employeeOptions = ["1-10", "11-50", "51-100", "101-500", "500+"];
  const industryOptions = [
    "Technology",
    "Healthcare",
    "Education",
    "Finance",
    "Manufacturing",
    "Retail",
    "Hospitality",
    "Construction",
    "Transportation",
    "Other",
  ];

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedEmployees || !selectedIndustry) return;

    setFormData((prev) => ({
      ...prev,
      company: {
        ...prev.company,
        numberOfEmployees: selectedEmployees,
        industries: [selectedIndustry], // always an array
      },
    }));

    onNextStep();
  };

  // Render step circles
  const renderStepCircles = () => {
    const steps = 4;
    return Array.from({ length: steps }, (_, index) => {
      const stepNumber = index + 2;
      const isCompleted = currentStep > stepNumber;
      const isActive = currentStep === stepNumber;

      return (
        <div className="flex items-center" key={stepNumber}>
          <div
            className={`rounded-full flex items-center justify-center border-2 
              ${isCompleted ? "bg-blue-500" : "bg-transparent"} 
              ${
                isCompleted || isActive ? "border-blue-500" : "border-gray-300"
              } 
              w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-10 xl:h-10`}
          >
            {isCompleted && <FaCheck className="text-white text-[10px]" />}
          </div>
          {index < steps - 1 && (
            <div className="border-t-2 border-gray-300 mx-2 w-6 sm:w-8 md:w-10 lg:w-12 xl:w-14" />
          )}
        </div>
      );
    });
  };

  return (
    <div className="font-custom bg-white flex items-center justify-center h-full p-6 md:p-10">
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
            <div className="flex justify-center gap-2 mb-6 mt-2">
              {renderStepCircles()}
            </div>

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="flex flex-col items-center gap-6">
                {/* Employee Selection */}
                <h1 className="font-medium text-dark-gray">
                  How many employees do you have?
                </h1>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-2/3">
                  {employeeOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`py-2 text-[10px] font-medium border rounded-md transition
                        ${
                          selectedEmployees === option
                            ? "bg-blue-500 text-white border-blue-500"
                            : "border-gray-300 text-gray-700 hover:border-blue-400"
                        }`}
                      onClick={() => setSelectedEmployees(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {/* Industry Selection */}
                <label
                  htmlFor="industry"
                  className="font-medium text-dark-gray mb-3"
                >
                  What's your business industry?
                </label>
                <Select
                  value={selectedIndustry}
                  onValueChange={setSelectedIndustry}
                  required
                >
                  <SelectTrigger className="w-1/2 text-dark-gray font-custom mt-2 rounded-xl">
                    <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent className="w-full font-custom">
                    {industryOptions.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Next Button */}
                <Button
                  type="submit"
                  className="w-56 rounded-full mt-4 text-2sm"
                  disabled={!selectedEmployees || !selectedIndustry}
                >
                  Next step
                </Button>

                <div className="text-center text-2sm-thin text-light-gray">
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
