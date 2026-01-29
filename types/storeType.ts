export interface Store {
  storeOldId: number;
  storeName: string;
  city: string;
  state: string;
  region: string;
  address: string;
  accountNumber: string;
  accountName: string;
  bankName: string;
  bankCode: string;
  phoneNumber: string;
  storeEmail: string;
  longitude: number;
  latitude: number;
  clusterId: number;
  partner: string;
  storeOpen: string;
  storeClose: string;
  createdAt: string;
  updatedAt: string;
  storeId: string;
  isArchived: boolean;
  storeErpId: string | null;
  channel: string | null;
}
