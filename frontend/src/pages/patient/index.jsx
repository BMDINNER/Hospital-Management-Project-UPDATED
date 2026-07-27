import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@bmdinner/logreg';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggle from '../../components/common/ThemeToggle';
import VerticalNavigation from './components/VerticalNavigation';
import ProfileHeader from './components/ProfileHeader';
import PersonalInfoForm from './components/PersonalInfoForm';
import MedicalInfoForm from './components/MedicalInfoForm';
import ActiveAppointments from './components/ActiveAppointments';
import CancelAppointmentModal from './components/CancelAppointmentModal';
import TreatmentCard from './components/TreatmentCard';
import PrescriptionCard from './components/PrescriptionCard';
import Button from '../../components/common/Button';
import FormField from '../../components/common/FormField';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import { 
  FaSave, 
  FaHistory, 
  FaFilePrescription,
  FaSync,
  FaTimes
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const API_URL = '/api';

const PatientProfile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDarkMode } = useTheme();
  
  const [currentView, setCurrentView] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    gender: '',
    age: '',
    height: '',
    weight: '',
    bloodGroup: '',
    allergies: ''
  });
  
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  
  const [cancelModal, setCancelModal] = useState({ 
    isOpen: false, 
    appointment: null 
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  useEffect(() => {
    if (user) {
      setNewEmail(user.email || '');
    }
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        fetchAppointments();
        fetchPrescriptions();
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchPatientData();
      fetchAppointments();
      fetchPrescriptions();
    }
  }, [user]);

  const fetchPatientData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/user/profile`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setFormData({
          name: data.user.name || '',
          surname: data.user.surname || '',
          gender: data.user.gender || '',
          age: data.user.age || '',
          height: data.user.height || '',
          weight: data.user.weight || '',
          bloodGroup: data.user.bloodGroup || '',
          allergies: data.user.allergies || ''
        });
      }
    } catch (error) {
      console.error('Error fetching patient data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`${API_URL}/user/appointments`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setAppointments(data.appointments || []);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchPrescriptions = async () => {
    try {
      const response = await fetch(`${API_URL}/user/prescriptions`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        setPrescriptions(data.prescriptions || []);
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    }
  };

  const handleRefreshData = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchPatientData(),
        fetchAppointments(),
        fetchPrescriptions()
      ]);
      toast.success('Data refreshed');
    } finally {
      setRefreshing(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/user/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        setIsEditing(false);
        toast.success('Profile updated successfully');
        fetchPatientData();
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async () => {
    if (!newEmail || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!newEmail.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/auth/email`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newEmail, password })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Email updated successfully. Please log in again with your new email.');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
        await logout();
        navigate('/login');
      } else {
        toast.error(data.message || 'Failed to update email');
      }
    } catch (error) {
      console.error('Email update error:', error);
      toast.error(error.message || 'Failed to update email');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    toast.error('Please fill in all fields');
    return;
  }

  if (newPassword.length < 6) {
    toast.error('New password must be at least 6 characters');
    return;
  }

  if (newPassword !== confirmNewPassword) {
    toast.error('Passwords do not match');
    return;
  }

  setLoading(true);
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/auth/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });

    const data = await response.json();
    
    if (data.success) {
      toast.success('Password changed successfully. Please log in again with your new password.');
      
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
      
      await logout();
      navigate('/login');
    } else {
      toast.error(data.message || 'Failed to change password');
    }
  } catch (error) {
    console.error('Change password error:', error);
    toast.error(error.message || 'Failed to change password');
  } finally {
    setLoading(false);
  }
};

  const handleCancelAppointment = async (appointment) => {
    setCancelModal({ isOpen: true, appointment });
  };

  const confirmCancelAppointment = async () => {
    if (!cancelModal.appointment) return;
    
    try {
      const response = await fetch(`${API_URL}/user/appointments/${cancelModal.appointment._id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Appointment cancelled');
        fetchAppointments();
        setCancelModal({ isOpen: false, appointment: null });
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Failed to cancel appointment');
    }
  };

  const handleBookAppointment = () => {
    navigate('/appointment');
  };

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  const formatAppointmentDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleGeneratePrescription = async (appointmentId) => {
    try {
      const response = await fetch(`${API_URL}/user/prescriptions/generate/${appointmentId}`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Prescription generated');
        fetchPrescriptions();
        fetchAppointments();
      }
    } catch (error) {
      console.error('Error generating prescription:', error);
      toast.error('Failed to generate prescription');
    }
  };

  const getActiveAppointments = () => {
    return appointments.filter(apt => apt.status === 'confirmed');
  };

  const getCompletedTreatments = () => {
    return appointments.filter(apt => apt.status === 'completed');
  };

  const renderProfileView = () => {
    const activeAppointments = getActiveAppointments();
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Profile Information</h2>
          <Button
            onClick={handleRefreshData}
            variant="secondary"
            size="small"
            loading={refreshing}
            className="flex items-center gap-2"
          >
            <FaSync />
            Refresh
          </Button>
        </div>
        
        <PersonalInfoForm 
          formData={formData}
          onChange={handleFormChange}
          isEditing={isEditing}
          userEmail={user?.email}
          loading={loading}
        />
        <MedicalInfoForm 
          formData={formData}
          onChange={handleFormChange}
          isEditing={isEditing}
          loading={loading}
        />
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Account Settings</h3>
          
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-100 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 sm:w-32">Email</span>
              {isEditingEmail ? (
                <div className="flex-1 flex flex-col sm:flex-row gap-3">
                  <FormField
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="New email address"
                    className="flex-1"
                    name="newEmail"
                    label=""
                  />
                  <FormField
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Current password"
                    className="flex-1"
                    name="password"
                    label=""
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleUpdateEmail}
                      loading={loading}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                      <FaSave className="mr-2" />
                      Save
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setIsEditingEmail(false);
                        setNewEmail(user?.email || '');
                        setPassword('');
                      }}
                    >
                      <FaTimes className="mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-gray-900 dark:text-white">{user?.email}</span>
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => {
                      setIsEditingEmail(true);
                      setNewEmail(user?.email || '');
                    }}
                  >
                    Change Email
                  </Button>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-100 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 sm:w-32">Password</span>
              {isChangingPassword ? (
                <div className="flex-1 flex flex-col sm:flex-row gap-3">
                  <FormField
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Current password"
                    className="flex-1"
                    name="currentPassword"
                    label=""
                  />
                  <FormField
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    className="flex-1"
                    name="newPassword"
                    label=""
                  />
                  <FormField
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="flex-1"
                    name="confirmNewPassword"
                    label=""
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleChangePassword}
                      loading={loading}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                      <FaSave className="mr-2" />
                      Save
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setIsChangingPassword(false);
                        setCurrentPassword('');
                        setNewPassword('');
                        setConfirmNewPassword('');
                      }}
                    >
                      <FaTimes className="mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">••••••••</span>
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => setIsChangingPassword(true)}
                  >
                    Change Password
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {isEditing && (
          <Button
            onClick={handleSaveProfile}
            className="mt-6"
            loading={loading}
          >
            <FaSave className="mr-2" />
            Save Changes
          </Button>
        )}
        
        <ActiveAppointments 
          appointments={activeAppointments}
          onCancelAppointment={handleCancelAppointment}
          formatAppointmentDate={formatAppointmentDate}
          loading={loading}
        />
        
        {activeAppointments.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-blue-600 dark:text-blue-400 text-sm">
              Appointments will automatically expire and move to Previous Treatments within 15 seconds of booking for testing purposes.
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderTreatmentsView = () => {
    const completedTreatments = getCompletedTreatments();
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Previous Treatments ({completedTreatments.length})
          </h2>
          <Button
            onClick={handleRefreshData}
            variant="secondary"
            size="small"
            loading={refreshing}
            className="flex items-center gap-2"
          >
            <FaSync />
            Refresh
          </Button>
        </div>
        
        {completedTreatments.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <FaHistory className="w-16 h-16 mx-auto mb-4" />
            <p className="text-lg">No previous treatments found</p>
            <p className="text-sm mt-2">Active appointments will appear here after they expire (15 seconds after booking)</p>
          </div>
        ) : (
          completedTreatments.map(treatment => {
            const prescription = prescriptions.find(p => p.appointmentId === treatment._id);
            return (
              <TreatmentCard 
                key={treatment._id}
                treatment={treatment}
                prescription={prescription}
                onGeneratePrescription={handleGeneratePrescription}
                formatDate={formatAppointmentDate}
              />
            );
          })
        )}
      </div>
    );
  };

  const renderPrescriptionsView = () => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Prescriptions ({prescriptions.length})
          </h2>
          <Button
            onClick={handleRefreshData}
            variant="secondary"
            size="small"
            loading={refreshing}
            className="flex items-center gap-2"
          >
            <FaSync />
            Refresh
          </Button>
        </div>
        
        {prescriptions.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <FaFilePrescription className="w-16 h-16 mx-auto mb-4" />
            <p className="text-lg">No prescriptions found</p>
            <p className="text-sm mt-2">Prescriptions are automatically generated when appointments expire</p>
          </div>
        ) : (
          prescriptions.map(prescription => (
            <PrescriptionCard 
              key={prescription._id}
              prescription={prescription}
              formatDate={formatAppointmentDate}
            />
          ))
        )}
      </div>
    );
  };

  const renderView = () => {
    switch (currentView) {
      case 'profile':
        return renderProfileView();
      case 'treatments':
        return renderTreatmentsView();
      case 'prescriptions':
        return renderPrescriptionsView();
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900`}>
      <ThemeToggle />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ProfileHeader 
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          onLogout={handleLogout}
          loading={loading}
        />
        
        <div className="flex flex-col lg:flex-row gap-8">
          <VerticalNavigation 
            currentView={currentView}
            setCurrentView={setCurrentView}
            previousTreatmentsCount={getCompletedTreatments().length}
            prescriptionsCount={prescriptions.length}
            onBookAppointment={handleBookAppointment}
            onLogout={handleLogout}
          />
          
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              {loading && currentView === 'profile' ? (
                <LoadingOverlay message="Loading profile..." />
              ) : (
                renderView()
              )}
            </div>
          </div>
        </div>
      </div>

      <CancelAppointmentModal 
        isOpen={cancelModal.isOpen}
        onClose={() => setCancelModal({ isOpen: false, appointment: null })}
        appointment={cancelModal.appointment}
        onConfirm={confirmCancelAppointment}
      />
    </div>
  );
};

export default PatientProfile;