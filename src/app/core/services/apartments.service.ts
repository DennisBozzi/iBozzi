import { ApartmentResponse } from '@/interfaces/apartment-response.interface';
import { ApartmentTypeEnum } from '@/interfaces/enums/apartment-type.enum';
import { FloorEnum } from '@/interfaces/enums/floor.enum';
import { PagedResult } from '@/interfaces/paged-result.interface';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environments';
import { ApiService } from './api.service';

export interface CreateApartmentRequest {
  number: string;
  floor: FloorEnum;
  type: ApartmentTypeEnum;
  rentValue: number;
}

@Injectable({
  providedIn: 'root'
})

export class ApartmentsService extends ApiService {

  getApartments(): Observable<PagedResult<ApartmentResponse>> {
    return this.http.get<PagedResult<ApartmentResponse>>(`${environment.apiBozzi}/apartments?Page=1&PageSize=100`)
  }

  getAvailableApartments(page: number, pageSize: number, number: string): Observable<PagedResult<ApartmentResponse>> {
    return this.http.get<PagedResult<ApartmentResponse>>(`${environment.apiBozzi}/apartments/available?Page=${page}&PageSize=${pageSize}&Number=${number}`)
  }

  getApartmentByNumber(number: string): Observable<ApartmentResponse> {
    return this.http.get<ApartmentResponse>(`${environment.apiBozzi}/apartments/number/${number}`)
  }

  newApartment(apartment: CreateApartmentRequest): Observable<ApartmentResponse> {
    return this.http.post<ApartmentResponse>(`${environment.apiBozzi}/apartments`, apartment)
  }

  makeResponsible(apId: number, tenId: number): Observable<ApartmentResponse> {
    return this.http.put<ApartmentResponse>(`${environment.apiBozzi}/apartments/makeResponsible`, { apId, tenId })
  }

  removeResponsible(apId: number): Observable<ApartmentResponse> {
    return this.http.put<ApartmentResponse>(`${environment.apiBozzi}/apartments/removeResponsible`, apId)
  }
}
