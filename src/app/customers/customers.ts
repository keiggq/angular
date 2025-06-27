import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomersService } from '../services/customers';
import { CustomerResponse } from '../interfaces/customer-response.interface';
import { CustomerSearchRequest } from '../interfaces/customer-request.interface';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-customers',
  templateUrl: './customers.html',
  imports: [CommonModule, FormsModule, RouterModule],
  styleUrls: ['./customers.scss'],
  standalone: true,
  providers: [CustomersService]
})
export class CustomersComponent implements OnInit {
  displayedColumns: string[] = ['ID', 'Имя', 'Телефон', 'Email', 'Карта лояльности', 'Скидка', 'Действия'];
  customers: CustomerResponse[] = [];
  filteredCustomers: CustomerResponse[] = [];
  searchName: string = '';
  exactMatch: boolean = false;

  constructor(
    private dialog: MatDialog,
    private customersService: CustomersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customersService.getAllCustomers().subscribe({
      next: (customers) => {
        this.customers = customers;
        this.filteredCustomers = [...customers];
      },
      error: (error) => {
        console.error('Ошибка загрузки клиентов:', error);
      }
    });
  }

  searchCustomers(): void {
    if (!this.searchName) {
      this.filteredCustomers = [...this.customers];
      return;
    }

    const searchRequest: CustomerSearchRequest = {
      name: this.searchName,
      exactMatch: this.exactMatch
    };

    this.customersService.searchCustomers(searchRequest).subscribe({
      next: (customers) => {
        this.filteredCustomers = customers;
      },
      error: (error) => {
        console.error('Ошибка поиска клиентов:', error);
        this.filteredCustomers = [];
      }
    });
  }

  clearSearch(): void {
    this.searchName = '';
    this.exactMatch = false;
    this.filteredCustomers = [...this.customers];
  }

  viewCustomerOrders(id: number): void {
    this.router.navigate(['/customers', id, 'orders']);
  }

  createNewCustomer(): void {
    this.router.navigate(['/customers/new']);
  }

  editCustomer(id: number): void {
    this.router.navigate(['/customers/edit', id]);
  }

  deleteCustomer(id: number): void {
    if (confirm('Вы уверены, что хотите удалить этого клиента?')) {
      this.customersService.deleteCustomer(id).subscribe({
        next: () => {
          this.loadCustomers();
        },
        error: (error) => {
          console.error('Ошибка удаления клиента:', error);
        }
      });
    }
  }
}