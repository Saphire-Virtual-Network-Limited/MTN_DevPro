"use client"

import { getNewDevices, showToast } from "@/lib"
import React, { useEffect, useState } from "react"
import { BackButton, ContinueResetBtn, SelectField } from "@/components/reusables"
import { useRouter } from "next/navigation"
import { DeviceDetail } from "@/lib/api"


const colorOptions = [
  { label: "Jet Black", value: "jet-black" },
  { label: "Blue Shadow", value: "blue-shadow" },
  { label: "Silver Shadow", value: "silver-shadow" },
]

export function SwapDeviceView() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deviceData, setDeviceData] = useState<DeviceDetail[]>([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [selectedColor, setSelectedColor] = useState("");


  useEffect(() => {
    const fetchNewDevices = async () => {
      setIsLoading(true);

      try {
        const response = await getNewDevices("Fold 7", "Flip 7");
        const responseData = response.data || [];

        if (responseData.length === 0) {
          showToast({
            type: "error",
            message: "No devices found. Try again.",
            duration: 3000
          });
        }

        setDeviceData(responseData);
      } catch (error) {
        console.error("Failed to load new devices:", error);

        showToast({
          type: "error",
          message: "Failed to load devices. Please try again.",
          duration: 3000
        });

        setDeviceData([]); // prevent undefined errors
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewDevices();
  }, []);


  // Convert device data to SelectField options format
  const deviceOptions = deviceData.map(device => ({
    label: device.device_name,
    value: device.id
  }));


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isLoading) {
      showToast({
        type: "error",
        message: "Please wait, loading devices...",
        duration: 2500,
      });
      return;
    }

    if (!selectedDevice || !selectedColor) {
      showToast({
        type: "error",
        message: "Please select a device and color.",
        duration: 2500,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((res) => setTimeout(res, 1000));
      sessionStorage.setItem("deviceBrand", JSON.stringify(
        deviceData.find(device => device.id === selectedDevice)
      ));
      sessionStorage.setItem("newSelectedColor", selectedColor);

      router.push("/old-device-eligibility");
    } catch (error) {
      console.error(error);
      showToast({ type: "error", message: "Failed to proceed. Try again.", duration: 3000 });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 lg:gap-12 pb-8 lg:py-16">
      <div className="">
        <BackButton />
      </div>

      <div className="flex justify-center lg:justify-start">
        <div className="text-start space-y-8 w-full max-w-xl">
          <h2 className="text-[28px] lg:text-4xl text-primary font-medium">
            Samsung Galaxy Z Fold 7<br />
            <span className="font-semibold text-primary">Trade-in Portal</span>
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-start gap-8 pb-6">
              <SelectField
                label="Which Device Do You Want?"
                htmlFor="device"
                id="device"
                placeholder={isLoading ? "Loading devices..." : "Select New Device Name"}
                isInvalid={false}
                errorMessage=""
                value={selectedDevice}
                onChange={setSelectedDevice}
                options={isLoading ? [] : deviceOptions}
                disabled={isLoading}
                required
              />

              <SelectField
                label="Preferred Color"
                htmlFor="color"
                id="color"
                placeholder="Select Color"
                isInvalid={false}
                errorMessage=""
                value={selectedColor}
                onChange={setSelectedColor}
                options={colorOptions}
                required
              />

              <ContinueResetBtn
                continueText="Continue"
                resetText="Reset"
                isLoading={isSubmitting}
                disabled={!selectedDevice || !selectedColor || isLoading}
                onReset={() => {
                  setSelectedDevice("");
                  setSelectedColor("");
                }}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}