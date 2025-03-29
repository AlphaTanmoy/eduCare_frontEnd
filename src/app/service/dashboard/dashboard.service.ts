import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:4000/dashboard/get_dashboard_slideshow_images';

  constructor(private http: HttpClient) { }

  getImages(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
