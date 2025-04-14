// components/Input.tsx

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({ label, type, value, onChange, required = false, placeholder = '', className = '' , ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          {...props}
          type={isPassword && showPassword ? 'text' : type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className="mt-1 w-full p-2 border rounded-lg focus:ring-4 focus:ring-gray-300 focus:border-gray-400 focus:outline-none hover:border-gray-400"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
