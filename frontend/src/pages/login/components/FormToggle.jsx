import React from 'react';
import { FaExchangeAlt } from 'react-icons/fa';

const FormToggle = ({ isLogin, onToggle }) => {
  return (
    <div className="mt-6 text-center">
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
      >
        <FaExchangeAlt className="w-4 h-4" />
        <span>{isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}</span>
      </button>
    </div>
  );
};

export default FormToggle;