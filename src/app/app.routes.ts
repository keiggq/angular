import { Routes } from '@angular/router';
import { CustomersComponent } from './customers/customers';
import { OrdersListComponent } from './order/orders';
import { ProductsComponent } from './product/products';
import { ProductFormComponent } from './product/product-form/product-form';
import { OrderFormComponent } from './order/order-form/order-form';
import { OrderDetailsComponent } from './order/order-details/order-details';
import { CustomerDetailsComponent } from './customers/customer-details/customer-details';
import { CustomerFormComponent } from './customers/customer-form/customer-form';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';



export const routes: Routes = [
  { path: 'customers', component: CustomersComponent },
  { path: 'customers/new', component: CustomerFormComponent },
  { path: 'customers/edit/:id', component: CustomerFormComponent },
  { path: 'orders', component: OrdersListComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'products/new', component: ProductFormComponent },
  { path: 'products/edit/:id', component: ProductFormComponent },
  { path: 'orders', component: OrdersListComponent },
  { path: 'orders/new', component: OrderFormComponent },
  { path: 'orders/edit/:id', component: OrderFormComponent },
  { path: 'orders/:id', component: OrderDetailsComponent },
  { path: 'customers/:id', component: CustomerDetailsComponent },
  { path: '', redirectTo: '/customers', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '/customers' },


];