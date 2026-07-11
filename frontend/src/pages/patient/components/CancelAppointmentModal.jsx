import React from 'react';
import Button from '../../../components/common/Button';
import { FaExclamationTriangle } from 'react-icons/fa';

const CancelAppointmentModal = ({
  isOpen,
  onClose,
  appointment,
  onConfirm
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <FaExclamationTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">
            Cancel Appointment
          </h3>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Are you sure you want to cancel your appointment with{' '}
          <span className="font-semibold"> {appointment?.doctorName}</span> at{' '}
          <span className="font-semibold">{appointment?.hospitalName}</span>?
        </p>
        
        <div className="flex justify-end gap-4">
          <Button
            onClick={onClose}
            variant="secondary"
          >
            Keep Appointment
          </Button>
          <Button
            onClick={onConfirm}
            variant="danger"
            className="flex items-center gap-2"
          >
            <FaExclamationTriangle />
            Yes, Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CancelAppointmentModal;