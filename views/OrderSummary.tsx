'use client';

import React, { useState } from 'react';
import { CustomBtn } from '@/components/reusables';
import { ChevronLeft } from 'lucide-react';
import { cn, Figtree_Medium, Figtree_Regular, Figtree_SemiBold } from '@/lib';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Image from 'next/image';
import { Button } from '@heroui/react';
import { useRouter } from 'next/navigation';

interface PaymentOption {
  label: string;
  value: string;
  price: string;
  details?: string[];
}

interface SelectedPayment {
  label: string;
  value: string;
  price: string;
}

interface MandateOption {
  title: string;
  description: string;
  value: string;
  color: string;
  colorText: string;
}

const paymentOptions: PaymentOption[] = [
  {
    label: "Outright Payment",
    value: "outright",
    price: "7500",
    details: []
  },
  {
    label: "BNPL (Buy Now Pay Later)",
    value: "bnpl",
    price: "0",
    details: []
  }
];

const mandateOptions: MandateOption[] = [
  {
    title: "Setup bank mandate",
    description: "Use bank transfer via Paystack to complete your payment securely",
    value: "bank",
    color: "bg-red-500",
    colorText: "Compulsory"
  },
  {
    title: "Setup card tokenization",
    description: "Pay instantly using your ATM card through our secure Paystack integration",
    value: "card",
    color: "bg-blue-500",
    colorText: "Optional"
  }
];

