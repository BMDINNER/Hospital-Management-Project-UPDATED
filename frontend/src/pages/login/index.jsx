import React, { useState } from 'react';
import { useAuth } from '@bmdinner/logreg';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../../components/common/Button';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import ThemeToggle from '../../components/common/ThemeToggle';
import LoginHeader from './components/LoginHeader';
import LoginFormFields from './components/LoginFormFields';
import RegisterFormFields from './components/RegisterFormFields';
import FormToggle from './components/FormToggle';
import FormFooter from './components/FormFooter';
import { FaExclamationTriangle } from 'react-icons/fa';
import toast from 'react-hot-toast';

const API_URL = '/api';
const AUTH_URL = import.meta.env.VITE_AUTH_URL || '/auth';

const HospitalLogin = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    surname: '',
    height: '',
    weight: '',
    age: '',
    gender: 'prefer-not-to-say',
    bloodGroup: '',
    allergies: ''
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData.name) newErrors.name = 'First name is required';
      if (!formData.surname) newErrors.surname = 'Last name is required';
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      if (formData.height && (formData.height < 50 || formData.height > 250)) {
        newErrors.height = 'Height must be between 50 and 250 cm';
      }

      if (formData.weight && (formData.weight < 20 || formData.weight > 300)) {
        newErrors.weight = 'Weight must be between 20 and 300 kg';
      }

      if (formData.age && (formData.age < 0 || formData.age > 150)) {
        newErrors.age = 'Age must be between 0 and 150';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      if (isLogin) {
        const result = await login({
          email: formData.email,
          password: formData.password
        });
        
        toast.success('Login successful');
        navigate('/patient');
      } else {
        const authResult = await register({
          email: formData.email,
          password: formData.password,
          username: formData.name
        });

        const patientResponse = await fetch(`${API_URL}/user/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authResult.token}`
          },
          body: JSON.stringify({
            userId: authResult.user.id,
            email: formData.email,
            name: formData.name,
            surname: formData.surname,
            height: formData.height ? Number(formData.height) : null,
            weight: formData.weight ? Number(formData.weight) : null,
            age: formData.age ? Number(formData.age) : null,
            gender: formData.gender || 'prefer-not-to-say',
            bloodGroup: formData.bloodGroup || '',
            allergies: formData.allergies || ''
          })
        });

        if (!patientResponse.ok) {
          throw new Error('Failed to create patient profile');
        }

        toast.success('Registration successful! Please login.');
        
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
        
        setIsLogin(true);
        setFormData(prev => ({
          ...prev,
          password: '',
          confirmPassword: ''
        }));
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setErrors({ submit: err.message || 'Something went wrong!' });
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({
      email: isLogin ? formData.email : '',
      password: '',
      confirmPassword: '',
      name: '',
      surname: '',
      height: '',
      weight: '',
      age: '',
      gender: 'prefer-not-to-say',
      bloodGroup: '',
      allergies: ''
    });
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-cyan-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 relative">
        <ThemeToggle />
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-4xl">
          <LoginHeader isLogin={isLogin} />

          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-3">
                <FaExclamationTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
                <p className="text-red-600 dark:text-red-400 text-sm">{errors.submit}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {isLogin ? (
              <LoginFormFields 
                formData={formData} 
                handleInputChange={handleInputChange} 
                loading={loading} 
              />
            ) : (
              <RegisterFormFields 
                formData={formData} 
                handleInputChange={handleInputChange} 
                errors={errors}
                loading={loading} 
              />
            )}

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Forgot password?
              </button>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={loading}
                loading={loading}
                variant="primary"
                size="large"
                className="w-full flex items-center justify-center gap-2"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </div>
          </form>

          <FormToggle isLogin={isLogin} onToggle={toggleMode} />
          <FormFooter />

          {loading && (
            <LoadingOverlay 
              message={isLogin ? "Signing in..." : "Creating account..."} 
              show={loading} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HospitalLogin;