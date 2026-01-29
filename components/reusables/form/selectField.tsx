"use client";

import React, { ChangeEvent } from "react";
import { Select, SelectItem } from "@heroui/react";
import { Label } from "@/components/ui/label";

interface SelectFieldProps {
  label: string;
  htmlFor?: string;
  id: string;
  isInvalid?: boolean;
  errorMessage?: string;
  placeholder: string;
  value?: string;
  onChange: (value: string) => void;
  required?: boolean;
  options: { label: string; value: string }[];
  disabled?: boolean
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  htmlFor,
  id,
  isInvalid,
  errorMessage,
  placeholder,
  value,
  onChange,
  required,
  options,
  disabled
}) => {

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="flex flex-col space-y-1.5">
      <Label htmlFor={htmlFor} className="text-base text-[#3A3A3A] font-medium">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>

      <Select
        id={id}
        aria-label={label}
        aria-invalid={isInvalid ? "true" : "false"}
        aria-describedby={isInvalid ? `${id}-error` : undefined}
        required={required}
        placeholder={placeholder}
        onChange={(value) => handleChange(value)}
        radius="md"
        size="lg"
        variant="bordered"
        value={value}
        classNames={{
          base: " rounded-lg bg-white text-black",
          trigger: [
            "p-6",
            "rounded-lg",
            "text-[#333333CC]",
            "data-[placeholder-shown=true]:text-[#333333CC]",
            "[&>span]:text-gray-500",
            "[&>svg]:right-2 [&>svg]:left-auto",
          ],
          listbox: "bg-white z-[999] rounded-lg shadow-lg text-[#333333CC]",
        }}
        disabled={disabled}
      >
        {options.map((option) => (
          <SelectItem
            key={option.value}
            // Remove the 'value' prop since it's not allowed
            className="bg-transparent placeholder:text-[#333333CC]"
          // Use 'key' only and display text via children
          >
            {option.label}
          </SelectItem>
        ))}
      </Select>

      {isInvalid && (
        <div className="text-red-500 text-xs">{errorMessage}</div>
      )}
    </div>
  );
};

export default SelectField;
