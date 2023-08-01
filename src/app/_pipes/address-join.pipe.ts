import { Pipe, PipeTransform } from '@angular/core';
import { Address } from '../_model-dto/user/address';

@Pipe({
  name: 'addressJoin'
})
export class AddressJoinPipe implements PipeTransform {

  transform(address: any): string {  //address: Address
    let joinedAddress: string =  `${address.fullname}, ${address.houseno}, 
    ${address.place}, ${address.city}, ${address.post}, ${address.pincode}, 
    ${address.state}, ${address.country} `;
      
    return joinedAddress;
  }

}
