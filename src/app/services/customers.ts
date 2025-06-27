import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomerResponse } from '../interfaces/customer-response.interface';
import { CustomerRequest } from '../interfaces/customer-request.interface';
import { CustomerSearchRequest } from '../interfaces/customer-request.interface';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  private apiUrl = 'http://localhost:8080/api/customers';

  constructor(private http: HttpClient) {}
  

  getAllCustomers(): Observable<CustomerResponse[]> {
    return this.http.get<CustomerResponse[]>(this.apiUrl);
  }

  getCustomerById(id: number): Observable<CustomerResponse> {
    return this.http.get<CustomerResponse>(`${this.apiUrl}/${id}`);
  }

  searchCustomers(searchRequest: CustomerSearchRequest): Observable<CustomerResponse[]> {
    return this.http.post<CustomerResponse[]>(`${this.apiUrl}/search`, searchRequest);
  }

  createCustomer(customer: CustomerRequest): Observable<CustomerResponse> {
    return this.http.post<CustomerResponse>(this.apiUrl, customer);
  }

  updateCustomer(id: number, customer: CustomerRequest): Observable<CustomerResponse> {
    return this.http.put<CustomerResponse>(`${this.apiUrl}/${id}`, customer);
  }

  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  private handleError(error: HttpErrorResponse) {
    if (error.status === 400 && error.error?.errors) {
      const formattedErrors: { [key: string]: string } = {};
      for (const field in error.error.errors) {
        formattedErrors[field] = error.error.errors[field].join(', ');
      }
      return throwError(() => ({
        type: 'validation',
        message: 'Проверьте правильность введенных данных', // Добавляем явное сообщение
        errors: formattedErrors
      }));
    }
    return throwError(() => ({
      type: 'general',
      message: error.error?.message || 'Произошла неизвестная ошибка' // Гарантируем наличие сообщения
    }));
  }
}