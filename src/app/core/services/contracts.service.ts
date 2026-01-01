import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '@/environments/environments';
import { ContractModelFillRequest, ContractModelResponse } from '@/shared/interfaces';

@Injectable({
    providedIn: 'root'
})
export class ContractsService extends ApiService {

    uploadContractModel(file: File): Observable<ContractModelResponse> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<ContractModelResponse>(`${environment.apiBozzi}/contract/model`, formData);
    }

    getContractModel(): Observable<ContractModelResponse> {
        return this.http.get<ContractModelResponse>(`${environment.apiBozzi}/contract/model`);
    }

    fillContractModel(values: Record<string, string>): Observable<Blob> {
        const request: ContractModelFillRequest = { values };
        return this.http.post(`${environment.apiBozzi}/contract/model/example`, request, {
            responseType: 'blob'
        });
    }
}
