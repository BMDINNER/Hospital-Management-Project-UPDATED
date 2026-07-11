import React from 'react';
import FormField from '../../../components/common/FormField';
import { FaEnvelope, FaLock } from 'react-icons/fa';

const LoginFormFields = ({
  formData,
  handleInputChange,
  errors = {},
  loading = false
}) => {
  return (
    <div className="space-y-4">
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

      <FormField
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleInputChange}
        required
        icon={FaLock}
        placeholder="Enter your password"
        showPasswordToggle={true}
        error={errors?.password || ''}
        loading={loading}
      />
    </div>
  );
};

export default LoginFormFields;