import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CartComponent } from './cart/cart.component';
import { ProductsComponent } from './products/products.component';
import { OrdersComponent } from './orders/orders.component';
import { authGuard } from './_auth/auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { CategoryComponent } from './products/category/category.component';
import { CategorySubcategoryComponent } from './products/category-subcategory/category-subcategory.component';
import { ProductViewComponent } from './products/product-view/product-view.component';
import { ProductResolverService } from './_services/product-resolver.service';
import { RegisterVerifyComponent } from './register/register-verify/register-verify.component';
import { ForgotComponent } from './forgot/forgot.component';
import { WishComponent } from './wish/wish.component';
import { AddressComponent } from './profile/address/address.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrderViewComponent } from './orders/order-view/order-view.component';
import { SearchProductsComponent } from './products/search-products/search-products.component';

const routes: Routes = [
  { path: '', component: HomeComponent ,   pathMatch: 'full', },
  // { path: 'home', component: HomeComponent , },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent ,},
  { path: 'register/verify', component: RegisterVerifyComponent ,},
  { path: 'profile', component: ProfileComponent ,canActivate: [authGuard],},
  { path: 'address', component: AddressComponent ,canActivate: [authGuard],},
  { path: 'forgot', component: ForgotComponent },
  // { 
  //   path: 'home', 
  //   component: HomeComponent ,
  // },
  { path: 'cart', component: CartComponent, canActivate: [authGuard],},
  { path: 'wish', component: WishComponent,},
  { path: 'checkout', component: CheckoutComponent,},
  { path: 'products', component: ProductsComponent,},
  { path: 'product-detail/:parent_category/:sub_category/product', component: ProductViewComponent, resolve: {productDto : ProductResolverService}},
  { path: 'product-category/:parent_category', component: CategoryComponent,},
  { path: 'product-category/:parent_category/:sub_category', component: CategorySubcategoryComponent,},
  { path: 'product-search', component: SearchProductsComponent,},
  { path: 'orders', component: OrdersComponent ,canActivate: [authGuard],},
  { path: 'orders/order-view', component: OrderViewComponent ,canActivate: [authGuard],},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
