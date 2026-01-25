import { useState, useRef, useEffect } from "react";
import { X, Pencil, Check } from "lucide-react";

export default function StreakPetModal({ open, onClose, streakCount = 12 }) {
  const [petName, setPetName] = useState("MY PET");
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);

  const currentHealth = 20;
  const maxHealth = 100;
  const healthToUnlock = maxHealth - currentHealth;
  const progressPercentage = (currentHealth / maxHealth) * 100;

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSaveName = () => {
    setIsEditing(false);
    // You can add API call here to save the pet name to backend
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSaveName();
    } else if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  if (!open) return null;

  const growthActivities = [
    {
      icon: "🔍",
      title: "Rate after clock in",
      reward: "+1 growth health",
      bgColor: "bg-orange-100",
    },
    {
      icon: "🖼️",
      title: "Clock Out on time",
      reward: "Max +3 growth health",
      bgColor: "bg-orange-100",
    },
    {
      icon: "🔗",
      title: "Rate after clock out",
      reward: "+1 growth health",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-b from-blue-300 to-blue-400 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Scrollable Content */}
        <div className="overflow-y-auto overflow-x-hidden flex-1 hide-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Header with streak count */}
        <div className="p-6 relative">
          <div className="absolute top-6 left-6">
            <div className="bg-white rounded-full px-4 py-2 shadow-md flex items-center gap-1">
              <span className="font-custom font-bold text-xl">{streakCount}</span>
              <span className="text-xl">🔥</span>
            </div>
          </div>
        </div>

        {/* Bunny Pet */}
        <div className="flex flex-col items-center px-6 pb-6">
          {/* Large Bunny Illustration */}
          <div className="relative mb-4">
            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center shadow-lg">
              {/* Bunny Ears */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-4">
                <div className="w-6 h-20 bg-gradient-to-b from-orange-200 to-orange-300 rounded-full border-4 border-white" />
                <div className="w-6 h-20 bg-gradient-to-b from-orange-200 to-orange-300 rounded-full border-4 border-white" />
              </div>

              {/* Bunny Face */}
              <div className="relative">
                {/* Whiskers Left */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12">
                  <div className="w-8 h-0.5 bg-gray-800 mb-2" />
                  <div className="w-8 h-0.5 bg-gray-800 mb-2" />
                  <div className="w-8 h-0.5 bg-gray-800" />
                </div>

                {/* Whiskers Right */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12">
                  <div className="w-8 h-0.5 bg-gray-800 mb-2" />
                  <div className="w-8 h-0.5 bg-gray-800 mb-2" />
                  <div className="w-8 h-0.5 bg-gray-800" />
                </div>

                {/* Eyes */}
                <div className="flex gap-8 mb-4">
                  <div className="w-4 h-4 bg-gray-800 rounded-full" />
                  <div className="w-4 h-4 bg-gray-800 rounded-full" />
                </div>

                {/* Nose */}
                <div className="flex justify-center mb-2">
                  <div className="w-3 h-2 bg-pink-400 rounded-full" />
                </div>

                {/* Mouth */}
                <div className="flex justify-center">
                  <div className="text-2xl">ω</div>
                </div>
              </div>
            </div>
          </div>

          {/* Pet Name */}
          <div className="flex items-center gap-2 mb-4">
            {isEditing ? (
              <>
                <input
                  ref={inputRef}
                  type="text"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  onKeyDown={handleKeyPress}
                  onBlur={handleSaveName}
                  className="font-custom font-bold text-xl bg-white rounded-lg px-3 py-1 border-2 border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  maxLength={20}
                />
                <button
                  onClick={handleSaveName}
                  className="p-1 hover:bg-blue-200 rounded-full transition-colors"
                >
                  <Check className="w-5 h-5 text-green-600" />
                </button>
              </>
            ) : (
              <>
                <span className="font-custom font-bold text-xl">{petName}</span>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 hover:bg-blue-200 rounded-full transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-orange-200 rounded-full h-6 mb-2 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-orange-400 to-orange-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Progress Text */}
          <div className="text-center mb-2">
            <span className="font-custom text-sm font-medium">
              {currentHealth} / {maxHealth}
            </span>
          </div>
          <div className="text-center mb-6">
            <span className="font-custom text-sm text-blue-900">
              {healthToUnlock} healths to unlock the next look
            </span>
          </div>
        </div>

        {/* Grow your Pet Section */}
        <div className="bg-white rounded-t-3xl px-6 pt-6 pb-12">
          <h3 className="font-custom font-bold text-xl mb-4">Grow your Pet</h3>

          <div className="space-y-3 pb-8">
            {growthActivities.map((activity, index) => (
              <div
                key={index}
                className={`${activity.bgColor} border-2 border-orange-200 rounded-2xl p-4 flex items-center gap-4`}
              >
                <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <div className="font-custom font-semibold text-base mb-1">
                    {activity.title}
                  </div>
                  <div className="font-custom text-sm text-gray-600">
                    {activity.reward}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
        {/* End Scrollable Content */}
      </div>
    </div>
  );
}
