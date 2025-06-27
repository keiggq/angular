import { OrderItemRequest } from './order-item-request.interface';

export interface OrderRequest {
  customerId: number;
  orderAddress: string;
  items: OrderItemRequest[];
}