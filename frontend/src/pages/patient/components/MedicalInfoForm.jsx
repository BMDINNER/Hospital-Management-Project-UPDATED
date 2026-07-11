import React from 'react';
import FormField from '../../../components/common/FormField';
import { FaWeight, FaRulerVertical, FaTint, FaAllergies } from 'react-icons/fa';

const MedicalInfoForm = ({
  formData,
  onChange,
  isEditing,
  loading = false
}) => {
  const bloodGroupOptions = [
    { value: '', label: 'Select Blood Group' },
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
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white border-b pb-2">
        Medical Information
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Height (cm)"
          name="height"
          type="number"
          value={formData.height}
          onChange={onChange}
          disabled={!isEditing}
          icon={FaRulerVertical}
          loading={loading}
        />

        <FormField
          label="Weight (kg)"
          name="weight"
          type="number"
          value={formData.weight}
          onChange={onChange}
          disabled={!isEditing}
          icon={FaWeight}
          loading={loading}
        />
      </div>

      <FormField
        label="Age"
        name="age"
        type="number"
        value={formData.age}
        onChange={onChange}
        disabled={!isEditing}
        loading={loading}
      />

      <FormField
        label="Blood Group"
        name="bloodGroup"
        type="select"
        value={formData.bloodGroup}
        onChange={onChange}
        options={bloodGroupOptions}
        disabled={!isEditing}
        icon={FaTint}
        loading={loading}
      />

      <FormField
        label="Allergies"
        name="allergies"
        value={formData.allergies}
        onChange={onChange}
        placeholder="List any allergies..."
        disabled={!isEditing}
        icon={FaAllergies}
        loading={loading}
      />
    </section>
  );
};

export default MedicalInfoForm;