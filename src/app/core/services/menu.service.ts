import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MenuService {
    private sidebarCollapsedSubject = new BehaviorSubject<boolean>(false);
    private mobileMenuOpenSubject = new BehaviorSubject<boolean>(false);
    private dataReloadedSubject = new Subject<void>();

    sidebarCollapsed$ = this.sidebarCollapsedSubject.asObservable();
    mobileMenuOpen$ = this.mobileMenuOpenSubject.asObservable();
    dataReloaded$ = this.dataReloadedSubject.asObservable();

    toggleSidebar() {
        const current = this.sidebarCollapsedSubject.value;
        this.sidebarCollapsedSubject.next(!current);
    }

    openMobileMenu() {
        this.sidebarCollapsedSubject.next(false);
        this.mobileMenuOpenSubject.next(true);
    }

    closeMobileMenu() {
        this.mobileMenuOpenSubject.next(false);
    }

    getSidebarCollapsed(): boolean {
        return this.sidebarCollapsedSubject.value;
    }

    getMobileMenuOpen(): boolean {
        return this.mobileMenuOpenSubject.value;
    }

    notifyDataReloaded(): void {
        this.dataReloadedSubject.next();
    }
}
