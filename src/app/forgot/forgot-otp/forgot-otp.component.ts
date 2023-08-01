import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserserviceService } from 'src/app/_services/userservice.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-forgot-otp',
  templateUrl: './forgot-otp.component.html',
  styleUrls: ['./forgot-otp.component.css']
})
export class ForgotOtpComponent {

  constructor(public dialogRef: MatDialogRef<ForgotOtpComponent>,
    public user_service: UserserviceService){}

  otpError: boolean = false;
  errorMsg: string = '';

  success: boolean = false;
  successMsg: string = '';

  email: string;
  otp: string;
  newPassword: string;
  renewPassword: string;

  updateForgotPasswordByEmail(){
    if(this.newPassword != this.renewPassword){
      this.otpError = true;
      this.errorMsg = 'new password and renew password is not same';
      return;
    }

    this.user_service.updateForgotPasswordOtp(this.email, this.newPassword, this.otp)
    .subscribe({
      next: (next:any) =>{
        console.log(next)
        this.success = true;
        this.successMsg = 'password reset successfully';
      },
      error: (error: HttpErrorResponse) =>{
        console.log(error)
        const errorMessage = error.error; //"{\"errorMessage\":\"current password doesn't match\"}"
        const errorObject = JSON.parse(errorMessage);
        const extractedErrorMessage = errorObject.errorMessage;

        this.otpError = true;
        this.errorMsg = extractedErrorMessage;
      }
    });
  
  }

  isErrorOnOtp(){
    return this.otpError;
  }

  isSuccess(){
    return this.success;
  }

  onKeyUp(){
    this.otpError = false;
    this.errorMsg = 'error';
    this.success = false;
    this.successMsg = '';
  }
}
