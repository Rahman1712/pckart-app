import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { User } from '../_model-dto/user/user';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserserviceService {

  public user : User = new User();
  private apiAuthUrl = environment.apiAuthUrl;
  private apiUserUrl = environment.apiUserUrl;

  constructor(private authService:AuthService, 
    private http: HttpClient, 
    ) { 

    // this.getUserDetailsByUsername();
  }

  public resetPasswordRequest(email : string):Observable<string>{
    return this.http.post(`${this.apiAuthUrl}/forgot-password/${email}`, null, {responseType : 'text'});
  }
  
  public updateForgotPasswordOtp(email: string, newPassword: string, otp: string): Observable<string>{
    const params = {
      newPassword : newPassword,
      otp: otp,
    }
    return this.http.put(`${this.apiAuthUrl}/update/forgot-password/byemail/${email}`, null, {params: params,responseType : 'text'});
  }

  public getUserByUsername(username: string): Observable<User>{
    return this.http.get<User>(`${this.apiUserUrl}/get/by/username/${username}`);
  }

  getUserDetailsByUsername():any{
    const username =  this.authService.getUsername();
    this.getUserByUsername(username!)
    .subscribe({
      next: (next: User) => {
        console.log(next)
        this.user =  next;
        return next;
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        alert(error.message);
      }
    })
  }


}
