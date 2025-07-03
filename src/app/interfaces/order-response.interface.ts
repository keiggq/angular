import { OrderItemResponse } from './order-item-response.interface';

export interface OrderResponse {
  id: number;
  customerId: number;
  customerName: string;
  employeeId?: number;
  employeeName?: string;
  date: Date;
  productId: number;
  quantity: number;
  productName: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}