'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CustomBtn, Layout } from '@/components/reusables';
import { ChevronLeft } from 'lucide-react';
import { cn, Figtree_Regular, Figtree_SemiBold } from '@/lib';
import { OtpInput } from '@/components/reusables/form/otpInput';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Image from 'next/image';
import { Button } from '@heroui/react';
import { useRouter } from 'next/navigation';


export default function VerifyOTP() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [successModal, setSuccessModal] = useState(false);


  useEffect(() => {
    setIsDisabled(otp.length !== 6);
  }, [otp]);

  const [timeLeft, setTimeLeft] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);


  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessModal(true);
    }, 2000);
  };

  const handleCloseSuccess = () => {
    setSuccessModal(false);
    router.push("/device-details");
  };
  return (
    <>
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button onClick={() => router.back()}
          className="mb-8 p-2 hover:bg-gray-200 rounded-lg border inline-flex items-center justify-center">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        {/* Header Section */}
        <div className="mb-10">
          <h2 className={cn(`w-full text-[#202020] text-lg md:text-2xl font-semibold pb-4`, Figtree_SemiBold.className)}
          >
            OTP Verification
          </h2>
          <p className={cn(`w-full text-[#3A3A3A] text-sm md:text-base font-normal leading-relaxed`, Figtree_Regular.className)}
          >
            An OTP code has been sent to your registered Phone number. kindly check your phone inbox and input the code.

          </p>
        </div>

        {/* OTP Form */}
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex flex-col w-full items-center justify-center mx-auto py-4 md:py-8">
            <OtpInput
              value={otp}
              onChange={(value) => setOtp(value)}
            />

          </div>

          <CustomBtn
            continueText="Continue"

            isLoading={isLoading}
          />

          {/* Resend Code */}
          <div className="text-center">
            <button
              type="button"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              Didn't receive a code? {String(timeLeft).padStart(2, '0')}:00
            </button>
          </div>
        </form>
      </div>

      <Dialog open={successModal} onOpenChange={setSuccessModal}>
        <DialogContent className="max-w-md w-full !rounded-[20px] p-8 text-center">
          <div className="flex flex-col items-center gap-6">
            <DialogTitle className="sr-only">Success</DialogTitle>
            <div className="relative w-16 h-16 mx-auto">
              <Image
                src="/success-check.svg"
                alt="Success"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
            <div className="space-y-4">


              <p className={cn(`text-base font-normal text-[#1F2937]`, Figtree_Regular.className)}>

                OTP verification was successful!
              </p>
              <Button
                onPress={handleCloseSuccess}
                className={cn(`w-1/5  bg-[#0F52BA] text-white font-semibold py-3 px-6 rounded-md`, Figtree_SemiBold.className)}
              >
                Ok
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </>
  );
}
