"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FaAngleLeft, FaCheck, FaDownload } from "react-icons/fa";
import { useDropzone } from "react-dropzone";

export default function Step3({ onNextStep, onBackStep, currentStep }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(URL.createObjectURL(acceptedFiles[0]));
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] }, // Only allow images
    multiple: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFile) {
      onNextStep();
    }
  };

  // Render progress circles
  const renderStepCircles = () => {
    const steps = 5;
    return Array.from({ length: steps }, (_, index) => {
      const stepNumber = index + 2;
      const isCompleted = currentStep > stepNumber;
      const isActive = currentStep === stepNumber;

      return (
        <div className="flex items-center" key={stepNumber}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center border-2
              ${isCompleted ? "bg-blue-500" : "bg-transparent"} 
              ${isCompleted || isActive ? "border-blue-500" : "border-gray-300"}
              ${isActive ? "border-2" : ""}`}
          >
            {isCompleted && <FaCheck className="text-white" size={16} />}
          </div>
          {index < steps - 1 && (
            <div className="w-8 h-0 border-t-2 border-gray-300 mx-2"></div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="bg-white flex h-full p-6 md:p-10">
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
              <div className="flex flex-col gap-6 items-center">
                <h1 className="font-vietname text-sm font-medium text-dark-gray mt-5">
                  Add your company logo
                </h1>

                {/* Drag and Drop Area */}
                <div
                  {...getRootProps()}
                  className="w-full md:w-2/3 h-44 border-2 border-gray-300 rounded-xl flex items-center justify-center cursor-pointer bg-white hover:bg-gray-100 transition"
                >
                  <input {...getInputProps()} />
                  {selectedFile ? (
                    <img
                      src={selectedFile}
                      alt="Uploaded Logo"
                      className="h-24 w-24 object-cover rounded-full shadow-md"
                    />
                  ) : (
                    <div className="flex w-full items-center justify-center">
                      {/* Download Icon on the left */}
                      <FaDownload className="text-gray-400 text-8xl mr-20" />
                      {/* Text on the right */}
                      <p className="text-gray-500 text-sm font-medium mb-5">
                        Drag your logo here <br />Or{" "}
                        <span className="text-blue-500">Browse</span>
                      </p>
                    </div>
                  )}
                </div>

                <p className="font-vietname text-xs font-medium text-light-gray">
                  Change from the setting menu at any time
                </p>

                {/* Next Button */}
                <div className="flex justify-center">
                  <Button
                    type="submit"
                    className="w-56 rounded-full mt-4 font-vietname text-2sm"
                    disabled={!selectedFile}
                  >
                    Next step
                  </Button>
                </div>

                <div className="text-center text-2sm font-vietname text-light-gray">
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
