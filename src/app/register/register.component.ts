import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserRegisterRequest } from '../_model-dto/user/user-register-request';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RegisterMessageComponent } from './register-message/register-message.component';
import { AuthService } from '../_services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationResponse } from '../_model-dto/auth/authentication-response';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{

  constructor(public dialog: MatDialog,
    public authService: AuthService,
    ){}

  dialogRef: MatDialogRef<RegisterMessageComponent> | null;
  
  public userRegister: UserRegisterRequest = new UserRegisterRequest();
  confirmPassword: string = '';
  isPasswordError: boolean = false;

  ngOnInit(): void {

  }

  isError: boolean = false;
  errorMessage: string = '';
  errorField: string = '';

  registerUser(userForm: NgForm){
    if(this.userRegister.password != this.confirmPassword){
      this.isPasswordError = true;
      return;
    }

    this.authService.registerUser(this.userRegister)
    .subscribe({
      next: (next: AuthenticationResponse) =>{
        console.log(next);
        this.dialogRef = this.dialog.open(RegisterMessageComponent, {
          disableClose: true
        });
        this.dialogRef.afterClosed().subscribe(result => {
          this.dialogRef = null;
        });
      },
      error: (error: HttpErrorResponse) =>{
        console.log(error);
        this.isError = true;
        this.errorField = error.error.field;
        this.errorMessage = error.error.message;
      }
    })
  }

  clearForm(userForm: NgForm){
    // userForm.reset();
    console.log(this.errorField);
    console.log(this.isError);
    console.log(this.errorMessage);
  }

  onKeyUp(){  
    this.isError = false;
    this.errorMessage = '';
    this.errorField = '';
  }

  onKeyUpPassword(){
    this.isPasswordError = false;
  }
}
