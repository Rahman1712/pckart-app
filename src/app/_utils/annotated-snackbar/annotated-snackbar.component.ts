import { Component, inject } from '@angular/core';
import { MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-cart-annotated-snackbar',
  templateUrl: './annotated-snackbar.component.html',
  styleUrls: ['./annotated-snackbar.component.css']
})
export class AnnotatedSnackbarComponent {
  snackBarRef = inject(MatSnackBarRef);

  snackMessage = '';
  isError = false;
}
