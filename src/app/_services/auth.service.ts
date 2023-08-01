import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticationRequest } from '../_model-dto/auth/authentication-request';
import { AuthenticationResponse } from '../_model-dto/auth/authentication-response';
import { UserRegisterRequest } from '../_model-dto/user/user-register-request';
import { User } from '../_model-dto/user/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiServiceUrl = environment.apiAuthUrl;
  private apiUserUrl = environment.apiUserUrl;

  constructor(private http: HttpClient, private router: Router) { }

  public loginUser(userUserLogin: AuthenticationRequest):Observable<AuthenticationResponse>{
    return this.http.post<AuthenticationResponse>(`${this.apiServiceUrl}/authenticate`, userUserLogin);
  } 

  public registerUser(userRegister: UserRegisterRequest):Observable<AuthenticationResponse>{
    return this.http.post<AuthenticationResponse>(`${this.apiServiceUrl}/register`, userRegister);
  }

  public work():Observable<string>{
    return this.http.post<string>(`${this.apiServiceUrl}/work`,null);
  }

  public verifyUser(token: string):Observable<string>{
    const params = {
      token: token,
    };
    return this.http.post(`${this.apiServiceUrl}/verify`, null, {params: params, responseType: 'text' });
  }
  
  public getUserByUsername(username: string): Observable<User>{
    return this.http.get<User>(`${this.apiUserUrl}/get/by/username/${username}`);
  }
  
 // redirectUrl!: string;

  public loggedIn(): boolean{
    //this.redirectUrl = this.router.url;
    return !!localStorage.getItem('jwtUserToken');
  } 

  public setToken(jwtToken: string) {
    localStorage.setItem('jwtUserToken', jwtToken);
  }

  public getToken(): string | null {
    return localStorage.getItem('jwtUserToken');
  }

  public setRefreshToken(jwtRefreshToken: string) {
    localStorage.setItem('jwtUserRefreshToken', jwtRefreshToken);
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem('jwtUserRefreshToken');
  }

  public setUserName(username: string) {
    localStorage.setItem('userUsername', username);
  }

  public getUsername(): string | null {
    return localStorage.getItem('userUsername');
  }

  public setFullName(username: string) {
    localStorage.setItem('userFullname', username);
  }

  public getFullname(): string | null {
    return localStorage.getItem('userFullname');
  }

  public setRole(role: string) {
    localStorage.setItem('userRole', role);
  }

  public getRole(): string | null {
    return localStorage.getItem('userRole');
  }

  public setCartLength(cartLength: number) {
    localStorage.setItem('cartLength', String(cartLength));
  }

  public getCartLength(): string | null {
    return localStorage.getItem('cartLength');
  }

  public setWishLength(wishLength: string) {
    localStorage.setItem('wishLength', String(wishLength));
  }

  public getWishLength(): string | null {
    return localStorage.getItem('wishLength');
  }

  public clear() {
    localStorage.clear();
  }
}
