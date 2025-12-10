import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environments';
import { ApiService } from './api.service';
import { FloorEnum, UnitType, PagedResult, UnitResponse } from '@/shared/interfaces';

export interface CreateUnitRequest {
  number: string;
  floor: FloorEnum;
  type: UnitType;
  rentValue: number;
}

@Injectable({
  providedIn: 'root'
})

export class UnitsService extends ApiService {

  getUnits(): Observable<PagedResult<UnitResponse>> {
    return this.http.get<PagedResult<UnitResponse>>(`${environment.apiBozzi}/unit?Page=1&PageSize=100`)
  }

  getAvailableUnits(page: number, pageSize: number, number: string): Observable<PagedResult<UnitResponse>> {
    return this.http.get<PagedResult<UnitResponse>>(`${environment.apiBozzi}/units/available?Page=${page}&PageSize=${pageSize}&Number=${number}`)
  }

  getUnitByNumber(number: string): Observable<UnitResponse> {
    return this.http.get<UnitResponse>(`${environment.apiBozzi}/units/number/${number}`)
  }

  newUnit(unit: CreateUnitRequest): Observable<UnitResponse> {
    return this.http.post<UnitResponse>(`${environment.apiBozzi}/units`, unit)
  }

  makeResponsible(apId: number, tenId: number): Observable<UnitResponse> {
    return this.http.put<UnitResponse>(`${environment.apiBozzi}/units/makeResponsible`, { apId, tenId })
  }

  removeResponsible(apId: number): Observable<UnitResponse> {
    return this.http.put<UnitResponse>(`${environment.apiBozzi}/units/removeResponsible`, apId)
  }
}
