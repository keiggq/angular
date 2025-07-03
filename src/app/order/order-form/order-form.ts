import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { OrdersService } from '../../services/orders';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderRequest } from '../../interfaces/order-request.interface';
import { OrderResponse } from '../../interfaces/order-response.interface';
import { ProductsService } from '../../services/products';
import { ProductResponse } from '../../interfaces/product-response.interface';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './order-form.html',
  styleUrls: ['./order-form.scss']
})
export class OrderFormComponent implements OnInit {
  orderForm: FormGroup;
  isEditMode = false;
  orderId: number | null = null;
  products: ProductResponse[] = [];
  isLoading = false;
  statusOptions = [
    { value: 'NEW', label: 'Новый' },
    { value: 'PROCESSING', label: 'В обработке' },
    { value: 'SHIPPED', label: 'Отправлен' },
    { value: 'DELIVERED', label: 'Доставлен' },
    { value: 'CANCELLED', label: 'Отменен' }
  ];

  constructor(
    private fb: FormBuilder,
    private ordersService: OrdersService,
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.orderForm = this.fb.group({
      customerId: ['', [Validators.required, Validators.min(1)]],
      customerName: ['', [Validators.required, Validators.minLength(3)]],
      employeeId: [null],
      employeeName: [''],
      productId: ['', Validators.required],
      productName: [''],
      quantity: ['', [Validators.required, Validators.min(1)]],
      date: [new Date().toISOString().split('T')[0], Validators.required],
      totalPrice: [0, [Validators.required, Validators.min(0)]],
      status: ['NEW', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.orderId = +id;
      this.loadOrder(this.orderId);
    }

    // Подписываемся на изменения productId для автоматического заполнения productName
    this.orderForm.get('productId')?.valueChanges.subscribe(productId => {
      const selectedProduct = this.products.find(p => p.id === productId);
      if (selectedProduct) {
        this.orderForm.patchValue({
          productName: selectedProduct.name,
          totalPrice: selectedProduct.price * (this.orderForm.get('quantity')?.value || 1)
        });
      }
    });

    // Подписываемся на изменения quantity для пересчёта totalPrice
    this.orderForm.get('quantity')?.valueChanges.subscribe(quantity => {
      const productId = this.orderForm.get('productId')?.value;
      if (productId) {
        const selectedProduct = this.products.find(p => p.id === productId);
        if (selectedProduct) {
          this.orderForm.patchValue({
            totalPrice: selectedProduct.price * quantity
          }, { emitEvent: false });
        }
      }
    });
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productsService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Ошибка загрузки продуктов', err);
        this.isLoading = false;
      }
    });
  }

  loadOrder(id: number): void {
    this.isLoading = true;
    this.ordersService.getOrderById(id).subscribe({
      next: (order) => {
        this.orderForm.patchValue({
          customerId: order.customerId,
          customerName: order.customerName,
          employeeId: order.employeeId,
          employeeName: order.employeeName,
          productId: order.productId,
          productName: order.productName,
          quantity: order.quantity,
          date: this.formatDateForInput(order.date),
          totalPrice: order.totalPrice,
          status: order.status
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Ошибка загрузки заказа', err);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.orderForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formValue = this.orderForm.value;
    const orderData: OrderRequest = {
      ...formValue,
      date: new Date(formValue.date).toISOString()
    };

    const operation = this.isEditMode && this.orderId
      ? this.ordersService.updateOrder(this.orderId, orderData)
      : this.ordersService.createOrder(orderData);

    operation.subscribe({
      next: () => {
        this.router.navigate(['/orders']);
      },
      error: (err) => {
        console.error('Ошибка сохранения заказа', err);
        this.isLoading = false;
      }
    });
  }

  private markAllAsTouched(): void {
    Object.values(this.orderForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  private formatDateForInput(date: string | Date): string {
    const dateObj = new Date(date);
    return dateObj.toISOString().split('T')[0];
  }

  formatCurrency(amount: number): string {
    return amount.toLocaleString('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 2
    });
  }

  cancel(): void {
    this.router.navigate(['/orders']);
  }
}