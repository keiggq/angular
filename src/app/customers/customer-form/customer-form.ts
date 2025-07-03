import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomersService } from '../../services/customers';
import { CustomerResponse } from '../../interfaces/customer-response.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-form.html',
  styleUrls: ['./customer-form.scss']
})
export class CustomerFormComponent implements OnInit {
  customer: CustomerResponse = {
    id: 0,
    name: '',
    phone: '',
    email: '',
    discountCard: '',
    discountRate: 0
  };
  
  isEditMode = false;
  errorMessages: string[] = [];
  fieldErrors: { [key: string]: string } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customersService: CustomersService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadCustomer(+id);
    }
  }

  loadCustomer(id: number): void {
    this.customersService.getCustomerById(id).subscribe({
      next: (customer) => {
        this.customer = customer;
      },
      error: (err: HttpErrorResponse) => this.handleError(err)
    });
  }

  onSubmit(): void {
    this.errorMessages = [];
    this.fieldErrors = {};

    // Конвертируем discountRate из процентов в доли перед отправкой
    const customerData = {
      ...this.customer,
      discountRate: this.customer.discountRate / 100
    };

    const operation = this.isEditMode
      ? this.customersService.updateCustomer(this.customer.id, customerData)
      : this.customersService.createCustomer(customerData);

    operation.subscribe({
      next: () => this.router.navigate(['/customers']),
      error: (err: HttpErrorResponse) => this.handleError(err)
    });
  }

  private handleError(error: HttpErrorResponse): void {
    console.error('Error:', error);

    this.errorMessages = [];
    this.fieldErrors = {};

    if (error.status === 400 && error.error?.errors) {
      this.fieldErrors = Object.fromEntries(
        Object.entries(error.error.errors)
          .map(([field, messages]) => [field, (messages as string[]).join(', ')])
      );
      this.errorMessages = ['Пожалуйста, исправьте ошибки в форме'];
    } else {
      this.errorMessages = [error.error?.message || 'Произошла ошибка при сохранении'];
    }
  }

  onCancel(): void {
    this.router.navigate(['/customers']);
  }
}