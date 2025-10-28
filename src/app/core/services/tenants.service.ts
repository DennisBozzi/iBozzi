import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '@/environments/environments';
import { PagedResult, TenantResponse } from '@/shared/interfaces';

export interface CreateTenantRequest {
  firstName: string,
  lastName: string;
  cpf: string,
  email: string,
  born: string,
  phone: string,
  responsibleTenantId: number,
  apartmentId: number
}

@Injectable({
  providedIn: 'root'
})

export class TenantService extends ApiService {

  getTenants(page: number, pageSize: number, name: string, onlyRented: boolean): Observable<PagedResult<TenantResponse>> {
    return this.http.get<PagedResult<TenantResponse>>(`${environment.apiBozzi}/tenants?Page=${page}&PageSize=${pageSize}&NameCpf=${name}&OnlyRented=${onlyRented}`)
  }

  getResponsibleTenants(page: number, pageSize: number, name: string): Observable<PagedResult<TenantResponse>> {
    return this.http.get<PagedResult<TenantResponse>>(`${environment.apiBozzi}/tenants/responsibles?Page=${page}&PageSize=${pageSize}&NameCpf=${name}`)
  }

  getTenant(id: number): Observable<TenantResponse> {
    return this.http.get<TenantResponse>(`${environment.apiBozzi}/tenants/${id}`)
  }

  addTenant(request: CreateTenantRequest): Observable<TenantResponse> {
    return this.http.post<TenantResponse>(`${environment.apiBozzi}/tenants`, request)
  }
}
