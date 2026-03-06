import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environments';
import { ApiService } from './api.service';
import { FileModel } from '@/shared/interfaces';

@Injectable({
    providedIn: 'root'
})
export class FileService extends ApiService {
    getFileById(id: number): Observable<FileModel> {
        return this.http.get<FileModel>(`${environment.apiBozzi}/File/${id}`);
    }
}
