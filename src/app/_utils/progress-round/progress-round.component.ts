import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-round',
  templateUrl: './progress-round.component.html',
  styleUrls: ['./progress-round.component.css']
})
export class ProgressRoundComponent implements OnInit{
  degrees: number = 0;
  showSpinner: boolean = true;


  ngOnInit() {
    this.showLoadingSpinner();
    setTimeout(() => {
      this.hideLoadingSpinner();
      this.setProgress(25); 
    }, 2000); 
  }

  showLoadingSpinner() {
    this.showSpinner = true;
  }

  hideLoadingSpinner() {
    this.showSpinner = false;
  }

  setProgress(percent: number) {
    this.degrees = (360 * percent) / 100;
  }
}
