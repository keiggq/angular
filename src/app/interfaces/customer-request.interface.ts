export interface CustomerRequest {
  name: string;
  phone: string;
  email: string;
  discountCard?: string;  // Опциональное поле
  discountRate?: number;  // В процентах (0-100)
}

// interfaces/customer-search-request.interface.ts
export interface CustomerSearchRequest {
  name: string;
  exactMatch: boolean;
}