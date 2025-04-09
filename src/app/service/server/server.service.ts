import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Endpoints, GetBaseURL } from '../../endpoints/endpoints';

@Injectable({
  providedIn: 'root'
})

export class ServerService {
  constructor(private http: HttpClient) { }

  GetAllDashboardMasterData(): Observable<any> {
    return this.http.get<any>(GetBaseURL() + Endpoints.server.get_server_status);
  }
}
