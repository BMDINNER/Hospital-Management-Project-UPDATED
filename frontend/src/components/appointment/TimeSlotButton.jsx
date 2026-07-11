import React from 'react';

const TimeSlotButton = ({
  time,
  isAvailable = true,
  isSelected = false,
  onClick,
  disabled = false
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isAvailable || disabled}
      className={`
        p-4 rounded-lg border-2 transition-all duration-200
        flex flex-col items-center justify-center
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${isSelected
          ? 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 focus:ring-green-500'
          : isAvailable
          ? 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 focus:ring-blue-500'
          : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
        }
      `}
    >
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${isSelected ? 'bg-green-500' : isAvailable ? 'bg-green-400' : 'bg-red-400'}`} />
        <span className="font-medium">{time}</span>
      </div>
      <span className={`text-xs mt-1 ${isSelected ? 'text-green-600 dark:text-green-400' : isAvailable ? 'text-gray-500 dark:text-gray-400' : 'text-red-500 dark:text-red-400'}`}>
        {isAvailable ? 'Available' : 'Booked'}
      </span>
    </button>
  );
};

export default TimeSlotButton;