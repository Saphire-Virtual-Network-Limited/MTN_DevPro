"use client";

import { getStates, getStores, showToast } from "@/lib";
import { StoreType, StateType, TradeInTransactionPayload, submitOrder } from "@/lib/api";
import React, { useEffect, useState } from "react";
import {
  BackButton,
  ContinueResetBtn,
  FormField,
  SelectAutocomplete
} from "@/components/reusables";
import { useRouter } from "next/navigation";
import { createSchema, useField } from "@/lib";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@heroui/react";
import { DialogTitle } from "@radix-ui/react-dialog";


const EmailSchema = createSchema((value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}, "Please enter a valid email address");

export const FirstNameSchema = createSchema(
  (value: string) => /^[a-zA-Z]{1,}$/.test(value.trim()),
  "Please enter a valid first name (letters only)"
);

export const LastNameSchema = createSchema(
  (value: string) => /^[a-zA-Z]{3,}$/.test(value.trim()),
  "Please enter a valid last name (letters only)"
);

export const PhoneSchema = createSchema(
  (value) => /^[0-9]{11}$/.test(value),
  "Phone number must be exactly 11 digits"
);


export function CustomerDetailView() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStore, setSelectedStore] = useState<StoreType | null>(null);
  const [selectedState, setSelectedState] = useState<StateType | null>(null);
  const [states, setStates] = useState<StateType[]>([]);
  const [stores, setStores] = useState<StoreType[]>([]);
  const [summaryModal, setSummaryModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [deviceData, setDeviceData] = useState<any>(null);
  const [protectionData, setProtectionData] = useState<any>(null);
  const [oldDeviceData, setOldDeviceData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState("");



  const { value: fName, error: fNameError, handleChange: handleFNameChange } = useField("", FirstNameSchema);
  const { value: lName, error: lNameError, handleChange: handleLNameChange } = useField("", LastNameSchema);
  const { value: phone, error: phoneError, handleChange: handlePhoneChange } = useField("", PhoneSchema);
  const { value: email, error: emailError, handleChange: handleEmailChange } = useField("", EmailSchema);


  const formatNaira = (amount: number) =>
    `₦${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;


  useEffect(() => {
    const rawDevice = sessionStorage.getItem("deviceBrand");
    const oldDeviceData = sessionStorage.getItem("oldDeviceData")
    const rawProtection = sessionStorage.getItem("selectedProtection");
    const newSelectedColor = sessionStorage.getItem("newSelectedColor");

    try {
      if (rawDevice) {
        const parsed = JSON.parse(rawDevice);
        setDeviceData(parsed);
      }

      if (oldDeviceData) {
        const parsed = JSON.parse(oldDeviceData)
        setOldDeviceData(parsed);

      }
      if (rawProtection) {
        const parsedProtection = JSON.parse(rawProtection);
        setProtectionData(parsedProtection);
      }
      if (newSelectedColor) {
        setSelectedColor(newSelectedColor)
      }

    } catch (err) {
      console.error("Error parsing sessionStorage data", err);
    }
  }, []);


  useEffect(() => {
    const fetchStates = async () => {
      setIsLoading(true);
      try {
        const response = await getStates("samsung");
        // console.log("State, response", response)
        setStates(response.data || []);
      } catch {
        showToast({ type: "error", message: "Failed to load states" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStates();
  }, []);

  const handleStateSelection = async (selected: StateType) => {
    setSelectedState(selected);
    setSelectedStore(null);
    try {
      const response = await getStores(selected.state.toLowerCase());
      // console.log("Store response", response);
      setStores(response.data || []);
    } catch {
      showToast({ type: "error", message: "Failed to load stores" });
      setStores([]);
    }
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setSummaryModal(true);
  };



  const handleSubmitOrder = async () => {
    if (!selectedState || !selectedStore?.id || !deviceData || !oldDeviceData) {
      showToast({ type: "error", message: "Please fill out all required fields" });
      return;
    }

    const payload: TradeInTransactionPayload = {
      first_name: fName.trim(),
      last_name: lName.trim(),
      address: selectedStore?.store_address || "",
      city: selectedState.state,
      state: selectedState.state,
      email_address: email.trim(),
      phone_number: phone.trim(),
      transaction_type: "Device Swap",
      new_device_id: deviceData.id,
      new_device_color: selectedColor || "Unknown",
      old_device_id: oldDeviceData.id,
      old_device_value: String(oldDeviceData.tradein_value),
      imei: oldDeviceData.imei,
      serial: oldDeviceData.serial || undefined,
      device_condition: "Excellent Condition",
      sentinel: protectionData.value || "SAP",
      delivery_option: "instore",
      store_id: selectedStore?.id || ""
    };


    setIsSubmitting(true);
    //console.log("Payload", payload);
    try {
      const response = await submitOrder(payload);
      // console.log("Response error", response);
      if (response.status && response.statusCode === 200) {
        setSuccessModal(true);
        setSummaryModal(false);
      } else {
        throw new Error(response.message || "Submission failed");
      }
    } catch (error) {
      setErrorModal(true);
      setSummaryModal(false);
      console.error("Order submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };


  // const handleSubmitOrder = async () => {
  //   setIsSubmitting(true);
  //   try {
  //     const parsedNewPrice = parseAmount(deviceData?.price);
  //     const parsedProtectionPrice =
  //       protectionData && protectionData.label !== "I Don't Want Device Protection"
  //         ? parseAmount(protectionData.price)
  //         : 0;
  //     const parsedOldPrice = parseAmount(oldDeviceData?.tradein_value);

  //     const totalPrice = parsedNewPrice + parsedProtectionPrice - parsedOldPrice;

  //     const payload = {
  //       firstName: fName,
  //       lastName: lName,
  //       phoneNumber: `+234${phone.slice(-10)}`,
  //       email,
  //       state: selectedState?.state || "",
  //       store: selectedStoreId,
  //       newDeviceName: deviceData?.device_name || "",
  //       newDevicePrice: parseAmount(deviceData?.price),

  //       oldDeviceName: oldDeviceData?.deviceName || "",
  //       oldDevicePrice: parseAmount(oldDeviceData?.tradein_value),

  //       deviceProtectionName: protectionData?.label || "No Protection",
  //       deviceProtectionPrice: parsedProtectionPrice,
  //       totalPrice,
  //     };


  //     //console.log("📦 Final Payload", payload);

  //     await submitOrderSecond(payload);
  //     //console.log("✅ Response", response);

  //     setSuccessModal(true);
  //     setSummaryModal(false);
  //   } catch (error: any) {
  //     setErrorModal(true);
  //     setSummaryModal(false);

  //     const apiMessage =
  //       error?.response?.data?.message ||
  //       error?.message ||
  //       "Something went wrong. Please try again.";

  //     setErrorMessage(
  //       Array.isArray(apiMessage) ? apiMessage.join(", ") : apiMessage
  //     );

  //     console.error("❌ Order submission failed:", error);
  //   }
  // }



  const handleCloseSuccess = () => {
    setSuccessModal(false);
    router.push("/");
  };

  const handleCloseError = () => {
    setErrorModal(false);
    setSummaryModal(true);
  };

  const parseAmount = (val: string | number | undefined) =>
    Number(String(val || "0").replace(/[₦,]/g, ""));

  return (
    <>
      <div className="w-full flex flex-col gap-4 lg:gap-12 pb-8 lg:py-16 overflow-y-auto">
        <div><BackButton /></div>

        <div className="flex justify-center lg:justify-start space-y-8 full h-full flex-col">
          <h2 className="text-[28px] lg:text-4xl text-primary font-medium">
            Samsung Galaxy Z Fold 7<br />
            <span className="font-semibold text-primary">Trade-in Portal</span>
          </h2>

          <div className="space-y-6 max-w-xl pb-16 ">
            <form onSubmit={handleContinue}>
              <div className="grid w-full items-start gap-8 pb-6">
                <FormField
                  id="fName"
                  label="First Name"
                  htmlFor="fName"
                  type="text"
                  size="lg"
                  placeholder="Enter your firstname"
                  value={fName}
                  onChange={handleFNameChange}
                  required
                  reqValue="*"
                  errorMessage={fNameError}
                  isInvalid={!!fNameError}
                />
                <FormField
                  id="lName"
                  label="Last Name"
                  htmlFor="lName"
                  type="text"
                  size="lg"
                  placeholder="Enter your lastname"
                  value={lName}
                  onChange={handleLNameChange}
                  required
                  reqValue="*"
                  errorMessage={lNameError}
                  isInvalid={!!lNameError}
                />
                <FormField
                  id="phone"
                  label="Phone Number"
                  htmlFor="phone"
                  type="tel"
                  size="lg"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={handlePhoneChange}
                  required
                  reqValue="*"
                  errorMessage={phoneError}
                  isInvalid={!!phoneError}
                />
                <FormField
                  id="email"
                  label="Email Address"
                  htmlFor="email"
                  type="email"
                  size="lg"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={handleEmailChange}
                  required
                  reqValue="*"
                  errorMessage={emailError}
                  isInvalid={!!emailError}
                />
                <SelectAutocomplete
                  label="State"
                  value={selectedState?.state || ""}
                  placeholder="Select your state"
                  onChange={(val: string) => {
                    const found = states.find((s) => s.state === val);
                    if (found) handleStateSelection(found);
                  }}
                  options={states.map((s) => ({
                    label: s.state,
                    value: s.state,
                  }))}
                  required
                />

                <SelectAutocomplete
                  label="Sales Store"
                  options={stores.map((s) => ({
                    label: s.store_name,
                    value: s.id,
                  }))}
                  value={selectedStore?.id || ""}
                  placeholder="Select your store"
                  onChange={(val) => {
                    const foundStore = stores.find((s) => s.id === val);
                    if (foundStore) {
                      setSelectedStore(foundStore);
                    }
                  }}
                  required
                />

                <ContinueResetBtn
                  continueText="Continue"
                  resetText="Reset"
                  isLoading={isLoading}
                  onReset={() => {
                    setSelectedState(null);
                    setSelectedStore(null);
                    setStores([]);
                    handleFNameChange("");
                    handleLNameChange("");
                    handlePhoneChange("");
                    handleEmailChange("");
                  }}
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Summary Dialog */}
      <Dialog open={summaryModal} onOpenChange={setSummaryModal}>
        <DialogContent className="max-w-md w-full !rounded-[20px] p-8">
          <DialogTitle className="text-2xl font-bold text-center">ORDER SUMMARY</DialogTitle>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>{deviceData?.device_name}</span>
              <span>{formatNaira(parseAmount(deviceData?.price))}</span>
            </div>

            {protectionData && protectionData.label !== "I Don't Want Device Protection" && (
              <div className="flex justify-between">
                <span>{protectionData.label}</span>
                <span>{formatNaira(parseAmount(protectionData.price))}</span>
              </div>
            )}


            <div className="flex flex-col border-t pt-2 gap-2">
              <div className="flex justify-between ">
                <span>Your Swap Device</span>
                <span>{oldDeviceData?.deviceName}</span>
              </div>

              <div className="flex justify-between ">
                <span >Estimated Trade-in-value:</span>
                <span className="text-red-500 text-sm">{formatNaira(parseAmount(oldDeviceData?.tradein_value))}</span>
              </div>

            </div>

            <div className="flex justify-between font-bold text-lg border-t pt-4">
              <span>Total to Pay:</span>
              <span>
                {
                  formatNaira(
                    parseAmount(deviceData?.price) +
                    (protectionData && protectionData.label !== "I Don't Want Device Protection"
                      ? parseAmount(protectionData.price)
                      : 0) -
                    parseAmount(oldDeviceData?.tradein_value)
                  )}
              </span>
            </div>
          </div>
          <Button
            isLoading={isSubmitting}
            onPress={handleSubmitOrder}
            className="w-full bg-[#0033A0] text-white font-semibold py-4 px-8 text-lg rounded-md"
          >
            Submit Order
          </Button>
        </DialogContent>
      </Dialog>
      {/* Success Dialog */}
      <Dialog open={successModal} onOpenChange={setSuccessModal}>
        <DialogContent className="max-w-md w-full !rounded-[20px] p-8 text-center">
          <DialogTitle>
            <h2 className="text-2xl font-bold text-green-600">Order Placed Successfully!</h2>
          </DialogTitle>
          <div className="space-y-4">

            <p>Your order has been placed successfully!</p>
            <p className="text-sm text-gray-600">
              Visit your selected store for physical assessment to complete your trade-in.
            </p>
            <Button
              onPress={handleCloseSuccess}
              className="w-full bg-[#0033A0] text-white font-semibold py-3 px-6 rounded-md"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Error Dialog */}
      {/* Error Dialog */}
      <Dialog open={errorModal} onOpenChange={setErrorModal}>
        <DialogContent className="max-w-md w-full !rounded-[20px] p-8 text-center">
          <DialogTitle>
            <h2 className="text-2xl font-bold text-red-600">Order Failed</h2>

          </DialogTitle>
          <div className="space-y-4">

            <p className="text-red-500 text-base">
              {errorMessage || "We encountered an issue processing your order. Please try again."}
            </p>
            <Button
              onPress={handleCloseError}
              className="w-full bg-[#C50003] text-white font-semibold py-3 px-6 rounded-md"
            >
              Try Again
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </>
  );
}
