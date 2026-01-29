'use client';

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "@heroui/react";
import { BackButton, ContinueResetBtn } from "@/components/reusables";
import { showToast } from "@/lib";

type ProtectionOption = {
  label: string;
  value: string;
  price: string;
  details: string[];
};

export function DeviceDetailView() {
  const router = useRouter();
  const [selectedProtection, setSelectedProtection] = useState<{ label: string; value: string, price: string } | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<any | null>(null);
  const [selectedNewDevice, setSelectedNewDevice] = useState<any | null>(null);
  const [isFetchingDevice, setIsFetchingDevice] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [protectionOptions, setProtectionOptions] = useState<ProtectionOption[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchDevice = useCallback(async () => {
    setIsFetchingDevice(true);
    setFetchError(null);

    try {
      const deviceData = sessionStorage.getItem("deviceBrand");
      const oldDeviceData = sessionStorage.getItem("oldDeviceData")

      if (!oldDeviceData) {
        throw new Error("No device found in session. Please start again.");
      }


      if (!deviceData) {
        throw new Error("No device found in session. Please start again.");
      }
      const parsedNewData = JSON.parse(deviceData);

      const newDevice = {
        brand: parsedNewData.deviceName?.toLowerCase().includes("samsung") ? "samsung" : "other",
        deviceName: parsedNewData.device_name || "Unknown Device",
        price: parsedNewData.price || 0,
        deviceImage: parsedNewData.device_image || "/fallback-image.png",
        sentinel_sap: parsedNewData.sentinel_sap ?? null,
        sentinel_sld: parsedNewData.sentinel_sld ?? null,
      };

      const parsedData = JSON.parse(oldDeviceData);

      const oldDevice = {
        brand: parsedData.deviceName?.toLowerCase().includes("samsung") ? "samsung" : "other",
        deviceName: parsedData.deviceName || "Unknown Device",
        price: parsedData.tradein_value || 0,
        deviceImage: parsedData.device_image || "/fallback-image.png",
        sentinel_sap: parsedData.sentinel_sap ?? null,
        sentinel_sld: parsedData.sentinel_sld ?? null,
      };

      setSelectedDevice(oldDevice);
      setSelectedNewDevice(newDevice);

      const dynamicOptions: ProtectionOption[] = [
        {
          label: "Screen And Liquid Damage",
          value: "SLD",
          price: newDevice.sentinel_sld?.toString() || "0",
          details: [
            "Insurance on Screen Damage for 12 months",
            "Insurance on Liquid Damage for 6 months",
          ],
        },
        {
          label: "Device Protection Anti-Theft",
          value: "SAP",
          price: newDevice.sentinel_sap?.toString() || "0",
          details: [
            "Device locking in case of theft",
            "Device Replacement with one generation less",
            "Insurance on Screen Damage for 12 months",
            "Insurance on Liquid Damage for 6 months",
          ],
        },
        {
          label: "I Don't Want Device Protection",
          value: "none",
          price: "",
          details: ["Device will not be covered by Sentinel Device Protection"],
        },
      ];

      setProtectionOptions(dynamicOptions);
    } catch (error: any) {
      console.error("Error fetching device:", error);
      setFetchError(error?.message || "Something went wrong.");
    } finally {
      setIsFetchingDevice(false);
    }
  }, []);

  useEffect(() => {
    fetchDevice();
  }, [fetchDevice]);




  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const numericPrice = selectedProtection?.price?.replace(/[₦,]/g, "") || "0";

    sessionStorage.setItem(
      "selectedProtection",
      JSON.stringify({
        label: selectedProtection?.label || "",
        value: selectedProtection?.value || "",
        price: numericPrice,
      })
    );

    try {
      await new Promise((res) => setTimeout(res, 1000));
      router.push("/customer-details");
    } catch (error) {
      console.error(error);
      showToast({ type: "error", message: "Failed to proceed. Try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push("/")
  }

  if (isFetchingDevice) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-primary"></div>
          <p className="text-sm text-gray-500">Fetching device details...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 text-center">
        <p className="text-sm text-red-600">{fetchError}</p>
        <button
          onClick={fetchDevice}
          className="px-4 py-2 text-white bg-primary rounded hover:bg-opacity-90 transition"
        >
          Retry
        </button>

        <Button
          type="button"
          radius="md"
          size="lg"
          onPress={handleBack}
          className="w-full text-white font-semibold py-4 px-8 text-lg rounded-md cursor-pointer flex items-center justify-center gap-2 bg-[#0F52BA]"
        >
          Back to Home
        </Button>
      </div>
    );
  }

  if (!selectedDevice) return null;



  return (
    <div className="w-full flex flex-col gap-4 lg:gap-12 pb-8 lg:py-16 overflow-y-auto">
      <div><BackButton /></div>

      <div className="text-start space-y-8 w-full h-full flex flex-col justify-center lg:justify-start">
        <h2 className="text-[28px] lg:text-4xl text-primary font-medium">
          {selectedDevice.deviceName}
          <br />
          <span className="font-semibold text-primary">Trade-in Portal</span>
        </h2>

        <div className="pr-2 space-y-10 max-w-xl pb-16">
          <div className="flex items-start gap-4 max-w-md">
            {/* <img
              src={selectedDevice.deviceImage}
              alt={selectedDevice.deviceName}
              className="rounded-md object-cover w-24 h-24"
              loading="lazy"
            /> */}
            <div>
              <h3 className="text-lg font-semibold text-primary">{selectedDevice.deviceName}</h3>
              <p className="text-xl font-semibold mt-2 text-[#3A3A3A]">Estimated Trade-in value:</p>
              <p className="text-2xl font-semibold text-[#3A3A3A]">
                {selectedDevice.price
                  ? `₦${selectedDevice.price.toLocaleString()}`
                  : "Price not available"}
              </p>
            </div>
          </div>

          <p className="text-base text-[#3A3A3A]">
            <span className="font-semibold text-primary">Note:</span> <br />
            This price depends on the actual physical condition of this device.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="border shadow-none p-6 rounded-lg space-y-8">
              <h2 className="text-2xl font-semibold text-primary max-w-md">
                Purchase Device Protection for {selectedNewDevice?.deviceName}
              </h2>

              {/* <h2 className="text-2xl font-semibold text-primary max-w-md">
                Purchase Device Protection for {selectedNewDevice.device_name}
              </h2> */}

              {protectionOptions.map((option) => (
                <label key={option.value} className="block space-y-1 cursor-pointer">
                  <input
                    type="radio"
                    name="protection"
                    value={option.value}
                    checked={selectedProtection?.label === option.label}
                    onChange={() =>
                      setSelectedProtection({ label: option.label, value: option.value, price: option.price })
                    }
                    className="mr-2"
                  />
                  <span className="text-primary font-semibold text-sm">
                    {option.label}
                    {option.price !== "0" && ` - ₦${Number(option.price).toLocaleString()}.00`}
                  </span>
                  <ul className="pl-6 list-disc text-sm text-gray-700">
                    {(option.details ?? []).map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                </label>
              ))}
            </Card>

            <ContinueResetBtn
              continueText="Continue"
              isLoading={isSubmitting}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
