import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '../../services/products';
import { ManufacturerService } from '../../services/manufacture';
import { ProductResponse } from '../../interfaces/product-response.interface';
import { ProductRequest } from '../../interfaces/product-request.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.scss']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  productId: number | null = null;
  product: ProductResponse | null = null;
  manufacturers: any[] = [];

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private manufacturerService: ManufacturerService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      manufacturerId: [null, Validators.required],
      price: ['', [Validators.required, Validators.min(0.01)]],
      quantity: ['', [Validators.required, Validators.max(1000)]],
      warrantyPeriod: ['', [Validators.required, Validators.max(120)]]
    });
  }

  ngOnInit(): void {
    this.loadManufacturers();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.productId = +params['id'];
        this.loadProduct(this.productId);
      }
    });
  }

  loadManufacturers(): void {
    this.manufacturerService.getManufacturers().subscribe({
      next: (data) => this.manufacturers = data,
      error: (err) => console.error('Error loading manufacturers', err)
    });
  }

  loadProduct(id: number): void {
    this.productsService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.productForm.patchValue({
          name: product.name,
          manufacturerId: product.manufacturerId,
          price: product.price,
          quantity: product.quantity,
          warrantyPeriod: product.warrantyPeriod
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

    const formValue = this.productForm.value;
    const productData: ProductRequest = {
      name: formValue.name,
      manufacturerId: Number(formValue.manufacturerId),
      price: Number(formValue.price),
      quantity: Number(formValue.quantity),
      warrantyPeriod: Number(formValue.warrantyPeriod)
    };

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

  cancel(): void {
    this.router.navigate(['/products']);
  }

  get name() { return this.productForm.get('name'); }
  get manufacturerId() { return this.productForm.get('manufacturerId'); }
  get price() { return this.productForm.get('price'); }
  get quantity() { return this.productForm.get('quantity'); }
  get warrantyPeriod() { return this.productForm.get('warrantyPeriod'); }
}