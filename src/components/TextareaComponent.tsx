import React from "react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

const TextareaComponent: React.FC<TextareaProps> = ({
  label,
  error,
  ...rest
}) => {
  return (
    <div>
      <label
        htmlFor={rest.id || rest.name}
        className="block text-sm font-medium text-gray-400"
      >
        {label}
      </label>
      <textarea
        {...rest}
        className={`text-white bg-gray-700 p-2 min-h-[150px] max-h-[550px] mt-1 flex w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm overflow-auto ${
          error ? "border-red-500" : ""
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default TextareaComponent;