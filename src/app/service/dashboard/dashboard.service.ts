import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { GetBaseURL, Endpoints } from '../../endpoints/endpoints';

@Injectable({
  providedIn: 'root'
})

export class DashboardService {
  private masterDataCache$: Observable<any> | null = null;

  constructor(private http: HttpClient) { }

  getAllDashboardSlideshowImages(): Observable<any> {
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

  getAllDashboardMasterData(forceRefresh: boolean = false): Observable<any> {
    if (!this.masterDataCache$ || forceRefresh) {
      this.masterDataCache$ = this.http.get<any>(
        GetBaseURL() + Endpoints.dashboard.get_dashboard_master_data
      ).pipe(shareReplay(1));
    }
    return this.masterDataCache$;
  }

  updateDashboardMasterData(data: any): Observable<any> {
    this.masterDataCache$ = null;
    return this.http.post<any>(GetBaseURL() + Endpoints.dashboard.update_dashboard_master_data, data);
  }
}
