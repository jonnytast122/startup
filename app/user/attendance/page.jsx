"use client";

import { useState, useRef, useEffect } from "react";
import { CalendarClock, MapPin, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShiftDetailDialog from "./components/shiftdetaildialog.jsx";
import RequestLeaveDialog from "./components/requestleavedialog.jsx";
import SuccessDialog from "./components/successdialog.jsx";
import TimesheetTable from "./components/timesheettable.jsx";

function formatTime(totalSeconds) {
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function SlideToStop({ onStop }) {
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const maxX = 260;
  const sliderRef = useRef();

  function onStart() {
    setDragging(true);
    document.body.style.userSelect = "none";
  }

  function onMove(e) {
    if (!dragging) return;
    let clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const rect = sliderRef.current.getBoundingClientRect();
    let x = clientX - rect.left - 20;
    x = Math.max(0, Math.min(x, maxX));
    setDragX(x);
  }

  function onEnd() {
    setDragging(false);
    document.body.style.userSelect = "";
    if (dragX > maxX * 0.45) {
      setDragX(maxX);
      setTimeout(onStop, 200);
    } else {
      setDragX(0);
    }
  }

  useEffect(() => {
    if (!dragging) return;
    const move = (e) => onMove(e);
    const up = () => onEnd();
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    };
  }, [dragging, dragX]);

  return (
    <div
      ref={sliderRef}
      className="relative w-full max-w-xs h-14 rounded-full bg-gray-100 flex items-center select-none mx-auto"
      style={{ touchAction: "none" }}
    >
      <div className="absolute left-0 top-0 w-full h-full rounded-full bg-red-200" />
      <div
        className="absolute w-full h-full flex items-center justify-center pointer-events-none text-white font-custom text-base tracking-wide"
        style={{
          opacity: 1 - dragX / maxX,
          transition: dragging ? "none" : "opacity 0.3s",
        }}
      >
        Swipe to clock out
      </div>
      <div
        className="absolute top-1/2 -translate-y-1/2 z-8 w-12 h-12 ml-2 rounded-full flex items-center justify-center text-white text-md font-custom shadow transition-transform duration-200 touch-none cursor-pointer active:scale-105"
        style={{
          left: dragX,
          backgroundColor: `rgba(239, 68, 68, ${1 - dragX / maxX})`,
          transition: dragging
            ? "none"
            : "transform 0.3s, left 0.3s, background-color 0.3s",
        }}
        onMouseDown={onStart}
        onTouchStart={onStart}
      >
        <span className="pointer-events-none select-none">
          <Timer />
        </span>
      </div>
    </div>
  );
}

function TimerButton({ onStopped, onStarted, onShowShiftDetail }) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [location, setLocation] = useState("Locating...");
  const [showDialog, setShowDialog] = useState(false);
  const [selectedShift, setSelectedShift] = useState("");
  const [startTime, setStartTime] = useState("");
  const intervalRef = useRef();

  useEffect(() => {
    if (!isRunning) return;
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();
            const address = data.address || {};
            const formattedLocation = [
              address.house_number,
              address.road,
              address.city || address.town || address.village || address.county,
              address.country,
            ]
              .filter(Boolean)
              .join(", ");
            setLocation(formattedLocation || "Location found");
          } catch {
            setLocation("Could not get location");
          }
        },
        () => setLocation("Permission denied"),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setLocation("Not supported");
    }
  }, [isRunning]);

  const startTimer = (shift) => {
    const now = new Date();
    const formattedStart = now.toLocaleTimeString("en-GB", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setSelectedShift(shift);
    setStartTime(formattedStart);
    setShowDialog(false);
    setIsRunning(true);
    if (onStarted) onStarted(shift, formattedStart);
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);

    const end = new Date();
    const formattedEnd = end.toLocaleTimeString("en-GB", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const date = end.toLocaleDateString("en-GB");

    const detail = {
      date,
      shift: selectedShift,
      clockIn: startTime,
      clockOut: formattedEnd,
      location,
      workHours: formatTime(seconds),
    };
    if (onShowShiftDetail) onShowShiftDetail(detail);

    if (onStopped) onStopped(formatTime(seconds));
    setSeconds(0);
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="text-2xl sm:text-3xl font-custom">Today's Clock</div>

      {!isRunning ? (
        <>
          <Button
            onClick={() => setShowDialog(true)}
            className="rounded-full w-40 h-40 bg-blue-500 hover:bg-blue-600 text-white text-2xl sm:text-3xl font-custom shadow-lg flex flex-col items-center justify-center"
          >
            <Timer className="w-10 h-10 mb-2" />
            Clock In
          </Button>

          {showDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
              <div className="relative bg-white rounded-xl p-6 w-[90%] max-w-sm text-center space-y-4 shadow-lg">
                <button
                  onClick={() => setShowDialog(false)}
                  className="absolute top-2 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
                  aria-label="Close"
                >
                  &times;
                </button>
                <h2 className="text-xl font-custom">Select Shift</h2>
                <div className="grid grid-cols-1 gap-4">
                  {["Part time", "Security Shift", "HR", "Developer"].map(
                    (shift) => (
                      <Button
                        key={shift}
                        onClick={() => startTimer(shift)}
                        className="bg-white hover:bg-blue-400 hover:text-white text-blue-400 font-custom border border-blue-600"
                      >
                        {shift}
                      </Button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="rounded-xl bg-blue-400 text-white shadow-lg flex flex-col items-center justify-center px-6 py-6 w-full max-w-md min-w-[250px] text-center">
            <span className="text-base font-custom font-medium whitespace-nowrap mb-2">
              Ongoing Shift:{" "}
              <span className="inline-block border border-white text-white px-2 py-1 rounded-md ml-2 text-sm">
                {selectedShift}
              </span>
            </span>
            <span className="text-sm font-custom break-words block w-full">
              <MapPin className="w-4 h-4 inline-block mb-1" /> {location}
            </span>
            <div className="w-full border-t border-white my-2" />
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <span className="font-custom text-base sm:text-lg">
                Total work hour today
              </span>
              <span className="font-custom text-lg">{formatTime(seconds)}</span>
            </div>
          </div>
          <SlideToStop onStop={stopTimer} />
        </>
      )}
    </div>
  );
}

export default function Attendance() {
  const [stoppedTime, setStoppedTime] = useState("00:00:00");
  const [startTime, setStartTime] = useState("");
  const [logs, setLogs] = useState([]);
  const [showShiftDetail, setShowShiftDetail] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [shiftDetail, setShiftDetail] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // NEW: show tabs only after first Clock In
  const [hasClockedIn, setHasClockedIn] = useState(false);

  // Tabs + attachment state (unchanged behavior)
  const [activeTab, setActiveTab] = useState("daylog"); // "attachments" | "daylog"
  const [attachments, setAttachments] = useState([]);

  return (
    <div>
      {/* Header */}
      <div className="bg-white rounded-xl mb-3 shadow-md py-6 px-6 border">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <a href="/overview/attendence" className="block">
            <div className="flex items-center space-x-3">
              <CalendarClock
                className="text-[#2998FF]"
                width={40}
                height={40}
              />
              <span className="font-custom text-2xl sm:text-3xl text-black">
                Attendance
              </span>
            </div>
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col xl:flex-row gap-4">
        {/* Timer Section */}
        <div className="bg-white rounded-xl shadow-sm py-6 px-6 border w-full xl:w-2/3 flex justify-center items-center min-h-[350px]">
          <TimerButton
            onStopped={(duration) => {
              const end = new Date();
              const endTime = end.toLocaleTimeString("en-GB", {
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              });
              setStoppedTime(duration);
              setLogs((prev) => [
                ...prev,
                {
                  duration,
                  start: startTime.time,
                  end: endTime,
                  shift: startTime.shift,
                },
              ]);
            }}
            onStarted={(shift, time) => {
              setStartTime({ shift, time });
              setHasClockedIn(true); // <-- show tabs after first Clock In
            }}
            onShowShiftDetail={(detail) => {
              setShiftDetail(detail);
              setShowShiftDetail(true);
            }}
          />
        </div>

        {/* Summary Panel */}
        <div className="bg-white rounded-xl shadow-sm py-6 px-6 border w-full xl:w-1/3 flex items-center justify-center min-h-[350px]">
          <div className="text-center space-y-4 w-full">
            <h2 className="text-2xl sm:text-3xl font-custom">
              Total work hours
            </h2>
            <div className="inline-block bg-blue-100 text-blue font-custom text-md px-6 py-2 rounded-full">
              Today
            </div>

            <p className="text-4xl sm:text-5xl font-custom text-gray-700">
              {stoppedTime}
            </p>

            {startTime && startTime.shift && startTime.time && (
              <p className="text-base sm:text-lg font-custom text-gray-700">
                Start at{" "}
                <span className="font-custom">
                  {startTime.shift} - {startTime.time}
                </span>
              </p>
            )}

            {/* Show tabs + content ONLY after first Clock In */}
            {hasClockedIn && (
              <>
                <div className="w-full border-t border-gray-800 opacity-100 my-4" />

                {/* Tabs */}
                <div className="flex justify-between items-center w-full mb-2 select-none">
                  <button
                    type="button"
                    onClick={() => setActiveTab("attachments")}
                    className={`text-base font-medium font-custom transition-colors ${
                      activeTab === "attachments"
                        ? "text-blue-500"
                        : "text-black"
                    }`}
                  >
                    Attachments
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("daylog")}
                    className={`text-base font-medium font-custom transition-colors ${
                      activeTab === "daylog" ? "text-blue-500" : "text-black"
                    }`}
                  >
                    Day Log
                  </button>
                </div>

                {/* Content */}
                <div className="max-h-[160px] overflow-y-auto px-2 sm:px-4 w-full text-left">
                  {activeTab === "attachments" ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        className="w-full text-sm font-custom text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                        placeholder="Add attachment(s) here"
                        onChange={() => {}}
                      />
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {logs.map((log, index) => (
                        <li
                          key={index}
                          className="font-custom text-sm text-gray-600"
                        >
                          <div className="flex flex-wrap justify-between items-center gap-2 w-full">
                            <span className="border border-blue-400 text-blue-400 px-2 py-1 rounded-xl text-sm">
                              {log.shift}
                            </span>
                            <span className="text-gray-500 text-xs text-right">
                              {log.start} - {log.end}
                              <span className="mx-1">•</span>
                              {log.duration}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <ShiftDetailDialog
        open={showShiftDetail}
        detail={shiftDetail}
        onClose={() => setShowShiftDetail(false)}
        onRequestLeave={() => {
          setShowShiftDetail(false); // hide shift detail
          setShowLeaveDialog(true); // show request leave
        }}
      />

      <RequestLeaveDialog
        open={showLeaveDialog}
        detail={shiftDetail}
        onClose={() => {
          setShowLeaveDialog(false); // hide request leave
          setShowShiftDetail(true); // show shift detail again
        }}
        onCloseAll={() => {
          setShowLeaveDialog(false);
          setShowShiftDetail(false);
          setShowSuccess(true);
        }}
      />

      <SuccessDialog open={showSuccess} onClose={() => setShowSuccess(false)} />
      <TimesheetTable />
    </div>
  );
}
