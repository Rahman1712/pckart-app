import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Address } from 'src/app/_model-dto/user/address';
import { User } from 'src/app/_model-dto/user/user';

@Component({
  selector: 'app-address-add-edit',
  templateUrl: './address-add-edit.component.html',
  styleUrls: ['./address-add-edit.component.css']
})
export class AddressAddEditComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AddressAddEditComponent>,
  ){}
  ngOnInit(): void {}

  public user: User;
  public address: Address = new Address();
  isNew = false;
  formError: boolean = false;
  errorMsg: string = '';

  save(){
    if(!this.checkValidation()) return;
    this.dialogRef.close(this.address);
  }

  update(){
    if(!this.checkValidation()) return;
    this.dialogRef.close(this.address);
  }

  closePopup(){
    this.dialogRef.close('close');
  }


  checkValidation(){
    if(
      this.address.houseno != undefined && this.address.houseno.trim() != '' &&
      this.address.place != undefined && this.address.place.trim() != '' &&
      this.address.city != undefined && this.address.city.trim() != '' &&
      this.address.state != undefined && this.address.state.trim() != '' &&
      this.address.country != undefined && this.address.country.trim() != '' &&
      this.address.pincode != undefined && this.address.pincode.trim() != '' &&
      this.address.contact != undefined && this.address.contact.trim() != '' &&
      this.address.contact.length == 10
    ){
      return true;
    }else{
      this.formError = true;
      this.errorMsg = 'please fill all fields';
      return false;
    }
  }
  isErrorOnForm(){
    return this.formError;
  }
  onKeyUp(){
    this.formError = false;
    this.errorMsg = 'error';
  }
}
