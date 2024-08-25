import React, { useState, useRef, useEffect } from "react";

interface DropdownProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block w-full text-[12px] md:text-[14px]" ref={dropdownRef}>
      <label
        htmlFor={label}
        className="mb-1 block text-sm font-medium text-gray-100"
      >
        {label}
      </label>
      <button
        onClick={toggleDropdown}
        type="button"
        className="flex w-full rounded-md bg-gray-700 px-4 py-2 text-left text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {options.find((opt) => opt.value === value)?.label ||
          "Select an option"}
        <svg
          className={`ml-auto h-5 w-5 transform transition-transform ${isOpen ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <ul
        className={`absolute z-10 mt-1 w-full divide-y divide-gray-600 rounded-md bg-gray-700 shadow-lg max-h-[180px] overflow-auto ${
          isOpen ? "block" : "hidden"
        }`}
      >
        {options.map((option) => (
          <li
            key={option.value}
            className="cursor-pointer px-4 py-2 hover:bg-gray-600"
          >
            <button
              type="button"
              onClick={() => handleOptionClick(option.value)}
              className="w-full text-left text-gray-100"
            >
              {option.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dropdown;
