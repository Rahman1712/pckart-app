import { Component,HostListener } from '@angular/core';

@Component({
  selector: 'app-back-to-top',
  templateUrl: './back-to-top.component.html',
  styleUrls: ['./back-to-top.component.css']
})
export class BackToTopComponent {

  // Show/hide the button based on the scroll position
  showButton: boolean = false;

  // Scroll to the top of the page when the button is clicked
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Listen for scroll events to show/hide the button
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showButton = window.scrollY > 300; // Show the button when the user scrolls down 300pxdown 300px
  }
}
