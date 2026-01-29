"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@heroui/react";


interface BackButtonProps {

  className?: string;
}

export const BackButton = ({ className = "" }: BackButtonProps) => {
  const router = useRouter();

  return (
    <button
      //variant="ghost"
      //size="sm"
      onClick={() => router.back()}
      className={`flex justify-start items-center text-xs lg:text-sm text-gray-700 hover:text-black rounded-lg border p-2 px-3 ${className}`}
    >
      <ArrowLeft className="w-3 h-3 lg:w-4 lg:h-4" />

    </button>
  );
};
