"use client";

import { FaAngleLeft, FaCheck, FaDownload, FaSpinner } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils.ts";
import { useDropzone } from "react-dropzone";
import { useState, useCallback } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/config/firebase";
import LinearProgress from "@mui/material/LinearProgress";

import Box from "@mui/material/Box";

export default function Company({
  onNextStep,
  onBackStep,
  currentStep,
  formData,
  setFormData,
}) {
  const [selectedFile, setSelectedFile] = useState(
    formData.company.logo || null
  );
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle file upload to Firebase
  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setIsUploading(true);
      setProgress(0);

      const storageRef = ref(storage, `uploads/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(percent);
        },
        (error) => {
          setIsUploading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setSelectedFile(url);
            setFormData((prev) => ({
              ...prev,
              company: { ...prev.company, logo: url },
            }));
            setIsUploading(false);
          });
        }
      );

      // Optional: local preview while uploading
      const localUrl = URL.createObjectURL(file);
      setSelectedFile(localUrl);
    },
    [setFormData]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      company: {
        ...formData.company,
        [e.target.id]: e.target.value,
      },
    });
    setErrors({ ...errors, [e.target.id]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.company.name?.trim())
      newErrors.companyName = "Company name is required";
    if (!formData.company.logo)
      newErrors.companyLogo = "Company logo is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onNextStep();
    }
  };

  const renderStepCircles = () => {
    const steps = 4;
    return Array.from({ length: steps }, (_, index) => {
      const stepNumber = index + 2;
      const isCompleted = currentStep > stepNumber;
      const isActive = currentStep === stepNumber;

      return (
        <div className="flex items-center" key={stepNumber}>
          <div
            className={cn(
              "rounded-full flex items-center justify-center border-2 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-10 xl:h-10",
              {
                "bg-blue-500": isCompleted,
                "border-blue-500": isCompleted || isActive,
                "border-gray-300": !isCompleted && !isActive,
              }
            )}
          >
            {isCompleted && <FaCheck className="text-white" />}
          </div>
          {index < steps - 1 && (
            <div className="border-t-2 border-gray-300 mx-2 w-6 sm:w-8 md:w-10 lg:w-12 xl:w-14" />
          )}
        </div>
      );
    });
  };

  return (
    <div className="bg-white flex items-center justify-center h-full p-6 md:p-10 font-custom">
      <div className="w-full max-w-sm md:max-w-4xl">
        <Card className="overflow-hidden shadow-lg shadow-gray-300 rounded-[30px]">
          <CardContent className="p-14 md:p-16 flex flex-col justify-center relative">
            <button
              type="button"
              onClick={onBackStep}
              className="flex items-center absolute top-4 left-4 p-2 rounded-full text-dark-gray hover:bg-gray-200"
            >
              <FaAngleLeft size={20} />
              <p className="text-xs font-medium text-dark-gray ml-2">Back</p>
            </button>

            <div className="flex justify-center gap-2 mb-6 mt-2">
              {renderStepCircles()}
            </div>

            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="flex flex-col items-center gap-6">
                <h1 className="text-2xl font-medium text-dark-gray text-center">
                  Customize your company.
                </h1>
                <h1 className="font-medium text-dark-gray">
                  What's your name?
                </h1>

                <div className="grid gap-2 w-1/2">
                  <Input
                    id="name"
                    type="text"
                    placeholder="Company Name"
                    value={formData.company.name}
                    onChange={handleChange}
                    className={cn(
                      "font-custom placeholder:text-gray-400",
                      errors.companyName && "border-red-500"
                    )}
                  />
                  {errors.companyName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.companyName}
                    </p>
                  )}
                </div>

                <h1 className="font-medium text-dark-gray">
                  Add your company logo
                </h1>

                <div
                  {...getRootProps()}
                  className="h-64 w-80 rounded-2xl shadow-md border-2 border-gray-300 flex flex-col items-center justify-center cursor-pointer bg-white hover:bg-gray-100 transition relative"
                >
                  <input {...getInputProps()} />
                  {selectedFile ? (
                    <img
                      src={selectedFile}
                      alt="Uploaded Logo"
                      className="h-32 w-32 rounded-full shadow-md object-cover"
                    />
                  ) : (
                    <div className="flex w-full items-center justify-center">
                      <FaDownload className="text-gray-400 text-8xl mr-4" />
                      <p className="text-gray-500 text-xs font-medium ml-3 text-center">
                        Drag your logo here <br />
                        Or <span className="text-blue-500">Browse</span>
                      </p>
                    </div>
                  )}

                  {/* ✅ Show upload progress bar */}
                  {isUploading && (
                    <Box sx={{ width: "80%", position: "absolute", bottom: 8 }}>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                          height: 6,
                          borderRadius: 5,
                          backgroundColor: "#e0e0e0",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: "#3b82f6",
                          },
                        }}
                      />
                    </Box>
                  )}
                </div>

                {errors.companyLogo && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.companyLogo}
                  </p>
                )}

                <div className="flex justify-center">
                  <Button
                    type="submit"
                    className="w-56 rounded-full mt-4 text-2sm"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <FaSpinner className="animate-spin text-white text-lg" />
                    ) : (
                      "Next step"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
