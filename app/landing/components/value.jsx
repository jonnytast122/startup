import React from "react";

export default function Value() {
  return (
    <div className="w-full h-screen relative">
      {/* Blue Section (30%) */}
      <div className="w-full h-[30vh] bg-primary-blue flex items-center justify-center"></div>

      {/* Image Positioned More into Blue Section */}
      <div className="absolute top-[30%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-8xl">
        <img 
          src="/images/dashboard.png" 
          alt="Dashboard"
          className="w-full h-auto"
        />
      </div>

      {/* White Section (70%) */}
      <div className="w-full h-[70vh] bg-white flex items-center justify-center">
        <p className="text-gray-700 text-lg text-center max-w-lg">
          We believe in transparency, efficiency, and innovation to help
          businesses streamline their operations.
        </p>
      </div>
    </div>
  );
}
