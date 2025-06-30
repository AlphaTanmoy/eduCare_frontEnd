import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetBaseURL } from '../../endpoints/endpoints';

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {
  private baseUrl = GetBaseURL();

  constructor(private http: HttpClient) {}

  // YouTube Links
  getYouTubeLinks(): Observable<any> {
    return this.http.get(`${this.baseUrl}masterdata/get_yt_links`);
  }

  getYouTubeLinks_home(): Observable<any> {
    return this.http.get(`${this.baseUrl}masterdata/get_yt_links?limit=1`);
  }

  createYouTubeLink(linkHeading: string, ytLink: string): Observable<any> {
    return this.http.post(`${this.baseUrl}masterdata/create_yt_links`, {
      link_heading: linkHeading,
      yt_link: ytLink
    });
  }

  deleteYouTubeLink(linkId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}masterdata/delete_yt_links/${linkId}`, {});
  }

  // Brands
  getBrands(): Observable<any> {
    return this.http.get(`${this.baseUrl}masterdata/get_brands`);
  }

  getBrands_home(): Observable<any> {
    return this.http.get(`${this.baseUrl}masterdata/get_brands?limit=5`);
  }

  createBrand(brandName: string, description: string, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('brand_name', brandName);
    formData.append('description', description);
    formData.append('image', image);

    return this.http.post(`${this.baseUrl}masterdata/create_brands`, formData);
  }

  deleteBrand(brandId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}masterdata/delete_brands/${brandId}`, {});
  }

  // Notifications
  getNotifications(): Observable<any> {
    return this.http.get(`${this.baseUrl}masterdata/get_notifications`);
  }

  getNotifications_home(): Observable<any> {
    return this.http.get(`${this.baseUrl}masterdata/get_notifications?limit=5`);
  }

  createNotification(heading: string, message: string): Observable<any> {
    return this.http.post(`${this.baseUrl}masterdata/create_notifications`, {
      heading,
      message
    });
  }

  deleteNotification(notificationId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}masterdata/delete_notifications/${notificationId}`, {});
  }
}
