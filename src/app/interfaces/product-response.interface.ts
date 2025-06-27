export interface ProductResponse {
  id: number;
  name: string;
  manufacturerId: number;
  manufacturerName: string;
  price: number;
  quantity: number;
  warrantyPeriod: number; // Гарантия в месяцах
}