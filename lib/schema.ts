import { createSchema } from "./zodValidator";

export const EmailSchema = createSchema((value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}, "Please enter a valid email address");

export const FirstNameSchema = createSchema(
  (value: string) => /^[a-zA-Z]{1,}$/.test(value.trim()),
  "Please enter a valid first name (letters only)",
);

export const LastNameSchema = createSchema(
  (value: string) => /^[a-zA-Z]{3,}$/.test(value.trim()),
  "Please enter a valid last name (letters only)",
);

export const PhoneSchema = createSchema(
  (value) => /^[0-9]{11}$/.test(value),
  "Phone number must be exactly 11 digits",
);

export const DeviceNameSchema = createSchema(
  (value: string) => value.trim().length >= 2,
  "Device name must be at least 2 characters",
);

export const DeviceModelSchema = createSchema(
  (value: string) => value.trim().length >= 2,
  "Device model must be at least 2 characters",
);

export const ImeiSchema = createSchema(
  (value: string) => /^[0-9]{15}$/.test(value),
  "IMEI must be exactly 15 digits",
);
