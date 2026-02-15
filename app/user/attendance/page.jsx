"use client";

import { useState, useRef, useEffect } from "react";
import {
  CalendarClock,
  MapPin,
  Timer,
  CalendarPlus2,
  LogOut,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import ShiftDetailDialog from "./components/shiftdetaildialog.jsx";
import RequestLeaveDialog from "./components/requestleavedialog.jsx";
import SuccessDialog from "./components/successdialog.jsx";
import TimesheetTable from "./components/timesheettable.jsx";
import SelectShiftDialog from "./components/select-shift-dialog.jsx";
import StreakPetModal from "./components/streakpetmodal.jsx";
import RatingDialog from "./components/ratingdialog.jsx";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAttendances,
  getShift,
  getTotalWorkedHours,
  clockIn,
} from "@/lib/api/userAttendance";
import { convertToSeconds } from "@/lib/helper/dateTimeConveter";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { getMyDetails } from "@/lib/api/user";

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

function TimerButton({
  hasClockedIn,
  onStopped,
  onStarted,
  onShowShiftDetail,
  shift,
  clockedInShiftName,
  currentTotalWorkedHours,
}) {
  const [seconds, setSeconds] = useState(currentTotalWorkedHours);
  const [isRunning, setIsRunning] = useState(hasClockedIn); // Initialize with hasClockedIn
  const [location, setLocation] = useState("Locating...");
  const [showDialog, setShowDialog] = useState(false);
  const [selectedShift, setSelectedShift] = useState(clockedInShiftName || "");
  const [selectedShiftId, setSelectedShiftId] = useState(null);
  const [showSelectShift, setShowSelectShift] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [cordinate, setCordinate] = useState({
    latitude: null,
    longitude: null,
  });
  const intervalRef = useRef();
  const queryClient = useQueryClient();
  const [buttonColor, setButtonColor] = useState(
    "bg-blue-500 hover:bg-blue-600",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [showStreakPetModal, setShowStreakPetModal] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [ratingMessage, setRatingMessage] = useState("");

  // Streak pet dragging state
  const [petPosition, setPetPosition] = useState(null); // null means use default position
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);
  const petRef = useRef(null);

  // Clock in mutation function
  const clockInMutation = useMutation({
    mutationFn: clockIn,
    onSuccess: () => {
      queryClient.invalidateQueries(["user-attendances"]);
      queryClient.invalidateQueries(["my-total-worked-hours"]);
      setErrorMessage("");
      setButtonColor("bg-blue-500 hover:bg-blue-600");
      setIsRunning(true); // ✅ only mark running when success
      if (onStarted) onStarted(shift?.name || "", startTime);

      // Show rating dialog after clock in
      setRatingMessage("Yo! How was your day? Darling");
      setShowRatingDialog(true);
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Clock in failed. Please try again.";
      setErrorMessage(message);
      setButtonColor("bg-red-500 hover:bg-red-600");
      setIsRunning(false); // ✅ stay not running on error
      setErrorOpen(true);
    },
  });

  //when click on Clock In button
  const startTimer = (chosenShift) => {
    const now = new Date();
    const formattedStart = now.toLocaleTimeString("en-GB", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const sName =
      typeof chosenShift === "string" ? chosenShift : chosenShift?.name || "";
    const sObject = shift.find((s) => s.name === sName);
    const sId = sObject._id;
    console.log("sName", sName);
    console.log("sId", sId);

    setSelectedShift(sName);
    setSelectedShiftId(sId);
    setStartTime(formattedStart);
    setShowDialog(false);
    setShowSelectShift(false);
    setErrorMessage("");
    setButtonColor("bg-blue-500 hover:bg-blue-600");

    // ✅ do NOT setIsRunning(true) here anymore
    // Call API instead
    clockInMutation.mutate({
      geoLocation: {
        latitude: cordinate.latitude,
        longitude: cordinate.longitude,
      },
      shiftId: sId,
    });
  };

  // total worked hours effect
  useEffect(() => {
    setSeconds(currentTotalWorkedHours ? currentTotalWorkedHours : 0);
  }, [currentTotalWorkedHours]);

  useEffect(() => {
    setSelectedShift(clockedInShiftName);
  }, [clockedInShiftName]);

  // Update isRunning when hasClockedIn changes
  useEffect(() => {
    setIsRunning(hasClockedIn);
  }, [hasClockedIn]);

  useEffect(() => {
    if (isRunning && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    // Get current location
    if ("geolocation" in navigator) {
      console.log("Geolocation is available");
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setCordinate({ latitude, longitude });
          console.log("latitude:", latitude, "longitude:", longitude);
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
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
        { enableHighAccuracy: true, timeout: 10000 },
      );
    } else {
      setLocation("Not supported");
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  //when click on Clock Out button
  const stopTimer = () => {
    // stop timer
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);

    // get current time
    const end = new Date();
    const formattedEnd = end.toLocaleTimeString("en-GB", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const date = end.toLocaleDateString("en-GB");

    // prepare shift detail to show in dialog
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

    // Show rating dialog after clock out
    setRatingMessage("Yo! How are you feeling today?");
    setShowRatingDialog(true);

    setSeconds(0);
  };

  console.log("selectedShift", selectedShift);

  // Get pet element size dynamically
  const getPetSize = () => {
    if (petRef.current) {
      const rect = petRef.current.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    }
    // Fallback sizes for different breakpoints
    const width = window.innerWidth;
    if (width >= 768) return { width: 96, height: 96 }; // md: text-6xl
    if (width >= 640) return { width: 80, height: 80 }; // sm: text-5xl
    return { width: 60, height: 60 }; // text-4xl
  };

  // Streak pet drag handlers
  const handlePetMouseDown = (e) => {
    e.stopPropagation();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    // If no position set yet, get the current position from the element
    if (petPosition === null && petRef.current) {
      const rect = petRef.current.getBoundingClientRect();
      setPetPosition({ x: rect.left, y: rect.top });
      setDragStart({ x: clientX - rect.left, y: clientY - rect.top });
    } else {
      setDragStart({ x: clientX - petPosition.x, y: clientY - petPosition.y });
    }

    setIsDragging(true);
    setHasMoved(false);
  };

  const handlePetMouseMove = (e) => {
    if (!isDragging) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    let newX = clientX - dragStart.x;
    let newY = clientY - dragStart.y;

    // Get window dimensions and pet element size
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const petSize = getPetSize();

    // Apply boundary constraints - keep pet on screen
    newX = Math.max(0, Math.min(newX, windowWidth - petSize.width));
    newY = Math.max(0, Math.min(newY, windowHeight - petSize.height));

    // Check if moved more than 5 pixels
    if (
      petPosition &&
      (Math.abs(newX - petPosition.x) > 5 || Math.abs(newY - petPosition.y) > 5)
    ) {
      setHasMoved(true);
    }

    setPetPosition({
      x: newX,
      y: newY,
    });
  };

  const handlePetMouseUp = (e) => {
    setIsDragging(false);

    // If hasn't moved much, treat it as a click
    if (!hasMoved) {
      setShowStreakPetModal(true);
    }
  };

  // Add/remove event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      const move = (e) => handlePetMouseMove(e);
      const up = (e) => handlePetMouseUp(e);

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
    }
  }, [isDragging, dragStart, petPosition]);

  // Handle window resize - keep pet on screen
  useEffect(() => {
    const handleResize = () => {
      if (petPosition !== null) {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const petSize = getPetSize();

        // Adjust position if pet is now off-screen
        const newX = Math.max(
          0,
          Math.min(petPosition.x, windowWidth - petSize.width),
        );
        const newY = Math.max(
          0,
          Math.min(petPosition.y, windowHeight - petSize.height),
        );

        if (newX !== petPosition.x || newY !== petPosition.y) {
          setPetPosition({ x: newX, y: newY });
        }
      }
    };

    window.addEventListener("resize", handleResize);
    // Run immediately to adjust on mount
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [petPosition]);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="text-2xl sm:text-3xl font-custom">Today's Clock</div>

      {!isRunning ? (
        <>
          <div className="relative flex items-center justify-center w-full">
            <Button
              onClick={() => {
                const availableShifts = Array.isArray(shift)
                  ? shift
                  : shift
                    ? [shift]
                    : [];
                if (availableShifts.length > 1) {
                  setShowSelectShift(true);
                } else {
                  const only = availableShifts[0] || null;
                  startTimer(only || shift?.name || null);
                }
              }}
              className={`rounded-full w-40 h-40 ${buttonColor} text-white text-2xl sm:text-3xl font-custom shadow-lg flex flex-col items-center justify-center`}
            >
              <Timer className="w-10 h-10 mb-2" />
              Clock In
            </Button>

            {/* Streak Pet - Bunny - Draggable */}
            {/* <div
              ref={petRef}
              className={`fixed cursor-move hover:scale-110 z-50 select-none touch-none transition-all ${
                petPosition === null
                  ? "right-4 sm:right-8 top-1/2 -translate-y-1/2"
                  : ""
              } ${isDragging ? "opacity-80 scale-110" : "opacity-100"}`}
              style={
                petPosition !== null
                  ? {
                      left: `${petPosition.x}px`,
                      top: `${petPosition.y}px`,
                      animation: !isDragging ? "bounce 1s infinite" : "none",
                      filter: isDragging
                        ? "drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3))"
                        : "none",
                    }
                  : {
                      animation: !isDragging ? "bounce 1s infinite" : "none",
                      filter: isDragging
                        ? "drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3))"
                        : "none",
                    }
              }
              onMouseDown={handlePetMouseDown}
              onTouchStart={handlePetMouseDown}
            >
              <div className="text-4xl sm:text-5xl md:text-6xl">🐰</div>
            </div> */}
          </div>

          {/* Streak Pet Modal */}
          <StreakPetModal
            open={showStreakPetModal}
            onClose={() => setShowStreakPetModal(false)}
            streakCount={12}
          />

          {errorMessage && (
            <p className="text-red-500 text-sm font-custom mt-3 text-center">
              {errorMessage}
            </p>
          )}
          <SelectShiftDialog
            open={showSelectShift}
            onOpenChange={setShowSelectShift}
            shifts={Array.isArray(shift) ? shift : shift ? [shift] : []}
            onConfirm={(chosen) => startTimer(chosen)}
          />
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

      {/* Rating Dialog */}
      {/* <RatingDialog
        open={showRatingDialog}
        onClose={() => setShowRatingDialog(false)}
        message={ratingMessage}
        onRate={(rating) => {
          console.log("User rated:", rating);
          // You can add API call here to save the rating
        }}
      /> */}
    </div>
  );
}

function MobileHeader() {
  const router = useRouter();

  const { user, logout } = useAuth();

  const quickActions = [
    {
      title: "Overtime",
      icon: CalendarPlus2,
      route: "/user/overtime",
    },
    {
      title: "Leave",
      icon: LogOut,
      route: "/user/leaves",
    },
    {
      title: "Payroll",
      icon: CreditCard,
      route: "/user/payroll",
    },
  ];

  const { data: user_data } = useQuery({
    queryKey: ["my-details"],
    queryFn: getMyDetails,
  });

  return (
    <div className="lg:hidden mb-4 space-y-3">
      {/* User Profile Section */}
      <div className="bg-white rounded-xl shadow-sm">
        <button
          onClick={() => {}}
          className="w-full p-4 flex items-center gap-4 hover:bg-[#5494DA33] transition-colors"
        >
          {user_data?.profileImg ? (
            <img
              src={user_data.profileImg}
              alt="Profile"
              className="w-12 h-12 rounded-full border-2 border-gray-200 object-cover"
            />
          ) : (
            <div className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-gray-200 bg-gray-300 text-gray-700 font-semibold text-lg">
              {user_data?.employee?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </div>
          )}

          <div className="font-custom text-left">
            <div className="font-semibold text-lg text-gray-900">
              {user_data?.employee?.name}
            </div>
            <div className="text-sm text-gray-500">
              {user_data?.position?.title || "No Position"}
            </div>
          </div>
        </button>
      </div>

      {/* Quick Actions */}
      <div className="">
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <button
                key={action.title}
                onClick={() => router.push(action.route)}
                className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-white hover:bg-[#5494DA33] transition-colors"
              >
                <div className="p-3 bg-blue-100 rounded-lg">
                  <IconComponent className="w-6 h-6 text-gray-700" />
                </div>
                <span className="font-custom text-sm font-medium text-black">
                  {action.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
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

  const [errorMessage, setErrorMessage] = useState("");
  const [buttonColor, setButtonColor] = useState(
    "bg-blue-500 hover:bg-blue-600",
  );

  // NEW: show tabs only after first Clock In
  const [hasClockedIn, setHasClockedIn] = useState(false);

  // Tabs + attachment state
  const [activeTab, setActiveTab] = useState("attachments");
  const [attachments, setAttachments] = useState([]);

  // get attendances
  const { data: attendances = [] } = useQuery({
    queryKey: ["user-attendances"],
    queryFn: getAttendances,
  });

  console.log(attendances);

  // get current shift
  const { data: shift } = useQuery({
    queryKey: ["user-shift"],
    queryFn: getShift,
  });

  //updated total worked hours
  const { data: totalWorkedHours } = useQuery({
    queryKey: ["my-total-worked-hours"],
    queryFn: getTotalWorkedHours,
  });

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Asia/Phnom_Penh",
  });

  const todayAttendance =
    attendances.find((a) => {
      const localDate = new Date(a.date).toLocaleDateString("en-CA", {
        timeZone: "Asia/Phnom_Penh",
      });
      return localDate === today;
    }) || null;

  // Check if there's an ongoing session (last transaction is checkIn)
  const isOnGoing =
    todayAttendance &&
    todayAttendance.transactions.length > 0 &&
    todayAttendance.transactions[todayAttendance.transactions.length - 1]
      .type === "checkIn";

  const clockInShiftName =
    shift &&
    shift.length > 0 &&
    todayAttendance &&
    todayAttendance.shift &&
    shift.find((s) => s._id === todayAttendance?.shift)?.name;

  // Update hasClockedIn state when isOnGoing changes
  useEffect(() => {
    if (isOnGoing) {
      setHasClockedIn(true);
    }
  }, [isOnGoing, attendances]);

  return (
    <div>
      {/* Mobile Header - Only visible on mobile */}
      <MobileHeader />

      {/* Desktop Header - Hidden on mobile */}
      <div className="bg-white rounded-xl mb-3 shadow-md py-6 px-6 border hidden lg:block">
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
            hasClockedIn={hasClockedIn}
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
              setHasClockedIn(true);
            }}
            onShowShiftDetail={(detail) => {
              setShiftDetail(detail);
              setShowShiftDetail(true);
            }}
            shift={shift}
            clockedInShiftName={clockInShiftName}
            currentTotalWorkedHours={
              totalWorkedHours ? convertToSeconds(totalWorkedHours) : 0
            }
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
              {totalWorkedHours ? totalWorkedHours : stoppedTime}
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
          setShowShiftDetail(false);
          setShowLeaveDialog(true);
        }}
      />

      <RequestLeaveDialog
        open={showLeaveDialog}
        detail={shiftDetail}
        onClose={() => {
          setShowLeaveDialog(false);
          setShowShiftDetail(true);
        }}
        onCloseAll={() => {
          setShowLeaveDialog(false);
          setShowShiftDetail(false);
          setShowSuccess(true);
        }}
      />

      <SuccessDialog open={showSuccess} onClose={() => setShowSuccess(false)} />
      <TimesheetTable attendances={attendances} shift={shift} />
    </div>
  );
}
