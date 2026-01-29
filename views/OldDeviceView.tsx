"use client";

import { createSchema, getOldDeviceBrand, getOldDeviceName, showToast, useField } from "@/lib";
import React, { useEffect, useState } from "react";
import { BackButton, ContinueResetBtn, FormField, SelectField } from "@/components/reusables";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@heroui/react";
import { XCircle } from "lucide-react";
import { OldBrand } from "@/types/oldBrandType";

const conditionOptions = [
  { label: "Yes, My phone is in Excellent Condition", value: "yes" },
  { label: "No, it has some damage", value: "no" }
];


export const ImeiSchema = createSchema(
  (value) => /^[0-9]{15}$/.test(value),
  "Imei number must be exactly 15 digits"
);

export function OldDeviceView() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [brand, setBrand] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [condition, setCondition] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [oldBrand, setOldBrand] = useState<OldBrand[]>([]);
  const [oldDeviceData, setOldDeviceData] = useState<{ id: string, label: string, value: string, tradein_value: string }[]>([]);
  const [isFetchingDevices, setIsFetchingDevices] = useState(false);

  const { value: imei, error: imeiError, handleChange: handleImeiChange } = useField("", ImeiSchema);


  const handleClose = () => {
    setIsModalOpen(false);
  }

  useEffect(() => {
    const fetchOldDeviceBrand = async () => {
      setIsLoading(true);
      try {
        const payload = {
          data: ""
        };
        const response = await getOldDeviceBrand(payload.data);
        //console.log("object brand", response);
        setOldBrand(response.data || []);
      } catch {
        //showToast({ type: "error", message: "Failed to load brands" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOldDeviceBrand();
  }, []);

  useEffect(() => {
    const fetchDeviceNames = async () => {
      if (!brand) {
        setOldDeviceData([]);
        setDeviceName("");
        return;
      }

      setIsFetchingDevices(true);
      try {
        // Get the original brand name (reverse the transformation we did for the value)
        const originalBrand = oldBrand.find(
          b => b.device_brand.toLowerCase().replace(/\s+/g, '-') === brand
        )?.device_brand;

        if (originalBrand) {
          const response = await getOldDeviceName(originalBrand);
          const names = response.data || [];

          // Format device names for the select component
          const formattedNames = names.map(item => ({
            id: item.id,
            label: item.device_name,
            value: item.id,
            tradein_value: String(item.tradein_value ?? "")
          }));


          setOldDeviceData(formattedNames);
        }
      } catch {
        //showToast({ type: "error", message: "Failed to load device models" });
        setOldDeviceData([]);
      } finally {
        setIsFetchingDevices(false);
      }
    };

    fetchDeviceNames();
  }, [brand, oldBrand]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (condition === "no") {
      setIsModalOpen(true);
      return;
    }

    if (!brand || !deviceName) {
      showToast({ type: "error", message: "Please select both brand and device model" });
      return;
    }

    // 🔍 Find selected device from list
    const selectedDevice = oldDeviceData.find((d) => d.value === deviceName);

    if (!selectedDevice) {
      showToast({ type: "error", message: "Selected device not found" });
      return;
    }

    // ✅ Save selected device info + condition
    const dataToStore = {
      id: selectedDevice.id,
      brand,
      condition,
      imei,
      deviceName: selectedDevice.label,
      tradein_value: selectedDevice.tradein_value,
    };

    sessionStorage.setItem("oldDeviceData", JSON.stringify(dataToStore));

    setIsSubmitting(true);
    try {
      await new Promise((res) => setTimeout(res, 1000));
      router.push("/device-detail");
    } catch (error) {
      console.error(error);
      showToast({ type: "error", message: "Failed to proceed. Try again.", duration: 3000 });
    } finally {
      setIsSubmitting(false);
    }
  }


  return (
    <>
      <div className="w-full flex flex-col gap-4 lg:gap-12 pb-8 lg:py-16 h-full overflow-y-auto">
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
                  label="Your Old Device Brand?"
                  htmlFor="brand"
                  id="brand"
                  placeholder={
                    isLoading ? "Loading brands..." : "Select Device Brand"
                  }
                  isInvalid={false}
                  errorMessage=""
                  value={brand}
                  onChange={setBrand}
                  options={
                    isLoading
                      ? []
                      : oldBrand.map((item) => ({
                        label: item.device_brand,
                        value: item.device_brand
                          .toLowerCase()
                          .replace(/\s+/g, "-"),
                      }))
                  }
                  disabled={isLoading}
                  required
                />

                <SelectField
                  label="Device Name"
                  htmlFor="deviceName"
                  id="deviceName"
                  placeholder={
                    isFetchingDevices
                      ? "Loading device models..."
                      : "Select Device Name"
                  }
                  value={deviceName}
                  onChange={setDeviceName}
                  options={isFetchingDevices ? [] : oldDeviceData}
                  disabled={!brand || isFetchingDevices}
                  required
                //disabled={!brand || isFetchingDevices}
                />

                <SelectField
                  label="Is your Device in Excellent Condition? *"
                  htmlFor="condition"
                  id="condition"
                  placeholder="Select Condition"
                  isInvalid={false}
                  errorMessage=""
                  value={condition}
                  onChange={setCondition}
                  options={conditionOptions}
                  required
                />
                <FormField
                  id="imei"
                  label="Device Imei"
                  htmlFor="imei"
                  type="text"
                  size="lg"
                  placeholder="Enter your device imei"
                  value={imei}
                  onChange={handleImeiChange}
                  required
                  reqValue="*"
                  errorMessage={imeiError}
                  isInvalid={!!imeiError}
                />

                <ContinueResetBtn
                  continueText="Continue"
                  resetText="Reset"
                  isLoading={isSubmitting}
                  disabled={!brand || !deviceName || !condition || !imei}
                  onReset={() => {
                    setBrand("");
                    setDeviceName("");
                    setCondition("");
                    setOldDeviceData([]);
                  }}
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-80 w-full h-fit !rounded-[20px] p-8 flex flex-col justify-center gap-5 text-center">
          <div className="flex flex-col items-center justify-center gap-2">
            <XCircle className="w-10 h-10 text-[#C50003]" />
            <h2 className="text-2xl font-semibold text-fold-black">
              Device Not Tradeable
            </h2>
          </div>

          <p className="text-sm text-fold-grey">
            Only devices in excellent condition are eligible for trade-in.
          </p>

          <Button
            type="button"
            onPress={handleClose}
            className="w-1/2 mx-auto bg-[#C50003] text-white font-semibold py-4 px-8 text-lg rounded-md"
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}