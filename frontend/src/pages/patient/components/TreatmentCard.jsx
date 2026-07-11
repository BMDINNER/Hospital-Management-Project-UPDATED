import React from 'react';
import Button from '../../../components/common/Button';
import { 
  FaHospital, 
  FaStethoscope, 
  FaUserMd, 
  FaCalendarDay,
  FaClock,
  FaCheckCircle,
  FaFilePrescription,
  FaExclamationTriangle
} from 'react-icons/fa';

const TreatmentCard = ({
  treatment,
  prescription,
  onGeneratePrescription,
  formatDate
}) => {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <FaCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                {treatment.hospitalName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed Appointment</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <FaStethoscope className="w-4 h-4 text-gray-400" />
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Department</span>
                <p className="text-gray-600 dark:text-gray-400">{treatment.department}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <FaUserMd className="w-4 h-4 text-gray-400" />
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Doctor</span>
                <p className="text-gray-600 dark:text-gray-400">{treatment.doctorName}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <FaCalendarDay className="w-4 h-4 text-gray-400" />
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Date</span>
                <p className="text-gray-600 dark:text-gray-400">{formatDate(treatment.appointmentDate)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <FaClock className="w-4 h-4 text-gray-400" />
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Time</span>
                <p className="text-gray-600 dark:text-gray-400">{treatment.appointmentTime}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2 py-1 rounded-full text-xs font-medium">
              Completed
            </span>
          </div>

          {prescription ? (
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <FaFilePrescription className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  Prescription Available
                </span>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                {prescription.medications?.length || 0} medications prescribed
              </p>
            </div>
          ) : (
            <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FaExclamationTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                    No Prescription
                  </span>
                </div>
                <Button
                  onClick={() => onGeneratePrescription(treatment._id)}
                  variant="success"
                  size="small"
                  className="flex items-center gap-2"
                >
                  <FaFilePrescription />
                  Generate Prescription
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TreatmentCard;