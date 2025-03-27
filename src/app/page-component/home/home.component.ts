import { Component, OnInit, OnDestroy, AfterViewInit, Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  images: string[] = [
    '/image/slider_1.jpg',
    '/image/slider_2.jpg',
    // '/image/slider_3.jpg',
    '/image/slider_4.jpg',
    '/image/slider_5.jpg',
  ];
  currentIndex = 0;
  intervalId: any;
  maxHeight = 0;

  constructor(private renderer: Renderer2, private elRef: ElementRef) {}

  ngOnInit() {
    this.startSlider();
  }

  startSlider() {
    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }, 3000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}