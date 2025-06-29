import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetBaseURL, Endpoints } from '../../endpoints/endpoints';

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {
  private baseUrl = GetBaseURL();
  private openEndpoints = {
    getYtLinks: `${this.baseUrl}${Endpoints.masterdata.getYtLink}`,
    getBrands: `${this.baseUrl}${Endpoints.masterdata.getBrands}`,
    getNotifications: `${this.baseUrl}${Endpoints.masterdata.getNotification}`
  };

  private protectedEndpoints = {
    createYtLink: `${this.baseUrl}${Endpoints.masterdata.createYtLink}`,
    deleteYtLink: `${this.baseUrl}${Endpoints.masterdata.deleteYtLink}`,
    createBrand: `${this.baseUrl}${Endpoints.masterdata.createBrand}`,
    deleteBrand: `${this.baseUrl}${Endpoints.masterdata.deleteBrand}`,
    createNotification: `${this.baseUrl}${Endpoints.masterdata.createNotification}`,
    deleteNotification: `${this.baseUrl}${Endpoints.masterdata.deleteNotification}`
  };

  constructor(private http: HttpClient) { }

  // YouTube Links
  getYouTubeLinks(): Observable<any> {
    return this.http.get(this.openEndpoints.getYtLinks);
  }

  getYouTubeLinks_home(): Observable<any> {
    return this.http.get(`${this.openEndpoints.getYtLinks}?limit=5`);
  }

  createYouTubeLink(linkHeading: string, ytLink: string): Observable<any> {
    return this.http.post(this.protectedEndpoints.createYtLink, {
      link_heading: linkHeading,
      yt_link: ytLink
    });
  }

  deleteYouTubeLink(linkId: string): Observable<any> {
    return this.http.delete(`${this.protectedEndpoints.deleteYtLink}/${linkId}`);
  }

  // Brands
  getBrands(): Observable<any> {
    return this.http.get(this.openEndpoints.getBrands);
  }

  getBrands_home(): Observable<any> {
    return this.http.get(`${this.openEndpoints.getBrands}?limit=5`);
  }

  createBrand(brandName: string, description: string, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('brand_name', brandName);
    formData.append('description', description);
    formData.append('image', image);

    return this.http.post(this.protectedEndpoints.createBrand, formData);
  }

  deleteBrand(brandId: string): Observable<any> {
    return this.http.delete(`${this.protectedEndpoints.deleteBrand}/${brandId}`);
  }

  // Notifications
  getNotifications(): Observable<any> {
    return this.http.get(this.openEndpoints.getNotifications);
  }

  getNotifications_home(): Observable<any> {
    return this.http.get(`${this.openEndpoints.getNotifications}?limit=5`);
  }

  createNotification(heading: string, message: string): Observable<any> {
    return this.http.post(this.protectedEndpoints.createNotification, {
      heading,
      message
    });
  }

  deleteNotification(notificationId: string): Observable<any> {
    return this.http.delete(`${this.protectedEndpoints.deleteNotification}/${notificationId}`);
  }
}
