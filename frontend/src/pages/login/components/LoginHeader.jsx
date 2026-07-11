import React from 'react';
import { FaHospital, FaUserPlus, FaSignInAlt } from 'react-icons/fa';

const LoginHeader = ({ isLogin }) => {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
          <FaHospital className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
      
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </h1>
      
      <p className="text-gray-600 dark:text-gray-400 mt-2 flex items-center justify-center gap-2">
        {isLogin ? (
          <>
            <FaSignInAlt className="w-4 h-4" />
            Sign in to your account
          </>
        ) : (
          <>
            <FaUserPlus className="w-4 h-4" />
            Join us today
          </>
        )}
      </p>
    </div>
  );
};

export default LoginHeader;