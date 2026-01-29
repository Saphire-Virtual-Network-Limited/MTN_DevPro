"use client";

import React from "react";
import { Button } from "@heroui/react";
import { cn } from "@/lib/utils";

interface ContinueResetBtnProps {
  isLoading: boolean;
  isFormValid?: boolean;
  continueText?: string;
  resetText?: string;
  onReset?: () => void;
  disabled?: boolean
}

export const ContinueResetBtn: React.FC<ContinueResetBtnProps> = ({
  isLoading,
  // isFormValid,
  continueText = "Continue",
  resetText = "Reset",
  onReset,
  disabled
}) => {
  return (
    <div className="w-full flex items-center justify-center gap-4">
      <div className="w-3/5">

        <Button
          type="submit"
          radius="md"
          size="lg"
          isLoading={isLoading}
          isDisabled={disabled}
          className={cn(
            "w-full text-white font-semibold py-4 px-8 text-lg rounded-md cursor-pointer flex items-center justify-center gap-2",
            "bg-[#0F52BA]",
            isLoading && "opacity-50 cursor-not-allowed"
          )}
        >
          {continueText}
        </Button>

      </div>
      <div className="w-2/5">
        <Button
          type="reset"
          radius="md"
          size="lg"
          onPress={onReset}
          className="w-full bg-[#00C1CA] text-white font-semibold py-4 px-8 text-lg rounded-md cursor-pointer flex items-center justify-center gap-2"
        >
          {resetText}
        </Button>
      </div>
    </div>
  );
};
