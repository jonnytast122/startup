import React from "react";

const RequestButton = ({ icon: Icon, text, notificationCount }) => {
  return (
    <button className="flex items-center justify-between gap-3 px-5 py-2 bg-white shadow-md rounded-lg relative">
      {/* Left Icon */}
      <Icon className="w-6 h-6 text-black" />

      {/* Text */}
      <span className="text-black font-medium">{text}</span>

      {/* Notification Badge */}
      {notificationCount > 0 && (
        <span className="ml-auto bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
          {notificationCount}
        </span>
      )}
    </button>
  );
};

export default RequestButton;
