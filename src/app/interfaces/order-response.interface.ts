import { OrderItemResponse } from './order-item-response.interface';

export interface OrderResponse {
  id: number;
  customerId: number;
  customerName: string;
  employeeId?: number;
  employeeName?: string;
  date: Date;
  items: OrderItemResponse[];
  totalPrice: number;
  status: string;
  createdAt: string;
}