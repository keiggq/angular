import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomersService } from '../../services/customers';
import { OrdersService } from '../../services/orders';
import { CustomerResponse } from '../../interfaces/customer-response.interface';
import { OrderResponse } from '../../interfaces/order-response.interface';
import { OrderItemResponse } from '../../interfaces/order-item-response.interface';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.html',
  styleUrls: ['./customer-details.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class CustomerDetailsComponent implements OnInit {
  customer: CustomerResponse | null = null;
  item:  OrderItemResponse[]=[];
  orders: OrderResponse[] = [];
  loading = true;
  error: string | null = null;
  

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customersService: CustomersService,
    private ordersService: OrdersService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCustomer(+id);
    } else {
      this.error = 'Не указан ID клиента';
      this.loading = false;
    }
  }

  loadCustomer(id: number): void {
    this.customersService.getCustomerById(id).subscribe({
      next: (customer) => {
        this.customer = customer;
      },
      error: (error) => {
        console.error('Error loading customer:', error);
      }
    });
  }

  

  getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      'PENDING': 'В обработке',
      'PROCESSING': 'В работе',
      'COMPLETED': 'Завершен',
      'CANCELLED': 'Отменен'
    };
    return statusMap[status] || status;
  }

  viewOrderDetails(orderId: number): void {
    this.router.navigate(['/orders', orderId]);
  }

  goBack(): void {
    this.router.navigate(['/customers']);
  }

  formatDateTime(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(',', '');
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 2
    }).format(amount);
  }

  getDiscountPercentage(rate: number | undefined): string {
    if (rate === undefined) return '0%';
    return `${Math.round(rate * 100)}%`;
  }
}