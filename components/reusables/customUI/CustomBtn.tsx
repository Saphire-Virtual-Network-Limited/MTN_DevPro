"use client";

import React from "react";
import { Button } from "@heroui/react";
import { cn } from "@/lib/utils";
import { Figtree_SemiBold } from "@/lib";

interface CustomBtnProps {
  isLoading: boolean;
  continueText?: string;
  disabled?: boolean
}

export const CustomBtn: React.FC<CustomBtnProps> = ({
  isLoading,
  continueText = "Continue",
  disabled
}) => {
  return (
    <div className="w-full flex items-center justify-center gap-4">
      <div className="w-full">

        <Button
          type="submit"
          radius="md"
          size="lg"
          isLoading={isLoading}
          isDisabled={disabled}
          className={cn(
            "w-full text-white font-semibold py-4 px-8 text-lg rounded-md cursor-pointer flex items-center justify-center gap-2",
            "bg-[#0F52BA]",
            isLoading && "opacity-50 cursor-not-allowed",
            Figtree_SemiBold.className
          )}
        >
          {continueText}
        </Button>

      </div>
    </div>
  );
};
