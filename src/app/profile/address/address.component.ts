import { Component , OnInit} from '@angular/core';
import { User } from 'src/app/_model-dto/user/user';
import { AuthService } from 'src/app/_services/auth.service';
import { ImageProcessingServiceService } from 'src/app/_services/image-processing-service.service';
import { UserserviceService } from 'src/app/_services/userservice.service';
import {map} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http'
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddressAddEditComponent } from '../address-add-edit/address-add-edit.component';
import { Address } from 'src/app/_model-dto/user/address';
import { AddressService } from 'src/app/_services/address.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit{
  
  constructor(
    private authService: AuthService, 
    private user_service: UserserviceService,
    private imageProcessingService: ImageProcessingServiceService,
    public dialog: MatDialog,
    public address_service: AddressService, 
  ){}

  user: User = new User();
  addressList: Address[] = [];

  dialogRef: MatDialogRef<AddressAddEditComponent> | null;
  
  ngOnInit(): void {
    this.getUserDetail();
  }
  public getUserDetail(){
    this.user_service.getUserByUsername(this.authService.getUsername()!)
    .pipe(
      map((user: User) => 
        this.imageProcessingService.createUserImage(user)
      )
    )
    .subscribe({
      next: (next: User) =>{
        console.log(next)
        this.user = next;
        this.addressList = next.addresses;
        this.addressList.sort((a, b) => a.id - b.id);
      },
      error: (error: HttpErrorResponse) =>{
        console.log(error)
        alert(error.message)
      }
    });
  }

  updateAddress(address: Address){
    this.dialogRef = this.dialog.open(AddressAddEditComponent, {
      disableClose: true,
      width: "80%",
      // height: '400px',
    });  
    this.dialogRef.componentInstance.address = address;
    this.dialogRef.componentInstance.isNew = false;
    this.dialogRef.afterClosed().subscribe(result => {
      if(result != 'close'){
        console.log(result)
        this.address_service.saveAddresses(this.user.username, this.user.addresses)
        .subscribe({
          next: (userResult: User) =>{
            console.log(userResult);
            this.user.addresses =  userResult.addresses;
            this.addressList = userResult.addresses;
          },
          error: (error: HttpErrorResponse) =>{
            alert(error.message)
            console.log(error);
          }
        });
      }else{
        console.log('dialog closed : back')
      }
      this.dialogRef = null;
    });
  }
  addAddress(){
    let newAddress: Address = new Address();
    this.dialogRef = this.dialog.open(AddressAddEditComponent, {
      disableClose: true,
      width: "60%",
      // height: '400px',
    });
    this.dialogRef.componentInstance.isNew = true;
    this.dialogRef.componentInstance.address = newAddress;
    this.dialogRef.afterClosed().subscribe(result => {
      if(result != 'close'){
        console.log(result)
        this.user.addresses.push(result); // push
        this.address_service.saveAddresses(this.user.username, this.user.addresses)
        .subscribe({
          next: (userResult: User) =>{
            console.log(userResult);
            this.user.addresses =  userResult.addresses;
          },
          error: (error: HttpErrorResponse) =>{
            alert(error.message)
            console.log(error);
          }
        });
      }else{
        console.log('dialog closed : back')
      }
      this.dialogRef = null;
    });
  }

  deleteAddress(address: Address){
    let index = this.user.addresses.indexOf(address);
    // alert(index)
    this.address_service.deleteAddressById(address.id)
    .subscribe({
      next: (res: string) => {
        this.user.addresses.splice(index,1);
        console.log(res);
        if(address.selected && this.user.addresses.length > 0 ){
          this.setDefault(this.user.addresses[0].id);
        }
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message)
        console.log(error);
      }
    });
  }

  setDefault(id: number){
    this.address_service.updateAddressSelected(id,this.user.id)
    .subscribe({
      next: (res: string) => {
        console.log(res);
        this.getUserDetail();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message)
        console.log(error);
      }
    });
  }
}
