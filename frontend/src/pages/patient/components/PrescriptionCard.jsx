import React from 'react';
import { 
  FaHospital, 
  FaUserMd, 
  FaStethoscope,
  FaCalendarDay,
  FaClock,
  FaCapsules
} from 'react-icons/fa';

const PrescriptionCard = ({
  prescription,
  formatDate
}) => {
  return (
    <article className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
            {prescription.hospitalName}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
            <FaUserMd />  {prescription.doctorName} • <FaStethoscope /> {prescription.department}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
            <FaCalendarDay /> {formatDate(prescription.appointmentDate)} • <FaClock /> {prescription.appointmentTime}
          </p>
        </div>
        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
          Prescribed
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Diagnosis</h4>
          <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            {prescription.diagnosis || 'No diagnosis recorded'}
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Instructions</h4>
          <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            {prescription.instructions || 'No specific instructions'}
          </p>
        </div>
      </div>

      {prescription.medications && prescription.medications.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <FaCapsules /> Medications ({prescription.medications.length})
          </h4>
          <div className="space-y-2">
            {prescription.medications.map((med, medIndex) => (
              <div key={medIndex} className="flex justify-between items-center bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <div>
                  <span className="font-medium text-gray-800 dark:text-white">{med.name}</span>
                  {med.genericName && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Generic: {med.genericName}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Dosage:</strong> {med.dosage}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Frequency:</strong> {med.frequency}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Duration:</strong> {med.duration}
                  </p>
                  {med.instructions && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Instructions:</strong> {med.instructions}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {prescription.followUpDate && (
        <div className="mt-4">
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Follow-up</h4>
          <p className="text-gray-600 dark:text-gray-400">
            Recommended follow-up: {formatDate(prescription.followUpDate)}
          </p>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Prescribed on: {prescription.prescribedAt ? new Date(prescription.prescribedAt).toLocaleDateString() : 'Not specified'}
        </p>
      </div>
    </article>
  );
};

export default PrescriptionCard;