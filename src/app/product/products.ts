import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '../services/products';
import { ProductResponse } from '../interfaces/product-response.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrls: ['./products.scss']
})
export class ProductsComponent implements OnInit {
  products: ProductResponse[] = [];
  filteredProducts: ProductResponse[] = [];
  searchId: string = '';
  displayedColumns: string[] = ['ID', 'Название', 'Цена', 'Производитель', 'Действие'];

  constructor(
    private productsService: ProductsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productsService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = [...data];
      },
      error: (err) => console.error('Error loading products', err)
    });
  }

  searchById(): void {
    if (!this.searchId) {
      this.filteredProducts = [...this.products];
      return;
    }

    const id = parseInt(this.searchId);
    if (isNaN(id)) {
      this.filteredProducts = [];
      return;
    }

    this.productsService.getProductById(id).subscribe({
      next: (product) => {
        this.filteredProducts = product ? [product] : [];
      },
      error: (err) => {
        console.error('Search error', err);
        this.filteredProducts = [];
      }
    });
  }

  clearSearch(): void {
    this.searchId = '';
    this.filteredProducts = [...this.products];
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productsService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== id);
          this.filteredProducts = this.filteredProducts.filter(p => p.id !== id);
        },
        error: (err) => console.error('Error deleting product', err)
      });
    }
  }

  editProduct(id: number): void {
    this.router.navigate(['/products/edit', id]);
  }

  createNewProduct(): void {
    this.router.navigate(['/products/new']);
  }
  formatCurrency(amount: number): string {
    const formattedAmount = amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return `${formattedAmount} ₽`;
  }
}