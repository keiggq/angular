import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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

  constructor(
    private fb: FormBuilder,
    private ordersService: OrdersService,
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.orderForm = this.fb.group({
      customerId: ['', [Validators.required, Validators.min(1)]],
      orderAddress: ['', [Validators.required, Validators.minLength(3)]],
      items: this.fb.array([], Validators.required)
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
  }

  get items(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  createItem(): FormGroup {
    return this.fb.group({
      productId: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]]
    });
  }

  addItem(): void {
    this.items.push(this.createItem());
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  loadProducts(): void {
    this.productsService.getAllProducts().subscribe({
      next: (products) => this.products = products,
      error: (err) => console.error('Ошибка загрузки продуктов', err)
    });
  }

  loadOrder(id: number): void {
    this.ordersService.getOrderById(id).subscribe({
      next: (order) => {
        // Clear existing items
        while (this.items.length) {
          this.items.removeAt(0);
        }
        
        // Add items from order
        order.items.forEach(item => {
          this.items.push(this.fb.group({
            productId: [item.productId, Validators.required],
            quantity: [item.quantity, [Validators.required, Validators.min(1)]]
          }));
        });

        this.orderForm.patchValue({
          customerId: order.customerId,
        });
      },
      error: (err) => console.error('Ошибка загрузки заказа', err)
    });
  }

  onSubmit(): void {
    if (this.orderForm.invalid || this.items.length === 0) return;

    const orderData: OrderRequest = this.orderForm.value;
    const operation = this.isEditMode && this.orderId
      ? this.ordersService.updateOrder(this.orderId, orderData)
      : this.ordersService.createOrder(orderData);

    operation.subscribe({
      next: () => this.router.navigate(['/orders']),
      error: (err) => console.error('Ошибка сохранения заказа', err)
    });
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