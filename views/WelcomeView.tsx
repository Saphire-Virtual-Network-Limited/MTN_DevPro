'use client';

import React from "react"
import { useState } from 'react';
import { CustomBtn, FormField, Layout, SelectAutocomplete } from "@/components/reusables";
import { useField } from "@/lib/formState";
import { FirstNameSchema, LastNameSchema, PhoneSchema, EmailSchema, Figtree_SemiBold, cn, Figtree_Regular } from "@/lib";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import Image from "next/image";


export interface StateType {
  id: number;
  state: string;
}

const states: StateType[] = [
  { id: 1, state: "Lagos" },
  { id: 2, state: "Abuja (FCT)" },
  { id: 3, state: "Rivers" },
  { id: 4, state: "Oyo" },
  { id: 5, state: "Kano" },
  { id: 6, state: "Enugu" },
  { id: 7, state: "Kaduna" },
  { id: 8, state: "Anambra" },
  { id: 9, state: "Delta" },
  { id: 10, state: "Ogun" },
];


export default function Welcome() {
  const router = useRouter();
  const { value: firstName, error: firstNameError, handleChange: handleFNameChange } = useField("", FirstNameSchema);
  const { value: lName, error: lNameError, handleChange: handleLNameChange } = useField("", LastNameSchema);
  const { value: phone, error: phoneError, handleChange: handlePhoneChange } = useField("", PhoneSchema);
  const { value: email, error: emailError, handleChange: handleEmailChange } = useField("", EmailSchema);

  const [selectedState, setSelectedState] = useState<StateType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);



  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();

  };

  const handleStateSelection = async (selected: StateType) => {
    setSelectedState(selected);

    try {

    } catch {

    }
  };

  const handleCloseSuccess = () => {
    setSuccessModal(false);
    router.push("/verify-otp");
  };

  return (
    <div className="w-full">
      {/* Welcome Section */}
      <div className="mb-6">
        <h2 className={cn(`w-full text-[#202020] text-lg md:text-2xl font-semibold pb-4`, Figtree_SemiBold.className)}
        >
          Welcome, +234 803 932 4949
        </h2>
        <p className={cn(`w-full text-[#3A3A3A] text-sm md:text-base font-normal leading-relaxed`, Figtree_SemiBold.className)}
        >
          Kindly fill in the correct details, also kindly ensure you use a valid phone number as it will be verified.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleContinue} className="space-y-4">
        <div className="grid w-full items-start gap-4 pb-6">
          <FormField
            id="firstName"
            label="First Name"
            htmlFor="firstName"
            type="text"
            size="lg"
            placeholder="Enter your firstname"
            value={firstName}
            onChange={handleFNameChange}
            required
            reqValue="*"
            errorMessage={firstNameError}
            isInvalid={!!firstNameError}
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
        </div>

        <CustomBtn
          continueText="Continue"
          isLoading={isLoading}
        />
      </form>

      <Dialog open={successModal} onOpenChange={setSuccessModal}>
        <DialogContent className="max-w-md w-full !rounded-[20px] p-8 text-center">
          <DialogTitle>
            <Image
              src="/success-check.svg"
              alt="Success"
              fill
              className="object-contain"
            />
          </DialogTitle>
          <div className="space-y-4">
            <p className={cn(`text-base font-normal text-[#1F2937]`, Figtree_Regular.className)}>
              A verification code has been sent to your phone number
            </p>
            <Button
              onPress={handleCloseSuccess}
              className={cn(`w-1/5  bg-[#0F52BA] text-white font-semibold py-3 px-6 rounded-md`, Figtree_SemiBold.className)}
            >
              Ok
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}