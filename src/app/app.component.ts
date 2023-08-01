import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'pc-kart-user';
  
  ngOnInit(): void {
      /**
   * Preloader
   */
    let preloader = document.querySelector('#preloader');
    if (preloader) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          preloader!.remove()
        }, 500);
      });
    }

    /**
   * Back to top button
   */
  /*let backtotop = document.querySelector('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop!.classList.add('active')
      } else {
        backtotop!.classList.remove('active')
      }
    }
      window.addEventListener('load', toggleBacktotop)
      document.addEventListener('scroll', toggleBacktotop)
    } */
  }


}
