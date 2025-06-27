import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '../../services/products';
import { ProductResponse } from '../../interfaces/product-response.interface';
import { ProductRequest } from '../../interfaces/product-request.interface';
import { Decimal } from 'decimal.js';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.scss']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  productId: number | null = null;
  product: ProductResponse | null = null;

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required, Validators.maxLength(1000)]],
      manufacturer: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]]
    });
  }
  cancel(): void {
    this.router.navigate(['/products']);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.productId = +params['id'];
        this.loadProduct(this.productId);
      }
    });
  }

  loadProduct(id: number): void {
    this.productsService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.productForm.patchValue({
          id: product.id,
          price: product.price,
          description: product.quantity,
          manufacturer: product.warrantyPeriod
        });
      },
      error: (err) => console.error('Error loading product', err)
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const productData: ProductRequest = this.productForm.value;

    if (this.isEditMode && this.productId) {
      this.productsService.updateProduct(this.productId, productData).subscribe({
        next: () => this.router.navigate(['/products']),
        error: (err) => console.error('Error updating product', err)
      });
    } else {
      this.productsService.createProduct(productData).subscribe({
        next: () => this.router.navigate(['/products']),
        error: (err) => console.error('Error creating product', err)
      });
    }
  }

  get title() { return this.productForm.get('title'); }
  get price() { return this.productForm.get('price'); }
  get description() { return this.productForm.get('description'); }
  get manufacturer() { return this.productForm.get('manufacturer'); }
}