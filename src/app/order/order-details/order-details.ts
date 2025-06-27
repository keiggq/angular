import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from '../../services/orders';
import { OrderResponse } from '../../interfaces/order-response.interface';
import { OrderItemResponse } from '../../interfaces/order-item-response.interface';
import { CustomerResponse } from '../../interfaces/customer-response.interface';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-details.html',
  styleUrls: ['./order-details.scss']
})
export class OrderDetailsComponent implements OnInit {
  order: OrderResponse | null = null;
  item:  OrderItemResponse | null = null;
  

  constructor(
    private route: ActivatedRoute,
    private ordersService: OrdersService,
    public router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.ordersService.getOrderById(id).subscribe({
      next: (order) => this.order = order,
      error: (err) => console.error('Ошибка загрузки заказа', err)
    });
  }

  formatDateTime(dateString: string | Date): string {
    const date = new Date(dateString.toString());
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }

  formatCurrency(amount: number): string {
    const formattedAmount = amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return `${formattedAmount} ₽`;
  }

  getStatusName(status: string): string {
    const statusMap: Record<string, string> = {
      'NEW': 'Новый',
      'PROCESSING': 'В обработке',
      'SHIPPED': 'Отправлен',
      'DELIVERED': 'Доставлен',
      'CANCELLED': 'Отменен'
    };
    return statusMap[status] || status;
  }
}