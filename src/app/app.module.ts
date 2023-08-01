import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { CartComponent } from './cart/cart.component';
import { PaymentComponent } from './payment/payment.component';
import { OrdersComponent } from './orders/orders.component';
import { ProfileComponent } from './profile/profile.component';
import { ViewProductComponent } from './view-product/view-product.component';
import { ForgotComponent } from './forgot/forgot.component';
import { WishComponent } from './wish/wish.component';
import { ProductsComponent } from './products/products.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ProductService } from './_services/product.service';
import { AuthService } from './_services/auth.service';
import { TokenInterceptorService } from './_services/token-interceptor.service';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CategoryComponent } from './products/category/category.component';
import { CategorySubcategoryComponent } from './products/category-subcategory/category-subcategory.component';
import { ProductViewComponent } from './products/product-view/product-view.component';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { RegisterMessageComponent } from './register/register-message/register-message.component';
import {MatDialogModule} from '@angular/material/dialog';
import { RegisterVerifyComponent } from './register/register-verify/register-verify.component';
import { ForgotOtpComponent } from './forgot/forgot-otp/forgot-otp.component';
import { PasswordChangeModelComponent } from './_utils/password-change-model/password-change-model.component';
import { LimitTextSizePipe } from './_pipes/limit-text-size.pipe';
import { AddressComponent } from './profile/address/address.component';
import { AddressAddEditComponent } from './profile/address-add-edit/address-add-edit.component';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {MatListModule} from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatExpansionModule} from '@angular/material/expansion';
import { DateFormatPipe } from './_pipes/date-format.pipe';
import { CheckoutComponent } from './checkout/checkout.component';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { BackToTopComponent } from './back-to-top/back-to-top.component';
import {MatChipsModule} from '@angular/material/chips';
import {MatSliderModule} from '@angular/material/slider';
import { AddressJoinPipe } from './_pipes/address-join.pipe';
import { ProgressRoundComponent } from './_utils/progress-round/progress-round.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AnnotatedSnackbarComponent } from './_utils/annotated-snackbar/annotated-snackbar.component';
import { AlertBoxesComponent } from './_utils/alert-boxes/alert-boxes.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { OrderViewComponent } from './orders/order-view/order-view.component';
import {MatStepperModule} from '@angular/material/stepper';
import { HighlightPipe } from './_pipes/highlight.pipe';
import { SearchProductsComponent } from './products/search-products/search-products.component';
import { ProductFilterPipe } from './_pipes/product-filter.pipe';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    CartComponent,
    PaymentComponent,
    OrdersComponent,
    ProfileComponent,
    ViewProductComponent,
    ForgotComponent,
    WishComponent,
    ProductsComponent,
    HeaderComponent,
    FooterComponent,
    CategoryComponent,
    CategorySubcategoryComponent,
    ProductViewComponent,
    RegisterMessageComponent,
    RegisterVerifyComponent,
    ForgotOtpComponent,
    PasswordChangeModelComponent,
    LimitTextSizePipe,
    AddressComponent,
    AddressAddEditComponent,
    DateFormatPipe,
    CheckoutComponent,
    BackToTopComponent,
    AddressJoinPipe,
    ProgressRoundComponent,
    AnnotatedSnackbarComponent,
    AlertBoxesComponent,
    OrderViewComponent,
    HighlightPipe,
    SearchProductsComponent,
    ProductFilterPipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatButtonModule,
    MatDialogModule,
    MatCardModule,
    MatTabsModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatIconModule,
    NgxImageZoomModule,
    MatChipsModule,
    MatSliderModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatStepperModule,
  ],
  providers: [
    ProductService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
