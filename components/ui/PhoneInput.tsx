"use client";

import React, { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Country, COUNTRIES } from "@/types/leadTypes";

interface PhoneInputProps {
  value: string;
  countryCode: string;
  onChange: (phone: string) => void;
  onCountryChange: (code: string) => void;
  placeholder?: string;
  required?: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  countryCode,
  onChange,
  onCountryChange,
  placeholder = "Enter phone number",
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCountry =
    COUNTRIES.find((c) => c.dialCode === countryCode) || COUNTRIES[0];

  const handleCountrySelect = (country: Country) => {
    onCountryChange(country.dialCode);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
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
    <div className="flex gap-2">
      {/* Country Selector */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-28 h-full border border-stroke rounded-xl px-3 py-3 text-sm text-body italic flex items-center gap-2 bg-white hover:border-primary transition-colors"
        >
          <span className="text-lg">{selectedCountry.flag}</span>
          <span className="text-xs font-medium">
            {selectedCountry.dialCode}
          </span>
          <ChevronDown
            className={`w-3 h-3 ml-auto opacity-50 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-stroke rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
            {COUNTRIES.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => handleCountrySelect(country)}
                className={`w-full px-3 py-2.5 flex items-center gap-3 hover:bg-primary/5 transition-colors text-left ${
                  country.dialCode === countryCode ? "bg-primary/10" : ""
                }`}
              >
                <span className="text-lg">{country.flag}</span>
                <span className="text-sm text-mainText flex-1">
                  {country.name}
                </span>
                <span className="text-xs text-body">{country.dialCode}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Phone Number Input */}
      <input
        type="tel"
        value={value}
        onChange={(e) => {
          // Only allow numbers
          const cleaned = e.target.value.replace(/\D/g, "");
          onChange(cleaned);
        }}
        placeholder={placeholder}
        required={required}
        className="flex-1 border border-stroke rounded-xl px-4 py-3 text-sm text-body italic focus:outline-none focus:border-primary placeholder:text-placeholder/50"
      />
    </div>
  );
};

export default PhoneInput;
