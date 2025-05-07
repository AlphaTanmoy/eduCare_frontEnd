import { Component } from '@angular/core';
import { loadBootstrap, removeBootstrap } from '../../../../load-bootstrap';
import { faUserPlus, faUserTag, faPhone, faHouseUser, faMailForward, faHotel, faSitemap, faGlobe, faHome, faSearchLocation, faLocationPinLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
@Component({
  selector: 'app-franchise-registration',
  imports: [FontAwesomeModule],
  templateUrl: './franchise-registration.component.html',
  styleUrl: './franchise-registration.component.css'
})


export class FranchiseRegistrationComponent {

  private bootstrapElements!: { css: HTMLLinkElement; js: HTMLScriptElement };
  faUserPlus = faUserPlus;
  faUserTag = faUserTag;
  faPhone = faPhone;
  faSitemap = faSitemap;
  faMailForward = faMailForward;
  faGlobe = faGlobe;
  faSearchLocation = faSearchLocation;
  faLocationPinLock = faLocationPinLock;
  faHome = faHome;
  faHotel = faHotel;
  faHouseUser = faHouseUser;
  ngOnInit(): void {
    this.bootstrapElements = loadBootstrap();
  }

  ngOnDestroy(): void {
    removeBootstrap(this.bootstrapElements);
  }
}
