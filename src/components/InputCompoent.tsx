import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const InputComponent: React.FC<InputProps> = ({ label, error, ...rest }) => {
  return (
    <div>
      <label
        htmlFor={rest.id || rest.name}
        className="block text-sm font-medium text-gray-400"
      >
        {label}
      </label>
      <input
        {...rest}
        className={`text-white bg-gray-700 p-2 min-h-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${error ? "border-red-500" : ""}`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default InputComponent;
