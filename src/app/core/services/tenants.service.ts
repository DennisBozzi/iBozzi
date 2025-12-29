import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '@/environments/environments';
import { PagedResult, TenantResponse } from '@/shared/interfaces';
import { GenderEnum } from '@/shared/interfaces/enums/gender.enum';

export interface CreateTenantRequest {
  firstName: string,
  lastName: string;
  cpf: string,
  email: string,
  born: string,
  phone: string,
  gender: GenderEnum
}

@Injectable({
  providedIn: 'root'
})

export class TenantService extends ApiService {

  getTenants(page: number, pageSize: number, nameCpf: string, active: boolean): Observable<PagedResult<TenantResponse>> {
    return this.http.get<PagedResult<TenantResponse>>(`${environment.apiBozzi}/tenant?Page=${page}&PageSize=${pageSize}&NameCpf=${nameCpf}&active=${active}`)
  }

  getTenantById(id: number): Observable<TenantResponse> {
    return this.http.get<TenantResponse>(`${environment.apiBozzi}/tenant/${id}`)
  }

  newTenant(request: CreateTenantRequest): Observable<TenantResponse> {
    return this.http.post<TenantResponse>(`${environment.apiBozzi}/tenant`, request)
  }

  getResponsibleTenants(page: number, pageSize: number, name: string): Observable<PagedResult<TenantResponse>> {
    return this.http.get<PagedResult<TenantResponse>>(`${environment.apiBozzi}/tenant/responsibles?Page=${page}&PageSize=${pageSize}&NameCpf=${name}`)
  }
}
