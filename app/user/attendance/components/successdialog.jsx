import { useEffect } from "react";

export default function SuccessDialog({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const timeout = setTimeout(() => {
      if (onClose) onClose();
    }, 1800);
    return () => clearTimeout(timeout);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="bg-white rounded-2xl shadow-2xl px-14 py-14 max-w-lg max-h-lg w-full text-center pointer-events-auto">
        <div className="text-3xl sm:text-4xl font-custom font-semibold mb-8">
          Successfully Sent
        </div>
        <div className="flex justify-center items-center mb-6">
          <svg width="54" height="54" viewBox="0 0 54 54" fill="none">
            <circle
              cx="27"
              cy="27"
              r="25"
              stroke="#15C47B"
              strokeWidth="2.5"
              fill="white"
            />
            <path
              d="M20 32c1.5 2 6.5 2 8 0"
              stroke="#15C47B"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="21.5" cy="24.5" r="1.3" fill="#15C47B" />
            <circle cx="32.5" cy="24.5" r="1.3" fill="#15C47B" />
          </svg>
        </div>
        <div className="text-base font-custom text-gray-700">
          Please wait for the approval.
        </div>
      </div>
    </div>
  );
}
