import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    protected baseUrl = environment.apiBozzi;

    constructor(protected http: HttpClient) { }
}