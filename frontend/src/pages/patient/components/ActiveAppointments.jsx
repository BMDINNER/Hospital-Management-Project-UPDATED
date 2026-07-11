import React from 'react';
import AppointmentCard from './AppointmentCard';
import LoadingOverlay from '../../../components/common/LoadingOverlay';
import { FaCalendarAlt } from 'react-icons/fa';

const ActiveAppointments = ({
  appointments,
  onCancelAppointment,
  formatAppointmentDate,
  loading = false
}) => {
  if (loading) {
    return <LoadingOverlay message="Loading appointments..." />;
  }

  return (
    <section className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Active Appointments ({appointments.length})
      </h2>
      
      {appointments.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCalendarAlt className="w-12 h-12 text-gray-400" />
          </div>
          <p className="text-lg mb-2">No active appointments</p>
          <p className="text-sm">Book your first appointment to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment, index) => (
            <AppointmentCard
              key={appointment._id || index}
              appointment={appointment}
              onCancel={onCancelAppointment}
              formatDate={formatAppointmentDate}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ActiveAppointments;