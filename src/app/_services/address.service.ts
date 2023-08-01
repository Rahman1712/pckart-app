import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../_model-dto/user/user';
import { Address } from '../_model-dto/user/address';
import { HttpClient , HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private apiUserUrl = environment.apiUserUrl;

  constructor(private http: HttpClient, ) { }

  public saveAddresses(username: string, addresses:Address[]):Observable<User>{
    return this.http.put<User>(`${this.apiUserUrl}/update/addresses/${username}`, addresses);
  }

  public getAddressListByUsername(username: string):Observable<Address[]>{
    return this.http.get<Address[]>(`${this.apiUserUrl}/get/all/addresses/byusername/${username}`);
  }

  public getAddressListByUserId(userId: number):Observable<Address[]>{
    return this.http.get<Address[]>(`${this.apiUserUrl}/get/all/addresses/byid/${userId}`);
  }

  public deleteAddressById(addressId: number): Observable<string> {
    return this.http.delete(`${this.apiUserUrl}/delete/address/${addressId}`,{ responseType: 'text' });
  }

  public updateAddressContactOnly(addressId: number, contact: string): Observable<string> {
    const params: HttpParams = new HttpParams().set("contact", contact);
  
    return this.http.put(`${this.apiUserUrl}/update/address/contact-only/${addressId}`, null, {
      params: params,
      responseType: 'text'
    });
  }
  
  public updateAddressContacts(addressId: number, contact: string,
    alternative_contact: string): Observable<string> {
    const params:HttpParams = new HttpParams().set("contact",contact)
    .set("alternative_contact",alternative_contact);
    
    return this.http.put(`${this.apiUserUrl}/update/address/contacts/${addressId}`, null,{ params: params, responseType: 'text' });
  }

  public updateAddressSelected(addressId: number,userId: number): Observable<any> {
    return this.http.put(`${this.apiUserUrl}/update/address/selected/${addressId}?userId=${userId}`, null, {responseType: 'text'});
  }
}
