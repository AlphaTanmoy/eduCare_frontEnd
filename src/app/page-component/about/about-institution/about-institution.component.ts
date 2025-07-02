import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { loadBootstrap, removeBootstrap } from '../../../../load-bootstrap';

interface Teacher {
  name: string;
  designation: string;
  image: string;
}

@Component({
  selector: 'app-about-institution',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about-institution.component.html',
  styleUrl: './about-institution.component.css'
})
export class AboutInstitutionComponent implements OnInit, OnDestroy {
  teachers: Teacher[] = [
    {
      name: 'Mr. Roni Pramanik',
      designation: 'Computer Teacher',
      image: 'teachers/Mr_Roni_Pramanik.jpg'
    },
    {
      name: 'Ms. Shreyasi Poddar',
      designation: 'Spoken English Teacher',
      image: 'teachers/Ms_Shreyasi_Poddar.jpg'
    },
    {
      name: 'Mr. Ajay Mondal',
      designation: 'Drawing Teacher',
      image: 'teachers/Mr_Ajay_Mondal.jpg'
    },
    {
      name: 'Mr. Debasish Bannerjee',
      designation: 'Computer Teacher (IBM)',
      image: 'teachers/Mr_Debasish_Bannerjee.jpg'
    },
    {
      name: 'Mr. Surajit pal',
      designation: 'Commerece Teacher',
      image: 'teachers/Mr_Surajit_Pal.jpg'
    },
    {
      name: 'Ms. Priya Biswas',
      designation: 'Drawing Teacher',
      image: 'teachers/Ms_Priya_Biswas.png'
    },
    {
      name: 'Ms. Supriya Mistry',
      designation: 'Mehendi Teacher',
      image: 'teachers/Ms_Supriya_Mistry.jpg'
    },
    {
      name: 'Ms. Saheli Modak',
      designation: 'Drawing Teacher',
      image: 'teachers/Ms_Saheli_Modak.jpg'
    }
  ];

  currentSlide = 0;
  private slideInterval: any;

  // Make Math available in template
  Math = Math;

  constructor() { }

  ngOnInit(): void {
    this.startSlideShow();
  }

  ngOnDestroy(): void {
    this.stopSlideShow();
  }

  startSlideShow(): void {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopSlideShow(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.teachers.length;
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.teachers.length) % this.teachers.length;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  downloadPdf(): void {
    const pdfUrl = 'document/educare.pdf';
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'institution-profile.pdf';
    link.target = '_blank';
    link.click();
  }
}
