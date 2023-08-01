import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

export enum AlertType {
  CONFIRMATION = 'CONFIRMATION',
  INFO = 'INFO'
}

@Component({
  selector: 'app-alert-boxes',
  templateUrl: './alert-boxes.component.html',
  styleUrls: ['./alert-boxes.component.css']
})
export class AlertBoxesComponent {
  
  constructor(public dialogRef: MatDialogRef<AlertBoxesComponent>){}
  
  alertType: AlertType = AlertType.INFO;

  conform_title: string = 'Confirm';
  conform_message: string = 'Confirmation Message';

  info_title: string = 'info';
  info_message: string = 'information';
  info_color:string = 'primary';

  getAlertType():string{
    return this.alertType;
  }
}
