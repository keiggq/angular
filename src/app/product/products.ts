import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '../services/products';
import { ProductResponse } from '../interfaces/product-response.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrls: ['./products.scss']
})
export class ProductsListComponent implements OnInit {
  products: ProductResponse[] = [];
  filteredProducts: ProductResponse[] = [];
  searchId: number | null = null;
  isLoading = false;

  constructor(
    private productsService: ProductsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productsService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = [...products];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Ошибка загрузки продуктов', err);
        this.isLoading = false;
      }
    });
  }

  searchById(): void {
    if (!this.searchId) {
      this.filteredProducts = [...this.products];
      return;
    }
    this.filteredProducts = this.products.filter(
      product => product.id === this.searchId
    );
  }

  clearSearch(): void {
    this.searchId = null;
    this.filteredProducts = [...this.products];
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 2
    }).format(amount);
  }

  createNewProduct(): void {
    this.router.navigate(['/products/new']);
  }

  editProduct(id: number): void {
    this.router.navigate(['/products/edit', id]);
  }

  deleteProduct(id: number): void {
    if (confirm('Вы уверены, что хотите удалить этот продукт?')) {
      this.productsService.deleteProduct(id).subscribe({
        next: () => this.loadProducts(),
        error: (err) => console.error('Ошибка удаления продукта', err)
      });
    }
  }
}