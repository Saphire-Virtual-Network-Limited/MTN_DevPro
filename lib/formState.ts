"use client";

import { useState } from "react";
import { ZodError, ZodType } from "zod";

export const useField = <T>(
  initialValue: T,
  schema: ZodType<T> // Properly typed schema parameter
) => {
  const [value, setValue] = useState<T>(initialValue);
  const [error, setError] = useState("");

  const handleChange = (newValue: T) => {
    setValue(newValue);
    try {
      schema.parse(newValue);
      setError("");
    } catch (validationError) {
      if (validationError instanceof ZodError) {
        setError(validationError.issues[0]?.message || "Validation error");
      } else {
        setError("Validation error");
      }
    }
  };

  return {
    value,
    error,
    handleChange,
    setError,
    setValue,
  };
};
