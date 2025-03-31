import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetBaseURL, Endpoints } from '../../endpoints/endpoints';

@Injectable({
  providedIn: 'root'
})

export class DashboardService {
  constructor(private http: HttpClient) { }

  getAllImages(): Observable<any> {
    return this.http.get<any>(GetBaseURL() + Endpoints.dashboard.get_dashboard_slideshow_images);
  }

  getImageStream(fileId: string): Observable<any> {
    return this.http.get(GetBaseURL() + Endpoints.dashboard.get_image_stream_by_id + "/" + fileId, { responseType: 'blob' });
  }

  uploadDashboardSlideshowImageFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<any>(GetBaseURL() + Endpoints.dashboard.upload_dashboard_slideshow_image, formData);
  }

  deleteDashboardSlideshowImageFile(fileId: string): Observable<any> {
    return this.http.post<any>(GetBaseURL() + Endpoints.dashboard.delete_dashboard_slideshow_image, { fileId });
  }
}
