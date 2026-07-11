import React from 'react';
import Button from '../../../components/common/Button';
import { FaUserEdit, FaSignOutAlt } from 'react-icons/fa';

const ProfileHeader = ({
  isEditing,
  setIsEditing,
  onLogout,
  loading
}) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        Patient Profile
      </h1>
      
      <div className="flex gap-4">
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "secondary" : "success"}
          className="flex items-center gap-2"
          disabled={loading}
        >
          <FaUserEdit />
          {isEditing ? 'Cancel Edit' : 'Edit Profile'}
        </Button>
        
        <Button
          onClick={onLogout}
          variant="danger"
          className="flex items-center gap-2"
          disabled={loading}
        >
          <FaSignOutAlt />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default ProfileHeader;