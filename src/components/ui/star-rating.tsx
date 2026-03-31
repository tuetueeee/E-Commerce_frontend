import { Star } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface StarRatingInputProps {
  name: string;
  required?: boolean;
  defaultValue?: number;
  onChange?: (rating: number) => void;
}

const ratingLabels: Record<number, string> = {
  1: 'Rất tệ',
  2: 'Tệ',
  3: 'Bình thường',
  4: 'Tốt',
  5: 'Tuyệt vời',
};

export function StarRatingInput({ 
  name, 
  required = false, 
  defaultValue = 0,
  onChange 
}: StarRatingInputProps) {
  const [rating, setRating] = useState(defaultValue);
  const [hoveredRating, setHoveredRating] = useState(0);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = rating.toString();
    }
  }, [rating]);

  const handleStarClick = (value: number) => {
    setRating(value);
    if (onChange) {
      onChange(value);
    }
  };

  const displayRating = hoveredRating || rating;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <div 
          className="flex gap-1.5"
          onMouseLeave={() => setHoveredRating(0)}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleStarClick(star)}
              onMouseEnter={() => setHoveredRating(star)}
              className="transition-all duration-300 hover:scale-125 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#ca6946] focus:ring-offset-2 rounded-full p-1"
              aria-label={`Đánh giá ${star} sao`}
            >
              <Star
                className={`w-10 h-10 transition-all duration-300 ${
                  star <= displayRating
                    ? 'fill-yellow-400 text-yellow-400 drop-shadow-sm'
                    : 'fill-gray-200 text-gray-300'
                } ${
                  star === hoveredRating ? 'scale-110 drop-shadow-md' : ''
                } ${
                  star <= rating ? 'animate-pulse-subtle' : ''
                }`}
                style={{
                  filter: star <= displayRating ? 'drop-shadow(0 2px 4px rgba(251, 191, 36, 0.3))' : 'none'
                }}
              />
            </button>
          ))}
        </div>
        {displayRating > 0 && (
          <span className="text-base font-semibold text-gray-800 transition-all duration-300 min-w-[100px]">
            {ratingLabels[displayRating as keyof typeof ratingLabels]}
          </span>
        )}
      </div>
      {rating === 0 && required && (
        <p className="text-xs text-gray-500">Vui lòng chọn đánh giá</p>
      )}
      <input
        ref={hiddenInputRef}
        type="hidden"
        name={name}
        value={rating}
        required={required}
      />
    </div>
  );
}

