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
        className="block text-[12px] md:text-[14px] font-medium text-gray-400"
      >
        {label}
      </label>
      <textarea
        {...rest}
        className={`text-white bg-gray-700 p-2 min-h-[150px] max-h-[350px] mt-1 flex w-full rounded-md border-gray-300 shadow-sm text-[12px] md:text-[14px] overflow-auto ${
          error ? "border-red-500" : ""
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default TextareaComponent;