export default function OrderSummaryView() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<SelectedPayment | null>(null);
  const [selectedMandate, setSelectedMandate] = useState<string | null>(null);
  const [showMandateSelection, setShowMandateSelection] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [paystackModal, setPaystackModal] = useState(false);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPayment) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);

      if (selectedPayment.value === "outright") {
        // Show Paystack payment modal for outright payment
        setPaystackModal(true);
      } else if (selectedPayment.value === "bnpl") {
        // Show mandate selection for BNPL
        setShowMandateSelection(true);
      }
    }, 1000);
  };

  const handleMandateContinue = () => {
    if (!selectedMandate) return;

    setIsLoading(true);

    // Simulate API call to Paystack mandate setup
    setTimeout(() => {
      setIsLoading(false);
      setPaystackModal(true);
    }, 1000);
  };

  const handlePaystackSuccess = () => {
    setPaystackModal(false);
    setSuccessModal(true);
  };

  const handleCloseSuccess = () => {
    setSuccessModal(false);
    router.push("/");
  };

  // If mandate selection is shown
  if (showMandateSelection) {
    return (
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => setShowMandateSelection(false)}
          className="mb-8 p-2 hover:bg-gray-200 rounded-lg border inline-flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        {/* Header Section */}
        <div className="mb-8">
          <h2 className={cn(`w-full text-[#202020] text-lg md:text-2xl font-semibold pb-2`, Figtree_SemiBold.className)}>
            Setup Your Mandate
          </h2>
          <p className={cn(`w-full text-[#3A3A3A] text-sm md:text-base font-normal`, Figtree_Regular.className)}>
            Choose a mandate to setup
          </p>
        </div>

        {/* Mandate Options */}
        <div className="space-y-4 mb-8">
          {mandateOptions.map((option) => (
            <div
              key={option.value}
              onClick={() => setSelectedMandate(option.value)}
              className={cn(
                "p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md",
                selectedMandate === option.value
                  ? "border-[#0F52BA] bg-blue-50"
                  : "border-gray-200 bg-white"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className={cn(`text-base font-semibold text-black mb-1`, Figtree_SemiBold.className)}>
                    {option.title}
                  </h3>
                  <p className={cn(`w-[80%] text-sm text-[#00000099] font-medium`, Figtree_Medium.className)}>
                    {option.description}
                  </p>
                </div>
                <div className={cn(`w-20 h-8 rounded ${option.color} ml-4 flex-shrink-0 flex items-center justify-center`)}>
                  <span className="text-xs font-medium text-white">{option.colorText}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          type="button"
          radius="md"
          size="lg"
          onPress={handleMandateContinue}
          isLoading={isLoading}
          isDisabled={!selectedMandate}
          className={cn(
            "w-full text-white font-semibold py-4 px-8 text-lg rounded-md cursor-pointer flex items-center justify-center gap-2",
            "bg-[#0F52BA]",
            isLoading && "opacity-50 cursor-not-allowed",
            Figtree_SemiBold.className
          )}
        >
          Continue
        </Button>
      </div>
    );
  }

  // Main Order Summary View
  return (
    <>
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-8 p-2 hover:bg-gray-200 rounded-lg border inline-flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        {/* Header Section */}
        <div className="mb-8">
          <h2 className={cn(`w-full text-[#202020] text-lg md:text-2xl font-semibold pb-4`, Figtree_SemiBold.className)}>
            Order Summary
          </h2>

          {/* Product Details */}
          <div className="space-y-3 mb-6">
            <div>
              <p className={cn(`text-sm text-[#6B7280]`, Figtree_Regular.className)}>
                Product
              </p>
              <p className={cn(`text-base text-[#202020] font-medium`, Figtree_SemiBold.className)}>
                Samsung Galaxy Ultra S25
              </p>
            </div>

            <div>
              <p className={cn(`text-sm text-[#6B7280]`, Figtree_Regular.className)}>
                Device Protection Option
              </p>
              <div className="flex items-center justify-between">
                <p className={cn(`text-base text-[#202020]`, Figtree_Regular.className)}>
                  Screen & Liquid Damage (SLD)
                </p>
                <p className={cn(`text-base text-[#202020] font-semibold`, Figtree_SemiBold.className)}>
                  ₦7,500.00
                </p>
              </div>
            </div>

            <div className="pt-3 border-t">
              <div className="flex items-center justify-between">
                <p className={cn(`text-lg text-[#202020] font-semibold`, Figtree_SemiBold.className)}>
                  Total
                </p>
                <p className={cn(`text-lg text-[#202020] font-bold`, Figtree_SemiBold.className)}>
                  ₦7,500.00
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Options */}
        <div className="mb-8">
          <h3 className={cn(`text-lg text-[#202020] font-semibold mb-2`, Figtree_SemiBold.className)}>
            Payment Option
          </h3>
          <p className={cn(`text-sm text-[#3A3A3A] mb-4`, Figtree_Regular.className)}>
            Kindly choose your preferred payment Option
          </p>

          <div className="space-y-3">
            {paymentOptions.map((option) => (
              <label
                key={option.value}
                className={cn(
                  "flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all",
                  selectedPayment?.value === option.value
                    ? "border-[#0F52BA] bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                )}
              >
                <div className="flex items-center  justify-between w-full">
                  <span className={cn(`text-base text-[#202020]`, Figtree_Regular.className)}>
                    {option.label}
                  </span>
                  <input
                    type="radio"
                    name="payment"
                    value={option.value}
                    checked={selectedPayment?.value === option.value}
                    onChange={() => setSelectedPayment({
                      label: option.label,
                      value: option.value,
                      price: option.price
                    })}
                    className="w-5 h-5 text-[#0F52BA] border-gray-300 focus:ring-[#0F52BA]"
                  />

                </div>

                {/* {option.value === "outright" && (
                  <div className="w-6 h-6 rounded-full bg-yellow-400 flex-shrink-0" />
                )} */}
              </label>
            ))}
          </div>
        </div>

        {/* Continue Button */}
        <form onSubmit={handleContinue}>
          <CustomBtn
            continueText="Continue"
            isLoading={isLoading}
          // isDisabled={!selectedPayment}
          />
        </form>
      </div>

      {/* Paystack Modal */}
      <Dialog open={paystackModal} onOpenChange={setPaystackModal}>
        <DialogContent className="max-w-md w-full !rounded-[20px] p-8 text-center">
          <DialogTitle className={cn(`text-xl font-semibold`, Figtree_SemiBold.className)}>
            {selectedPayment?.value === "outright" ? "Complete Payment" : "Setup Mandate"}
          </DialogTitle>
          <div className="space-y-4">
            <p className={cn(`text-sm text-gray-600`, Figtree_Regular.className)}>
              {selectedPayment?.value === "outright"
                ? "You will be redirected to Paystack to complete your payment"
                : selectedMandate === "bank"
                  ? "Setup bank transfer mandate via Paystack"
                  : "Setup card tokenization via Paystack"
              }
            </p>
            <div className="flex gap-3">
              <Button
                onPress={() => setPaystackModal(false)}
                className={cn(`flex-1 bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-md`, Figtree_SemiBold.className)}
              >
                Cancel
              </Button>
              <Button
                onPress={handlePaystackSuccess}
                className={cn(`flex-1 bg-[#0F52BA] text-white font-semibold py-3 px-6 rounded-md`, Figtree_SemiBold.className)}
              >
                Proceed
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={successModal} onOpenChange={setSuccessModal}>
        <DialogContent className="max-w-md w-full !rounded-[20px] p-8 text-center">
          <DialogTitle className="mb-4">
            <div className="bg-[#F7C21D]/20 text-[#202020] p-4 rounded-lg">
              <p className={cn(`text-sm font-medium`, Figtree_Regular.className)}>
                Your MTN Line (08130000409) has been credited with 1.5gb data
              </p>
            </div>

            <div className="w-full h-52 relative mb-4">
              <Image
                src="/congrats.png"
                alt="Success"
                fill
                className="object-contain"
              />
            </div>
          </DialogTitle>
          <div className="space-y-4">


            <p className={cn(`text-xl font-semibold text-[#D5AB00]`, Figtree_SemiBold.className)}>
              Congratulations!!!
            </p>

            <p className={cn(`text-base text-[#1F2937]`, Figtree_Regular.className)}>
              Your Device Protection Payment was successful.
            </p>

            <Button
              onPress={handleCloseSuccess}
              className={cn(`w-1/5 bg-[#0F52BA] text-white font-semibold py-3 px-6 rounded-md`, Figtree_SemiBold.className)}
            >
              Ok
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}