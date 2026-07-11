import React from 'react';
import { 
  FaUser, 
  FaHistory, 
  FaFilePrescription, 
  FaCalendarPlus,
  FaSignOutAlt 
} from 'react-icons/fa';

const VerticalNavigation = ({
  currentView,
  setCurrentView,
  previousTreatmentsCount,
  prescriptionsCount,
  onBookAppointment,
  onLogout
}) => {
  const navItems = [
    {
      id: 'profile',
      label: 'Profile',
      icon: <FaUser className="w-5 h-5" />,
      view: 'profile'
    },
    {
      id: 'treatments',
      label: 'Previous Treatments',
      icon: <FaHistory className="w-5 h-5" />,
      view: 'treatments',
      badge: previousTreatmentsCount
    },
    {
      id: 'prescriptions',
      label: 'Prescriptions',
      icon: <FaFilePrescription className="w-5 h-5" />,
      view: 'prescriptions',
      badge: prescriptionsCount
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-64 shrink-0">
      <div className="space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.view)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === item.view 
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
            {item.badge > 0 && (
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs px-2 py-1 rounded-full ml-auto">
                {item.badge}
              </span>
            )}
          </button>
        ))}

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onBookAppointment}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <FaCalendarPlus className="w-5 h-5" />
            <span className="font-medium">Book Appointment</span>
          </button>
        </div>

        <div className="pt-4">
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            <FaSignOutAlt className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerticalNavigation;