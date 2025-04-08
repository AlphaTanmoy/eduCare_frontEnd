import { Component, OnInit, OnDestroy } from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../../../load-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-master-details',
  imports: [FormsModule],
  templateUrl: './master-details.component.html',
  styleUrl: './master-details.component.css'
})

export class MasterDetailsComponent implements OnInit, OnDestroy {
  email: string = "1";
  phone1: string = "2";
  phone2: string = "2";
  facebook: string = "3";
  youtube: string = "4";
  whatsapp: string = "5";
  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };

  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }

  saveEmail(): void {
    console.log("email", this.email);
  }

  savePhone(phoneType: string): void {
    console.log("phone1", this.phone1);
    console.log("phone2", this.phone2);
  }

  saveFacebook(): void {
    console.log("facebook", this.facebook);
  }

  saveYoutube(): void {
    console.log("youtube", this.youtube);
  }

  saveWhatsapp(): void {
    console.log("whatsapp", this.whatsapp);
  }
}
