import React from 'react';
import FormField from '../../../components/common/FormField';
import PasswordStrength from './PasswordStrength';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaVenusMars, 
  FaRulerVertical, 
  FaWeight, 
  FaBirthdayCake, 
  FaTint,
  FaHeartbeat, 
  FaAllergies 
} from 'react-icons/fa';

const RegisterFormFields = ({
  formData,
  handleInputChange,
  errors = {},
  loading = false
}) => {
  const genderOptions = [
    { value: 'prefer-not-to-say', label: 'Prefer not to say' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];

  const bloodGroupOptions = [
    { value: '', label: 'Select blood group' },
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' }
  ];

  return (
    <div className="space-y-4">
      
      <section className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <FaUser className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Personal Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="First Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            icon={FaUser}
            placeholder="Enter first name"
            error={errors?.name || ''}
            loading={loading}
          />

          <FormField
            label="Last Name"
            name="surname"
            value={formData.surname}
            onChange={handleInputChange}
            required
            icon={FaUser}
            placeholder="Enter last name"
            error={errors?.surname || ''}
            loading={loading}
          />
        </div>

        <FormField
          label="Gender"
          name="gender"
          type="select"
          value={formData.gender}
          onChange={handleInputChange}
          options={genderOptions}
          icon={FaVenusMars}
          loading={loading}
        />
      </section>

      <section className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <FaHeartbeat className="w-5 h-5 text-green-600 dark:text-green-400" />
          Medical Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Height (cm)"
            name="height"
            type="number"
            value={formData.height}
            onChange={handleInputChange}
            icon={FaRulerVertical}
            placeholder="e.g., 170"
            error={errors?.height || ''}
            loading={loading}
          />

          <FormField
            label="Weight (kg)"
            name="weight"
            type="number"
            value={formData.weight}
            onChange={handleInputChange}
            icon={FaWeight}
            placeholder="e.g., 65"
            error={errors?.weight || ''}
            loading={loading}
          />
        </div>

        <FormField
          label="Age"
          name="age"
          type="number"
          value={formData.age}
          onChange={handleInputChange}
          icon={FaBirthdayCake}
          placeholder="e.g., 25"
          error={errors?.age || ''}
          loading={loading}
        />

        <FormField
          label="Blood Group"
          name="bloodGroup"
          type="select"
          value={formData.bloodGroup}
          onChange={handleInputChange}
          options={bloodGroupOptions}
          icon={FaTint}
          loading={loading}
        />

        <FormField
          label="Allergies"
          name="allergies"
          value={formData.allergies}
          onChange={handleInputChange}
          icon={FaAllergies}
          placeholder="List any allergies..."
          loading={loading}
        />
      </section>

      <section className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <FaLock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          Account Information
        </h3>
        
        <FormField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          icon={FaEnvelope}
          placeholder="Enter your email"
          error={errors?.email || ''}
          loading={loading}
        />

        <div className="mb-6">
          <div className="relative">
            <FormField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              icon={FaLock}
              placeholder="Create a strong password"
              showPasswordToggle={true}
              error={errors?.password || ''}
              loading={loading}
            />
            {formData.password && (
              <div id="password-strength-indicator" className="mt-2">
                <PasswordStrength password={formData.password} />
              </div>
            )}
          </div>
        </div>

        <FormField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          required
          icon={FaLock}
          placeholder="Confirm your password"
          showPasswordToggle={true}
          error={errors?.confirmPassword || ''}
          loading={loading}
        />
      </section>
    </div>
  );
};

export default RegisterFormFields;