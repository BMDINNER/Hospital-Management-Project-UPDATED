import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import TimeSlotButton from './TimeSlotButton';
import Button from '../common/Button';
import FormField from '../common/FormField';
import LoadingOverlay from '../common/LoadingOverlay';
import { 
  FaCalendarAlt, 
  FaArrowLeft, 
  FaClock,
  FaSpinner,
  FaCheck,
  FaExclamationTriangle,
  FaHospital,
  FaStethoscope,
  FaMapMarkerAlt,
  FaUserMd,
  FaCalendarDay
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const API_URL = '/api';

const Appointment = ({ user }) => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  
  const [formData, setFormData] = useState({
    location: '',
    hospitalId: '',
    departmentId: '',
    doctorId: '',
    appointmentDate: '',
    appointmentTime: ''
  });

  const [locations, setLocations] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null);

  const getUserId = () => {
    if (!user) return null;
    return user._id || user.id || user.userId;
  };

  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded._id || decoded.id || decoded.userId || decoded.sub;
    } catch (error) {
      return null;
    }
  };

  const isFormValid = () => {
    return formData.location && formData.hospitalId && formData.departmentId && formData.doctorId && formData.appointmentDate && formData.appointmentTime;
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [locationsRes, departmentsRes] = await Promise.all([
          fetch(`${API_URL}/hospital/locations`),
          fetch(`${API_URL}/hospital/departments`)
        ]);
        const locationsData = await locationsRes.json();
        const departmentsData = await departmentsRes.json();
        if (locationsData.success) {
          setLocations(locationsData.locations.map(loc => ({ value: loc, label: loc })));
        }
        if (departmentsData.success) {
          setDepartments(departmentsData.departments.map(dept => ({ value: dept._id, label: dept.name })));
        }
      } catch (err) {
        toast.error('Failed to load initial data');
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    try {
      if (name === 'location') {
        setFormData(prev => ({ ...prev, hospitalId: '', departmentId: '', doctorId: '', appointmentTime: '' }));
        setHospitals([]);
        setAvailableDoctors([]);
        setAvailableSlots([]);
        const response = await fetch(`${API_URL}/hospital/hospitals/${value}`);
        const data = await response.json();
        if (data.success) {
          setHospitals(data.hospitals.map(hosp => ({ value: hosp._id, label: hosp.name })));
        }
      } else if (name === 'hospitalId') {
        setFormData(prev => ({ ...prev, departmentId: '', doctorId: '', appointmentTime: '' }));
        setAvailableDoctors([]);
        setAvailableSlots([]);
      } else if (name === 'departmentId') {
        setFormData(prev => ({ ...prev, doctorId: '', appointmentTime: '' }));
        setAvailableDoctors([]);
        setAvailableSlots([]);
        if (formData.hospitalId && value) {
          setDoctorsLoading(true);
          try {
            const response = await fetch(`${API_URL}/hospital/doctors/${value}/${formData.hospitalId}`);
            const data = await response.json();
            if (data.success) {
              setAvailableDoctors(data.doctors.map(doc => ({ value: doc._id, label: `${doc.name} - ${doc.specialty}` })));
            }
          } finally {
            setDoctorsLoading(false);
          }
        }
      } else if (name === 'doctorId') {
        setFormData(prev => ({ ...prev, appointmentTime: '' }));
        setAvailableSlots([]);
      }
    } catch (err) {
      toast.error('Failed to load data');
    }
  };

  const handleDateChange = async (e) => {
    const date = e.target.value;
    setFormData(prev => ({ ...prev, appointmentDate: date, appointmentTime: '' }));
    setAvailableSlots([]);
    if (formData.doctorId && formData.hospitalId && date) {
      await fetchAvailableSlots(formData.doctorId, formData.hospitalId, date);
    }
  };

  const fetchAvailableSlots = async (doctorId, hospitalId, date) => {
    try {
      setSlotsLoading(true);
      const response = await fetch(`${API_URL}/hospital/slots/${doctorId}/${hospitalId}/${date}`);
      const data = await response.json();
      if (data.success) {
        setAvailableSlots(data.availableSlots || []);
      }
    } catch (err) {
      toast.error('Failed to load available slots');
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleTimeSlotSelect = (slot) => {
    setFormData(prev => ({ ...prev, appointmentTime: slot.startTime }));
  };

  const handleBackToProfile = () => {
    navigate('/patient');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast.error('Please fill all required fields');
      return;
    }

    let userId = getUserId();
    if (!userId) {
      userId = getUserIdFromToken();
    }
    if (!userId) {
      setBookingStatus({ type: 'error', message: 'User information not found. Please log in again.' });
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    setBookingLoading(true);
    setBookingStatus({ type: 'loading', message: 'Booking appointment...' });

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }
      
      const response = await fetch(`${API_URL}/user/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: userId,
          hospitalId: formData.hospitalId,
          departmentId: formData.departmentId,
          doctorId: formData.doctorId,
          appointmentDate: formData.appointmentDate,
          appointmentTime: formData.appointmentTime
        })
      });
      
      const data = await response.json();

      if (response.ok && data.success) {
        setBookingStatus({ type: 'success', message: 'Appointment booked successfully' });
        toast.success('Appointment booked successfully');
        setTimeout(() => navigate('/patient'), 2000);
      } else {
        throw new Error(data.message || 'Failed to book appointment');
      }
    } catch (err) {
      setBookingStatus({ type: 'error', message: `Error: ${err.message}` });
      toast.error(err.message || 'Failed to book appointment');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <LoadingOverlay message="Loading appointment data..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToProfile}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <FaArrowLeft />
                <span>Back to Profile</span>
              </button>
              <div className="flex items-center space-x-2">
                <FaCalendarAlt className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Book Appointment</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              {bookingStatus && (
                <div className={`mb-6 p-4 rounded-lg ${
                  bookingStatus.type === 'success' 
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                    : bookingStatus.type === 'error'
                    ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                    : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                }`}>
                  <div className="flex items-center space-x-3">
                    {bookingStatus.type === 'success' && <FaCheck className="text-green-600 dark:text-green-400" />}
                    {bookingStatus.type === 'error' && <FaExclamationTriangle className="text-red-600 dark:text-red-400" />}
                    {bookingStatus.type === 'loading' && <FaSpinner className="animate-spin text-blue-600 dark:text-blue-400" />}
                    <p className={`font-medium ${
                      bookingStatus.type === 'success' 
                        ? 'text-green-800 dark:text-green-300'
                        : bookingStatus.type === 'error'
                        ? 'text-red-800 dark:text-red-300'
                        : 'text-blue-800 dark:text-blue-300'
                    }`}>
                      {bookingStatus.message}
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <FormField
                  label="Location"
                  name="location"
                  type="select"
                  value={formData.location}
                  onChange={handleInputChange}
                  options={locations}
                  required
                  icon={FaMapMarkerAlt}
                  disabled={loading}
                />

                <FormField
                  label="Hospital"
                  name="hospitalId"
                  type="select"
                  value={formData.hospitalId}
                  onChange={handleInputChange}
                  options={hospitals}
                  required
                  icon={FaHospital}
                  disabled={!formData.location || loading}
                />

                <FormField
                  label="Department"
                  name="departmentId"
                  type="select"
                  value={formData.departmentId}
                  onChange={handleInputChange}
                  options={departments}
                  required
                  icon={FaStethoscope}
                  disabled={!formData.hospitalId || loading}
                />

                <FormField
                  label="Doctor"
                  name="doctorId"
                  type="select"
                  value={formData.doctorId}
                  onChange={handleInputChange}
                  options={availableDoctors}
                  required
                  icon={FaUserMd}
                  disabled={!formData.departmentId || doctorsLoading}
                  loading={doctorsLoading}
                />

                <FormField
                  label="Appointment Date"
                  name="appointmentDate"
                  type="date"
                  value={formData.appointmentDate}
                  onChange={handleDateChange}
                  required
                  icon={FaCalendarDay}
                  disabled={!formData.doctorId || loading}
                  min={new Date().toISOString().split('T')[0]}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FaClock className="inline-block mr-2" />
                    Select Time Slot
                    {slotsLoading && <FaSpinner className="animate-spin inline-block ml-2" />}
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {availableSlots.length === 0 && !slotsLoading ? (
                      <p className="text-gray-500 dark:text-gray-400 col-span-full text-center py-4">
                        {formData.appointmentDate ? 'No available slots for selected date' : 'Select a date to view available slots'}
                      </p>
                    ) : (
                      availableSlots.map((slot) => (
                        <TimeSlotButton
                          key={slot.startTime}
                          time={slot.startTime}
                          isAvailable={slot.isAvailable}
                          isSelected={formData.appointmentTime === slot.startTime}
                          onClick={() => handleTimeSlotSelect(slot)}
                          disabled={!slot.isAvailable}
                        />
                      ))
                    )}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    type="submit"
                    variant="primary"
                    size="large"
                    className="w-full"
                    loading={bookingLoading}
                    disabled={!isFormValid() || bookingLoading}
                  >
                    Book Appointment
                  </Button>
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
                Appointment Summary
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <FaMapMarkerAlt className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {formData.location || 'Not selected'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <FaHospital className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Hospital</p>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {hospitals.find(h => h.value === formData.hospitalId)?.label || 'Not selected'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <FaStethoscope className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Department</p>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {departments.find(d => d.value === formData.departmentId)?.label || 'Not selected'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                    <FaUserMd className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Doctor</p>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {availableDoctors.find(d => d.value === formData.doctorId)?.label || 'Not selected'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <FaCalendarDay className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date & Time</p>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {formData.appointmentDate && formData.appointmentTime
                        ? `${new Date(formData.appointmentDate).toLocaleDateString()} at ${formData.appointmentTime}`
                        : 'Not selected'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointment;