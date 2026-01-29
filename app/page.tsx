"use client";

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("deviceBrand");
      sessionStorage.removeItem("newSelectedColor");
      sessionStorage.removeItem("oldDeviceData");
      sessionStorage.removeItem("selectedProtection");
    }
  }, []);

  const handleSwapDevice = () => {
    router.push("/swap-device");
  }

  return (
    <div className="w-full flex items-center justify-center lg:justify-start pt-28 lg:pt-0 px-4 lg:px-0">
      <div className="w-full max-w-md space-y-8 text-center">
        <h2 className="text-2xl lg:text-4xl text-primary font-medium">
          Samsung Galaxy Z Fold 7 Flip 7<br />
          <span className="font-semibold text-primary">Trade-in Portal</span>
        </h2>

        <div className="px-8">
          <Button
            className="w-full bg-primary text-white font-semibold py-4 px-8 text-lg rounded-md"
            size="lg"
            onPress={handleSwapDevice}
          >
            Swap Your Device
          </Button>
        </div>
      </div>
    </div>
  );
}