export interface CustomerResponse {
  id: number;
  name: string;
  phone: string;
  email: string;
  discountCard: string;
  discountRate: number;  // В долях (0.1 = 10%)
}