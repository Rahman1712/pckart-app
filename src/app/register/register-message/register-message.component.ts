import { Component} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-register-message',
  templateUrl: './register-message.component.html',
  styleUrls: ['./register-message.component.css']
})
export class RegisterMessageComponent {
  
  constructor(public dialogRef: MatDialogRef<RegisterMessageComponent>){}

  homePage() {
    this.dialogRef.close(true);
  }

}
