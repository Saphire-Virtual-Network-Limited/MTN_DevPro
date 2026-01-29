"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        {/* Logo Container */}
        <div className="relative w-48 h-24 sm:w-56 sm:h-28 md:w-64 md:h-32 lg:w-80 lg:h-40">
          <Image
            src="/mtn-sapphire.png"
            alt="MTN Sapphire Logo"
            fill
            sizes="(max-width: 640px) 192px, (max-width: 768px) 224px, (max-width: 1024px) 256px, 320px"
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}