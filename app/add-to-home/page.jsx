"use client";
import { useEffect, useState } from "react";

export default function AddToHomeScreen() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showIosBanner, setShowIosBanner] = useState(false);

  // Detect real iPhone/iPad (not macOS pretending)
  const isRealIos = () => {
    const ua = navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(ua);
    const hasTouch = navigator.maxTouchPoints > 1;
    return isIOSDevice && hasTouch;
  };

  const isInStandaloneMode = () =>
    window.navigator.standalone === true ||
    window.matchMedia("(display-mode: standalone)").matches;

  useEffect(() => {
    // Android Chrome: beforeinstallprompt
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // iOS Safari: manual banner
    if (isRealIos() && !isInStandaloneMode()) {
      setShowIosBanner(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    try {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
    } finally {
      setDeferredPrompt(null);
    }
  };

  return (
    <div>
      {/* Android: Centered Welcome Card */}
      {deferredPrompt && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Hello! Welcome to Anan App 👋
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Install this app for faster access and a smoother experience.
            </p>
            <button
              onClick={handleInstallClick}
              className="w-full px-5 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition text-sm font-medium"
            >
              Install Anan App
            </button>
          </div>
        </div>
      )}

      {/* iOS: Full Page Banner */}
      {showIosBanner && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white p-6 z-50 text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to Anan App 👋</h1>
          <p className="text-base mb-6">
            To install this app on your iPhone, tap <strong>Share</strong> and
            then <strong>Add to Home Screen</strong>.
          </p>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/anan-image.appspot.com/o/Click.png?alt=media&token=a4932cbb-5014-4f8d-9323-e90b4c4c9806"
            className="w-60 h-auto rounded-lg shadow-xl"
            alt="tutorial"
          />
        </div>
      )}
    </div>
  );
}
