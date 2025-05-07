import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MenuItems } from '../../constants/menuConstants'; // Import menu from the file

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  constructor() { }

  getMenuItems(): Observable<any[]> {
    return of(MenuItems); // Return the menu as an observable
  }
}
