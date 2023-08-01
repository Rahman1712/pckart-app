import { Component } from '@angular/core';
import { PasswordChangeModelComponent } from '../_utils/password-change-model/password-change-model.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { UserserviceService } from '../_services/userservice.service';
import { ForgotOtpComponent } from './forgot-otp/forgot-otp.component';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent {

  constructor(
    // private authService: AuthService, 
    private user_service: UserserviceService,
    public dialog: MatDialog,
    ){}

  dialogRef: MatDialogRef<PasswordChangeModelComponent> | null;
  dialogForgotOtpRef: MatDialogRef<ForgotOtpComponent> | null;


  email: string;
  newPassword: string;
  renewPassword: string;

  resetPassword(){
    this.user_service.resetPasswordRequest(this.email)
    .subscribe({
      next: (next:any) =>{
        console.log(next)
        
        this.dialogForgotOtpRef = this.dialog.open(ForgotOtpComponent, {
          disableClose: true
        });
        this.dialogForgotOtpRef.componentInstance.email = this.email;
        this.dialogForgotOtpRef.afterClosed().subscribe(result => {
          this.dialogForgotOtpRef = null;
        });
      },
      error: (error: HttpErrorResponse) =>{
        console.log(error)
        const errorMessage = error.error; //"{\"errorMessage\":\"current password doesn't match\"}"
        const errorObject = JSON.parse(errorMessage);
        const extractedErrorMessage = errorObject.errorMessage;

        this.dialogRef = this.dialog.open(PasswordChangeModelComponent, {
          disableClose: false
        });
        this.dialogRef.componentInstance.title = "Error";
        this.dialogRef.componentInstance.message = extractedErrorMessage;
        this.dialogRef.componentInstance.isError = true;
        this.dialogRef.afterClosed().subscribe(result => {
          this.dialogRef = null;
        });
      }
    });
  }

}
