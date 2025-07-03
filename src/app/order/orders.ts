import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrdersService } from '../services/orders';
import { OrderResponse } from '../interfaces/order-response.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrderItemResponse } from '../interfaces/order-item-response.interface';

@Component({
  selector: 'app-orders-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.html',
  styleUrls: ['./orders.scss']
})
export class OrdersListComponent implements OnInit {
  orders: OrderResponse[] = [];
  filteredOrders: OrderResponse[] = [];
  searchId: number | null = null;
  isLoading = false;
  


  constructor(
    private ordersService: OrdersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.ordersService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.filteredOrders = [...orders];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Ошибка загрузки заказов', err);
        this.isLoading = false;
      }
    });
  }

  searchById(): void {
    if (!this.searchId) {
      this.filteredOrders = [...this.orders];
      return;
    }
    this.filteredOrders = this.orders.filter(order => order.id === this.searchId);
  }

  clearSearch(): void {
    this.searchId = null;
    this.filteredOrders = [...this.orders];
  }

  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU');
  }

  formatCurrency(amount: number): string {
    return amount.toLocaleString('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 2
    });
  }

  getStatusClass(status: string): string {
    return {
      'NEW': 'status-new',
      'PROCESSING': 'status-processing',
      'SHIPPED': 'status-shipped',
      'DELIVERED': 'status-delivered',
      'CANCELLED': 'status-cancelled'
    }[status] || 'status-default';
  }

  getStatusText(status: string): string {
    return {
      'NEW': 'Новый',
      'PROCESSING': 'В обработке',
      'SHIPPED': 'Отправлен',
      'DELIVERED': 'Доставлен',
      'CANCELLED': 'Отменен'
    }[status] || status;
  }

  viewOrderDetails(id: number): void {
    this.router.navigate(['/orders', id]);
  }

  editOrder(id: number): void {
    this.router.navigate(['/orders/edit', id]);
  }

  createNewOrder(): void {
    this.router.navigate(['/orders/new']);
  }

  deleteOrder(id: number): void {
    if (confirm('Вы уверены, что хотите удалить этот заказ?')) {
      this.ordersService.deleteOrder(id).subscribe({
        next: () => this.loadOrders(),
        error: (err) => console.error('Ошибка удаления заказа', err)
      });
    }
  }
}