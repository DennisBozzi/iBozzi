import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '@/environments/environments';

@Injectable({
  providedIn: 'root'
})

export class DemoService extends ApiService {
  realodData(): Observable<any> {
    return this.http.post<any>(`${environment.apiBozzi}/Demo/resetDemo`, {})
  }
}
