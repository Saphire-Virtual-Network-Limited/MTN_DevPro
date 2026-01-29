'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CustomBtn, FormField, SelectField } from "@/components/reusables";
import { cn, DeviceModelSchema, DeviceNameSchema, Figtree_Regular, Figtree_SemiBold, ImeiSchema, showToast, useField } from "@/lib";
import { ChevronLeft } from "lucide-react";

const ramOptions = [
  { label: "4GB", value: "4gb" },
  { label: "6GB", value: "6gb" },
  { label: "8GB", value: "8gb" },
];

const romOptions = [
  { label: "64GB", value: "64gb" },
  { label: "128GB", value: "128gb" },
  { label: "256GB", value: "256gb" },
];

const colorOptions = [
  { label: "Black", value: "black" },
  { label: "White", value: "white" },
  { label: "Pink", value: "pink" },
  { label: "Blue", value: "blue" },
  { label: "Grey", value: "grey" },

];

export function DeviceDetailView() {
  const router = useRouter();

  const {
    value: deviceName,
    error: deviceNameError,
    handleChange: handleDeviceNameChange,
  } = useField("", DeviceNameSchema);

  const {
    value: deviceModel,
    error: deviceModelError,
    handleChange: handleDeviceModelChange,
  } = useField("", DeviceModelSchema);

  const {
    value: phoneImei,
    error: deviceImeiError,
    handleChange: handleImeiChange,
  } = useField("", ImeiSchema);

  const [selectedRAM, setSelectedRAM] = useState<any | null>(null);
  const [selectedROM, setSelectedROM] = useState<any | null>(null);
  const [selectedColor, setSelectedColor] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      showToast({ message: "Device details saved successfully!", type: "success" });
      router.push("/order-summary");
    }, 1500);
  };

  return (
    <div className="w-full">
      <button onClick={() => router.back()}
        className="mb-8 p-2 hover:bg-gray-200 rounded-lg border inline-flex items-center justify-center">
        <ChevronLeft className="w-5 h-5 text-gray-600" />
      </button>


      {/* Header */}
      <div className="mb-6">
        <h2 className={cn("w-full text-[#202020] text-lg md:text-2xl font-semibold pb-4", Figtree_SemiBold.className)}>
          Device Details
        </h2>
        <p className={cn("w-full text-[#3A3A3A] text-sm md:text-base", Figtree_Regular.className)}>
          Kindly choose the correct device <br />options
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid w-full items-start gap-4 pb-6">

          <FormField
            id="deviceName"
            label="Device Name"
            htmlFor="deviceName"
            type="text"
            size="lg"
            placeholder="Enter your device name"
            value={deviceName}
            onChange={handleDeviceNameChange}
            required
            reqValue="*"
            errorMessage={deviceNameError}
            isInvalid={!!deviceNameError}
          />


          <FormField
            id="deviceModel"
            label="Device Model"
            htmlFor="deviceModel"
            type="text"
            size="lg"
            placeholder="Enter your device model"
            value={deviceModel}
            onChange={handleDeviceModelChange}
            required
            reqValue="*"
            errorMessage={deviceModelError}
            isInvalid={!!deviceModelError}
          />


          <SelectField
            label="RAM Variant"
            id="ram"
            placeholder="Select RAM"
            value={selectedRAM}
            onChange={setSelectedRAM}
            options={ramOptions}
            required
          />

          <SelectField
            label="ROM Variant (Storage)"
            id="rom"
            placeholder="Select Storage"
            value={selectedROM}
            onChange={setSelectedROM}
            options={romOptions}
            required
          />

          <SelectField
            label="Color"
            id="color"
            placeholder="Select Color"
            value={selectedColor}
            onChange={setSelectedColor}
            options={colorOptions}
            required
          />

          <FormField
            id="phoneImei"
            label="Device IMEI"
            htmlFor="phoneImei"
            type="text"
            size="lg"
            placeholder="Enter your device IMEI"
            value={phoneImei}
            onChange={handleImeiChange}
            required
            reqValue="*"
            errorMessage={deviceImeiError}
            isInvalid={!!deviceImeiError}
          />


          <p className={cn(`text-sm text-[#212529] font-semibold`, Figtree_SemiBold.className)}>To get IMEI, dial: *#06#</p>

          <CustomBtn
            continueText="Continue"
            isLoading={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
}
