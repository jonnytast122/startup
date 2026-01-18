export default function RatingDialog({ open, onClose, message, onRate }) {
  if (!open) return null;

  const ratings = [
    { emoji: "😡", label: "Terrible", value: 1 },
    { emoji: "😕", label: "Bad", value: 2 },
    { emoji: "😐", label: "So-so", value: 3 },
    { emoji: "😊", label: "Good", value: 4 },
    { emoji: "🤩", label: "Superb", value: 5 },
  ];

  const handleRatingClick = (rating) => {
    if (onRate) {
      onRate(rating);
    }
    onClose();
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-sm py-6 px-6 border mt-4">
      <div className="text-center">
        <h3 className="font-custom text-base text-gray-600 mb-6">
          {message}
        </h3>

        <div className="flex justify-around items-center max-w-md mx-auto">
          {ratings.map((rating) => (
            <button
              key={rating.value}
              onClick={() => handleRatingClick(rating.value)}
              className="flex flex-col items-center gap-2 hover:scale-110 transition-transform cursor-pointer"
            >
              <div className="text-4xl">{rating.emoji}</div>
              <span className="font-custom text-xs text-gray-700">
                {rating.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
