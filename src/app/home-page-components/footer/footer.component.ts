import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { 
  faFacebook, 
  faTwitter, 
  faLinkedin, 
  faInstagram 
} from '@fortawesome/free-brands-svg-icons';
import { loadBootstrap, removeBootstrap } from '../../../load-bootstrap';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear();
  
  // Icons
  faEnvelope = faEnvelope;
  faPhone = faPhone;
  faFacebook = faFacebook;
  faTwitter = faTwitter;
  faLinkedin = faLinkedin;
  faInstagram = faInstagram;

  // Developers information
  developers = [
    {
      id: 1,
      name: 'Tanmoy Das',
      designation: 'Software Developer',
      image: 'devs/tanmoy.jpeg',
      github: 'https://github.com/AlphaTanmoy',
      email: 'mailto:dtanmoy169@gmail.com'
    },
    {
      id: 2,
      name: 'Bhaskar Nandy',
      designation: 'Software Developer',
      image: 'devs/bhaskar.jpeg',
      github: 'https://github.com/bhaskar4k',
      email: 'mailto:bhaskar4k@gmail.com'
    }
  ];

  constructor() { }

  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
    ngOnInit() {
      this.bootstrapElements = loadBootstrap();
    }
  
    ngOnDestroy() {
      removeBootstrap(this.bootstrapElements);
    }
}
