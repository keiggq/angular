import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomersService } from '../../services/customers';
import { CustomerResponse } from '../../interfaces/customer-response.interface';

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-form.html',
  styleUrls: ['./customer-form.scss']
})
export class CustomersListComponent implements OnInit {
  searchName: string = '';
  exactMatch: boolean = false;
  filteredCustomers: CustomerResponse[] = [];
  allCustomers: CustomerResponse[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(
    private customersService: CustomersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.customersService.getAllCustomers().subscribe({
      next: (customers) => {
        this.allCustomers = customers;
        this.filteredCustomers = [...customers];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Ошибка загрузки клиентов:', err);
        this.errorMessage = 'Не удалось загрузить список клиентов';
        this.isLoading = false;
      }
    });
  }

  searchCustomers(): void {
    if (!this.searchName) {
      this.filteredCustomers = [...this.allCustomers];
      return;
    }

    const searchTerm = this.searchName.toLowerCase();
    this.filteredCustomers = this.allCustomers.filter(customer => {
      if (this.exactMatch) {
        return customer.name.toLowerCase() === searchTerm;
      } else {
        return customer.name.toLowerCase().includes(searchTerm);
      }
    });
  }

  clearSearch(): void {
    this.searchName = '';
    this.filteredCustomers = [...this.allCustomers];
  }

  viewCustomerOrders(customerId: number): void {
    this.router.navigate(['/customers', customerId, 'orders']);
  }

  editCustomer(customerId: number): void {
    this.router.navigate(['/customers', customerId, 'edit']);
  }

  deleteCustomer(customerId: number): void {
    if (confirm('Вы уверены, что хотите удалить этого клиента?')) {
      this.customersService.deleteCustomer(customerId).subscribe({
        next: () => {
          this.allCustomers = this.allCustomers.filter(c => c.id !== customerId);
          this.filteredCustomers = this.filteredCustomers.filter(c => c.id !== customerId);
        },
        error: (err) => {
          console.error('Ошибка удаления клиента:', err);
          this.errorMessage = 'Не удалось удалить клиента';
        }
      });
    }
  }
}