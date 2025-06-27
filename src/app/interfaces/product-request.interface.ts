export interface ProductRequest {
  name: string;
  manufacturerId: number;
  price: number;
  quantity: number;
  warrantyPeriod: number; // Гарантия в месяцах
}