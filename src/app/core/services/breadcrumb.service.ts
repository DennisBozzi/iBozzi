import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BreadcrumbItem } from '@/shared/interfaces';

@Injectable({
    providedIn: 'root'
})
export class BreadcrumbService {
    private breadcrumbSubject = new BehaviorSubject<BreadcrumbItem[]>([]);
    public breadcrumb$ = this.breadcrumbSubject.asObservable();

    setBreadcrumb(items: BreadcrumbItem[]): void {
        this.breadcrumbSubject.next(items);
    }

    getBreadcrumb(): BreadcrumbItem[] {
        return this.breadcrumbSubject.value;
    }

    clearBreadcrumb(): void {
        this.breadcrumbSubject.next([]);
    }
}
