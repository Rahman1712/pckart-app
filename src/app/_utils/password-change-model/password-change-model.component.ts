import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-password-change-model',
  templateUrl: './password-change-model.component.html',
  styleUrls: ['./password-change-model.component.css']
})
export class PasswordChangeModelComponent {

  constructor(public dialogRef: MatDialogRef<PasswordChangeModelComponent>,
    public auth: AuthService){}

  public title: string;
  public message: string;
  public isError: boolean;

  logoutUser() {
    this.auth.clear();
    this.dialogRef.close(true);
  }
}
