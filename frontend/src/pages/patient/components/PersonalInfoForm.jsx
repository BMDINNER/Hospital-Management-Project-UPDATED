import React from 'react';
import FormField from '../../../components/common/FormField';
import { FaUser, FaEnvelope, FaVenusMars } from 'react-icons/fa';

const PersonalInfoForm = ({
  formData,
  onChange,
  isEditing,
  userEmail,
  loading = false
}) => {
  const genderOptions = [
    { value: 'prefer-not-to-say', label: 'Prefer not to say' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white border-b pb-2">
        Personal Information
      </h2>
      
      <FormField
        label="First Name"
        name="name"
        value={formData.name}
        onChange={onChange}
        disabled={!isEditing}
        required
        icon={FaUser}
        loading={loading}
      />

      <FormField
        label="Last Name"
        name="surname"
        value={formData.surname}
        onChange={onChange}
        disabled={!isEditing}
        required
        loading={loading}
      />

      <FormField
        label="Email"
        name="email"
        type="email"
        value={userEmail || ''}
        disabled
        icon={FaEnvelope}
      />

      <FormField
        label="Gender"
        name="gender"
        type="select"
        value={formData.gender}
        onChange={onChange}
        options={genderOptions}
        disabled={!isEditing}
        icon={FaVenusMars}
        loading={loading}
      />
    </section>
  );
};

export default PersonalInfoForm;