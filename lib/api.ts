// const BASE_URL = process.env.NEXT_PUBLIC_SENTILOCK_URL;

// if (!BASE_URL) {
//   throw new Error("Missing env variable");
// }

export interface ApiCallOptions {
  cache?: RequestCache;
  revalidate?: number;
}

async function apiCall<TBody = unknown, TResponse = unknown>(
  endpoint: string,
  method: string,
  body?: TBody,
  accessToken?: string,
  options?: ApiCallOptions,
  customBaseUrl?: string
): Promise<TResponse> {
  const BASE_URL = customBaseUrl || process.env.NEXT_PUBLIC_SENTILOCK_URL;

  try {
    const headers: HeadersInit = {
      Accept: "*/*",
    };

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const fetchOptions: RequestInit = {
      method,
      headers,
    };

    if (method !== "GET" && method !== "HEAD" && body) {
      if (body instanceof FormData) {
        delete headers["Content-Type"];
        fetchOptions.body = body;
      } else {
        headers["Content-Type"] = "application/json";
        fetchOptions.body = JSON.stringify(body);
      }
    }

    if (method === "GET") {
      if (options?.cache) {
        fetchOptions.cache = options.cache;
      }
      if (options?.revalidate !== undefined) {
        fetchOptions.next = { revalidate: options.revalidate };
      }
    }

    const url = `${BASE_URL}${endpoint}`;
    const response = await fetch(url, fetchOptions);

    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");

    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      throw new Error(
        typeof data === "string" ? data : data?.message || "Request failed"
      );
    }

    return data;
  } catch (error: unknown) {
    const err = error as { message?: string };
    const errorMessage = err?.message || "Something went wrong";
    console.error(`API Error in ${method} ${endpoint}: ${errorMessage}`);
    throw new Error(errorMessage);
  }
}

// am using the sentilock url here
export interface DeviceBrand {
  data?: string;
  device_brand: string;
}

interface OldDeviceBrandResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: DeviceBrand[];
}

export async function getOldDeviceBrand(
  data?: string
): Promise<OldDeviceBrandResponse> {
  return apiCall<{ data?: string }, OldDeviceBrandResponse>(
    "/getolddevicebrand/",
    "POST",
    { data },
    undefined,
    undefined
  );
}

// you will pass the device_brand as the body to get the device names
// ... (previous imports remain the same)

export interface DeviceName {
  id: string;
  device_name: string;
  tradein_value?: number;
}

interface OldDeviceNameResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: DeviceName[];
}

export async function getOldDeviceName(
  device_brand: string
): Promise<OldDeviceNameResponse> {
  return apiCall<{ device_brand: string }, OldDeviceNameResponse>(
    "/getolddevicename/",
    "POST",
    { device_brand },
    undefined,
    undefined
  );
}

export interface DeviceDetail {
  id: string;
  device_name: string;
  price: number;
  device_image: string;
  sentinel_sld: number;
  sentiel_sap: number;
}
interface NewDeviceNameResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: DeviceDetail[];
}

export async function getNewDevices(
  param1: string,
  param2?: string
): Promise<NewDeviceNameResponse> {
  return apiCall<{ param1: string; param2?: string }, NewDeviceNameResponse>(
    "/getnewdevice/",
    "POST",
    { param1, param2 },
    undefined,
    undefined
  );
}

export interface StateType {
  state: string;
}

interface StateResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: StateType[];
}

export async function getStates(device_brand: string): Promise<StateResponse> {
  return apiCall<{ device_brand: string }, StateResponse>(
    "/getstate/",
    "POST",
    { device_brand },
    undefined,
    undefined
  );
}

export interface StoreType {
  id: string;
  store_name: string;
  store_address: string;
}

interface StoreResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: StoreType[];
}

export async function getStores(state: string): Promise<StoreResponse> {
  return apiCall<{ state: string }, StoreResponse>(
    "/getstore/",
    "POST",
    { state },
    undefined,
    undefined
  );
}

export type TradeInTransactionPayload = {
  first_name: string;
  last_name: string;
  address: string;
  city: string;
  state: string;
  email_address: string;
  phone_number: string;
  transaction_type: "Device Swap" | "Pay In Installments";
  new_device_id: string;
  new_device_color: string;
  old_device_id: string;
  old_device_value: string;
  imei: string;
  serial?: string;
  device_condition: "Excellent Condition" | "Not Excellent Condition";
  sentinel: "SLD" | "SAP";
  delivery_option: "instore" | "delivery";
  store_id: string;
};

// submit order detail requires another BASE_URL

interface SubmitResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: TradeInTransactionPayload[];
}

export async function submitOrder(
  details: TradeInTransactionPayload
): Promise<SubmitResponse> {
  return apiCall<TradeInTransactionPayload, SubmitResponse>(
    "/posttransaction/",
    "POST",
    details,
    undefined,
    undefined
  );
}

interface OrderPayload {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  state: string;
  store: string;
  newDeviceName: string;
  newDevicePrice: number;
  oldDeviceName: string;
  oldDevicePrice: number;
  deviceProtectionName: string;
  deviceProtectionPrice: number;
  totalPrice: number;
}

export async function submitOrderSecond(payload: OrderPayload) {
  const QTRADEIN_BASE_URL = process.env.NEXT_PUBLIC_QTRADEIN_API_BASE_URL!;

  return apiCall<OrderPayload, any>(
    "/v1/qtradein",
    "POST",
    payload,
    undefined,
    undefined, // options
    QTRADEIN_BASE_URL // ✅ correct param position for custom base URL
  );
}
