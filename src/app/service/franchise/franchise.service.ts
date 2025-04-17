import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetBaseURL, Endpoints } from '../../endpoints/endpoints';

@Injectable({
  providedIn: 'root'
})
export class FranchiseService {
  constructor(private http: HttpClient) { }


}
