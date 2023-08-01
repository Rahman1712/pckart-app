import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CouponService {

  private apiCouponUrl = environment.apiCouponUrl;

  constructor(
    private http: HttpClient, 
    private auth_service: AuthService,
    private router: Router ,
  ) { }

  /* ===========================HTTP===================================== */
  public checkAndCreateByCode(code: string, userId: number): Observable<any>{
    const params = { userId: userId };
    return this.http.post<any>(`${this.apiCouponUrl}/check_and_create/coupon/${code}`,null, {params: params});
  }


}
