import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  options = [],
  placeholder = '',
  required = false,
  disabled = false,
  loading = false,
  error = '',
  helpText = '',
  icon: Icon,
  showPasswordToggle = false,
  className = ''
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputType = showPasswordToggle && type === 'password'
    ? (showPassword ? 'text' : 'password')
    : type;

  return (
    <div className={`mb-6 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        
        {type === 'select' ? (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled || loading}
            required={required}
            className={`w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors ${disabled || loading ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-70' : ''} ${Icon ? 'pl-10 pr-4' : 'px-4'} py-3 appearance-none`}
          >
            <option value="">Select {label?.toLowerCase() || 'option'}</option>
            {loading ? (
              <option disabled>Loading options...</option>
            ) : (
              options.map((option) => (
                <option key={option.value || option._id || option} value={option.value || option._id || option}>
                  {option.label || option.name || option}
                </option>
              ))
            )}
          </select>
        ) : (
          <input
            type={inputType}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled || loading}
            required={required}
            className={`w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors ${disabled || loading ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-70' : ''} ${Icon ? 'pl-10 pr-4' : 'px-4'} ${showPasswordToggle ? 'pr-10' : ''} py-3`}
          />
        )}
        
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
            disabled={disabled || loading}
          >
            {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
          </button>
        )}
        
        {loading && !showPasswordToggle && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      
      {helpText && !error && (
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{helpText}</p>
      )}
      
      {error && (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400" role="alert">{error}</p>
      )}
    </div>
  );
};

export default FormField;