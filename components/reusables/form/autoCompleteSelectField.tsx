'use client';

import * as React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

interface SelectAutocompleteProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export function SelectAutocomplete({
  label,
  options,
  value,
  onChange,
  placeholder = "Select...",
  required = false,
  disabled = false,
}: SelectAutocompleteProps) {
  const [open, setOpen] = React.useState(false);
  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  return (
    <div className="space-y-1.5">
      <Label className="text-base text-black mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          className={cn(
            "w-full flex justify-between items-center shadow border-2 border-gray-300 rounded-md px-4 py-3 text-left text-sm",
            disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white"
          )}
          disabled={disabled}
        >
          <span className="text-base text-gray-500 font-regular">{selectedLabel || placeholder}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </PopoverTrigger>

        <PopoverContent className="w-full p-0 max-h-60 overflow-y-auto z-50">
          <Command>
            <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
            <CommandEmpty>No match found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
